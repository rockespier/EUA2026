-- Objeto: euroamer_admin_2008.Grafico_ObtenerNuevo
-- Creado en BD: 2025-03-21 07:29:25
-- Modificado en BD: 2026-01-30 08:36:00
-- Extraído: 2026-09-07 08:27:16 UTC
-- Referenciado por el backend .NET: SI
-- Parámetros:
--   @pGRAFICO_Opcion int (IN)
--   @pGRAFICO_PeriodoiId int (IN)
--   @pGRAFICO_UsuarioId int (IN)
--   @pGRAFICO_PaisId int (IN)
--   @pOrigenId char (IN)
--   @pPromotorId int (IN)
--   @pFechaInicio date (IN)
--   @pFechaFin date (IN)

CREATE PROCEDURE [euroamer_admin_2008].[Grafico_ObtenerNuevo]
    @pGRAFICO_Opcion INT,
	@pGRAFICO_PeriodoiId INT,
	@pGRAFICO_UsuarioId INT = 0,
    @pGRAFICO_PaisId INT = 0,
    @pOrigenId CHAR(1) = '',
    @pPromotorId INT = 0,
    @pFechaInicio DATE = '',
    @pFechaFin DATE = ''
AS
BEGIN
	SET NOCOUNT ON;
	/*
	1 Mes Actual
	2 Mes Anterior
	3 Año Actual
	4 Año Anterior
	*/
	--Grafico_ObtenerNuevo 2,2,1,1,'U'
	--Grafico_ObtenerNuevo 7,5,1,1,'U',97,'20250101','20251009'
    declare @fchInicio date,@fchFin date, @FechaActual date, @pGRAFICO_PaisFiltroId INT, @pPerfilId INT;

	set @pPerfilId = (select usuarioPerfilId from USUARIO where usuarioId = @pGRAFICO_UsuarioId)
    --select usuarioPerfilId from USUARIO where usuarioId = 13

	--Perfiles que deben mostrar solo información de su pais
	if @pOrigenId = 'U'
	    begin
        set @pGRAFICO_PaisFiltroId = (select isnull((select top 1 UsuarioPaisId
                                    from VALORES_TIPO, USUARIO
                                    where valorTipoColumnaTabla in ('FiltroPerfilPais','GestorEUA') and valorTipoActivo=1
                                    and valorTipoId=usuarioPerfilId and usuarioId= @pGRAFICO_UsuarioId),0))     

	        /*
	        select isnull((select top 1 UsuarioPaisId
                                    from VALORES_TIPO, USUARIO
                                    where valorTipoColumnaTabla in ('FiltroPerfilPais','GestorEUA') and valorTipoActivo=1
                                    and valorTipoId=usuarioPerfilId and usuarioId= 13),0)	          
	         */

        end
	if @pOrigenId = 'A'
	    begin
        set @pGRAFICO_PaisFiltroId = (select isnull((select top 1 agenciaPaisId
                                    from VALORES_TIPO, AGENCIA
                                    where valorTipoColumnaTabla in ('FiltroPerfilPais','GestorEUA') and valorTipoActivo=1
                                    and valorTipoId='2' and agenciaId= @pGRAFICO_UsuarioId),0))
	        set @pPerfilId = 2
        end
	if @pOrigenId = 'N'
	    begin
        set @pGRAFICO_PaisFiltroId = (select isnull((select top 1 agenciaPaisId
                                    from VALORES_TIPO, AGENCIA, AGENCIA_USUARIO
                                    where valorTipoColumnaTabla in ('FiltroPerfilPais','GestorEUA') and valorTipoActivo=1
                                    and AGENCIA.agenciaId = AGENCIA_USUARIO.agenciaId
                                    and valorTipoId=agenciausuarioPerfilId and agenciausuarioId= @pGRAFICO_UsuarioId),0))
        end
    --print @pGRAFICO_PaisFiltroId
	if @pGRAFICO_PaisFiltroId > 0
	    set @pGRAFICO_PaisId = @pGRAFICO_PaisFiltroId

	if @pPerfilId = 6
	    set @pPromotorId = @pGRAFICO_UsuarioId
	
	    if @pGRAFICO_PeriodoiId = 1 or @pGRAFICO_PeriodoiId = 2 or @pGRAFICO_PeriodoiId=3
			begin
				--Primer día del año
				set @FechaActual = GETDATE()
				select @fchInicio = [euroamer_admin_2008].[fuObtenerFechaInicioPeriodo] (@pGRAFICO_PeriodoiId,@FechaActual),@fchFin = [euroamer_admin_2008].[fuObtenerFechaFinPeriodo] (@pGRAFICO_PeriodoiId,@FechaActual)
			end
		else
			begin
			    if @pGRAFICO_PeriodoiId = 4
			        begin
                        set @FechaActual = GETDATE()
                        select @fchInicio = [euroamer_admin_2008].[fuObtenerFechaInicioPeriodo] (4,@FechaActual),@fchFin = [euroamer_admin_2008].[fuObtenerFechaFinPeriodo] (4,@FechaActual)
			        end
			    else    
			        begin 
                        select @fchInicio = @pFechaInicio, @fchFin = @pFechaFin
                    end
			end

	declare @pGRAFICO_FechaInicial date = @fchInicio;
	declare @pGRAFICO_FechaFinal_p date=@fchFin;
	declare @pGRAFICO_FechaFinal_f datetime2;
	set @pGRAFICO_FechaFinal_f = @pGRAFICO_FechaFinal_p
	set @pGRAFICO_FechaFinal_f = DATEADD(ns, -100, DATEADD(s, 86400, @pGRAFICO_FechaFinal_f))

	 declare @vFecIni datetime, @vFecFin datetime

    print @pGRAFICO_FechaInicial
	print @pGRAFICO_FechaFinal_f
	IF @pGRAFICO_Opcion = 1 --VENTAS X SITUACION
		BEGIN
			SELECT	ventaSituacionId, COUNT(ventaId) ventaCantidadRegistros
			INTO	#TMP_VENTAS1
			FROM	VENTA v, AGENCIA a
			WHERE	v.ventaUsuarioAgenciaId = a.agenciaId AND
				   CONVERT(DATETIME, ventaCreadoFecha, 112) BETWEEN CONVERT(DATETIME, @pGRAFICO_FechaInicial, 112) AND CONVERT(DATETIME, @pGRAFICO_FechaFinal_f, 112) AND
					ventaEstadoId = 'V' AND
					(@pGRAFICO_PaisId=0 OR a.agenciaPaisId = @pGRAFICO_PaisId) AND
			        ((@pPerfilId = 2 AND v.ventaUsuarioAgenciaId = @pGRAFICO_UsuarioId) OR (@pPerfilId <> 2)) AND
			        (@pPromotorId = 0 OR a.agenciaPromotorId = @pPromotorId)
			GROUP BY ventaSituacionId

			SELECT	b.valorTipoNombre mes, ventaCantidadRegistros importe
			FROM	#TMP_VENTAS1 a, VALORES_TIPO b
			WHERE	b.valorTipoColumnaTabla='ventaSituacionId' AND b.valorTipoId = a.ventaSituacionId

			DROP TABLE #TMP_VENTAS1
		END

	ELSE IF @pGRAFICO_Opcion = 2 --VENTAS POR AGENCIA
		BEGIN
		    --print @pGRAFICO_UsuarioId
		    --print @pPerfilId
			SELECT	top 20 upper(a.agenciaNombre) mes, SUM(ventaimporteventa) importe
			FROM	VENTA v, AGENCIA a
			WHERE	v.ventaUsuarioAgenciaId = a.agenciaId AND
					CONVERT(DATETIME, v.ventaCreadoFecha, 112) BETWEEN CONVERT(DATETIME, @pGRAFICO_FechaInicial, 112) AND CONVERT(DATETIME, @pGRAFICO_FechaFinal_f, 112) AND
					v.ventaEstadoId = 'V' AND
					(@pGRAFICO_PaisId = 0 OR a.agenciaPaisId = @pGRAFICO_PaisId) AND
					 ((@pPerfilId = 2 AND a.agenciaId = @pGRAFICO_UsuarioId) OR (@pPerfilId <> 2)) AND
					  (@pPromotorId = 0 OR a.agenciaPromotorId = @pPromotorId)
			GROUP BY a.agenciaNombre
		    ORDER BY 2 desc

		END

	ELSE IF @pGRAFICO_Opcion = 3 --VENTAS POR PROMOTOR
		BEGIN
			SELECT	top 20 a.agenciaPromotorId, SUM(ventaimporteventa) ventaimporteventa
			INTO	#TMP_VENTAS3
			FROM	VENTA v, AGENCIA a
			WHERE	v.ventaUsuarioAgenciaId = a.agenciaId AND
					CONVERT(DATETIME, v.ventaCreadoFecha, 112) >= CONVERT(DATETIME, @pGRAFICO_FechaInicial, 112) AND CONVERT(DATETIME, v.ventaCreadoFecha, 112) <= CONVERT(DATETIME, @pGRAFICO_FechaFinal_f, 112) AND
					v.ventaEstadoId = 'V' AND
					(@pGRAFICO_PaisId=0 OR a.agenciaPaisId = @pGRAFICO_PaisId) AND 
				   ((@pPerfilId = 2 AND v.ventaUsuarioAgenciaId = @pGRAFICO_UsuarioId) OR (@pPerfilId <> 2)) AND
				    (@pPromotorId = 0 OR a.agenciaPromotorId = @pPromotorId)
			GROUP BY a.agenciaPromotorId
			order by 2 desc

			SELECT	p.usuarioNombre mes, a.ventaimporteventa importe
			FROM	#TMP_VENTAS3 a, USUARIO p
			WHERE	a.agenciaPromotorId= p.usuarioId
			ORDER by 2 desc

			DROP TABLE #TMP_VENTAS3
		END

	ELSE IF @pGRAFICO_Opcion = 4 --VENTAS POR DISTRITO
		BEGIN
			SELECT	TOP 10 v.ventaClienteDistrito mes, SUM(ventaimporteventa) importe
			FROM	VENTA v, AGENCIA a
			WHERE	v.ventaUsuarioAgenciaId = a.agenciaId AND
					CONVERT(DATETIME, v.ventaCreadoFecha, 112)
					    BETWEEN CONVERT(DATETIME, @pGRAFICO_FechaInicial, 112) AND CONVERT(DATETIME, @pGRAFICO_FechaFinal_f, 112) AND
					v.ventaEstadoId = 'V'
			        AND (@pGRAFICO_PaisId = 0 OR a.agenciaPaisId = @pGRAFICO_PaisId) AND 
			        ((@pPerfilId = 2 AND v.ventaUsuarioAgenciaId = @pGRAFICO_UsuarioId) OR (@pPerfilId <> 2)) AND
			         (@pPromotorId = 0 OR a.agenciaPromotorId = @pPromotorId)
			GROUP BY v.ventaClienteDistrito
			ORDER BY 2 DESC
		END

	ELSE IF @pGRAFICO_Opcion = 5 --VENTAS POR PRODUCTO
		BEGIN
			SELECT	top 10 p.productoNombre mes, SUM(ventaimporteventa) importe
			FROM	VENTA v, PRODUCTO p
			WHERE	v.ventaProductoId = p.productoId AND
					CONVERT(DATETIME, v.ventaCreadoFecha, 112) BETWEEN CONVERT(DATETIME, @pGRAFICO_FechaInicial, 112) AND CONVERT(DATETIME, @pGRAFICO_FechaFinal_f, 112) AND
					v.ventaEstadoId = 'V'
			  AND (@pGRAFICO_PaisId = 0 OR p.productoPaisId = @pGRAFICO_PaisId) AND
			((@pPerfilId = 2 AND v.ventaUsuarioAgenciaId = @pGRAFICO_UsuarioId) OR (@pPerfilId <> 2)) AND
			 (@pPromotorId = 0 OR (v.ventaUsuarioAgenciaId in (select agenciaid from agencia where agenciaPromotorId = @pPromotorId)))
			GROUP BY p.productoNombre
		    ORDER BY 2 desc
		END
	ELSE IF @pGRAFICO_Opcion = 6 --VENTAS POR PAIS
        BEGIN
            SELECT	top 10 p.paisNombre mes, SUM(ventaimporteventa) importe
			FROM	VENTA v, AGENCIA a, PAIS p
			WHERE	v.ventaUsuarioAgenciaId = a.agenciaId AND
					CONVERT(DATETIME, v.ventaCreadoFecha, 112) BETWEEN CONVERT(DATETIME, @pGRAFICO_FechaInicial, 112) AND CONVERT(DATETIME, @pGRAFICO_FechaFinal_f, 112) AND
					v.ventaEstadoId = 'V' AND a.agenciaPaisId = p.paisId AND
					(@pGRAFICO_PaisId = 0 OR a.agenciaPaisId = @pGRAFICO_PaisId) AND
					 ((@pPerfilId = 2 AND a.agenciaId = @pGRAFICO_UsuarioId) OR (@pPerfilId <> 2)) AND
					 (@pPromotorId = 0 OR a.agenciaPromotorId = @pPromotorId)
			GROUP BY p.paisNombre
            order by 2 desc
        END
    ELSE IF @pGRAFICO_Opcion = 7 --TOTAL VENTAS ACUMULADAS POR MES Y POR PROMOTOR
        BEGIN

            SELECT	a.agenciaPromotorId, month(v.ventaCreadoFecha) mes, year(v.ventaCreadoFecha) anho, SUM(ventaimporteventa) ventaimporteventa
			INTO	#TMP_VENTAS4
	     	FROM	VENTA v, AGENCIA a
			WHERE	v.ventaUsuarioAgenciaId = a.agenciaId AND
					CONVERT(DATETIME, v.ventaCreadoFecha, 112) BETWEEN CONVERT(DATETIME, @pGRAFICO_FechaInicial, 112) AND CONVERT(DATETIME, @pGRAFICO_FechaFinal_f, 112) AND
					v.ventaEstadoId = 'V'
			GROUP BY a.agenciaPromotorId, month(v.ventaCreadoFecha), year(v.ventaCreadoFecha)

			SELECT	(select valortiponombre from VALORES_TIPO where valortipocolumnatabla='numMesesDescripcion' and valortipoid=cast(a.mes as varchar)) +'/'+  cast(a.anho as varchar)  mes,
			       sum(a.ventaimporteventa) importe
			FROM	#TMP_VENTAS4 a, USUARIO p
			WHERE	a.agenciaPromotorId= p.usuarioId
			and a.agenciaPromotorId = @pPromotorId
			and a.anho >= year(@pGRAFICO_FechaInicial) and a.anho <= year(@pGRAFICO_FechaFinal_f)
			GROUP BY a.anho, a.mes
			order by a.anho,a.mes

			drop table #TMP_VENTAS4

        END

        ELSE IF @pGRAFICO_Opcion = 8 --TOTAL VENTAS ACUMULADAS POR AGENCIA
        BEGIN
                SELECT	a.agenciaPromotorId, a.agenciaId,replace(a.agenciaNombre,char(39),'_') agenciaNombre, SUM(ventaimporteventa) ventaimporteventa
			INTO	#TMP_VENTAS5
	     	FROM	VENTA v, AGENCIA a
			WHERE	v.ventaUsuarioAgenciaId = a.agenciaId AND
					CONVERT(DATETIME, v.ventaCreadoFecha, 112) BETWEEN CONVERT(DATETIME, @pGRAFICO_FechaInicial, 112) AND CONVERT(DATETIME, @pGRAFICO_FechaFinal_f, 112) AND
					v.ventaEstadoId = 'V'  AND (@pGRAFICO_PaisId = 0 OR a.agenciaPaisId = @pGRAFICO_PaisId)
			GROUP BY a.agenciaPromotorId, a.agenciaId,a.agenciaNombre
						
			SELECT top 20 a.agenciaNombre mes, sum(a.ventaimporteventa) importe
			FROM	#TMP_VENTAS5 a
			WHERE	(@pPromotorId = 0 or a.agenciaPromotorId = @pPromotorId)
			GROUP BY a.agenciaNombre
			order by sum(a.ventaimporteventa) desc
			
			drop table #TMP_VENTAS5
        END
        ELSE IF @pGRAFICO_Opcion = 9 --TOTAL VENTAS ACUMULADAS POR MES Y POR PROMOTOR ANTERIOR
        BEGIN
            set @vFecIni = DATEADD(year, -1, @pGRAFICO_FechaInicial);
            set @vFecFin = DATEADD(year, -1, @pGRAFICO_FechaFinal_f);

            SELECT	a.agenciaPromotorId, month(v.ventaCreadoFecha) mes, year(v.ventaCreadoFecha) anho, SUM(ventaimporteventa) ventaimporteventa
			INTO	#TMP_VENTAS6
	     	FROM	VENTA v, AGENCIA a
			WHERE	v.ventaUsuarioAgenciaId = a.agenciaId AND
					CONVERT(DATETIME, v.ventaCreadoFecha, 112) BETWEEN CONVERT(DATETIME, @vFecIni, 112) AND CONVERT(DATETIME, @vFecFin, 112) AND
					v.ventaEstadoId = 'V'
			GROUP BY a.agenciaPromotorId, month(v.ventaCreadoFecha), year(v.ventaCreadoFecha)

			SELECT	(select valortiponombre from VALORES_TIPO where valortipocolumnatabla='numMesesDescripcion' and valortipoid=cast(a.mes as varchar)) +'/'+  cast(a.anho as varchar)  mes,
			       sum(a.ventaimporteventa) importe
			FROM	#TMP_VENTAS6 a, USUARIO p
			WHERE	a.agenciaPromotorId= p.usuarioId
			and a.agenciaPromotorId = @pPromotorId
			and a.anho >= year(@vFecIni) and a.anho <= year(@vFecFin)
			GROUP BY a.anho, a.mes
			order by a.anho,a.mes

			drop table #TMP_VENTAS6

        END
        ELSE IF @pGRAFICO_Opcion = 10 --TOTAL VENTAS ACUMULADAS POR AGENCIA Anterior
        BEGIN

            set @vFecIni = DATEADD(year, -1, @pGRAFICO_FechaInicial);
            set @vFecFin = DATEADD(year, -1, @pGRAFICO_FechaFinal_f);

            SELECT	a.agenciaPromotorId, a.agenciaId,replace(a.agenciaNombre,char(39),'_') agenciaNombre, SUM(ventaimporteventa) ventaimporteventa
			INTO	#TMP_VENTAS7
	     	FROM	VENTA v, AGENCIA a
			WHERE	v.ventaUsuarioAgenciaId = a.agenciaId AND
					CONVERT(DATETIME, v.ventaCreadoFecha, 112) BETWEEN CONVERT(DATETIME, @vFecIni, 112) AND CONVERT(DATETIME, @vFecFin, 112) AND
					v.ventaEstadoId = 'V'  AND (@pGRAFICO_PaisId = 0 OR a.agenciaPaisId = @pGRAFICO_PaisId)
			GROUP BY a.agenciaPromotorId, a.agenciaId,a.agenciaNombre

			SELECT top 20 a.agenciaNombre mes, sum(a.ventaimporteventa) importe
			FROM	#TMP_VENTAS7 a
			WHERE	(@pPromotorId = 0 or a.agenciaPromotorId = @pPromotorId)
			GROUP BY a.agenciaNombre
			order by sum(a.ventaimporteventa) desc

			drop table #TMP_VENTAS7
        END
END
