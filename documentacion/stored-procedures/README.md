# Documentación de Stored Procedures

Este directorio es el catálogo de referencia de todos los stored procedures de SQL Server
que usa el backend (`BackAssistanceTravelers.Repositories.Dapper`). El código fuente de los
SPs vive en la base de datos, no en este repositorio, así que aquí mantenemos una copia
extraída (versionada) + la documentación funcional/técnica de cada uno.

## Por qué existe esto

- Los SPs contienen buena parte de la lógica de negocio del sistema (ver `CLAUDE.md`: "no hay
  capa de servicios, la lógica vive en los repositorios Dapper (SQL) o en los controllers").
  Sin esto, esa lógica es invisible en el repositorio y en cualquier revisión de código.
- Permite detectar drift: un SP se modifica directo en producción y el repo se entera.
- Permite detectar SPs huérfanos (ya no llamados desde el código) y candidatos a limpieza.

## Estructura

```
documentacion/stored-procedures/
  README.md                 este archivo
  _template.md              plantilla para documentar un SP
  known-procedures.txt      inventario de SPs referenciados por el código (fuente: análisis estático)
  catalogo.md               tabla maestra: SP -> dominio -> repositorio/método -> estado de doc
  sql/                      código fuente extraído de cada SP (generado por la herramienta, NO editar a mano)
  docs/<Dominio>/*.md       documentación funcional de cada SP (una por SP, a mano, basada en _template.md)
  manifest.csv              metadata generada en la última extracción (fechas, cantidad de parámetros, etc.)
  coverage-report.md        generado: SPs sin match entre código y BD (faltantes / huérfanos)
```

`<Dominio>` agrupa por el repositorio .NET que lo llama (`Venta`, `Cobranza`, `Agencia`,
`Producto`, `Usuario`, `Solicitud`, `Reporte`, `Promocion`, `Permiso`, `Perfil`, `Pasajero`,
`Pais`, `Menu`, `Grafico`, `General`, `DashBoardJefe`, `Valor`), no por schema de SQL Server
(en la práctica casi todo vive en `dbo`).

## Flujo de trabajo

1. **Inventario (estático, ya hecho)**: `known-procedures.txt` y `catalogo.md` listan los
   **173 stored procedures únicos** (180 sitios de llamada) referenciados desde
   `Repositories.Dapper`, obtenidos leyendo el código (no la BD) el 2026-09-07. Si se
   agregan/quitan llamadas a SPs en el backend, regenerar ambos archivos (ver `catalogo.md`
   para el mapeo completo SP -> dominio -> método -> estado de documentación).

2. **Extracción (contra la BD, requiere credenciales)**: correr la herramienta
   `tools/StoredProcedureDocs/SpExporter` (ver README de la herramienta) contra el ambiente que
   corresponda. Esto escribe:
   - `sql/<Schema>.<NombreSP>.sql` — definición real (`CREATE/ALTER PROCEDURE ...`) tal cual está en la BD.
   - `manifest.csv` — metadata (fechas de creación/modificación, cantidad de parámetros).
   - `coverage-report.md` — SPs referenciados en código pero ausentes en BD, y viceversa.

   Es de solo lectura (consulta `sys.procedures` / `sys.sql_modules` / `sys.parameters`), no
   modifica la base de datos.

3. **Documentar**: por cada SP en `sql/`, crear/actualizar `docs/<Dominio>/<NombreSP>.md` a partir
   de `_template.md`, usando el `.sql` extraído como fuente de verdad para: parámetros, tablas
   tocadas, reglas de negocio, manejo de errores y riesgos (cursores, SQL dinámico, transacciones
   largas, `NOLOCK`, etc.).

4. **Mantener sincronizado**: al re-ejecutar el exportador, comparar `modify_date` en
   `manifest.csv` contra el campo "última extracción" de cada doc. Si `modify_date` es más
   reciente que la doc, el SP cambió en la BD desde la última documentación → revisar y
   actualizar antes de confiar en la doc.

## Convenciones

- Un archivo `.md` por SP, nombre exacto del SP (case-sensitive tal como aparece en la BD).
- No editar los `.sql` de `sql/` a mano — son el resultado crudo de la extracción. Si hace falta
  anotar algo, va en el `.md` correspondiente.
- `catalogo.md` es la única fuente de verdad sobre "qué documenta a qué" — enlazar desde ahí,
  no duplicar la tabla en otros lados.
- Prioridad de documentación sugerida: primero los SP de escritura (`_Procesar`, `_Eliminar`,
  cualquiera que modifique datos) por ser los de mayor riesgo, luego los de solo lectura
  (`_Obtener`) y reportes.

## Hallazgos del análisis estático inicial

- `VentaRepository.Ventas_Procesar` (SP `Venta_ProcesarNuevo`) no tiene ningún controller de
  `BackAssistanceTravelers.ApiTravel` que lo invoque — candidato a endpoint muerto o a método
  usado solo internamente/reservado. Verificar al documentar el dominio `Venta`.
- Varios SPs comparten nombre genérico entre dominios distintos con semántica distinta según
  quién los llama (ej. `Cobranza_Procesar` es usado tanto por `CobranzaRepository.Cobranza_Procesar`
  como por `PasajeroRepository.Pasajero_Procesar`) — confirmar en `catalogo.md` si es realmente
  el mismo SP compartido a propósito o una coincidencia de nombre que merece revisión.

## Checklist de revisión para un SP nuevo o modificado

Al coordinar un cambio de SP con el DBA (como ya se hace en `documentacion/sql/`),
revisar antes de darlo por aprobado:

- [ ] **Naming**: sigue la convención `Dominio_Accion` (`Venta_Obtener`,
      `Pais_Procesar`). Evitar sufijos de versión ad-hoc (`_2026`, `2`, `3`,
      `_nuevo`) salvo que ya sea el patrón existente para ese SP concreto.
- [ ] **Parámetros**: prefijo `@p` + `TABLA_Campo` (convención ya usada:
      `@pPAIS_Id`, `@pVENTA_Id`). Filtros opcionales con default `0`/`-1`
      documentado explícitamente como "sin filtro".
- [ ] **Errores**: si el SP puede fallar por una regla de negocio (no solo un
      error de SQL), devuelve el patrón `BEError` que ya consume el backend
      (`QueryFirstOrDefaultAsync<BEError>`) en vez de dejar que la excepción de
      SQL Server llegue cruda a la API.
- [ ] **Transacciones**: operaciones multi-tabla envueltas en `BEGIN TRAN` /
      `TRY...CATCH` con `ROLLBACK` en el catch.
- [ ] **Índices**: cualquier filtro (`WHERE`/`JOIN`) nuevo tiene un índice que lo
      soporte — ver `documentacion/sql/2026-09-04_venta_obtener_filtro_promotor.sql`.
- [ ] **Sin `SELECT *`**: columnas explícitas, para que agregar una columna a una
      tabla no cambie silenciosamente el mapeo Dapper → `BE*`.
- [ ] **Sin cursores** salvo justificación explícita en la sección "Riesgos" del `.md`.
- [ ] Se actualizó `known-procedures.txt` si el cambio agrega/quita quién llama
      al SP, y se volvió a correr `SpExporter` + regenerar `coverage-report.md`.

## Recomendaciones a futuro

- Mover los `.sql` extraídos en `sql/` a un proyecto SSDT (`.sqlproj`) o a
  migraciones versionadas, para que un `git diff` real muestre qué cambió en un
  SP entre dos commits (hoy solo tenemos snapshots puntuales).
- Agregar un job periódico (puede correr en el mismo self-hosted runner que ya
  usan `deploy-back-iis.yml`/`deploy-front-iis.yml`) que corra `SpExporter` y
  alerte si `modify_date` de un SP cambió en la base pero el `.sql` versionado
  en el repo no — señal de que alguien modificó un SP directo en producción sin
  pasar por este flujo.

## Nota de seguridad

La cadena de conexión a la base de datos de producción está commiteada en texto plano en
`source/backend/BackAssistanceTravelers/BackAssistanceTravelers.ApiTravel/appsettings.json`
(preexistente a este trabajo). El exportador la toma por variable de entorno o parámetro de
línea de comandos — nunca la escribas de nuevo en un archivo del repo. Si se decide rotar esa
credencial, este proceso de documentación no depende de que sea la misma.
