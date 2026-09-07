-- Objeto: euroamer_admin_2008.VentaCliente_Obtener_2026
-- Creado en BD: 2026-08-31 08:22:22
-- Modificado en BD: 2026-08-31 08:22:22
-- Extraído: 2026-09-07 08:27:17 UTC
-- Referenciado por el backend .NET: SI
-- Parámetros:
--   @pVENTACLIENTE_VentaId int (IN)

CREATE PROCEDURE [VentaCliente_Obtener_2026]
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
			ventaclientePais,
			ventaClienteVip
	FROM	VENTA_CLIENTE
	WHERE	ventaclienteVentaId = @pVENTACLIENTE_VentaId
	ORDER BY ventaclienteId ASC

END
