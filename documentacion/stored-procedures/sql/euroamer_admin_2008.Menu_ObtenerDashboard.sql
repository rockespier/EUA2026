-- Objeto: euroamer_admin_2008.Menu_ObtenerDashboard
-- Creado en BD: 2025-03-21 08:38:04
-- Modificado en BD: 2025-10-09 03:57:24
-- Extraído: 2026-09-07 08:27:16 UTC
-- Referenciado por el backend .NET: SI
-- Parámetros:
--   @pPERFIL_Id int (IN)
--   @pMENUPADRE_Id int (IN)

CREATE PROCEDURE [Menu_ObtenerDashboard]
	@pPERFIL_Id INT = 0,
	@pMENUPADRE_Id INT = 0
AS
BEGIN

	SET NOCOUNT ON;

	SELECT m.menuId, menuNombre, isnull(menuParametros,'') menuParametros
	FROM PERFIL_MENU rm, MENU m
	WHERE perfilId = @pPERFIL_Id AND rm.menuId = m.menuId
	AND rm.menuVisible = 1 AND m.menuActivo = 1
	AND m.menuIdpadre = @pMENUPADRE_Id and m.menuTipo='G'
	--exec Menu_ObtenerDashboard 1,74
END
