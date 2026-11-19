#Requires -Version 7
<#
.SYNOPSIS
    Compila, prueba, publica y despliega backend y frontend de EUA2026 en el servidor IIS.

.DESCRIPTION
    1. Build backend y frontend (Release).
    2. Ejecuta los tests de ambas soluciones. Si alguno falla, se detiene.
    3. Publica en C:\Pub\EuaBack2026 y C:\Pub\EuaFront2026.
    4. Genera EuaBack2026.zip / EuaFront2026.zip sin los archivos de configuración del servidor.
    5. Copia los zips por scp, detiene los pools, descomprime sobre el sitio y vuelve a levantar los pools.

    La autenticación SSH usa llave pública (ver tools/Deploy/README.md). El script no maneja contraseñas.

.EXAMPLE
    ./tools/Deploy/Publicar-Eua.ps1             # todo el flujo
    ./tools/Deploy/Publicar-Eua.ps1 -SoloLocal  # build + tests + publish + zips, sin tocar el servidor
#>
[CmdletBinding()]
param(
    [string]$Servidor = '161.132.56.79',
    [string]$Usuario = 'rramos',
    [string]$CarpetaPub = 'C:\Pub',
    [switch]$SoloLocal
)

$ErrorActionPreference = 'Stop'
$repo = (Resolve-Path (Join-Path $PSScriptRoot '..\..')).Path

$back = @{
    Nombre    = 'Backend'
    Solucion  = "$repo\source\backend\BackAssistanceTravelers\BackAssistanceTravelers.sln"
    Proyecto  = "$repo\source\backend\BackAssistanceTravelers\BackAssistanceTravelers.ApiTravel\BackAssistanceTravelers.ApiTravel.csproj"
    Publicar  = Join-Path $CarpetaPub 'EuaBack2026'
    Zip       = 'EuaBack2026.zip'
    Excluir   = @('appsettings.Development.json', 'appsettings.json', 'appsettings.Production.json', 'log4net.config', 'web.config')
    Pool      = 'webapi.euroamericanassistance.com'
    RutaIIS   = 'C:/inetpub/wwwroot/webapi.euroamericanassistance.com'
}
$front = @{
    Nombre    = 'Frontend'
    Solucion  = "$repo\source\frontend\FrontAssistanceTravelers\FrontAssistanceTravelers.sln"
    Proyecto  = "$repo\source\frontend\FrontAssistanceTravelers\FrontAssistanceTravelers.WebTravel\FrontAssistanceTravelers.WebTravel.csproj"
    Publicar  = Join-Path $CarpetaPub 'EuaFront2026'
    Zip       = 'EuaFront2026.zip'
    Excluir   = @('appsettings.Development.json', 'appsettings.json', 'web.config')
    Pool      = 'sistema.euroamericanassistance.com'
    RutaIIS   = 'C:/inetpub/wwwroot/sistema.euroamericanassistance.com'
}
$apps = @($back, $front)

function Write-Paso([string]$Texto) {
    Write-Host "`n==> $Texto" -ForegroundColor Cyan
}

# Ejecuta un comando nativo y corta el script si devuelve código distinto de 0.
function Invoke-Nativo([string]$Descripcion, [scriptblock]$Comando) {
    & $Comando
    if ($LASTEXITCODE -ne 0) {
        throw "$Descripcion falló (código $LASTEXITCODE)."
    }
}

# 1-2. Build
foreach ($app in $apps) {
    Write-Paso "Build $($app.Nombre)"
    Invoke-Nativo "Build $($app.Nombre)" { dotnet build $app.Solucion -c Release --nologo }
}

# 3. Tests (si alguno falla, Invoke-Nativo detiene el script antes de publicar)
foreach ($app in $apps) {
    Write-Paso "Tests $($app.Nombre)"
    Invoke-Nativo "Tests $($app.Nombre)" { dotnet test $app.Solucion -c Release --no-build --nologo }
}

