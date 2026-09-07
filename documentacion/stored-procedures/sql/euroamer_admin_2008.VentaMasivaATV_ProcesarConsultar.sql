-- Objeto: euroamer_admin_2008.VentaMasivaATV_ProcesarConsultar
-- Creado en BD: 2016-12-09 20:42:05
-- Modificado en BD: 2016-12-09 20:42:05
-- Extraído: 2026-09-07 08:27:17 UTC
-- Referenciado por el backend .NET: NO (revisar si sigue en uso)
-- Parámetros:
--   @pVENTA_MasivoId int (IN)

CREATE PROCEDURE [euroamer_admin_2008].[VentaMasivaATV_ProcesarConsultar]
	@pVENTA_MasivoId INT
AS
BEGIN
	
	SET NOCOUNT ON;

	DECLARE @vVENTA_Id INT
	DECLARE @vVENTA_Identity INT
	DECLARE @vVENTA_FechaVigenciaInicio DATE
	DECLARE @vVENTA_FechaVigenciaFin DATE
	DECLARE @vVENTA_NumeroDias INT
	DECLARE @vVENTA_Destino VARCHAR(255)
	DECLARE @vVENTA_ProductoId INT
	DECLARE @vVENTA_ProductoImporte DECIMAL(18,4)
	DECLARE @vVENTA_UsuarioOrigen CHAR(1)
	DECLARE @vVENTA_AgenciaId INT
	DECLARE @vVENTA_AgenciaUsuarioId INT
	DECLARE @vVENTA_Counter VARCHAR(100)
	DECLARE @vVENTA_ClienteDocumentoTipoId VARCHAR(3)
	DECLARE @vVENTA_ClienteDocumentoNumero VARCHAR(50)
	DECLARE @vVENTA_ClienteNombres VARCHAR(50)
	DECLARE @vVENTA_ClienteApellidos VARCHAR(80)
	DECLARE @vVENTA_ClienteFechaNacimiento DATE
	DECLARE @vVENTA_ClienteEdad INT
	DECLARE @vVENTA_ClienteEmail VARCHAR(100)
	DECLARE @vVENTA_ClienteDireccion VARCHAR(255)
	DECLARE @vVENTA_ClienteTelefono VARCHAR(50)
	DECLARE @vVENTA_ClienteDistrito VARCHAR(50)
	DECLARE @vVENTA_ClienteCiudad VARCHAR(50)
	DECLARE @vVENTA_ClientePais VARCHAR(50)
	DECLARE @vVENTA_ContactoNombres VARCHAR(255)
	DECLARE @vVENTA_ContactoDireccion VARCHAR(255)
	DECLARE @vVENTA_ContactoEmail VARCHAR(50)
	DECLARE @vVENTA_ContactoTelefono VARCHAR(50)
	DECLARE @vVENTA_ContactoDistrito VARCHAR(25)
	DECLARE @vVENTA_ContactoPais VARCHAR(50)
	DECLARE @vVENTA_ImporteVenta DECIMAL(18, 4)
	DECLARE @vVENTA_CodigoExterno VARCHAR(50)

	DECLARE cursor_ventas_masivas CURSOR FOR
		SELECT	ventaIdentity, ventaFechaVigenciaInicio, ventaFechaVigenciaFin, ventaNumeroDias, ventaDestino,
				ventaProductoId, ventaProductoImporte, ventaUsuarioOrigen, ventaAgenciaId, ventaAgenciaUsuarioId, 
				ventaCounter, ventaClienteDocumentoTipoId, ventaClienteDocumentoNumero, ventaClienteNombres, ventaClienteApellidos,
				ventaClienteFechaNacimiento, ventaClienteEdad, ventaClienteEmail, ventaClienteDireccion, ventaClienteTelefono,
				ventaClienteDistrito, ventaClienteCiudad, ventaClientePais, ventaContactoNombres, ventaContactoDireccion, 
				ventaContactoEmail, ventaContactoTelefono, ventaContactoDistrito, ventaContactoPais, ventaImporteVenta, ventaCodigoExterno
		FROM	VENTA_TMP
		WHERE	ventaMasivoId = @pVENTA_MasivoId;

	OPEN cursor_ventas_masivas;
		FETCH	cursor_ventas_masivas INTO
				@vVENTA_Identity, @vVENTA_FechaVigenciaInicio, @vVENTA_FechaVigenciaFin, @vVENTA_NumeroDias, @vVENTA_Destino, 
				@vVENTA_ProductoId, @vVENTA_ProductoImporte, @vVENTA_UsuarioOrigen, @vVENTA_AgenciaId, @vVENTA_AgenciaUsuarioId, 
				@vVENTA_Counter, @vVENTA_ClienteDocumentoTipoId, @vVENTA_ClienteDocumentoNumero, @vVENTA_ClienteNombres, @vVENTA_ClienteApellidos, 
				@vVENTA_ClienteFechaNacimiento, @vVENTA_ClienteEdad, @vVENTA_ClienteEmail, @vVENTA_ClienteDireccion, @vVENTA_ClienteTelefono, 
				@vVENTA_ClienteDistrito, @vVENTA_ClienteCiudad, @vVENTA_ClientePais, @vVENTA_ContactoNombres, @vVENTA_ContactoDireccion, 
				@vVENTA_ContactoEmail, @vVENTA_ContactoTelefono, @vVENTA_ContactoDistrito, @vVENTA_ContactoPais, @vVENTA_ImporteVenta, @vVENTA_CodigoExterno

	WHILE @@FETCH_STATUS = 0
		BEGIN
			SET @vVENTA_Id = (SELECT correlativoUltimoGenerado+1 FROM CORRELATIVOS WHERE correlativoColumna = 'VentaATVId')
			
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
				ventaCodigoExterno
			) 
			VALUES (
				@vVENTA_Id,
				@vVENTA_UsuarioOrigen,
				@vVENTA_AgenciaId,
				@vVENTA_FechaVigenciaInicio,
				@vVENTA_FechaVigenciaFin,
				@vVENTA_NumeroDias,
				@vVENTA_Destino,
				@vVENTA_ProductoId,
				@vVENTA_ProductoImporte,
				@vVENTA_ClienteDocumentoTipoId, 
				@vVENTA_ClienteDocumentoNumero, 
				@vVENTA_ClienteNombres, 
				@vVENTA_ClienteApellidos, 
				@vVENTA_ClienteFechaNacimiento, 
				@vVENTA_ClienteEdad, 
				@vVENTA_ClienteEmail, 
				@vVENTA_ClienteDireccion,
				@vVENTA_ClienteTelefono, 
				@vVENTA_ClienteDistrito, 
				@vVENTA_ClienteCiudad, 
				@vVENTA_ClientePais,
				@vVENTA_ContactoNombres,
				@vVENTA_ContactoDireccion,
				@vVENTA_ContactoEmail,
				@vVENTA_ContactoTelefono,
				@vVENTA_ContactoDistrito,
				@vVENTA_ContactoPais,
				@vVENTA_ImporteVenta,
				'V',
				'P',
				GETDATE(),
				@vVENTA_AgenciaUsuarioId,
				GETDATE(),
				@vVENTA_AgenciaUsuarioId,
				@vVENTA_Counter,
				@vVENTA_CodigoExterno
			)
			
			UPDATE VENTA_TMP SET ventaId = @vVENTA_Id WHERE ventaIdentity = @vVENTA_Identity

			UPDATE CORRELATIVOS SET correlativoUltimoGenerado = @vVENTA_Id
			WHERE correlativoColumna = 'VentaATVId'

			FETCH	cursor_ventas_masivas INTO	
					@vVENTA_Identity, @vVENTA_FechaVigenciaInicio, @vVENTA_FechaVigenciaFin, @vVENTA_NumeroDias, @vVENTA_Destino, 
					@vVENTA_ProductoId, @vVENTA_ProductoImporte, @vVENTA_UsuarioOrigen, @vVENTA_AgenciaId, @vVENTA_AgenciaUsuarioId, 
					@vVENTA_Counter, @vVENTA_ClienteDocumentoTipoId, @vVENTA_ClienteDocumentoNumero, @vVENTA_ClienteNombres, @vVENTA_ClienteApellidos, 
					@vVENTA_ClienteFechaNacimiento, @vVENTA_ClienteEdad, @vVENTA_ClienteEmail, @vVENTA_ClienteDireccion, @vVENTA_ClienteTelefono, 
					@vVENTA_ClienteDistrito, @vVENTA_ClienteCiudad, @vVENTA_ClientePais, @vVENTA_ContactoNombres, @vVENTA_ContactoDireccion, 
					@vVENTA_ContactoEmail, @vVENTA_ContactoTelefono, @vVENTA_ContactoDistrito, @vVENTA_ContactoPais, @vVENTA_ImporteVenta, @vVENTA_CodigoExterno;
		END;
	CLOSE cursor_ventas_masivas;
	DEALLOCATE cursor_ventas_masivas;

	SELECT	ventaId, 
			ventaUsuarioAgenciaId, 
			euroamer_admin_2008.Usuario_RecuperarNombre2(ventaUsuarioOrigen, ventaUsuarioAgenciaId,ventaCreadoUsuarioId) as ventaUsuarioAgenciaNombre,
			ventaFechaVigenciaInicio, 
			ventaFechaVigenciaFin, 
			ventaNumeroDias, 
			ventaDestino, 
			ventaProductoId, 
			productoNombre as ventaProductoNombre, --ISNULL((SELECT productoNombre FROM PRODUCTO WHERE productoId=ventaProductoId),'') as ventaProductoNombre, 
			ventaProductoImporte, 
			ventaClienteDocumentoTipoId, 
			(SELECT valorTipoNombre FROM VALORES_TIPO WHERE valorTipoColumnaTabla='ventaClienteDocumentoTipoId' AND valorTipoId=ventaClienteDocumentoTipoId) as ventaClienteDocumentoTipoNombre, 
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
			euroamer_admin_2008.ValorTipo_RecuperarNombre('ventaEstadoId', ventaEstadoId) as ventaEstadoNombre,
			ventaSituacionId,
			euroamer_admin_2008.ValorTipo_RecuperarNombre('ventaSituacionId', ventaSituacionId) as ventaSituacionNombre,
			ventaCreadoFecha, 
			euroamer_admin_2008.Usuario_RecuperarNombre(ventaUsuarioOrigen, ventaCreadoUsuarioId) as ventaCreadoUsuarioNombre,
			(select euroamer_admin_2008.Usuario_RecuperarNombrexID(agenciaPromotorId) from AGENCIA where ventaUsuarioAgenciaId = agenciaId ) as ventaPromotorNombre,
			ventaCounter,			
			(SELECT agenciaDireccion FROM AGENCIA WHERE agenciaId = ventaUsuarioAgenciaId) as UsuarioAgenciaDireccion,
            (SELECT agenciaEmail FROM AGENCIA WHERE agenciaId = ventaUsuarioAgenciaId) as UsuarioAgenciaCorreo,
			productoEdadMinima as ventaProductoEdadMinima, 
			productoEdadMaxima as ventaProductoEdadMaxima,
			v.ventaCodigoExterno
	FROM	VENTA v, PRODUCTO p
	WHERE	v.ventaProductoId = p.productoId AND
			v.ventaId IN (SELECT ventaId FROM VENTA_TMP WHERE ventaMasivoId = @pVENTA_MasivoId)
	ORDER BY ventaCreadoFecha DESC

	DELETE FROM VENTA_TMP
END
