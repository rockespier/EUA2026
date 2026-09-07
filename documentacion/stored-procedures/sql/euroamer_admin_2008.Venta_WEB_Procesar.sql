-- Objeto: euroamer_admin_2008.Venta_WEB_Procesar
-- Creado en BD: 2018-12-18 15:11:07
-- Modificado en BD: 2019-02-27 11:14:44
-- Extraído: 2026-09-07 08:27:17 UTC
-- Referenciado por el backend .NET: SI
-- Parámetros:
--   @pVENTA_Id int (IN)
--   @pVENTA_UsuarioOrigen char (IN)
--   @pVENTA_UsuarioAgenciaId int (IN)
--   @pVENTA_FechaVigenciaInicio date (IN)
--   @pVENTA_FechaVigenciaFin date (IN)
--   @pVENTA_NumeroDias int (IN)
--   @pVENTA_Destino varchar (IN)
--   @pVENTA_ProductoId int (IN)
--   @pVENTA_ProductoImporte decimal (IN)
--   @pVENTA_ClienteDocumentoTipo varchar (IN)
--   @pVENTA_ClienteDocumentoNumero varchar (IN)
--   @pVENTA_ClienteNombres varchar (IN)
--   @pVENTA_ClienteApellidos varchar (IN)
--   @pVENTA_ClienteFechaNacimiento date (IN)
--   @pVENTA_ClienteEdad int (IN)
--   @pVENTA_ClienteEmail varchar (IN)
--   @pVENTA_ClienteDireccion varchar (IN)
--   @pVENTA_ClienteTelefono varchar (IN)
--   @pVENTA_ClienteDistrito varchar (IN)
--   @pVENTA_ClienteCiudad varchar (IN)
--   @pVENTA_ClientePais varchar (IN)
--   @pVENTA_ContactoNombres varchar (IN)
--   @pVENTA_ContactoDireccion varchar (IN)
--   @pVENTA_ContactoEmail varchar (IN)
--   @pVENTA_ContactoTelefono varchar (IN)
--   @pVENTA_ContactoDistrito varchar (IN)
--   @pVENTA_ContactoPais varchar (IN)
--   @pVENTA_ImporteVenta decimal (IN)
--   @pVENTA_Usuario int (IN)
--   @pVENTA_Counter varchar (IN)
--   @pVENTA_Cupon varchar (IN)
--   @pVENTA_EstadoId char (IN)
--   @pVENTA_SituacionId char (IN)
--   @pVENTA_Observacion text (IN)
--   @pVentaCreadoFecha date (IN)

CREATE PROCEDURE [euroamer_admin_2008].[Venta_WEB_Procesar]
	@pVENTA_Id INT = 0,
	@pVENTA_UsuarioOrigen CHAR(1),
	@pVENTA_UsuarioAgenciaId INT,
	@pVENTA_FechaVigenciaInicio DATE,
	@pVENTA_FechaVigenciaFin DATE,
	@pVENTA_NumeroDias INT,
	@pVENTA_Destino VARCHAR(255),
	@pVENTA_ProductoId INT,
	@pVENTA_ProductoImporte DECIMAL(18,4),
	@pVENTA_ClienteDocumentoTipo VARCHAR(3),
	@pVENTA_ClienteDocumentoNumero VARCHAR(50),
	@pVENTA_ClienteNombres VARCHAR(50),
	@pVENTA_ClienteApellidos VARCHAR(80),
	@pVENTA_ClienteFechaNacimiento DATE,
	@pVENTA_ClienteEdad INT,
	@pVENTA_ClienteEmail VARCHAR(100),
	@pVENTA_ClienteDireccion VARCHAR(255),
	@pVENTA_ClienteTelefono VARCHAR(50),
	@pVENTA_ClienteDistrito VARCHAR(50),
	@pVENTA_ClienteCiudad VARCHAR(50),
	@pVENTA_ClientePais VARCHAR(50),
	@pVENTA_ContactoNombres VARCHAR(255),
	@pVENTA_ContactoDireccion VARCHAR(255),
	@pVENTA_ContactoEmail VARCHAR(50),
	@pVENTA_ContactoTelefono VARCHAR(50),
	@pVENTA_ContactoDistrito VARCHAR(25),
	@pVENTA_ContactoPais VARCHAR(50),
	@pVENTA_ImporteVenta DECIMAL(18,4),
	@pVENTA_Usuario INT,
	@pVENTA_Counter VARCHAR(100),
	@pVENTA_Cupon VARCHAR(50) = '',
	@pVENTA_EstadoId CHAR(1),
	@pVENTA_SituacionId CHAR(1),
	@pVENTA_Observacion TEXT,
	@pVentaCreadoFecha DATE
