-- Objeto: euroamer_admin_2008.Valores_Obtener
-- Creado en BD: 2025-01-17 06:20:10
-- Modificado en BD: 2025-03-17 04:19:07
-- Extraído: 2026-09-07 08:27:17 UTC
-- Referenciado por el backend .NET: SI
-- Parámetros:
--   @pVALOR_CampoTabla varchar (IN)
--   @pVALOR_Acitvo int (IN)
--   @pVALOR_id varchar (IN)

CREATE PROCEDURE [euroamer_admin_2008].[Valores_Obtener]
	@pVALOR_CampoTabla VARCHAR(50),
	@pVALOR_Acitvo int,
	@pVALOR_id VARCHAR(4) = '0'
AS
BEGIN
	--Valores_Obtener 'departamento',1,''
	SET NOCOUNT ON;			

	IF @pVALOR_Acitvo = -1
		BEGIN
			SELECT	valorTipoId valorId, upper(valorTipoNombre) valorNombre, valorTipoActivo valorActivo, upper(valorTipoDescripcion) valorDescripcion, upper(valorTipoColumnaTabla) as valorCampoTabla,
					upper(valorTipoAux) valorAux, upper(valorTipoAux2) valorAux2, upper(valorTipoAux3) valorAux3
			FROM	VALORES_TIPO
			WHERE	valorTipoColumnaTabla = @pVALOR_CampoTabla
			and (@pVALOR_id = '0' or valorTipoId = @pVALOR_id)
			ORDER BY valorTipoNombre
		END
	ELSE
		BEGIN
			SELECT	valorTipoId valorId, upper(valorTipoNombre) valorNombre, valorTipoActivo valorActivo, upper(valorTipoDescripcion) valorDescripcion, upper(valorTipoColumnaTabla) as valorCampoTabla,
					upper(valorTipoAux) valorAux, upper(valorTipoAux2) valorAux2, upper(valorTipoAux3) valorAux3
			FROM	VALORES_TIPO
			WHERE	valorTipoColumnaTabla = @pVALOR_CampoTabla AND
					valortipoActivo = @pVALOR_Acitvo AND
					(@pVALOR_id = '0' or valorTipoId = @pVALOR_id)
			ORDER BY valorTipoNombre
		END	
END
