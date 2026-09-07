-- Objeto: euroamer_admin_2008.Usuario_Obtener
-- Creado en BD: 2025-01-04 08:33:22
-- Modificado en BD: 2025-12-31 03:16:03
-- Extraído: 2026-09-07 08:27:17 UTC
-- Referenciado por el backend .NET: SI
-- Parámetros:
--   @pUSUARIO_Id int (IN)
--   @pUSUARIO_AgenciaId int (IN)
--   @pUSUARIO_PerfilId int (IN)
--   @pUSUARIO_Activo int (IN)
--   @pUSUARIO_Origen nvarchar (IN)

--drop procedure Usuario_Obtener
CREATE PROCEDURE [euroamer_admin_2008].[Usuario_Obtener] 
	@pUSUARIO_Id INT = 0,
	@pUSUARIO_AgenciaId INT = 0,
	@pUSUARIO_PerfilId INT = 0,
	@pUSUARIO_Activo INT = -1,
	@pUSUARIO_Origen NVARCHAR(3)
AS
BEGIN

	SET NOCOUNT ON;

	--exec Usuario_Obtener 0,0,4,1,'A'

	IF (@pUSUARIO_Origen='U')
		BEGIN
			SELECT	0 as usuarioAgenciaId,
					u.usuarioId, 
					u.usuarioIdExterno, 
					upper(u.usuarioLogin) as usuarioLogin, 
					isnull(u.usuarioContrasena,'') as usuarioPassword,
					upper(u.usuarioNombre) as usuarioNombre, 
					upper(u.usuarioEmail) as usuarioEmail,
					u.usuarioTipoDocumento, 
					euroamer_admin_2008.ValorTipo_RecuperarNombre('agenciausuarioTipoDocumento',u.usuarioTipoDocumento) as usuarioTipoDocumentoNombre, 
					u.usuarioNumeroDocumento,
					u.usuarioPerfilId, 
					upper(p.perfilNombre) as usuarioPerfilNombre, 
					u.usuarioValidoDesde, 
					u.usuarioValidoHasta, 
					u.usuarioFoto, 
					u.usuarioComentarios, 
					u.usuarioUltimoAcceso, 
					u.usuarioActivo,
					u.usuarioPaisId,
					a.PaisNombre as usuarioPaisNombre,
					u.usuarioBanco, 
					euroamer_admin_2008.ValorTipo_RecuperarNombre('entidadesBancarias',u.usuarioBanco) as usuarioBancoNombre, 
					u.usuarioNumeroCuenta
			FROM	USUARIO u, PERFIL p, PAIS a
			WHERE	u.usuarioPerfilId = p.perfilId AND
					u.usuarioPaisId = a.PaisId AND
					(@pUSUARIO_Id = 0 OR u.usuarioId = @pUSUARIO_Id) AND 
					(@pUSUARIO_PerfilId = 0 OR u.usuarioPerfilId = @pUSUARIO_PerfilId) AND 
					(@pUSUARIO_Activo = -1 OR u.usuarioActivo = @pUSUARIO_Activo)
			ORDER BY u.usuarioNombre
		END
	ELSE
		BEGIN
			SELECT au.agenciaId as usuarioAgenciaId, 
					au.agenciausuarioId as usuarioId, 
					0 as usuarioIdExterno, 
					upper(au.agenciausuarioLogin) usuarioLogin, 
					isnull(au.agenciausuarioContrasena,'') as usuarioPassword,
					upper(au.agenciausuarioNombre) as usuarioNombre,
					upper(au.agenciausuarioEmail) as usuarioEmail, 
					au.agenciausuarioTipoDocumento as usuarioTipoDocumento, 
					euroamer_admin_2008.ValorTipo_RecuperarNombre('agenciausuarioTipoDocumento',au.agenciausuarioTipoDocumento) as usuarioTipoDocumentoNombre, 
					au.agenciausuarioNumeroDocumento as usuarioNumeroDocumento, 
					au.agenciausuarioPerfilId as usuarioPerfilId, 
					p.perfilNombre as usuarioPerfilNombre, 
					au.agenciausuarioValidoDesde as usuarioValidoDesde, 
					au.agenciausuarioValidoHasta as usuarioValidoHasta,
					'' as usuarioFoto, 
					au.agenciausuarioComentarios as usuarioComentarios, 
					au.agenciausuarioUltimoAcceso as usuarioUltimoAcceso, 
					au.agenciausuarioActivo as usuarioActivo,
					0 as usuarioPaisId,
					'' as usuarioPaisNombre,
					au.agenciausuarioBanco as usuarioBanco, 
					euroamer_admin_2008.ValorTipo_RecuperarNombre('entidadesBancarias',au.agenciausuarioBanco) as usuarioBancoNombre, 
					au.agenciausuarioNumeroCuenta as usuarioNumeroCuenta
			FROM	AGENCIA_USUARIO au, PERFIL p
			WHERE	au.agenciausuarioPerfilId = p.perfilId AND
					(@pUSUARIO_AgenciaId = 0 OR au.agenciaId = @pUSUARIO_AgenciaId) AND
					(@pUSUARIO_Id = 0 OR au.agenciausuarioId = @pUSUARIO_Id) AND
					(@pUSUARIO_PerfilId = 0 OR au.agenciausuarioPerfilId = @pUSUARIO_PerfilId) AND
					(@pUSUARIO_Activo = -1 OR au.agenciausuarioActivo = @pUSUARIO_Activo)
					ORDER BY au.agenciausuarioNombre
		END
			
    
END
