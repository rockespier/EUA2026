-- Objeto: euroamer_admin_2008.Grafico_Obtener
-- Creado en BD: 2015-04-14 21:07:36
-- Modificado en BD: 2024-11-18 06:08:24
-- Extraído: 2026-09-07 08:27:16 UTC
-- Referenciado por el backend .NET: SI
-- Parámetros:
--   @pGRAFICO_Opcion int (IN)
--   @pGRAFICO_FechaInicial date (IN)
--   @pGRAFICO_FechaFinal date (IN)
--   @pGRAFICO_PaisId int (IN)

CREATE PROCEDURE [euroamer_admin_2008].[Grafico_Obtener] 
	@pGRAFICO_Opcion INT,
	@pGRAFICO_FechaInicial DATE,
	@pGRAFICO_FechaFinal DATE,
	@pGRAFICO_PaisId INT = 0
AS
BEGIN
	SET NOCOUNT ON;
	
	declare @pGRAFICO_FechaFinal_p date=@pGRAFICO_FechaFinal;
	declare @pGRAFICO_FechaFinal_f datetime2; 
	set @pGRAFICO_FechaFinal_f = @pGRAFICO_FechaFinal_p
	set @pGRAFICO_FechaFinal_f = DATEADD(ns, -100, DATEADD(s, 86400, @pGRAFICO_FechaFinal_f))

	IF @pGRAFICO_Opcion = 1 --TOTAL VENTAS PENDIENTE y PAGADAS
		BEGIN
			SELECT	ventaSituacionId, COUNT(ventaId) ventaCantidadRegistros
			INTO	#TMP_VENTAS1
			FROM	VENTA
			WHERE	CONVERT(DATETIME, ventaCreadoFecha, 112) BETWEEN CONVERT(DATETIME, @pGRAFICO_FechaInicial, 112) AND CONVERT(DATETIME, @pGRAFICO_FechaFinal_f, 112) AND
					ventaEstadoId = 'V'
			GROUP BY ventaSituacionId

			SELECT	b.valorTipoNombre, ventaCantidadRegistros
			FROM	#TMP_VENTAS1 a, VALORES_TIPO b
			WHERE	b.valorTipoColumnaTabla='ventaSituacionId' AND b.valorTipoId = a.ventaSituacionId

			DROP TABLE #TMP_VENTAS1
		END

	ELSE IF @pGRAFICO_Opcion = 2 --TOTAL VENTAS POR PAIS DE AGENCIA
		BEGIN
			SELECT	a.agenciaPaisId, SUM(ventaProductoImporte) ventaProductoImporte
			INTO	#TMP_VENTAS2
			FROM	VENTA v, AGENCIA a
			WHERE	v.ventaUsuarioAgenciaId = a.agenciaId AND
					CONVERT(DATETIME, v.ventaCreadoFecha, 112) BETWEEN CONVERT(DATETIME, @pGRAFICO_FechaInicial, 112) AND CONVERT(DATETIME, @pGRAFICO_FechaFinal_f, 112) AND
					v.ventaEstadoId = 'V'
			GROUP BY a.agenciaPaisId

			SELECT	p.paisNombre, a.ventaProductoImporte
			FROM	#TMP_VENTAS2 a, PAIS p
			WHERE	a.agenciaPaisId = p.paisId

			DROP TABLE #TMP_VENTAS2
		END

	ELSE IF @pGRAFICO_Opcion = 3 --TOTAL VENTAS POR PROMOTOR
		BEGIN
			SELECT	a.agenciaPromotorId, SUM(ventaProductoImporte) ventaProductoImporte
			INTO	#TMP_VENTAS3
			FROM	VENTA v, AGENCIA a
			WHERE	v.ventaUsuarioAgenciaId = a.agenciaId AND
					CONVERT(DATETIME, v.ventaCreadoFecha, 112) >= CONVERT(DATETIME, @pGRAFICO_FechaInicial, 112) AND CONVERT(DATETIME, v.ventaCreadoFecha, 112) <= CONVERT(DATETIME, @pGRAFICO_FechaFinal_f, 112) AND
					v.ventaEstadoId = 'V'
			GROUP BY a.agenciaPromotorId

			SELECT	p.usuarioNombre, a.ventaProductoImporte
			FROM	#TMP_VENTAS3 a, USUARIO p
			WHERE	a.agenciaPromotorId= p.usuarioId

			DROP TABLE #TMP_VENTAS3
		END

	ELSE IF @pGRAFICO_Opcion = 4 --TOTAL VENTAS POR DISTRITO
		BEGIN
			SELECT	TOP 10 v.ventaClienteDistrito, SUM(ventaProductoImporte) ventaProductoImporte
			FROM	VENTA v, AGENCIA a
			WHERE	v.ventaUsuarioAgenciaId = a.agenciaId AND
					CONVERT(DATETIME, v.ventaCreadoFecha, 112) BETWEEN CONVERT(DATETIME, @pGRAFICO_FechaInicial, 112) AND CONVERT(DATETIME, @pGRAFICO_FechaFinal_f, 112) AND
					v.ventaEstadoId = 'V' AND a.agenciaPaisId = @pGRAFICO_PaisId
			GROUP BY v.ventaClienteDistrito
			ORDER BY ventaProductoImporte DESC 
		END

	ELSE IF @pGRAFICO_Opcion = 5 --TOTAL VENTAS POR PRODUCTO
		BEGIN
			SELECT	p.productoNombre, SUM(ventaProductoImporte) ventaProductoImporte
			FROM	VENTA v, PRODUCTO p
			WHERE	v.ventaProductoId = p.productoId AND
					CONVERT(DATETIME, v.ventaCreadoFecha, 112) BETWEEN CONVERT(DATETIME, @pGRAFICO_FechaInicial, 112) AND CONVERT(DATETIME, @pGRAFICO_FechaFinal_f, 112) AND
					v.ventaEstadoId = 'V' AND p.productoPaisId = @pGRAFICO_PaisId
			GROUP BY p.productoNombre
		END
END
