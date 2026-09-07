-- Objeto: euroamer_admin_2008.Solicitud_RegistrarReActivacion
-- Creado en BD: 2013-12-24 08:50:58
-- Modificado en BD: 2025-01-02 08:57:23
-- Extraído: 2026-09-07 08:27:16 UTC
-- Referenciado por el backend .NET: SI
-- Parámetros:
--   @pSOLICITUD_VentaId int (IN)
--   @pSOLICITUD_Motivo text (IN)
--   @pSOLICITUD_Usuario int (IN)


CREATE PROCEDURE [Solicitud_RegistrarReActivacion]
	@pSOLICITUD_VentaId INT,
	@pSOLICITUD_Motivo TEXT,
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
		solicitudMotivo,
		solicitudCreadoFecha,
		solicitudCreadoUsuarioId)
	VALUES (
		@pSOLICITUD_VentaId, 
		3, 
		'P',
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
