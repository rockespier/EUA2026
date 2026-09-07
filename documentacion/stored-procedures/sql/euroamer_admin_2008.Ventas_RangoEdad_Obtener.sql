-- Objeto: euroamer_admin_2008.Ventas_RangoEdad_Obtener
-- Creado en BD: 2025-04-03 06:09:45
-- Modificado en BD: 2025-04-29 08:52:49
-- Extraído: 2026-09-07 08:27:17 UTC
-- Referenciado por el backend .NET: SI
-- Parámetros:
--   @pGRUPO_Id int (IN)
--   @pPAIS_Id int (IN)
--   @pSituacion_Id varchar (IN)
--   @pAnio int (IN)
--   @pMes int (IN)
--   @pTipoReporte int (IN)
--   @pAgenciaId int (IN)
--   @pPromotorId int (IN)
--   @pProductoId int (IN)

CREATE PROCEDURE [euroamer_admin_2008].[Ventas_RangoEdad_Obtener]
	@pGRUPO_Id INT = 0,
    @pPAIS_Id INT = 0,
	@pSituacion_Id VARCHAR(1) = '0',
    @pAnio INT = 0 ,
    @pMes INT = 0 ,
	@pTipoReporte INT, --1 importe agrupado | 2 cantidad agrupado | 3 importe detallado | 4 cantidad agrupada
	@pAgenciaId INT ,
	@pPromotorId INT = 0,
    @pProductoId INT = 0
