-- Objeto: euroamer_admin_2008.Liquidacion_Obtener_2026
-- Creado en BD: 2026-08-27 02:41:00
-- Modificado en BD: 2026-08-27 02:41:00
-- Extraído: 2026-09-07 08:27:16 UTC
-- Referenciado por el backend .NET: SI
-- Parámetros:
--   @pORIGEN varchar (IN)
--   @pVENTA_FechaIngresoInicio date (IN)
--   @pVENTA_FechaIngresoFin date (IN)
--   @pVENTA_Id int (IN)
--   @pVENTA_UsuarioId int (IN)
--   @pVENTA_EstadoId varchar (IN)
--   @pVENTA_SituacionId varchar (IN)
--   @pVENTA_AgenciaId int (IN)
--   @pVENTA_AgenciaUsuarioId int (IN)
--   @pVENTA_ClienteNombres varchar (IN)
--   @pVENTA_ClienteApellidos varchar (IN)
--   @pVENTA_PaisId int (IN)
--   @pVENTA_CodigoExterno varchar (IN)
--   @pAgenciaPromotorId int (IN)
--   @pAgenciaUbigeoId int (IN)
--   @pLiquidacionPendiente int (IN)
--   @pEjecutivoCobradorId int (IN)

CREATE PROCEDURE [euroamer_admin_2008].[Liquidacion_Obtener_2026]
	@pORIGEN VARCHAR(1),
	@pVENTA_FechaIngresoInicio DATE = '',
	@pVENTA_FechaIngresoFin DATE = '',
	@pVENTA_Id INT = 0,
	@pVENTA_UsuarioId INT = 0,
	@pVENTA_EstadoId VARCHAR(1) = '',
	@pVENTA_SituacionId VARCHAR(1) = 'P',
	@pVENTA_AgenciaId INT = 0,
	@pVENTA_AgenciaUsuarioId INT = 0,
	@pVENTA_ClienteNombres VARCHAR(50) = '',
	@pVENTA_ClienteApellidos VARCHAR(50) = '',
	@pVENTA_PaisId INT = 0,
	@pVENTA_CodigoExterno VARCHAR(50) = '',
	@pAgenciaPromotorId INT = 0,
	@pAgenciaUbigeoId INT = 0,
    @pLiquidacionPendiente INT = 0,
    @pEjecutivoCobradorId INT = 0
