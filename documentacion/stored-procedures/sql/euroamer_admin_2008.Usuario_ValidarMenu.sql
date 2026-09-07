-- Objeto: euroamer_admin_2008.Usuario_ValidarMenu
-- Creado en BD: 2025-03-21 10:34:17
-- Modificado en BD: 2025-03-21 10:38:52
-- Extraído: 2026-09-07 08:27:17 UTC
-- Referenciado por el backend .NET: SI
-- Parámetros:
--   @pUSUARIO_Id int (IN)
--   @pMENU_Id int (IN)

CREATE PROCEDURE [Usuario_ValidarMenu]
	@pUSUARIO_Id INT,
	@pMENU_Id INT
AS
BEGIN

	SET NOCOUNT ON;

	--Usuario_ValidarMenu 1,74

	declare @intPerfilId int,@resultadoPre1 INT,@resultadoPre2 INT, @resultado INT

	--obtener el perfil del usuario
	set @intPerfilId = (select usuarioPerfilId from USUARIO where usuarioId=@pUSUARIO_Id )

	set @resultadoPre1 = (select COUNT(*) from PERFIL_MENU where perfilId=@intPerfilId and menuId=@pMENU_Id and menuVisible=1)

	set @resultadoPre2 = (SELECT count (*)
	                      FROM PERFIL_MENU rm, MENU m WHERE perfilId = @intPerfilId AND rm.menuId = m.menuId
	                                                    AND rm.menuVisible = 1 AND m.menuActivo = 1 AND m.menuIdpadre = @pMENU_Id and m.menuTipo='G')

	set @resultado =  @resultadoPre1+ @resultadoPre2;

	IF @resultado = 0
		BEGIN
			select @resultado as codigo, '' as descripcion
		END
	ELSE
		BEGIN
			select @resultado as codigo, 'ok' as descripcion
		END

END
