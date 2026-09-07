-- Objeto: euroamer_admin_2008.ValoresTipo_Obtener
-- Creado en BD: 2013-12-24 08:51:00
-- Modificado en BD: 2016-12-12 21:01:01
-- Extraído: 2026-09-07 08:27:17 UTC
-- Referenciado por el backend .NET: SI
-- Parámetros:
--   @pVALORTIPO_ColumnaTabla varchar (IN)


CREATE PROCEDURE [ValoresTipo_Obtener]
	@pVALORTIPO_ColumnaTabla VARCHAR(50)
AS
BEGIN
	
	SET NOCOUNT ON;

	SELECT valorTipoId, valorTipoNombre, valorTipoActivo
	FROM VALORES_TIPO
	WHERE valorTipoColumnaTabla  like @pVALORTIPO_ColumnaTabla +'%'
	ORDER BY valorTipoNombre
    
END
