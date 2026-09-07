-- Objeto: euroamer_admin_2008.PaisImagenPromocion_Obtener
-- Creado en BD: 2016-12-09 20:42:05
-- Modificado en BD: 2016-12-09 20:42:05
-- Extraído: 2026-09-07 08:27:16 UTC
-- Referenciado por el backend .NET: SI
-- Parámetros:
--   @pPAISImagen_Id int (IN)
--   @pPAIS_Id int (IN)
--   @pPAIS_Activo int (IN)

CREATE PROCEDURE [euroamer_admin_2008].[PaisImagenPromocion_Obtener]
	@pPAISImagen_Id INT = 0,
	@pPAIS_Id INT = 0,
	@pPAIS_Activo INT = -1
AS
BEGIN
	
	SET NOCOUNT ON;

	SELECT	[paisImagenId]
      ,[paisImagenPaisId]
      ,[paisImagenActivo]
      ,[paisImagenUrl]
      ,[paisImagenCreadoFecha]
      ,[paisImagenCreadoUsuarioId]
      ,[paisImagenModificadoFecha]
      ,[paisImagenModificadoUsuarioId]
	FROM	[PAIS_IMAGENPROMOCION]
	WHERE	0 = 0 AND
			(@pPAISImagen_Id = 0 OR [paisImagenId] = @pPAISImagen_Id) AND
			(@pPAIS_Id = 0 OR [paisImagenPaisId] = @pPAIS_Id) AND
			(@pPAIS_Activo = -1 OR [paisImagenActivo] = @pPAIS_Activo)
	ORDER BY [paisImagenModificadoFecha] asc
END
