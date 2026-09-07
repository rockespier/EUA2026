-- Objeto: euroamer_admin_2008.Cobrador_Eliminar
-- Creado en BD: 2015-10-22 07:59:41
-- Modificado en BD: 2025-01-02 06:23:40
-- Extraído: 2026-09-07 08:27:16 UTC
-- Referenciado por el backend .NET: NO (revisar si sigue en uso)
-- Parámetros:
--   @pCOBRANZA_Id int (IN)

CREATE PROCEDURE [Cobrador_Eliminar]
	@pCOBRANZA_Id INT
AS
BEGIN
	
	SET NOCOUNT ON;

    UPDATE COBRANZA SET cobranzaActivo=0 WHERE cobranzaId = @pCOBRANZA_Id
    
	IF @@ROWCOUNT = 0
		BEGIN
		   select '' as errorDescripcion
		END
	ELSE 
		BEGIN
		   select 'ok' as errorDescripcion
		END

END
