-- Objeto: euroamer_admin_2008.Visitas_Obtener
-- Creado en BD: 2016-02-21 18:26:49
-- Modificado en BD: 2017-05-26 09:35:18
-- Extraído: 2026-09-07 08:27:17 UTC
-- Referenciado por el backend .NET: NO (revisar si sigue en uso)
-- Parámetros:
--   @pVISITAS_FechaIngresoInicio date (IN)
--   @pVISITAS_FechaIngresoFin date (IN)
--   @pVISITAS_Id int (IN)
--   @pVISITAS_UsuarioId int (IN)
--   @pVISITAS_AgenciaId int (IN)


CREATE PROCEDURE [Visitas_Obtener]
	@pVISITAS_FechaIngresoInicio DATE = '',
	@pVISITAS_FechaIngresoFin DATE = '',
	@pVISITAS_Id INT = 0,
	@pVISITAS_UsuarioId INT = 0,
	@pVISITAS_AgenciaId INT = 0
AS
BEGIN
	
	SET NOCOUNT ON;
	
	select v.visitasId,v.visitasagenciaid,v.visitasUsuarioOrigenID,
			a.agenciaNombre, v.visitasFechaVenta, 
			v.visitasOrdenPrioridad, u.usuarionombre,
			euroamer_admin_2008.VisitsApps_ObtenerIdDetalleVisita(v.visitasId)
			, case euroamer_admin_2008.VisitsApps_ObtenerIdDetalleVisita(v.visitasId)
			when 0 then 'NO' else 'SI' end
	from VISITAS v  
	inner join AGENCIA a
	on a.agenciaid = v.visitasagenciaid
	inner join USUARIO u
	on v.visitasUsuarioOrigenID = u.usuarioId
	where (@pVISITAS_FechaIngresoInicio = '1900-01-01' OR visitasFechaVenta BETWEEN @pVISITAS_FechaIngresoInicio AND @pVISITAS_FechaIngresoFin) AND
	(@pVISITAS_Id = 0 OR v.visitasId = @pVISITAS_Id) AND
	(@pVISITAS_UsuarioId = 0 OR v.visitasUsuarioOrigenID = @pVISITAS_UsuarioId) AND
	(@pVISITAS_AgenciaId = 0 OR v.visitasagenciaid = @pVISITAS_AgenciaId) AND
	v.visitasActivo = 1
	order by v.visitasFechaVenta, v.visitasOrdenPrioridad asc

END
