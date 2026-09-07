-- Objeto: euroamer_admin_2008.VisitasApps_Obtener_Detalle
-- Creado en BD: 2016-03-15 18:51:18
-- Modificado en BD: 2016-03-15 18:51:18
-- Extraído: 2026-09-07 08:27:17 UTC
-- Referenciado por el backend .NET: NO (revisar si sigue en uso)
-- Parámetros:
--   @pVISITASAPPS_visitasappsid int (IN)

create PROCEDURE VisitasApps_Obtener_Detalle
	@pVISITASAPPS_visitasappsid INT = 0
AS
BEGIN
	
	SET NOCOUNT ON;
	
	select visitasappsDesAtencion, 
		   visitasappsDejaStock, 
		   visitasappsDejaFolleteria,
		   visitasappsDesComentarios 
	from   VISITAS_APPS where visitasappsid =@pVISITASAPPS_visitasappsid

END
