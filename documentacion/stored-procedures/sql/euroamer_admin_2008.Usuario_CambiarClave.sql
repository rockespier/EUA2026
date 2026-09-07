-- Objeto: euroamer_admin_2008.Usuario_CambiarClave
-- Creado en BD: 2014-01-28 20:00:47
-- Modificado en BD: 2025-04-15 08:09:02
-- Extraído: 2026-09-07 08:27:17 UTC
-- Referenciado por el backend .NET: SI
-- Parámetros:
--   @pUSUARIO_Origen varchar (IN)
--   @pUSUARIO_Id int (IN)
--   @pUSUARIO_Password varchar (IN)

CREATE PROCEDURE [euroamer_admin_2008].[Usuario_CambiarClave] 
	@pUSUARIO_Origen VARCHAR(1), 
	@pUSUARIO_Id INT, 
	@pUSUARIO_Password VARCHAR(50)
AS
BEGIN

	SET NOCOUNT ON;
	
	IF @pUSUARIO_Origen = 'U'
		BEGIN
			UPDATE USUARIO SET usuarioPassword = SubString(master.dbo.fn_varbintohexstr(HashBytes('MD5', @pUSUARIO_Password)), 3, 32)  WHERE usuarioId = @pUSUARIO_Id
		END
	ELSE IF @pUSUARIO_Origen = 'A'
		BEGIN
			UPDATE AGENCIA SET agenciaPassword = SubString(master.dbo.fn_varbintohexstr(HashBytes('MD5', @pUSUARIO_Password)), 3, 32)  WHERE agenciaId = @pUSUARIO_Id
		END
	ELSE IF @pUSUARIO_Origen = 'N'
		BEGIN
			UPDATE AGENCIA_USUARIO SET agenciausuarioClave = SubString(master.dbo.fn_varbintohexstr(HashBytes('MD5', @pUSUARIO_Password)), 3, 32)  WHERE agenciausuarioId = @pUSUARIO_Id
		END
	
	IF @@ROWCOUNT = 0
		BEGIN
		   select '' as descripcion
		END
	ELSE 
		BEGIN
		   select 'ok' as descripcion
		END
	
END
