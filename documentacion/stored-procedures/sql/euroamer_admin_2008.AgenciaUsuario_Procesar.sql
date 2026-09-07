-- Objeto: euroamer_admin_2008.AgenciaUsuario_Procesar
-- Creado en BD: 2013-12-24 08:50:57
-- Modificado en BD: 2025-07-08 07:20:15
-- Extraído: 2026-09-07 08:27:16 UTC
-- Referenciado por el backend .NET: SI
-- Parámetros:
--   @pAGENCIA_Id int (IN)
--   @pAGENCIAUSUARIO_Id int (IN)
--   @pAGENCIAUSUARIO_Nombre varchar (IN)
--   @pAGENCIAUSUARIO_TipoDocumento varchar (IN)
--   @pAGENCIAUSUARIO_NumeroDocumento varchar (IN)
--   @pAGENCIAUSUARIO_Telefono varchar (IN)
--   @pAGENCIAUSUARIO_Email varchar (IN)
--   @pAGENCIAUSUARIO_Direccion varchar (IN)
--   @pAGENCIAUSUARIO_Login varchar (IN)
--   @pAGENCIAUSUARIO_Clave varchar (IN)
--   @pAGENCIAUSUARIO_PerfilId int (IN)
--   @pAGENCIAUSUARIO_SupervisorId int (IN)
--   @pAGENCIAUSUARIO_ValidoDesde datetime (IN)
--   @pAGENCIAUSUARIO_ValidoHasta datetime (IN)
--   @pAGENCIAUSUARIO_Comentarios text (IN)
--   @pAGENCIAUSUARIO_Usuario int (IN)
--   @pAGENCIAUSUARIO_Activo int (IN)
--   @pAGENCIAUSUARIO_Banco varchar (IN)
--   @pAGENCIAUSUARIO_NumeroCuenta varchar (IN)
--   @pAGENCIAUSUARIO_ActualizarContrasena int (IN)

CREATE PROCEDURE [euroamer_admin_2008].[AgenciaUsuario_Procesar]
	@pAGENCIA_Id INT,
	@pAGENCIAUSUARIO_Id INT,
	@pAGENCIAUSUARIO_Nombre VARCHAR(100), 
	@pAGENCIAUSUARIO_TipoDocumento VARCHAR(3), 
	@pAGENCIAUSUARIO_NumeroDocumento VARCHAR(20), 
	@pAGENCIAUSUARIO_Telefono VARCHAR(20), 
	@pAGENCIAUSUARIO_Email VARCHAR(100), 
	@pAGENCIAUSUARIO_Direccion VARCHAR(120), 
    @pAGENCIAUSUARIO_Login VARCHAR(50), 
    @pAGENCIAUSUARIO_Clave VARCHAR(50), 
	@pAGENCIAUSUARIO_PerfilId INT,
	@pAGENCIAUSUARIO_SupervisorId INT,
	@pAGENCIAUSUARIO_ValidoDesde DATETIME,
	@pAGENCIAUSUARIO_ValidoHasta DATETIME,
	@pAGENCIAUSUARIO_Comentarios TEXT,
	@pAGENCIAUSUARIO_Usuario INT,
	@pAGENCIAUSUARIO_Activo INT,
	@pAGENCIAUSUARIO_Banco VARCHAR(3), 
	@pAGENCIAUSUARIO_NumeroCuenta VARCHAR(30),
	@pAGENCIAUSUARIO_ActualizarContrasena INT = 0
