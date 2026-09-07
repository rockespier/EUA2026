-- Objeto: euroamer_admin_2008.AgenciaPagos_Reporte
-- Creado en BD: 2025-05-24 10:55:48
-- Modificado en BD: 2025-07-01 02:01:13
-- Extraído: 2026-09-07 08:27:16 UTC
-- Referenciado por el backend .NET: SI
-- Parámetros:
--   @pAGENCIA_Id int (IN)
--   @pFechaInicio date (IN)
--   @pFechaFin date (IN)
--   @pCodLiquidacion int (IN)

CREATE PROCEDURE [euroamer_admin_2008].[AgenciaPagos_Reporte]
	@pAGENCIA_Id INT = 0,
    @pFechaInicio DATE = '',
	@pFechaFin DATE = '',
    @pCodLiquidacion INT = 0

AS
BEGIN

	SET NOCOUNT ON;

	declare @vAgenciaNombre VARCHAR(100)=''
	if @pAGENCIA_Id > 0
	    begin
            set @vAgenciaNombre = (select agenciaNombre from Agencia where agenciaId=@pAGENCIA_Id)
        end


	select euroamer_admin_2008.ValorTipo_RecuperarNombre('cobranzaPagoMedioId',COBRANZA_PAGO.cobranzapagoMedioId) cobranzapagoMedioNombre,
	       COBRANZA_PAGO.cobranzaPagoFecha,
	       cobranzapagoImporte
	from cobranza,COBRANZA_PAGO
    where cobranzaId = cobranzapagoCobranzaId
    and (@vAgenciaNombre='' or cobranzaCliente = @vAgenciaNombre)
    and (COBRANZA_PAGO.cobranzaPagoFecha between @pFechaInicio and @pFechaFin)
    and (@pCodLiquidacion = 0 or cobranzacodigoliquidacion = @pCodLiquidacion)
    order by COBRANZA_PAGO.cobranzaPagoFecha
END
