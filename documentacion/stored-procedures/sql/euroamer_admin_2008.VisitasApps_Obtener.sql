-- Objeto: euroamer_admin_2008.VisitasApps_Obtener
-- Creado en BD: 2016-02-21 18:26:49
-- Modificado en BD: 2016-04-28 21:46:33
-- Extraído: 2026-09-07 08:27:17 UTC
-- Referenciado por el backend .NET: NO (revisar si sigue en uso)
-- Parámetros:
--   @pVISITASAPPS_FechaIngresoInicio date (IN)
--   @pVISITASAPPS_FechaIngresoFin date (IN)
--   @pVISITASAPPS_UsuarioId int (IN)
--   @pVISITASAPPS_AgenciaId int (IN)


CREATE PROCEDURE [VisitasApps_Obtener]
	@pVISITASAPPS_FechaIngresoInicio DATE = '',
	@pVISITASAPPS_FechaIngresoFin DATE = '',
	@pVISITASAPPS_UsuarioId INT = 0,
	@pVISITASAPPS_AgenciaId INT = 0
AS
BEGIN
	
	SET NOCOUNT ON;
	
	select va.visitasappsId, va.visitasappsVisitasId,
	va.visitasappsFechaHora,
	va.visitasappsLoginID, us.usuarionombre,
	vi.visitasAgenciaID, ag.agenciaNombre,
	va.visitasappsDejaStock, va.visitasappsDejaFolleteria,
	va.visitasappsDesAtencion, va.visitasappsDesComentarios,
	isnull(euroamer_admin_2008.VisitsApps_ObtenerDistancias(va.visitasappsVisitasId,va.visitasappsXCoord,va.visitasappsYCoord),1) as visitasappDistancia
	from VISITAS_APPS va 
	inner join USUARIO us
	on va.visitasappsLoginID = us.usuarioId
	inner join VISITAS vi
	on va.visitasappsVisitasId = vi.visitasId
	inner join AGENCIA ag
	on ag.agenciaid = vi.visitasagenciaid
	where (@pVISITASAPPS_FechaIngresoInicio = '1900-01-01' OR cast(va.visitasappsFechaHora as date) BETWEEN @pVISITASAPPS_FechaIngresoInicio AND @pVISITASAPPS_FechaIngresoFin) AND
	(@pVISITASAPPS_UsuarioId = 0 OR va.visitasappsLoginID = @pVISITASAPPS_UsuarioId) AND
	(@pVISITASAPPS_AgenciaId = 0 OR vi.visitasAgenciaID = @pVISITASAPPS_AgenciaId) AND
	va.visitasappsActivo = 1
	order by us.usuarionombre, va.visitasappsFechaHora,visitasappDistancia asc

END
