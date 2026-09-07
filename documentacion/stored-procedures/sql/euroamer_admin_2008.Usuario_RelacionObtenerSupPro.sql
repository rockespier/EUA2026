-- Objeto: euroamer_admin_2008.Usuario_RelacionObtenerSupPro
-- Creado en BD: 2017-03-25 18:41:08
-- Modificado en BD: 2025-01-02 08:57:17
-- Extraído: 2026-09-07 08:27:17 UTC
-- Referenciado por el backend .NET: SI
-- Parámetros:
--   @pcaso int (IN)
--   @pUSUARIO_PaisId int (IN)
--   @pUSUARIO_PadreId int (IN)
--   @pUSUARIO_HijoId int (IN)


CREATE PROCEDURE [Usuario_RelacionObtenerSupPro]
		@pcaso INT = 0,
	    @pUSUARIO_PaisId INT = 0,
	    @pUSUARIO_PadreId INT = 0,
	    @pUSUARIO_HijoId INT = 0
	    
AS
BEGIN

	SET NOCOUNT ON;
	declare @tipoproceso int = 0;
declare @resultado varchar(300) = '';
declare @FechaHoraActual datetime = [euroamer_admin_2008].[fuObtenerFechaActualPeruana]();
if @pcaso=1
	begin
	set @tipoproceso=1;
		select usuarioid,upper(usuarioNombre) usuarioNombre 
		from USUARIO 
		where usuariopaisid=@pUSUARIO_PaisId and
		(@pUSUARIO_PadreId = 0 OR usuarioid = @pUSUARIO_PadreId) AND 
		usuarioactivo=1 
		and usuarioperfilid =4
		order by 2
		IF @@ROWCOUNT > 0
BEGIN
	set @resultado = 'ok'
END
	end
else
		Begin
		set @tipoproceso=2;

		select usuarioid,upper(usuarioNombre) usuarioNombre 
		from USUARIO 
		where usuariopaisid=@pUSUARIO_PaisId and 
		(@pUSUARIO_PadreId = 0 OR usuarioid = @pUSUARIO_PadreId) AND 
		usuarioactivo=1 
		and usuarioperfilid =6
		and usuarioid not in (select usuarioRelacionHijoId from USUARIO_RELACION where usuarioRelacionPadreId=@pUSUARIO_PadreId) 
		order by 2
		IF @@ROWCOUNT > 0
BEGIN
	set @resultado = 'ok'
END
	end	
	select @tipoproceso as errorCodigo, @resultado as errorDescripcion
END
