-- Objeto: euroamer_admin_2008.Solicitud_RegistrarModificacionProducto
-- Creado en BD: 2025-04-17 01:27:18
-- Modificado en BD: 2025-04-17 03:21:07
-- Extraído: 2026-09-07 08:27:16 UTC
-- Referenciado por el backend .NET: SI
-- Parámetros:
--   @pSOLICITUD_VentaId int (IN)
--   @pSOLICITUD_VigenciaFechaInicial date (IN)
--   @pSOLICITUD_VigenciaFechaFinal date (IN)
--   @pSOLICITUD_ProductoId int (IN)
--   @pSOLICITUD_VentaImporte decimal (IN)
--   @pSOLICITUD_Edad int (IN)
--   @pSOLICITUD_Motivo text (IN)
--   @pSOLICITUD_Usuario int (IN)


CREATE PROCEDURE [euroamer_admin_2008].[Solicitud_RegistrarModificacionProducto]
	@pSOLICITUD_VentaId INT,
	@pSOLICITUD_VigenciaFechaInicial DATE,
	@pSOLICITUD_VigenciaFechaFinal DATE,
	@pSOLICITUD_ProductoId INT,
	@pSOLICITUD_VentaImporte DECIMAL(18,4),
	@pSOLICITUD_Edad INT,
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
		solicitudProductoId,
		solicitudVentaImporte,
		solicitudClienteEdad,
		solicitudMotivo,
		solicitudCreadoFecha,
		solicitudCreadoUsuarioId)
	VALUES (
		@pSOLICITUD_VentaId, 
		10, 
		'P',
		@pSOLICITUD_VigenciaFechaInicial,
		@pSOLICITUD_VigenciaFechaFinal,
		@pSOLICITUD_ProductoId,
		@pSOLICITUD_VentaImporte,
		@pSOLICITUD_Edad,
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