AS
BEGIN

	SET NOCOUNT ON;
    --exec Ventas_RangoEdad_Obtener 1,1,'0',2024,0,1,0,0,0
	--exec Ventas_RangoEdad_Obtener 1,1,'0',2024,0,2,0,0,0
    --exec Ventas_RangoEdad_Obtener 1,1,'0',2024,0,3,0,0,0

	--exec Ventas_RangoEdad_Obtener 2,1,'0',2024,0,2,0,0,0

	DECLARE @ventarangoedadNombre varchar(20),@ventarangoedadValor_min int,@ventarangoedadValor_max int,@PerfilId int
	select @PerfilId = usuarioPerfilId from usuario where usuarioid= @pPromotorId

	if @PerfilId <> 6 
	    begin
			set @pPromotorId = 0
		end

	CREATE TABLE #Resultado
	   (
	   anio int,
	   mes varchar(10),
       nombre varchar(70),
	   importe decimal(18,4)	,
	   tipoReporte integer   
	   ) 

    DECLARE db_cursor CURSOR FOR
	select UPPER(ventarangoedadNombre),ventarangoedadValor_min,ventarangoedadValor_max
	from VENTA_RANGO_EDAD where ventarangoedadGrupo_id = @pGRUPO_Id
    OPEN db_cursor;
		FETCH db_cursor INTO @ventarangoedadNombre,@ventarangoedadValor_min, @ventarangoedadValor_max
		WHILE @@FETCH_STATUS = 0
			BEGIN
                if @pTipoReporte = 1
                    begin
                        insert into #Resultado
                        select year(ventaCreadoFecha),
                               '' mes,
                               @ventarangoedadNombre nombre,
                        sum(ventaProductoImporte) resultado,@pTipoReporte
                        from venta
                        where ventaEstadoId='V'
                        and (@pSituacion_Id='0' or ventaSituacionId = @pSituacion_Id)
                        and year(ventaCreadoFecha) = @pAnio
                        and (@pMes = 0 or month(ventaCreadoFecha) = @pMes )
                        and (@pProductoId = 0 or ventaProductoId = @pProductoId)
                        and ventausuarioagenciaid in ( select agenciaid
                                                       from agencia
                                                       where agenciapaisid = @pPAIS_Id AND
                                                             (@pAgenciaId=0 OR agenciaid = @pAgenciaId) AND
                                                             (@pPromotorId=0 OR agenciapromotorid = @pPromotorId))
                        and (ventaClienteEdad >= @ventarangoedadValor_min and ventaClienteEdad <= @ventarangoedadValor_max)
                        group by year(ventaCreadoFecha)
                    end
                else
                    begin
                        if @pTipoReporte = 2
                        begin
                             insert into #Resultado
                            select year(ventaCreadoFecha),
                                   '' mes,
                                   @ventarangoedadNombre nombre,
                            count(ventaId) resultado,@pTipoReporte
                            from venta
                            where ventaEstadoId='V'
                            and (@pSituacion_Id='0' or ventaSituacionId = @pSituacion_Id)
                            and year(ventaCreadoFecha) = @pAnio
                            and (@pMes = 0 or month(ventaCreadoFecha) = @pMes )
                            and (@pProductoId = 0 or ventaProductoId = @pProductoId)
                            and ventausuarioagenciaid in ( select agenciaid
                                                           from agencia
                                                           where agenciapaisid = @pPAIS_Id AND
                                                                 (@pAgenciaId=0 OR agenciaid = @pAgenciaId) AND
                                                                 (@pPromotorId=0 OR agenciapromotorid = @pPromotorId))
                            and (ventaClienteEdad >= @ventarangoedadValor_min and ventaClienteEdad <= @ventarangoedadValor_max)
                            group by year(ventaCreadoFecha)
                        end
                        else
                            begin
                                if @pTipoReporte = 3
                                begin
                                     insert into #Resultado
                                    select year(ventaCreadoFecha),
                                           euroamer_admin_2008.Mes_RecuperarNombre(month(ventaCreadoFecha)) mes,
                                           @ventarangoedadNombre nombre,
                                    sum(ventaProductoImporte) resultado,@pTipoReporte
                                    from venta
                                    where ventaEstadoId='V'
                                    and (@pSituacion_Id='0' or ventaSituacionId = @pSituacion_Id)
                                    and year(ventaCreadoFecha) = @pAnio
                                    and (@pMes = 0 or month(ventaCreadoFecha) = @pMes )
                                    and (@pProductoId = 0 or ventaProductoId = @pProductoId)
                                    and ventausuarioagenciaid in ( select agenciaid
                                                                   from agencia
                                                                   where agenciapaisid = @pPAIS_Id AND
                                                                         (@pAgenciaId=0 OR agenciaid = @pAgenciaId) AND
                                                                         (@pPromotorId=0 OR agenciapromotorid = @pPromotorId))
                                    and (ventaClienteEdad >= @ventarangoedadValor_min and ventaClienteEdad <= @ventarangoedadValor_max)
                                    group by year(ventaCreadoFecha),month(ventaCreadoFecha)
                                end
                                else
                                    begin
                                         insert into #Resultado
                                        select year(ventaCreadoFecha),
                                               euroamer_admin_2008.Mes_RecuperarNombre(month(ventaCreadoFecha)) mes,
                                               @ventarangoedadNombre nombre,
                                        count(ventaId) resultado,@pTipoReporte
                                        from venta
                                        where ventaEstadoId='V'
                                        and (@pSituacion_Id='0' or ventaSituacionId = @pSituacion_Id)
                                        and year(ventaCreadoFecha) = @pAnio
                                        and (@pMes = 0 or month(ventaCreadoFecha) = @pMes )
                                        and (@pProductoId = 0 or ventaProductoId = @pProductoId)
                                        and ventausuarioagenciaid in ( select agenciaid
                                                                       from agencia
                                                                       where agenciapaisid = @pPAIS_Id AND
                                                                             (@pAgenciaId=0 OR agenciaid = @pAgenciaId) AND
                                                                             (@pPromotorId=0 OR agenciapromotorid = @pPromotorId))
                                        and (ventaClienteEdad >= @ventarangoedadValor_min and ventaClienteEdad <= @ventarangoedadValor_max)
                                        group by year(ventaCreadoFecha),month(ventaCreadoFecha)
                                    end
                            end
                    end

            FETCH db_cursor INTO @ventarangoedadNombre,@ventarangoedadValor_min, @ventarangoedadValor_max
			END;
		CLOSE db_cursor;
		DEALLOCATE db_cursor;
	
	select * from  #Resultado
END
