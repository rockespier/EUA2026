-- Objeto: euroamer_admin_2008.GraficoReporte_Obtener
-- Creado en BD: 2017-03-25 18:41:08
-- Modificado en BD: 2024-11-18 06:10:01
-- Extraído: 2026-09-07 08:27:16 UTC
-- Referenciado por el backend .NET: SI
-- Parámetros:
--   @pGRAFICO_Opcion int (IN)
--   @pGRAFICO_FechaInicial date (IN)
--   @pGRAFICO_FechaFinal date (IN)
--   @pGRAFICO_ID int (IN)

CREATE PROCEDURE [euroamer_admin_2008].[GraficoReporte_Obtener] 
	@pGRAFICO_Opcion INT,
	@pGRAFICO_FechaInicial DATE,
	@pGRAFICO_FechaFinal DATE,
	@pGRAFICO_ID INT = 0
AS
BEGIN
	SET NOCOUNT ON;
	
	declare @pGRAFICO_FechaFinal_p date=@pGRAFICO_FechaFinal;
	declare @pGRAFICO_FechaFinal_f datetime2; 
	set @pGRAFICO_FechaFinal_f = @pGRAFICO_FechaFinal_p
	set @pGRAFICO_FechaFinal_f = DATEADD(ns, -100, DATEADD(s, 86400, @pGRAFICO_FechaFinal_f))

	IF @pGRAFICO_Opcion = 1 --TOTAL VENTAS ACUMULADAS POR MES Y POR PROMOTOR 
		BEGIN
		
			SELECT	a.agenciaPromotorId, month(v.ventaCreadoFecha) mes, year(v.ventaCreadoFecha) anho, SUM(ventaProductoImporte) ventaProductoImporte
			INTO	#TMP_VENTAS1
	     	FROM	VENTA v, AGENCIA a
			WHERE	v.ventaUsuarioAgenciaId = a.agenciaId AND
					CONVERT(DATETIME, v.ventaCreadoFecha, 112) BETWEEN CONVERT(DATETIME, @pGRAFICO_FechaInicial, 112) AND CONVERT(DATETIME, @pGRAFICO_FechaFinal_f, 112) AND
					v.ventaEstadoId = 'V'
			GROUP BY a.agenciaPromotorId, month(v.ventaCreadoFecha), year(v.ventaCreadoFecha)
			
			SELECT	a.anho, (select valortiponombre from VALORES_TIPO where valortipocolumnatabla='numMesesDescripcion' and valortipoid=cast(a.mes as varchar)) +'/'+  cast(a.anho as varchar)  elmes,  sum(a.ventaProductoImporte) ventas
			FROM	#TMP_VENTAS1 a, USUARIO p
			WHERE	a.agenciaPromotorId= p.usuarioId
			and a.agenciaPromotorId=@pGRAFICO_ID
			and a.anho >= year(@pGRAFICO_FechaInicial) and a.anho <= year(@pGRAFICO_FechaFinal_p)
			GROUP BY a.anho, a.mes
			order by a.anho,a.mes
			
			drop table #TMP_VENTAS1
		END

	ELSE IF @pGRAFICO_Opcion = 2 --TOTAL VENTAS ACUMULADAS POR AGENCIA 
		BEGIN
		
			SELECT	a.agenciaPromotorId, a.agenciaId,replace(a.agenciaNombre,char(39),'_') agenciaNombre, SUM(ventaProductoImporte) ventaProductoImporte
			INTO	#TMP_VENTAS2
	     	FROM	VENTA v, AGENCIA a
			WHERE	v.ventaUsuarioAgenciaId = a.agenciaId AND
					CONVERT(DATETIME, v.ventaCreadoFecha, 112) BETWEEN CONVERT(DATETIME, @pGRAFICO_FechaInicial, 112) AND CONVERT(DATETIME, @pGRAFICO_FechaFinal_f, 112) AND
					v.ventaEstadoId = 'V'
			GROUP BY a.agenciaPromotorId, a.agenciaId,a.agenciaNombre
						
			SELECT top 20 1, a.agenciaNombre, sum(a.ventaProductoImporte) ventas
			FROM	#TMP_VENTAS2 a
			WHERE	a.agenciaPromotorId=@pGRAFICO_ID
			GROUP BY a.agenciaNombre
			order by sum(a.ventaProductoImporte) desc
			
			drop table #TMP_VENTAS2
		END
END
