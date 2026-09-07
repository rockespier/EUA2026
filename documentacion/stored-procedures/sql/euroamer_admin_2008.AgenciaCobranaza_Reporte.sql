-- Objeto: euroamer_admin_2008.AgenciaCobranaza_Reporte
-- Creado en BD: 2025-05-24 10:58:20
-- Modificado en BD: 2025-07-08 05:44:34
-- Extraído: 2026-09-07 08:27:16 UTC
-- Referenciado por el backend .NET: SI
-- Parámetros:
--   @pAGENCIA_Id int (IN)
--   @pFechaInicio date (IN)
--   @pFechaFin date (IN)
--   @pCodLiquidacion int (IN)

CREATE PROCEDURE [euroamer_admin_2008].[AgenciaCobranaza_Reporte]
	@pAGENCIA_Id INT = 0,
    @pFechaInicio DATE = '',
	@pFechaFin DATE = '',
    @pCodLiquidacion INT = 0

AS
BEGIN

	SET NOCOUNT ON;

	--exec AgenciaCobranaza_Reporte 0,'','',92

	declare @vAgenciaNombre VARCHAR(100) =''
	if @pAGENCIA_Id > 0
	    begin
            set @vAgenciaNombre = (select agenciaNombre from Agencia where agenciaId=@pAGENCIA_Id)
        end


	select euroamer_admin_2008.ValorTipo_RecuperarNombre('cobranzaDocumentoTipoId',cobranzaDocumentoTipoId) as cobranzaDocumentoTipoNombre,
	    cobranzaDocumentoSerie, cobranzaDocumentoCorrelativo,
        cobranzaCreadoFecha,cobranzaImportePago
	from cobranza
    where  (@vAgenciaNombre='' or cobranzaCliente = @vAgenciaNombre)
    and (@pCodLiquidacion = 0 or cobranzaCodigoLiquidacion = @pCodLiquidacion)
    --and (cobranzaCreadoFecha between @pFechaInicio and @pFechaFin)

END
