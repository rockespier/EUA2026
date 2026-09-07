-- Objeto: euroamer_admin_2008.AgenciaUsuario_Eliminar
-- Creado en BD: 2013-12-24 08:50:57
-- Modificado en BD: 2025-01-02 06:23:40
-- Extraído: 2026-09-07 08:27:16 UTC
-- Referenciado por el backend .NET: SI
-- Parámetros:
--   @pAGENCIAUSUARIO_Id int (IN)


CREATE PROCEDURE [AgenciaUsuario_Eliminar]
	@pAGENCIAUSUARIO_Id INT
AS
BEGIN

	SET NOCOUNT ON;

    UPDATE AGENCIA_USUARIO SET agenciausuarioActivo = 0 WHERE agenciausuarioId = @pAGENCIAUSUARIO_Id
    
	IF @@ROWCOUNT = 0
		BEGIN
		   select '' as errorDescripcion
		END
	ELSE 
		BEGIN
		   select 'ok' as errorDescripcion
		END

END
