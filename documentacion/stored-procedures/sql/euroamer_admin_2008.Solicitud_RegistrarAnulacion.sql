-- Objeto: euroamer_admin_2008.Solicitud_RegistrarAnulacion
-- Creado en BD: 2017-03-25 18:41:08
-- Modificado en BD: 2025-02-20 13:06:01
-- Extraído: 2026-09-07 08:27:16 UTC
-- Referenciado por el backend .NET: SI
-- Parámetros:
--   @pSOLICITUD_VentaId int (IN)
--   @pSOLICITUD_Motivo text (IN)
--   @pSOLICITUD_Adjunto varchar (IN)
--   @pSOLICITUD_Usuario int (IN)
--   @pSOLICITUD_MotivoAnulacion int (IN)


CREATE PROCEDURE [euroamer_admin_2008].[Solicitud_RegistrarAnulacion]
	@pSOLICITUD_VentaId INT,
	@pSOLICITUD_Motivo TEXT,
	@pSOLICITUD_Adjunto VARCHAR(50),
	@pSOLICITUD_Usuario INT,
	@pSOLICITUD_MotivoAnulacion int =0
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
		solicitudMotivo,
		solicitudAdjunto,
		solicitudCreadoFecha,
		solicitudCreadoUsuarioId,
		solicitudMotivoAnulacion)
	VALUES (
		@pSOLICITUD_VentaId, 
		1, 
		'P',
		@pSOLICITUD_Motivo,
		@pSOLICITUD_Adjunto,
		@FechaHoraActual,
		@pSOLICITUD_Usuario,
		@pSOLICITUD_MotivoAnulacion)
	set @tipoproceso=1;

IF @@ROWCOUNT > 0
BEGIN
	set @resultado = 'ok'
END
select @tipoproceso as errorCodigo, @resultado as errorDescripcion
END
