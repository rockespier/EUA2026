<!--
Plantilla para documentar un stored procedure. Copiar a docs/<Dominio>/<NombreSP>.md.
No dejar secciones vacías: si algo no aplica, escribir "N/A" y por qué.
-->

# `dbo.IndexOptimize`

| Campo | Valor |
|---|---|
| Dominio | `SinClasificar` |
| Repositorio (.NET) | `N/D.cs` |
| Método(s) que lo invoca | `_(no detectado en source/backend — no referenciado en el código analizado)_` |
| Endpoint(s) de API | `<Controller.Accion (verbo HTTP + ruta)>` |
| Tipo de operación | `Revisar (no se pudo inferir del nombre)` |
| Última extracción de fuente | `2026-09-07` (ver `manifest.csv`) |
| `modify_date` en BD al extraer | `2018-04-17 21:04:44` |
| Archivo fuente | `../../sql/dbo.IndexOptimize.sql` |

## Propósito

<Qué problema de negocio resuelve, en 2-4 líneas. Ej: "Calcula y persiste el total de una
venta aplicando impuestos por país y descuentos de promoción vigente."-->

## Parámetros

| Nombre | Tipo SQL | Dirección | Obligatorio | Descripción |
|---|---|---|---|---|
| `@Databases` | `nvarchar` | IN | | |
| `@FragmentationLow` | `nvarchar` | IN | | |
| `@FragmentationMedium` | `nvarchar` | IN | | |
| `@FragmentationHigh` | `nvarchar` | IN | | |
| `@FragmentationLevel1` | `int` | IN | | |
| `@FragmentationLevel2` | `int` | IN | | |
| `@PageCountLevel` | `int` | IN | | |
| `@SortInTempdb` | `nvarchar` | IN | | |
| `@MaxDOP` | `int` | IN | | |
| `@FillFactor` | `int` | IN | | |
| `@PadIndex` | `nvarchar` | IN | | |
| `@LOBCompaction` | `nvarchar` | IN | | |
| `@UpdateStatistics` | `nvarchar` | IN | | |
| `@OnlyModifiedStatistics` | `nvarchar` | IN | | |
| `@StatisticsSample` | `int` | IN | | |
| `@StatisticsResample` | `nvarchar` | IN | | |
| `@PartitionLevel` | `nvarchar` | IN | | |
| `@MSShippedObjects` | `nvarchar` | IN | | |
| `@Indexes` | `nvarchar` | IN | | |
| `@TimeLimit` | `int` | IN | | |
| `@Delay` | `int` | IN | | |
| `@WaitAtLowPriorityMaxDuration` | `int` | IN | | |
| `@WaitAtLowPriorityAbortAfterWait` | `nvarchar` | IN | | |
| `@AvailabilityGroups` | `nvarchar` | IN | | |
| `@LockTimeout` | `int` | IN | | |
| `@LogToTable` | `nvarchar` | IN | | |
| `@Execute` | `nvarchar` | IN | | |

## Tablas / vistas involucradas

