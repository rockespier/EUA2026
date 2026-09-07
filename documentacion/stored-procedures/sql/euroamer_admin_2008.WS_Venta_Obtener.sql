-- Objeto: euroamer_admin_2008.WS_Venta_Obtener
-- Creado en BD: 2016-12-09 20:42:05
-- Modificado en BD: 2016-12-09 20:42:05
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
--   @pVENTA_UsuarioLogueo varchar (IN)
--   @pVENTA_UsuarioClave varchar (IN)


CREATE PROCEDURE [euroamer_admin_2008].[WS_Venta_Obtener]
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
	@pVENTA_UsuarioLogueo VARCHAR(100), -- Se agregó el parámetro usuario logueo
	@pVENTA_UsuarioClave VARCHAR(100)   -- Se agregó el parámetro clave
AS
BEGIN
	
	SET NOCOUNT ON;

CREATE TABLE #TEMPUSUARIO
(
 usuarioId INT,
 usuarioIdExterno INT,
 usuarioNombre VARCHAR(100),
 usuarioEmail VARCHAR(100),
 usuarioPerfilId INT,
 usuarioPerfilNombre VARCHAR(100),
 usuarioCaducado INT,
 usuarioActivo INT,
 usuarioAgenciaId INT,
 usuarioagenciaNombre VARCHAR(100),
 usuarioOrigen VARCHAR(5),
 agenciaPaisId INT,
 agenciaImpuesto DECIMAL(18,5),
 usuarioAgenciaDireccion VARCHAR(1000),
 usuarioAgenciaCorreo VARCHAR(1000),
 paisDocumentoFormato INT
)

INSERT INTO #TEMPUSUARIO(usuarioId, usuarioIdExterno,usuarioNombre,usuarioEmail,
                usuarioPerfilId,usuarioPerfilNombre,usuarioCaducado,
				usuarioActivo,usuarioAgenciaId,usuarioagenciaNombre,
				usuarioOrigen,agenciaPaisId,agenciaImpuesto,usuarioAgenciaDireccion,
				usuarioAgenciaCorreo,paisDocumentoFormato)
