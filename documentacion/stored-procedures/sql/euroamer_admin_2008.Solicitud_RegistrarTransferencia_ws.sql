-- Objeto: euroamer_admin_2008.Solicitud_RegistrarTransferencia_ws
-- Creado en BD: 2016-12-09 20:42:05
-- Modificado en BD: 2016-12-09 20:42:05
-- Extraído: 2026-09-07 08:27:17 UTC
-- Referenciado por el backend .NET: NO (revisar si sigue en uso)
-- Parámetros:
--   @pSOLICITUD_VentaId int (IN)
--   @pSOLICITUD_AgenciaId int (IN)
--   @pSOLICITUD_AgenciaUsuarioId int (IN)
--   @pSOLICITUD_Motivo text (IN)
--   @pSOLICITUD_Usuario int (IN)

create PROCEDURE [euroamer_admin_2008].[Solicitud_RegistrarTransferencia_ws]
	@pSOLICITUD_VentaId INT,
	@pSOLICITUD_AgenciaId INT,
	@pSOLICITUD_AgenciaUsuarioId INT,
	@pSOLICITUD_Motivo TEXT='',
	@pSOLICITUD_Usuario INT
AS
BEGIN
	
	SET NOCOUNT ON;

	INSERT INTO SOLICITUD (
		solicitudVentaId,
		solicitudTipoId,
		solicitudEstadoId,
		solicitudAgenciaId,
		solicitudAgenciaUsuarioId,
		solicitudMotivo,
		solicitudCreadoFecha,
		solicitudCreadoUsuarioId)
	VALUES (
		@pSOLICITUD_VentaId, 
		4, 
		'P',
		@pSOLICITUD_AgenciaId,
		@pSOLICITUD_AgenciaUsuarioId,
		@pSOLICITUD_Motivo,
		GETDATE(),
		@pSOLICITUD_Usuario)
		
		SELECT @@IDENTITY AS 'ID'; 
	
END
