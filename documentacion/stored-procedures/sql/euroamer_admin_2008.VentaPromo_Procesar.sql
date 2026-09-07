-- Objeto: euroamer_admin_2008.VentaPromo_Procesar
-- Creado en BD: 2017-03-25 18:41:08
-- Modificado en BD: 2017-03-25 18:41:08
-- Extraído: 2026-09-07 08:27:17 UTC
-- Referenciado por el backend .NET: SI
-- Parámetros:
--   @pVENTA_GrupalId int (IN)
--   @pVENTA_UsuarioOrigen char (IN)
--   @pVENTA_UsuarioAgenciaId int (IN)
--   @pVENTA_FechaVigenciaInicio date (IN)
--   @pVENTA_FechaVigenciaFin date (IN)
--   @pVENTA_NumeroDias int (IN)
--   @pVENTA_Destino varchar (IN)
--   @pVENTA_ProductoId int (IN)
--   @pVENTA_ProductoImporte decimal (IN)
--   @pVENTA_ContactoNombres varchar (IN)
--   @pVENTA_ContactoDireccion varchar (IN)
--   @pVENTA_ContactoEmail varchar (IN)
--   @pVENTA_ContactoTelefono varchar (IN)
--   @pVENTA_ContactoDistrito varchar (IN)
--   @pVENTA_ContactoPais varchar (IN)
--   @pVENTA_ImporteVenta decimal (IN)
--   @pVENTA_Usuario int (IN)
--   @pVENTA_Counter varchar (IN)
--   @pVENTA_PromocionId int (IN)

CREATE PROCEDURE [euroamer_admin_2008].[VentaPromo_Procesar]
	@pVENTA_GrupalId INT,
	@pVENTA_UsuarioOrigen CHAR(1),
	@pVENTA_UsuarioAgenciaId INT,
	@pVENTA_FechaVigenciaInicio DATE,
	@pVENTA_FechaVigenciaFin DATE,
	@pVENTA_NumeroDias INT,
	@pVENTA_Destino VARCHAR(255),
	@pVENTA_ProductoId INT,
	@pVENTA_ProductoImporte DECIMAL(18,4),
	@pVENTA_ContactoNombres VARCHAR(255),
	@pVENTA_ContactoDireccion VARCHAR(255),
	@pVENTA_ContactoEmail VARCHAR(50),
	@pVENTA_ContactoTelefono VARCHAR(50),
	@pVENTA_ContactoDistrito VARCHAR(25),
	@pVENTA_ContactoPais VARCHAR(50),
	@pVENTA_ImporteVenta DECIMAL(18,4),
	@pVENTA_Usuario INT,
	@pVENTA_Counter VARCHAR(100),
	@pVENTA_PromocionId INT = 0
