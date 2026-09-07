-- Objeto: euroamer_admin_2008.VentasAgencia_Obtener
-- Creado en BD: 2018-02-02 13:11:02
-- Modificado en BD: 2025-10-01 03:15:24
-- Extraído: 2026-09-07 08:27:17 UTC
-- Referenciado por el backend .NET: SI
-- Parámetros:
--   @pPAIS_Id int (IN)
--   @pSituacion_Id varchar (IN)
--   @pAnio int (IN)
--   @pTipoReporte int (IN)
--   @pPromotorId int (IN)

CREATE PROCEDURE [euroamer_admin_2008].[VentasAgencia_Obtener]
(
	@pPAIS_Id INT = 0,
	@pSituacion_Id VARCHAR(1) = '0',
    @pAnio INT = 0 ,
	@pTipoReporte INT,
	@pPromotorId INT = 0 
)
AS
BEGIN
	--VentasAgencia_Obtener 1,'0',2025,1,0
	SET NOCOUNT ON;

	DECLARE @agenciaNombre varchar(100)
	DECLARE @importe decimal(18,4)
	DECLARE @agenciaId integer
	DECLARE @situacionId char(1)
	DECLARE @anio integer
	DECLARE @paisId integer
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

		DECLARE db_cursor CURSOR FOR		
		select top 20 agencianombre,sum(ventaProductoImporte) Importe,ventausuarioagenciaid,'' ventaSituacionId,@pAnio Anio,agenciapaisid,@pTipoReporte TipoReporte
		from venta, agencia 
		where ventaEstadoId='V'	and 
		(@pSituacion_Id = '0' or ventaSituacionId = @pSituacion_Id) AND
		year(ventaCreadoFecha) = @pAnio AND
		ventausuarioagenciaid = agenciaid AND 
		(@pPromotorId=0 OR agenciapromotorid = @pPromotorId) AND
		(@pPAIS_Id=0 OR agenciapaisid = @pPAIS_Id) 
		group by ventausuarioagenciaid, agencianombre,agenciapaisid
		order by sum(ventaproductoImporte) desc; 

		OPEN db_cursor;
		FETCH db_cursor INTO @agenciaNombre, @importe, @agenciaId, @situacionId, @anio, @paisId, @tipoReporte
		WHILE @@FETCH_STATUS = 0
			BEGIN

			insert into #Resultado VALUES(@agenciaNombre, @importe, @agenciaId, @situacionId, @anio, @paisId, @tipoReporte)

			SET @TOTAL = @TOTAL + @importe;
			
			FETCH db_cursor INTO	 @agenciaNombre, @importe, @agenciaId, @situacionId, @anio, @paisId, @tipoReporte;
			END;
		CLOSE db_cursor;
		DEALLOCATE db_cursor;

	END
	ELSE
	BEGIN

		--Anual
		DECLARE db_cursor CURSOR FOR 
		select top 20 agencianombre ,count(ventaid) cantidad,ventausuarioagenciaid,'' ventaSituacionId
		,@pAnio Anio,agenciapaisid,@pTipoReporte TipoReporte
		from venta, agencia 
		where ventaEstadoId='V' and
		(@pSituacion_Id = '0' or ventaSituacionId = @pSituacion_Id) AND 
		year(ventaCreadoFecha) = @pAnio AND
		ventausuarioagenciaid = agenciaid AND 
		(@pPromotorId=0 OR agenciapromotorid = @pPromotorId) AND
		(@pPAIS_Id=0 OR agenciapaisid = @pPAIS_Id) 
		group by ventausuarioagenciaid, agencianombre,agenciapaisid		
		order by count(ventaid) desc

		OPEN db_cursor;
		FETCH db_cursor INTO @agenciaNombre, @importe, @agenciaId, @situacionId, @anio, @paisId, @tipoReporte
		WHILE @@FETCH_STATUS = 0
			BEGIN

			insert into #Resultado VALUES(@agenciaNombre, @importe, @agenciaId, @situacionId, @anio, @paisId, @tipoReporte)

			SET @TOTAL = @TOTAL + @importe;
			
			FETCH db_cursor INTO	 @agenciaNombre, @importe, @agenciaId, @situacionId, @anio, @paisId, @tipoReporte;
			END;
		CLOSE db_cursor;
		DEALLOCATE db_cursor;
	END

	--insert into #Resultado(nombre,importe) values('Total',@TOTAL)

	select * from #Resultado
END

SET ANSI_NULLS ON
SET QUOTED_IDENTIFIER ON
