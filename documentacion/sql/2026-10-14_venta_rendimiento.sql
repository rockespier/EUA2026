/*
================================================================================
 Optimización segura de VENTA y Venta_Obtener_2026
================================================================================

 Alcance ejecutable:
 - Refresca estadísticas de VENTA afectadas por 34k+ modificaciones pendientes.
 - Mantiene la comparación case-insensitive sin aplicar UPPER() a columnas.
 - Elimina la prioridad alta de deadlock de un procedimiento de lectura.

 Precondiciones verificadas el 2026-10-14:
 - VENTA.ventaClienteNombres, ventaClienteApellidos y ventaCodigoExterno usan
   SQL_Latin1_General_CP1_CI_AS.
 - La definición se obtiene directamente de la base antes de alterarla para no
   sobrescribir cambios posteriores al último snapshot versionado.

 No crea índices. Antes se requieren planes reales de consultas representativas;
 los índices actuales ya cubren fecha, agencia, usuario, documento y código.
================================================================================
*/

SET NOCOUNT ON;
SET XACT_ABORT ON;

/* Paso 1: ejecutar durante una ventana de menor carga. */
UPDATE STATISTICS [euroamer_admin_2008].[VENTA] [IX_VENTA_BusquedaAgenciaUsuario] WITH FULLSCAN;
UPDATE STATISTICS [euroamer_admin_2008].[VENTA] [IX_VENTA_BusquedaFechaEstadoSituacion] WITH FULLSCAN;
UPDATE STATISTICS [euroamer_admin_2008].[VENTA] [IX_venta_EstadoFecha] WITH FULLSCAN;
UPDATE STATISTICS [euroamer_admin_2008].[VENTA] [VENTA_idx1] WITH FULLSCAN;
UPDATE STATISTICS [euroamer_admin_2008].[VENTA] [VENTA_idx2] WITH FULLSCAN;
UPDATE STATISTICS [euroamer_admin_2008].[VENTA] [VENTA_idx4] WITH FULLSCAN;
UPDATE STATISTICS [euroamer_admin_2008].[VENTA] [VENTA_idx5] WITH FULLSCAN;
UPDATE STATISTICS [euroamer_admin_2008].[VENTA] [venta_idx_tp] WITH FULLSCAN;

/*
 Pasos 4 y 5: cambios semánticamente equivalentes sobre la definición vigente.
 Cada reemplazo se verifica primero para evitar una modificación parcial si el
 SP fue cambiado por el DBA desde esta revisión.
*/
DECLARE @definicion nvarchar(max) = OBJECT_DEFINITION(OBJECT_ID(N'[euroamer_admin_2008].[Venta_Obtener_2026]'));

IF @definicion IS NULL
    THROW 51000, 'No se pudo obtener Venta_Obtener_2026.', 1;

IF CHARINDEX(N'SET DEADLOCK_PRIORITY HIGH;', @definicion) = 0
    THROW 51001, 'La definición de Venta_Obtener_2026 cambió: no se encontró la prioridad HIGH esperada.', 1;

IF CHARINDEX(N'CREATE PROCEDURE', @definicion) = 0
    THROW 51003, 'La definición de Venta_Obtener_2026 cambió: no se encontró CREATE PROCEDURE.', 1;

IF CHARINDEX(N'UPPER(v.ventaClienteNombres) LIKE ''%'' + UPPER(@pVENTA_ClienteNombres) + ''%''', @definicion) = 0
   OR CHARINDEX(N'UPPER(v.ventaClienteApellidos) LIKE ''%'' + UPPER(@pVENTA_ClienteApellidos) + ''%''', @definicion) = 0
   OR CHARINDEX(N'UPPER(v.ventaCodigoExterno) = UPPER(@pVENTA_CodigoExterno)', @definicion) = 0
    THROW 51002, 'La definición de Venta_Obtener_2026 cambió: no se encontraron las expresiones UPPER esperadas.', 1;

BEGIN TRANSACTION;

SET @definicion = REPLACE(@definicion, N'CREATE PROCEDURE', N'ALTER PROCEDURE');
SET @definicion = REPLACE(@definicion, N'SET DEADLOCK_PRIORITY HIGH;', N'SET DEADLOCK_PRIORITY NORMAL;');
SET @definicion = REPLACE(@definicion,
    N'UPPER(v.ventaClienteNombres) LIKE ''%'' + UPPER(@pVENTA_ClienteNombres) + ''%''',
    N'v.ventaClienteNombres LIKE ''%'' + @pVENTA_ClienteNombres + ''%''');
SET @definicion = REPLACE(@definicion,
    N'UPPER(v.ventaClienteApellidos) LIKE ''%'' + UPPER(@pVENTA_ClienteApellidos) + ''%''',
    N'v.ventaClienteApellidos LIKE ''%'' + @pVENTA_ClienteApellidos + ''%''');
SET @definicion = REPLACE(@definicion,
    N'UPPER(v.ventaCodigoExterno) = UPPER(@pVENTA_CodigoExterno)',
    N'v.ventaCodigoExterno = @pVENTA_CodigoExterno');

EXEC sys.sp_executesql @definicion;

COMMIT TRANSACTION;

/* Validación posterior. */
SELECT p.modify_date
FROM sys.procedures AS p
WHERE p.object_id = OBJECT_ID(N'[euroamer_admin_2008].[Venta_Obtener_2026]');

