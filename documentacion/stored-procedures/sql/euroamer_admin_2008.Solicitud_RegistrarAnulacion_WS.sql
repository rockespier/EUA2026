-- Objeto: euroamer_admin_2008.Solicitud_RegistrarAnulacion_WS
-- Creado en BD: 2016-12-09 20:42:05
-- Modificado en BD: 2016-12-09 20:42:05
-- Extraído: 2026-09-07 08:27:16 UTC
-- Referenciado por el backend .NET: NO (revisar si sigue en uso)
-- Parámetros:
--   @pSOLICITUD_VentaId int (IN)
--   @pSOLICITUD_Motivo text (IN)
--   @pSOLICITUD_Adjunto varchar (IN)
--   @pSOLICITUD_Usuario int (IN)

create PROCEDURE [euroamer_admin_2008].[Solicitud_RegistrarAnulacion_WS]
	@pSOLICITUD_VentaId INT,
	@pSOLICITUD_Motivo TEXT,
	@pSOLICITUD_Adjunto VARCHAR(20),
	@pSOLICITUD_Usuario INT
AS
BEGIN
	
	SET NOCOUNT ON;

	INSERT INTO SOLICITUD (
		solicitudVentaId,
		solicitudTipoId,
		solicitudEstadoId,
		solicitudMotivo,
		solicitudAdjunto,
		solicitudCreadoFecha,
		solicitudCreadoUsuarioId)
	VALUES (
		@pSOLICITUD_VentaId, 
		1, 
		'P',
		@pSOLICITUD_Motivo,
		@pSOLICITUD_Adjunto,
		GETDATE(),
		@pSOLICITUD_Usuario)
		
	  SELECT @@IDENTITY AS 'ID'; 
END
