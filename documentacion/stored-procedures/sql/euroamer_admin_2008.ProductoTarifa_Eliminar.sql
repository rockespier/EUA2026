-- Objeto: euroamer_admin_2008.ProductoTarifa_Eliminar
-- Creado en BD: 2013-12-24 08:50:58
-- Modificado en BD: 2025-01-02 06:23:43
-- Extraído: 2026-09-07 08:27:16 UTC
-- Referenciado por el backend .NET: SI
-- Parámetros:
--   @pTARIFA_Id int (IN)


CREATE PROCEDURE [ProductoTarifa_Eliminar]
	@pTARIFA_Id INT
AS
BEGIN
	
	SET NOCOUNT ON;

    DELETE FROM PRODUCTO_TARIFA WHERE tarifaId = @pTARIFA_Id
    
	 IF @@ROWCOUNT = 0
		BEGIN
		   select '' as errorDescripcion
		END
	ELSE 
		BEGIN
		   select 'ok' as errorDescripcion
		END
END
