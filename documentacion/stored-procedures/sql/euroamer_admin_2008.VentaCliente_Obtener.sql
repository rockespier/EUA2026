-- Objeto: euroamer_admin_2008.VentaCliente_Obtener
-- Creado en BD: 2015-01-30 10:30:58
-- Modificado en BD: 2015-01-30 10:30:58
-- Extraído: 2026-09-07 08:27:17 UTC
-- Referenciado por el backend .NET: NO (revisar si sigue en uso)
-- Parámetros:
--   @pVENTACLIENTE_VentaId int (IN)

CREATE PROCEDURE [VentaCliente_Obtener]
	@pVENTACLIENTE_VentaId INT = 0
AS
BEGIN
	
	SET NOCOUNT ON;
	
	SELECT	ventaclienteId, ventaclienteVentaId, 
			ventaclienteDocumentoTipoId, 
			(SELECT valorTipoNombre FROM VALORES_TIPO WHERE valorTipoColumnaTabla='ventaClienteDocumentoTipoId' AND valorTipoId=ventaclienteDocumentoTipoId) as ventaclienteDocumentoTipoNombre, 
			ventaclienteDocumentoNumero, 
			ventaclienteNombres, 
			ventaclienteApellidos, 
			ventaclienteFechaNacimiento, 
			ventaclienteEdad, 
			ventaclienteEmail, 
			ventaclienteDireccion, 
			ventaclienteTelefono, 
			ventaclienteDistrito, 
			ventaclienteCiudad, 
			ventaclientePais	
	FROM	VENTA_CLIENTE
	WHERE	ventaclienteVentaId = @pVENTACLIENTE_VentaId
	ORDER BY ventaclienteId ASC

END
