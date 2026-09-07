-- Objeto: euroamer_admin_2008.Producto_Eliminar
-- Creado en BD: 2013-12-24 08:50:58
-- Modificado en BD: 2025-01-02 06:23:42
-- Extraído: 2026-09-07 08:27:16 UTC
-- Referenciado por el backend .NET: SI
-- Parámetros:
--   @pPRODUCTO_Id int (IN)


CREATE PROCEDURE [Producto_Eliminar]
	@pPRODUCTO_Id INT
AS
BEGIN
	
	SET NOCOUNT ON;

    --UPDATE PRODUCTO SET productoActivo=0 WHERE productoId = @pPRODUCTO_Id	
	DELETE FROM PRODUCTO_TARIFA WHERE tarifaProductoId = @pPRODUCTO_Id
	
    DELETE FROM PRODUCTO_BENEFICIO	WHERE beneficioProductoId = @pPRODUCTO_Id 
	
	DELETE FROM PRODUCTO WHERE productoId = @pPRODUCTO_Id
    
	 IF @@ROWCOUNT = 0
		BEGIN
		   select '' as errorDescripcion
		END
	ELSE 
		BEGIN
		   select 'ok' as errorDescripcion
		END

END