AS
BEGIN
	
	SET NOCOUNT ON;
	declare @tipoproceso int = 0;
	declare @resultado varchar(300) = '';
	declare @FechaHoraActual datetime = [euroamer_admin_2008].[fuObtenerFechaActualPeruana]();
	DECLARE @CORREOCORRECTOA INT=0;
	DECLARE @CORREOCORRECTOU INT=0;
	DECLARE @CORREOCORRECTON INT=0;
	DECLARE @CORREOCORRECTOFIN INT=0;
	BEGIN TRY
		SELECT @CORREOCORRECTOU= count(usuarioId) from USUARIO where upper(usuarioLogin)=upper(@pAGENCIAUSUARIO_Login);
		SELECT @CORREOCORRECTOA= count(agenciaId) from AGENCIA where upper(agenciaLogin)=upper(@pAGENCIAUSUARIO_Login);
		SELECT @CORREOCORRECTON= count(agenciausuarioId) from AGENCIA_USUARIO where upper(agenciausuarioLogin)=upper(@pAGENCIAUSUARIO_Login);
		IF (@CORREOCORRECTOU=1)
			BEGIN
				SET @CORREOCORRECTOFIN= @CORREOCORRECTOU;
			END
		ELSE IF (@CORREOCORRECTOA=1)
			BEGIN
				SET @CORREOCORRECTOFIN= @CORREOCORRECTOA;
			END
		ELSE IF (@CORREOCORRECTON=1)
			BEGIN
				SET @CORREOCORRECTOFIN= @CORREOCORRECTON;
			END

	   IF (@CORREOCORRECTOFIN>0 and @pAGENCIAUSUARIO_Id=0)
			BEGIN
				RAISERROR('Este login ya existe usar otro.',16,1);
			END

		IF @pAGENCIAUSUARIO_Id = 0
			BEGIN
				set @tipoproceso=1;
				INSERT INTO AGENCIA_USUARIO (
					agenciaId,
					agenciausuarioNombre,
					agenciausuarioTipoDocumento,
					agenciausuarioNumeroDocumento,
					agenciausuarioTelefono,
					agenciausuarioEMail,
					agenciausuarioDireccion,
					agenciausuarioLogin,
					agenciausuarioClave,
					agenciausuarioPerfilId,
					agenciausuarioSupervisorId,
					agenciausuarioValidoDesde,
					agenciausuarioValidoHasta,
					agenciausuarioComentarios,
					agenciausuarioUltimoAcceso,
					agenciausuarioCreadoFecha,
					agenciausuarioCreadoUsuarioId,
					agenciausuarioModificadoFecha,
					agenciausuarioModificadoUsuarioId,
					agenciausuarioActivo,
					agenciausuarioBanco,
					agenciausuarioNumeroCuenta)
				VALUES (
					@pAGENCIA_Id,
					@pAGENCIAUSUARIO_Nombre, 
					@pAGENCIAUSUARIO_TipoDocumento, 
					@pAGENCIAUSUARIO_NumeroDocumento,
					@pAGENCIAUSUARIO_Telefono, 
					@pAGENCIAUSUARIO_Email,
					@pAGENCIAUSUARIO_Direccion, 
					@pAGENCIAUSUARIO_Login,
					SubString(master.dbo.fn_varbintohexstr(HashBytes('MD5', @pAGENCIAUSUARIO_Clave)), 3, 32),
					@pAGENCIAUSUARIO_PerfilId,
					@pAGENCIAUSUARIO_SupervisorId,
					@pAGENCIAUSUARIO_ValidoDesde,
					@pAGENCIAUSUARIO_ValidoHasta,
					@pAGENCIAUSUARIO_Comentarios,
					null,
					@FechaHoraActual,
					@pAGENCIAUSUARIO_Usuario,
					@FechaHoraActual,
					@pAGENCIAUSUARIO_Usuario,
					1,
					@pAGENCIAUSUARIO_Banco,
					@pAGENCIAUSUARIO_NumeroCuenta)
					IF @@ROWCOUNT > 0
						BEGIN
							set @resultado = 'ok'
						END
			END
		ELSE
			BEGIN
					set @tipoproceso=2;
					if @pAGENCIAUSUARIO_ActualizarContrasena = 1 
						begin
							UPDATE AGENCIA_USUARIO SET 
								agenciausuarioClave = SubString(master.dbo.fn_varbintohexstr(HashBytes('MD5', @pAGENCIAUSUARIO_Clave)), 3, 32)
							WHERE agenciausuarioId = @pAGENCIAUSUARIO_Id 
						end
					UPDATE AGENCIA_USUARIO SET 
						agenciausuarioLogin = @pAGENCIAUSUARIO_Login,
						agenciausuarioNombre = @pAGENCIAUSUARIO_Nombre, 
						agenciausuarioTipoDocumento = @pAGENCIAUSUARIO_TipoDocumento, 
						agenciausuarioNumeroDocumento = @pAGENCIAUSUARIO_NumeroDocumento,
						agenciausuarioTelefono = @pAGENCIAUSUARIO_Telefono, 
						agenciausuarioEmail = @pAGENCIAUSUARIO_Email, 
						agenciausuarioDireccion = @pAGENCIAUSUARIO_Direccion,
						agenciausuarioPerfilId = @pAGENCIAUSUARIO_PerfilId, 
						agenciausuarioSupervisorId = @pAGENCIAUSUARIO_SupervisorId,
						agenciausuarioValidoDesde = @pAGENCIAUSUARIO_ValidoDesde, 
						agenciausuarioValidoHasta = @pAGENCIAUSUARIO_ValidoHasta, 
						agenciausuarioComentarios = @pAGENCIAUSUARIO_Comentarios, 
						agenciausuarioModificadoFecha = @FechaHoraActual,
						agenciausuarioModificadoUsuarioId = @pAGENCIAUSUARIO_Usuario,
						agenciausuarioActivo = @pAGENCIAUSUARIO_Activo,
						agenciausuarioBanco = @pAGENCIAUSUARIO_Banco,
						agenciausuarioNumeroCuenta = @pAGENCIAUSUARIO_NumeroCuenta 
					WHERE agenciausuarioId = @pAGENCIAUSUARIO_Id 
					IF @@ROWCOUNT > 0
						BEGIN
							set @resultado = 'ok'
						END
			END
		select @tipoproceso as errorCodigo, @resultado as errorDescripcion

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
