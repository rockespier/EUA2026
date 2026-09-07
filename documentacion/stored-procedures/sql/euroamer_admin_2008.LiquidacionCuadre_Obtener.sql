-- Objeto: euroamer_admin_2008.LiquidacionCuadre_Obtener
-- Creado en BD: 2025-04-17 09:44:51
-- Modificado en BD: 2025-10-27 06:06:32
-- Extraído: 2026-09-07 08:27:16 UTC
-- Referenciado por el backend .NET: SI
-- Parámetros:
--   @pFechaInicio date (IN)
--   @pFechaFin date (IN)
--   @pAgenciaId int (IN)
--   @pFechaInicioPago date (IN)
--   @pFechaFinPago date (IN)

CREATE PROCEDURE [euroamer_admin_2008].[LiquidacionCuadre_Obtener]
	@pFechaInicio date,
    @pFechaFin date,
    @pAgenciaId int,
    @pFechaInicioPago date,
    @pFechaFinPago date
AS
BEGIN

	SET NOCOUNT ON;

	--exec LiquidacionCuadre_Obtener '20250804','20250830',0,'20250804','20250830'

	select year(cobranzaPagoFecha) cobranzaPeriodoAnio, month(cobranzaPagoFecha) cobranzaPeriodoMes,
       upper(cobranzaCliente) cobranzaCliente,
       euroamer_admin_2008.ValorTipo_RecuperarNombre('cobranzaDocumentoTipoId',cobranzaDocumentoTipoId) as cobranzaDocumentoTipoNombre,
        cobranzaDocumentoSerie,
        cobranzaDocumentoCorrelativo,
        cobranzaPagoFecha,
        (select top 1 ventaFechaLiquidacion from venta where ventaid in (select cobranzadetalleVentaId
                                                                         from COBRANZA_DETALLE
                                                                         where COBRANZA_DETALLE.cobranzaId =  COBRANZA.cobranzaId)) cobranzaFechaLiquidacion,
        case (select top 1 ventaFormulaLiquidacion 
                from venta where ventaid in (select cobranzadetalleVentaId
                                               from COBRANZA_DETALLE
                                              where COBRANZA_DETALLE.cobranzaId =  COBRANZA.cobranzaId)) when 1 then 'DESGLOSE REGULAR' WHEN 2 then 'PLAN B' else 'FULL' end cobranzaFormulaLiquidacion,
        cobranzaImporteBruto,
        cobranzaComision,
        cobranzaIncentivo,
        cobranzaNotaCredito,
        isnull(cobranzaDescuento,0) cobranzaDescuento,
        cobranzaImportePago,
        cobranzaImportePago cobranzaPagos,
        'CANCELADO' cobranzaEstadoPago,
        0 cobranzaSaldo,
        cobranzaObservacion,
	    euroamer_admin_2008.ValorTipo_RecuperarNombre('cobranzaPagoMedioId',cobranzaPagoMedioId) cobranzaPagoMedioNombre,
	    cobranzaId,
	    cobranzaPagoMedioId,
	euroamer_admin_2008.ValorTipo_RecuperarNombre('cobranzaCobradorId', cobranzaCobradorId) cobranzaCobradorNombre
	from COBRANZA
    where cobranzaPagoFecha >= @pFechaInicio and cobranzaPagoFecha <= @pFechaFin    
    and cobranzaActivo = 1
 order by cobranzaPagoFecha desc,1,2,3

END
