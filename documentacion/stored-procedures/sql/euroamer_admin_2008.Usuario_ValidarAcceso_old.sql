-- Objeto: euroamer_admin_2008.Usuario_ValidarAcceso_old
-- Creado en BD: 2024-12-17 08:29:43
-- Modificado en BD: 2024-12-17 08:29:43
-- Extraído: 2026-09-07 08:27:17 UTC
-- Referenciado por el backend .NET: NO (revisar si sigue en uso)
-- Parámetros:
--   @pUSUARIO_Login varchar (IN)
--   @pUSUARIO_Password varchar (IN)

create PROCEDURE [euroamer_admin_2008].[Usuario_ValidarAcceso_old] 
	@pUSUARIO_Login VARCHAR(50), 
	@pUSUARIO_Password VARCHAR(50)
AS
BEGIN

	SET NOCOUNT ON;
	
	SELECT	u.usuarioId, 
			u.usuarioIdExterno, 
			u.usuarioNombre, 
			u.usuarioEmail, 
			u.usuarioPerfilId, 
			p.perfilNombre as usuarioPerfilNombre, 
			euroamer_admin_2008.Usuario_Caducado('U', u.usuarioId, 0) as usuarioCaducado,
			u.usuarioActivo,
			u.usuarioId as usuarioagenciaId,
			u.usuarioNombre as usuarioagenciaNombre,
			'U' as usuarioOrigen,
			usuariopaisid as agenciaPaisId,
			paisImpuesto as agenciaImpuesto,
            ' ' as UsuarioAgenciaDireccion,
            ' ' as UsuarioAgenciaCorreo,
			a.paisDocumentoFormato
	FROM	USUARIO u, PERFIL p, PAIS a
	WHERE	u.usuarioPerfilId = p.perfilId AND usuarioPaisId = a.paisId AND
			u.usuarioLogin = @pUSUARIO_Login AND u.usuarioPassword = @pUSUARIO_Password
	UNION
	
	SELECT	a.agenciaId, 
			a.agenciaIdExterno, 
			a.agenciaNombre, 
			a.agenciaEmail, 
			a.agenciaPerfilId, 
			p.perfilNombre as agenciaPerfilNombre, 
			euroamer_admin_2008.Usuario_Caducado('A', a.agenciaId, 0) as usuarioCaducado,
			a.agenciaActivo,
			a.agenciaId as usuarioagenciaId,
			a.agenciaNombre as usuarioagenciaNombre,
			'A' as usuarioOrigen,
			a.agenciaPaisId, 
			(SELECT paisImpuesto FROM PAIS WHERE paisId = a.agenciaPaisId) as paisImpuesto,
            a.agenciaDireccion as UsuarioAgenciaDireccion,
            a.agenciaEmail as UsuarioAgenciaCorreo,
			(SELECT paisDocumentoFormato FROM PAIS WHERE paisId = a.agenciaPaisId) as paisDocumentoFormato
	FROM	AGENCIA a, PERFIL p
	WHERE	a.agenciaPerfilId = p.perfilId AND
			a.agenciaLogin = @pUSUARIO_Login AND a.agenciaPassword = @pUSUARIO_Password
	UNION
	
	SELECT	au.agenciausuarioId as usuarioId, 
			0 as usuarioIdExterno, 
			au.agenciausuarioNombre as usuarioNombre, 
			au.agenciausuarioEMail as usuarioEmail, 
			au.agenciausuarioPerfilId as usuarioPerfilId, 
			pe.perfilNombre as usuarioPerfilNombre, 
			euroamer_admin_2008.Usuario_Caducado('N', au.agenciaId, au.agenciausuarioId) as usuarioCaducado,
			(CASE WHEN (SELECT agenciaActivo FROM AGENCIA WHERE agenciaId = au.agenciaId) = 0 THEN 0 ELSE au.agenciausuarioActivo END) as usuarioActivo,
			au.agenciaId as usuarioAgenciaId,
			(SELECT agenciaNombre FROM AGENCIA WHERE agenciaId = au.agenciaId) as usuarioAgenciaNombre,
			'N' as usuarioOrigen,
			(SELECT agenciaPaisId FROM AGENCIA WHERE agenciaId = au.agenciaId) as agenciaPaisId,
			(SELECT paisImpuesto FROM PAIS WHERE paisId = (SELECT agenciaPaisId FROM AGENCIA WHERE agenciaId = au.agenciaId)) as paisImpuesto,
            (SELECT agenciaDireccion FROM AGENCIA WHERE agenciaId = au.agenciaId) as UsuarioAgenciaDireccion,
            (SELECT agenciaEmail FROM AGENCIA WHERE agenciaId = au.agenciaId) as UsuarioAgenciaCorreo,
			(SELECT paisDocumentoFormato FROM PAIS WHERE paisId = (SELECT agenciaPaisId FROM AGENCIA WHERE agenciaId = au.agenciaId)) as paisDocumentoFormato
	FROM	AGENCIA_USUARIO au, PERFIL pe
	WHERE	au.agenciausuarioPerfilId = pe.perfilId AND
			au.agenciausuarioLogin = @pUSUARIO_Login AND au.agenciausuarioClave = @pUSUARIO_Password
	
	UPDATE USUARIO SET usuarioUltimoAcceso = GETDATE() WHERE usuarioLogin = @pUSUARIO_Login AND usuarioPassword = @pUSUARIO_Password
	UPDATE AGENCIA SET agenciaUltimoAcceso = GETDATE() WHERE agenciaLogin = @pUSUARIO_Login AND agenciaPassword = @pUSUARIO_Password
	UPDATE AGENCIA_USUARIO SET agenciausuarioUltimoAcceso = GETDATE() WHERE agenciausuarioLogin = @pUSUARIO_Login AND agenciausuarioClave = @pUSUARIO_Password

END