AS
BEGIN
	
	SET NOCOUNT ON;

	
			
			DECLARE @vPAIS_Id INT
			DECLARE @vVENTA_CuponDescuento INT
			DECLARE @vVENTA_CuponVigencia DATE
			DECLARE @Contador INT	

		set @Contador = (SELECT COUNT(*) FROM VENTA WHERE VENTAID = @pVENTA_Id)
			
		IF @Contador = 0 
		BEGIN
			INSERT INTO VENTA(
				ventaId,
				ventaUsuarioOrigen,
				ventaUsuarioAgenciaId,
				ventaFechaVigenciaInicio,
				ventaFechaVigenciaFin,
				ventaNumeroDias,
				ventaDestino,
				ventaProductoId,
				ventaProductoImporte,
				ventaClienteDocumentoTipoId,
				ventaClienteDocumentoNumero,
				ventaClienteNombres,
				ventaClienteApellidos,
				ventaClienteFechaNacimiento,
				ventaClienteEdad,
				ventaClienteEmail,
				ventaClienteDireccion,
				ventaClienteTelefono,
				ventaClienteDistrito,
				ventaClienteCiudad,
				ventaClientePais,
				ventaContactoNombres,
				ventaContactoDireccion,
				ventaContactoEmail,
				ventaContactoTelefono,
				ventaContactoDistrito,
				ventaContactoPais,
				ventaImporteVenta,
				ventaEstadoId,
				ventaSituacionId,
				ventaCreadoFecha,
				ventaCreadoUsuarioId,
				ventaModificadoFecha,
				ventaModificadoUsuarioId,
				ventaCounter,
				ventaObservacion
			) 
			VALUES (
				@pVENTA_Id,
				@pVENTA_UsuarioOrigen,
				@pVENTA_UsuarioAgenciaId,
				@pVENTA_FechaVigenciaInicio,
				@pVENTA_FechaVigenciaFin,
				@pVENTA_NumeroDias,
				@pVENTA_Destino,
				@pVENTA_ProductoId,
				@pVENTA_ProductoImporte,
				@pVENTA_ClienteDocumentoTipo,
				@pVENTA_ClienteDocumentoNumero,
				@pVENTA_ClienteNombres,
				@pVENTA_ClienteApellidos,
				@pVENTA_ClienteFechaNacimiento,
				@pVENTA_ClienteEdad,
				@pVENTA_ClienteEmail,
				@pVENTA_ClienteDireccion,
				@pVENTA_ClienteTelefono,
				@pVENTA_ClienteDistrito,
				@pVENTA_ClienteCiudad,
				@pVENTA_ClientePais,
				@pVENTA_ContactoNombres,
				@pVENTA_ContactoDireccion,
				@pVENTA_ContactoEmail,
				@pVENTA_ContactoTelefono,
				@pVENTA_ContactoDistrito,
				@pVENTA_ContactoPais,
				@pVENTA_ImporteVenta,
				@pVENTA_EstadoId,
				@pVENTA_SituacionId,
				@pVentaCreadoFecha,
				@pVENTA_Usuario,
				@pVentaCreadoFecha,
				@pVENTA_Usuario,
				@pVENTA_Counter,
				@pVENTA_Observacion
			)	
						
			
		END
	ELSE
		BEGIN
			UPDATE VENTA SET 
				ventaFechaVigenciaInicio = @pVENTA_FechaVigenciaInicio,
				ventaFechaVigenciaFin = @pVENTA_FechaVigenciaFin,
				ventaNumeroDias = @pVENTA_NumeroDias,
				ventaDestino = @pVENTA_Destino,
				ventaProductoId = @pVENTA_ProductoId,
				ventaProductoImporte = @pVENTA_ProductoImporte,
				ventaClienteDocumentoTipoId = @pVENTA_ClienteDocumentoTipo,
				ventaClienteDocumentoNumero = @pVENTA_ClienteDocumentoNumero,
				ventaClienteNombres = @pVENTA_ClienteNombres,
				ventaClienteApellidos = @pVENTA_ClienteApellidos,
				ventaClienteFechaNacimiento = @pVENTA_ClienteFechaNacimiento,
				ventaClienteEdad = @pVENTA_ClienteEdad,
				ventaClienteEmail = @pVENTA_ClienteEmail,
				ventaClienteDireccion = @pVENTA_ClienteDireccion,
				ventaClienteTelefono = @pVENTA_ClienteTelefono,
				ventaClienteDistrito = @pVENTA_ClienteDistrito,
				ventaClienteCiudad = @pVENTA_ClienteCiudad,
				ventaClientePais = @pVENTA_ClientePais,
				ventaContactoNombres = @pVENTA_ContactoNombres,
				ventaContactoDireccion = @pVENTA_ContactoDireccion,
				ventaContactoEmail = @pVENTA_ContactoEmail,
				ventaContactoTelefono = @pVENTA_ContactoTelefono,
				ventaContactoDistrito = @pVENTA_ContactoDistrito,
				ventaContactoPais = @pVENTA_ContactoPais,
				ventaImporteVenta = @pVENTA_ImporteVenta,
				ventaModificadoUsuarioId = @pVENTA_Usuario,
				ventaModificadoFecha = GETDATE(),
				ventaCreadoFecha = @pVentaCreadoFecha,
				ventaCounter = @pVENTA_Counter,
				ventaEstadoId = @pVENTA_EstadoId,
				--ventaSituacionId = @pVENTA_SituacionId,
				ventaObservacion = @pVENTA_Observacion,
				ventaUsuarioAgenciaId = @pVENTA_UsuarioAgenciaId
			WHERE ventaId = @pVENTA_Id
		END
    
    SELECT @pVENTA_Id
    
END;
