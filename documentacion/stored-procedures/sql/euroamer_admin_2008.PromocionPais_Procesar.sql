-- Objeto: euroamer_admin_2008.PromocionPais_Procesar
-- Creado en BD: 2017-03-25 18:41:08
-- Modificado en BD: 2025-10-07 02:19:46
-- Extraído: 2026-09-07 08:27:16 UTC
-- Referenciado por el backend .NET: SI
-- Parámetros:
--   @pPROMOCION_Id int (IN)
--   @pPROMOCION_PaisId int (IN)
--   @pPROMOCION_AgenciaId int (IN)
--   @pPROMOCION_ProductoId int (IN)
--   @pPROMOCION_DiasMin int (IN)
--   @pPROMOCION_DiasMax int (IN)
--   @pPROMOCION_Descuento decimal (IN)
--   @pPROMOCION_Pasajero int (IN)

CREATE PROCEDURE [PromocionPais_Procesar]
	@pPROMOCION_Id INT=0,
	@pPROMOCION_PaisId INT = 0,
	@pPROMOCION_AgenciaId INT = 0,
	@pPROMOCION_ProductoId INT = 0,	
	@pPROMOCION_DiasMin INT = 0,
	@pPROMOCION_DiasMax INT = 0,
	@pPROMOCION_Descuento DECIMAL = 0,
    @pPROMOCION_Pasajero INT = 0

AS
BEGIN
	--
	SET NOCOUNT ON;
	declare @wCantExiste as integer=0;	
	declare @tipoproceso int = 0;
	declare @resultado varchar(300) = '';		

    select @wCantExiste = COUNT(*) from PAIS_PROMOCION 
                            where paisPromocionId =  @pPROMOCION_Id                               
		
    set @tipoproceso=1;
	
            IF @wCantExiste = 1
                BEGIN
                    set @tipoproceso=2;
                    
                    UPDATE PAIS_PROMOCION SET
                    paisPromocionAgenciaId = @pPROMOCION_AgenciaId,
                    paisPromocionProductoId = @pPROMOCION_ProductoId,
                    paisPromocionDiasMin = @pPROMOCION_DiasMin,
                    paisPromocionDiasMax = @pPROMOCION_DiasMax,
                    paisPromocionDescuento = @pPROMOCION_Descuento,
                    paisPromocionPasajeroId = @pPROMOCION_Pasajero
                    where  paisPromocionId =  @pPROMOCION_Id
                    
                    IF @@ROWCOUNT > 0
                            BEGIN
                                set @resultado = 'ok'
                            END
                            
                END
			ELSE
			       begin 
                        INSERT INTO PAIS_PROMOCION (			 
                        paisPromocionPaisID,
                        paisPromocionAgenciaId,
                        paisPromocionProductoId,
                        paisPromocionDiasMin,
                        paisPromocionDiasMax,
                        paisPromocionDescuento,
                        paisPromocionPasajeroId) 
                        VALUES (			
                        @pPROMOCION_PaisId,
                        @pPROMOCION_AgenciaId,
                        @pPROMOCION_ProductoId,
                        @pPROMOCION_DiasMin,
                        @pPROMOCION_DiasMax,
                        @pPROMOCION_Descuento,
                        @pPROMOCION_Pasajero)
                        IF @@ROWCOUNT > 0
                            BEGIN
                                set @resultado = 'ok'
                            END
		            end
		select @tipoproceso as errorCodigo, @resultado as errorDescripcion
END
