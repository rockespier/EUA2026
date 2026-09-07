-- Objeto: euroamer_admin_2008.AgenciaCobranza_Detalle
-- Creado en BD: 2025-06-23 06:44:07
-- Modificado en BD: 2025-07-08 05:39:58
-- Extraído: 2026-09-07 08:27:16 UTC
-- Referenciado por el backend .NET: SI
-- Parámetros:
--   @pAGENCIA_Id int (IN)
--   @pFechaInicio date (IN)
--   @pFechaFin date (IN)
--   @pCodigoLiquidacion int (IN)

CREATE PROCEDURE [euroamer_admin_2008].[AgenciaCobranza_Detalle]
	@pAGENCIA_Id INT = 0,
    @pFechaInicio DATE = '',
	@pFechaFin DATE = '',
    @pCodigoLiquidacion INT = 0

AS
BEGIN

	SET NOCOUNT ON;

	declare @vAgenciaNombre VARCHAR(100)=''
	if @pAGENCIA_Id > 0
	    begin
            set @vAgenciaNombre = (select agenciaNombre from Agencia where agenciaId=@pAGENCIA_Id)
        end


	select euroamer_admin_2008.ValorTipo_RecuperarNombre('cobranzaDocumentoTipoId',cobranzaDocumentoTipoId) as cobranzaDocumentoTipoNombre,
	    cobranzaDocumentoSerie, cobranzaDocumentoCorrelativo,
        cast(cobranzaCreadoFecha as date) cobranzaCreadoFecha,ventaPagarLiquidacion cobranzaImportePago,
        cobranzadetalleVentaId
	from cobranza c, COBRANZA_DETALLE d, VENTA v
    where c.cobranzaId = d.cobranzaId and v.ventaid = cobranzadetalleVentaId
    and (@vAgenciaNombre='' or cobranzaCliente = @vAgenciaNombre)
    and (cobranzaCreadoFecha between @pFechaInicio and @pFechaFin)
    and (@pCodigoLiquidacion = 0 or cobranzaCodigoLiquidacion = @pCodigoLiquidacion)
    order by cast(cobranzaCreadoFecha as date), c.cobranzaId
END
