<!--
Plantilla para documentar un stored procedure. Copiar a docs/<Dominio>/<NombreSP>.md.
No dejar secciones vacías: si algo no aplica, escribir "N/A" y por qué.
-->

# `euroamer_admin_2008.AgenciaUsuario_Procesar`

| Campo | Valor |
|---|---|
| Dominio | `Agencia, Usuario` |
| Repositorio (.NET) | `AgenciaRepository.cs` |
| Método(s) que lo invoca | `AgenciaRepository.AgenciaUsuario_Procesar, UsuarioRepository.Usuario_Procesar` |
| Endpoint(s) de API | `<Controller.Accion (verbo HTTP + ruta)>` |
| Tipo de operación | `Escritura` |
| Última extracción de fuente | `2026-09-07` (ver `manifest.csv`) |
| `modify_date` en BD al extraer | `2025-07-08 07:20:15` |
| Archivo fuente | `../../sql/euroamer_admin_2008.AgenciaUsuario_Procesar.sql` |

## Propósito

<Qué problema de negocio resuelve, en 2-4 líneas. Ej: "Calcula y persiste el total de una
venta aplicando impuestos por país y descuentos de promoción vigente."-->

## Parámetros

| Nombre | Tipo SQL | Dirección | Obligatorio | Descripción |
|---|---|---|---|---|
| `@pAGENCIA_Id` | `int` | IN | | |
| `@pAGENCIAUSUARIO_Id` | `int` | IN | | |
| `@pAGENCIAUSUARIO_Nombre` | `varchar` | IN | | |
| `@pAGENCIAUSUARIO_TipoDocumento` | `varchar` | IN | | |
| `@pAGENCIAUSUARIO_NumeroDocumento` | `varchar` | IN | | |
| `@pAGENCIAUSUARIO_Telefono` | `varchar` | IN | | |
| `@pAGENCIAUSUARIO_Email` | `varchar` | IN | | |
| `@pAGENCIAUSUARIO_Direccion` | `varchar` | IN | | |
| `@pAGENCIAUSUARIO_Login` | `varchar` | IN | | |
| `@pAGENCIAUSUARIO_Clave` | `varchar` | IN | | |
| `@pAGENCIAUSUARIO_PerfilId` | `int` | IN | | |
| `@pAGENCIAUSUARIO_SupervisorId` | `int` | IN | | |
| `@pAGENCIAUSUARIO_ValidoDesde` | `datetime` | IN | | |
| `@pAGENCIAUSUARIO_ValidoHasta` | `datetime` | IN | | |
| `@pAGENCIAUSUARIO_Comentarios` | `text` | IN | | |
| `@pAGENCIAUSUARIO_Usuario` | `int` | IN | | |
| `@pAGENCIAUSUARIO_Activo` | `int` | IN | | |
| `@pAGENCIAUSUARIO_Banco` | `varchar` | IN | | |
| `@pAGENCIAUSUARIO_NumeroCuenta` | `varchar` | IN | | |
| `@pAGENCIAUSUARIO_ActualizarContrasena` | `int` | IN | | |

## Tablas / vistas involucradas

| Objeto | Lectura | Escritura | Notas |
|---|---|---|---|
| `AGENCIA_USUARIO` | ? | ? | _(auto-detectado — verificar contra el .sql)_ |

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

