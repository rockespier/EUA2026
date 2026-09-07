-- Objeto: euroamer_admin_2008.Venta_Obtener_2026
-- Creado en BD: 2026-04-13 07:18:35
-- Modificado en BD: 2026-09-07 00:41:10
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
--   @pAgenciaPromotorId int (IN)

CREATE PROCEDURE [euroamer_admin_2008].[Venta_Obtener_2026]
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
    @pVENTA_CodigoExterno VARCHAR(50) = '',
    @pVENTA_ClienteDocumentoTipoId VARCHAR(3) = '',
    @pVENTA_ClienteDocumentoNumero VARCHAR(50) = '',
    @pAgenciaPromotorId INT = 0
AS
BEGIN
    SET NOCOUNT ON;
    SET DEADLOCK_PRIORITY HIGH;

	--exec euroamer_admin_2008.Venta_Obtener_2026 'U', '20260824', '20260825', 0, 1, '', '', 0, 0, '', '', 1, ''

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
    DECLARE @vFechaFinExclusiva DATE = DATEADD(DAY, 1, @pVENTA_FechaIngresoFin);

    ;WITH VentasBase AS (
        SELECT
            v.ventaId,
            v.ventaUsuarioAgenciaId,
            v.ventaUsuarioOrigen,
            v.ventaFechaVigenciaInicio,
            v.ventaFechaVigenciaFin,
            v.ventaNumeroDias,
            v.ventaDestino,
            v.ventaProductoId,
            v.ventaProductoImporte,
            v.ventaClienteDocumentoTipoId,
            v.ventaClienteDocumentoNumero,
            v.ventaClienteNombres,
            v.ventaClienteApellidos,
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
            v.ventaImporteVenta,
            v.ventaEstadoId,
            v.ventaSituacionId,
            v.ventaCreadoFecha,
            v.ventaCreadoUsuarioId,
            v.ventaCounter,
            v.ventaIncentivoImporte,
            v.ventaCodigoExterno,
            v.ventaObservacion,
            v.ventaNacionalidad,
            v.ventaPagarLiquidacion,
            v.ventaComisionImporte,
            v.venta_origen as ventaOrigen,
            v.ventaIncentivoPostFechaPago,
            v.ventaIncentivoFechaPago,
            v.ventaClienteVip
        FROM VENTA v
        WHERE
            (@vFiltroFecha = 0 OR (v.ventaCreadoFecha >= @pVENTA_FechaIngresoInicio AND v.ventaCreadoFecha < @vFechaFinExclusiva))
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
            AND (@pVENTA_AgenciaUsuarioId = 0 OR v.ventaCreadoUsuarioId = @pVENTA_AgenciaUsuarioId)
            AND (@pVENTA_ClienteDocumentoTipoId = '' OR v.ventaClienteDocumentoTipoId = @pVENTA_ClienteDocumentoTipoId)
            AND (@pVENTA_ClienteDocumentoNumero = '' OR v.ventaClienteDocumentoNumero = @pVENTA_ClienteDocumentoNumero)
            AND (@pVENTA_ClienteNombres = '' OR UPPER(v.ventaClienteNombres) LIKE '%' + UPPER(@pVENTA_ClienteNombres) + '%')
            AND (@pVENTA_ClienteApellidos = '' OR UPPER(v.ventaClienteApellidos) LIKE '%' + UPPER(@pVENTA_ClienteApellidos) + '%')
            AND (@pVENTA_CodigoExterno = '' OR UPPER(v.ventaCodigoExterno) = UPPER(@pVENTA_CodigoExterno))
    ),
    CobranzaUltima AS (
        SELECT
            cd.cobranzadetalleVentaId AS ventaId,
            c.cobranzaComision,
            c.cobranzaIncentivo,
            CONVERT(VARCHAR(10), c.cobranzaPagoFecha, 103) AS cobranzaPagoFecha,
            c.cobranzaDocumentoTipoId + ' -' + c.cobranzaDocumentoSerie + '-' + c.cobranzaDocumentoCorrelativo AS cobranzaDocumento,
            ROW_NUMBER() OVER (
                PARTITION BY cd.cobranzadetalleVentaId
                ORDER BY c.cobranzamodificadofecha DESC, c.cobranzaId DESC
            ) AS rn
        FROM cobranza_detalle cd
        INNER JOIN cobranza c
            ON c.cobranzaId = cd.cobranzaId
        INNER JOIN VentasBase vb
            ON vb.ventaId = cd.cobranzadetalleVentaId
    )
    SELECT
        vb.ventaId,
        vb.ventaUsuarioAgenciaId,
        euroamer_admin_2008.Usuario_RecuperarNombre2(vb.ventaUsuarioOrigen, vb.ventaUsuarioAgenciaId, vb.ventaCreadoUsuarioId) AS ventaUsuarioAgenciaNombre,
        vb.ventaFechaVigenciaInicio,
        vb.ventaFechaVigenciaFin,
        vb.ventaNumeroDias,
        vb.ventaDestino,
        vb.ventaProductoId,
        p.productoNombre AS ventaProductoNombre,
        CASE WHEN vb.ventaEstadoId = 'A' THEN 0 ELSE vb.ventaProductoImporte END AS ventaProductoImporte,
        vb.ventaClienteDocumentoTipoId,
        vtDoc.valorTipoNombre AS ventaClienteDocumentoTipoNombre,
        vb.ventaClienteDocumentoNumero,
        RTRIM(LTRIM(vb.ventaClienteNombres)) AS ventaClienteNombres,
        RTRIM(LTRIM(vb.ventaClienteApellidos)) AS ventaClienteApellidos,
        vb.ventaClienteFechaNacimiento,
        vb.ventaClienteEdad,
        vb.ventaClienteEmail,
        vb.ventaClienteDireccion,
        vb.ventaClienteTelefono,
        vb.ventaClienteDistrito,
        vb.ventaClienteCiudad,
        vb.ventaClientePais,
        vb.ventaContactoNombres,
        vb.ventaContactoDireccion,
        vb.ventaContactoEmail,
        vb.ventaContactoTelefono,
        vb.ventaContactoDistrito,
        vb.ventaContactoPais,
        CASE WHEN vb.ventaEstadoId = 'A' THEN 0 ELSE vb.ventaImporteVenta END AS ventaImporteVenta,
        vb.ventaEstadoId,
        vtEstado.valorTipoNombre AS ventaEstadoNombre,
        vb.ventaSituacionId,
        vtSituacion.valorTipoNombre AS ventaSituacionNombre,
        vb.ventaCreadoFecha,
        euroamer_admin_2008.Usuario_RecuperarNombre(vb.ventaUsuarioOrigen, vb.ventaCreadoUsuarioId) AS ventaCreadoUsuarioNombre,
        euroamer_admin_2008.Usuario_RecuperarNombrexID(ag.agenciaPromotorId) AS ventaPromotorNombre,
        vb.ventaCounter,
        ag.agenciaDireccion AS UsuarioAgenciaDireccion,
        ag.agenciaEmail AS UsuarioAgenciaCorreo,
        p.productoEdadMinima AS ventaProductoEdadMinima,
        ( case when p.productoImporteDiaAdicional > 0 then p.productoImporteDiaAdicional else p.productoEdadMaxima end ) AS ventaProductoEdadMaxima,
        ag.agenciaComision AS ventaAgenciaComision,
        ag.agenciaRUC AS ventaAgenciaRUC,
        ag.agenciaIdExterno AS ventaAgenciaIdExterno,
        pa.paisImpuesto AS ventaPaisImpuesto,
        vb.ventaComisionImporte,
        cob.cobranzaPagoFecha AS ventaCobranzaPagoFechaString,
        cob.cobranzaDocumento,
        vb.ventaIncentivoImporte,
        vb.ventaCodigoExterno,
        vb.ventaObservacion,
        vb.ventaNacionalidad,
        vb.ventaPagarLiquidacion,
        pa.paisNombre as ventaPaisNombre,
        isnull(ag.agenciaVip,0) as ventaAgenciaVip,
        vb.ventaOrigen,
        vb.ventaIncentivoPostFechaPago,
        vb.ventaIncentivoFechaPago,
        vb.ventaClienteVip
    FROM VentasBase vb
    INNER JOIN PRODUCTO p
        ON p.productoId = vb.ventaProductoId
    INNER JOIN AGENCIA ag
        ON ag.agenciaId = vb.ventaUsuarioAgenciaId
    INNER JOIN PAIS pa
        ON pa.paisId = ag.agenciaPaisId
    LEFT JOIN VALORES_TIPO vtDoc
        ON vtDoc.valorTipoColumnaTabla = 'ventaClienteDocumentoTipoId'
       AND vtDoc.valorTipoId = vb.ventaClienteDocumentoTipoId
    LEFT JOIN VALORES_TIPO vtEstado
        ON vtEstado.valorTipoColumnaTabla = 'ventaEstadoId'
       AND vtEstado.valorTipoId = vb.ventaEstadoId
    LEFT JOIN VALORES_TIPO vtSituacion
        ON vtSituacion.valorTipoColumnaTabla = 'ventaSituacionId'
       AND vtSituacion.valorTipoId = vb.ventaSituacionId
    LEFT JOIN CobranzaUltima cob
        ON cob.ventaId = vb.ventaId
       AND cob.rn = 1
    WHERE (@pVENTA_PaisId = 0 OR ag.agenciaPaisId = @pVENTA_PaisId)
    AND (@pAgenciaPromotorId = 0 OR ag.agenciaPromotorId = @pAgenciaPromotorId)
    ORDER BY ventaUsuarioAgenciaNombre ASC, vb.ventaCreadoFecha DESC
    OPTION (RECOMPILE);
END;
