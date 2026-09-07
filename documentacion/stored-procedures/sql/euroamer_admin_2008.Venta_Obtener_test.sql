-- Objeto: euroamer_admin_2008.Venta_Obtener_test
-- Creado en BD: 2015-05-19 08:58:59
-- Modificado en BD: 2015-09-22 14:51:05
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

CREATE PROCEDURE [Venta_Obtener_test]
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
	@pVENTA_PaisId INT = 0
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
	

	SELECT	ventaId, 
			ventaUsuarioAgenciaId, 
			euroamer_admin_2008.Usuario_RecuperarNombre2(ventaUsuarioOrigen, ventaUsuarioAgenciaId,ventaCreadoUsuarioId) as ventaUsuarioAgenciaNombre,
			ventaFechaVigenciaInicio, 
			ventaFechaVigenciaFin, 
			ventaNumeroDias, 
			ventaDestino, 
			ventaProductoId, 
			productoNombre as ventaProductoNombre, --ISNULL((SELECT productoNombre FROM PRODUCTO WHERE productoId=ventaProductoId),'') as ventaProductoNombre, 
			ventaProductoImporte, 
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
			ventaImporteVenta, 
			ventaEstadoId,
			euroamer_admin_2008.ValorTipo_RecuperarNombre('ventaEstadoId', ventaEstadoId) as ventaEstadoNombre,
			ventaSituacionId,
			euroamer_admin_2008.ValorTipo_RecuperarNombre('ventaSituacionId', ventaSituacionId) as ventaSituacionNombre,
			ventaCreadoFecha, 
			euroamer_admin_2008.Usuario_RecuperarNombre(ventaUsuarioOrigen, ventaCreadoUsuarioId) as ventaCreadoUsuarioNombre,
			(select euroamer_admin_2008.Usuario_RecuperarNombrexID(agenciaPromotorId) from AGENCIA where ventaUsuarioAgenciaId = agenciaId ) as ventaPromotorNombre,
			ventaCounter,			
			(SELECT agenciaDireccion FROM AGENCIA WHERE agenciaId = ventaUsuarioAgenciaId) as UsuarioAgenciaDireccion,
            (SELECT agenciaEmail FROM AGENCIA WHERE agenciaId = ventaUsuarioAgenciaId) as UsuarioAgenciaCorreo,
			productoEdadMinima as ventaProductoEdadMinima, 
			productoEdadMaxima as ventaProductoEdadMaxima,
			(SELECT agenciaComision FROM AGENCIA WHERE agenciaId=v.ventaUsuarioAgenciaId) as ventaAgenciaComision,
			(SELECT agenciaRUC FROM AGENCIA WHERE agenciaId=v.ventaUsuarioAgenciaId) as ventaAgenciaRUC,
			(SELECT agenciaIdExterno FROM AGENCIA WHERE agenciaId=v.ventaUsuarioAgenciaId) as ventaAgenciaIdExterno,
			(SELECT paisImpuesto FROM PAIS WHERE paisId = (SELECT agenciaPaisId FROM AGENCIA WHERE agenciaId=v.ventaUsuarioAgenciaId)) as ventaPaisImpuesto
	FROM	VENTA v, PRODUCTO p
	WHERE	v.ventaProductoId = p.productoId AND 
			(@pVENTA_FechaIngresoInicio = '1900-01-01' OR 
			 CAST(ventaCreadoFecha AS DATE) BETWEEN @pVENTA_FechaIngresoInicio AND @pVENTA_FechaIngresoFin) AND
			(@pVENTA_Id = 0 OR ventaId = @pVENTA_Id) AND			
			(@pVENTA_EstadoId = '' OR ventaEstadoId = @pVENTA_EstadoId) AND
			(@pVENTA_SituacionId = '' OR ventaSituacionId = @pVENTA_SituacionId) AND 
			(@pVENTA_AgenciaId = 0 OR (ventaUsuarioAgenciaId = @pVENTA_AgenciaId) )AND			
			(@pVENTA_AgenciaUsuarioId = 0 OR ventaCreadoUsuarioId = @pVENTA_AgenciaUsuarioId) AND
			(@pVENTA_ClienteNombres = '' OR (UPPER(ventaClienteNombres) LIKE '%' + UPPER(@pVENTA_ClienteNombres) + '%')) AND
			(@pVENTA_ClienteApellidos = '' OR (UPPER(ventaClienteApellidos) LIKE '%' + UPPER(@pVENTA_ClienteApellidos) + '%')) AND
			(@pVENTA_PaisId = 0 OR ventaUsuarioAgenciaId IN (SELECT AGENCIAID FROM AGENCIA A WHERE v.ventaUsuarioAgenciaId = a.AGENCIAID AND AGENCIAPAISID=@pVENTA_PaisId))
	ORDER BY ventaCreadoFecha DESC

END
