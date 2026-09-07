-- Objeto: euroamer_admin_2008.PromocionPais_Obtener
-- Creado en BD: 2017-03-25 18:41:08
-- Modificado en BD: 2025-10-07 02:27:33
-- Extraído: 2026-09-07 08:27:16 UTC
-- Referenciado por el backend .NET: SI
-- Parámetros:
--   @pPROMOCION_Id int (IN)
--   @pPROMOCION_PaisId int (IN)
--   @pPROMOCION_AgenciaId int (IN)
--   @pPROMOCION_productoId int (IN)
--   @pPROMOCION_dias int (IN)

CREATE PROCEDURE [euroamer_admin_2008].[PromocionPais_Obtener]
	@pPROMOCION_Id INT=0,
	@pPROMOCION_PaisId INT = 0,
	@pPROMOCION_AgenciaId INT = 0,
	@pPROMOCION_productoId INT = 0,
    @pPROMOCION_dias INT = 0
AS
BEGIN
    --combo    
	--exec PromocionPais_Obtener 0,1,920,1,30
--
    --listado
    --exec PromocionPais_Obtener 0,1,0,0,0

    --select * from PAIS_PROMOCION where paisPromocionProductoId=1

   SET NOCOUNT ON;        

            select pp.paisPromocionID promocionPromocionID, 'DESCUENTO ' + CONVERT(VARCHAR,paisPromocionDescuento) + '%' promocionNombre, 
	     	pp.paisPromocionPaisID, ltrim(rtrim(upper(ps.PaisNombre))) PaisNombre,
		    pp.paisPromocionAgenciaId agenciaID, ltrim(rtrim(upper(ag.agenciaNombre))) agencia,		   
			pp.paisPromocionProductoId promocionProductoId, ltrim(rtrim(pd.productoNombre)) promocionProductoNombre,
			pp.paisPromocionDiasMin promocionDiasMin,pp.paisPromocionDiasMax promocionDiasMax,pp.paisPromocionDescuento promocionDescuento,
			pp.paisPromocionPasajeroId promocionPasajeroId
           from PAIS_PROMOCION pp
           inner join PAIS ps
           on pp.paisPromocionPaisID=ps.paisid
           inner join AGENCIA ag
           on pp.paisPromocionPaisID = ag.AgenciaPaisID
           and ag.AgenciaActivo=1
           and pp.paisPromocionAgenciaID = ag.agenciaID
           left join PRODUCTO pd
           on pp.paisPromocionProductoId = pd.productoid
           where (@pPROMOCION_Id = 0 OR pp.paisPromocionID = @pPROMOCION_Id) AND
                 (@pPROMOCION_PaisId = 0 OR pp.paisPromocionPaisID = @pPROMOCION_PaisId) AND
                 (@pPROMOCION_AgenciaId = 0 OR (pp.paisPromocionAgenciaId = @pPROMOCION_AgenciaId)) AND
                 (@pPROMOCION_productoId = 0 OR (pp.paisPromocionProductoId = @pPROMOCION_productoId)) AND
                 (@pPROMOCION_dias = 0 OR (pp.paisPromocionDiasMin <= @pPROMOCION_dias and pp.paisPromocionDiasMax >= @pPROMOCION_dias))
          UNION
           select pp.paisPromocionID promocionPromocionID, 'DESCUENTO ' + CONVERT(VARCHAR,paisPromocionDescuento) + '%' promocionNombre, 
	     	pp.paisPromocionPaisID, ltrim(rtrim(upper(ps.PaisNombre))) PaisNombre,
		    pp.paisPromocionAgenciaId AgenciaId, ltrim(rtrim(upper(ag.agenciaNombre))) agencia,		   
			pp.paisPromocionProductoId promocionProductoId, ltrim(rtrim(pd.productoNombre)) promocionProductoNombre,
			pp.paisPromocionDiasMin promocionDiasMin,pp.paisPromocionDiasMax promocionDiasMax,pp.paisPromocionDescuento promocionDescuento,
			pp.paisPromocionPasajeroId promocionPasajeroId
           from PAIS_PROMOCION pp
           inner join PAIS ps
           on pp.paisPromocionPaisID=ps.paisid
           left join AGENCIA ag
           on pp.paisPromocionPaisID = ag.AgenciaPaisID
           and ag.AgenciaActivo=1
           and pp.paisPromocionAgenciaID = ag.agenciaID
           left join PRODUCTO pd
           on pp.paisPromocionProductoId = pd.productoid
           where (@pPROMOCION_Id = 0 OR pp.paisPromocionID = @pPROMOCION_Id) AND
                 (@pPROMOCION_PaisId = 0 OR pp.paisPromocionPaisID = @pPROMOCION_PaisId) AND
                 (pp.paisPromocionAgenciaId = -1) AND
                 (@pPROMOCION_productoId = 0 OR (pp.paisPromocionProductoId = @pPROMOCION_productoId)) AND
                 (@pPROMOCION_dias = 0 OR (pp.paisPromocionDiasMin <= @pPROMOCION_dias and pp.paisPromocionDiasMax >= @pPROMOCION_dias))
           order by 2, 4
	
          
      
END
