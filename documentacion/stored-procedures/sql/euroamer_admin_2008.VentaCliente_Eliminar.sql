-- Objeto: euroamer_admin_2008.VentaCliente_Eliminar
-- Creado en BD: 2015-01-30 10:30:58
-- Modificado en BD: 2025-01-02 06:23:45
-- Extraído: 2026-09-07 08:27:17 UTC
-- Referenciado por el backend .NET: SI
-- Parámetros:
--   @pVENTACLIENTE_Id int (IN)


CREATE PROCEDURE [VentaCliente_Eliminar]
	@pVENTACLIENTE_Id INT = 0
AS
BEGIN
	
	SET NOCOUNT ON;
	
	DELETE FROM VENTA_CLIENTE WHERE ventaclienteId = @pVENTACLIENTE_Id
	IF @@ROWCOUNT = 0
		BEGIN
		   select '' as errorDescripcion
		END
	ELSE 
		BEGIN
		   select 'ok' as errorDescripcion
		END
END
