-- Objeto: euroamer_admin_2008.FacturacionCaso_Obtener
-- Creado en BD: 2015-05-13 19:17:59
-- Modificado en BD: 2015-05-13 19:17:59
-- Extraído: 2026-09-07 08:27:16 UTC
-- Referenciado por el backend .NET: NO (revisar si sigue en uso)
-- Parámetros:
--   @pFechaInicio date (IN)
--   @pFechaFin date (IN)
--   @pCasoId int (IN)

CREATE PROCEDURE [euroamer_admin_2008].[FacturacionCaso_Obtener]
	@pFechaInicio DATE,
	@pFechaFin DATE,
        @pCasoId INT
AS
BEGIN

	SET NOCOUNT ON;
	
	select c.idcaso, desnombre,idrefExterna,desValor destipoCaso, costoTipo =
	CASE c.tipocaso
	WHEN 1 THEN empresacostosimple
	WHEN 2 THEN empresacostomiddle
	WHEN 3 THEN empresacostocomplex	  
	END ,
	e.empresatransferenciabanco,
	ISNULL(s.impcostodolares,0) costo,
        e.desempresa,e.empresadireccion,e.empresaidentificacionfiscal,
        e.empresagirodenegocio
	into #TablaTemporal
	from caso c, tipo t, empresa e, servicio s, StatusxCaso x
	where t.desColumna='TipoServicioId'
	and c.tipocaso = t.desTipo
	and t.estRegistro='S'
	and c.idempresa = e.idempresa
	and c.idcaso = s.caso_idcaso
	and (servicioIdRecibido is not null or rtrim(ltrim(desserviciorec)) <>'')
	and c.idcaso = x.idcaso
	and x.estregistro='S'
        --and x.idStatus = 7
	and x.fchCreacion between @pFechaInicio and @pFechaFin	
        and c.idcaso = ISNULL(@pCasoId,c.idcaso)
	

	select idcaso, desnombre, idrefExterna,destipoCaso, costoTipo,
	empresatransferenciabanco, SUM(costo) costo_total,
        desempresa,empresadireccion,empresaidentificacionfiscal,
        empresagirodenegocio
	from #TablaTemporal 
	group by idcaso, desnombre, idrefExterna,destipoCaso, costoTipo,
	empresatransferenciabanco,
        desempresa,empresadireccion,empresaidentificacionfiscal,
        empresagirodenegocio

end
