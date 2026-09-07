-- Objeto: euroamer_admin_2008.Solicitud_RegistrarModificacionVigencia
-- Creado en BD: 2013-12-24 08:50:58
-- Modificado en BD: 2025-01-02 08:57:22
-- Extraído: 2026-09-07 08:27:16 UTC
-- Referenciado por el backend .NET: SI
-- Parámetros:
--   @pSOLICITUD_VentaId int (IN)
--   @pSOLICITUD_VigenciaFechaInicial date (IN)
--   @pSOLICITUD_VigenciaFechaFinal date (IN)
--   @pSOLICITUD_Motivo text (IN)
--   @pSOLICITUD_Usuario int (IN)


CREATE PROCEDURE [Solicitud_RegistrarModificacionVigencia]
	@pSOLICITUD_VentaId INT,
	@pSOLICITUD_VigenciaFechaInicial DATE,
	@pSOLICITUD_VigenciaFechaFinal DATE,
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
		solicitudVigenciaFechaInicial,
		solicitudVigenciaFechaFinal,
		solicitudMotivo,
		solicitudCreadoFecha,
		solicitudCreadoUsuarioId)
	VALUES (
		@pSOLICITUD_VentaId, 
		2, 
		'P',
		@pSOLICITUD_VigenciaFechaInicial,
		@pSOLICITUD_VigenciaFechaFinal,
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
