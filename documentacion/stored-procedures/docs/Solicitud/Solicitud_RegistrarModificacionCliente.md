<!--
Plantilla para documentar un stored procedure. Copiar a docs/<Dominio>/<NombreSP>.md.
No dejar secciones vacías: si algo no aplica, escribir "N/A" y por qué.
-->

# `euroamer_admin_2008.Solicitud_RegistrarModificacionCliente`

| Campo | Valor |
|---|---|
| Dominio | `Solicitud` |
| Repositorio (.NET) | `SolicitudRepository.cs` |
| Método(s) que lo invoca | `SolicitudRepository.Solicitudes_Registrar` |
| Endpoint(s) de API | `<Controller.Accion (verbo HTTP + ruta)>` |
| Tipo de operación | `Revisar (no se pudo inferir del nombre)` |
| Última extracción de fuente | `2026-09-07` (ver `manifest.csv`) |
| `modify_date` en BD al extraer | `2025-01-02 08:57:21` |
| Archivo fuente | `../../sql/euroamer_admin_2008.Solicitud_RegistrarModificacionCliente.sql` |

## Propósito

<Qué problema de negocio resuelve, en 2-4 líneas. Ej: "Calcula y persiste el total de una
venta aplicando impuestos por país y descuentos de promoción vigente."-->

## Parámetros

| Nombre | Tipo SQL | Dirección | Obligatorio | Descripción |
|---|---|---|---|---|
| `@pSOLICITUD_VentaId` | `int` | IN | | |
| `@pSOLICITUD_ClienteDocumentoTipoId` | `varchar` | IN | | |
| `@pSOLICITUD_ClienteDocumentoNumero` | `varchar` | IN | | |
| `@pSOLICITUD_ClienteNombres` | `varchar` | IN | | |
| `@pSOLICITUD_ClienteApellidos` | `varchar` | IN | | |
| `@pSOLICITUD_ClienteFechaNacimiento` | `date` | IN | | |
| `@pSOLICITUD_ClienteEdad` | `int` | IN | | |
| `@pSOLICITUD_ClienteEmail` | `varchar` | IN | | |
| `@pSOLICITUD_ClienteDireccion` | `varchar` | IN | | |
| `@pSOLICITUD_ClienteTelefono` | `varchar` | IN | | |
| `@pSOLICITUD_ClienteDistrito` | `varchar` | IN | | |
| `@pSOLICITUD_ClienteCiudad` | `varchar` | IN | | |
| `@pSOLICITUD_ClientePais` | `varchar` | IN | | |
| `@pSOLICITUD_Motivo` | `text` | IN | | |
| `@pSOLICITUD_Usuario` | `int` | IN | | |

## Tablas / vistas involucradas

| Objeto | Lectura | Escritura | Notas |
|---|---|---|---|
| `SOLICITUD` | ? | ? | _(auto-detectado — verificar contra el .sql)_ |

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

