-- Objeto: euroamer_admin_2008.VentasPaisMensual_Obtener
-- Creado en BD: 2018-03-16 13:44:53
-- Modificado en BD: 2025-12-31 07:04:52
-- Extraído: 2026-09-07 08:27:17 UTC
-- Referenciado por el backend .NET: SI
-- Parámetros:
--   @pAnio int (IN)
--   @pPaisId int (IN)
--   @pTipoReporte int (IN)
--   @pPromotorId int (IN)
--   @pMes int (IN)

CREATE PROCEDURE [euroamer_admin_2008].[VentasPaisMensual_Obtener]
(
	
    @pAnio INT = 0 ,
	@pPaisId INT = 0,
	@pTipoReporte INT =1,
    @pPromotorId INT = 0,
    @pMes INT = 0
	
)
AS
BEGIN
	--VentasPaisMensual_Obtener 2025,2,1,133
	SET NOCOUNT ON;
	DECLARE @Nombre varchar(100)
	DECLARE @Mes varchar(30)
	DECLARE @importe decimal(18,4)
	DECLARE @agenciaId integer
	DECLARE @situacionId char(1)
	DECLARE @anio integer
	DECLARE @paisId integer
	DECLARE @tipoReporte integer
	DECLARE @TOTAL decimal(18,4)
	

	CREATE TABLE #Resultado
	   (   
	   nombre varchar(100),
	   mes varchar(30),
	   importe decimal(18,4),
	   agenciaId integer,
	   situacionId char(1),
	   anio integer,
	   paisId integer,
	   tipoReporte integer
	   ) 

	SET @TOTAL = 0

	IF @pTipoReporte = 1
	BEGIN
	 --Importe
	  DECLARE db_cursor CURSOR FOR
	 select UPPER(paisnombre) Pais,
	 euroamer_admin_2008.Mes_RecuperarNombre(month(ventaCreadoFecha)) mes,
	 sum(ventaProductoImporte) resultado,
	 0 usuarioId,
			0 ventaSituacionId,
			@pAnio anio,
			agenciapaisid,
			@pTipoReporte
		from venta, agencia, pais 
		where ventaEstadoId='V'
		--and ventaSituacionId='C'
		and year(ventaCreadoFecha) = @pAnio
		  and (@pMes = 0 or month(ventaCreadoFecha) = @pMes)
		and ventausuarioagenciaid = agenciaid
		and agenciapaisid = paisid
		and (@pPaisId = agenciapaisid or @pPaisId = 0)
		and (@pPromotorId = 0 or agenciaPromotorId = @pPromotorId)
		group by paisnombre,month(ventaCreadoFecha),  agenciapaisid
		order by month(ventaCreadoFecha) 
		OPEN db_cursor;
			FETCH db_cursor INTO @Nombre,@mes, @importe, @agenciaId, @situacionId, @anio, @paisId, @tipoReporte
			WHILE @@FETCH_STATUS = 0
				BEGIN

				insert into #Resultado VALUES(@Nombre,@mes, @importe, @agenciaId, @situacionId, @anio, @paisId, @tipoReporte)

				SET @TOTAL = @TOTAL + @importe;
			
				FETCH db_cursor INTO	 @Nombre,@mes, @importe, @agenciaId, @situacionId, @anio, @paisId, @tipoReporte;
				END;
			CLOSE db_cursor;
			DEALLOCATE db_cursor;  
	 				   
			
	END
	ELSE
	BEGIN
	DECLARE db_cursor CURSOR FOR
		 select paisnombre Pais,
	 euroamer_admin_2008.Mes_RecuperarNombre(month(ventaCreadoFecha)) mes,
	 count(ventaid) resultado,
	 0 usuarioId,
			0 ventaSituacionId,
			@pAnio anio,
			agenciapaisid,
			@pTipoReporte
		from venta, agencia, pais 
		where ventaEstadoId='V'
		--and ventaSituacionId='C'
		and year(ventaCreadoFecha) = @pAnio
		  and (@pMes = 0 or month(ventaCreadoFecha) = @pMes)
		and ventausuarioagenciaid = agenciaid
		and agenciapaisid = paisid
		and (@pPaisId = agenciapaisid or @pPaisId = 0)
		and (@pPromotorId = 0 or agenciaPromotorId = @pPromotorId)
		group by paisnombre,month(ventaCreadoFecha),  agenciapaisid
		order by month(ventaCreadoFecha) 
		OPEN db_cursor;
			FETCH db_cursor INTO @Nombre,@mes, @importe, @agenciaId, @situacionId, @anio, @paisId, @tipoReporte
			WHILE @@FETCH_STATUS = 0
				BEGIN

				insert into #Resultado VALUES(@Nombre,@mes, @importe, @agenciaId, @situacionId, @anio, @paisId, @tipoReporte)

				SET @TOTAL = @TOTAL + @importe;
			
				FETCH db_cursor INTO	 @Nombre,@mes, @importe, @agenciaId, @situacionId, @anio, @paisId, @tipoReporte;
				END;
			CLOSE db_cursor;
			DEALLOCATE db_cursor;  				
	END

	--insert into #Resultado(Nombre,mes,importe) values('','Total',@TOTAL)
	select nombre, mes, importe, agenciaId, situacionId, anio, paisId,tipoReporte from #Resultado, MES where mes = mesNombre order by importe desc,mesId,nombre

END

SET ANSI_NULLS ON
SET QUOTED_IDENTIFIER ON
