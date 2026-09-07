-- Objeto: euroamer_admin_2008.Menu_ObtenerPermisosBotones
-- Creado en BD: 2015-10-18 17:34:40
-- Modificado en BD: 2015-10-18 17:34:40
-- Extraído: 2026-09-07 08:27:16 UTC
-- Referenciado por el backend .NET: SI
-- Parámetros:
--   @pPERFIL_Id int (IN)
--   @pMENU_PadreId int (IN)

CREATE PROCEDURE [Menu_ObtenerPermisosBotones]
	@pPERFIL_Id INT = 0,
	@pMENU_PadreId INT = 0
AS
BEGIN

	SET NOCOUNT ON;

	SELECT	menuId, menuNombre,
			ISNULL((SELECT menuVisible FROM PERFIL_MENU WHERE menuId = MENU.menuId AND perfilId=@pPERFIL_Id),0) as menuVisible
	FROM	MENU
	WHERE	menuIdPadre = @pMENU_PadreId AND menuActivo = 1
END