exec Usuario_ValidarAcceso @pUSUARIO_Login=@pVENTA_UsuarioLogueo,@pUSUARIO_Password=@pVENTA_UsuarioClave
	
 IF(SELECT COUNT(*) FROM #TEMPUSUARIO)>0
 BEGIN
	DECLARE @vPERFIL_ID INT
	--SET @vPERFIL_ID = (SELECT euroamer_admin_2008.Usuario_RecuperarPerfil(@pORIGEN, @pVENTA_UsuarioId))	
	SET @vPERFIL_ID = (SELECT T.usuarioPerfilId FROM #TEMPUSUARIO T)	
	
	IF @vPERFIL_ID = 2
	BEGIN
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
				(SELECT paisImpuesto FROM PAIS WHERE paisId = (SELECT agenciaPaisId FROM AGENCIA WHERE agenciaId=v.ventaUsuarioAgenciaId)) as ventaPaisImpuesto,
				(select top 1 cobranzaComision from cobranza a, cobranza_detalle b where b.cobranzadetalleVentaId=ventaId and a.cobranzaId = b.cobranzaId)  cobranzaComision,
				(select top 1 cobranzaIncentivo from cobranza a, cobranza_detalle b where b.cobranzadetalleVentaId=ventaId and a.cobranzaId = b.cobranzaId) cobranzaIncentivo, 			
				(select top 1 cobranzaPagoFecha from cobranza a, cobranza_detalle b where b.cobranzadetalleVentaId=ventaId and a.cobranzaId = b.cobranzaId) cobranzaPagoFecha,			
				(select top 1 cobranzaDocumentoTipoId + ' -' +  cobranzaDocumentoSerie +'-' +	cobranzaDocumentoCorrelativo from cobranza a, cobranza_detalle b 
				where b.cobranzadetalleVentaId=ventaId and a.cobranzaId = b.cobranzaId) cobranzaDocumento,
							ventaIncentivoImporte
		FROM	VENTA v, PRODUCTO p
		WHERE	v.ventaProductoId = p.productoId AND 
				(@pVENTA_FechaIngresoInicio = '1900-01-01' OR CAST(ventaCreadoFecha AS DATE) BETWEEN @pVENTA_FechaIngresoInicio AND @pVENTA_FechaIngresoFin) AND
				(@pVENTA_Id = 0 OR ventaId = @pVENTA_Id) AND
				(@vOPCION_1 = 0 OR ventaCreadoUsuarioId = @pVENTA_UsuarioId) AND
				(@vOPCION_2 = 0 OR ventaCreadoUsuarioId IN (SELECT agenciausuarioId FROM AGENCIA_USUARIO WHERE agenciausuarioSupervisorId = @pVENTA_UsuarioId OR agenciausuarioId = @pVENTA_UsuarioId AND agenciausuarioActivo = 1)) AND
				(@vOPCION_3 = 0 OR ventaUsuarioAgenciaId = @pVENTA_UsuarioId) AND
				(@vOPCION_4 = 0 OR ventaUsuarioAgenciaId IN (SELECT agenciaId FROM AGENCIA WHERE agenciaPromotorId = @pVENTA_UsuarioId AND agenciaActivo = 1)) AND
				(@vOPCION_5 = 0 OR ventaUsuarioAgenciaId in (select agenciaId from AGENCIA, USUARIO where agenciaPaisId = UsuarioPaisId and usuarioId=@pVENTA_UsuarioId)) AND
				(@pVENTA_EstadoId = '' OR ventaEstadoId = @pVENTA_EstadoId) AND
				(@pVENTA_SituacionId = '' OR ventaSituacionId = @pVENTA_SituacionId) AND 
				(@pVENTA_AgenciaId = 0 OR (ventaUsuarioAgenciaId = @pVENTA_AgenciaId) AND
					(	(ventaUsuarioOrigen='A' and ventaUsuarioAgenciaId IN (SELECT agenciaId 
																				FROM AGENCIA WHERE agenciaActivo = 1 
																				AND (@pVENTA_PaisId=0 OR agenciaPaisId = @pVENTA_PaisId))
						) OR 
						(ventaUsuarioOrigen='U' and ventaUsuarioAgenciaId IN (SELECT A.agenciaId 
																			FROM AGENCIA_USUARIO A, AGENCIA B 
																			WHERE A.agenciaId = B.agenciaId 
																			AND A.agenciausuarioId = ventaCreadoUsuarioId
																			/*AND A.agenciaId=@pVENTA_AgenciaId */
																			AND A.agenciausuarioActivo = 1
																			UNION
																			SELECT agenciaId 
																			  FROM AGENCIA B WHERE agenciaActivo = 1 
																			   AND (@pVENTA_PaisId=0 OR agenciaPaisId = @pVENTA_PaisId)
																			   AND B.agenciaId=@pVENTA_AgenciaId																
																			)
						)OR
						(ventaUsuarioOrigen='N' and ventaUsuarioAgenciaId IN (SELECT A.agenciaId 
																			FROM AGENCIA_USUARIO A, AGENCIA B 
																			WHERE A.agenciaId = B.agenciaId 
																			AND A.agenciausuarioId = ventaCreadoUsuarioId
																			/*AND A.agenciaId=@pVENTA_AgenciaId*/
																			AND A.agenciausuarioActivo = 1
																			AND (@pVENTA_PaisId=0 OR agenciaPaisId = @pVENTA_PaisId))
						)
					)
				) AND
				(@pVENTA_AgenciaUsuarioId = 0 OR ventaCreadoUsuarioId = @pVENTA_AgenciaUsuarioId) AND
				(@pVENTA_ClienteNombres = '' OR (UPPER(ventaClienteNombres) LIKE '%' + UPPER(@pVENTA_ClienteNombres) + '%')) AND
				(@pVENTA_ClienteApellidos = '' OR (UPPER(ventaClienteApellidos) LIKE '%' + UPPER(@pVENTA_ClienteApellidos) + '%')) 			
				AND (@pVENTA_PaisId = 0 OR (ventaUsuarioAgenciaId IN (SELECT agenciaId 
																		FROM AGENCIA WHERE agenciaActivo = 1 
																		AND (@pVENTA_PaisId=0 OR agenciaPaisId = @pVENTA_PaisId)
																		UNION
																		SELECT A.agenciaId 
																		FROM AGENCIA_USUARIO A, AGENCIA B 
																		WHERE A.agenciaId = B.agenciaId 
																		AND A.agenciausuarioId = ventaCreadoUsuarioId																	
																		AND A.agenciausuarioActivo = 1
																		AND B.agenciaActivo = 1 
																		AND (@pVENTA_PaisId=0 OR agenciaPaisId = @pVENTA_PaisId)
																	  )			
																	)
					)	
				ORDER BY ventaCreadoFecha DESC
	END
  END
  DROP TABLE #TEMPUSUARIO
END
