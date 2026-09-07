-- Objeto: euroamer_admin_2008.Venta_Procesar
-- Creado en BD: 2018-10-31 14:56:39
-- Modificado en BD: 2018-10-31 14:56:39
-- Extraído: 2026-09-07 08:27:17 UTC
-- Referenciado por el backend .NET: NO (revisar si sigue en uso)
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

CREATE PROCEDURE [Venta_Procesar]
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
	@pVENTA_Cupon VARCHAR(50) = ''
AS
BEGIN
	
	SET NOCOUNT ON;

	IF @pVENTA_Id = 0
		BEGIN
			DECLARE @vCORRELATIVO_Columna VARCHAR(50)
			DECLARE @vPAIS_Id INT
			DECLARE @vVENTA_CuponDescuento INT
			DECLARE @vVENTA_CuponVigencia DATE

			SET @vCORRELATIVO_Columna = 'ventaId'
			SET @pVENTA_Id = (SELECT correlativoUltimoGenerado+1 FROM CORRELATIVOS WHERE correlativoColumna = @vCORRELATIVO_Columna)

			UPDATE CORRELATIVOS SET correlativoUltimoGenerado = @pVENTA_Id WHERE correlativoColumna = @vCORRELATIVO_Columna
			
			--SELECT correlativoUltimoGenerado+1 FROM CORRELATIVOS WHERE correlativoColumna = 'ventaId'
			
			--SET @vPAIS_Id = euroamer_admin_2008.Usuario_RecuperarPais(@pVENTA_UsuarioOrigen, @pVENTA_UsuarioAgenciaId)
			--select euroamer_admin_2008.Usuario_RecuperarPais('A', '902')

			--SET @vVENTA_CuponDescuento = 0
			--SET @vVENTA_CuponVigencia = '1900-01-01'
			--IF @vPAIS_Id <> -1
			--	BEGIN
			--		SET @vVENTA_CuponDescuento = (SELECT paisCuponDescuento FROM PAIS WHERE paisId=@vPAIS_Id AND paisActivo=1)
			--		SET @vVENTA_CuponVigencia = (SELECT DATEADD(DD, (SELECT paisCuponVigenciaId FROM PAIS WHERE paisId=@vPAIS_Id AND paisActivo=1), GETDATE()))
			--	END

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
				ventaCounter--,ventaCuponDescuento,ventaCuponVigencia
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
				'V',
				'P',
				GETDATE(),
				@pVENTA_Usuario,
				GETDATE(),
				@pVENTA_Usuario,
				@pVENTA_Counter--,@vVENTA_CuponDescuento,@vVENTA_CuponVigencia
			)	
						
			--IF @pVENTA_Cupon <> ''
			--	BEGIN
			--		if isnumeric(@pVENTA_Cupon) =  1
			--			begin
			--				UPDATE VENTA SET ventaCuponAplicado='S' WHERE ventaId=@pVENTA_Cupon
			--			end
			--		else
			--			begin
			--				UPDATE VENTA_CUPON SET ventacuponEstado='S' WHERE ventacuponCupon=@pVENTA_Cupon
			--			end
			--	END
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
				ventaCounter = @pVENTA_Counter
			WHERE ventaId = @pVENTA_Id
		END
    
    SELECT @pVENTA_Id
    
END;
