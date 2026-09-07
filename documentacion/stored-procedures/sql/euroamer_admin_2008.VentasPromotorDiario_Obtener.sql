-- Objeto: euroamer_admin_2008.VentasPromotorDiario_Obtener
-- Creado en BD: 2018-02-20 15:15:33
-- Modificado en BD: 2025-10-28 03:01:08
-- Extraído: 2026-09-07 08:27:17 UTC
-- Referenciado por el backend .NET: SI
-- Parámetros:
--   @pPAIS_Id int (IN)
--   @pAnio int (IN)
--   @pTipoReporte int (IN)
--   @pPromotorId int (IN)
--   @pMesId int (IN)

CREATE PROCEDURE [euroamer_admin_2008].[VentasPromotorDiario_Obtener]
(
	@pPAIS_Id INT = 0,	
    @pAnio INT = 0 ,
	@pTipoReporte INT =1,
	@pPromotorId INT = 0,
	@pMesId INT = 0
)
AS
BEGIN
	
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
	 select usuarionombre, 
	 day(ventaCreadoFecha),
	 sum(ventaimporteventa) resultado,
	 usuarioid,
					0 ventaSituacionId,
					@pAnio anio,
					agenciapaisid,
					@pTipoReporte
		from venta, agencia , usuario
		where ventaEstadoId='V'
		--and ventaSituacionId='C'
		and year(ventaCreadoFecha) = @pAnio
		and month(ventaCreadoFecha) = @pMesId
		and ventausuarioagenciaid = agenciaid
		and usuarioid = agenciapromotorid
		and agenciapaisid = @pPAIS_Id
		and usuarioid = @pPromotorId
		group by usuarionombre, day(ventaCreadoFecha),usuarioid,agenciapaisid
		order by day(ventaCreadoFecha)
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
			select usuarionombre, 
			 day(ventaCreadoFecha),
			 count(ventaid) resultado,
			 usuarioid,
							0 ventaSituacionId,
							@pAnio anio,
							agenciapaisid,
							@pTipoReporte
				from venta, agencia , usuario
				where ventaEstadoId='V'
				--and ventaSituacionId='C'
				and year(ventaCreadoFecha) = @pAnio
				and month(ventaCreadoFecha) = @pMesId
				and ventausuarioagenciaid = agenciaid
				and usuarioid = agenciapromotorid
				and agenciapaisid = @pPAIS_Id
				and usuarioid = @pPromotorId
				group by usuarionombre, day(ventaCreadoFecha),usuarioid,agenciapaisid
				order by day(ventaCreadoFecha)
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

	--insert into #Resultado(nombre,importe) values('Total',@TOTAL)	
	select * from #Resultado

END

SET ANSI_NULLS ON
SET QUOTED_IDENTIFIER ON
