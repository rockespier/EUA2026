-- Objeto: euroamer_admin_2008.Usuario_Procesar
-- Creado en BD: 2013-12-24 08:50:59
-- Modificado en BD: 2025-09-01 07:49:18
-- Extraído: 2026-09-07 08:27:17 UTC
-- Referenciado por el backend .NET: SI
-- Parámetros:
--   @pUSUARIO_Id int (IN)
--   @pUSUARIO_Login varchar (IN)
--   @pUSUARIO_Password varchar (IN)
--   @pUSUARIO_Nombre varchar (IN)
--   @pUSUARIO_Email varchar (IN)
--   @pUSUARIO_PerfilId int (IN)
--   @pUSUARIO_ValidoDesde date (IN)
--   @pUSUARIO_ValidoHasta date (IN)
--   @pUSUARIO_Foto varchar (IN)
--   @pUSUARIO_Comentarios text (IN)
--   @pUSUARIO_UsuarioId int (IN)
--   @pUSUARIO_Activo int (IN)
--   @pUSUARIO_PaisId int (IN)
--   @pUSUARIO_TipoDocumento varchar (IN)
--   @pUSUARIO_NumeroDocumento varchar (IN)
--   @pUSUARIO_Banco varchar (IN)
--   @pUSUARIO_NumeroCuenta varchar (IN)
--   @pUSUARIO_ActualizarContrasena int (IN)

CREATE PROCEDURE [euroamer_admin_2008].[Usuario_Procesar] 
	@pUSUARIO_Id INT,
	@pUSUARIO_Login VARCHAR(50), 
	@pUSUARIO_Password VARCHAR(50), 
	@pUSUARIO_Nombre VARCHAR(100), 
	@pUSUARIO_Email VARCHAR(50), 
	@pUSUARIO_PerfilId INT,
	@pUSUARIO_ValidoDesde DATE,
	@pUSUARIO_ValidoHasta DATE,
	@pUSUARIO_Foto VARCHAR(50), 
	@pUSUARIO_Comentarios TEXT,
	@pUSUARIO_UsuarioId INT,
	@pUSUARIO_Activo INT,
    @pUSUARIO_PaisId INT,
	@pUSUARIO_TipoDocumento VARCHAR(3), 
	@pUSUARIO_NumeroDocumento VARCHAR(20), 
	@pUSUARIO_Banco VARCHAR(3), 
	@pUSUARIO_NumeroCuenta VARCHAR(30),
	@pUSUARIO_ActualizarContrasena INT = 0
AS
BEGIN

    --exec Usuario_Procesar 0,"gesmexico","Mexico2025#","Gestor Mexico","gestormexico@euroamericanassistance.com",28,"2025-09-01","2025-11-01",null,null,1,1,6,"4","45436543634","3","777788899",0

	SET NOCOUNT ON;
	declare @tipoproceso int = 0;
	declare @resultado varchar(300) = '';
	declare @FechaHoraActual datetime = [euroamer_admin_2008].[fuObtenerFechaActualPeruana]();
	DECLARE @CORREOCORRECTOA INT=0;
	DECLARE @CORREOCORRECTOU INT=0;
	DECLARE @CORREOCORRECTON INT=0;
	DECLARE @CORREOCORRECTOFIN INT=0;
	BEGIN TRY
		SELECT @CORREOCORRECTOU= count(usuarioId) from USUARIO where upper(usuarioLogin)=upper(@pUSUARIO_Login);
		SELECT @CORREOCORRECTOA= count(agenciaId) from AGENCIA where upper(agenciaLogin)=upper(@pUSUARIO_Login);
		SELECT @CORREOCORRECTON= count(agenciausuarioId) from AGENCIA_USUARIO where upper(agenciausuarioLogin)=upper(@pUSUARIO_Login);
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

	   IF (@CORREOCORRECTOFIN>0 and @pUSUARIO_Id=0)
			BEGIN
				RAISERROR('Este login ya existe usar otro.',16,1);
			END
   
	   IF @pUSUARIO_Id = 0
			BEGIN
				set @tipoproceso=1;
				INSERT INTO USUARIO (
					usuarioLogin, 					usuarioPassword,					usuarioNombre,
					usuarioEmail, 					usuarioPerfilId,					usuarioValidoDesde,
					usuarioValidoHasta, 					usuarioFoto,					usuarioComentarios,
					usuarioUltimoAcceso,					usuarioCreadoFecha,					usuarioCreadoUsuarioId,
					usuarioModificadoFecha,					usuarioModificadoUsuarioId,					usuarioActivo,
					usuarioPaisId,					usuarioTipoDocumento,					usuarioNumeroDocumento,
					usuarioBanco,					usuarioNumeroCuenta)
				VALUES (
					@pUSUARIO_Login, 	SubString(master.dbo.fn_varbintohexstr(HashBytes('MD5', @pUSUARIO_Password)), 3, 32),	@pUSUARIO_Nombre,
					@pUSUARIO_Email,					@pUSUARIO_PerfilId,					@pUSUARIO_ValidoDesde,
					@pUSUARIO_ValidoHasta,					@pUSUARIO_Foto,					@pUSUARIO_Comentarios,
					null,					@FechaHoraActual,					@pUSUARIO_UsuarioId,
					@FechaHoraActual,					@pUSUARIO_UsuarioId,					1,
					@pUSUARIO_PaisId,					@pUSUARIO_TipoDocumento,					@pUSUARIO_NumeroDocumento,
					@pUSUARIO_Banco, 					@pUSUARIO_NumeroCuenta)
					IF @@ROWCOUNT > 0
						BEGIN
							set @resultado = 'ok'
						END			
			END
		ELSE
			BEGIN
				set @tipoproceso=2;
				if @pUSUARIO_ActualizarContrasena = 1 
					begin
						UPDATE USUARIO SET 
							usuarioPassword = SubString(master.dbo.fn_varbintohexstr(HashBytes('MD5', @pUSUARIO_Password)), 3, 32)
						WHERE usuarioId = @pUSUARIO_Id 
					end
				UPDATE USUARIO SET 
					usuarioLogin = @pUSUARIO_Login,
					usuarioNombre = @pUSUARIO_Nombre, 
					usuarioEmail = @pUSUARIO_Email, 
					usuarioPerfilId = @pUSUARIO_PerfilId, 
					usuarioValidoDesde = @pUSUARIO_ValidoDesde, 
					usuarioValidoHasta = @pUSUARIO_ValidoHasta, 
					usuarioFoto = @pUSUARIO_Foto, 
					usuarioComentarios = @pUSUARIO_Comentarios, 
					usuarioModificadoFecha =@FechaHoraActual,
					usuarioModificadoUsuarioId = @pUSUARIO_UsuarioId,
					usuarioActivo = @pUSUARIO_Activo,
					usuarioPaisId = @pUSUARIO_PaisId,
					usuarioTipoDocumento = @pUSUARIO_TipoDocumento,
					usuarioNumeroDocumento = @pUSUARIO_NumeroDocumento,
					usuarioBanco = @pUSUARIO_Banco,
					usuarioNumeroCuenta = @pUSUARIO_NumeroCuenta
				WHERE usuarioId = @pUSUARIO_Id  
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
