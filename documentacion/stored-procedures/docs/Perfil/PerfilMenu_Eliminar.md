<!--
Plantilla para documentar un stored procedure. Copiar a docs/<Dominio>/<NombreSP>.md.
No dejar secciones vacías: si algo no aplica, escribir "N/A" y por qué.
-->

# `euroamer_admin_2008.PerfilMenu_Eliminar`

| Campo | Valor |
|---|---|
| Dominio | `Perfil, Permiso` |
| Repositorio (.NET) | `PerfilRepository.cs` |
| Método(s) que lo invoca | `PerfilRepository.PerfilMenu_Eliminar, PermisoRepository.PermisoArbol_Eliminar` |
| Endpoint(s) de API | `ConfiguracionController.postProcesarPermiso (POST configuracion/PermisoProcesar)` |
| Tipo de operación | `Escritura` |
| Última extracción de fuente | `2026-09-07` (ver `manifest.csv`) |
| `modify_date` en BD al extraer | `2026-08-28 02:41:47` |
| Archivo fuente | `../../sql/euroamer_admin_2008.PerfilMenu_Eliminar.sql` |

## Propósito

<Qué problema de negocio resuelve, en 2-4 líneas. Ej: "Calcula y persiste el total de una
venta aplicando impuestos por país y descuentos de promoción vigente."-->

## Parámetros

| Nombre | Tipo SQL | Dirección | Obligatorio | Descripción |
|---|---|---|---|---|
| `@pPERFIL_Id` | `int` | IN | | |

## Tablas / vistas involucradas

| Objeto | Lectura | Escritura | Notas |
|---|---|---|---|
| `PERFIL_MENU` | ? | ? | _(auto-detectado — verificar contra el .sql)_ |

## Lógica de negocio relevante

- Reglas de validación aplicadas (qué rechaza y con qué código/mensaje de error).
- Cálculos o transformaciones no obvias (redondeos, impuestos, tipos de cambio).
- Efectos secundarios (inserta en tabla de auditoría, dispara triggers, envía a cola, etc.).

## Dependencias

- Otros SPs/funciones que invoca: `<...>` (o "Ninguna").
- Triggers que dependen de las tablas que este SP modifica: `<...>` (o "Ninguno conocido").

## Manejo de errores

- Devuelve una fila con `errorCodigo`/`errorDescripcion` (se lee como `BEError`): `1`/`'ok'` si borró filas.
- Sin filas afectadas (el perfil no tenía permisos) devuelve `-1`/`''`; en esa rama la primera columna no tiene nombre (`select -1, '' as errorDescripcion`), así que `errorCodigo` queda en `0` al mapear. `PermisoRepository.PermisoArbol_Procesar` no lo trata como error y continúa con los inserts.

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

