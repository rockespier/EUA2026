-- Objeto: euroamer_admin_2008.VentasPromotorMensuales_Obtener
-- Creado en BD: 2018-02-19 13:16:43
-- Modificado en BD: 2025-10-28 02:58:40
-- Extraído: 2026-09-07 08:27:17 UTC
-- Referenciado por el backend .NET: SI
-- Parámetros:
--   @pPAIS_Id int (IN)
--   @pAnio int (IN)
--   @pTipoReporte int (IN)
--   @pPromotorId int (IN)

CREATE PROCEDURE [euroamer_admin_2008].[VentasPromotorMensuales_Obtener]
(
	@pPAIS_Id INT = 0,	
    @pAnio INT = 0 ,
	@pTipoReporte INT,
	@pPromotorId INT 
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
if @pPromotorId > 0
    begin
	IF @pTipoReporte = 1
	BEGIN
		    --Importe
			DECLARE db_cursor CURSOR FOR
			select top 20 UPPER(usuarionombre) usuarionombre, 
			euroamer_admin_2008.Mes_RecuperarNombre(month(ventaCreadoFecha)) mes,
			sum(ventaimporteventa) resultado,
			usuarioid,
			0 ventaSituacionId,
			@pAnio anio,
			agenciapaisid,
			@pTipoReporte
			from venta, agencia , usuario
			where ventaEstadoId='V'			
			and year(ventaCreadoFecha) = @pAnio
			and ventausuarioagenciaid = agenciaid
			and usuarioid = agenciapromotorid
			and (@pPAIS_Id = 0 or agenciapaisid = @pPAIS_Id)
			and (@pPromotorId = 0 or usuarioid = @pPromotorId)
			group by usuarioid,usuarionombre, month(ventaCreadoFecha),agenciapaisid
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
		select top 20 usuarionombre, 
			euroamer_admin_2008.Mes_RecuperarNombre(month(ventaCreadoFecha)) mes,
			count(ventaid) resultado,
			usuarioid,
			0 ventaSituacionId,
			@pAnio anio,
			agenciapaisid,
			@pTipoReporte
			from venta, agencia , usuario
			where ventaEstadoId='V'			
			and year(ventaCreadoFecha) = @pAnio
			and ventausuarioagenciaid = agenciaid
			and usuarioid = agenciapromotorid
			and (@pPAIS_Id = 0 or agenciapaisid = @pPAIS_Id)
			and (@pPromotorId = 0 or usuarioid = @pPromotorId)
			group by usuarioid,usuarionombre, month(ventaCreadoFecha),agenciapaisid
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
	--insert into #Resultado(Nombre,importe) values('Total',@TOTAL)
end
	select * from #Resultado
END

SET ANSI_NULLS ON
SET QUOTED_IDENTIFIER ON
