-- Objeto: euroamer_admin_2008.Promocion_Obtener
-- Creado en BD: 2017-03-25 18:41:08
-- Modificado en BD: 2018-05-18 05:29:00
-- Extraído: 2026-09-07 08:27:16 UTC
-- Referenciado por el backend .NET: SI
-- Parámetros:
--   @pPROMOCION_Id int (IN)
--   @pPROMOCION_Activo int (IN)
--   @pPROMOCION_PaisId int (IN)
--   @pPROMOCION_AgenciaId int (IN)

CREATE PROCEDURE [euroamer_admin_2008].[Promocion_Obtener]
	@pPROMOCION_Id INT,
	@pPROMOCION_Activo INT = -1,
	@pPROMOCION_PaisId INT = 0,
	@pPROMOCION_AgenciaId INT = 0
AS
BEGIN
	
	SET NOCOUNT ON;
	
		CREATE TABLE #PROMOCION(promocionId INT	)
		
		DECLARE @vPromociones VARCHAR(10)
		DECLARE @vTIPO_Id INT	
		
		--SET @vPromociones = (SELECT paisPromocionId FROM pais WHERE PaisId=@pPROMOCION_PaisId )
		SET @vPromociones = (SELECT DISTINCT  paisPromocionPromocionId FROM pais_promocion 
		                      WHERE paisPromocionPaisId=@pPROMOCION_PaisId 
							  and (@pPROMOCION_AgenciaId=0 or paisPromocionAgenciaId = @pPROMOCION_AgenciaId)
							  UNION
							  SELECT DISTINCT  paisPromocionPromocionId FROM pais_promocion 
		                      WHERE paisPromocionPaisId=@pPROMOCION_PaisId )
		
		DECLARE cursor_infor CURSOR FOR
		SELECT splitdata FROM euroamer_admin_2008.Split(@vPromociones,',')
		
		OPEN cursor_infor;
			FETCH NEXT FROM cursor_infor INTO @vTIPO_Id;
			
			WHILE @@fetch_status = 0
			BEGIN
				INSERT INTO #PROMOCION(promocionId)
				values (@vTIPO_Id)				
				
				FETCH NEXT FROM cursor_infor INTO @vTIPO_Id;
			END
			
			CLOSE cursor_infor;
		DEALLOCATE cursor_infor;
	
	
	SELECT	promocionId, promocionTipo, promocionNombre, promocionClienteCntPagan, promocionClienteCntIngresan,
			promocionCreadoFecha, promocionCreadoUsuarioId,
			promocionModificadoFecha, promocionModificadoUsuarioId,
			promocionActivo
	FROM	PROMOCION
	WHERE	0 = 0 AND
			(@pPROMOCION_Id = 0 OR promocionId = @pPROMOCION_Id) AND
			(@pPROMOCION_Activo = -1 OR promocionActivo = @pPROMOCION_Activo) AND
			(@pPROMOCION_PaisId = 0 OR promocionId in (SELECT promocionId FROM #PROMOCION))			
	ORDER BY promocionNombre

	DROP TABLE #PROMOCION
	
END
