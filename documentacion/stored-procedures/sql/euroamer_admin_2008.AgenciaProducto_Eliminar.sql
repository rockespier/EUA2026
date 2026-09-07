-- Objeto: euroamer_admin_2008.AgenciaProducto_Eliminar
-- Creado en BD: 2025-04-15 03:26:19
-- Modificado en BD: 2025-07-03 07:24:31
-- Extraído: 2026-09-07 08:27:16 UTC
-- Referenciado por el backend .NET: SI
-- Parámetros:
--   @pAgenciaProductoId int (IN)

CREATE PROCEDURE [AgenciaProducto_Eliminar]	
    @pAgenciaProductoId INT 
AS
BEGIN

	SET NOCOUNT ON;

    DELETE AGENCIA_PRODUCTO WHERE AGENCIAPRODUCTOID = @pAgenciaProductoId

	IF @@ROWCOUNT = 0
		BEGIN
		   select '' as errorDescripcion
		END
	ELSE
		BEGIN
		   select 'ok' as errorDescripcion
		END
END
