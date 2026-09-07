-- Objeto: euroamer_admin_2008.Usuario_ObtenerDatos
-- Creado en BD: 2014-01-28 20:00:47
-- Modificado en BD: 2014-01-28 20:00:47
-- Extraído: 2026-09-07 08:27:17 UTC
-- Referenciado por el backend .NET: SI
-- Parámetros:
--   @pUSUARIO_Login varchar (IN)
--   @pUSUARIO_EMail varchar (IN)

CREATE PROCEDURE [Usuario_ObtenerDatos] 
	@pUSUARIO_Login VARCHAR(50),
	@pUSUARIO_EMail VARCHAR(50)
AS
BEGIN

	SET NOCOUNT ON;
	
	SELECT TOP 1 usuarioNombre, usuarioPassword FROM USUARIO WHERE usuarioLogin = @pUSUARIO_Login AND usuarioEmail = @pUSUARIO_EMail AND usuarioActivo = 1
	UNION
	SELECT TOP 1 agenciaNombre, agenciaPassword FROM AGENCIA WHERE agenciaLogin = @pUSUARIO_Login AND agenciaEmail = @pUSUARIO_EMail AND agenciaActivo = 1
	UNION
	SELECT TOP 1 agenciausuarioNombre, agenciausuarioClave FROM AGENCIA_USUARIO WHERE agenciausuarioLogin = @pUSUARIO_Login AND agenciausuarioEMail = @pUSUARIO_EMail AND agenciausuarioActivo = 1
	
END
