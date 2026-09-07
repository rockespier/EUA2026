-- Objeto: euroamer_admin_2008.Venta_Obtener_nuevo
-- Creado en BD: 2026-03-17 09:49:21
-- Modificado en BD: 2026-04-13 02:44:30
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

CREATE PROCEDURE [euroamer_admin_2008].[Venta_Obtener_nuevo]
    @pORIGEN VARCHAR(1),
    @pVENTA_FechaIngresoInicio DATE = '1900-01-01',
    @pVENTA_FechaIngresoFin DATE = '1900-01-01',
    @pVENTA_Id INT = 0,
    @pVENTA_UsuarioId INT = 0,
    @pVENTA_EstadoId VARCHAR(1) = '',
    @pVENTA_SituacionId VARCHAR(1) = '',
    @pVENTA_AgenciaId INT = 0,
    @pVENTA_AgenciaUsuarioId INT = 0,
    @pVENTA_ClienteNombres VARCHAR(50) = '',
    @pVENTA_ClienteApellidos VARCHAR(50) = '',
    @pVENTA_PaisId INT = 0,
    @pVENTA_CodigoExterno VARCHAR(50) = ''
AS
BEGIN
    SET NOCOUNT ON;
    SET DEADLOCK_PRIORITY HIGH;
--exec euroamer_admin_2008.Venta_Obtener 'U', '2025-01-01', '2025-03-01', 2269488, 1, '', '', 0, 0, '', '', 1, ''
    DECLARE @vPERFIL_ID INT = euroamer_admin_2008.Usuario_RecuperarPerfil(@pORIGEN, @pVENTA_UsuarioId);

    DECLARE @vOPCION_1 BIT = 0;
    DECLARE @vOPCION_2 BIT = 0;
    DECLARE @vOPCION_3 BIT = 0;
    DECLARE @vOPCION_4 BIT = 0;
    DECLARE @vOPCION_5 BIT = 0;

    IF (@pORIGEN = 'N' AND @vPERFIL_ID = 5)
        SET @vOPCION_1 = 1;
    ELSE IF (@pORIGEN = 'N' AND @vPERFIL_ID = 4)
        SET @vOPCION_2 = 1;
    ELSE IF (@pORIGEN = 'A' AND @vPERFIL_ID = 2) OR (@pORIGEN = 'N' AND @vPERFIL_ID = 3)
        SET @vOPCION_3 = 1;
    ELSE IF (@pORIGEN = 'U' AND @vPERFIL_ID = 6)
        SET @vOPCION_4 = 1;
    ELSE IF EXISTS (
        SELECT 1
        FROM valores_tipo vt
        WHERE vt.valorTipoColumnaTabla = 'FiltroPerfilPais'
          AND vt.valorTipoActivo = 1
          AND vt.valorTipoId = @vPERFIL_ID
    )
        SET @vOPCION_5 = 1;

    DECLARE @vFiltroFecha BIT = CASE WHEN @pVENTA_FechaIngresoInicio <> '1900-01-01' THEN 1 ELSE 0 END;

    SELECT
        v.ventaId,
        v.ventaUsuarioAgenciaId,
        euroamer_admin_2008.Usuario_RecuperarNombre2(v.ventaUsuarioOrigen, v.ventaUsuarioAgenciaId, v.ventaCreadoUsuarioId) AS ventaUsuarioAgenciaNombre,
        v.ventaFechaVigenciaInicio,
        v.ventaFechaVigenciaFin,
        v.ventaNumeroDias,
        v.ventaDestino,
        v.ventaProductoId,
        p.productoNombre AS ventaProductoNombre,
        CASE WHEN v.ventaEstadoId = 'A' THEN 0 ELSE v.ventaProductoImporte END AS ventaProductoImporte,
        v.ventaClienteDocumentoTipoId,
        vtDoc.valorTipoNombre AS ventaClienteDocumentoTipoNombre,
        v.ventaClienteDocumentoNumero,
        RTRIM(LTRIM(v.ventaClienteNombres)) AS ventaClienteNombres,
        RTRIM(LTRIM(v.ventaClienteApellidos)) AS ventaClienteApellidos,
        v.ventaClienteFechaNacimiento,
        v.ventaClienteEdad,
        v.ventaClienteEmail,
        v.ventaClienteDireccion,
        v.ventaClienteTelefono,
        v.ventaClienteDistrito,
        v.ventaClienteCiudad,
        v.ventaClientePais,
        v.ventaContactoNombres,
        v.ventaContactoDireccion,
        v.ventaContactoEmail,
        v.ventaContactoTelefono,
        v.ventaContactoDistrito,
        v.ventaContactoPais,
        CASE WHEN v.ventaEstadoId = 'A' THEN 0 ELSE v.ventaImporteVenta END AS ventaImporteVenta,
        v.ventaEstadoId,
        euroamer_admin_2008.ValorTipo_RecuperarNombre('ventaEstadoId', v.ventaEstadoId) AS ventaEstadoNombre,
        v.ventaSituacionId,
        euroamer_admin_2008.ValorTipo_RecuperarNombre('ventaSituacionId', v.ventaSituacionId) AS ventaSituacionNombre,
        v.ventaCreadoFecha,
        euroamer_admin_2008.Usuario_RecuperarNombre(v.ventaUsuarioOrigen, v.ventaCreadoUsuarioId) AS ventaCreadoUsuarioNombre,
        euroamer_admin_2008.Usuario_RecuperarNombrexID(ag.agenciaPromotorId) AS ventaPromotorNombre,
        v.ventaCounter,
        ag.agenciaDireccion AS UsuarioAgenciaDireccion,
        ag.agenciaEmail AS UsuarioAgenciaCorreo,
        p.productoEdadMinima AS ventaProductoEdadMinima,
        p.productoEdadMaxima AS ventaProductoEdadMaxima,
        ag.agenciaComision AS ventaAgenciaComision,
        ag.agenciaRUC AS ventaAgenciaRUC,
        ag.agenciaIdExterno AS ventaAgenciaIdExterno,
        pa.paisImpuesto AS ventaPaisImpuesto,
        cob.cobranzaComision,
        cob.cobranzaIncentivo,
        cob.ventaCobranzaPagoFecha,
        cob.cobranzaDocumento,
        v.ventaIncentivoImporte,
        v.ventaCodigoExterno,
        v.ventaObservacion
    FROM VENTA v
    INNER JOIN PRODUCTO p
        ON p.productoId = v.ventaProductoId
    INNER JOIN AGENCIA ag
        ON ag.agenciaId = v.ventaUsuarioAgenciaId
    INNER JOIN PAIS pa
        ON pa.paisId = ag.agenciaPaisId
    LEFT JOIN VALORES_TIPO vtDoc
        ON vtDoc.valorTipoColumnaTabla = 'ventaClienteDocumentoTipoId'
       AND vtDoc.valorTipoId = v.ventaClienteDocumentoTipoId
    OUTER APPLY (
        SELECT TOP (1)
            c.cobranzaComision,
            c.cobranzaIncentivo,
            CONVERT(VARCHAR(10), c.cobranzaPagoFecha, 103) AS ventaCobranzaPagoFecha,
            c.cobranzaDocumentoTipoId + ' -' + c.cobranzaDocumentoSerie + '-' + c.cobranzaDocumentoCorrelativo AS cobranzaDocumento
        FROM cobranza_detalle cd
        INNER JOIN cobranza c
            ON c.cobranzaId = cd.cobranzaId
        WHERE cd.cobranzadetalleVentaId = v.ventaId
        ORDER BY c.cobranzamodificadofecha DESC
    ) cob
    WHERE
        (@vFiltroFecha = 0 OR (v.ventaCreadoFecha >= @pVENTA_FechaIngresoInicio AND v.ventaCreadoFecha < DATEADD(DAY, 1, @pVENTA_FechaIngresoFin)))
        AND (@pVENTA_Id = 0 OR v.ventaId = @pVENTA_Id)
        AND (@vOPCION_1 = 0 OR v.ventaCreadoUsuarioId = @pVENTA_UsuarioId)
        AND (@vOPCION_2 = 0 OR EXISTS (
            SELECT 1
            FROM AGENCIA_USUARIO au
            WHERE au.agenciausuarioActivo = 1
              AND au.agenciausuarioId = v.ventaCreadoUsuarioId
              AND (au.agenciausuarioSupervisorId = @pVENTA_UsuarioId OR au.agenciausuarioId = @pVENTA_UsuarioId)
        ))
        AND (@vOPCION_3 = 0 OR v.ventaUsuarioAgenciaId = @pVENTA_UsuarioId)
        AND (@vOPCION_4 = 0 OR EXISTS (
            SELECT 1
            FROM AGENCIA a4
            WHERE a4.agenciaActivo = 1
              AND a4.agenciaPromotorId = @pVENTA_UsuarioId
              AND a4.agenciaId = v.ventaUsuarioAgenciaId
        ))
        AND (@vOPCION_5 = 0 OR EXISTS (
            SELECT 1
            FROM AGENCIA a5
            INNER JOIN USUARIO u5
                ON u5.UsuarioPaisId = a5.agenciaPaisId
            WHERE u5.usuarioId = @pVENTA_UsuarioId
              AND a5.agenciaId = v.ventaUsuarioAgenciaId
        ))
        AND (@pVENTA_EstadoId = '' OR v.ventaEstadoId = @pVENTA_EstadoId)
        AND (@pVENTA_SituacionId = '' OR v.ventaSituacionId = @pVENTA_SituacionId)
        AND (@pVENTA_AgenciaId = 0 OR v.ventaUsuarioAgenciaId = @pVENTA_AgenciaId)
        AND (@pVENTA_PaisId = 0 OR ag.agenciaPaisId = @pVENTA_PaisId)
        AND (@pVENTA_AgenciaUsuarioId = 0 OR v.ventaCreadoUsuarioId = @pVENTA_AgenciaUsuarioId)
        AND (@pVENTA_ClienteNombres = '' OR UPPER(v.ventaClienteNombres) LIKE '%' + UPPER(@pVENTA_ClienteNombres) + '%')
        AND (@pVENTA_CodigoExterno = '' OR UPPER(v.ventaCodigoExterno) = UPPER(@pVENTA_CodigoExterno))
        AND (@pVENTA_ClienteApellidos = '' OR UPPER(v.ventaClienteApellidos) LIKE '%' + UPPER(@pVENTA_ClienteApellidos) + '%')
    ORDER BY ventaUsuarioAgenciaNombre DESC
    OPTION (RECOMPILE);
END;
