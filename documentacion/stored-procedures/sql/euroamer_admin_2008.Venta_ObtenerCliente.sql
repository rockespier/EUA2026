-- Objeto: euroamer_admin_2008.Venta_ObtenerCliente
-- Creado en BD: 2015-08-17 19:27:43
-- Modificado en BD: 2022-01-29 05:46:34
-- Extraído: 2026-09-07 08:27:17 UTC
-- Referenciado por el backend .NET: SI
-- Parámetros:
--   @pVENTA_ClienteDocumentoTipoId varchar (IN)
--   @pVENTA_ClienteDocumentoNumero varchar (IN)

CREATE PROCEDURE [euroamer_admin_2008].[Venta_ObtenerCliente]
	@pVENTA_ClienteDocumentoTipoId VARCHAR(3),
	@pVENTA_ClienteDocumentoNumero VARCHAR(50)
AS
BEGIN
	
	SET NOCOUNT ON;
	
	IF (select count(*) FROM PASAJERO WHERE PasajeroDocumentoTipoId = @pVENTA_ClienteDocumentoTipoId AND PasajeroDocumentoNumero = @pVENTA_ClienteDocumentoNumero) > 0
	--IF (select count(*) FROM VENTA WHERE ventaClienteDocumentoTipoId = @pVENTA_ClienteDocumentoTipoId AND ventaClienteDocumentoNumero = @pVENTA_ClienteDocumentoNumero) > 0
	BEGIN		
		SELECT top 1 PasajeroDocumentoTipoId ventaClienteDocumentoTipoId, --0
				(SELECT valorTipoNombre FROM VALORES_TIPO WHERE valorTipoColumnaTabla='ventaClienteDocumentoTipoId' AND valorTipoId=PasajeroDocumentoTipoId) as ventaclienteDocumentoTipoNombre, 
					PasajeroDocumentoNumero ventaClienteDocumentoNumero, --2
					PasajeroNombres ventaClienteNombres, --3
					PasajeroApellidos ventaClienteApellidos, --4
					PasajeroFechaNacimiento ventaClienteFechaNacimiento, --5
					floor((cast(convert(varchar(8),getdate(),112) as int)-cast(convert(varchar(8),PasajeroFechaNacimiento,112) as int) ) / 10000) as edad,
					PasajeroEmail ventaClienteEmail, --7
					PasajeroDireccion ventaClienteDireccion, --8
					PasajeroTelefono ventaClienteTelefono, --9
					PasajeroDistrito ventaClienteDistrito, --10
					PasajeroCiudad ventaClienteCiudad,	--11
					PasajeroPais ventaClientePais, --12				
					ContactoNombres ventaContactoNombres, --13
					ContactoDireccion ventaContactoDireccion, --14
					ContactoEmail ventaContactoEmail, --15
					ContactoTelefono ventaContactoTelefono, --16
					ContactoDistrito ventaContactoDistrito, --17
					ContactoPais ventaContactoPais, --18
					pasajeroFechaRegistro ventaCreadoFecha,
					pasajeroNacionalidad,
					ContactoProducto, --21
					ContactoAgencia, --22
					fechasalida, --23
					fecharegreso, --24
					dia --25
				from PASAJERO			
				where (PasajeroDocumentoTipoId = @pVENTA_ClienteDocumentoTipoId)
				and (PasajeroDocumentoNumero = @pVENTA_ClienteDocumentoNumero)
			ORDER BY pasajeroFechaRegistro DESC
	END
	ELSE
	begin
		SELECT top 1 ventaClienteDocumentoTipoId, --0
				(SELECT valorTipoNombre FROM VALORES_TIPO WHERE valorTipoColumnaTabla='ventaClienteDocumentoTipoId' AND valorTipoId=ventaClienteDocumentoTipoId) as ventaClienteDocumentoTipoNombre, --1
				ventaClienteDocumentoNumero, --2
				ventaClienteNombres, --3
				ventaClienteApellidos, --4
				ventaClienteFechaNacimiento, 				 --5
				floor((cast(convert(varchar(8),getdate(),112) as int)-cast(convert(varchar(8),ventaClienteFechaNacimiento,112) as int) ) / 10000) as edad,--6
				ventaClienteEmail, --7
				ventaClienteDireccion,--8 
				ventaClienteTelefono, --9
				ventaClienteDistrito, --10
				ventaClienteCiudad, --11
				ventaClientePais,--12
				ventaContactoNombres,--13 
				ventaContactoDireccion, --14
				ventaContactoEmail, --15
				ventaContactoTelefono, --16
				ventaContactoDistrito, --17
				ventaContactoPais,--18
				ventaCreadoFecha,--19
				'' Nacionalidad,--20
				'' ContactoProducto, --21
				''	ContactoAgencia, --22
				''	fechasalida, --23
				''	fecharegreso, --24
				0	dia --25
		FROM	VENTA
		WHERE	ventaClienteDocumentoTipoId = @pVENTA_ClienteDocumentoTipoId AND ventaClienteDocumentoNumero = @pVENTA_ClienteDocumentoNumero
		order by ventaCreadoFecha desc
		
	End

END
