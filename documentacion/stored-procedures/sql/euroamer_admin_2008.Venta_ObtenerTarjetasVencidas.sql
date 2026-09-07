-- Objeto: euroamer_admin_2008.Venta_ObtenerTarjetasVencidas
-- Creado en BD: 2015-04-14 21:09:43
-- Modificado en BD: 2015-05-28 11:00:12
-- Extraído: 2026-09-07 08:27:17 UTC
-- Referenciado por el backend .NET: SI


CREATE PROCEDURE [Venta_ObtenerTarjetasVencidas] 
AS
BEGIN

	SET NOCOUNT ON;
	
	SELECT	v.ventaId, 
			euroamer_admin_2008.Usuario_RecuperarNombre2(ventaUsuarioOrigen,ventaUsuarioAgenciaId,ventaCreadoUsuarioId) as AgenciaNombre, 
			v.ventaCreadoFecha, 
			p.productoNombre, 
			v.ventaFechaVigenciaInicio, 
			v.ventaFechaVigenciaFin,
			DATEDIFF(DD, v.ventaCreadoFecha, GETDATE()) ventaDiasVencidos,
			v.ventaImporteVenta
	FROM	VENTA v, AGENCIA a, PRODUCTO p
	WHERE	v.ventaUsuarioAgenciaId = a.agenciaId AND
			v.ventaProductoId = p.productoId AND
			v.ventaEstadoId = 'V' AND v.ventaSituacionId = 'P' AND
			DATEDIFF(DD, v.ventaCreadoFecha, GETDATE()) > a.agenciaCredito
    ORDER BY a.agenciaNombre, v.ventaId
END
