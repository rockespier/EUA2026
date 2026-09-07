-- Objeto: euroamer_admin_2008.Solicitud_RegistrarModificacionContacto
-- Creado en BD: 2014-06-13 22:53:34
-- Modificado en BD: 2025-01-02 08:57:22
-- Extraído: 2026-09-07 08:27:16 UTC
-- Referenciado por el backend .NET: SI
-- Parámetros:
--   @pSOLICITUD_VentaId int (IN)
--   @pSOLICITUD_ContactoNombre varchar (IN)
--   @pSOLICITUD_ContactoDireccion varchar (IN)
--   @pSOLICITUD_ContactoDistrito varchar (IN)
--   @pSOLICITUD_ContactoPais varchar (IN)
--   @pSOLICITUD_ContactoTelefono varchar (IN)
--   @pSOLICITUD_ContactoEmail varchar (IN)
--   @pSOLICITUD_Motivo text (IN)
--   @pSOLICITUD_Usuario int (IN)


CREATE PROCEDURE [Solicitud_RegistrarModificacionContacto]
	@pSOLICITUD_VentaId INT,
	@pSOLICITUD_ContactoNombre VARCHAR(100),
	@pSOLICITUD_ContactoDireccion VARCHAR(255),
	@pSOLICITUD_ContactoDistrito VARCHAR(50),
	@pSOLICITUD_ContactoPais VARCHAR(50),
	@pSOLICITUD_ContactoTelefono VARCHAR(50),
	@pSOLICITUD_ContactoEmail VARCHAR(100),
	@pSOLICITUD_Motivo TEXT='',
	@pSOLICITUD_Usuario INT
AS
BEGIN
	
	SET NOCOUNT ON;
	declare @tipoproceso int = 0;
declare @resultado varchar(300) = '';
declare @FechaHoraActual datetime = [euroamer_admin_2008].[fuObtenerFechaActualPeruana]();
	INSERT INTO SOLICITUD (
		solicitudVentaId,
		solicitudTipoId,
		solicitudEstadoId,
		solicitudContactoNombre,
		solicitudContactoDireccion,
		solicitudContactoDistrito,
		solicitudContactoPais,
		solicitudContactoTelefono,
		solicitudContactoEmail,
		solicitudMotivo,
		solicitudCreadoFecha,
		solicitudCreadoUsuarioId)
	VALUES (
		@pSOLICITUD_VentaId, 
		6, 
		'P',
		@pSOLICITUD_ContactoNombre,
		@pSOLICITUD_ContactoDireccion,
		@pSOLICITUD_ContactoDistrito,
		@pSOLICITUD_ContactoPais,
		@pSOLICITUD_ContactoTelefono,
		@pSOLICITUD_ContactoEmail,
		@pSOLICITUD_Motivo,
		@FechaHoraActual,
		@pSOLICITUD_Usuario)
	set @tipoproceso=1;

IF @@ROWCOUNT > 0
BEGIN
	set @resultado = 'ok'
END

select @tipoproceso as errorCodigo, @resultado as errorDescripcion

END
