-- Objeto: euroamer_admin_2008.Solicitud_RegistrarTransferencia
-- Creado en BD: 2013-12-24 08:50:58
-- Modificado en BD: 2025-01-02 08:57:23
-- Extraído: 2026-09-07 08:27:17 UTC
-- Referenciado por el backend .NET: SI
-- Parámetros:
--   @pSOLICITUD_VentaId int (IN)
--   @pSOLICITUD_AgenciaId int (IN)
--   @pSOLICITUD_AgenciaUsuarioId int (IN)
--   @pSOLICITUD_Motivo text (IN)
--   @pSOLICITUD_Usuario int (IN)


CREATE PROCEDURE [Solicitud_RegistrarTransferencia]
	@pSOLICITUD_VentaId INT,
	@pSOLICITUD_AgenciaId INT,
	@pSOLICITUD_AgenciaUsuarioId INT,
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
	
	
set @tipoproceso=1;

IF @@ROWCOUNT > 0
BEGIN
	set @resultado = 'ok'
END

select @tipoproceso as errorCodigo, @resultado as errorDescripcion

END
