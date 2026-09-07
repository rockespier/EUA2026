-- Objeto: euroamer_admin_2008.Empleado_Procesar
-- Creado en BD: 2015-02-05 14:39:03
-- Modificado en BD: 2015-02-06 13:14:45
-- Extraído: 2026-09-07 08:27:16 UTC
-- Referenciado por el backend .NET: NO (revisar si sigue en uso)
-- Parámetros:
--   @pEmpleado_Id int (IN)
--   @pEmpleadoNombre varchar (IN)
--   @pEmpleadoApellido varchar (IN)
--   @pEmpleadoCargo varchar (IN)
--   @pEmpleadoDocumentoTipo int (IN)
--   @pEmpleadoDocumentoNro char (IN)
--   @pEmpleadoActivo int (IN)
--   @pEmpleadoIp varchar (IN)

CREATE PROCEDURE [Empleado_Procesar] 
	@pEmpleado_Id INT,
	@pEmpleadoNombre VARCHAR(50), 
	@pEmpleadoApellido VARCHAR(50), 
	@pEmpleadoCargo VARCHAR(50), 
	@pEmpleadoDocumentoTipo INT, 
	@pEmpleadoDocumentoNro CHAR(8),
	@pEmpleadoActivo INT,
	@pEmpleadoIp varchar(20)
AS
BEGIN
	
	SET NOCOUNT ON;
BEGIN TRY
		BEGIN TRANSACTION	
		
    IF @pEmpleado_Id = 0
		BEGIN
			INSERT INTO empleado (
				EmpleadoNombre,
				EmpleadoApellido,
				EmpleadoCargo,
				EmpleadoDocumentoTipo,
				EmpleadoDocumentoNro,
				EmpleadoActivo,
				EmpleadoIp)
            VALUES (
				@pEmpleadoNombre, 
				@pEmpleadoApellido, 
				@pEmpleadoCargo, 
				@pEmpleadoDocumentoTipo, 
				@pEmpleadoDocumentoNro,
				@pEmpleadoActivo,
				@pEmpleadoIp)
		END
	ELSE
		BEGIN
			UPDATE empleado SET 
			EmpleadoNombre 		= @pEmpleadoNombre,
			EmpleadoApellido 	= @pEmpleadoApellido,
            EmpleadoCargo 		= @pEmpleadoCargo, 
            EmpleadoDocumentoTipo 	= @pEmpleadoDocumentoTipo, 
			EmpleadoDocumentoNro 	= @pEmpleadoDocumentoNro, 
			EmpleadoActivo 			= @pEmpleadoActivo,
			EmpleadoIp				= @pEmpleadoIp
            WHERE EmpleadoId = @pEmpleado_Id 
		END
		COMMIT TRANSACTION
	END TRY
	BEGIN CATCH
        --EXECUTE usp_GetErrorInfo;		
		ROLLBACK TRANSACTION		
	END CATCH
END
