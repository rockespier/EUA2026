-- Objeto: euroamer_admin_2008.Solicitud_Procesar
-- Creado en BD: 2013-12-24 08:50:58
-- Modificado en BD: 2013-12-24 08:50:58
-- Extraído: 2026-09-07 08:27:16 UTC
-- Referenciado por el backend .NET: NO (revisar si sigue en uso)
-- Parámetros:
--   @pSOLICITUD_Id int (IN)
--   @pSOLICITUD_UsuarioOrigen char (IN)
--   @pSOLICITUD_UsuarioAgenciaId int (IN)
--   @pSOLICITUD_FechaVigenciaInicio date (IN)
--   @pSOLICITUD_FechaVigenciaFin date (IN)
--   @pSOLICITUD_NumeroDias int (IN)
--   @pSOLICITUD_Destino varchar (IN)
--   @pSOLICITUD_ProductoId int (IN)
--   @pSOLICITUD_ProductoImporte decimal (IN)
--   @pSOLICITUD_ClienteDocumentoTipo varchar (IN)
--   @pSOLICITUD_ClienteDocumentoNumero varchar (IN)
--   @pSOLICITUD_ClienteNombres varchar (IN)
--   @pSOLICITUD_ClienteApellidos varchar (IN)
--   @pSOLICITUD_ClienteFechaNacimiento date (IN)
--   @pSOLICITUD_ClienteEdad int (IN)
--   @pSOLICITUD_ClienteDireccion varchar (IN)
--   @pSOLICITUD_ClienteTelefono varchar (IN)
--   @pSOLICITUD_ClienteDistrito varchar (IN)
--   @pSOLICITUD_ClienteCiudad varchar (IN)
--   @pSOLICITUD_ClientePais varchar (IN)
--   @pSOLICITUD_ContactoNombres varchar (IN)
--   @pSOLICITUD_ContactoDireccion varchar (IN)
--   @pSOLICITUD_ContactoEmail varchar (IN)
--   @pSOLICITUD_ContactoTelefono varchar (IN)
--   @pSOLICITUD_ContactoDistrito varchar (IN)
--   @pSOLICITUD_ContactoPais varchar (IN)
--   @pSOLICITUD_ImporteVenta decimal (IN)
--   @pSOLICITUD_Usuario int (IN)

CREATE PROCEDURE [Solicitud_Procesar]
	@pSOLICITUD_Id INT = 0,
	@pSOLICITUD_UsuarioOrigen CHAR(1),
	@pSOLICITUD_UsuarioAgenciaId INT,
	@pSOLICITUD_FechaVigenciaInicio DATE,
	@pSOLICITUD_FechaVigenciaFin DATE,
	@pSOLICITUD_NumeroDias INT,
	@pSOLICITUD_Destino VARCHAR(255),
	@pSOLICITUD_ProductoId INT,
	@pSOLICITUD_ProductoImporte DECIMAL(18,4),
	@pSOLICITUD_ClienteDocumentoTipo VARCHAR(3),
	@pSOLICITUD_ClienteDocumentoNumero VARCHAR(50),
	@pSOLICITUD_ClienteNombres VARCHAR(50),
	@pSOLICITUD_ClienteApellidos VARCHAR(80),
	@pSOLICITUD_ClienteFechaNacimiento DATE,
	@pSOLICITUD_ClienteEdad INT,
	@pSOLICITUD_ClienteDireccion VARCHAR(255),
	@pSOLICITUD_ClienteTelefono VARCHAR(50),
	@pSOLICITUD_ClienteDistrito VARCHAR(50),
	@pSOLICITUD_ClienteCiudad VARCHAR(50),
	@pSOLICITUD_ClientePais VARCHAR(50),
	@pSOLICITUD_ContactoNombres VARCHAR(255),
	@pSOLICITUD_ContactoDireccion VARCHAR(255),
	@pSOLICITUD_ContactoEmail VARCHAR(50),
	@pSOLICITUD_ContactoTelefono VARCHAR(50),
	@pSOLICITUD_ContactoDistrito VARCHAR(25),
	@pSOLICITUD_ContactoPais VARCHAR(50),
	@pSOLICITUD_ImporteVenta DECIMAL(18,4),
	@pSOLICITUD_Usuario INT
