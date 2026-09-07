-- Objeto: euroamer_admin_2008.Pais_Eliminar
-- Creado en BD: 2014-06-13 22:47:33
-- Modificado en BD: 2025-01-02 06:23:41
-- Extraído: 2026-09-07 08:27:16 UTC
-- Referenciado por el backend .NET: SI
-- Parámetros:
--   @pPAIS_Id int (IN)


CREATE PROCEDURE [Pais_Eliminar]
	@pPAIS_Id INT
AS
BEGIN
	
	SET NOCOUNT ON;

    UPDATE PAIS SET paisActivo=0 WHERE paisId = @pPAIS_Id
   
   IF @@ROWCOUNT = 0
		BEGIN
		   select '' as errorDescripcion
		END
	ELSE 
		BEGIN
		   select 'ok' as errorDescripcion
		END
END
