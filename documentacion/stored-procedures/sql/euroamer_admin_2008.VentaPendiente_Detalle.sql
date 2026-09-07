-- Objeto: euroamer_admin_2008.VentaPendiente_Detalle
-- Creado en BD: 2018-07-08 12:50:12
-- Modificado en BD: 2018-07-12 09:19:10
-- Extraído: 2026-09-07 08:27:17 UTC
-- Referenciado por el backend .NET: SI
-- Parámetros:
--   @pIDVoucher int (IN)


--exec VentaPendiente_Detalle 1
CREATE PROCEDURE [euroamer_admin_2008].[VentaPendiente_Detalle] 
	@pIDVoucher int
AS
BEGIN
	
	SET NOCOUNT ON;

    Select V.ventaId, 
		V.ventaClienteNombres, 
		V.ventaClienteApellidos, 
		V.ventaClienteEdad,
		[euroamer_admin_2008].[ObtenerValorTipoNombre]('agenciausuarioTipoDocumento', V.ventaClienteDocumentoTipoId) as tipoDocumento,
		V.ventaClienteDocumentoNumero, 
		V.ventaClienteFechaNacimiento, 
		V.ventaDestino, 
		V.ventaFechaVigenciaInicio,
		V.ventaProductoImporte,
		P.productoNombre,
		[euroamer_admin_2008].[ObtenerValorTipoNombre]('ventaSituacionId', V.ventaSituacionId) as situacion,
		V.ventaSituacionId
	From VENTA V INNER JOIN PRODUCTO P ON V.ventaProductoid  = P.productoId
	where V.ventaId = @pIDVoucher and 
	V.ventaEstadoId = 'V'  
	--and V.ventaSituacionId = 'P'

END
