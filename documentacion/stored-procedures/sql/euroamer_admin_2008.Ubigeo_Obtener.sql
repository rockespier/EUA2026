-- Objeto: euroamer_admin_2008.Ubigeo_Obtener
-- Creado en BD: 2017-03-25 18:41:08
-- Modificado en BD: 2025-04-29 08:31:38
-- Extraído: 2026-09-07 08:27:17 UTC
-- Referenciado por el backend .NET: SI
-- Parámetros:
--   @pUBIGEO_Id int (IN)
--   @pUBIGEO_PaisId int (IN)
--   @pUBIGEO_Activo int (IN)

CREATE PROCEDURE [euroamer_admin_2008].[Ubigeo_Obtener]
	@pUBIGEO_Id INT = 0,
	@pUBIGEO_PaisId INT = 0,
	@pUBIGEO_Activo INT = -1
AS
BEGIN
	--exec Ubigeo_Obtener 0,1,1
	SET NOCOUNT ON;

	SELECT	p.ubigeoId, 
	       upper(a.valorTipoNombre + '/' + b.valorTipoNombre + '/' + p.UbigeoDistrito) as ubigeoDistrito
	FROM	Ubigeo p, valores_tipo a,valores_tipo b
	WHERE	0 = 0 AND
	        p.ubigeoProvinciaId = a.valorTipoId AND
			a.valorTipoColumnaTabla = 'provincia' AND
			a.valorTipoActivo = 1 AND
			p.ubigeoDepartamentoId = b.valorTipoId AND
			b.valorTipoColumnaTabla = 'departamento' AND
			b.valorTipoActivo = 1 AND
			(@pUBIGEO_Id = 0 OR p.ubigeoId = @pUBIGEO_Id) AND
			(@pUBIGEO_PaisId = 0 OR p.ubigeoPaisId = @pUBIGEO_PaisId) AND
			(@pUBIGEO_Activo = -1 OR p.ubigeoActivo = @pUBIGEO_Activo)
	ORDER BY a.valorTipoNombre,b.valorTipoNombre,p.UbigeoDistrito
END
