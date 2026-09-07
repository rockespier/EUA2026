<#
.SYNOPSIS
    Automatiza el paso mecánico de documentar un SP: copia _template.md a
    docs/<Dominio>/<Nombre>.md por cada .sql extraído por SpExporter, completando
    la metadata leyendo el propio .sql (y catalogo.md para dominio/repositorio).

.DESCRIPTION
    Por cada archivo en documentacion/stored-procedures/sql/<Schema>.<Nombre>.sql:
      - Lee el encabezado que escribe SpExporter (fechas, parámetros, si está
        referenciado por el backend) y arma la tabla de parámetros.
      - Cruza con catalogo.md para obtener Dominio y Repositorio.Método(s).
      - Detecta (best-effort, con regex) las tablas referenciadas en el cuerpo
        del SP para pre-llenar "Tablas y objetos referenciados" — SIEMPRE
        marcado para verificar a mano, no reemplaza leer el .sql.
      - Infiere el "Tipo de operación" por convención de nombre (_Obtener/_Listar
        = Lectura, _Procesar/_Actualizar/_Eliminar/_Anular = Escritura).
      - Escribe documentacion/stored-procedures/docs/<Dominio>/<Nombre>.md.

    NO escribe las secciones de negocio (Propósito, Lógica de negocio, Riesgos,
    etc.) — esas requieren criterio humano leyendo el .sql real; quedan con el
    texto guía del template para completar a mano.

    No pisa un .md ya existente salvo -Force, así no se pierde lo ya documentado
    a mano. Al final actualiza el check (☐/☑) de "Documentado" en catalogo.md
    según qué .md existan realmente en docs/.

.PARAMETER Force
    Regenera también los .md que ya existen (pierde ediciones manuales previas).

.EXAMPLE
    ./tools/StoredProcedureDocs/New-ProcedureDocs.ps1

.EXAMPLE
    ./tools/StoredProcedureDocs/New-ProcedureDocs.ps1 -Only Pais_Obtener,Venta_Procesar
#>
[CmdletBinding()]
param(
    [string]$SqlDir      = (Join-Path $PSScriptRoot "..\..\documentacion\stored-procedures\sql"),
    [string]$CatalogoPath = (Join-Path $PSScriptRoot "..\..\documentacion\stored-procedures\catalogo.md"),
    [string]$TemplatePath = (Join-Path $PSScriptRoot "..\..\documentacion\stored-procedures\_template.md"),
    [string]$DocsRoot    = (Join-Path $PSScriptRoot "..\..\documentacion\stored-procedures\docs"),
    [string[]]$Only,
    [switch]$Force
)

$ErrorActionPreference = "Stop"

if (-not (Test-Path $SqlDir))      { throw "No existe '$SqlDir'. Correr primero SpExporter." }
if (-not (Test-Path $TemplatePath)) { throw "No existe la plantilla '$TemplatePath'." }

$template = Get-Content $TemplatePath -Raw

# --- 1) Parsear catalogo.md: SPName -> { Dominio, RepoMetodo } ---
$catalog = @{}
if (Test-Path $CatalogoPath) {
    foreach ($line in Get-Content $CatalogoPath) {
        if ($line -notmatch '^\|\s*`') { continue }  # solo filas de datos (empiezan con "| `")
        $cells = ($line.Trim().Trim('|') -split '\|') | ForEach-Object { $_.Trim() }
        if ($cells.Count -lt 4) { continue }
        $spName = $cells[0].Trim('`')
        $catalog[$spName] = [pscustomobject]@{
            Dominio     = $cells[1]
            RepoMetodo  = $cells[2]
        }
    }
    Write-Host "catalogo.md: $($catalog.Count) SPs indexados." -ForegroundColor DarkGray
} else {
    Write-Warning "No existe '$CatalogoPath' — Dominio/Repositorio quedarán como 'SinClasificar'."
}

function Get-TipoOperacion {
    param([string]$Name)
    if ($Name -match '(?i)(_Obtener|_Listar|_Detalle|Reporte|_Buscar)') { return "Lectura" }
    if ($Name -match '(?i)(_Procesar|_Actualizar|_Eliminar|_Anular|_Generar|_Validar)') { return "Escritura" }
    return "Revisar (no se pudo inferir del nombre)"
}

function Get-ReferencedTables {
    param([string]$SqlBody)
    $pattern = '(?i)\b(?:FROM|JOIN|UPDATE|INSERT\s+INTO|DELETE\s+FROM)\s+\[?([A-Za-z0-9_]+)\]?\.?\[?([A-Za-z0-9_]*)\]?'
    $matches = [regex]::Matches($SqlBody, $pattern)
    $tables = New-Object System.Collections.Generic.List[string]
    foreach ($m in $matches) {
        $t = if ($m.Groups[2].Value) { "$($m.Groups[1].Value).$($m.Groups[2].Value)" } else { $m.Groups[1].Value }
        if ($t -notmatch '(?i)^(SELECT|BEGIN|dbo)$') { $tables.Add($t) }
    }
    return ($tables | Sort-Object -Unique)
}

$sqlFiles = Get-ChildItem -Path $SqlDir -Filter "*.sql"
if ($Only) {
    $sqlFiles = $sqlFiles | Where-Object { $Only -contains ($_.BaseName -replace '^[^.]+\.', '') }
}

$created = 0; $skipped = 0; $noCatalog = 0

