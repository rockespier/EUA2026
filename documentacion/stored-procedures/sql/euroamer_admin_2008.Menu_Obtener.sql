-- Objeto: euroamer_admin_2008.Menu_Obtener
-- Creado en BD: 2013-12-24 08:50:57
-- Modificado en BD: 2025-04-17 05:04:09
-- Extraído: 2026-09-07 08:27:16 UTC
-- Referenciado por el backend .NET: SI
-- Parámetros:
--   @pPERFIL_Id int (IN)

CREATE PROCEDURE [euroamer_admin_2008].[Menu_Obtener]
	@pPERFIL_Id INT = 0
AS
BEGIN

	SET NOCOUNT ON;

	/*SELECT	menuId, menuNombre, menuPagina, menuParametros, menuIdPadre ,menuOrden
	FROM	MENU 
	WHERE	menuId IN (	SELECT menuIdPadre FROM PERFIL_MENU rm, MENU m 
						WHERE perfilId = @pPERFIL_Id AND rm.menuId = m.menuId  AND rm.menuVisible = 1 AND m.menuActivo = 1 AND m.menuTipo = 'M') 
	UNION
	SELECT	m.menuId, m.menuNombre, m.menuPagina, m.menuParametros, m.menuIdPadre,m.menuOrden
	FROM	PERFIL_MENU rm, MENU m
	WHERE	perfilId = @pPERFIL_Id AND rm.menuId = m.menuId AND rm.menuVisible = 1 AND m.menuActivo = 1 AND m.menuTipo = 'M'
	ORDER BY menuOrden*/

	SELECT	menuId, menuNombre, menuPagina, menuParametros, menuIdPadre, menuIcono, menuOrden
	FROM	MENU 
	WHERE	menuId IN (	SELECT menuIdPadre FROM PERFIL_MENU rm, MENU m 
						WHERE perfilId = @pPERFIL_Id AND rm.menuId = m.menuId  AND rm.menuVisible = 1 AND m.menuActivo = 1 AND m.menuTipo='M') 
	UNION 
	SELECT	menuId, menuNombre, menuPagina, menuParametros, menuIdPadre, menuIcono, menuOrden
	FROM	MENU 
	WHERE	menuId IN (SELECT	menuIdPadre
	FROM	MENU 
	WHERE	menuId IN (	SELECT menuIdPadre FROM PERFIL_MENU rm, MENU m 
						WHERE perfilId = @pPERFIL_Id AND rm.menuId = m.menuId  AND rm.menuVisible = 1 AND m.menuActivo = 1 AND m.menuTipo='G'))
	UNION
	SELECT	menuId, menuNombre, menuPagina, menuParametros, menuIdPadre, menuIcono, menuOrden
	FROM	MENU 
	WHERE	menuId IN (	SELECT menuIdPadre FROM PERFIL_MENU rm, MENU m 
						WHERE perfilId = @pPERFIL_Id AND rm.menuId = m.menuId  AND rm.menuVisible = 1 AND m.menuActivo = 1 AND m.menuTipo='G') 
	UNION
	SELECT	menuId, menuNombre, menuPagina, menuParametros, menuIdPadre, menuIcono, menuOrden
	FROM	MENU 
	WHERE	menuId IN (	SELECT menuIdPadre FROM PERFIL_MENU rm, MENU m 
						WHERE perfilId = @pPERFIL_Id AND rm.menuId = m.menuId  AND rm.menuVisible = 1 AND m.menuActivo = 1 AND m.menuTipo='B') 
	UNION
	SELECT	m.menuId, m.menuNombre, m.menuPagina, m.menuParametros, m.menuIdPadre, m.menuIcono, m.menuOrden
	FROM	PERFIL_MENU rm, MENU m
	WHERE	perfilId = @pPERFIL_Id AND rm.menuId = m.menuId AND rm.menuVisible = 1 AND m.menuActivo = 1 and m.menuTipo='M'
	ORDER BY menuIdPadre, menuOrden



END
