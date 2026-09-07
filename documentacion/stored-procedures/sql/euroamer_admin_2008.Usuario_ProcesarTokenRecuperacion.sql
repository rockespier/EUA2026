-- Objeto: euroamer_admin_2008.Usuario_ProcesarTokenRecuperacion
-- Creado en BD: 2025-04-15 04:41:54
-- Modificado en BD: 2025-04-15 08:08:30
-- Extraído: 2026-09-07 08:27:17 UTC
-- Referenciado por el backend .NET: SI
-- Parámetros:
--   @pUSUARIO_Login varchar (IN)


CREATE procedure [Usuario_ProcesarTokenRecuperacion]
(
@pUSUARIO_Login varchar(100)
)
as
BEGIN
SET NOCOUNT ON

SET TRANSACTION ISOLATION LEVEL READ UNCOMMITTED

DECLARE @vMenError NVARCHAR(700);
DECLARE @vResultadoCorrecto NVARCHAR(700);

DECLARE @EXISTETOKEN INT=0;
DECLARE @TOKENID VARCHAR(100)='';
SET @TOKENID =replace(newid(), '-', '');

BEGIN TRY

	DECLARE @CORREOCORRECTOA INT=0;
	DECLARE @CORREOCORRECTOU INT=0;
	DECLARE @CORREOCORRECTON INT=0;
	DECLARE @CORREOCORRECTOFIN INT=0;
	DECLARE @TIPOUSUARIO NVARCHAR(10)='';
	DECLARE @IDUSUARIO INT=0;

	SELECT @CORREOCORRECTOU= count(usuarioId) from USUARIO where upper(usuarioLogin)=upper(@pUSUARIO_Login);
	SELECT @CORREOCORRECTOA= count(agenciaId) from AGENCIA where upper(agenciaLogin)=upper(@pUSUARIO_Login);
	SELECT @CORREOCORRECTON= count(agenciausuarioId) from AGENCIA_USUARIO where upper(agenciausuarioLogin)=upper(@pUSUARIO_Login);

	IF (@CORREOCORRECTOU=1)
		BEGIN
			SET @TIPOUSUARIO='U';
			SET @CORREOCORRECTOFIN= @CORREOCORRECTOU;
			SELECT @IDUSUARIO= usuarioId from USUARIO where upper(usuarioLogin)=upper(@pUSUARIO_Login);
		END
	ELSE IF (@CORREOCORRECTOA=1)
		BEGIN
			SET @TIPOUSUARIO='A';
			SET @CORREOCORRECTOFIN= @CORREOCORRECTOA;
			SELECT @IDUSUARIO= agenciaId from AGENCIA where upper(agenciaLogin)=upper(@pUSUARIO_Login);
		END
	ELSE IF (@CORREOCORRECTON=1)
		BEGIN
			SET @TIPOUSUARIO='N';
			SET @CORREOCORRECTOFIN= @CORREOCORRECTON;
			SELECT @IDUSUARIO= agenciausuarioId from AGENCIA_USUARIO where upper(agenciausuarioLogin)=upper(@pUSUARIO_Login)
		END

	
	if @CORREOCORRECTOFIN=0
		BEGIN
			SET @vMenError= 'La Agencia / Usuario / Usuario-Agencia no se encuentra registrado.';
				RAISERROR(@vMenError,16,1);
		END

	ELSE
		BEGIN
			 UPDATE [USUARIO_RECUPERAR] SET [usuarioRecuperActivo]=0 WHERE [usuarioId]= @IDUSUARIO;

			INSERT INTO [USUARIO_RECUPERAR]
				   ([usuarioId]
				   ,[usuarioOrigen]
				   ,[token]
				   ,[usuarioRecuperFechaRegistro]
				   ,[usuarioRecuperActivo])
			 VALUES
				   (@IDUSUARIO
				   ,@TIPOUSUARIO
				   ,@TOKENID
				   ,GETDATE()
				   ,1)
				
		END

	select @TOKENID as errorDescripcion

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
