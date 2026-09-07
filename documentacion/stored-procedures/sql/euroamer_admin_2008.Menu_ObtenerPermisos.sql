-- Objeto: euroamer_admin_2008.Menu_ObtenerPermisos
-- Creado en BD: 2013-12-24 08:50:57
-- Modificado en BD: 2025-01-08 06:03:08
-- Extraído: 2026-09-07 08:27:16 UTC
-- Referenciado por el backend .NET: SI
-- Parámetros:
--   @pPERFIL_Id int (IN)

CREATE PROCEDURE [euroamer_admin_2008].[Menu_ObtenerPermisos]
	@pPERFIL_Id INT = 0
AS
BEGIN

--exec Menu_ObtenerPermisos 1
	SET NOCOUNT ON;

SET NOCOUNT ON;
	--"id": "ajson1", "parent": "#", type: "default", "text": "Simple root node", state: {opened: true}
	--"id": "ajson3", "parent": "ajson2", type: "file", "text": "Child 1", state: {selected: true} 
	IF @pPERFIL_Id <> 0
		BEGIN
			SELECT	menuId id, case menuIdPadre when 0 then '#' else cast(menuIdPadre as varchar) end as [parent],case menuIdPadre when 0 then 'default' else 'file' end as [type] , 
					menuNombre as [text],
					case menuIdPadre when 0 then '{opened: true}' else case ISNULL((SELECT TOP 1 menuVisible 
																					FROM PERFIL_MENU 
																					 WHERE menuId = MENU.menuId 
																					 AND perfilId=@pPERFIL_Id),0) when 1 then '{selected: true}' else '{selected: false}' end end as [state]					
			FROM	MENU
			WHERE	menuActivo = 1 
			ORDER BY menuIdPadre, menuOrden
		END
	ELSE
		BEGIN
			SELECT	menuId id,case menuIdPadre when 0 then '#' else cast(menuIdPadre as varchar) end as [parent],case menuIdPadre when 0 then 'default' else 'file' end as [type] , 
					menuNombre as [text],
					case menuIdPadre when 0 then '{opened: true}' else '{selected: false}' end as [state]					
			FROM	MENU
			WHERE	menuActivo = 1 
			ORDER BY menuIdPadre, menuOrden
		END
	--exec Menu_ObtenerPermisos 0
	--exec Menu_ObtenerPermisos 2
END
