-- Objeto: euroamer_admin_2008.AgenciaUsuario_Obtener
-- Creado en BD: 2013-12-24 08:50:57
-- Modificado en BD: 2025-02-14 03:51:53
-- Extraído: 2026-09-07 08:27:16 UTC
-- Referenciado por el backend .NET: SI
-- Parámetros:
--   @pAGENCIA_Id int (IN)
--   @pAGENCIAUSUARIO_Id int (IN)
--   @pAGENCIAUSUARIO_SupervisorId int (IN)
--   @pAGENCIAUSUARIO_PerfilId int (IN)
--   @pAGENCIAUSUARIO_Activo int (IN)
--   @pAGENCIAUSUARIO_IncluirAgencia int (IN)

CREATE PROCEDURE [euroamer_admin_2008].[AgenciaUsuario_Obtener]
	@pAGENCIA_Id INT = 0,
	@pAGENCIAUSUARIO_Id INT = 0,
	@pAGENCIAUSUARIO_SupervisorId INT = 0,
	@pAGENCIAUSUARIO_PerfilId INT = 0,
	@pAGENCIAUSUARIO_Activo INT = -1,
	@pAGENCIAUSUARIO_IncluirAgencia INT
AS
BEGIN

	SET NOCOUNT ON;
	
	IF @pAGENCIAUSUARIO_IncluirAgencia = 0
		BEGIN
			SELECT	au.agenciaId, 
					au.agenciausuarioId, 
					au.agenciausuarioNombre,
					au.agenciausuarioTipoDocumento, 
					euroamer_admin_2008.ValorTipo_RecuperarNombre('agenciausuarioTipoDocumento',1) as usuarioAgenciaTipoDocumentoNombre, 
					au.agenciausuarioNumeroDocumento, 
					au.agenciausuarioTelefono, 
					au.agenciausuarioEmail, 
					au.agenciausuarioDireccion, 
					au.agenciausuarioLogin, 
					au.agenciausuarioClave, 
					au.agenciausuarioPerfilId, 
					p.perfilNombre as usuarioAgenciaPerfilNombre, 
					au.agenciausuarioSupervisorId, 
					ISNULL((SELECT agenciausuarioNombre FROM AGENCIA_USUARIO WHERE agenciausuarioId = au.agenciausuarioSupervisorId),'') as usuarioAgenciaSupervisorNombre, 
					au.agenciausuarioValidoDesde, 
					au.agenciausuarioValidoHasta, 
					au.agenciausuarioComentarios, 
					au.agenciausuarioUltimoAcceso, 
					au.agenciausuarioCreadoFecha,
					au.agenciausuarioCreadoUsuarioId,
					au.agenciausuarioModificadoFecha,
					au.agenciausuarioModificadoUsuarioId,
					au.agenciausuarioActivo
			FROM	AGENCIA_USUARIO au, PERFIL p
			WHERE	au.agenciausuarioPerfilId = p.perfilId AND
					au.agenciaId = @pAGENCIA_Id AND
					(@pAGENCIAUSUARIO_Id = 0 OR au.agenciausuarioId = @pAGENCIAUSUARIO_Id) AND
					(@pAGENCIAUSUARIO_SupervisorId = 0 OR (au.agenciausuarioSupervisorId = @pAGENCIAUSUARIO_SupervisorId OR au.agenciausuarioId = @pAGENCIAUSUARIO_SupervisorId)) AND
					(@pAGENCIAUSUARIO_PerfilId = 0 OR au.agenciausuarioPerfilId = @pAGENCIAUSUARIO_PerfilId) AND
					(@pAGENCIAUSUARIO_Activo = -1 OR au.agenciausuarioActivo = @pAGENCIAUSUARIO_Activo)
		END
	ELSE
		BEGIN
			SELECT	agenciaId, 
					agenciaId agenciausuarioId, 
					agenciaNombre as agenciausuarioNombre,
					'' agenciausuarioTipoDocumento, 
					'' usuarioAgenciaTipoDocumentoNombre, 
					'' agenciausuarioNumeroDocumento, 
					'' agenciausuarioTelefono, 
					agenciaEmail as agenciausuarioEmail, 
					agenciaDireccion as agenciausuarioDireccion, 
					agenciaLogin as agenciausuarioLogin, 
					'' agenciausuarioClave, 
					agenciaPerfilId as agenciausuarioPerfilId, 
					'' usuarioAgenciaPerfilNombre, 
					'' agenciaSupervisorId, 
					'' usuarioAgenciaSupervisorNombre, 
					agenciaValidoDesde as agenciausuarioValidoDesde, 
					agenciaValidoHasta as agenciausuarioValidoHasta, 
					agenciaComentarios as agenciausuarioComentarios, 
					agenciaUltimoAcceso as agenciausuarioUltimoAcceso, 
					agenciaCreadoFecha as agenciausuarioCreadoFecha,
					agenciaCreadoUsuarioId as agenciausuarioCreadoUsuarioId,
					agenciaModificadoFecha as agenciausuarioModificadoFecha,
					agenciaModificadoUsuarioId as agenciausuarioModificadoUsuarioId,
					agenciaActivo as agenciausuarioActivo
			FROM	AGENCIA 
			WHERE	agenciaId = @pAGENCIA_Id AND
					agenciaActivo = 1
			UNION ALL
			SELECT	au.agenciaId, 
					au.agenciausuarioId, 
					au.agenciausuarioNombre,
					au.agenciausuarioTipoDocumento, 
					euroamer_admin_2008.ValorTipo_RecuperarNombre('agenciausuarioTipoDocumento',1) as usuarioAgenciaTipoDocumentoNombre, 
					au.agenciausuarioNumeroDocumento, 
					au.agenciausuarioTelefono, 
					au.agenciausuarioEmail, 
					au.agenciausuarioDireccion, 
					au.agenciausuarioLogin, 
					au.agenciausuarioClave, 
					au.agenciausuarioPerfilId, 
					p.perfilNombre as usuarioAgenciaPerfilNombre, 
					au.agenciausuarioSupervisorId, 
					ISNULL((SELECT agenciausuarioNombre FROM AGENCIA_USUARIO WHERE agenciausuarioId = au.agenciausuarioSupervisorId),'') as usuarioAgenciaSupervisorNombre, 
					au.agenciausuarioValidoDesde, 
					au.agenciausuarioValidoHasta, 
					au.agenciausuarioComentarios, 
					au.agenciausuarioUltimoAcceso, 
					au.agenciausuarioCreadoFecha,
					au.agenciausuarioCreadoUsuarioId,
					au.agenciausuarioModificadoFecha,
					au.agenciausuarioModificadoUsuarioId,
					au.agenciausuarioActivo
			FROM	AGENCIA_USUARIO au, PERFIL p
			WHERE	au.agenciausuarioPerfilId = p.perfilId AND
					au.agenciaId = @pAGENCIA_Id AND					
					(@pAGENCIAUSUARIO_Id = 0 OR au.agenciausuarioId = @pAGENCIAUSUARIO_Id) AND
					(@pAGENCIAUSUARIO_SupervisorId = 0 OR (au.agenciausuarioSupervisorId = @pAGENCIAUSUARIO_SupervisorId OR au.agenciausuarioId = @pAGENCIAUSUARIO_SupervisorId)) AND
					(@pAGENCIAUSUARIO_PerfilId = 0 OR au.agenciausuarioPerfilId = @pAGENCIAUSUARIO_PerfilId) AND					
					(@pAGENCIAUSUARIO_Activo = -1 OR au.agenciausuarioActivo = @pAGENCIAUSUARIO_Activo)
		END
END
