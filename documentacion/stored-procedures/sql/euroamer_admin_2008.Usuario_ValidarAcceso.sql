-- Objeto: euroamer_admin_2008.Usuario_ValidarAcceso
-- Creado en BD: 2013-12-24 08:50:59
-- Modificado en BD: 2025-12-31 03:02:07
-- Extraído: 2026-09-07 08:27:17 UTC
-- Referenciado por el backend .NET: SI
-- Parámetros:
--   @pUSUARIO_Login varchar (IN)
--   @pUSUARIO_Password varchar (IN)

CREATE PROCEDURE [euroamer_admin_2008].[Usuario_ValidarAcceso] 
	@pUSUARIO_Login VARCHAR(50), 
	@pUSUARIO_Password VARCHAR(50)
AS
BEGIN

	SET NOCOUNT ON;

	--exec Usuario_ValidarAcceso 'VC6850','CLUB2010'

	DECLARE @vResultado NVARCHAR(700);
	DECLARE @CORREOCORRECTOA INT=0;
	DECLARE @CORREOCORRECTOU INT=0;
	DECLARE @CORREOCORRECTON INT=0;
	DECLARE @CORREOCORRECTOFIN INT=0;
	DECLARE @TIPOUSUARIO NVARCHAR(10)='';
	DECLARE @TEXTOCONCAPS NVARCHAR(40)='';
	DECLARE @TEXTOSINCAPS NVARCHAR(40)='';
	DECLARE @PASSWOCORRECTOA INT=0;
	DECLARE @PASSWOCORRECTOU INT=0;
	DECLARE @PASSWOCORRECTON INT=0;
	DECLARE @PASSWOCORRECTOFIN INT=0;
	DECLARE @ESTADOCORRECTOA INT=0;
	DECLARE @ESTADOCORRECTOU INT=0;
	DECLARE @ESTADOCORRECTON INT=0;
	DECLARE @ESTADOCORRECTOFIN INT=0;
	DECLARE @CADUCADOCORRECTOA INT=0;
	DECLARE @CADUCADOCORRECTOU INT=0;
	DECLARE @CADUCADOCORRECTON INT=0;
	DECLARE @CADUCADOCORRECTOFIN INT=0;
	DECLARE @ESTADOUSUARIO INT=0;
	DECLARE @INTENTOSCORRECTOMAXLOG INT=99;
	DECLARE @INTENTOSCORRECTO INT=0;
	DECLARE @INTENTOSIDUSUARIOCORRECTO INT=0;
	DECLARE @OK INT=0;
	DECLARE @FechaHoraActual datetime = [euroamer_admin_2008].[fuObtenerFechaActualPeruana]();
	
	SELECT @CORREOCORRECTOU= count(usuarioId) from USUARIO where upper(usuarioLogin)=upper(@pUSUARIO_Login) and usuarioActivo=1;
	SELECT @CORREOCORRECTOA= count(agenciaId) from AGENCIA where upper(agenciaLogin)=upper(@pUSUARIO_Login) and agenciaActivo=1;
	--SELECT * from AGENCIA where upper(agenciaLogin)=upper('VC6850') and agenciaActivo=1;
	SELECT @CORREOCORRECTON= count(agenciausuarioId) from AGENCIA_USUARIO where upper(agenciausuarioLogin)=upper(@pUSUARIO_Login) and agenciausuarioActivo=1;

	IF (@CORREOCORRECTOU=1)
		BEGIN
			SET @TIPOUSUARIO='U';
			SET @TEXTOCONCAPS ='Usuario'
			SET @TEXTOSINCAPS ='usuario'
			SET @CORREOCORRECTOFIN= @CORREOCORRECTOU;
		END
	ELSE IF (@CORREOCORRECTOA=1)
		BEGIN
			SET @TIPOUSUARIO='A';
			SET @TEXTOCONCAPS ='Agencia'
			SET @TEXTOSINCAPS ='agencia'
			SET @CORREOCORRECTOFIN= @CORREOCORRECTOA;
		END
	ELSE IF (@CORREOCORRECTON=1)
		BEGIN
			SET @TIPOUSUARIO='N';
			SET @TEXTOCONCAPS ='Agencia usuario'
			SET @TEXTOSINCAPS ='agencia usuario'
			SET @CORREOCORRECTOFIN= @CORREOCORRECTON;
		END

	IF @CORREOCORRECTOFIN=0
	BEGIN
			SET @vResultado= 'Usuario / Agencia no existe.';
			SET @OK += 1;
			select 0 as usuarioId, 
				0 as usuarioIdExterno, 
				null as usuarioNombre, 
				null as usuarioEmail, 
				0 as usuarioPerfilId, 
				null as usuarioPerfilNombre, 
				null as usuarioCaducado, 
				0 as usuarioActivo,
				0 as usuarioagenciaId,
				0 as usuarioagenciaNombre,
				null as usuarioOrigen,
				0 as usuarioAgenciaPaisId,
				0 as agenciaImpuesto,
				null as UsuarioAgenciaDireccion,
				null as UsuarioAgenciaCorreo,
				null as paisDocumentoFormato, @vResultado as resultado;
			return; 
	END
	select @PASSWOCORRECTOU= count(usuarioId) from USUARIO 
	                                          where upper(usuarioLogin)=upper(@pUSUARIO_Login) and usuarioActivo=1
	                                            and usuarioPassword = SubString(master.dbo.fn_varbintohexstr(HashBytes('MD5', @pUSUARIO_Password)), 3, 32);
	select @PASSWOCORRECTON= count(agenciausuarioId) from AGENCIA_USUARIO 
	                                                 where upper(agenciausuarioLogin)=upper(@pUSUARIO_Login) and agenciausuarioActivo=1 
	                                                   and agenciausuarioClave = SubString(master.dbo.fn_varbintohexstr(HashBytes('MD5', @pUSUARIO_Password)), 3, 32);
	select @PASSWOCORRECTOA= count(agenciaId) from AGENCIA where upper(agenciaLogin)=upper(@pUSUARIO_Login)
	                                                         and agenciaActivo=1
	                                                         and agenciaPassword = SubString(master.dbo.fn_varbintohexstr(HashBytes('MD5', @pUSUARIO_Password)), 3, 32);
	
	IF (@TIPOUSUARIO='U')
		BEGIN
			SET @PASSWOCORRECTOFIN= @PASSWOCORRECTOU;
		END
	ELSE IF (@TIPOUSUARIO='A')
		BEGIN
			SET @PASSWOCORRECTOFIN= @PASSWOCORRECTOA;
		END
	ELSE IF (@TIPOUSUARIO='N')
		BEGIN
			SET @PASSWOCORRECTOFIN= @PASSWOCORRECTON;
		END

	if @PASSWOCORRECTOFIN=0
	BEGIN
			IF (@TIPOUSUARIO='U')
				BEGIN
					SELECT @INTENTOSIDUSUARIOCORRECTO=usuarioId, @INTENTOSCORRECTO=ISNULL(usuarioIntentosLogin,0), @ESTADOUSUARIO=usuarioActivo 
					from USUARIO where upper(usuarioLogin)=upper(@pUSUARIO_Login) and usuarioActivo=1;
				END
			ELSE IF (@TIPOUSUARIO='A')
				BEGIN
					SELECT @INTENTOSIDUSUARIOCORRECTO=agenciaId, @INTENTOSCORRECTO=ISNULL(agenciaIntentosLogin,0), @ESTADOUSUARIO=agenciaActivo 
					from AGENCIA where upper(agenciaLogin)=upper(@pUSUARIO_Login) and agenciaActivo=1;
				END
			ELSE IF (@TIPOUSUARIO='N')
				BEGIN
					SELECT @INTENTOSIDUSUARIOCORRECTO=agenciausuarioId, @INTENTOSCORRECTO=ISNULL(agenciaUsuarioIntentosLogin,0), @ESTADOUSUARIO=agenciausuarioActivo 
					from AGENCIA_USUARIO where upper(agenciausuarioLogin)=upper(@pUSUARIO_Login) and agenciausuarioActivo=1;
				END

			IF @ESTADOUSUARIO=-1
				BEGIN
					SET @vResultado=@TEXTOCONCAPS+' bloqueado.';
				END
			ELSE
				BEGIN
					SET @vResultado='Contraseña incorrecta.';
					IF @INTENTOSCORRECTO < @INTENTOSCORRECTOMAXLOG
						BEGIN
							SET @INTENTOSCORRECTO +=1;
							IF (@TIPOUSUARIO='U')
								BEGIN
									UPDATE USUARIO SET usuarioIntentosLogin=@INTENTOSCORRECTO WHERE usuarioId =@INTENTOSIDUSUARIOCORRECTO;
								END
							ELSE IF (@TIPOUSUARIO='A')
								BEGIN
									UPDATE AGENCIA SET agenciaIntentosLogin=@INTENTOSCORRECTO WHERE agenciaId =@INTENTOSIDUSUARIOCORRECTO;
								END
							ELSE IF (@TIPOUSUARIO='N')
								BEGIN
									UPDATE AGENCIA_USUARIO SET agenciaUsuarioIntentosLogin=@INTENTOSCORRECTO WHERE agenciausuarioId =@INTENTOSIDUSUARIOCORRECTO;
								END
							IF @INTENTOSCORRECTO = (@INTENTOSCORRECTOMAXLOG - 1)
								BEGIN 
									SET @vResultado='Último intento antes de bloquear ' + @TEXTOSINCAPS+ '.';
								END
						END
					IF @INTENTOSCORRECTO = @INTENTOSCORRECTOMAXLOG
						BEGIN
							SET @INTENTOSCORRECTO +=1;
							UPDATE USUARIO SET usuarioActivo=-1, usuarioIntentosLogin=null WHERE usuarioId =@INTENTOSIDUSUARIOCORRECTO;
							IF (@TIPOUSUARIO='U')
								BEGIN
									UPDATE USUARIO SET usuarioActivo=-1, usuarioIntentosLogin=null WHERE usuarioId =@INTENTOSIDUSUARIOCORRECTO;
								END
							ELSE IF (@TIPOUSUARIO='A')
								BEGIN
									UPDATE AGENCIA SET agenciaActivo=-1, agenciaIntentosLogin=null WHERE agenciaId =@INTENTOSIDUSUARIOCORRECTO;
								END
							ELSE IF (@TIPOUSUARIO='N')
								BEGIN
									UPDATE AGENCIA_USUARIO SET agenciausuarioActivo=-1, agenciaUsuarioIntentosLogin=null WHERE agenciausuarioId =@INTENTOSIDUSUARIOCORRECTO;
								END
							SET @vResultado=@TEXTOCONCAPS+' bloqueado.';
						END
				END
			SET @OK += 1;
			select 0 as usuarioId, 
				0 as usuarioIdExterno, 
				null as usuarioNombre, 
				null as usuarioEmail, 
				0 as usuarioPerfilId, 
				null as usuarioPerfilNombre, 
				null as usuarioCaducado, 
				0 as usuarioActivo,
				0 as usuarioagenciaId,
				0 as usuarioagenciaNombre,
				null as usuarioOrigen,
				0 as usuarioAgenciaPaisId,
				0 as agenciaImpuesto,
				null as UsuarioAgenciaDireccion,
				null as UsuarioAgenciaCorreo,
				null as paisDocumentoFormato, @vResultado as resultado;
			return; 
	END
	select @ESTADOCORRECTOA= agenciaActivo from AGENCIA where upper(agenciaLogin)=upper(@pUSUARIO_Login) and agenciaActivo=1;
	select @ESTADOCORRECTON= agenciausuarioActivo from AGENCIA_USUARIO where upper(agenciausuarioLogin)=upper(@pUSUARIO_Login) and agenciausuarioActivo=1;
	select @ESTADOCORRECTOU= usuarioActivo from USUARIO where upper(usuarioLogin)=upper(@pUSUARIO_Login) and usuarioActivo=1;

	IF (@TIPOUSUARIO='U')
		BEGIN
			SET @ESTADOCORRECTOFIN= @ESTADOCORRECTOU;
		END
	ELSE IF (@TIPOUSUARIO='A')
		BEGIN
			SET @ESTADOCORRECTOFIN= @ESTADOCORRECTOA;
		END
	ELSE IF (@TIPOUSUARIO='N')
		BEGIN
			SET @ESTADOCORRECTOFIN= @ESTADOCORRECTON;
		END
	if @ESTADOCORRECTOFIN=0
	BEGIN
			SET @vResultado=@TEXTOCONCAPS+' inactivado.';
			SET @OK += 1;
			select 0 as usuarioId, 
				0 as usuarioIdExterno, 
				null as usuarioNombre, 
				null as usuarioEmail, 
				0 as usuarioPerfilId, 
				null as usuarioPerfilNombre, 
				null as usuarioCaducado, 
				0 as usuarioActivo,
				0 as usuarioagenciaId,
				0 as usuarioagenciaNombre,
				null as usuarioOrigen,
				0 as usuarioAgenciaPaisId,
				0 as agenciaImpuesto,
				null as UsuarioAgenciaDireccion,
				null as UsuarioAgenciaCorreo,
				null as paisDocumentoFormato, @vResultado as resultado;
			return; 
	END
	if @ESTADOCORRECTOFIN=-1
	BEGIN
			SET @vResultado=@TEXTOCONCAPS+' bloqueado.';
			SET @OK += 1;
			select 0 as usuarioId, 
				0 as usuarioIdExterno, 
				null as usuarioNombre, 
				null as usuarioEmail, 
				0 as usuarioPerfilId, 
				null as usuarioPerfilNombre, 
				null as usuarioCaducado, 
				0 as usuarioActivo,
				0 as usuarioagenciaId,
				0 as usuarioagenciaNombre,
				null as usuarioOrigen,
				0 as usuarioAgenciaPaisId,
				0 as agenciaImpuesto,
				null as UsuarioAgenciaDireccion,
				null as UsuarioAgenciaCorreo,
				null as paisDocumentoFormato, @vResultado as resultado;
			return; 
	END
	select @CADUCADOCORRECTOA= euroamer_admin_2008.Usuario_Caducado('A', a.agenciaId, 0) 
	from AGENCIA a where upper(a.agenciaLogin)=upper(@pUSUARIO_Login) and agenciaActivo=1;
	select @CADUCADOCORRECTON= euroamer_admin_2008.Usuario_Caducado('N', au.agenciaId, au.agenciausuarioId) 
	from AGENCIA_USUARIO au where upper(au.agenciausuarioLogin)=upper(@pUSUARIO_Login) and agenciausuarioActivo=1;
	select @CADUCADOCORRECTOU= euroamer_admin_2008.Usuario_Caducado('U', u.usuarioId, 0) 
	from USUARIO u where upper(u.usuarioLogin)=upper(@pUSUARIO_Login) and usuarioActivo=1;
	IF (@TIPOUSUARIO='U')
		BEGIN
			SET @CADUCADOCORRECTOFIN= @CADUCADOCORRECTOU;
		END
	ELSE IF (@TIPOUSUARIO='A')
		BEGIN
			SET @CADUCADOCORRECTOFIN= @CADUCADOCORRECTOA;
		END
	ELSE IF (@TIPOUSUARIO='N')
		BEGIN
			SET @CADUCADOCORRECTOFIN= @CADUCADOCORRECTON;
		END
	if @CADUCADOCORRECTOFIN=-1
	BEGIN
			SET @vResultado=@TEXTOCONCAPS+' caducado.';
			SET @OK += 1;
			select 0 as usuarioId, 
				0 as usuarioIdExterno, 
				null as usuarioNombre, 
				null as usuarioEmail, 
				0 as usuarioPerfilId, 
				null as usuarioPerfilNombre, 
				null as usuarioCaducado, 
				0 as usuarioActivo,
				0 as usuarioagenciaId,
				0 as usuarioagenciaNombre,
				null as usuarioOrigen,
				0 as usuarioAgenciaPaisId,
				0 as agenciaImpuesto,
				null as UsuarioAgenciaDireccion,
				null as UsuarioAgenciaCorreo,
				null as paisDocumentoFormato, @vResultado as resultado;
			return; 
	END
	IF @OK=0
		BEGIN	
			SELECT	u.usuarioId, 
					u.usuarioIdExterno, 
					u.usuarioNombre, 
					u.usuarioEmail, 
					u.usuarioPerfilId, 
					p.perfilNombre as usuarioPerfilNombre, 
					euroamer_admin_2008.Usuario_Caducado('U', u.usuarioId, 0) as usuarioCaducado,
					u.usuarioActivo,
					u.usuarioId as usuarioagenciaId,
					u.usuarioNombre as usuarioagenciaNombre,
					'U' as usuarioOrigen,
					usuariopaisid as usuarioAgenciaPaisId,
					paisImpuesto as agenciaImpuesto,
					' ' as UsuarioAgenciaDireccion,
					' ' as UsuarioAgenciaCorreo,
					a.paisDocumentoFormato,
					'' as resultado
			FROM	USUARIO u, PERFIL p, PAIS a
			WHERE	u.usuarioPerfilId = p.perfilId AND usuarioPaisId = a.paisId AND
					u.usuarioLogin = @pUSUARIO_Login AND u.usuarioPassword = SubString(master.dbo.fn_varbintohexstr(HashBytes('MD5', @pUSUARIO_Password)), 3, 32)
			UNION
	
			SELECT	a.agenciaId, 
					a.agenciaIdExterno, 
					a.agenciaNombre, 
					a.agenciaEmail, 
					a.agenciaPerfilId, 
					p.perfilNombre as agenciaPerfilNombre, 
					euroamer_admin_2008.Usuario_Caducado('A', a.agenciaId, 0) as usuarioCaducado,
					a.agenciaActivo,
					a.agenciaId as usuarioagenciaId,
					a.agenciaNombre as usuarioagenciaNombre,
					'A' as usuarioOrigen,
					a.agenciaPaisId usuarioAgenciaPaisId, 
					(SELECT paisImpuesto FROM PAIS WHERE paisId = a.agenciaPaisId) as paisImpuesto,
					a.agenciaDireccion as UsuarioAgenciaDireccion,
					a.agenciaEmail as UsuarioAgenciaCorreo,
					(SELECT paisDocumentoFormato FROM PAIS WHERE paisId = a.agenciaPaisId) as paisDocumentoFormato,
					'' as resultado
			FROM	AGENCIA a, PERFIL p
			WHERE	a.agenciaPerfilId = p.perfilId AND
					a.agenciaLogin = @pUSUARIO_Login AND a.agenciaPassword =SubString(master.dbo.fn_varbintohexstr(HashBytes('MD5', @pUSUARIO_Password)), 3, 32)
			UNION
	
			SELECT	au.agenciausuarioId as usuarioId, 
					0 as usuarioIdExterno, 
					au.agenciausuarioNombre as usuarioNombre, 
					au.agenciausuarioEMail as usuarioEmail, 
					au.agenciausuarioPerfilId as usuarioPerfilId, 
					pe.perfilNombre as usuarioPerfilNombre, 
					euroamer_admin_2008.Usuario_Caducado('N', au.agenciaId, au.agenciausuarioId) as usuarioCaducado,
					(CASE WHEN (SELECT agenciaActivo FROM AGENCIA WHERE agenciaId = au.agenciaId) = 0 THEN 0 ELSE au.agenciausuarioActivo END) as usuarioActivo,
					au.agenciaId as usuarioAgenciaId,
					(SELECT agenciaNombre FROM AGENCIA WHERE agenciaId = au.agenciaId) as usuarioAgenciaNombre,
					'N' as usuarioOrigen,
					(SELECT agenciaPaisId FROM AGENCIA WHERE agenciaId = au.agenciaId) as usuarioAgenciaPaisId,
					(SELECT paisImpuesto FROM PAIS WHERE paisId = (SELECT agenciaPaisId FROM AGENCIA WHERE agenciaId = au.agenciaId)) as paisImpuesto,
					(SELECT agenciaDireccion FROM AGENCIA WHERE agenciaId = au.agenciaId) as UsuarioAgenciaDireccion,
					(SELECT agenciaEmail FROM AGENCIA WHERE agenciaId = au.agenciaId) as UsuarioAgenciaCorreo,
					(SELECT paisDocumentoFormato FROM PAIS WHERE paisId = (SELECT agenciaPaisId FROM AGENCIA WHERE agenciaId = au.agenciaId)) as paisDocumentoFormato,
					'' as resultado
			FROM	AGENCIA_USUARIO au, PERFIL pe
			WHERE	au.agenciausuarioPerfilId = pe.perfilId AND
					au.agenciausuarioLogin = @pUSUARIO_Login AND au.agenciausuarioClave = SubString(master.dbo.fn_varbintohexstr(HashBytes('MD5', @pUSUARIO_Password)), 3, 32)

			IF @@ROWCOUNT > 0
				BEGIN
					UPDATE USUARIO SET usuarioUltimoAcceso = @FechaHoraActual, usuarioContrasena = @pUSUARIO_Password WHERE usuarioLogin = @pUSUARIO_Login AND usuarioPassword = SubString(master.dbo.fn_varbintohexstr(HashBytes('MD5', @pUSUARIO_Password)), 3, 32)
					UPDATE AGENCIA SET agenciaUltimoAcceso = @FechaHoraActual,agenciaContrasena=@pUSUARIO_Password WHERE agenciaLogin = @pUSUARIO_Login AND agenciaPassword = SubString(master.dbo.fn_varbintohexstr(HashBytes('MD5', @pUSUARIO_Password)), 3, 32)
					UPDATE AGENCIA_USUARIO SET agenciausuarioUltimoAcceso = @FechaHoraActual,agenciausuarioContrasena=@pUSUARIO_Password WHERE agenciausuarioLogin = @pUSUARIO_Login AND agenciausuarioClave = SubString(master.dbo.fn_varbintohexstr(HashBytes('MD5', @pUSUARIO_Password)), 3, 32)
				END
		END
	
	

END
