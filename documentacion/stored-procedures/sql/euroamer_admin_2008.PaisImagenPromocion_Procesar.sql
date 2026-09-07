-- Objeto: euroamer_admin_2008.PaisImagenPromocion_Procesar
-- Creado en BD: 2016-12-09 20:42:05
-- Modificado en BD: 2016-12-09 20:42:05
-- Extraído: 2026-09-07 08:27:16 UTC
-- Referenciado por el backend .NET: SI
-- Parámetros:
--   @pPAISImagen_Id int (IN)
--   @pPAIS_Id int (IN)
--   @pPAIS_Usuario int (IN)
--   @pPAIS_Activo int (IN)
--   @pPAIS_Foto varchar (IN)


create PROCEDURE [euroamer_admin_2008].[PaisImagenPromocion_Procesar]
	@pPAISImagen_Id INT = 0,
	@pPAIS_Id INT = 0,
	@pPAIS_Usuario INT,
	@pPAIS_Activo INT,
	@pPAIS_Foto VARCHAR(1000)
AS
BEGIN
	
	SET NOCOUNT ON;

	IF @pPAISImagen_Id = 0
		BEGIN
			INSERT INTO PAIS_IMAGENPROMOCION (
			[paisImagenPaisId]
           ,[paisImagenActivo]
           ,[paisImagenUrl]
           ,[paisImagenCreadoFecha]
           ,[paisImagenCreadoUsuarioId]
           ,[paisImagenModificadoFecha]
           ,[paisImagenModificadoUsuarioId]) 
			VALUES (
			@pPAIS_Id,
			@pPAIS_Activo, 
			@pPAIS_Foto, 
			GETDATE(),
			@pPAIS_Usuario,
			GETDATE(),
			@pPAIS_Usuario)

			SELECT @pPAISImagen_Id = SCOPE_IDENTITY() 
					
		END
	ELSE
		BEGIN
			UPDATE	PAIS_IMAGENPROMOCION SET 
					[paisImagenActivo] = @pPAIS_Activo,
					[paisImagenModificadoFecha] = GETDATE(),
					[paisImagenModificadoUsuarioId] = @pPAIS_Usuario
			WHERE	[paisImagenId] = @pPAISImagen_Id
		END    
		
			
END
