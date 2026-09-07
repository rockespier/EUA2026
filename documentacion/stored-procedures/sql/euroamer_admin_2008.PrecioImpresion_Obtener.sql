-- Objeto: euroamer_admin_2008.PrecioImpresion_Obtener
-- Creado en BD: 2017-11-18 14:43:08
-- Modificado en BD: 2017-11-18 14:43:08
-- Extraído: 2026-09-07 08:27:16 UTC
-- Referenciado por el backend .NET: SI
-- Parámetros:
--   @pVENTA_Id int (IN)

CREATE PROCEDURE [euroamer_admin_2008].[PrecioImpresion_Obtener]
	@pVENTA_Id INT = 0
AS
BEGIN
	
	SET NOCOUNT ON;

	select paisDocumentoFormato 
      from pais 
      where paisid in (select agenciaPaisId 
                   from agencia 
				  where agenciaid in (select ventaUsuarioAgenciaId 
				                        from venta 
									   where ventaid = @pVENTA_Id))

END
