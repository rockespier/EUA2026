-- Objeto: euroamer_admin_2008.Venta_ObtenerVentasEspecificas
-- Creado en BD: 2013-12-24 08:51:00
-- Modificado en BD: 2026-02-06 07:15:06
-- Extraído: 2026-09-07 08:27:17 UTC
-- Referenciado por el backend .NET: SI
-- Parámetros:
--   @pVENTA_Codigos varchar (IN)
--   @pVENTA_Situacion char (IN)

CREATE PROCEDURE [euroamer_admin_2008].[Venta_ObtenerVentasEspecificas]
	@pVENTA_Codigos VARCHAR(max),
	@pVENTA_Situacion CHAR(1)
AS
BEGIN
	--exec Venta_ObtenerVentasEspecificas '2254707','P'
	SET NOCOUNT ON;

    -- Crear tabla temporal
    CREATE TABLE #Codigos (Codigo VARCHAR(7))
    
    -- Insertar códigos divididos
    INSERT INTO #Codigos (Codigo)
        select item from euroamer_admin_2008.fnSplit2(@pVENTA_Codigos,',')

	DECLARE @vQUERY VARCHAR(5000)

	SET @vQUERY = 'SELECT	ventaId, 
							ventaUsuarioAgenciaId, 
							euroamer_admin_2008.Usuario_RecuperarNombre(''A'', ventaUsuarioAgenciaId) as ventaUsuarioAgenciaNombre,
							ventaFechaVigenciaInicio, 
							ventaFechaVigenciaFin, 
							ventaNumeroDias, 
							ventaDestino, 
							ventaProductoId, 
							ISNULL((SELECT productoNombre FROM PRODUCTO WHERE productoId=ventaProductoId),'''') as ventaProductoNombre, 
							ventaProductoImporte, 
							ventaClienteDocumentoTipoId, 
							(SELECT valorTipoNombre FROM VALORES_TIPO WHERE valorTipoColumnaTabla=''ventaClienteDocumentoTipoId'' AND valorTipoId=ventaClienteDocumentoTipoId) as ventaClienteDocumentoTipoNombre, 
							ventaClienteDocumentoNumero, 
							ventaClienteNombres, 
							ventaClienteApellidos, 
							ventaClienteFechaNacimiento, 
							ventaClienteEdad, 
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
							euroamer_admin_2008.ValorTipo_RecuperarNombre(''ventaEstadoId'', ventaEstadoId) as ventaEstadoNombre,
							ventaSituacionId,
							euroamer_admin_2008.ValorTipo_RecuperarNombre(''ventaSituacionId'', ventaSituacionId) as ventaSituacionNombre,
							ventaCreadoFecha, 
							euroamer_admin_2008.Usuario_RecuperarNombre(ventaUsuarioOrigen, ventaCreadoUsuarioId) as ventaCreadoUsuarioNombre,							
                            (select paisimpuesto from  agencia, pais where ventaUsuarioAgenciaId = agenciaid and agenciaPaisId = paisid) ventaPaisImpuesto,
                            (select paisimpuestoVenta from  agencia, pais where ventaUsuarioAgenciaId = agenciaid and agenciaPaisId = paisid) ventaPaisImpuestoVenta, ' +
	              '(select top 1 tarifaIncentivo from producto_tarifa where tarifaProductoid=ventaProductoId and ventaNumeroDias >= tarifaNumeroDiasMinimo and ventaNumeroDias <= tarifaNumeroDiasMaximo) ventaIncentivoTarifa,' +
	              '(select top 1 tarifaPublicidad from producto_tarifa where tarifaProductoid=ventaProductoId and ventaNumeroDias >= tarifaNumeroDiasMinimo and ventaNumeroDias <= tarifaNumeroDiasMaximo) ventaPublicidadTarifa,' +
	              ' (ventaClienteNombres +'' ''+ ventaClienteApellidos) as ventaClienteApellidoNombre, ' +
	              'ISNULL((select top 1 agenciaProductoDescuentoImporte
                    from AGENCIA_PRODUCTO where agenciaProductoAgenciaID= ventaUsuarioAgenciaId and agenciaProductoProductoID=ventaProductoId
                    and ventaCreadoFecha between agenciaProductoDescuentoVigenciaIni and agenciaProductoDescuentoVigenciaFin),0) ventaDescuentoImporte, ventaCodigoExterno
					FROM	VENTA v INNER JOIN #Codigos c ON v.ventaId = c.Codigo
					WHERE	ventaSituacionId = ''' + @pVENTA_Situacion + '''
					ORDER BY ventaCreadoFecha DESC'
	EXEC(@vQUERY)
END
