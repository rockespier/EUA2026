-- Objeto: euroamer_admin_2008.Usuario_CerrarTokenRecuperacion
-- Creado en BD: 2025-04-15 08:12:31
-- Modificado en BD: 2025-04-15 08:12:31
-- Extraído: 2026-09-07 08:27:17 UTC
-- Referenciado por el backend .NET: SI
-- Parámetros:
--   @pUSUARIO_Id varchar (IN)
--   @pUSUARIO_Origen varchar (IN)


create procedure [Usuario_CerrarTokenRecuperacion]
(
@pUSUARIO_Id varchar(100),
@pUSUARIO_Origen varchar(100)
)
as
BEGIN
SET NOCOUNT ON

SET TRANSACTION ISOLATION LEVEL READ UNCOMMITTED


BEGIN TRY


    UPDATE [USUARIO_RECUPERAR] SET [usuarioRecuperActivo]=0 WHERE [usuarioId]= @pUSUARIO_Id and [usuarioOrigen]=@pUSUARIO_Origen;

	IF @@ROWCOUNT = 0
		BEGIN
			select '' as descripcion
		END
	ELSE 
		BEGIN
			select 'ok' as descripcion
		END

END TRY

BEGIN CATCH
DECLARE @ErrorMessage NVARCHAR(4000);
DECLARE @ErrorSeverity INT;
DECLARE @ErrorState INT;

SELECT 
@ErrorMessage = ERROR_MESSAGE(),
@ErrorSeverity = ERROR_SEVERITY(),
@ErrorState = ERROR_STATE();


RAISERROR (@ErrorMessage, -- Mensaje de texto.
  @ErrorSeverity, -- Gravedad.
  @ErrorState -- Estado.
  );
END CATCH;

END