# 4. Publish (se limpia la carpeta para no arrastrar archivos ni zips anteriores)
foreach ($app in $apps) {
    Write-Paso "Publish $($app.Nombre) -> $($app.Publicar)"
    if (Test-Path $app.Publicar) {
        Get-ChildItem $app.Publicar -Force | Remove-Item -Recurse -Force
    }
    Invoke-Nativo "Publish $($app.Nombre)" { dotnet publish $app.Proyecto -c Release --no-build --nologo -o $app.Publicar }
}

# 5-6. Zips sin los archivos de configuración propios del servidor
foreach ($app in $apps) {
    $zip = Join-Path $app.Publicar $app.Zip
    Write-Paso "Zip $zip"
    $items = Get-ChildItem $app.Publicar -Force | Where-Object { $app.Excluir -notcontains $_.Name }
    Compress-Archive -Path $items.FullName -DestinationPath $zip -CompressionLevel Optimal -Force
}

if ($SoloLocal) {
    Write-Host "`n-SoloLocal: zips generados, no se tocó el servidor." -ForegroundColor Yellow
    return
}

$destino = "$Usuario@$Servidor"

# 7-8. Copia por scp
foreach ($app in $apps) {
    Write-Paso "scp $($app.Nombre) -> $destino"
    $origen = Join-Path $app.Publicar $app.Zip
    Invoke-Nativo "scp $($app.Nombre)" { scp $origen "${destino}:$($app.RutaIIS)/$($app.Zip)" }
}

# 9-11. En el servidor: detener pools, descomprimir, levantar pools.
# Los pools se levantan en 'finally' para que el sitio no quede caído si falla la descompresión.
# Sin TTY, PowerShell remoto serializa progreso/Write-Host como CLIXML: se usa Write-Output y se silencia el progreso.
$sitios = ($apps | ForEach-Object { "@{Pool='$($_.Pool)';Ruta='$($_.RutaIIS)';Zip='$($_.RutaIIS)/$($_.Zip)'}" }) -join ','
$remoto = @"
`$ErrorActionPreference = 'Stop'
`$ProgressPreference = 'SilentlyContinue'
`$fallo = `$false
Import-Module WebAdministration
`$sitios = @($sitios)
try {
    foreach (`$s in `$sitios) {
        if ((Get-WebAppPoolState -Name `$s.Pool).Value -ne 'Stopped') { Stop-WebAppPool -Name `$s.Pool }
        `$t = 0
        while ((Get-WebAppPoolState -Name `$s.Pool).Value -ne 'Stopped') {
            if (`$t -ge 60) { throw "El pool `$(`$s.Pool) no se detuvo en 60 s." }
            Start-Sleep -Seconds 1; `$t++
        }
        Write-Output "Pool detenido: `$(`$s.Pool)"
    }
    foreach (`$s in `$sitios) {
        Expand-Archive -Path `$s.Zip -DestinationPath `$s.Ruta -Force
        Write-Output "Descomprimido: `$(`$s.Zip)"
    }
}
catch {
    Write-Output "ERROR: `$(`$_.Exception.Message)"
    `$fallo = `$true
}
finally {
    foreach (`$s in `$sitios) {
        Start-WebAppPool -Name `$s.Pool
        Write-Output "Pool iniciado: `$(`$s.Pool) -> `$((Get-WebAppPoolState -Name `$s.Pool).Value)"
    }
}
if (`$fallo) { exit 1 }
"@

Write-Paso "Despliegue remoto en $Servidor (detener pools, descomprimir, iniciar pools)"
$codificado = [Convert]::ToBase64String([Text.Encoding]::Unicode.GetBytes($remoto))
Invoke-Nativo 'Despliegue remoto' { ssh $destino "powershell -NoProfile -NonInteractive -EncodedCommand $codificado" }

Write-Host "`nDespliegue completado." -ForegroundColor Green
