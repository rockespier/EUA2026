-- Objeto: euroamer_admin_2008.VentasPaisAnual_Obtener_old
-- Creado en BD: 2026-02-26 08:36:19
-- Modificado en BD: 2026-02-26 08:36:19
-- Extraído: 2026-09-07 08:27:17 UTC
-- Referenciado por el backend .NET: NO (revisar si sigue en uso)
-- Parámetros:
--   @pAnio int (IN)
--   @pTipoReporte int (IN)

CREATE PROCEDURE [euroamer_admin_2008].[VentasPaisAnual_Obtener_old]
(

    @pAnio INT = 0 ,
	@pTipoReporte INT =1

)
AS
BEGIN
	--VentasPaisAnual_Obtener_old 2025,1
	--VentasPaisAnual_Obtener_old 2026,1
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
	 select paisnombre Pais,
	 '',
	 sum(ventaProductoImporte) resultado,
	 0 usuarioId,
			0 ventaSituacionId,
			@pAnio anio,
			agenciapaisid,
			@pTipoReporte
		from venta, agencia, pais
		where ventaEstadoId='V'
		and year(ventaCreadoFecha) = @pAnio
		and ventausuarioagenciaid = agenciaid
		and agenciapaisid = paisid
		group by paisnombre,  agenciapaisid
		order by sum(ventaproductoImporte) desc
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
	 '',
	 count(ventaid) resultado,
	 0 usuarioId,
			0 ventaSituacionId,
			@pAnio anio,
			agenciapaisid,
			@pTipoReporte
		from venta, agencia, pais
		where ventaEstadoId='V'
		and year(ventaCreadoFecha) = @pAnio
		and ventausuarioagenciaid = agenciaid
		and agenciapaisid = paisid
		group by paisnombre,  agenciapaisid
		order by count(ventaid) desc
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