AS
BEGIN
	--exec Liquidacion_Obtener3 'U','20240701','20250722',0,1,'V','P',0,0,'','',1,'',0,0

	SET NOCOUNT ON;
	DECLARE @vPERFIL_ID INT
	SET @vPERFIL_ID = (SELECT euroamer_admin_2008.Usuario_RecuperarPerfil(@pORIGEN, @pVENTA_UsuarioId))

	DECLARE @vOPCION_1 INT
	DECLARE @vOPCION_2 INT
	DECLARE @vOPCION_3 INT
	DECLARE @vOPCION_4 INT
	DECLARE @vOPCION_5 INT

	SET @vOPCION_1 = 0
	SET @vOPCION_2 = 0
	SET @vOPCION_3 = 0
	SET @vOPCION_4 = 0
	SET @vOPCION_5 = 0

	IF (@pORIGEN = 'N' AND @vPERFIL_ID = 5)
		SET @vOPCION_1 = 1
	ELSE IF (@pORIGEN = 'N' AND @vPERFIL_ID = 4)
		SET @vOPCION_2 = 1
	ELSE IF (@pORIGEN = 'A' AND @vPERFIL_ID = 2) OR (@pORIGEN = 'N' AND @vPERFIL_ID = 3)
		SET @vOPCION_3 = 1
	ELSE IF (@pORIGEN = 'U' AND @vPERFIL_ID = 6)
		SET @vOPCION_4 = 1
	ELSE IF (@vPERFIL_ID = isnull((select valorTipoId from  valores_tipo where valorTipoColumnaTabla='FiltroPerfilPais' and valorTipoActivo=1 and valorTipoId=@vPERFIL_ID),-1))
		SET @vOPCION_5 = 1


	IF @vOPCION_1 = 0 and @vOPCION_2 = 0 and @vOPCION_3 = 0 and @vOPCION_4 = 0 and @vOPCION_5=0
	begin
	SELECT	 ventaId,
			ventaUsuarioAgenciaId,
			euroamer_admin_2008.Usuario_RecuperarNombre2(ventaUsuarioOrigen, ventaUsuarioAgenciaId,ventaCreadoUsuarioId) as ventaUsuarioAgenciaNombre,
			ventaFechaVigenciaInicio,
			ventaFechaVigenciaFin,
			ventaNumeroDias,
			ventaDestino,
			ventaProductoId,
			productoNombre as ventaProductoNombre,
			CASE  WHEN ventaEstadoId = 'A'  THEN 0  ELSE ventaProductoImporte END as ventaProductoImporte,
			ventaClienteDocumentoTipoId,
			(v1.valorTipoNombre) as ventaClienteDocumentoTipoNombre,
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
			ventaImporteVenta as ventaImporteVenta,
			ventaEstadoId,
			(v2.valorTipoNombre) as ventaEstadoNombre,
			ventaSituacionId,
			(v3.valorTipoNombre) as ventaSituacionNombre,
			ventaCreadoFecha,
			euroamer_admin_2008.Usuario_RecuperarNombreVenta(ventaId) as ventaCreadoUsuarioNombre,
			(euroamer_admin_2008.Usuario_RecuperarNombrexID(ag.agenciaPromotorId)) as ventaPromotorNombre,
			ventaCounter,
			(ag.agenciaDireccion) as UsuarioAgenciaDireccion,
            (ag.agenciaEmail) as UsuarioAgenciaCorreo,
			productoEdadMinima as ventaProductoEdadMinima,
			productoEdadMaxima as ventaProductoEdadMaxima,
			(ag.agenciaComision) as ventaAgenciaComision,
			(ag.agenciaRUC) as ventaAgenciaRUC,
			(ag.agenciaIdExterno) as ventaAgenciaIdExterno,
			(paisImpuesto) as ventaPaisImpuesto,
			null cobranzaComision,
			null cobranzaIncentivo,
			null cobranzaPagoFecha,
			(select top 1 c.cobranzaDocumentoTipoId + '-' + c.cobranzaDocumentoSerie + '-' + cobranzaDocumentoCorrelativo
            from COBRANZA c where c.cobranzaCodigoLiquidacion = v.ventaCodigoLiquidacion and cobranzaActivo=1) cobranzaDocumento,
            ventaIncentivoImporte, ventaCodigoExterno,ventaObservacion,
            agenciaPromotorId,
            agenciaUbigeoId,
			upper(pa.paisNombre) ventaPaisNombre,
			v.ventaComisionImporte,  v.ventaIncentivoImporte, v.ventaPublicidadImporte,
			v.ventaDescuentoImporte,v.ventaCodigoLiquidacion,
			v.ventaFormulaLiquidacion,
			euroamer_admin_2008.ValorTipo_RecuperarNombre('formulaLiquidacion',v.ventaFormulaLiquidacion) ventaFormulaLiquidacionNombre,
			PrecioEditadoManual AS ventaPrecioEditadoManual
	FROM	VENTA v, PRODUCTO p, AGENCIA ag, PAIS pa, VALORES_TIPO v1, VALORES_TIPO v2, VALORES_TIPO v3
	WHERE	v.ventaProductoId = p.productoId AND
	        ag.agenciaId = v.ventaUsuarioAgenciaId AND
			pa.paisId = ag.agenciaPaisId AND
			v1.valorTipoColumnaTabla='ventaClienteDocumentoTipoId'	AND v1.valorTipoId=ventaClienteDocumentoTipoId AND	v1.valorTipoActivo = 1 AND
			v2.valorTipoColumnaTabla='ventaEstadoId'	AND v2.valorTipoId=ventaEstadoId AND	v2.valorTipoActivo = 1 AND
			v3.valorTipoColumnaTabla='ventaSituacionId'	AND v3.valorTipoId=ventaSituacionId AND	v3.valorTipoActivo = 1 AND
			(@pVENTA_FechaIngresoInicio = '1900-01-01' OR CAST(ventaCreadoFecha AS DATE) BETWEEN @pVENTA_FechaIngresoInicio AND @pVENTA_FechaIngresoFin) AND
			(@pVENTA_Id = 0 OR ventaId = @pVENTA_Id) AND
			(@pVENTA_EstadoId = '' OR ventaEstadoId = @pVENTA_EstadoId) AND
			(@pVENTA_SituacionId = '' OR ventaSituacionId = @pVENTA_SituacionId) AND
			(@pVENTA_AgenciaId = 0 OR (ventaUsuarioAgenciaId = @pVENTA_AgenciaId)) AND
			(@pVENTA_PaisId=0 OR agenciaPaisId = @pVENTA_PaisId) AND
			(@pVENTA_AgenciaUsuarioId = 0 OR ventaCreadoUsuarioId = @pVENTA_AgenciaUsuarioId) AND
			(@pVENTA_ClienteNombres = '' OR (UPPER(ventaClienteNombres) LIKE '%' + UPPER(@pVENTA_ClienteNombres) + '%')) AND
			(@pVENTA_CodigoExterno = '' OR UPPER(ventaCodigoExterno) = UPPER(@pVENTA_CodigoExterno)) AND
			(@pVENTA_ClienteApellidos = '' OR (UPPER(ventaClienteApellidos) LIKE '%' + UPPER(@pVENTA_ClienteApellidos) + '%')) AND
			(@pAgenciaPromotorId = 0 OR agenciaPromotorId = @pAgenciaPromotorId) AND
			(@pAgenciaUbigeoId = 0 OR agenciaUbigeoId = @pAgenciaUbigeoId) AND
	        (@pLiquidacionPendiente = 0 OR v.ventaCodigoLiquidacion is null) AND
	        (@pEjecutivoCobradorId = 0 OR ag.agenciaEjecutivoCobrador = @pEjecutivoCobradorId)
			ORDER BY ventaUsuarioAgenciaNombre ASC
	end
	else
	begin
	SELECT	 ventaId,
			ventaUsuarioAgenciaId,
			euroamer_admin_2008.Usuario_RecuperarNombre2(ventaUsuarioOrigen, ventaUsuarioAgenciaId,ventaCreadoUsuarioId) as ventaUsuarioAgenciaNombre,
			ventaFechaVigenciaInicio,
			ventaFechaVigenciaFin,
			ventaNumeroDias,
			ventaDestino,
			ventaProductoId,
			productoNombre as ventaProductoNombre,
			CASE  WHEN ventaEstadoId = 'A'  THEN 0  ELSE ventaProductoImporte END as ventaProductoImporte,
			ventaClienteDocumentoTipoId,
			(v1.valorTipoNombre) as ventaClienteDocumentoTipoNombre,
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
			ventaProductoImporte as ventaImporteVenta,
			ventaEstadoId,
			(v2.valorTipoNombre) as ventaEstadoNombre,
			ventaSituacionId,
			(v3.valorTipoNombre) as ventaSituacionNombre,
			ventaCreadoFecha,
			euroamer_admin_2008.Usuario_RecuperarNombre(ventaUsuarioOrigen, ventaCreadoUsuarioId) as ventaCreadoUsuarioNombre,
			(euroamer_admin_2008.Usuario_RecuperarNombrexID(ag.agenciaPromotorId)) as ventaPromotorNombre,
			ventaCounter,
			(ag.agenciaDireccion) as UsuarioAgenciaDireccion,
            (ag.agenciaEmail) as UsuarioAgenciaCorreo,
			productoEdadMinima as ventaProductoEdadMinima,
			productoEdadMaxima as ventaProductoEdadMaxima,
			(ag.agenciaComision) as ventaAgenciaComision,
			(ag.agenciaRUC) as ventaAgenciaRUC,
			(ag.agenciaIdExterno) as ventaAgenciaIdExterno,
			(paisImpuesto) as ventaPaisImpuesto,
			null cobranzaComision,
			null cobranzaIncentivo,
			null cobranzaPagoFecha,
			(select top 1 c.cobranzaDocumentoTipoId + '-' + c.cobranzaDocumentoSerie + '-' + cobranzaDocumentoCorrelativo
            from COBRANZA c, COBRANZA_DETALLE cd where c.cobranzaId = cd.cobranzaId and cd.cobranzadetalleVentaId=v.ventaId) cobranzaDocumento,
            ventaIncentivoImporte, ventaCodigoExterno,ventaObservacion,
            agenciaPromotorId,
            agenciaUbigeoId,
			v.ventaComisionImporte,  v.ventaIncentivoImporte, v.ventaPublicidadImporte,v.ventaDescuentoImporte,v.ventaCodigoLiquidacion
	FROM	VENTA v, PRODUCTO p, AGENCIA ag, PAIS pa, VALORES_TIPO v1, VALORES_TIPO v2, VALORES_TIPO v3
	WHERE	v.ventaProductoId = p.productoId AND
	        ag.agenciaId = v.ventaUsuarioAgenciaId AND
			pa.paisId = ag.agenciaPaisId AND
			v1.valorTipoColumnaTabla='ventaClienteDocumentoTipoId'	AND v1.valorTipoId=ventaClienteDocumentoTipoId AND	v1.valorTipoActivo = 1 AND
			v2.valorTipoColumnaTabla='ventaEstadoId'	AND v2.valorTipoId=ventaEstadoId AND	v2.valorTipoActivo = 1 AND
			v3.valorTipoColumnaTabla='ventaSituacionId'	AND v3.valorTipoId=ventaSituacionId AND	v3.valorTipoActivo = 1 AND
			(@pVENTA_FechaIngresoInicio = '1900-01-01' OR CAST(ventaCreadoFecha AS DATE) BETWEEN @pVENTA_FechaIngresoInicio AND @pVENTA_FechaIngresoFin) AND
			(@pVENTA_Id = 0 OR ventaId = @pVENTA_Id) AND
			(@vOPCION_1 = 0 OR ventaCreadoUsuarioId = @pVENTA_UsuarioId) AND
			(@vOPCION_2 = 0 OR ventaCreadoUsuarioId IN (SELECT agenciausuarioId FROM AGENCIA_USUARIO WHERE agenciausuarioSupervisorId = @pVENTA_UsuarioId OR agenciausuarioId = @pVENTA_UsuarioId AND agenciausuarioActivo = 1)) AND
			(@vOPCION_3 = 0 OR ventaUsuarioAgenciaId = @pVENTA_UsuarioId) AND
			(@vOPCION_4 = 0 OR ventaUsuarioAgenciaId IN (SELECT agenciaId FROM AGENCIA WHERE agenciaPromotorId = @pVENTA_UsuarioId AND agenciaActivo = 1)) AND
			(@vOPCION_5 = 0 OR ventaUsuarioAgenciaId in (select agenciaId from AGENCIA, USUARIO where agenciaPaisId = UsuarioPaisId and usuarioId=@pVENTA_UsuarioId)) AND
			(@pVENTA_EstadoId = '' OR ventaEstadoId = @pVENTA_EstadoId) AND
			(@pVENTA_SituacionId = '' OR ventaSituacionId = @pVENTA_SituacionId) AND
			(@pVENTA_AgenciaId = 0 OR (ventaUsuarioAgenciaId = @pVENTA_AgenciaId)) AND
			(@pVENTA_PaisId=0 OR agenciaPaisId = @pVENTA_PaisId) AND
			(@pVENTA_AgenciaUsuarioId = 0 OR ventaCreadoUsuarioId = @pVENTA_AgenciaUsuarioId) AND
			(@pVENTA_ClienteNombres = '' OR (UPPER(ventaClienteNombres) LIKE '%' + UPPER(@pVENTA_ClienteNombres) + '%')) AND
			(@pVENTA_CodigoExterno = '' OR UPPER(ventaCodigoExterno) = UPPER(@pVENTA_CodigoExterno)) AND
			(@pVENTA_ClienteApellidos = '' OR (UPPER(ventaClienteApellidos) LIKE '%' + UPPER(@pVENTA_ClienteApellidos) + '%')) AND
			(@pAgenciaPromotorId = 0 OR agenciaPromotorId = @pAgenciaPromotorId) AND
			(@pAgenciaUbigeoId = 0 OR agenciaUbigeoId = @pAgenciaUbigeoId) AND
	        (@pLiquidacionPendiente = 0 OR v.ventaCodigoLiquidacion is null) AND
	        (@pEjecutivoCobradorId = 0 OR ag.agenciaEjecutivoCobrador = @pEjecutivoCobradorId)
			ORDER BY ventaUsuarioAgenciaNombre ASC
			end

END;
