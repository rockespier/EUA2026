-- Objeto: euroamer_admin_2008.TipoCaso_Obtener
-- Creado en BD: 2015-05-13 19:17:59
-- Modificado en BD: 2015-05-13 19:17:59
-- Extraído: 2026-09-07 08:27:17 UTC
-- Referenciado por el backend .NET: NO (revisar si sigue en uso)
-- Parámetros:
--   @pCasoId int (IN)

CREATE PROCEDURE [euroamer_admin_2008].[TipoCaso_Obtener]
	@pCasoId INT
AS
BEGIN

	SET NOCOUNT ON;
	
	declare @tipo as INT;
	
	CREATE TABLE #TablaTemporal ( servicioTipoServicioId int)

	Insert INTO #TablaTemporal	
    select servicioTipoServicioId 
	from servicio a,  serviciocaso b
	where caso_idcaso=@pCasoId
	and a.servicioidrecibido = b.servicioid

	Insert INTO #TablaTemporal
	select servicioTipoServicioId
	from servicio a,  serviciocaso b
	where caso_idcaso=@pCasoId
	and a.servicioid = b.servicioid
	
	select top 1 @tipo = servicioTipoServicioId	
	from #TablaTemporal
	order by servicioTipoServicioId desc

	update caso 
	set tipocaso = @tipo
	where idCaso = @pCasoId
		
END
