-- Objeto: euroamer_admin_2008.Asistencia_Procesar
-- Creado en BD: 2015-02-06 08:43:26
-- Modificado en BD: 2015-03-25 09:52:03
-- Extraído: 2026-09-07 08:27:16 UTC
-- Referenciado por el backend .NET: NO (revisar si sigue en uso)
-- Parámetros:
--   @pEmpleadoDocumentoTipo int (IN)
--   @pEmpleadoDocumentoNro char (IN)
--   @pAsistenciaFecha date (IN)
--   @pAsistenciaLocal varchar (IN)
--   @pAsistenciaTipo int (IN)
--   @pAsistenciaIp varchar (IN)


CREATE PROCEDURE [Asistencia_Procesar] 	
	@pEmpleadoDocumentoTipo INT, 
	@pEmpleadoDocumentoNro CHAR(8),
	@pAsistenciaFecha date, 
	@pAsistenciaLocal varchar(16), 
	@pAsistenciaTipo INT, 
	@pAsistenciaIp varchar(20)
	
AS
BEGIN
	SET NOCOUNT ON;
	
	DECLARE @vContador INT;
	DECLARE @vEmpleadoId INT;
	DECLARE @vNumError INT;
	DECLARE @vDesError varchar(50);
		
	SET @vNumError = 0	
	SET @vDesError = ''
	SET @vEmpleadoId = null
	
	--validar DNI
	SELECT @vEmpleadoId = ISNULL(EmpleadoId,0)
	FROM empleado 
	where EmpleadoDocumentoTipo = @pEmpleadoDocumentoTipo
	and EmpleadoDocumentoNro = @pEmpleadoDocumentoNro
        and EmpleadoActivo = 1

	IF @vEmpleadoId is not null 
	begin
		--Buscar entrada
		select @vContador = asistenciatipo 
		from asistencia 
		where asistenciaFechahora = (select max(asistenciaFechahora)  
		                               FROM ASISTENCIA 
		                               WHERE asistenciaEmpleadoId = @vEmpleadoId)
		and asistenciaEmpleadoId = @vEmpleadoId
		
		IF @vContador = 1 
		BEGIN
			SET @pAsistenciaTipo = 2
			SET @vNumError = 0	
			SET @vDesError = 'OK - Salida Registrada. DNI '+ @pEmpleadoDocumentoNro
		END
		ELSE
		BEGIN
			SET @vNumError = 0	
			SET @vDesError = 'OK - Entrada Registrada. DNI'+ @pEmpleadoDocumentoNro
		END	
		
		INSERT INTO asistencia (
			asistenciaEmpleadoId,
			asistenciaFechaHora,
			asistenciaFecha,
			asistenciaLocal,
			asistenciaTipo,
			asistenciaIp)
		VALUES (
			@vEmpleadoId, 
			getdate(),
			getdate(), 
			@pAsistenciaLocal, 
			@pAsistenciaTipo, 
			@pAsistenciaIp)			
	end
	ELSE
	BEGIN
		SET @vNumError = 1	
		SET @vDesError = 'No existe empleado con el DNI ' + @pEmpleadoDocumentoNro
	END
	
	select @vNumError,@vDesError
END
