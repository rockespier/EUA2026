-- Objeto: euroamer_admin_2008.VentaGrupal_Procesar
-- Creado en BD: 2016-12-09 20:42:05
-- Modificado en BD: 2026-04-28 03:54:20
-- Extraído: 2026-09-07 08:27:17 UTC
-- Referenciado por el backend .NET: NO (revisar si sigue en uso)
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
--   @pVENTA_Observacion varchar (IN)
--   @pVENTA_PromocionId int (IN)

CREATE PROCEDURE [euroamer_admin_2008].[VentaGrupal_Procesar]
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
	@pVENTA_Observacion VARCHAR(100) ='',
	@pVENTA_PromocionId INT=0
AS
BEGIN
	
	SET NOCOUNT ON;
	declare @tipoproceso int = 0;
	declare @resultado varchar(300) = '';
	declare @FechaHoraActual datetime = [euroamer_admin_2008].[fuObtenerFechaActualPeruana]();

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
	DECLARE @vVENTACLIENTE_Nacionalidad VARCHAR(50)
	DECLARE @vEdadAdicional INT = 0;

	DECLARE @vContadorPasajero INT = 0;
	DECLARE @vPromocionPasajero INT = 0;
	DECLARE @pVENTA_ImporteIncremento DECIMAL(18,4) = 0;
	DECLARE @vPromocionDescuento DECIMAL(18,4) = 0;
	DECLARE @vImporteDescuento  DECIMAL(18,4) = 0;
	

	--Si hay promocion, debemos obtener el pasajero afectado
	IF @pVENTA_PromocionId > 0
	    BEGIN

            --select  paisPromocionPasajeroId, paisPromocionDescuento from PAIS_PROMOCION where paisPromocionId = 10

            select @vPromocionPasajero = paisPromocionPasajeroId, @vPromocionDescuento = paisPromocionDescuento 
            from PAIS_PROMOCION where paisPromocionId = @pVENTA_PromocionId
	        if @vPromocionPasajero > 0 
	            begin
                    set @vPromocionPasajero = @vPromocionPasajero - 1;
                end
        END

	SET @pCORRELATIVO_Columna = 'ventaId'
	
	DECLARE cursor_clientes CURSOR FOR
		SELECT	ventaclienteDocumentoTipoId, ventaclienteDocumentoNumero, ventaclienteNombres, ventaclienteApellidos,
				ventaclienteFechaNacimiento, ventaclienteEdad, ventaclienteEmail, ventaclienteDireccion,
				ventaclienteTelefono, ventaclienteDistrito, ventaclienteCiudad, ventaclientePais, ventaclienteNacionalidad
		FROM	VENTA_CLIENTE
		WHERE	ventaclienteVentaId = @pVENTA_GrupalId;

	OPEN cursor_clientes;
	FETCH cursor_clientes INTO	@vVENTACLIENTE_DocumentoTipo, @vVENTACLIENTE_DocumentoNumero, @vVENTACLIENTE_Nombres, @vVENTACLIENTE_Apellidos, 
								@vVENTACLIENTE_FechaNacimiento, @vVENTACLIENTE_Edad, @vVENTACLIENTE_Email, @vVENTACLIENTE_Direccion,
								@vVENTACLIENTE_Telefono, @vVENTACLIENTE_Distrito, @vVENTACLIENTE_Ciudad, @vVENTACLIENTE_Pais, @vVENTACLIENTE_Nacionalidad
	WHILE @@FETCH_STATUS = 0
		BEGIN
			SET @vVENTA_Id = (SELECT correlativoUltimoGenerado+1 FROM CORRELATIVOS WHERE correlativoColumna = @pCORRELATIVO_Columna)
			
			--verificar incremento
			set @vEdadAdicional = (select count(*) from PRODUCTO where productoId = @pVENTA_ProductoId
			                                                       and @vVENTACLIENTE_Edad > productoEdadMaxima
			                                                       and @vVENTACLIENTE_Edad <= productoImporteDiaAdicional)

			if @vEdadAdicional > 0
			    begin
                    set @pVENTA_ImporteIncremento = ROUND((@pVENTA_ProductoImporte * 1.5),0);
                end
			else        
			    begin 
                    set @pVENTA_ImporteIncremento = @pVENTA_ProductoImporte;
                end

			set @pVENTA_ImporteVenta = @pVENTA_ImporteIncremento
			
			if @pVENTA_PromocionId > 0
			begin
                --verificar si el descuento le aplica a todos
                if (@vPromocionPasajero = 0 )
                begin
                    set @vImporteDescuento =  (@pVENTA_ImporteIncremento * @vPromocionDescuento) / 100;
                    set @pVENTA_ImporteVenta = ROUND((@pVENTA_ImporteIncremento - @vImporteDescuento),0);
                end
                else
                begin
                    --el descuento le aplica a un solo pasajero
                    if ((@vPromocionPasajero = @vContadorPasajero) and (@vPromocionDescuento > 0))
                        begin
                            set @vImporteDescuento =  (@pVENTA_ImporteIncremento * @vPromocionDescuento) / 100;
                            set @pVENTA_ImporteVenta = ROUND((@pVENTA_ImporteIncremento - @vImporteDescuento),0);
                        end
                    else
                        begin
                            set @pVENTA_PromocionId = 0;
                        end
                end
            end
			
			set @tipoproceso=1;
            
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
				ventaGrupalId,
				ventaobservacion,
				ventaNacionalidad,
				promocionId
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
				@pVENTA_ProductoImporte,
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
				@pVENTA_ImporteVenta,
				'V',
				'P',
				@FechaHoraActual,
				@pVENTA_Usuario,
				@FechaHoraActual,
				@pVENTA_Usuario,
				@pVENTA_Counter,
				@pVENTA_GrupalId,
				@pVENTA_Observacion,
				@vVENTACLIENTE_Nacionalidad,
				@pVENTA_PromocionId
			)
			
			IF @@ROWCOUNT > 0
			BEGIN
				set @resultado = 'ok'
			END

			UPDATE CORRELATIVOS SET correlativoUltimoGenerado = @vVENTA_Id
			WHERE correlativoColumna = @pCORRELATIVO_Columna			

			SET @vContadorPasajero = @vContadorPasajero + 1;

			FETCH cursor_clientes INTO	@vVENTACLIENTE_DocumentoTipo, @vVENTACLIENTE_DocumentoNumero, @vVENTACLIENTE_Nombres, @vVENTACLIENTE_Apellidos, 
										@vVENTACLIENTE_FechaNacimiento, @vVENTACLIENTE_Edad, @vVENTACLIENTE_Email, @vVENTACLIENTE_Direccion,
										@vVENTACLIENTE_Telefono, @vVENTACLIENTE_Distrito, @vVENTACLIENTE_Ciudad, @vVENTACLIENTE_Pais,@vVENTACLIENTE_Nacionalidad;
		END;
	CLOSE cursor_clientes;
	DEALLOCATE cursor_clientes;
    
	select 1 as errorCodigo, @resultado as errorDescripcion

END
