-- Objeto: euroamer_admin_2008.Promotor_Obtener
-- Creado en BD: 2017-03-25 18:41:08
-- Modificado en BD: 2017-03-25 18:41:08
-- Extraído: 2026-09-07 08:27:16 UTC
-- Referenciado por el backend .NET: SI
-- Parámetros:
--   @pPromotor_UsuarioIDLogin int (IN)

CREATE PROCEDURE [euroamer_admin_2008].[Promotor_Obtener] 
	@pPromotor_UsuarioIDLogin INT
AS
BEGIN
	SET NOCOUNT ON;

	DECLARE @wPerfilUsuario as int;
	DECLARE @wPaisUsuario as int;
	
	select @wPerfilUsuario = usuarioperfilid, @wPaisUsuario=usuariopaisid 
	       from USUARIO 
    where usuarioid=@pPromotor_UsuarioIDLogin and usuarioactivo=1 ;

	IF @wPerfilUsuario = 1 --PERFIL ADMINISTRADOR
		BEGIN
			select usuarioid,upper(usuarioNombre) usuarioNombre 
			from USUARIO 
			where usuarioactivo=1 
			and usuarioperfilid =6
			order by 2
		END
	ELSE IF @wPerfilUsuario = 7 --PERFIL GESTOR
		BEGIN
			select usuarioid,upper(usuarioNombre) usuarioNombre 
			from USUARIO 
			where usuarioactivo=1 
			and usuarioperfilid =6
			and usuariopaisid = @wPaisUsuario
			order by 2
		END
	ELSE IF @wPerfilUsuario = 4 --PERFIL SUPERVISOR
		BEGIN
			select usuarioid,upper(usuarioNombre) usuarioNombre 
			from USUARIO 
			where usuarioactivo=1 
			and usuarioperfilid =6
			and usuariopaisid = @wPaisUsuario
			and usuarioid in (select usuariorelacionhijoid from USUARIO_RELACION where usuariorelacionpadreid=@pPromotor_UsuarioIDLogin)
			order by 2
		END
	ELSE IF @wPerfilUsuario = 6 --PERFIL GESTOR
		BEGIN
			select usuarioid,upper(usuarioNombre) usuarioNombre 
			from USUARIO 
			where usuarioactivo=1 
			and usuarioperfilid =6
			and usuariopaisid = @wPaisUsuario
			and usuarioid = @pPromotor_UsuarioIDLogin
			order by 2
		END
END
