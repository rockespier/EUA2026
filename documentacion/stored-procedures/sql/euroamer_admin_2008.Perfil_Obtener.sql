-- Objeto: euroamer_admin_2008.Perfil_Obtener
-- Creado en BD: 2013-12-24 08:50:58
-- Modificado en BD: 2025-02-05 01:59:58
-- Extraído: 2026-09-07 08:27:16 UTC
-- Referenciado por el backend .NET: SI
-- Parámetros:
--   @pPERFIL_Id int (IN)
--   @pPERFIL_Origen char (IN)


CREATE PROCEDURE [euroamer_admin_2008].[Perfil_Obtener]
	@pPERFIL_Id INT,
	@pPERFIL_Origen CHAR(1)
AS
BEGIN
	
	--exec Perfil_Obtener 0,''

	SET NOCOUNT ON;

	IF @pPERFIL_Id <> 0
		BEGIN
			SELECT perfilId, upper(perfilNombre) perfilNombre, perfilActivo,perfilCreadoFecha,(select count(*) from usuario where usuarioperfilid=perfilId) perfilCantidadUsuarios
			FROM PERFIL
			WHERE perfilId = @pPERFIL_Id 
             --AND perfilOrigen = @pPERFIL_Origen
		END
	ELSE
		BEGIN
			SELECT perfilId, upper(perfilNombre) perfilNombre, perfilActivo,perfilCreadoFecha,(select count(*) from usuario where usuarioperfilid=perfilId) perfilCantidadUsuarios
			FROM PERFIL
			WHERE perfilOrigen = @pPERFIL_Origen
			ORDER BY perfilNombre
		END
    
END
