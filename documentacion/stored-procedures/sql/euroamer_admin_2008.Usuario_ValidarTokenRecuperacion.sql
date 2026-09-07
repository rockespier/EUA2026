-- Objeto: euroamer_admin_2008.Usuario_ValidarTokenRecuperacion
-- Creado en BD: 2025-04-15 08:11:12
-- Modificado en BD: 2025-04-15 08:11:12
-- Extraído: 2026-09-07 08:27:17 UTC
-- Referenciado por el backend .NET: SI
-- Parámetros:
--   @pUSUARIO_Token varchar (IN)
--   @pUSUARIO_Duracion int (IN)

create procedure [Usuario_ValidarTokenRecuperacion]
(
@pUSUARIO_Token varchar(500),
@pUSUARIO_Duracion int
)
as
BEGIN
SET NOCOUNT ON

SET TRANSACTION ISOLATION LEVEL READ UNCOMMITTED

DECLARE @vMenError NVARCHAR(700);
DECLARE @vResultadoCorrecto NVARCHAR(700);
DECLARE @EXISTETOKEN INT=0;
DECLARE @DIFERENCIATIEMPO INT=0;
DECLARE @ORIGEN VARCHAR(30)='';
DECLARE @ESTADOCADUCA INT=0;
DECLARE @IDUSUARIO INT=0;
DECLARE @tiempoActua datetime; 
DECLARE @tiempoRegistrado datetime; 
SET @tiempoActua=GETDATE();

BEGIN TRY

	 SELECT @EXISTETOKEN =[usuarioRecuperId], @tiempoRegistrado=[usuarioRecuperFechaRegistro], @ESTADOCADUCA=[usuarioRecuperActivo], @IDUSUARIO=[usuarioId],
	 @ORIGEN=[usuarioOrigen]
	 from [USUARIO_RECUPERAR] 
	 WHERE [token]=@pUSUARIO_Token 
	 
	 IF @EXISTETOKEN=0
		BEGIN
				SET @vMenError='El token no existe.';
				RAISERROR(@vMenError,16,1);
		END
	ELSE
		BEGIN
			IF @ESTADOCADUCA = 0
				BEGIN
						SET @vMenError='El token ha sido usado.';
						RAISERROR(@vMenError,16,1);
				END
			ELSE 
				BEGIN
					SET @DIFERENCIATIEMPO = DATEDIFF(MINUTE, @tiempoRegistrado, @tiempoActua)
					IF @DIFERENCIATIEMPO > @pUSUARIO_Duracion
						BEGIN
							SET @vMenError='El token ha caducado.';
							RAISERROR(@vMenError,16,1);
						END
					
				END
		END

	select @IDUSUARIO as codigo, @ORIGEN as descripcion;

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
