-- Objeto: euroamer_admin_2008.Venta_Anular
-- Creado en BD: 2013-12-24 08:51:00
-- Modificado en BD: 2013-12-24 08:51:00
-- Extraído: 2026-09-07 08:27:17 UTC
-- Referenciado por el backend .NET: SI
-- Parámetros:
--   @pVENTA_Id int (IN)

CREATE PROCEDURE [Venta_Anular]
	@pVENTA_Id INT
AS
BEGIN
	
	SET NOCOUNT ON;

    UPDATE VENTA SET ventaSituacionId=0 WHERE ventaId = @pVENTA_Id
    
END