| Objeto | Lectura | Escritura | Notas |
|---|---|---|---|
| `AvailabilityGroups1` | ? | ? | _(auto-detectado — verificar contra el .sql)_ |
| `AvailabilityGroups2` | ? | ? | _(auto-detectado — verificar contra el .sql)_ |
| `AvailabilityGroups3` | ? | ? | _(auto-detectado — verificar contra el .sql)_ |
| `AvailabilityGroups4` | ? | ? | _(auto-detectado — verificar contra el .sql)_ |
| `Databases1` | ? | ? | _(auto-detectado — verificar contra el .sql)_ |
| `Databases2` | ? | ? | _(auto-detectado — verificar contra el .sql)_ |
| `Databases3` | ? | ? | _(auto-detectado — verificar contra el .sql)_ |
| `Databases4` | ? | ? | _(auto-detectado — verificar contra el .sql)_ |
| `FragmentationHigh` | ? | ? | _(auto-detectado — verificar contra el .sql)_ |
| `FragmentationLow` | ? | ? | _(auto-detectado — verificar contra el .sql)_ |
| `FragmentationMedium` | ? | ? | _(auto-detectado — verificar contra el .sql)_ |
| `Indexes1` | ? | ? | _(auto-detectado — verificar contra el .sql)_ |
| `Indexes2` | ? | ? | _(auto-detectado — verificar contra el .sql)_ |
| `Indexes3` | ? | ? | _(auto-detectado — verificar contra el .sql)_ |
| `Indexes4` | ? | ? | _(auto-detectado — verificar contra el .sql)_ |
| `is` | ? | ? | _(auto-detectado — verificar contra el .sql)_ |
| `statistics` | ? | ? | _(auto-detectado — verificar contra el .sql)_ |
| `sys.availability_databases_cluster` | ? | ? | _(auto-detectado — verificar contra el .sql)_ |
| `sys.availability_groups` | ? | ? | _(auto-detectado — verificar contra el .sql)_ |
| `sys.database_mirroring` | ? | ? | _(auto-detectado — verificar contra el .sql)_ |
| `sys.database_recovery_status` | ? | ? | _(auto-detectado — verificar contra el .sql)_ |
| `sys.databases` | ? | ? | _(auto-detectado — verificar contra el .sql)_ |
| `sys.dm_db_index_physical_stats` | ? | ? | _(auto-detectado — verificar contra el .sql)_ |
| `sys.dm_db_stats_properties` | ? | ? | _(auto-detectado — verificar contra el .sql)_ |
| `sys.dm_hadr_availability_replica_states` | ? | ? | _(auto-detectado — verificar contra el .sql)_ |
| `sys.dm_hadr_cluster` | ? | ? | _(auto-detectado — verificar contra el .sql)_ |
| `sys.dm_os_host_info` | ? | ? | _(auto-detectado — verificar contra el .sql)_ |
| `sys.objects` | ? | ? | _(auto-detectado — verificar contra el .sql)_ |
| `sys.schemas` | ? | ? | _(auto-detectado — verificar contra el .sql)_ |
| `that` | ? | ? | _(auto-detectado — verificar contra el .sql)_ |
| `tmpAvailabilityGroups` | ? | ? | _(auto-detectado — verificar contra el .sql)_ |
| `tmpDatabases` | ? | ? | _(auto-detectado — verificar contra el .sql)_ |
| `tmpIndexesStatistics` | ? | ? | _(auto-detectado — verificar contra el .sql)_ |

## Lógica de negocio relevante

- Reglas de validación aplicadas (qué rechaza y con qué código/mensaje de error).
- Cálculos o transformaciones no obvias (redondeos, impuestos, tipos de cambio).
- Efectos secundarios (inserta en tabla de auditoría, dispara triggers, envía a cola, etc.).

## Dependencias

- Otros SPs/funciones que invoca: `<...>` (o "Ninguna").
- Triggers que dependen de las tablas que este SP modifica: `<...>` (o "Ninguno conocido").

## Manejo de errores

- Cómo comunica errores al llamador (`BEError`, código de retorno, `RAISERROR`, etc.).
- Casos conocidos de fallo silencioso o comportamiento no intuitivo.

## Rendimiento

- Índices que este SP necesita para evitar table scans, especialmente en filtros
  usados desde pantallas de listado/búsqueda avanzada (ver el caso real en
  `documentacion/sql/2026-09-04_venta_obtener_filtro_promotor.sql` de un filtro
  sin índice que causó lentitud reportada en producción).
- Volumetría esperada de las tablas involucradas y frecuencia de ejecución
  (por request de usuario, batch, reporte pesado, etc.).

## Riesgos / deuda técnica

- Cursor(es), SQL dinámico, `NOLOCK`, falta de índices esperados, transacciones largas, etc.
- Cualquier cosa que un DBA debería vigilar antes de tocar este SP.

## Historial de cambios documentados

| Fecha | Autor | Cambio |
|---|---|---|
| `2026-09-07` | `script (New-ProcedureDocs.ps1)` | Documentación inicial |

