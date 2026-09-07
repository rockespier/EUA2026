-- Objeto: euroamer_admin_2008.Ubigeo_Eliminar
-- Creado en BD: 2017-03-25 18:41:08
-- Modificado en BD: 2025-01-02 06:23:44
-- Extraído: 2026-09-07 08:27:17 UTC
-- Referenciado por el backend .NET: SI
-- Parámetros:
--   @pUbigeo_Id int (IN)


CREATE PROCEDURE [Ubigeo_Eliminar]
	@pUbigeo_Id INT
AS
BEGIN
	
	SET NOCOUNT ON;

    UPDATE Ubigeo SET UbigeoActivo=0 WHERE UbigeoId = @pUbigeo_Id
     IF @@ROWCOUNT = 0
		BEGIN
		   select '' as errorDescripcion
		END
	ELSE 
		BEGIN
		   select 'ok' as errorDescripcion
		END
END
