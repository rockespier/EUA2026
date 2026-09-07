-- Objeto: euroamer_admin_2008.Venta_ObtenerGestionIncentivos
-- Creado en BD: 2016-02-15 21:06:18
-- Modificado en BD: 2026-08-26 04:06:55
-- Extraído: 2026-09-07 08:27:17 UTC
-- Referenciado por el backend .NET: SI
-- Parámetros:
--   @pVENTA_Id int (IN)

CREATE PROCEDURE [Venta_ObtenerGestionIncentivos]
	@pVENTA_Id INT = 0
AS
BEGIN
	
	SET NOCOUNT ON;

	SELECT	ve.ventaId, 
			ve.ventaProductoImporte, 
			co.cobranzaComision,
			ag.agenciaComision,
			co.cobranzaIncentivo,
			co.cobranzaPagoFecha,
			co.cobranzaPagoMedioId,
			co.cobranzaDocumentoTipoId,
			co.cobranzaImportePago,
			ve.ventaObservacion,
			ve.ventaIncentivoPost ventaIncentivoPostImporte,
			ve.ventaIncentivoFechaPago,
            ve.ventaIncentivoImporte,
            ve.ventaIncentivoPostFechaPago
	FROM	VENTA ve
			INNER JOIN AGENCIA ag ON ve.ventaUsuarioAgenciaId = ag.agenciaId
			LEFT OUTER JOIN (SELECT	cd.cobranzadetalleVentaId, cc.cobranzaComision, cc.cobranzaIncentivo, 
								cc.cobranzaPagoFecha, cc.cobranzaPagoMedioId, cc.cobranzaDocumentoTipoId,
								cc.cobranzaImportePago
						FROM	COBRANZA cc, COBRANZA_DETALLE cd
						WHERE	cc.cobranzaId = cd.cobranzaId
						AND		cd.cobranzadetalleVentaId = @pVENTA_Id) co ON ve.ventaId = co.cobranzadetalleVentaId
	WHERE	ve.ventaId = @pVENTA_Id
END
