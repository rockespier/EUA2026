-- Objeto: euroamer_admin_2008.Visitas_Eliminar
-- Creado en BD: 2016-02-21 18:26:49
-- Modificado en BD: 2016-02-21 18:26:49
-- Extraído: 2026-09-07 08:27:17 UTC
-- Referenciado por el backend .NET: NO (revisar si sigue en uso)
-- Parámetros:
--   @pVISITAS_Id int (IN)

create PROCEDURE [Visitas_Eliminar]
	@pVISITAS_Id INT
AS
BEGIN
	
	SET NOCOUNT ON;

    UPDATE VISITAS SET visitasActivo=0 WHERE visitasId = @pVISITAS_Id
    
END