AS
BEGIN
	
	SET NOCOUNT ON;

	IF @pSOLICITUD_Id = 0
		BEGIN
			DECLARE @pCORRELATIVO_Columna VARCHAR(50)
			SET @pCORRELATIVO_Columna = 'solicitudId'
			
			SET @pSOLICITUD_Id = (SELECT correlativoUltimoGenerado+1 
								 FROM CORRELATIVOS WHERE correlativoColumna = @pCORRELATIVO_Columna)
			
			INSERT INTO SOLICITUD(
			solicitudId,
			solicitudUsuarioOrigen,
			solicitudUsuarioAgenciaId,
			solicitudFechaVigenciaInicio,
			solicitudFechaVigenciaFin,
			solicitudNumeroDias,
			solicitudDestino,
			solicitudProductoId,
			solicitudProductoImporte,
			solicitudClienteDocumentoTipoId,
			solicitudClienteDocumentoNumero,
			solicitudClienteNombres,
			solicitudClienteApellidos,
			solicitudClienteFechaNacimiento,
			solicitudClienteEdad,
			solicitudClienteDireccion,
			solicitudClienteTelefono,
			solicitudClienteDistrito,
			solicitudClienteCiudad,
			solicitudClientePais,
			solicitudContactoNombres,
			solicitudContactoDireccion,
			solicitudContactoEmail,
			solicitudContactoTelefono,
			solicitudContactoDistrito,
			solicitudContactoPais,
			solicitudImporteVenta,
			solicitudSituacionId,
			solicitudCreadoFecha,
			solicitudCreadoUsuarioId,
			solicitudModificadoFecha,
			solicitudModificadoUsuarioId
			) 
			VALUES (
			@pSOLICITUD_Id,
			@pSOLICITUD_UsuarioOrigen,
			@pSOLICITUD_UsuarioAgenciaId,
			@pSOLICITUD_FechaVigenciaInicio,
			@pSOLICITUD_FechaVigenciaFin,
			@pSOLICITUD_NumeroDias,
			@pSOLICITUD_Destino,
			@pSOLICITUD_ProductoId,
			@pSOLICITUD_ProductoImporte,
			@pSOLICITUD_ClienteDocumentoTipo,
			@pSOLICITUD_ClienteDocumentoNumero,
			@pSOLICITUD_ClienteNombres,
			@pSOLICITUD_ClienteApellidos,
			@pSOLICITUD_ClienteFechaNacimiento,
			@pSOLICITUD_ClienteEdad,
			@pSOLICITUD_ClienteDireccion,
			@pSOLICITUD_ClienteTelefono,
			@pSOLICITUD_ClienteDistrito,
			@pSOLICITUD_ClienteCiudad,
			@pSOLICITUD_ClientePais,
			@pSOLICITUD_ContactoNombres,
			@pSOLICITUD_ContactoDireccion,
			@pSOLICITUD_ContactoEmail,
			@pSOLICITUD_ContactoTelefono,
			@pSOLICITUD_ContactoDistrito,
			@pSOLICITUD_ContactoPais,
			@pSOLICITUD_ImporteVenta,
			'V',
			GETDATE(),
			@pSOLICITUD_Usuario,
			GETDATE(),
			@pSOLICITUD_Usuario
			)
			
			UPDATE CORRELATIVOS SET correlativoUltimoGenerado = @pSOLICITUD_Id
			WHERE correlativoColumna = @pCORRELATIVO_Columna
			
		END
	ELSE
		BEGIN
			UPDATE SOLICITUD SET 
			solicitudFechaVigenciaInicio = @pSOLICITUD_FechaVigenciaInicio,
			solicitudFechaVigenciaFin = @pSOLICITUD_FechaVigenciaFin,
			solicitudNumeroDias = @pSOLICITUD_NumeroDias,
			solicitudDestino = @pSOLICITUD_Destino,
			solicitudProductoId = @pSOLICITUD_ProductoId,
			solicitudProductoImporte = @pSOLICITUD_ProductoImporte,
			solicitudClienteDocumentoTipoId = @pSOLICITUD_ClienteDocumentoTipo,
			solicitudClienteDocumentoNumero = @pSOLICITUD_ClienteDocumentoNumero,
			solicitudClienteNombres = @pSOLICITUD_ClienteNombres,
			solicitudClienteApellidos = @pSOLICITUD_ClienteApellidos,
			solicitudClienteFechaNacimiento = @pSOLICITUD_ClienteFechaNacimiento,
			solicitudClienteEdad = @pSOLICITUD_ClienteEdad,
			solicitudClienteDireccion = @pSOLICITUD_ClienteDireccion,
			solicitudClienteTelefono = @pSOLICITUD_ClienteTelefono,
			solicitudClienteDistrito = @pSOLICITUD_ClienteDistrito,
			solicitudClienteCiudad = @pSOLICITUD_ClienteCiudad,
			solicitudClientePais = @pSOLICITUD_ClientePais,
			solicitudContactoNombres = @pSOLICITUD_ContactoNombres,
			solicitudContactoDireccion = @pSOLICITUD_ContactoDireccion,
			solicitudContactoEmail = @pSOLICITUD_ContactoEmail,
			solicitudContactoTelefono = @pSOLICITUD_ContactoTelefono,
			solicitudContactoDistrito = @pSOLICITUD_ContactoDistrito,
			solicitudContactoPais = @pSOLICITUD_ContactoPais,
			solicitudImporteVenta = @pSOLICITUD_ImporteVenta,
			solicitudModificadoUsuarioId = @pSOLICITUD_Usuario,
			solicitudModificadoFecha = GETDATE()
			WHERE solicitudId = @pSOLICITUD_Id
		END
    
    SELECT @pSOLICITUD_Id
    
END
