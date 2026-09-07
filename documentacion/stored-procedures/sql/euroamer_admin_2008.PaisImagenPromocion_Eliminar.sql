-- Objeto: euroamer_admin_2008.PaisImagenPromocion_Eliminar
-- Creado en BD: 2016-12-09 20:42:05
-- Modificado en BD: 2016-12-09 20:42:05
-- Extraído: 2026-09-07 08:27:16 UTC
-- Referenciado por el backend .NET: SI
-- Parámetros:
--   @pPAISImagen_Id int (IN)

create PROCEDURE [euroamer_admin_2008].[PaisImagenPromocion_Eliminar]
	@pPAISImagen_Id INT
AS
BEGIN
	
	SET NOCOUNT ON;

    delete from PAIS_IMAGENPROMOCION WHERE [paisImagenId] = @pPAISImagen_Id
    
END
