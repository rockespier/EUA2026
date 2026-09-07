-- Objeto: euroamer_admin_2008.Pasajero_Listado
-- Creado en BD: 2025-06-24 03:35:50
-- Modificado en BD: 2025-06-24 03:35:50
-- Extraído: 2026-09-07 08:27:16 UTC
-- Referenciado por el backend .NET: SI
-- Parámetros:
--   @pPasajero_DocumentoTipo varchar (IN)
--   @pPasajero_DocumentoNumero varchar (IN)
--   @pFechaIngresoInicio date (IN)
--   @pFechaIngresoFin date (IN)

CREATE PROCEDURE [euroamer_admin_2008].[Pasajero_Listado]
	@pPasajero_DocumentoTipo VARCHAR(3) = '',
	@pPasajero_DocumentoNumero VARCHAR(50) = '',
	@pFechaIngresoInicio DATE = '',
	@pFechaIngresoFin DATE = ''
AS
BEGIN

	SET NOCOUNT ON;
				--Pasajero_Obtener null,null,'20240101','20251201'
	/*IF (select count(*) FROM PASAJERO WHERE PasajeroDocumentoTipoId = @pPasajero_DocumentoTipo AND PasajeroDocumentoNumero = @pPasajero_DocumentoNumero) > 0
    begin*/
			select
			PasajeroDocumentoTipoId, --0
			(SELECT valorTipoNombre FROM VALORES_TIPO WHERE valorTipoColumnaTabla='ventaClienteDocumentoTipoId' AND valorTipoId=PasajeroDocumentoTipoId) as pasajeroDocumentoTipoNombre,
				PasajeroDocumentoNumero, --2
				PasajeroNombres, --3
				PasajeroApellidos, --4
				PasajeroFechaNacimiento, --5
				PasajeroEdad, --6
				PasajeroEmail, --7
				PasajeroDireccion, --8
				PasajeroTelefono, --9
				PasajeroDistrito, --10
				PasajeroCiudad,	--11
				PasajeroPais, --12
				PasajeroNacionalidad, --13
				ContactoNombres, --14
				ContactoDireccion, --15
				ContactoEmail, --16
				ContactoTelefono, --17
				ContactoDistrito, --18
				ContactoPais, --19
				pasajeroFechaRegistro, --20
				isnull(ContactoProducto,'') ContactoProducto,
				ContactoAgencia,
				fechasalida FechaInicio,
				fecharegreso FechaFin,
				dia dias
			from PASAJERO
			where (isnull(@pPasajero_DocumentoTipo,'')='' or PasajeroDocumentoTipoId = @pPasajero_DocumentoTipo)
			and (isnull(@pPasajero_DocumentoNumero,'')='' or PasajeroDocumentoNumero = @pPasajero_DocumentoNumero)
			and (@pFechaIngresoInicio = '1900-01-01' OR CAST(pasajeroFechaRegistro AS DATE) BETWEEN @pFechaIngresoInicio AND @pFechaIngresoFin)
	/*	end
    ELSE
	begin
            SELECT ventaClienteDocumentoTipoId PasajeroDocumentoTipoId, --0
				(SELECT valorTipoNombre
				 FROM VALORES_TIPO WHERE valorTipoColumnaTabla='ventaClienteDocumentoTipoId'
				                     AND valorTipoId=ventaClienteDocumentoTipoId) as pasajeroDocumentoTipoNombre, --1
				ventaClienteDocumentoNumero PasajeroDocumentoNumero, --2
				ventaClienteNombres PasajeroNombres, --3
				ventaClienteApellidos PasajeroApellidos, --4
				ventaClienteFechaNacimiento PasajeroFechaNacimiento, 				 --5
				floor((cast(convert(varchar(8),getdate(),112) as int)-cast(convert(varchar(8),ventaClienteFechaNacimiento,112) as int) ) / 10000) as PasajeroEdad,--6
				ventaClienteEmail PasajeroEmail, --7
				ventaClienteDireccion PasajeroDireccion,--8
				ventaClienteTelefono PasajeroTelefono, --9
				ventaClienteDistrito PasajeroDistrito, --10
				ventaClienteCiudad PasajeroCiudad, --11
				ventaClientePais PasajeroPais,--12
				ventaContactoNombres ContactoNombres,--13
				ventaContactoDireccion ContactoDireccion, --14
				ventaContactoEmail ContactoEmail, --15
				ventaContactoTelefono ContactoTelefono, --16
				ventaContactoDistrito ContactoDistrito, --17
				ventaContactoPais ContactoPais,--18
				ventaCreadoFecha pasajeroFechaRegistro,--19
				'' Nacionalidad,--20
				'' ContactoProducto, --21
				''	ContactoAgencia, --22
				''	FechaInicio, --23
				''	FechaFin, --24
				0	dias --25
		FROM	VENTA
		where (isnull(@pPasajero_DocumentoTipo,'')='' or ventaClienteDocumentoTipoId = @pPasajero_DocumentoTipo)
			and (isnull(@pPasajero_DocumentoNumero,'')='' or ventaClienteDocumentoNumero = @pPasajero_DocumentoNumero)
			and ((@pFechaIngresoInicio = '1900-01-01' ) OR (CAST(ventaCreadoFecha AS DATE) BETWEEN @pFechaIngresoInicio AND @pFechaIngresoFin))
		order by ventaCreadoFecha desc
    end
	*/
END
