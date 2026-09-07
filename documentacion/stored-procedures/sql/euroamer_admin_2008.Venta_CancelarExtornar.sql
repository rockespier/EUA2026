-- Objeto: euroamer_admin_2008.Venta_CancelarExtornar
-- Creado en BD: 2013-12-24 08:51:00
-- Modificado en BD: 2025-08-11 01:21:35
-- Extraído: 2026-09-07 08:27:17 UTC
-- Referenciado por el backend .NET: SI
-- Parámetros:
--   @pVENTA_Id int (IN)
--   @pVENTA_SituacionId char (IN)

CREATE PROCEDURE [euroamer_admin_2008].[Venta_CancelarExtornar]
	@pVENTA_Id INT,
	@pVENTA_SituacionId CHAR(1)
AS
BEGIN
	
	SET NOCOUNT ON;
	
	declare @tipoproceso int = 0;
	declare @resultado varchar(300) = '';
	declare @FechaHoraActual datetime = [euroamer_admin_2008].[fuObtenerFechaActualPeruana]();

    UPDATE VENTA SET ventaSituacionId = @pVENTA_SituacionId, ventaModificadoFecha=@FechaHoraActual WHERE ventaId = @pVENTA_Id	
	UPDATE COBRANZA SET cobranzaActivo=0 where cobranzaId in (select cobranzaId from COBRANZA_DETALLE where cobranzadetalleVentaId=@pVENTA_Id)

	IF @@ROWCOUNT > 0
		BEGIN
			set @resultado = 'ok';
		END
	select @tipoproceso as errorCodigo, @resultado as errorDescripcion   
    
END
