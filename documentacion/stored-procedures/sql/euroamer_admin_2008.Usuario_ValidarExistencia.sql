-- Objeto: euroamer_admin_2008.Usuario_ValidarExistencia
-- Creado en BD: 2013-12-24 08:50:59
-- Modificado en BD: 2025-04-15 08:08:45
-- Extraído: 2026-09-07 08:27:17 UTC
-- Referenciado por el backend .NET: SI
-- Parámetros:
--   @pUSUARIO_Opcion char (IN)
--   @pUSUARIO_Parametro varchar (IN)

CREATE PROCEDURE [euroamer_admin_2008].[Usuario_ValidarExistencia] 
	@pUSUARIO_Opcion CHAR(1),
	@pUSUARIO_Parametro VARCHAR(50)
AS
BEGIN

	SET NOCOUNT ON;
	
	DECLARE @vUSUARIO_Existe INT = 0
	DECLARE @vAGENCIA_Existe INT = 0
	DECLARE @vAGENCIAUSUARIO_Existe INT = 0
	DECLARE @vUsuarioResultado INT = null


	IF @pUSUARIO_Opcion = 'L'
		BEGIN
			SET @vUSUARIO_Existe = (SELECT COUNT(usuarioId) FROM USUARIO WHERE usuarioLogin = @pUSUARIO_Parametro)
			SET @vAGENCIA_Existe = (SELECT COUNT(agenciaId) FROM AGENCIA WHERE agenciaLogin = @pUSUARIO_Parametro)
			SET @vAGENCIAUSUARIO_Existe = (SELECT COUNT(agenciausuarioId) FROM AGENCIA_USUARIO WHERE agenciausuarioLogin = @pUSUARIO_Parametro)
		END
	ELSE IF @pUSUARIO_Opcion = 'E'
		BEGIN
			SET @vUSUARIO_Existe = (SELECT COUNT(usuarioId) FROM USUARIO WHERE usuarioEmail = @pUSUARIO_Parametro)
			SET @vAGENCIA_Existe = (SELECT COUNT(agenciaId) FROM AGENCIA WHERE agenciaEmail = @pUSUARIO_Parametro)
			SET @vAGENCIAUSUARIO_Existe = (SELECT COUNT(agenciausuarioId) FROM AGENCIA_USUARIO WHERE agenciausuarioEMail = @pUSUARIO_Parametro)
		END

	IF @vUSUARIO_Existe>0
		BEGIN
			IF @pUSUARIO_Opcion = 'L'
				BEGIN
					SELECT @vUsuarioResultado = usuarioId FROM USUARIO WHERE usuarioLogin = @pUSUARIO_Parametro
				END
			ELSE IF @pUSUARIO_Opcion = 'E'
				BEGIN
					SELECT @vUsuarioResultado = usuarioId FROM USUARIO WHERE usuarioEmail = @pUSUARIO_Parametro
				END
		END
	ELSE IF @vAGENCIA_Existe>0
		BEGIN
			IF @pUSUARIO_Opcion = 'L'
				BEGIN
					SELECT @vUsuarioResultado = agenciaId FROM AGENCIA WHERE agenciaLogin = @pUSUARIO_Parametro
				END
			ELSE IF @pUSUARIO_Opcion = 'E'
				BEGIN
					SELECT @vUsuarioResultado = agenciaId FROM AGENCIA WHERE agenciaEmail = @pUSUARIO_Parametro
				END
		END
	ELSE IF @vAGENCIAUSUARIO_Existe>0
		BEGIN
			IF @pUSUARIO_Opcion = 'L'
				BEGIN
					SELECT @vUsuarioResultado = agenciausuarioId FROM AGENCIA_USUARIO WHERE agenciausuarioLogin = @pUSUARIO_Parametro
				END
			ELSE IF @pUSUARIO_Opcion = 'E'
				BEGIN
					SELECT @vUsuarioResultado = agenciausuarioId FROM AGENCIA_USUARIO WHERE agenciausuarioEMail = @pUSUARIO_Parametro
				END
		END

	select @vUsuarioResultado as errorCodigo 

END
