-- Objeto: euroamer_admin_2008.Venta_Obtener
-- Creado en BD: 2026-04-13 04:40:56
-- Modificado en BD: 2026-04-13 04:40:56
-- Extraído: 2026-09-07 08:27:17 UTC
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
--   @pVENTA_ClienteDocumentoTipoId varchar (IN)
--   @pVENTA_ClienteDocumentoNumero varchar (IN)

CREATE PROCEDURE [Venta_Obtener]
	@pORIGEN VARCHAR(1),
	@pVENTA_FechaIngresoInicio DATE = '',
	@pVENTA_FechaIngresoFin DATE = '',
	@pVENTA_Id INT = 0,
	@pVENTA_UsuarioId INT = 0,
	@pVENTA_EstadoId VARCHAR(1) = '',
	@pVENTA_SituacionId VARCHAR(1) = '',
	@pVENTA_AgenciaId INT = 0,
	@pVENTA_AgenciaUsuarioId INT = 0,
	@pVENTA_ClienteNombres VARCHAR(50) = '',
	@pVENTA_ClienteApellidos VARCHAR(50) = '',
	@pVENTA_PaisId INT = 0,
	@pVENTA_CodigoExterno VARCHAR(50) = '',
	@pVENTA_ClienteDocumentoTipoId VARCHAR(3) = '',
	@pVENTA_ClienteDocumentoNumero VARCHAR(50) = ''
