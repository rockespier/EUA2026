# Publicar-Eua.ps1

Build → tests → publish → zip → scp → detener pools → descomprimir → iniciar pools, para backend (`webapi.euroamericanassistance.com`) y frontend (`sistema.euroamericanassistance.com`).

```powershell
./tools/Deploy/Publicar-Eua.ps1              # flujo completo
./tools/Deploy/Publicar-Eua.ps1 -SoloLocal   # sin tocar el servidor (build, tests, publish, zips)
```

Parámetros: `-Servidor` (161.132.56.79), `-Usuario` (rramos), `-CarpetaPub` (`C:\Pub`), `-SoloLocal`.

- Requiere PowerShell 7 y el SDK de .NET.
- Si falla un build o un test, no se publica nada.
- **Borra el contenido** de `C:\Pub\EuaBack2026` y `C:\Pub\EuaFront2026` antes de publicar.
- Los zips no incluyen los archivos de configuración del servidor, así que en el destino se conservan los existentes:
  - Backend: `appsettings*.json`, `log4net.config`, `web.config`.
  - Frontend: `appsettings.json`, `appsettings.Development.json`, `web.config`.
- La descompresión sobrescribe archivos pero no borra los que ya no existen en el publish.
- Si falla la descompresión, los pools se vuelven a iniciar igual.

## Autenticación SSH (llave pública, sin contraseña en el script)

Una sola vez, en tu PC:

```powershell
ssh-keygen -t ed25519 -f "$env:USERPROFILE\.ssh\id_ed25519"   # pon una passphrase
Get-Service ssh-agent | Set-Service -StartupType Automatic
Start-Service ssh-agent
ssh-add "$env:USERPROFILE\.ssh\id_ed25519"                    # pide la passphrase una vez
```

Copiar la llave pública al servidor (pide tu contraseña de SSH por última vez). Como `rramos` es administrador del servidor, OpenSSH para Windows lee `administrators_authorized_keys`:

```powershell
$pub = (Get-Content "$env:USERPROFILE\.ssh\id_ed25519.pub" -Raw).Trim()
$f = 'C:\ProgramData\ssh\administrators_authorized_keys'
$remoto = "Add-Content -Encoding ascii '$f' '$pub'; icacls '$f' /inheritance:r /grant '*S-1-5-32-544:F' /grant '*S-1-5-18:F'"
$enc = [Convert]::ToBase64String([Text.Encoding]::Unicode.GetBytes($remoto))
ssh rramos@161.132.56.79 "powershell -NoProfile -EncodedCommand $enc"
```

(Se envía codificado en base64 para evitar problemas de comillas entre PowerShell local, la shell remota y PowerShell remoto).

(Los SIDs son Administradores y SYSTEM, para que funcione en Windows en cualquier idioma. Si el usuario no fuera administrador, la llave iría en `C:\Users\rramos\.ssh\authorized_keys`, pero detener pools de IIS requiere administrador).

Probar (no debe pedir contraseña):

```powershell
ssh rramos@161.132.56.79 hostname
```