AS
BEGIN
	
	SET NOCOUNT ON;

	DECLARE @vVENTA_Id INT
	DECLARE @pCORRELATIVO_Columna VARCHAR(50)

	DECLARE @vVENTACLIENTE_DocumentoTipo VARCHAR(3)
	DECLARE @vVENTACLIENTE_DocumentoNumero VARCHAR(50)
	DECLARE @vVENTACLIENTE_Nombres VARCHAR(50)
	DECLARE @vVENTACLIENTE_Apellidos VARCHAR(80)
	DECLARE @vVENTACLIENTE_FechaNacimiento DATE
	DECLARE @vVENTACLIENTE_Edad INT
	DECLARE @vVENTACLIENTE_Email VARCHAR(100)
	DECLARE @vVENTACLIENTE_Direccion VARCHAR(255)
	DECLARE @vVENTACLIENTE_Telefono VARCHAR(50)
	DECLARE @vVENTACLIENTE_Distrito VARCHAR(50)
	DECLARE @vVENTACLIENTE_Ciudad VARCHAR(50)
	DECLARE @vVENTACLIENTE_Pais VARCHAR(50)
	DECLARE @vCONTADOR INT
	DECLARE @vPROMOCION_ClientePaga INT
	DECLARE @vVENTA_ProductoImporte DECIMAL(18,4)
	DECLARE @vPromocionDescuento INT

	SELECT @vPROMOCION_ClientePaga=promocionClienteCntPagan, @vPromocionDescuento = PromocionDescuento 
	FROM PROMOCION 
	WHERE promocionId = @pVENTA_PromocionId

	SET @pCORRELATIVO_Columna = 'ventaId'
	SET @vCONTADOR = 1
	DECLARE cursor_clientes CURSOR FOR
		SELECT	ventaclienteDocumentoTipoId, ventaclienteDocumentoNumero, ventaclienteNombres, ventaclienteApellidos,
				ventaclienteFechaNacimiento, ventaclienteEdad, ventaclienteEmail, ventaclienteDireccion,
				ventaclienteTelefono, ventaclienteDistrito, ventaclienteCiudad, ventaclientePais
		FROM	VENTA_CLIENTE
		WHERE	ventaclienteVentaId = @pVENTA_GrupalId;

	OPEN cursor_clientes;
	FETCH cursor_clientes INTO	@vVENTACLIENTE_DocumentoTipo, @vVENTACLIENTE_DocumentoNumero, @vVENTACLIENTE_Nombres, @vVENTACLIENTE_Apellidos, 
								@vVENTACLIENTE_FechaNacimiento, @vVENTACLIENTE_Edad, @vVENTACLIENTE_Email, @vVENTACLIENTE_Direccion,
								@vVENTACLIENTE_Telefono, @vVENTACLIENTE_Distrito, @vVENTACLIENTE_Ciudad, @vVENTACLIENTE_Pais
	WHILE @@FETCH_STATUS = 0
		BEGIN
			SET @vVENTA_Id = (SELECT correlativoUltimoGenerado+1 FROM CORRELATIVOS WHERE correlativoColumna = @pCORRELATIVO_Columna)

		
			IF @vPROMOCION_ClientePaga >= @vCONTADOR
			BEGIN
			--Clientes que pagan
				--SET @vVENTA_ProductoImporte = @pVENTA_ImporteVenta --con descuento
				SET @vVENTA_ProductoImporte = @pVENTA_ProductoImporte - (@pVENTA_ProductoImporte * (@vPromocionDescuento/100))
			END
			ELSE
			BEGIN
			--Clientes que no pagan
				SET @vVENTA_ProductoImporte = 0 --@pVENTA_ProductoImporte --Sin descuento
			
			END

		   IF @pVENTA_PromocionId=3 
		   BEGIN
		   		  SET @vVENTA_ProductoImporte = @pVENTA_ProductoImporte - (@pVENTA_ProductoImporte * (@vPromocionDescuento/100)) --con descuento
		   END 
		
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
				ventaGrupalId
			) 
			VALUES (
				@vVENTA_Id,
				@pVENTA_UsuarioOrigen,
				@pVENTA_UsuarioAgenciaId,
				@pVENTA_FechaVigenciaInicio,
				@pVENTA_FechaVigenciaFin,
				@pVENTA_NumeroDias,
				@pVENTA_Destino,
				@pVENTA_ProductoId,
				@vVENTA_ProductoImporte,
				@vVENTACLIENTE_DocumentoTipo, 
				@vVENTACLIENTE_DocumentoNumero, 
				@vVENTACLIENTE_Nombres, 
				@vVENTACLIENTE_Apellidos, 
				@vVENTACLIENTE_FechaNacimiento, 
				@vVENTACLIENTE_Edad, 
				@vVENTACLIENTE_Email, 
				@vVENTACLIENTE_Direccion,
				@vVENTACLIENTE_Telefono, 
				@vVENTACLIENTE_Distrito, 
				@vVENTACLIENTE_Ciudad, 
				@vVENTACLIENTE_Pais,
				@pVENTA_ContactoNombres,
				@pVENTA_ContactoDireccion,
				@pVENTA_ContactoEmail,
				@pVENTA_ContactoTelefono,
				@pVENTA_ContactoDistrito,
				@pVENTA_ContactoPais,
				@vVENTA_ProductoImporte,
				'V',
				'P',
				GETDATE(),
				@pVENTA_Usuario,
				GETDATE(),
				@pVENTA_Usuario,
				@pVENTA_Counter,
				@pVENTA_GrupalId
			)
			
			UPDATE CORRELATIVOS SET correlativoUltimoGenerado = @vVENTA_Id
			WHERE correlativoColumna = @pCORRELATIVO_Columna

			SET @vCONTADOR = @vCONTADOR + 1

			FETCH cursor_clientes INTO	@vVENTACLIENTE_DocumentoTipo, @vVENTACLIENTE_DocumentoNumero, @vVENTACLIENTE_Nombres, @vVENTACLIENTE_Apellidos, 
										@vVENTACLIENTE_FechaNacimiento, @vVENTACLIENTE_Edad, @vVENTACLIENTE_Email, @vVENTACLIENTE_Direccion,
										@vVENTACLIENTE_Telefono, @vVENTACLIENTE_Distrito, @vVENTACLIENTE_Ciudad, @vVENTACLIENTE_Pais;
		END;
	CLOSE cursor_clientes;
	DEALLOCATE cursor_clientes;
    
	SELECT	ventaId, 
			(SELECT valorTipoNombre FROM VALORES_TIPO WHERE valorTipoColumnaTabla='ventaClienteDocumentoTipoId' AND valorTipoId=ventaClienteDocumentoTipoId) as ventaClienteDocumentoTipoNombre, 
			ventaClienteDocumentoNumero, 
			ventaClienteNombres, 
			ventaClienteApellidos, 
			ventaClienteEdad, 
			ventaClienteEmail, 
			ventaClienteDireccion, 
			ventaClienteTelefono, 
			ventaClienteDistrito, 
			ventaClienteCiudad, 
			ventaClientePais,
			(SELECT p.paisCorreo FROM AGENCIA a, PAIS p WHERE a.agenciaId = VENTA.ventaUsuarioAgenciaId AND a.agenciaPaisId = p.paisId) as ventaAgenciaCorreo
	FROM	VENTA
	WHERE	ventaGrupalId = @pVENTA_GrupalId;

END
