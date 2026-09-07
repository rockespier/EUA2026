-- Objeto: euroamer_admin_2008.Perfil_Procesar
-- Creado en BD: 2013-12-24 08:50:58
-- Modificado en BD: 2025-01-17 22:42:30
-- Extraído: 2026-09-07 08:27:16 UTC
-- Referenciado por el backend .NET: SI
-- Parámetros:
--   @pPERFIL_Id int (IN)
--   @pPERFIL_Nombre varchar (IN)
--   @pPERFIL_Origen char (IN)
--   @pPERFIL_Usuario int (IN)
--   @pPERFIL_Activo int (IN)

CREATE PROCEDURE [Perfil_Procesar]
	@pPERFIL_Id INT = 0,
	@pPERFIL_Nombre VARCHAR(100),
	@pPERFIL_Origen CHAR(1),
	@pPERFIL_Usuario INT,
	@pPERFIL_Activo INT
AS
BEGIN
--exec Perfil_Procesar 3,'Administrador t','',1,1
	declare @tipoproceso int = 0;
	declare @resultado varchar(300) = '';
	declare @FechaHoraActual datetime = [euroamer_admin_2008].[fuObtenerFechaActualPeruana]();
	SET NOCOUNT ON;

	IF @pPERFIL_Id = 0
		BEGIN
		set @tipoproceso=1;
			INSERT INTO PERFIL (
			perfilNombre, 
			perfilOrigen, 
			perfilCreadoFecha,
			perfilCreadoUsuarioId,
			perfilModificadoFecha,
			perfilModificadoUsuarioId,
			perfilActivo) 
			VALUES (
			@pPERFIL_Nombre, 
			@pPERFIL_Origen, 
			GETDATE(),
			@pPERFIL_Usuario,
			GETDATE(),
			@pPERFIL_Usuario,
			1)
			

			IF @@ROWCOUNT > 0
			BEGIN
				set @resultado = 'ok';
			END
		END
	ELSE
		BEGIN
		set @tipoproceso=2;
			UPDATE PERFIL SET 
			perfilNombre = @pPERFIL_Nombre,
			perfilOrigen = @pPERFIL_Origen,
			perfilModificadoFecha = GETDATE(),
			perfilModificadoUsuarioId = @pPERFIL_Usuario,
			perfilActivo = @pPERFIL_Activo
			WHERE perfilId = @pPERFIL_Id
		IF @@ROWCOUNT > 0
			BEGIN
				set @resultado = 'ok';
			END

		END

		select @tipoproceso as errorCodigo, @resultado as errorDescripcion   
END
