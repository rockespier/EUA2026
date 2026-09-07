-- Objeto: euroamer_admin_2008.VisitasApps_Agencias
-- Creado en BD: 2016-02-21 18:26:49
-- Modificado en BD: 2016-02-22 19:23:50
-- Extraído: 2026-09-07 08:27:17 UTC
-- Referenciado por el backend .NET: NO (revisar si sigue en uso)
-- Parámetros:
--   @pVISITASAPPS_FechaIngresoInicio date (IN)
--   @pVISITASAPPS_FechaIngresoFin date (IN)
--   @pVISITASAPPS_UsuarioId int (IN)
--   @pVISITASAPPS_AgenciaId int (IN)


CREATE PROCEDURE [VisitasApps_Agencias]
	@pVISITASAPPS_FechaIngresoInicio DATE = '',
	@pVISITASAPPS_FechaIngresoFin DATE = '',
	@pVISITASAPPS_UsuarioId INT = 0,
	@pVISITASAPPS_AgenciaId INT = 0
AS
BEGIN

	SET NOCOUNT ON;
	
 	select distinct geography::STGeomFromText('POINT('+cast(ag.agenciaYcoord as varchar(20))+' '+cast(ag.agenciaXcoord as varchar(20))+')', 4326).STAsBinary() AS Wkb,
	vi.visitasAgenciaID, ag.agenciaNombre
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
	va.visitasappsActivo = 1 and ag.agenciaYcoord <> 0
 
END
