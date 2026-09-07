-- Objeto: euroamer_admin_2008.VentasAgenciaMensuales_Obtener
-- Creado en BD: 2018-02-05 15:26:57
-- Modificado en BD: 2026-01-07 02:59:53
-- Extraído: 2026-09-07 08:27:17 UTC
-- Referenciado por el backend .NET: SI
-- Parámetros:
--   @pPAIS_Id int (IN)
--   @pSituacion_Id varchar (IN)
--   @pAnio int (IN)
--   @pTipoReporte int (IN)
--   @pAgenciaId int (IN)
--   @pPromotorId int (IN)
--   @pMes int (IN)

CREATE PROCEDURE [euroamer_admin_2008].[VentasAgenciaMensuales_Obtener]
(
	@pPAIS_Id INT = 0,
	@pSituacion_Id VARCHAR(1) = '0',
    @pAnio INT = 0 ,
	@pTipoReporte INT,
	@pAgenciaId INT ,
	@pPromotorId INT = 0,
    @pMes INT = 0 
)
AS
BEGIN
	--exec VentasAgenciaMensuales_Obtener 1,'0',2024,1,920,0
	--exec VentasAgenciaMensuales_Obtener 1,'0',2025,1,0,0
	SET NOCOUNT ON;
	DECLARE @agenciaNombre varchar(100)
	DECLARE @promotorNombre varchar(100)
	DECLARE @Mes varchar(30)
	DECLARE @importe decimal(18,4)
	DECLARE @agenciaId integer
	DECLARE @situacionId char(1)
	DECLARE @anio integer
	DECLARE @paisId integer
	DECLARE @tipoReporte integer
	DECLARE @TOTAL decimal(18,4)
	DECLARE @PerfilId integer

	select @PerfilId = isnull(usuarioPerfilId,0) from usuario where usuarioid= @pPromotorId

	if @PerfilId <> 6 
	    begin
			set @pPromotorId = 0
		end

	print @pPromotorId
	
	CREATE TABLE #Resultado
	   (   
	   nombre varchar(100),
	   mes varchar(30),
	   importe decimal(18,4),
	   agenciaId integer,
	   situacionId char(1),
	   anio integer,
	   paisId integer,
	   tipoReporte integer,
       promotorNombre varchar(100)
	   ) 

	SET @TOTAL = 0

	IF @pTipoReporte = 1
	BEGIN
			DECLARE db_cursor CURSOR FOR	
			select top 50 UPPER(agencianombre) nombre,
			euroamer_admin_2008.Mes_RecuperarNombre(month(ventaCreadoFecha)) mes,
			sum(ventaProductoImporte) resultado,ventausuarioagenciaid,0 ventaSituacionId,
			@pAnio anio,agenciapaisid,	@pTipoReporte,euroamer_admin_2008.Usuario_RecuperarNombrexID(agencia.agenciaPromotorId)
			from venta, agencia 
			where ventaEstadoId='V'
			and ventausuarioagenciaid = agenciaid
			and (@pSituacion_Id='0' or ventaSituacionId = @pSituacion_Id)
			and year(ventaCreadoFecha) = @pAnio			
			and (@pMes = 0 or month(ventaCreadoFecha) = @pMes)
			and (@pAgenciaId=0 OR agenciaid = @pAgenciaId)
			and agenciapaisid = @pPAIS_Id
			and (@pPromotorId=0 OR agenciapromotorid = @pPromotorId) 
			group by ventausuarioagenciaid, agencianombre, month(ventaCreadoFecha),ventausuarioagenciaid,agenciapaisid,agenciaPromotorId
			order by month(ventaCreadoFecha)
			OPEN db_cursor;
		FETCH db_cursor INTO @agenciaNombre,@Mes, @importe, @agenciaId, @situacionId, @anio, @paisId, @tipoReporte, @promotorNombre
		WHILE @@FETCH_STATUS = 0
			BEGIN

			insert into #Resultado VALUES(@agenciaNombre,@Mes, @importe, @agenciaId, @situacionId, @anio, @paisId, @tipoReporte, @promotorNombre)
            print @importe;
			SET @TOTAL = @TOTAL + @importe;
			
			FETCH db_cursor INTO @agenciaNombre,@Mes, @importe, @agenciaId, @situacionId, @anio, @paisId, @tipoReporte, @promotorNombre;
			END;
		CLOSE db_cursor;
		DEALLOCATE db_cursor;
		
	END
	ELSE
	BEGIN
		DECLARE db_cursor CURSOR FOR	
		select top 50 agencianombre nombre,
		euroamer_admin_2008.Mes_RecuperarNombre(month(ventaCreadoFecha)) mes,
		count(ventaid) resultado,
		ventausuarioagenciaid,
		0,
		@pAnio anio,
		agenciapaisid,
		@pTipoReporte,
		euroamer_admin_2008.Usuario_RecuperarNombrexID(agencia.agenciaPromotorId)
		from venta, agencia 
		where ventaEstadoId='V'
		and (@pSituacion_Id='0' or ventaSituacionId = @pSituacion_Id)
		and year(ventaCreadoFecha) =@pAnio
		and ventausuarioagenciaid = agenciaid
		and (@pAgenciaId=0 OR agenciaid = @pAgenciaId)
		and agenciapaisid = @pPAIS_Id
		and (@pPromotorId=0 OR agenciapromotorid = @pPromotorId) 
		and (@pMes = 0 or month(ventaCreadoFecha) = @pMes)
		group by ventausuarioagenciaid, agencianombre, month(ventaCreadoFecha),ventausuarioagenciaid,agenciapaisid,agenciaPromotorId
		order by month(ventaCreadoFecha)
		OPEN db_cursor;
		FETCH db_cursor INTO @agenciaNombre,@Mes, @importe, @agenciaId, @situacionId, @anio, @paisId, @tipoReporte,@promotorNombre
		WHILE @@FETCH_STATUS = 0
			BEGIN

			insert into #Resultado VALUES(@agenciaNombre,@Mes, @importe, @agenciaId, @situacionId, @anio, @paisId, @tipoReporte,@promotorNombre)

			SET @TOTAL = @TOTAL + @importe;
			
			FETCH db_cursor INTO	 @agenciaNombre,@Mes, @importe, @agenciaId, @situacionId, @anio, @paisId, @tipoReporte,@promotorNombre;
			END;
		CLOSE db_cursor;
		DEALLOCATE db_cursor;
	END

	--insert into #Resultado(nombre,importe) values('Total',@TOTAL)

	select nombre, mes, importe, agenciaId, situacionId, anio, paisId,tipoReporte,promotorNombre from #Resultado, MES where mes = mesNombre order by importe desc,mesId,nombre

END

SET ANSI_NULLS ON
SET QUOTED_IDENTIFIER ON
