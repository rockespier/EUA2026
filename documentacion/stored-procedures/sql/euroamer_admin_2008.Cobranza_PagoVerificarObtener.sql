-- Objeto: euroamer_admin_2008.Cobranza_PagoVerificarObtener
-- Creado en BD: 2025-03-25 06:21:46
-- Modificado en BD: 2025-07-18 08:39:56
-- Extraído: 2026-09-07 08:27:16 UTC
-- Referenciado por el backend .NET: SI
-- Parámetros:
--   @pCOBRANZAPAGO_AgenciaId int (IN)
--   @pCodLiquidacion int (IN)

CREATE PROCEDURE [euroamer_admin_2008].[Cobranza_PagoVerificarObtener]
	@pCOBRANZAPAGO_AgenciaId INT = 0,
    @pCodLiquidacion INT = 0
AS
BEGIN
	--Cobranza_PagoVerificarObtener 920
	--Cobranza_PagoVerificarObtener 0
	SET NOCOUNT ON;

	select cp.cobranzapagoId,
	       cp.cobranzapagoMedioId,
	       euroamer_admin_2008.ValorTipo_RecuperarNombre('cobranzaPagoMedioId',cp.cobranzapagoMedioId) cobranzapagoMedioNombre,
	       cp.cobranzapagoFecha,
		   cp.cobranzapagoImporte,
		   cobranzapagoCreadoUsuario,
	       cobranzapagoCreadoFecha,
	       cobranzapagoEvidenciaRuta,
	       cobranzapagoEstadoId,
		   cobranzapagoActivo,
	       euroamer_admin_2008.ValorTipo_RecuperarNombre('cobranzaPagoEstado',cobranzapagoEstadoId) cobranzapagoEstadoNombre, 
	       upper(cobranzapagoObservacion) cobranzapagoObservacion,
	       c.cobranzaCliente cobranzapagoAgenciaNombre,
	       cobranzadocumentoserie + '-' +cobranzaDocumentoCorrelativo Documento,
	       cobranzaId,
	       euroamer_admin_2008.ValorTipo_RecuperarNombre('cobranzaDocumentoTipoId',cobranzaDocumentoTipoId) as cobranzaDocumentoTipoNombre
	from [euroamer_admin_2008].[COBRANZA_PAGO] cp, COBRANZA c
    where cobranzapagoActivo = 1
    and cobranzapagoCobranzaId = c.cobranzaId
	and (@pCOBRANZAPAGO_AgenciaId = 0 OR (select top 1 v.ventaUsuarioAgenciaId
	       from COBRANZA_DETALLE cd, VENTA v
	       where cd.cobranzaId = c.cobranzaId and cd.cobranzadetalleVentaId = v.ventaId) = @pCOBRANZAPAGO_AgenciaId)
    and (@pCodLiquidacion = 0 or cobranzaCodigoLiquidacion = @pCodLiquidacion)

END
