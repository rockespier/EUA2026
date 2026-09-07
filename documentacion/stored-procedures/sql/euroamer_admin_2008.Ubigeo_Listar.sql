-- Objeto: euroamer_admin_2008.Ubigeo_Listar
-- Creado en BD: 2017-03-25 18:41:08
-- Modificado en BD: 2025-04-29 08:32:30
-- Extraído: 2026-09-07 08:27:17 UTC
-- Referenciado por el backend .NET: SI
-- Parámetros:
--   @pUBIGEO_Id int (IN)
--   @pUBIGEO_PaisId int (IN)
--   @pUBIGEO_Activo int (IN)

CREATE PROCEDURE [euroamer_admin_2008].[Ubigeo_Listar]
	@pUBIGEO_Id INT = 0,
	@pUBIGEO_PaisId INT = 0,
	@pUBIGEO_Activo INT = -1
AS
BEGIN
--exec Ubigeo_Listar 0,0,-1
	SET NOCOUNT ON;

	SELECT	p.ubigeoId,upper(p.UbigeoDistrito) ubigeoNombre,
			p.ubigeoProvinciaId, upper(a.valorTipoNombre) ubigeoProvinciaNombre,
			p.ubigeoDepartamentoId, upper(b.valorTipoNombre) ubigeoDepartamentoNombre,
            d.paisId ubigeoPaisId,
			upper(d.paisNombre) ubigeoPaisNombre, p.ubigeoActivo
	FROM	Ubigeo p, valores_tipo a,valores_tipo b, pais d
	WHERE	0 = 0 AND
	        (@pUBIGEO_Id = 0 OR p.ubigeoId = @pUBIGEO_Id) AND
	        p.UbigeoPaisId = d.paisId AND
	        p.ubigeoProvinciaId = a.valorTipoId AND
			a.valorTipoColumnaTabla = 'provincia' AND
			a.valorTipoActivo = 1 AND
			p.ubigeoDepartamentoId = b.valorTipoId AND
			b.valorTipoColumnaTabla = 'departamento' AND
			b.valorTipoActivo = 1 
	ORDER BY d.paisNombre,a.valorTipoNombre,b.valorTipoNombre,p.UbigeoDistrito
END
