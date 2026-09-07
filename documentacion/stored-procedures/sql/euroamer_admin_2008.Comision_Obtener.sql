-- Objeto: euroamer_admin_2008.Comision_Obtener
-- Creado en BD: 2025-07-09 08:43:02
-- Modificado en BD: 2025-07-14 02:13:40
-- Extraído: 2026-09-07 08:27:16 UTC
-- Referenciado por el backend .NET: SI
-- Parámetros:
--   @pCodLiquidacion int (IN)

CREATE PROCEDURE [euroamer_admin_2008].[Comision_Obtener]
	@pCodLiquidacion INT = 0
AS
BEGIN
--Comision_Obtener 92
	SET NOCOUNT ON;

	select distinct ventaUsuarioAgenciaId agenciaFacturaAgenciaId,
	                agenciaNombre agenciaFacturaNombre,
	   2 agenciaFacturaMonedaId ,
       cobranzacomision agenciaFacturaTotal
	from VENTA , AGENCIA, COBRANZA
	where ventaCodigoLiquidacion = @pCodLiquidacion
	  and cobranzaCodigoLiquidacion = ventaCodigoLiquidacion
    and ventaUsuarioAgenciaId = agenciaId


END
