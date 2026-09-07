-- Objeto: euroamer_admin_2008.PromotorPais_Obtener
-- Creado en BD: 2018-02-21 09:14:16
-- Modificado en BD: 2025-08-14 08:01:30
-- Extraído: 2026-09-07 08:27:16 UTC
-- Referenciado por el backend .NET: SI
-- Parámetros:
--   @pPromotor_UsuarioIDLogin int (IN)
--   @pPaisUsuario int (IN)

CREATE PROCEDURE [euroamer_admin_2008].[PromotorPais_Obtener] 
	@pPromotor_UsuarioIDLogin INT,
	@pPaisUsuario INT
AS
BEGIN
	SET NOCOUNT ON;
    --PromotorPais_Obtener 1,1
	--PromotorPais_Obtener 1,0

	DECLARE @wPerfilUsuario as int;
	DECLARE @esGestor INT;

	select @wPerfilUsuario = usuarioperfilid
	       from USUARIO 
    where usuarioid=@pPromotor_UsuarioIDLogin and usuarioactivo=1 ;
	
	set @esGestor = (select count(*) from VALORES_TIPO where valorTipoColumnaTabla='GestorEUA' and valorTipoId=@wPerfilUsuario)

	IF (@wPerfilUsuario = 1 OR @wPerfilUsuario = 8 OR @wPerfilUsuario = 20) --PERFIL ADMINISTRADOR
		BEGIN
			select usuarioid,upper(usuarioNombre) usuarioNombre 
			from USUARIO 
			where usuarioactivo =1 
			and usuarioperfilid =6
			and (@pPaisUsuario=0 or usuariopaisid = @pPaisUsuario)
			order by 2
		END
	ELSE IF @esGestor = 1  --PERFIL GESTOR
		BEGIN
			select usuarioid,upper(usuarioNombre) usuarioNombre 
			from USUARIO 
			where usuarioactivo=1 
			and usuarioperfilid =6
			and (@pPaisUsuario=0 or usuariopaisid = @pPaisUsuario)
			order by 2
		END
	ELSE IF @wPerfilUsuario = 4 --PERFIL SUPERVISOR
		BEGIN
			select usuarioid,upper(usuarioNombre) usuarioNombre 
			from USUARIO 
			where usuarioactivo=1 
			and usuarioperfilid =6
			and (@pPaisUsuario=0 or usuariopaisid = @pPaisUsuario)
			and usuarioid in (select usuariorelacionhijoid from USUARIO_RELACION where usuariorelacionpadreid=@pPromotor_UsuarioIDLogin)
			order by 2
		END
	ELSE IF @wPerfilUsuario = 6 --PERFIL PROMOTOR
		BEGIN
			select usuarioid,upper(usuarioNombre) usuarioNombre 
			from USUARIO 
			where usuarioactivo=1 
			and usuarioperfilid =6
			and (@pPaisUsuario=0 or usuariopaisid = @pPaisUsuario)
			and usuarioid = @pPromotor_UsuarioIDLogin
			order by 2
		END
END
