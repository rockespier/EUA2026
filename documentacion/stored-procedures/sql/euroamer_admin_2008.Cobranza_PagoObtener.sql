-- Objeto: euroamer_admin_2008.Cobranza_PagoObtener
-- Creado en BD: 2025-03-19 07:54:17
-- Modificado en BD: 2025-03-19 11:30:20
-- Extraído: 2026-09-07 08:27:16 UTC
-- Referenciado por el backend .NET: SI
-- Parámetros:
--   @pCOBRANZAPAGO_CobranzaId int (IN)

CREATE PROCEDURE [euroamer_admin_2008].[Cobranza_PagoObtener]
	@pCOBRANZAPAGO_CobranzaId INT = 0
AS
BEGIN
	--Cobranza_PagoObtener 138553
	SET NOCOUNT ON;

	select cobranzapagoId,
	       cobranzapagoMedioId,
	       euroamer_admin_2008.ValorTipo_RecuperarNombre('cobranzaPagoMedioId',cobranzapagoMedioId) cobranzapagoMedioNombre,
	       cobranzapagoFecha,
		   cobranzapagoImporte,
		   cobranzapagoCreadoUsuario,
	       cobranzapagoCreadoFecha,
	       cobranzapagoEvidenciaRuta,
	       cobranzapagoEstadoId,
		   cobranzapagoActivo,
	       euroamer_admin_2008.ValorTipo_RecuperarNombre('cobranzaPagoEstado',cobranzapagoEstadoId) cobranzapagoEstadoNombre, cobranzapagoObservacion
	from [euroamer_admin_2008].[COBRANZA_PAGO]
    where cobranzapagoCobranzaId = @pCOBRANZAPAGO_CobranzaId
    and cobranzapagoActivo = 1

END
