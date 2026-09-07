-- Objeto: euroamer_admin_2008.VentasProductoMensuales_Obtener
-- Creado en BD: 2025-03-25 09:23:57
-- Modificado en BD: 2025-03-27 08:28:17
-- Extraído: 2026-09-07 08:27:17 UTC
-- Referenciado por el backend .NET: SI
-- Parámetros:
--   @pPAIS_Id int (IN)
--   @pSituacion_Id varchar (IN)
--   @pAnio int (IN)
--   @pTipoReporte int (IN)
--   @pAgenciaId int (IN)
--   @pPromotorId int (IN)
--   @pProductoId int (IN)

CREATE PROCEDURE [euroamer_admin_2008].[VentasProductoMensuales_Obtener]
(
	@pPAIS_Id INT = 0,
	@pSituacion_Id VARCHAR(1) = '',
    @pAnio INT = 0 ,
	@pTipoReporte INT,
	@pAgenciaId INT ,
	@pPromotorId INT = 0,
    @pProductoId INT = 0 
)
AS
BEGIN
	--exec VentasProductoMensuales_Obtener 1,'',2025,1,0,0
	SET NOCOUNT ON;
	DECLARE @agenciaNombre varchar(100)
	DECLARE @Mes varchar(30)
	DECLARE @importe decimal(18,4)
	DECLARE @situacionId char(1)
	DECLARE @anio integer
	DECLARE @tipoReporte integer
	DECLARE @TOTAL decimal(18,4)
	DECLARE @PerfilId integer

	select @PerfilId = usuarioPerfilId from usuario where usuarioid= @pPromotorId

	if @PerfilId <> 6 
	    begin
			set @pPromotorId = 0
		end

	CREATE TABLE #Resultado
	   (   
	   nombre varchar(100),
	   mes varchar(30),
	   importe decimal(18,4),
	   situacionId char(1),
	   anio integer,
	   tipoReporte integer
	   ) 

	SET @TOTAL = 0

	IF @pTipoReporte = 1
	BEGIN
			DECLARE db_cursor CURSOR FOR	
			select productoNombre,
			euroamer_admin_2008.Mes_RecuperarNombre(month(ventaCreadoFecha)) mes,
			sum(ventaProductoImporte) resultado,
			0 ventaSituacionId,
			@pAnio anio,
			@pTipoReporte
			from venta, PRODUCTO
			where ventaEstadoId='V'
		    and ventaProductoId = productoId
			and (@pSituacion_Id='0' or ventaSituacionId = @pSituacion_Id)
			and year(ventaCreadoFecha) = @pAnio
			and (@pProductoId = 0 or productoId = @pProductoId)
			and ventausuarioagenciaid in ( select agenciaid
			                               from agencia
			                               where agenciapaisid = @pPAIS_Id AND
			                                     (@pAgenciaId=0 OR agenciaid = @pAgenciaId) AND
			                                     (@pPromotorId=0 OR agenciapromotorid = @pPromotorId))
			group by ventaProductoId, productoNombre, month(ventaCreadoFecha)
			order by month(ventaCreadoFecha),productoNombre
			OPEN db_cursor;
		FETCH db_cursor INTO @agenciaNombre,@Mes, @importe,  @situacionId, @anio,  @tipoReporte
		WHILE @@FETCH_STATUS = 0
			BEGIN

			insert into #Resultado VALUES(@agenciaNombre,@Mes, @importe,  @situacionId, @anio,  @tipoReporte)

			SET @TOTAL = @TOTAL + @importe;
			
			FETCH db_cursor INTO	 @agenciaNombre,@Mes, @importe,  @situacionId, @anio,  @tipoReporte;
			END;
		CLOSE db_cursor;
		DEALLOCATE db_cursor;
		
	END
	ELSE
	BEGIN
		DECLARE db_cursor CURSOR FOR	
		select productonombre,
		euroamer_admin_2008.Mes_RecuperarNombre(month(ventaCreadoFecha)) mes,
		count(ventaid) resultado,
		0,
		@pAnio anio,
		@pTipoReporte
		from venta, PRODUCTO
		where ventaEstadoId='V'
		and (@pSituacion_Id='0' or ventaSituacionId = @pSituacion_Id)
		and ventaProductoId = productoId
		and (@pProductoId = 0 or productoId = @pProductoId)
		and year(ventaCreadoFecha) =@pAnio
		and ventausuarioagenciaid in ( select agenciaid
		                               from agencia
		                               where agenciapaisid = @pPAIS_Id AND
		                                     (@pAgenciaId=0 OR agenciaid = @pAgenciaId) AND
		                                     (@pPromotorId=0 OR agenciapromotorid = @pPromotorId))
		group by ventaProductoId, productonombre, month(ventaCreadoFecha)
		order by month(ventaCreadoFecha),productoNombre
		OPEN db_cursor;
		FETCH db_cursor INTO @agenciaNombre,@Mes, @importe, @situacionId, @anio, @tipoReporte
		WHILE @@FETCH_STATUS = 0
			BEGIN

			insert into #Resultado VALUES(@agenciaNombre,@Mes, @importe, @situacionId, @anio, @tipoReporte)

			SET @TOTAL = @TOTAL + @importe;
			
			FETCH db_cursor INTO	 @agenciaNombre,@Mes, @importe, @situacionId, @anio, @tipoReporte;
			END;
		CLOSE db_cursor;
		DEALLOCATE db_cursor;
	END

	--insert into #Resultado(nombre,importe) values('Total',@TOTAL)

	select * from #Resultado

END

SET ANSI_NULLS ON
SET QUOTED_IDENTIFIER ON
