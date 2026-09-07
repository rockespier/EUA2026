-- Objeto: euroamer_admin_2008.Venta_ObtenerCorreo
-- Creado en BD: 2014-08-03 18:34:10
-- Modificado en BD: 2018-01-12 09:49:08
-- Extraído: 2026-09-07 08:27:17 UTC
-- Referenciado por el backend .NET: SI
-- Parámetros:
--   @pVENTA_Id int (IN)

CREATE PROCEDURE [euroamer_admin_2008].[Venta_ObtenerCorreo]
	@pVENTA_Id INT 
AS
BEGIN
	
	SET NOCOUNT ON;
	
	SELECT	paisCorreo 
          from venta , agencia, pais
         where ventaid = @pVENTA_Id
           and ventaUsuarioAgenciaId = agenciaid
           and agenciaPaisId = paisid

END

--exec [Venta_ObtenerCorreo] 898347
