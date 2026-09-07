-- Objeto: euroamer_admin_2008.ValoresTipo_ObtenerTipos
-- Creado en BD: 2024-12-30 03:04:44
-- Modificado en BD: 2024-12-30 03:04:44
-- Extraído: 2026-09-07 08:27:17 UTC
-- Referenciado por el backend .NET: SI


CREATE PROCEDURE [ValoresTipo_ObtenerTipos]	
AS
BEGIN
	
	SET NOCOUNT ON;

	SELECT DISTINCT valorTipoColumnaTabla
	FROM VALORES_TIPO
	order by valorTipoColumnaTabla
    
END
