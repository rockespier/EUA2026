-- Objeto: euroamer_admin_2008.Usuario_RelacionObtener
-- Creado en BD: 2017-03-25 18:41:08
-- Modificado en BD: 2025-01-09 01:22:04
-- Extraído: 2026-09-07 08:27:17 UTC
-- Referenciado por el backend .NET: SI
-- Parámetros:
--   @pUSUARIO_PaisId int (IN)
--   @pUSUARIO_PadreId int (IN)
--   @pUSUARIO_PadrePerfilId int (IN)
--   @pUSUARIO_HijoId int (IN)
--   @pUSUARIO_HijoPerfilId int (IN)

CREATE PROCEDURE [euroamer_admin_2008].[Usuario_RelacionObtener] 
	@pUSUARIO_PaisId INT = 0,
	@pUSUARIO_PadreId INT = 0,
	@pUSUARIO_PadrePerfilId INT = 0,
	@pUSUARIO_HijoId INT = 0,
	@pUSUARIO_HijoPerfilId INT = 0
AS
BEGIN
--exec Usuario_RelacionObtener 1,0,0,0,0

	SET NOCOUNT ON;

	SELECT	u.usuarioRelacionPadreId,
			upper(euroamer_admin_2008.Usuario_RecuperarNombre('U',u.usuarioRelacionPadreId)) as NombreUsuarioPadre,
			u.usuarioRelacionPadrePerfilId,
			p.perfilNombre as usuarioPerfilNombrePadre, 
			u.usuarioRelacionHijoId,
			upper(euroamer_admin_2008.Usuario_RecuperarNombre('U',u.usuarioRelacionHijoId)) as NombreUsuarioHijo,
			u.usuarioRelacionHijoPerfilId,
			pn.perfilNombre as usuarioPerfilNombreHijo
	FROM	USUARIO_RELACION u, PERFIL p, PERFIL pn, USUARIO uf
	WHERE	u.usuarioRelacionPadrePerfilId = p.perfilId AND
			u.usuarioRelacionHijoPerfilId = pn.perfilId AND
			u.usuarioRelacionPadreId= uf.usuarioID AND
			(@pUSUARIO_PadreId = 0 OR u.usuarioRelacionPadreId = @pUSUARIO_PadreId) AND 
			(@pUSUARIO_PadrePerfilId = 0 OR u.usuarioRelacionPadrePerfilId = @pUSUARIO_PadrePerfilId) AND 
			(@pUSUARIO_HijoId = 0 OR u.usuarioRelacionHijoId = @pUSUARIO_HijoId) AND 
			(@pUSUARIO_HijoPerfilId = 0 OR u.usuarioRelacionHijoPerfilId = @pUSUARIO_HijoPerfilId) AND
			(@pUSUARIO_PaisId = 0 OR uf.usuariopaisID = @pUSUARIO_PaisId) 
	ORDER BY NombreUsuarioPadre
    
END
