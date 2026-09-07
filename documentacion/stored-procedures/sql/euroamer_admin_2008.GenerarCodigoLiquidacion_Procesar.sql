-- Objeto: euroamer_admin_2008.GenerarCodigoLiquidacion_Procesar
-- Creado en BD: 2025-07-07 05:31:02
-- Modificado en BD: 2025-07-07 06:52:17
-- Extraído: 2026-09-07 08:27:16 UTC
-- Referenciado por el backend .NET: SI

CREATE PROCEDURE [GenerarCodigoLiquidacion_Procesar]

AS
BEGIN

    SET NOCOUNT ON;
    
    --exec GenerarCodigoLiquidacion_Procesar
    DECLARE @vCORRELATIVO INT=0;
    
    	SET @vCORRELATIVO = (SELECT correlativoUltimoGenerado+1
								 FROM CORRELATIVOS WHERE correlativoColumna = 'LiquidacionId')

			UPDATE CORRELATIVOS SET correlativoUltimoGenerado = @vCORRELATIVO
			WHERE correlativoColumna = 'LiquidacionId'

    select correlativoColumna,correlativoUltimoGenerado from CORRELATIVOS where correlativoColumna='LiquidacionId'

END
