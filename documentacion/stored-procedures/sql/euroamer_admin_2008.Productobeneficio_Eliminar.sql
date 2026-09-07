-- Objeto: euroamer_admin_2008.Productobeneficio_Eliminar
-- Creado en BD: 2014-08-23 10:52:35
-- Modificado en BD: 2025-01-02 06:23:42
-- Extraído: 2026-09-07 08:27:16 UTC
-- Referenciado por el backend .NET: SI
-- Parámetros:
--   @pbeneficio_Id int (IN)


CREATE PROCEDURE [Productobeneficio_Eliminar]
	@pbeneficio_Id INT
AS
BEGIN
	
	SET NOCOUNT ON;

    DELETE FROM PRODUCTO_beneficio WHERE beneficioId = @pbeneficio_Id
    
	 IF @@ROWCOUNT = 0
		BEGIN
		   select '' as errorDescripcion
		END
	ELSE 
		BEGIN
		   select 'ok' as errorDescripcion
		END
END
