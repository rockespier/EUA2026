-- Objeto: euroamer_admin_2008.Solicitud_RegistrarModificacionContacto_ws
-- Creado en BD: 2016-12-09 20:42:05
-- Modificado en BD: 2016-12-09 20:42:05
-- Extraído: 2026-09-07 08:27:16 UTC
-- Referenciado por el backend .NET: NO (revisar si sigue en uso)
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

create PROCEDURE [euroamer_admin_2008].[Solicitud_RegistrarModificacionContacto_ws]
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
		GETDATE(),
		@pSOLICITUD_Usuario)
		
		SELECT @@IDENTITY AS 'ID'; 
	
END
