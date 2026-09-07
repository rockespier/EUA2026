<!--
Plantilla para documentar un stored procedure. Copiar a docs/<Dominio>/<NombreSP>.md.
No dejar secciones vacías: si algo no aplica, escribir "N/A" y por qué.
-->

# `euroamer_admin_2008.VentaMasiva_ProcesarNuevo_2026`

| Campo | Valor |
|---|---|
| Dominio | `Venta` |
| Repositorio (.NET) | `VentaRepository.cs` |
| Método(s) que lo invoca | `VentaRepository.VentaMasiva_Procesar` |
| Endpoint(s) de API | `<Controller.Accion (verbo HTTP + ruta)>` |
| Tipo de operación | `Escritura` |
| Última extracción de fuente | `2026-09-07` (ver `manifest.csv`) |
| `modify_date` en BD al extraer | `2026-08-24 08:43:00` |
| Archivo fuente | `../../sql/euroamer_admin_2008.VentaMasiva_ProcesarNuevo_2026.sql` |

## Propósito

<Qué problema de negocio resuelve, en 2-4 líneas. Ej: "Calcula y persiste el total de una
venta aplicando impuestos por país y descuentos de promoción vigente."-->

## Parámetros

| Nombre | Tipo SQL | Dirección | Obligatorio | Descripción |
|---|---|---|---|---|
| `@pVENTA_MasivoId` | `int` | IN | | |
| `@pVENTA_FechaVigenciaInicio` | `date` | IN | | |
| `@pVENTA_FechaVigenciaFin` | `date` | IN | | |
| `@pVENTA_Destino` | `varchar` | IN | | |
| `@pProductoATVCodigo` | `varchar` | IN | | |
| `@pVENTA_AgenciaLogin` | `varchar` | IN | | |
| `@pVENTA_AgenciaUsuarioLogin` | `varchar` | IN | | |
| `@pVENTA_Counter` | `varchar` | IN | | |
| `@pVENTA_ClienteDocumentoTipo` | `varchar` | IN | | |
| `@pVENTA_ClienteDocumentoNumero` | `varchar` | IN | | |
| `@pVENTA_ClienteNombres` | `varchar` | IN | | |
| `@pVENTA_ClienteApellidos` | `varchar` | IN | | |
| `@pVENTA_ClienteFechaNacimiento` | `date` | IN | | |
| `@pVENTA_ClienteEmail` | `varchar` | IN | | |
| `@pVENTA_ClienteDireccion` | `varchar` | IN | | |
| `@pVENTA_ClienteTelefono` | `varchar` | IN | | |
| `@pVENTA_ClienteDistrito` | `varchar` | IN | | |
| `@pVENTA_ClienteCiudad` | `varchar` | IN | | |
| `@pVENTA_ClientePais` | `varchar` | IN | | |
| `@pVENTA_ContactoNombres` | `varchar` | IN | | |
| `@pVENTA_ContactoDireccion` | `varchar` | IN | | |
| `@pVENTA_ContactoEmail` | `varchar` | IN | | |
| `@pVENTA_ContactoTelefono` | `varchar` | IN | | |
| `@pVENTA_ContactoDistrito` | `varchar` | IN | | |
| `@pVENTA_ContactoPais` | `varchar` | IN | | |
| `@pVENTA_CodigoExterno` | `varchar` | IN | | |
| `@pVENTA_Clientenacionalidad` | `varchar` | IN | | |
| `@pVENTA_Origen` | `varchar` | IN | | |

## Tablas / vistas involucradas

| Objeto | Lectura | Escritura | Notas |
|---|---|---|---|
| `AGENCIA` | ? | ? | _(auto-detectado — verificar contra el .sql)_ |
| `AGENCIA_USUARIO` | ? | ? | _(auto-detectado — verificar contra el .sql)_ |
| `PRODUCTO` | ? | ? | _(auto-detectado — verificar contra el .sql)_ |
| `PRODUCTO_TARIFA` | ? | ? | _(auto-detectado — verificar contra el .sql)_ |
| `VALORES_TIPO` | ? | ? | _(auto-detectado — verificar contra el .sql)_ |
| `VENTA_TMP` | ? | ? | _(auto-detectado — verificar contra el .sql)_ |

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

