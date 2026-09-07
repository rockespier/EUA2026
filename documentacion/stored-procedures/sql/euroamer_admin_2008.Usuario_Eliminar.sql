-- Objeto: euroamer_admin_2008.Usuario_Eliminar
-- Creado en BD: 2013-12-24 08:50:59
-- Modificado en BD: 2025-02-05 07:41:59
-- Extraído: 2026-09-07 08:27:17 UTC
-- Referenciado por el backend .NET: SI
-- Parámetros:
--   @pUSUARIO_Id int (IN)
--   @pUSUARIO_Origen nvarchar (IN)


CREATE PROCEDURE [euroamer_admin_2008].[Usuario_Eliminar] 
	@pUSUARIO_Id INT,
	@pUSUARIO_Origen NVARCHAR(3)
AS
BEGIN

	SET NOCOUNT ON;

	IF (@pUSUARIO_Origen='U')
		BEGIN
			UPDATE USUARIO SET usuarioActivo=0 WHERE usuarioId = @pUSUARIO_Id
		END
	ELSE
		BEGIN
			UPDATE AGENCIA_USUARIO SET agenciausuarioActivo = 0 WHERE agenciausuarioId = @pUSUARIO_Id		
		END
	
     IF @@ROWCOUNT = 0
		BEGIN
		   select '' as errorDescripcion
		END
	ELSE 
		BEGIN
		   select 'ok' as errorDescripcion
		END
END
