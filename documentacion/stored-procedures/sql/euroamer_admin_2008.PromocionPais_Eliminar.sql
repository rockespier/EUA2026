-- Objeto: euroamer_admin_2008.PromocionPais_Eliminar
-- Creado en BD: 2017-03-25 18:41:08
-- Modificado en BD: 2025-04-14 02:42:51
-- Extraído: 2026-09-07 08:27:16 UTC
-- Referenciado por el backend .NET: SI
-- Parámetros:
--   @pPROMOCION_Id int (IN)
--   @pPROMOCION_PaisId int (IN)
--   @pPROMOCION_AgenciaId int (IN)
--   @pPROMOCION_ProductoId int (IN)

CREATE PROCEDURE [PromocionPais_Eliminar]
	@pPROMOCION_Id INT=0,
	@pPROMOCION_PaisId INT = 0,
	@pPROMOCION_AgenciaId INT = 0,
    @pPROMOCION_ProductoId INT = 0
AS
BEGIN
	
	SET NOCOUNT ON;

    DELETE FROM PAIS_PROMOCION WHERE paisPromocionID = @pPROMOCION_Id;
        
    
	 IF @@ROWCOUNT = 0
		BEGIN
		   select '' as errorDescripcion
		END
	ELSE 
		BEGIN
		   select 'ok' as errorDescripcion
		END

END