foreach ($file in $sqlFiles) {
    if ($file.BaseName -notmatch '^(?<schema>[^.]+)\.(?<name>.+)$') {
        Write-Warning "No se pudo parsear schema.nombre de '$($file.Name)', se omite."
        continue
    }
    $schema = $Matches.schema
    $name   = $Matches.name

    $content = Get-Content $file.FullName -Raw

    $createDate = if ($content -match '-- Creado en BD:\s*(.+)') { $Matches[1].Trim() } else { "N/D" }
    $modifyDate = if ($content -match '-- Modificado en BD:\s*(.+)') { $Matches[1].Trim() } else { "N/D" }
    $referenced = ($content -match '-- Referenciado por el backend \.NET:\s*SI')

    $paramLines = [regex]::Matches($content, '(?m)^--\s+(@\w+)\s+(\S+)\s+\((IN|OUTPUT)\)')
    $paramRows = if ($paramLines.Count -gt 0) {
        ($paramLines | ForEach-Object { "| ``$($_.Groups[1].Value)`` | ``$($_.Groups[2].Value)`` | $($_.Groups[3].Value) | | |" }) -join "`n"
    } else { "| _(sin parámetros)_ | | | | |" }

    $catEntry = $catalog[$name]
    $dominioRaw = if ($catEntry) { $catEntry.Dominio } else { "SinClasificar" }
    $primerDominio = ($dominioRaw -split ',')[0].Trim() -replace '[\\/:*?"<>|]', '-'
    if (-not $primerDominio) { $primerDominio = "SinClasificar" }
    $repoMetodoRaw = if ($catEntry) { $catEntry.RepoMetodo } else {
        $noCatalog++
        if ($referenced) { "_(en catalogo.md no aparece con este nombre exacto — revisar)_" }
        else { "_(no detectado en source/backend — no referenciado en el código analizado)_" }
    }
    $repoMetodo = $repoMetodoRaw -replace '`', ''
    $repoNombre = if ($catEntry) { (($catEntry.RepoMetodo -split ',')[0].Trim('`') -split '\.')[0] } else { "N/D" }

    # Cuerpo del SP sin el bloque de comentarios de encabezado, para detectar tablas
    $bodyStart = $content.IndexOf("`n`n")
    $body = if ($bodyStart -ge 0) { $content.Substring($bodyStart) } else { $content }
    $tables = Get-ReferencedTables -SqlBody $body
    $tableRows = if ($tables.Count -gt 0) {
        ($tables | ForEach-Object { "| ``$_`` | ? | ? | _(auto-detectado — verificar contra el .sql)_ |" }) -join "`n"
    } else { "| _(no se detectaron automáticamente — revisar el .sql a mano)_ | | | |" }

    $outDir = Join-Path $DocsRoot $primerDominio
    $outPath = Join-Path $outDir "$name.md"

    if ((Test-Path $outPath) -and -not $Force) {
        $skipped++
        continue
    }

    $today = Get-Date -Format "yyyy-MM-dd"
    $doc = $template `
        -replace 'sql/<Schema>\.<NombreSP>\.sql', "../../sql/$schema.$name.sql" `
        -replace '<Schema>\.<NombreSP>', "$schema.$name" `
        -replace '<Venta / Cobranza / Agencia / \.\.\.>', $dominioRaw `
        -replace '<XxxRepository\.cs>', "$repoNombre.cs" `
        -replace '<Metodo1>, <Metodo2>', $repoMetodo `
        -replace '<Lectura / Escritura / Lectura\+Escritura / Reporte>', (Get-TipoOperacion -Name $name) `
        -replace '<yyyy-MM-dd HH:mm:ss>', $modifyDate `
        -replace '<yyyy-MM-dd>', $today `
        -replace '<nombre>', "script (New-ProcedureDocs.ps1)"

    # Tabla de parámetros: reemplaza la fila de ejemplo del template
    $doc = $doc -replace '\| `@pXxx_Id` \| `int` \| IN \| Sí/No \| \.\.\. \|', $paramRows
    # Tabla de tablas/vistas: reemplaza la fila de ejemplo del template
    $doc = $doc -replace '\| `dbo\.Venta` \| Sí \| Sí \| \.\.\. \|', $tableRows

    New-Item -ItemType Directory -Force -Path $outDir | Out-Null
    Set-Content -Path $outPath -Value $doc -Encoding UTF8
    $created++
}

Write-Host ""
Write-Host "Docs creados: $created" -ForegroundColor Green
Write-Host "Ya existian (sin tocar, usar -Force para regenerar): $skipped" -ForegroundColor Yellow
if ($noCatalog -gt 0) {
    Write-Warning "$noCatalog SPs no tenian entrada en catalogo.md (Repositorio/Metodo sin resolver)."
}

# --- Actualizar checkbox "Documentado" en catalogo.md contra lo que hay en docs/ ---
if (Test-Path $CatalogoPath) {
    $documented = Get-ChildItem -Path $DocsRoot -Recurse -Filter "*.md" -ErrorAction SilentlyContinue |
        ForEach-Object { $_.BaseName }
    $documentedSet = New-Object System.Collections.Generic.HashSet[string]([string[]]$documented, [System.StringComparer]::OrdinalIgnoreCase)

    $lines = Get-Content $CatalogoPath
    $updated = for ($i = 0; $i -lt $lines.Count; $i++) {
        $line = $lines[$i]
        if ($line -match '^\|\s*`([^`]+)`') {
            $spName = $Matches[1]
            $mark = if ($documentedSet.Contains($spName)) { "☑" } else { "☐" }
            $line = $line -replace '(☐|☑)\s*\|\s*$', "$mark |"
        }
        $line
    }
    Set-Content -Path $CatalogoPath -Value $updated -Encoding UTF8
    Write-Host "catalogo.md actualizado ($($documentedSet.Count) SPs marcados como documentados)." -ForegroundColor Green
}
