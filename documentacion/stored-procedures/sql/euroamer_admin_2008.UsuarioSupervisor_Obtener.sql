-- Objeto: euroamer_admin_2008.UsuarioSupervisor_Obtener
-- Creado en BD: 2013-12-24 08:51:00
-- Modificado en BD: 2013-12-24 08:51:00
-- Extraído: 2026-09-07 08:27:17 UTC
-- Referenciado por el backend .NET: NO (revisar si sigue en uso)

CREATE PROCEDURE [UsuarioSupervisor_Obtener]
AS
BEGIN

	SET NOCOUNT ON;

	SELECT	usuarioAgenciaId, usuarioAgenciaNombre
	FROM	USUARIO_AGENCIA
	WHERE	usuarioAgenciaPerfilId = 4 AND
			usuarioAgenciaActivo = 1
	ORDER BY usuarioAgenciaNombre
    
END
