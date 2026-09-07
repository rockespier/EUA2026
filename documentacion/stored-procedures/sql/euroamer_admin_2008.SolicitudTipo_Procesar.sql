-- Objeto: euroamer_admin_2008.SolicitudTipo_Procesar
-- Creado en BD: 2013-12-24 08:50:59
-- Modificado en BD: 2025-01-02 08:57:16
-- Extraído: 2026-09-07 08:27:17 UTC
-- Referenciado por el backend .NET: SI
-- Parámetros:
--   @pSOLICITUDTIPO_Id int (IN)
--   @pSOLICITUDTIPO_AccionId char (IN)
--   @pSOLICITUDTIPO_Nombre varchar (IN)
--   @pSOLICITUDTIPO_EnviarCorreo int (IN)
--   @pSOLICITUDTIPO_Usuario int (IN)
--   @pSOLICITUDTIPO_Activo int (IN)


CREATE PROCEDURE [SolicitudTipo_Procesar]
	@pSOLICITUDTIPO_Id INT = 0,
	@pSOLICITUDTIPO_AccionId CHAR(1),
	@pSOLICITUDTIPO_Nombre VARCHAR(100),
	@pSOLICITUDTIPO_EnviarCorreo INT,
	@pSOLICITUDTIPO_Usuario INT,
	@pSOLICITUDTIPO_Activo INT
AS
BEGIN
	
	SET NOCOUNT ON;
	declare @tipoproceso int = 0;
declare @resultado varchar(300) = '';
declare @FechaHoraActual datetime = [euroamer_admin_2008].[fuObtenerFechaActualPeruana]();

	IF @pSOLICITUDTIPO_Id = 0
		BEGIN
		set @tipoproceso=1;
			INSERT INTO SOLICITUD_TIPO (
				solicitudtipoAccionId,
				solicitudtipoNombre,
				solicitudtipoEnviarCorreo,
				solicitudtipoCreadoFecha,
				solicitudtipoCreadoUsuarioId,
				solicitudtipoModificadoFecha,
				solicitudtipoModificadoUsuarioId,
				solicitudtipoActivo)
			VALUES (
				@pSOLICITUDTIPO_AccionId, 
				@pSOLICITUDTIPO_Nombre, 
				@pSOLICITUDTIPO_EnviarCorreo,
				@FechaHoraActual,
				@pSOLICITUDTIPO_Usuario,
				@FechaHoraActual,
				@pSOLICITUDTIPO_Usuario,
				1)
				IF @@ROWCOUNT > 0
BEGIN
	set @resultado = 'ok'
END
		END
	ELSE
		BEGIN
		set @tipoproceso=2;
			UPDATE SOLICITUD_TIPO SET 
				solicitudtipoAccionId = @pSOLICITUDTIPO_AccionId,
				solicitudtipoNombre = @pSOLICITUDTIPO_Nombre,
				solicitudtipoEnviarCorreo = @pSOLICITUDTIPO_EnviarCorreo,
				solicitudtipoModificadoFecha = @FechaHoraActual,
				solicitudtipoModificadoUsuarioId = @pSOLICITUDTIPO_Usuario,
				solicitudtipoActivo = @pSOLICITUDTIPO_Activo
			WHERE solicitudtipoId = @pSOLICITUDTIPO_Id
			IF @@ROWCOUNT > 0
BEGIN
	set @resultado = 'ok'
END
		END    

		select @tipoproceso as errorCodigo, @resultado as errorDescripcion

END
