-- Objeto: euroamer_admin_2008.VentaCancelada_Detalle
-- Creado en BD: 2020-12-15 09:42:33
-- Modificado en BD: 2025-09-08 08:06:29
-- Extraído: 2026-09-07 08:27:17 UTC
-- Referenciado por el backend .NET: SI
-- Parámetros:
--   @pIDVoucher int (IN)
--   @pApellidos varchar (IN)

--exec VentaCancelada_Detalle 4061963,'khan'
CREATE PROCEDURE [euroamer_admin_2008].[VentaCancelada_Detalle] 
	@pIDVoucher int,
	@pApellidos varchar(80)
AS
BEGIN
	
	SET NOCOUNT ON;

    /*Select count(*)
	From VENTA V
	where V.ventaId = @pIDVoucher 
	and V.ventaClienteApellidos like '%'+ @pApellidos + '%'
	--and V.ventaEstadoId = 'V'  
	--and V.ventaSituacionId = 'C'
	*/

	SELECT	ventaId, 
			(SELECT valorTipoNombre 
			  FROM VALORES_TIPO 
			  WHERE valorTipoColumnaTabla='ventaClienteDocumentoTipoId' AND valorTipoId=ventaClienteDocumentoTipoId) as ventaClienteDocumentoTipoNombre, 
			ventaClienteDocumentoNumero, 
			ventaClienteNombres, 
			ventaClienteApellidos, 
			ventaClienteEdad, 
			ventaClienteEmail, 
			ventaClienteDireccion, 
			ventaClienteTelefono, 
			ventaClienteDistrito, 
			ventaClienteCiudad, 
			ventaClientePais
			,(ag.agenciaEmail) as UsuarioAgenciaCorreo
			,productoNombre
			,euroamer_admin_2008.Usuario_RecuperarNombre2(ventaUsuarioOrigen, ventaUsuarioAgenciaId,ventaCreadoUsuarioId) as ventaUsuarioAgenciaNombre
			,(ag.agenciaDireccion) as UsuarioAgenciaDireccion
			,ventaContactoNombres, 
			ventaContactoDireccion, 
			ventaContactoEmail, 
			ventaContactoTelefono, 
			ventaContactoDistrito, 
			ventaContactoPais,
			ventaFechaVigenciaInicio, 
			ventaFechaVigenciaFin, 
			ventaNumeroDias,
			v.ventaProductoId,
			ventaClienteFechaNacimiento,
			ventaCreadoFecha
	FROM	VENTA V, PRODUCTO p, AGENCIA ag
	WHERE	v.ventaProductoId = p.productoId 
	AND ag.agenciaId = v.ventaUsuarioAgenciaId
	AND V.ventaId = @pIDVoucher 
	and V.ventaClienteApellidos like '%'+ @pApellidos + '%'

END