AS
BEGIN
	
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
	
	DECLARE @strSQL VARCHAR(MAX)

	--SET TRANSACTION ISOLATION LEVEL READ UNCOMMITTED
	set @strSQL = 'SELECT	ventaId
	FROM	VENTA v WITH(HOLDLOCK), PRODUCTO p, AGENCIA ag, PAIS pa
	WHERE	v.ventaProductoId = p.productoId AND 
	        ag.agenciaId = v.ventaUsuarioAgenciaId AND
			pa.paisId = ag.agenciaPaisId AND ( ' + CONVERT(VARCHAR,@pVENTA_FechaIngresoInicio) +' = ''1900-01-01'' OR CAST(ventaCreadoFecha AS DATE) BETWEEN ' + CONVERT(VARCHAR,@pVENTA_FechaIngresoInicio) + ' AND '+ CONVERT(VARCHAR,@pVENTA_FechaIngresoFin) + ') AND 
			(' + CONVERT(VARCHAR,@pVENTA_Id) + '= 0 OR ventaId = ' + CONVERT(VARCHAR,@pVENTA_Id) +') AND
			(' + CONVERT(VARCHAR,@vOPCION_1) + '= 0 OR ventaCreadoUsuarioId = ' + CONVERT(VARCHAR,@pVENTA_UsuarioId) + ') AND
			(' + CONVERT(VARCHAR,@vOPCION_2) + '= 0 OR ventaCreadoUsuarioId IN (SELECT agenciausuarioId FROM AGENCIA_USUARIO WHERE agenciausuarioSupervisorId = ' + CONVERT(VARCHAR,@pVENTA_UsuarioId) + 'OR agenciausuarioId = ' + CONVERT(VARCHAR,@pVENTA_UsuarioId) 
			+' AND agenciausuarioActivo = 1)) AND
			(' + CONVERT(VARCHAR,@vOPCION_3) + '= 0 OR ventaUsuarioAgenciaId = '+  CONVERT(VARCHAR,@pVENTA_UsuarioId) + ') AND
			(' + CONVERT(VARCHAR,@vOPCION_4) + '= 0 OR ventaUsuarioAgenciaId IN (SELECT agenciaId FROM AGENCIA WHERE agenciaPromotorId =' +  CONVERT(VARCHAR,@pVENTA_UsuarioId) +' AND agenciaActivo = 1)) AND
			(' + CONVERT(VARCHAR,@vOPCION_5) + '= 0 OR ventaUsuarioAgenciaId in (select agenciaId from AGENCIA, USUARIO where agenciaPaisId = UsuarioPaisId and usuarioId=' + CONVERT(VARCHAR,@pVENTA_UsuarioId) + ')) AND
			(' + CONVERT(VARCHAR,@pVENTA_EstadoId) + '= '''' OR ventaEstadoId = '+ CONVERT(VARCHAR,@pVENTA_EstadoId) + ') AND
			(' + CONVERT(VARCHAR,@pVENTA_SituacionId) +'= '''' OR ventaSituacionId =' + CONVERT(VARCHAR,@pVENTA_SituacionId)+ ') AND 
			(' + CONVERT(VARCHAR,@pVENTA_AgenciaId) +'= 0 OR (ventaUsuarioAgenciaId =' + CONVERT(VARCHAR,@pVENTA_AgenciaId) + ')) AND
			(' + CONVERT(VARCHAR,@pVENTA_PaisId) + '=0 OR agenciaPaisId = '+ CONVERT(VARCHAR,@pVENTA_PaisId) + ') AND			
			(' + CONVERT(VARCHAR,@pVENTA_AgenciaUsuarioId) +' = 0 OR ventaCreadoUsuarioId = ' + CONVERT(VARCHAR,@pVENTA_AgenciaUsuarioId) + ') AND
			(' + CONVERT(VARCHAR,@pVENTA_ClienteNombres) +'= '''' OR (UPPER(ventaClienteNombres) LIKE ''%'' + UPPER('+@pVENTA_ClienteNombres+') + ''%'')) AND
			(' + CONVERT(VARCHAR,@pVENTA_CodigoExterno) +'= '''' OR UPPER(ventaCodigoExterno) = UPPER('+@pVENTA_CodigoExterno+')) AND
			(' + @pVENTA_ClienteApellidos +'= '''' OR (UPPER(ventaClienteApellidos) LIKE ''%'' + UPPER('+@pVENTA_ClienteApellidos+') + ''%'')) ORDER BY ventaCreadoFecha DESC'

			--PRINT @strSQL

	SELECT	ventaId, 
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
			CASE  WHEN ventaEstadoId = 'A'  THEN 0  ELSE ventaImporteVenta END as ventaImporteVenta, 
			ventaEstadoId,
			euroamer_admin_2008.ValorTipo_RecuperarNombre('ventaEstadoId', ventaEstadoId) as ventaEstadoNombre,
			ventaSituacionId,
			euroamer_admin_2008.ValorTipo_RecuperarNombre('ventaSituacionId', ventaSituacionId) as ventaSituacionNombre,
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
			(select top 1 cobranzaComision from cobranza a, cobranza_detalle b where b.cobranzadetalleVentaId=ventaId and a.cobranzaId = b.cobranzaId order by cobranzamodificadofecha desc)  cobranzaComision,
			(select top 1 cobranzaIncentivo from cobranza a, cobranza_detalle b where b.cobranzadetalleVentaId=ventaId and a.cobranzaId = b.cobranzaId order by cobranzamodificadofecha desc) cobranzaIncentivo, 			
			(select top 1 CONVERT(VARCHAR(10), cobranzaPagoFecha, 103) from cobranza a, cobranza_detalle b where b.cobranzadetalleVentaId=ventaId and a.cobranzaId = b.cobranzaId order by cobranzamodificadofecha desc) ventaCobranzaPagoFechaString,			
			(select top 1 cobranzaDocumentoTipoId + ' -' +  cobranzaDocumentoSerie +'-' +	cobranzaDocumentoCorrelativo from cobranza a, cobranza_detalle b 
			where b.cobranzadetalleVentaId=ventaId and a.cobranzaId = b.cobranzaId  order by cobranzamodificadofecha desc) cobranzaDocumento,
            ventaIncentivoImporte, ventaCodigoExterno,ventaObservacion,
            v.ventaNacionalidad
	FROM	VENTA v WITH(HOLDLOCK), PRODUCTO p, AGENCIA ag, PAIS pa
	WHERE	v.ventaProductoId = p.productoId AND 
	        ag.agenciaId = v.ventaUsuarioAgenciaId AND
			pa.paisId = ag.agenciaPaisId AND
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
			(@pVENTA_ClienteApellidos = '' OR (UPPER(ventaClienteApellidos) LIKE '%' + UPPER(@pVENTA_ClienteApellidos) + '%')) 						
			ORDER BY ventaCreadoFecha DESC

END;
