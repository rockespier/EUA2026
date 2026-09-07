-- Objeto: euroamer_admin_2008.SolicitudTipo_Eliminar
-- Creado en BD: 2013-12-24 08:50:59
-- Modificado en BD: 2025-01-02 06:23:43
-- Extraído: 2026-09-07 08:27:17 UTC
-- Referenciado por el backend .NET: SI
-- Parámetros:
--   @pSOLICITUDTIPO_Id int (IN)


CREATE PROCEDURE [SolicitudTipo_Eliminar]
	@pSOLICITUDTIPO_Id INT
AS
BEGIN
	
	SET NOCOUNT ON;

    UPDATE SOLICITUD_TIPO SET solicitudtipoActivo=0 WHERE solicitudtipoId = @pSOLICITUDTIPO_Id
    
	 IF @@ROWCOUNT = 0
		BEGIN
		   select '' as errorDescripcion
		END
	ELSE 
		BEGIN
		   select 'ok' as errorDescripcion
		END

END
