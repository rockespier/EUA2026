# SpExporter

Herramienta de línea de comandos (solo lectura) que extrae la definición de todos los stored
procedures de una base de datos SQL Server y genera el material base para
`documentacion/stored-procedures/`.

## Requisitos

- .NET 8 SDK (ya requerido por el resto del repo).
- Acceso de lectura a la BD (permiso para consultar `sys.procedures`, `sys.sql_modules`,
  `sys.parameters` — típicamente cualquier login con `VIEW DEFINITION` alcanza).

## Uso

```bash
# la cadena de conexión NO debe quedar en el historial de shell si es posible: usar la env var
export SP_EXPORTER_CONNECTION_STRING="Server=...;Database=...;User Id=...;Password=...;TrustServerCertificate=true;"

dotnet run --project tools/StoredProcedureDocs/SpExporter -- \
  --known-procedures documentacion/stored-procedures/known-procedures.txt \
  --out documentacion/stored-procedures
```

En PowerShell:

```powershell
$env:SP_EXPORTER_CONNECTION_STRING = "Server=p1427.use1.mysecurecloudhost.com;Database=euroamer_bd_2025;User Id=euroamer_admin_2008;Password=2008SqlAdmin!;TrustServerCertificate=true;"

dotnet run --project tools/StoredProcedureDocs/SpExporter -- --known-procedures documentacion/stored-procedures/known-procedures.txt --out documentacion/stored-procedures
```

## Qué genera

- `documentacion/stored-procedures/sql/<Schema>.<NombreSP>.sql` — un archivo por SP, con la
  definición real y un encabezado con fechas y parámetros.
- `documentacion/stored-procedures/manifest.csv` — metadata de todos los SPs encontrados en la BD.
- `documentacion/stored-procedures/coverage-report.md` — diferencias entre lo que el código
  referencia (`known-procedures.txt`) y lo que existe en la BD.

No escribe nada en la base de datos. No commitear la cadena de conexión en ningún archivo.
