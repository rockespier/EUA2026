-- Objeto: euroamer_admin_2008.VentaCupon_Eliminar
-- Creado en BD: 2017-03-25 18:41:08
-- Modificado en BD: 2017-03-25 18:41:08
-- Extraído: 2026-09-07 08:27:17 UTC
-- Referenciado por el backend .NET: NO (revisar si sigue en uso)
-- Parámetros:
--   @pventacupon_Id int (IN)

create PROCEDURE [euroamer_admin_2008].[VentaCupon_Eliminar]
	@pventacupon_Id INT = 0
AS
BEGIN
	
	SET NOCOUNT ON;
	
	DELETE FROM VENTA_CUPON WHERE ventacuponId = @pventacupon_Id

END
