-- Objeto: euroamer_admin_2008.Cobranza_PagoEliminar
-- Creado en BD: 2025-03-19 07:15:20
-- Modificado en BD: 2025-03-19 11:26:11
-- Extraído: 2026-09-07 08:27:16 UTC
-- Referenciado por el backend .NET: SI
-- Parámetros:
--   @pCobranzaPago_Id int (IN)

CREATE PROCEDURE [euroamer_admin_2008].[Cobranza_PagoEliminar]
	@pCobranzaPago_Id INT
AS
BEGIN

	SET NOCOUNT ON;

    UPDATE [euroamer_admin_2008].[COBRANZA_PAGO] SET cobranzapagoActivo = 0 WHERE cobranzapagoId = @pCobranzaPago_Id

	IF @@ROWCOUNT = 0
		BEGIN
		   select '' as errorDescripcion
		END
	ELSE
		BEGIN
		   select 'ok' as errorDescripcion
		END

END
