-- Objeto: euroamer_admin_2008.SolicitudAgencia_Obtener
-- Creado en BD: 2014-05-18 21:35:43
-- Modificado en BD: 2014-05-18 21:35:43
-- Extraído: 2026-09-07 08:27:17 UTC
-- Referenciado por el backend .NET: NO (revisar si sigue en uso)
-- Parámetros:
--   @pSOLICITUD_Id int (IN)

CREATE PROCEDURE [SolicitudAgencia_Obtener]
	@pSOLICITUD_Id INT
AS
BEGIN
	
	SET NOCOUNT ON;

        select ventaid,agenciaEmail
        from solicitud, venta , agencia 
        where solicitudVentaId=ventaid
        and ventaUsuarioAgenciaId = agenciaid
        and solicitudId = @pSOLICITUD_Id
    
END
