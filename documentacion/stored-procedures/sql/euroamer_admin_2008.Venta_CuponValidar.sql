-- Objeto: euroamer_admin_2008.Venta_CuponValidar
-- Creado en BD: 2017-03-25 18:41:08
-- Modificado en BD: 2017-03-25 18:41:08
-- Extraído: 2026-09-07 08:27:17 UTC
-- Referenciado por el backend .NET: SI
-- Parámetros:
--   @pVENTA_Cupon varchar (IN)
--   @pVENTA_ClienteDocumentoTipo varchar (IN)
--   @pVENTA_ClienteDocumentoNumero varchar (IN)
--   @pVENTA_DiasViaje int (IN)
--   @pVENTA_AgenciaID int (IN)

CREATE PROCEDURE [euroamer_admin_2008].[Venta_CuponValidar]
	@pVENTA_Cupon VARCHAR(50),
	@pVENTA_ClienteDocumentoTipo VARCHAR(3),
	@pVENTA_ClienteDocumentoNumero VARCHAR(50),
	@pVENTA_DiasViaje INT,
	@pVENTA_AgenciaID INT
AS
BEGIN
	
	SET NOCOUNT ON;

	DECLARE @vCUPON_Validar INT
	DECLARE @vCUPON_Resultado INT
	DECLARE @vCUPON_Ejecutar INT
	SET @vCUPON_Validar = 0
	SET @vCUPON_Resultado = 0
	SET @vCUPON_Ejecutar = 0

	IF @pVENTA_Cupon <> ''
		BEGIN
			if isnumeric(@pVENTA_Cupon) =  1
				begin
					set @vCUPON_Ejecutar =1
					IF (SELECT ventaCuponAplicado FROM VENTA WHERE ventaId=@pVENTA_Cupon) = 'S'
						BEGIN
							SET @vCUPON_Validar = -1 --EL cupon ingresado ya fue aplicado.
						END
					ELSE IF (SELECT COUNT(1) FROM VENTA WHERE ventaId=@pVENTA_Cupon AND ventaClienteDocumentoTipoId=@pVENTA_ClienteDocumentoTipo AND ventaClienteDocumentoNumero=@pVENTA_ClienteDocumentoNumero) = 0
						BEGIN
							SET @vCUPON_Validar = -2 --El cupon ingresado no aplica para el tipo y numero de documento ingresado.
						END
					ELSE IF (SELECT DATEDIFF(DD,GETDATE(),ventaCuponVigencia) FROM VENTA WHERE ventaId=@pVENTA_Cupon) < 0
						BEGIN
							SET @vCUPON_Validar = -3 --EL cupon ingresado ya caduco.
						END
				end
			else
				begin
				set @vCUPON_Ejecutar =0
				IF (SELECT ventacuponEstado FROM VENTA_CUPON WHERE ventacuponCupon=@pVENTA_Cupon) = 'S'
					BEGIN
						SET @vCUPON_Validar = -1 --EL cupon ingresado ya fue aplicado.
					END 
				ELSE IF (SELECT DATEDIFF(DD,GETDATE(),ventacuponFechaVigenciaUso) FROM VENTA_CUPON WHERE ventacuponCupon=@pVENTA_Cupon) < 0
					BEGIN
						SET @vCUPON_Validar = -3 --EL cupon ingresado ya caduco.
					END
				ELSE IF @pVENTA_DiasViaje > (SELECT ventacuponRestriccionDias FROM VENTA_CUPON WHERE ventacuponCupon=@pVENTA_Cupon)
					BEGIN
						SET @vCUPON_Validar = -4 -- Este cupon no permitida la duracioón del viaje ingresado.
					END
				ELSE IF (SELECT COUNT(1) FROM VENTA_CUPON WHERE ventacuponCupon=@pVENTA_Cupon AND ventacuponClienteDocumentoTipoId=@pVENTA_ClienteDocumentoTipo AND ventacuponClienteDocumentoNumero=@pVENTA_ClienteDocumentoNumero) = 0
					BEGIN
						SET @vCUPON_Validar = -2 --El cupon ingresado no aplica para el tipo y numero de documento ingresado.
					END
				ELSE IF @pVENTA_AgenciaID <> (SELECT ventacuponAgenciaID FROM VENTA_CUPON WHERE ventacuponCupon=@pVENTA_Cupon)
					BEGIN
						SET @vCUPON_Validar = -5 --Este cupon no esta permitido para esta agencia.
					END
				end
		END

	IF @vCUPON_Validar = 0
		BEGIN
		if @vCUPON_Ejecutar=1
			begin
				SET @vCUPON_Resultado = (SELECT ventaCuponDescuento FROM VENTA WHERE ventaId=@pVENTA_Cupon)
			end
		else
			begin
				SET @vCUPON_Resultado = (SELECT ventacuponDescuentoImporte FROM VENTA_CUPON WHERE ventacuponCupon=@pVENTA_Cupon)
			end
		END
	ELSE
		BEGIN
			SET @vCUPON_Resultado = @vCUPON_Validar
		END
			
    SELECT @vCUPON_Resultado
    
END
