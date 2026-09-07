-- Objeto: euroamer_admin_2008.Correlativo_Generar
-- Creado en BD: 2013-12-24 08:50:57
-- Modificado en BD: 2025-02-08 02:18:04
-- Extraído: 2026-09-07 08:27:16 UTC
-- Referenciado por el backend .NET: SI
-- Parámetros:
--   @pCORRELATIVO_Columna varchar (IN)

CREATE PROCEDURE [euroamer_admin_2008].[Correlativo_Generar]
	@pCORRELATIVO_Columna VARCHAR(50)
AS
BEGIN
	
	SET NOCOUNT ON;
	DECLARE @vCORRELATIVO INT=0;
	
	IF (SELECT correlativoUltimoGenerado FROM CORRELATIVOS WHERE correlativoColumna = @pCORRELATIVO_Columna) IS NULL
		BEGIN
			SET @vCORRELATIVO =  -1
		END
	ELSE
		BEGIN
			
			SET @vCORRELATIVO = (SELECT correlativoUltimoGenerado+1 
								 FROM CORRELATIVOS WHERE correlativoColumna = @pCORRELATIVO_Columna)
			
			UPDATE CORRELATIVOS SET correlativoUltimoGenerado = @vCORRELATIVO
			WHERE correlativoColumna = @pCORRELATIVO_Columna
			
		END
    
	IF @@ROWCOUNT = 0
		BEGIN
		   select @vCORRELATIVO as errorCodigo, '' as errorDescripcion
		END
	ELSE 
		BEGIN
		   select @vCORRELATIVO as errorCodigo, 'ok' as errorDescripcion
		END
END
