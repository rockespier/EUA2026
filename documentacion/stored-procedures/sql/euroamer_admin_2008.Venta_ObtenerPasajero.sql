-- Objeto: euroamer_admin_2008.Venta_ObtenerPasajero
-- Creado en BD: 2021-12-15 06:40:24
-- Modificado en BD: 2021-12-15 10:33:22
-- Extraído: 2026-09-07 08:27:17 UTC
-- Referenciado por el backend .NET: NO (revisar si sigue en uso)
-- Parámetros:
--   @pVENTA_ClienteDocumentoTipoId varchar (IN)
--   @pVENTA_ClienteDocumentoNumero varchar (IN)

CREATE PROCEDURE [euroamer_admin_2008].[Venta_ObtenerPasajero]
	@pVENTA_ClienteDocumentoTipoId VARCHAR(3),
	@pVENTA_ClienteDocumentoNumero VARCHAR(50)
AS
BEGIN
	
	SET NOCOUNT ON;


	select 		PasajeroDocumentoTipoId,
				(SELECT valorTipoNombre FROM VALORES_TIPO WHERE valorTipoColumnaTabla='ventaClienteDocumentoTipoId' AND valorTipoId=PasajeroDocumentoTipoId) as ventaClienteDocumentoTipoNombre, 
				PasajeroDocumentoNumero,
				PasajeroNombres,
				PasajeroApellidos,
				PasajeroFechaNacimiento,
				PasajeroEdad,
				PasajeroEmail,
				PasajeroDireccion,
				PasajeroTelefono,
				PasajeroDistrito ventaClienteDistrito,
				PasajeroCiudad,				
				PasajeroPais ventaClientePais,
				ContactoNombres, 
				ContactoDireccion, 
				ContactoEmail, 
				ContactoTelefono, 
				ContactoDistrito, 
				ContactoPais,
				PasajeroNacionalidad
			from PASAJERO			
			where PasajeroDocumentoTipoId = @pVENTA_ClienteDocumentoTipoId
			and PasajeroDocumentoNumero = @pVENTA_ClienteDocumentoNumero		

END
