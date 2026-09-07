-- Objeto: euroamer_admin_2008.Ubigeo_Procesar
-- Creado en BD: 2017-03-25 18:41:08
-- Modificado en BD: 2025-01-02 08:57:17
-- Extraído: 2026-09-07 08:27:17 UTC
-- Referenciado por el backend .NET: SI
-- Parámetros:
--   @pUbigeoId int (IN)
--   @pUbigeoDistrito varchar (IN)
--   @pUbigeoProvinciaId int (IN)
--   @pUbigeoDepartamentoId int (IN)
--   @pUbigeoActivo int (IN)
--   @pUbigeoPaisId int (IN)


CREATE PROCEDURE [Ubigeo_Procesar]
@pUbigeoId int,
@pUbigeoDistrito varchar(30),
@pUbigeoProvinciaId int,
@pUbigeoDepartamentoId int,
@pUbigeoActivo int,
@pUbigeoPaisId int
AS
BEGIN

	SET NOCOUNT ON;
	declare @tipoproceso int = 0;
declare @resultado varchar(300) = '';
declare @FechaHoraActual datetime = [euroamer_admin_2008].[fuObtenerFechaActualPeruana]();

	IF @pUbigeoId=0
		begin
		set @tipoproceso=1;
		insert into Ubigeo(		
		UbigeoDistrito,
		UbigeoProvinciaId,
		UbigeoDepartamentoId,
		UbigeoActivo,
		UbigeoPaisId)
		values(
		@pUbigeoDistrito,
		@pUbigeoProvinciaId,
		@pUbigeoDepartamentoId,
		@pUbigeoActivo,
		@pUbigeoPaisId
		)
		IF @@ROWCOUNT > 0
BEGIN
	set @resultado = 'ok'
END
		end
	ELSE
		begin
		set @tipoproceso=2;
		update Ubigeo set 
		UbigeoDistrito = @pUbigeoDistrito,
		UbigeoProvinciaId = @pUbigeoProvinciaId,
		UbigeoDepartamentoId = @pUbigeoDepartamentoId,
		UbigeoActivo = @pUbigeoActivo,
		UbigeoPaisId = @pUbigeoPaisId
		where UbigeoId = @pUbigeoId
		IF @@ROWCOUNT > 0
BEGIN
	set @resultado = 'ok'
END
		end
		select @tipoproceso as errorCodigo, @resultado as errorDescripcion
END
