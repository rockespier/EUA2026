-- Objeto: euroamer_admin_2008.Solicitud_Atender
-- Creado en BD: 2013-12-24 08:50:58
-- Modificado en BD: 2017-02-09 07:43:57
-- Extraído: 2026-09-07 08:27:16 UTC
-- Referenciado por el backend .NET: SI
-- Parámetros:
--   @pSOLICITUD_Id int (IN)
--   @pSOLICITUD_TipoId int (IN)
--   @pSOLICITUD_Usuario int (IN)

CREATE PROCEDURE [Solicitud_Atender]
	@pSOLICITUD_Id INT,
	@pSOLICITUD_TipoId INT,
	@pSOLICITUD_Usuario INT
AS
BEGIN
	
	SET NOCOUNT ON;

	DECLARE @vVENTA_Id INT

	SET @vVENTA_Id = (SELECT solicitudVentaId FROM SOLICITUD WHERE solicitudId = @pSOLICITUD_Id )
	
	IF @pSOLICITUD_TipoId = 1 --ANULACION
		BEGIN
			UPDATE	VENTA SET 
					ventaEstadoId = 'A', 
					ventaAnuladoFecha = GETDATE(),
					ventaAnuladoUsuarioId = @pSOLICITUD_Usuario
			WHERE	ventaId = @vVENTA_Id
			
			UPDATE	SOLICITUD SET
					solicitudEstadoId = 'A',
					solicitudAtendidoUsuarioId = @pSOLICITUD_Usuario,
					solicitudAtendidoFecha = GETDATE()
			WHERE	solicitudId = @pSOLICITUD_Id
		END

	ELSE IF @pSOLICITUD_TipoId = 2 --MODIFICACION DE VIGENCIA
		BEGIN
			DECLARE @vVENTA_FechaVigenciaInicio DATE
			DECLARE @vVENTA_FechaVigenciaFin DATE
			DECLARE @vVENTA_NumeroDias INT
			DECLARE @vVENTA_ProductoImporte DECIMAL(18,4)
			DECLARE @vVENTA_GrupalId INT

			SET @vVENTA_GrupalId = (SELECT ventaGrupalId FROM VENTA WHERE VENTAID = @vVENTA_Id)
			SET @vVENTA_FechaVigenciaInicio = (SELECT solicitudVigenciaFechaInicial FROM SOLICITUD where solicitudId = @pSOLICITUD_Id)
			SET @vVENTA_FechaVigenciaFin = (SELECT solicitudVigenciaFechaFinal FROM SOLICITUD where solicitudId = @pSOLICITUD_Id)
			SET @vVENTA_NumeroDias = DATEDIFF(D, @vVENTA_FechaVigenciaInicio, @vVENTA_FechaVigenciaFin) + 1
			SET @vVENTA_ProductoImporte = (SELECT top 1 tarifaImporte FROM PRODUCTO_TARIFA WHERE tarifaProductoId = (SELECT ventaProductoId FROM VENTA WHERE ventaId = @vVENTA_Id) AND @vVENTA_NumeroDias BETWEEN tarifaNumeroDiasMinimo AND tarifaNumeroDiasMaximo)

			IF ISNULL(@vVENTA_GrupalId,0) = 0 
			BEGIN
				UPDATE	VENTA SET 
						ventaFechaVigenciaInicio = @vVENTA_FechaVigenciaInicio,
						ventaFechaVigenciaFin = @vVENTA_FechaVigenciaFin,
						ventaNumeroDias = @vVENTA_NumeroDias,
						ventaProductoImporte = @vVENTA_ProductoImporte
				WHERE	ventaId = @vVENTA_Id				
			END
			ELSE
			BEGIN
				UPDATE	VENTA SET 
						ventaFechaVigenciaInicio = @vVENTA_FechaVigenciaInicio,
						ventaFechaVigenciaFin = @vVENTA_FechaVigenciaFin,
						ventaNumeroDias = @vVENTA_NumeroDias						
				WHERE	ventaId = @vVENTA_Id								
			END

			UPDATE	SOLICITUD SET
					solicitudEstadoId = 'A',
					solicitudAtendidoUsuarioId = @pSOLICITUD_Usuario,
					solicitudAtendidoFecha = GETDATE()
			WHERE	solicitudId = @pSOLICITUD_Id
		END

	ELSE IF @pSOLICITUD_TipoId = 3 --REACTIVACION
		BEGIN
			UPDATE	VENTA SET 
					ventaEstadoId = 'V', 
					ventaAnuladoFecha = NULL,
					ventaAnuladoUsuarioId = NULL
			WHERE	ventaId = @vVENTA_Id

			UPDATE	SOLICITUD SET
					solicitudEstadoId = 'A',
					solicitudAtendidoUsuarioId = @pSOLICITUD_Usuario,
					solicitudAtendidoFecha = GETDATE()
			WHERE	solicitudId = @pSOLICITUD_Id
		END

	ELSE IF @pSOLICITUD_TipoId = 4 --TRANSLADO
		BEGIN
			
			DECLARE @vVENTA_AgenciaId INT
			DECLARE @vVENTA_AgenciaUsuarioId INT

			SET @vVENTA_AgenciaId = (SELECT solicitudAgenciaId FROM SOLICITUD where solicitudId = @pSOLICITUD_Id)
			SET @vVENTA_AgenciaUsuarioId = (SELECT solicitudAgenciaUsuarioId FROM SOLICITUD where solicitudId = @pSOLICITUD_Id)

			UPDATE	VENTA SET 
					ventaUsuarioAgenciaId = @vVENTA_AgenciaId, 
					ventaCreadoUsuarioId = @vVENTA_AgenciaUsuarioId
			WHERE	ventaId = @vVENTA_Id

			UPDATE	SOLICITUD SET
					solicitudEstadoId = 'A',
					solicitudAtendidoUsuarioId = @pSOLICITUD_Usuario,
					solicitudAtendidoFecha = GETDATE()
			WHERE	solicitudId = @pSOLICITUD_Id
		END

	ELSE IF @pSOLICITUD_TipoId = 5 --MODIFICACION DE CLIENTE
		BEGIN
			
			DECLARE @vSOLICITUD_ClienteDocumentoTipoId CHAR(3)
			DECLARE @vSOLICITUD_ClienteDocumentoNumero VARCHAR(50)
			DECLARE @vSOLICITUD_ClienteNombres VARCHAR(50)
			DECLARE @vSOLICITUD_ClienteApellidos VARCHAR(80)
			DECLARE @vSOLICITUD_ClienteFechaNacimiento DATE
			DECLARE @vSOLICITUD_ClienteEdad INT
			DECLARE @vSOLICITUD_ClienteEmail VARCHAR(100)
			DECLARE @vSOLICITUD_ClienteDireccion VARCHAR(255)
			DECLARE @vSOLICITUD_ClienteTelefono VARCHAR(50)
			DECLARE @vSOLICITUD_ClienteDistrito VARCHAR(50)
			DECLARE @vSOLICITUD_ClienteCiudad VARCHAR(50)
			DECLARE @vSOLICITUD_ClientePais VARCHAR(50)

			SET @vSOLICITUD_ClienteDocumentoTipoId = (SELECT solicitudClienteDocumentoTipoId FROM SOLICITUD where solicitudId = @pSOLICITUD_Id)
			SET @vSOLICITUD_ClienteDocumentoNumero = (SELECT solicitudClienteDocumentoNumero FROM SOLICITUD where solicitudId = @pSOLICITUD_Id)
			SET @vSOLICITUD_ClienteNombres = (SELECT solicitudClienteNombres FROM SOLICITUD where solicitudId = @pSOLICITUD_Id)
			SET @vSOLICITUD_ClienteApellidos = (SELECT solicitudClienteApellidos FROM SOLICITUD where solicitudId = @pSOLICITUD_Id)
			SET @vSOLICITUD_ClienteFechaNacimiento = (SELECT solicitudClienteFechaNacimiento FROM SOLICITUD where solicitudId = @pSOLICITUD_Id)
			SET @vSOLICITUD_ClienteEdad = (SELECT solicitudClienteEdad FROM SOLICITUD where solicitudId = @pSOLICITUD_Id)
			SET @vSOLICITUD_ClienteEmail = (SELECT solicitudClienteEmail FROM SOLICITUD where solicitudId = @pSOLICITUD_Id)
			SET @vSOLICITUD_ClienteDireccion = (SELECT solicitudClienteDireccion FROM SOLICITUD where solicitudId = @pSOLICITUD_Id)
			SET @vSOLICITUD_ClienteTelefono = (SELECT solicitudClienteTelefono FROM SOLICITUD where solicitudId = @pSOLICITUD_Id)
			SET @vSOLICITUD_ClienteDistrito = (SELECT solicitudClienteDistrito FROM SOLICITUD where solicitudId = @pSOLICITUD_Id)
			SET @vSOLICITUD_ClienteCiudad = (SELECT solicitudClienteCiudad FROM SOLICITUD where solicitudId = @pSOLICITUD_Id)
			SET @vSOLICITUD_ClientePais = (SELECT solicitudClientePais FROM SOLICITUD where solicitudId = @pSOLICITUD_Id)

			UPDATE	VENTA SET 
					ventaClienteDocumentoTipoId = @vSOLICITUD_ClienteDocumentoTipoId, 
					ventaClienteDocumentoNumero = @vSOLICITUD_ClienteDocumentoNumero,
					ventaClienteNombres = @vSOLICITUD_ClienteNombres,
					ventaClienteApellidos = @vSOLICITUD_ClienteApellidos,
					ventaClienteFechaNacimiento = @vSOLICITUD_ClienteFechaNacimiento,
					ventaClienteEdad = @vSOLICITUD_ClienteEdad,
					ventaClienteEmail = @vSOLICITUD_ClienteEmail,
					ventaClienteDireccion = @vSOLICITUD_ClienteDireccion,
					ventaClienteTelefono = @vSOLICITUD_ClienteTelefono,
					ventaClienteDistrito = @vSOLICITUD_ClienteDistrito,
					ventaClienteCiudad = @vSOLICITUD_ClienteCiudad,
					ventaClientePais = @vSOLICITUD_ClientePais
			WHERE	ventaId = @vVENTA_Id

			UPDATE	SOLICITUD SET
					solicitudEstadoId = 'A',
					solicitudAtendidoUsuarioId = @pSOLICITUD_Usuario,
					solicitudAtendidoFecha = GETDATE()
			WHERE	solicitudId = @pSOLICITUD_Id
		END

	ELSE IF @pSOLICITUD_TipoId = 6 --MODIFICACION DE CONTACTO
		BEGIN
			
			DECLARE @vSOLICITUD_ContactoNombre VARCHAR(50)
			DECLARE @vSOLICITUD_ContactoDireccion VARCHAR(255)
			DECLARE @vSOLICITUD_ContactoDistrito VARCHAR(50)
			DECLARE @vSOLICITUD_ContactoPais VARCHAR(50)
			DECLARE @vSOLICITUD_ContactoTelefono VARCHAR(50)
			DECLARE @vSOLICITUD_ContactoEmail VARCHAR(100)

			SET @vSOLICITUD_ContactoNombre = (SELECT solicitudContactoNombre FROM SOLICITUD where solicitudId = @pSOLICITUD_Id)
			SET @vSOLICITUD_ContactoDireccion = (SELECT solicitudContactoDireccion FROM SOLICITUD where solicitudId = @pSOLICITUD_Id)
			SET @vSOLICITUD_ContactoDistrito = (SELECT solicitudContactoDistrito FROM SOLICITUD where solicitudId = @pSOLICITUD_Id)
			SET @vSOLICITUD_ContactoPais = (SELECT solicitudContactoPais FROM SOLICITUD where solicitudId = @pSOLICITUD_Id)
			SET @vSOLICITUD_ContactoTelefono = (SELECT solicitudContactoTelefono FROM SOLICITUD where solicitudId = @pSOLICITUD_Id)
			SET @vSOLICITUD_ContactoEmail = (SELECT solicitudContactoEmail FROM SOLICITUD where solicitudId = @pSOLICITUD_Id)

			UPDATE	VENTA SET 
					ventaContactoNombres = @vSOLICITUD_ContactoNombre,
					ventaContactoDireccion = @vSOLICITUD_ContactoDireccion,
					ventaContactoDistrito = @vSOLICITUD_ContactoDistrito,
					ventaContactoPais = @vSOLICITUD_ContactoPais,
					ventaContactoTelefono = @vSOLICITUD_ContactoTelefono,
					ventaContactoEmail = @vSOLICITUD_ContactoEmail
			WHERE	ventaId = @vVENTA_Id

			UPDATE	SOLICITUD SET
					solicitudEstadoId = 'A',
					solicitudAtendidoUsuarioId = @pSOLICITUD_Usuario,
					solicitudAtendidoFecha = GETDATE()
			WHERE	solicitudId = @pSOLICITUD_Id
		END

	ELSE IF @pSOLICITUD_TipoId = 7 --MODIFICACION DE IMPORTE
		BEGIN
			
			DECLARE @vSOLICITUD_VentaImporte DECIMAL(18,4)

			SET @vSOLICITUD_VentaImporte = (SELECT solicitudVentaImporte FROM SOLICITUD where solicitudId = @pSOLICITUD_Id)
			
			UPDATE	VENTA SET 
					ventaProductoImporte = @vSOLICITUD_VentaImporte,
					ventaImporteVenta = @vSOLICITUD_VentaImporte
			WHERE	ventaId = @vVENTA_Id

			UPDATE	SOLICITUD SET
					solicitudEstadoId = 'A',
					solicitudAtendidoUsuarioId = @pSOLICITUD_Usuario,
					solicitudAtendidoFecha = GETDATE()
			WHERE	solicitudId = @pSOLICITUD_Id
		END

	ELSE IF @pSOLICITUD_TipoId = 8 --CANCELACION TARJETA FREE
		BEGIN
			
			DECLARE @vSOLICITUD_VentaImporteCero DECIMAL(18,4)

			SET @vSOLICITUD_VentaImporteCero = (SELECT solicitudVentaImporte FROM SOLICITUD where solicitudId = @pSOLICITUD_Id)
			
			UPDATE	VENTA SET 
					ventaProductoImporte = @vSOLICITUD_VentaImporteCero,
					ventaImporteVenta = @vSOLICITUD_VentaImporteCero,
					ventaSituacionId = 'C'
			WHERE	ventaId = @vVENTA_Id

			UPDATE	SOLICITUD SET
					solicitudEstadoId = 'A',
					solicitudAtendidoUsuarioId = @pSOLICITUD_Usuario,
					solicitudAtendidoFecha = GETDATE()
			WHERE	solicitudId = @pSOLICITUD_Id
		END
END
