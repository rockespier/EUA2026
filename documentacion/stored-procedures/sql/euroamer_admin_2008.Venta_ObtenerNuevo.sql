-- Objeto: euroamer_admin_2008.Venta_ObtenerNuevo
-- Creado en BD: 2019-09-10 13:44:42
-- Modificado en BD: 2025-10-14 02:57:19
-- Extraído: 2026-09-07 08:27:17 UTC
-- Referenciado por el backend .NET: NO (revisar si sigue en uso)
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

CREATE PROCEDURE [euroamer_admin_2008].[Venta_ObtenerNuevo]
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
	--Venta_ObtenerNuevo 'U','20250801','20250826',0,1,'','',0,0,'','',3,'','',''
	SET NOCOUNT ON;
	
	DECLARE @vPERFIL_ID INT
	DECLARE @vEsFiltroPorPais INT = 0

	SET @vPERFIL_ID = (SELECT euroamer_admin_2008.Usuario_RecuperarPerfil(@pORIGEN, @pVENTA_UsuarioId))	

	--SELECT euroamer_admin_2008.Usuario_RecuperarPerfil('U', 184) --7

	DECLARE @vFiltroPaisID INT = 0
		
	select @vFiltroPaisID = UsuarioPaisId from  USUARIO where usuarioid= @pVENTA_UsuarioId;
	--select UsuarioPaisId from  USUARIO where usuarioid= 184;

    --Validar si es un perfil que filtra
	select @vEsFiltroPorPais = count(valortipoid) from VALORES_TIPO where valorTipoColumnaTabla='FILTROPERFILPAIS' and valortipoid=@vPERFIL_ID;
    --select count(valortipoid) from VALORES_TIPO where valorTipoColumnaTabla='FILTROPERFILPAIS' and valortipoid=7;

	if @vEsFiltroPorPais > 0
	    begin
            set @pVENTA_PaisId = @vFiltroPaisID;
        end
	/*else
	    begin
            set @pVENTA_PaisId = 0;
        end
    */
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
		SET @vOPCION_1 = 1 --usuario agencia
	ELSE IF (@pORIGEN = 'N' AND @vPERFIL_ID = 4)
		SET @vOPCION_2 = 1 --supervisor agencia
	ELSE IF (@pORIGEN = 'A' AND @vPERFIL_ID = 2) OR (@pORIGEN = 'N' AND @vPERFIL_ID = 3)
		SET @vOPCION_3 = 1  --agencia
	ELSE IF (@pORIGEN = 'U' AND @vPERFIL_ID = 6) 
		SET @vOPCION_4 = 1 --promotor
	ELSE IF (@vPERFIL_ID = isnull((select valorTipoId from  valores_tipo where valorTipoColumnaTabla='FiltroPerfilPais' and valorTipoActivo=1 and valorTipoId=@vPERFIL_ID),-1))
		SET @vOPCION_5 = 1

	       
			print '@pVENTA_Id:' + CONVERT(VARCHAR,@pVENTA_Id)
			print '@vOPCION_1:' + CONVERT(VARCHAR,@vOPCION_1 )
			print '@vOPCION_2:' + CONVERT(VARCHAR,@vOPCION_2 )
			print '@vOPCION_3:' + CONVERT(VARCHAR,@vOPCION_3 )
			print '@vOPCION_4:' + CONVERT(VARCHAR,@vOPCION_4 )
			print '@vOPCION_5:' + CONVERT(VARCHAR,@vOPCION_5 )
			print '@pVENTA_EstadoId:' + @pVENTA_EstadoId
			print '@pVENTA_SituacionId:' + @pVENTA_SituacionId
			print '@pVENTA_AgenciaId:' + CONVERT(VARCHAR,@pVENTA_AgenciaId)
			print '@pVENTA_PaisId:' + CONVERT(VARCHAR,@pVENTA_PaisId		)
			print '@pVENTA_AgenciaUsuarioId:' + CONVERT(VARCHAR,@pVENTA_AgenciaUsuarioId)
			print '@pVENTA_ClienteNombres:' + @pVENTA_ClienteNombres
			print '@pVENTA_CodigoExterno:' + @pVENTA_CodigoExterno
			print '@pVENTA_ClienteApellidos:' + @pVENTA_ClienteApellidos
	        print '@pVENTA_ClienteDocumentoTipoId:' + @pVENTA_ClienteDocumentoTipoId
	        print '@pVENTA_ClienteDocumentoNumero:' + @pVENTA_ClienteDocumentoNumero


	SELECT	ventaId, 
			ventaUsuarioAgenciaId, 
			euroamer_admin_2008.Usuario_RecuperarNombre2(ventaUsuarioOrigen, ventaUsuarioAgenciaId,ventaCreadoUsuarioId) as ventaUsuarioAgenciaNombre,
			ventaFechaVigenciaInicio, 
			ventaFechaVigenciaFin, 
			ventaNumeroDias, 
			upper(ventaDestino) ventaDestino, 
			ventaProductoId, 
			upper(productoNombre) as ventaProductoNombre, 			
			CASE  WHEN ventaEstadoId = 'A'  THEN 0  ELSE ventaProductoImporte END as ventaProductoImporte, 
			ventaClienteDocumentoTipoId, 
			(SELECT valorTipoNombre FROM VALORES_TIPO WHERE valorTipoColumnaTabla='ventaClienteDocumentoTipoId' AND valorTipoId=ventaClienteDocumentoTipoId) as ventaClienteDocumentoTipoNombre, 
			ventaClienteDocumentoNumero, 
			upper(ventaClienteNombres) ventaClienteNombres, 
			upper(ventaClienteApellidos) ventaClienteApellidos, 
			ventaClienteFechaNacimiento, 
			ventaClienteEdad, 
			upper(ventaClienteEmail) ventaClienteEmail, 
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
			euroamer_admin_2008.Usuario_RecuperarNombreVenta(ventaId) as ventaCreadoUsuarioNombre,
			(euroamer_admin_2008.Usuario_RecuperarNombrexID(ag.agenciaPromotorId)) as ventaPromotorNombre,
			ventaCounter,			
			(ag.agenciaDireccion) as UsuarioAgenciaDireccion,
            (ag.agenciaEmail) as UsuarioAgenciaCorreo,
			productoEdadMinima as ventaProductoEdadMinima, 
			case productoImporteDiaAdicional when 0 then productoEdadMaxima else productoImporteDiaAdicional end  as ventaProductoEdadMaxima,
			(ag.agenciaComision) as ventaAgenciaComision,
			(ag.agenciaRUC) as ventaAgenciaRUC,
			(ag.agenciaIdExterno) as ventaAgenciaIdExterno,			
			(paisImpuesto) as ventaPaisImpuesto,			
			0 as cobranzaComision, 
			0 as cobranzaIncentivo, 
			(select top 1 c.cobranzaPagoFecha 
            from COBRANZA c where c.cobranzaCodigoLiquidacion = v.ventaCodigoLiquidacion and cobranzaActivo=1) as ventaCobranzaPagoFecha, 
			(select top 1 c.cobranzaDocumentoTipoId + '-' + c.cobranzaDocumentoSerie + '-' + cobranzaDocumentoCorrelativo 
            from COBRANZA c where c.cobranzaCodigoLiquidacion = v.ventaCodigoLiquidacion and cobranzaActivo=1) as cobranzaDocumento,
            ventaIncentivoImporte, ventaCodigoExterno,ventaObservacion,
            v.ventaNacionalidad,
			upper(pa.paisNombre) ventaPaisNombre,
			v.ventaComisionImporte ,  v.ventaIncentivoImporte , v.ventaPublicidadImporte,
			v.promocionId ventaPromocionId,
			(select 'DESCUENTO ' + CONVERT(VARCHAR,paisPromocionDescuento) + '%' from PAIS_PROMOCION where paisPromocionId = v.promocionId) ventaPromocionNombre,
			v.ventaPagarLiquidacion
	FROM	VENTA v, PRODUCTO p, AGENCIA ag, PAIS pa
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
			(@pVENTA_ClienteApellidos = '' OR (UPPER(ventaClienteApellidos) LIKE '%' + UPPER(@pVENTA_ClienteApellidos) + '%')) AND
	        (@pVENTA_ClienteDocumentoTipoId = '' OR VENTAClienteDocumentoTipoId = @pVENTA_ClienteDocumentoTipoId) AND
	        (@pVENTA_ClienteDocumentoNumero = '' OR VENTAClienteDocumentoNumero = @pVENTA_ClienteDocumentoNumero)
			ORDER BY ventaUsuarioAgenciaNombre 

END;
