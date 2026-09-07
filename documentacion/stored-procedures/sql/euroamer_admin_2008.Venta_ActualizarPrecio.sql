-- Objeto: euroamer_admin_2008.Venta_ActualizarPrecio
-- Creado en BD: 2026-08-27 02:41:18
-- Modificado en BD: 2026-08-27 07:18:50
-- Extraído: 2026-09-07 08:27:17 UTC
-- Referenciado por el backend .NET: SI
-- Parámetros:
--   @pVENTA_Id int (IN)
--   @pVENTA_ImportePrecio decimal (IN)
--   @pVENTA_UsuarioId int (IN)

CREATE PROCEDURE [euroamer_admin_2008].Venta_ActualizarPrecio (
    @pVENTA_Id INT,
    @pVENTA_ImportePrecio DECIMAL(18,4),
    @pVENTA_UsuarioId INT)
AS
BEGIN
    SET NOCOUNT ON;

    declare @tipoproceso int = 2;
    declare @resultado varchar(300) = '';

    UPDATE VENTA
    SET ventaImporteVenta = @pVENTA_ImportePrecio,
        PrecioEditadoManual = 1,
        ventaModificadoFecha = getdate(),
        ventaModificadoUsuarioId = @pVENTA_UsuarioId
    WHERE ventaId = @pVENTA_Id;

    /*IF @@ROWCOUNT > 0
        BEGIN
            set @resultado = 'ok'
        END*/
    set @resultado = 'ok'
    select @tipoproceso as codigo, 'ok' as descripcion

END;
