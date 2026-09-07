-- Objeto: euroamer_admin_2008.PerfilMenu_Eliminar
-- Creado en BD: 2013-12-24 08:50:58
-- Modificado en BD: 2026-08-28 02:41:47
-- Extraído: 2026-09-07 08:27:16 UTC
-- Referenciado por el backend .NET: SI
-- Parámetros:
--   @pPERFIL_Id int (IN)

CREATE PROCEDURE [PerfilMenu_Eliminar]
	@pPERFIL_Id INT
AS
BEGIN
	
	SET NOCOUNT ON;

    DELETE FROM PERFIL_MENU WHERE perfilId = @pPERFIL_Id
    
	 IF @@ROWCOUNT = 0
		BEGIN
		   select -1,'' as errorDescripcion
		END
	ELSE 
		BEGIN		   
		    select 1 as errorCodigo, 'ok' as errorDescripcion
		END
END
