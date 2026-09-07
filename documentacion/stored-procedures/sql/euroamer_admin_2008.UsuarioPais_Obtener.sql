-- Objeto: euroamer_admin_2008.UsuarioPais_Obtener
-- Creado en BD: 2017-03-25 18:41:08
-- Modificado en BD: 2017-03-25 18:41:08
-- Extraído: 2026-09-07 08:27:17 UTC
-- Referenciado por el backend .NET: SI
-- Parámetros:
--   @pUSUARIO_Id int (IN)
--   @pUSUARIO_PerfilId int (IN)
--   @pUSUARIO_Activo int (IN)
--   @pUSUARIO_PaisId int (IN)

create PROCEDURE [euroamer_admin_2008].[UsuarioPais_Obtener] 
	@pUSUARIO_Id INT = 0,
	@pUSUARIO_PerfilId INT = 0,
	@pUSUARIO_Activo INT = -1,
	@pUSUARIO_PaisId INT = 0
AS
BEGIN

	SET NOCOUNT ON;
	
	DECLARE @CONTADOR INT
	
	select @CONTADOR = count(*) 
	  from valores_tipo
	 where valorTipoColumnaTabla = 'GestorEUA' 
	   and valorTipoActivo = 1 
	   and valorTipoId = @pUSUARIO_PerfilId           
	   
	   IF @CONTADOR > 0
	     BEGIN
			SET @pUSUARIO_PerfilId = 0
		 END

	SELECT	u.usuarioId, 
			u.usuarioIdExterno, 
			u.usuarioLogin, 
			u.usuarioPassword, 
			u.usuarioNombre, 
			u.usuarioEmail,
			u.usuarioPerfilId, 
			p.perfilNombre as usuarioPerfilNombre, 
			u.usuarioValidoDesde, 
			u.usuarioValidoHasta, 
			u.usuarioFoto, 
			u.usuarioComentarios, 
			u.usuarioUltimoAcceso, 
			u.usuarioActivo,
			u.usuarioPaisId,
			a.PaisNombre as usuarioPaisNombre
	FROM	USUARIO u, PERFIL p, PAIS a
	WHERE	u.usuarioPerfilId = p.perfilId AND
			u.usuarioPaisId = a.PaisId AND
			(@pUSUARIO_PaisId = 0 OR u.usuarioPaisId = @pUSUARIO_PaisId) AND 
			(@pUSUARIO_Id = 0 OR u.usuarioId = @pUSUARIO_Id) AND 
			(@pUSUARIO_PerfilId = 0 OR u.usuarioPerfilId = @pUSUARIO_PerfilId) AND 
			(@pUSUARIO_Activo = -1 OR u.usuarioActivo = @pUSUARIO_Activo)
	ORDER BY u.usuarioNombre
    
END
