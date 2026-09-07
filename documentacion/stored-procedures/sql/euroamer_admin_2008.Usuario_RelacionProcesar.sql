-- Objeto: euroamer_admin_2008.Usuario_RelacionProcesar
-- Creado en BD: 2017-03-25 18:41:08
-- Modificado en BD: 2025-01-02 08:57:18
-- Extraído: 2026-09-07 08:27:17 UTC
-- Referenciado por el backend .NET: SI
-- Parámetros:
--   @pUSUARIO_PadreId int (IN)
--   @pUSUARIO_PadrePerfilId int (IN)
--   @pUSUARIO_HijoId int (IN)
--   @pUSUARIO_HijoPerfilId int (IN)
--   @pUSUARIO_PadreId_n int (IN)
--   @pUSUARIO_HijoId_n int (IN)



CREATE PROCEDURE [Usuario_RelacionProcesar]
	@pUSUARIO_PadreId INT = 0,
	@pUSUARIO_PadrePerfilId INT = 0,
	@pUSUARIO_HijoId INT = 0,
	@pUSUARIO_HijoPerfilId INT = 0,
	@pUSUARIO_PadreId_n INT = 0,
	@pUSUARIO_HijoId_n INT = 0
	
AS
BEGIN
	
	SET NOCOUNT ON;
	declare @tipoproceso int = 0;
declare @resultado varchar(300) = '';
declare @FechaHoraActual datetime = [euroamer_admin_2008].[fuObtenerFechaActualPeruana]();
	DECLARE @wCantidadEncontrados as int=0;
	DECLARE @wCantidadEncontradosActualizar as int=0;
	DECLARE @wPadreIDFinal as int=0;
	
	if @pUSUARIO_PadreId= 0
		 begin
		 --print 'x0';
		  		select @wCantidadEncontrados = COUNT(*) from USUARIO_RELACION
				where usuarioRelacionPadreId = @pUSUARIO_PadreId_n AND 
			  usuarioRelacionPadrePerfilId = @pUSUARIO_PadrePerfilId AND 
			  usuarioRelacionHijoId = @pUSUARIO_HijoId_n AND 
			  usuarioRelacionHijoPerfilId = @pUSUARIO_HijoPerfilId 
		 end
	else
		 begin
		 print 'x1';
		  		select @wCantidadEncontrados = COUNT(*) from USUARIO_RELACION
				where usuarioRelacionPadreId = @pUSUARIO_PadreId AND 
			  usuarioRelacionPadrePerfilId = @pUSUARIO_PadrePerfilId AND 
			  usuarioRelacionHijoId = @pUSUARIO_HijoId AND 
			  usuarioRelacionHijoPerfilId = @pUSUARIO_HijoPerfilId 
		 end
	
		
	--print @wCantidadEncontrados;



    IF @wCantidadEncontrados = 0
		BEGIN
		 --print 'inserto';
		 set @tipoproceso=1;
			INSERT INTO USUARIO_RELACION (
				usuarioRelacionPadreId, 
				usuarioRelacionPadrePerfilId, 
				usuarioRelacionHijoId, 
				usuarioRelacionHijoPerfilId)
            VALUES (
				@pUSUARIO_PadreId_n, 
				@pUSUARIO_PadrePerfilId, 
				@pUSUARIO_HijoId_n, 
				@pUSUARIO_HijoPerfilId)
				IF @@ROWCOUNT > 0
BEGIN
	set @resultado = 'ok'
END
		END
	ELSE
		BEGIN
		 if @pUSUARIO_PadreId <> 0
		 begin
		  select @wCantidadEncontradosActualizar = COUNT(*) from USUARIO_RELACION
		  where usuarioRelacionPadreId = @pUSUARIO_PadreId_n AND 
		  usuarioRelacionPadrePerfilId = @pUSUARIO_PadrePerfilId AND 
		  usuarioRelacionHijoId = @pUSUARIO_HijoId_n AND 
		  usuarioRelacionHijoPerfilId = @pUSUARIO_HijoPerfilId 
		  --print @wCantidadEncontradosActualizar;
		  IF @wCantidadEncontradosActualizar = 0
			BEGIN
			 --print 'actualizao';
			 set @tipoproceso=2;
				UPDATE USUARIO_RELACION SET 
					usuarioRelacionPadreId = @pUSUARIO_PadreId_n, 
					usuarioRelacionPadrePerfilId = @pUSUARIO_PadrePerfilId,
					usuarioRelacionHijoId = @pUSUARIO_HijoId_n,
					usuarioRelacionHijoPerfilId = @pUSUARIO_HijoPerfilId 
				WHERE usuarioRelacionPadreId = @pUSUARIO_PadreId AND 
					usuarioRelacionPadrePerfilId = @pUSUARIO_PadrePerfilId AND 
					usuarioRelacionHijoId = @pUSUARIO_HijoId AND 
					usuarioRelacionHijoPerfilId = @pUSUARIO_HijoPerfilId 
				end
				IF @@ROWCOUNT > 0
BEGIN
	set @resultado = 'ok'
END
		end		
		END
		select @tipoproceso as errorCodigo, @resultado as errorDescripcion
END
