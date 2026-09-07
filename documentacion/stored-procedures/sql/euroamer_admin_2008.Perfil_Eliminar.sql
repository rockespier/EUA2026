-- Objeto: euroamer_admin_2008.Perfil_Eliminar
-- Creado en BD: 2013-12-24 08:50:58
-- Modificado en BD: 2025-01-02 06:23:41
-- Extraído: 2026-09-07 08:27:16 UTC
-- Referenciado por el backend .NET: SI
-- Parámetros:
--   @pPERFIL_Id int (IN)


CREATE PROCEDURE [Perfil_Eliminar]
	@pPERFIL_Id INT
AS
BEGIN
	
	SET NOCOUNT ON;

    UPDATE PERFIL SET perfilActivo=0 WHERE perfilId = @pPERFIL_Id
    
	 IF @@ROWCOUNT = 0
		BEGIN
		   select '' as errorDescripcion
		END
	ELSE 
		BEGIN
		   select 'ok' as errorDescripcion
		END

END
