-- Objeto: euroamer_admin_2008.ProductoTarifaIncentivo_Procesar
-- Creado en BD: 2025-04-02 06:03:29
-- Modificado en BD: 2025-04-02 06:46:15
-- Extraído: 2026-09-07 08:27:16 UTC
-- Referenciado por el backend .NET: SI
-- Parámetros:
--   @pPRODUCTO_Id int (IN)
--   @pTARIFA_Id int (IN)
--   @pTARIFA_NumeroDiasMinimo int (IN)
--   @pTARIFA_NumeroDiasMaximo int (IN)
--   @pTARIFA_Importe decimal (IN)
--   @pTARIFA_Usuario int (IN)
--   @pTARIFA_Incentivo decimal (IN)
--   @pTARIFA_Publicidad decimal (IN)

CREATE PROCEDURE [euroamer_admin_2008].[ProductoTarifaIncentivo_Procesar]
	@pPRODUCTO_Id INT = 0,
	@pTARIFA_Id INT = 0,
	@pTARIFA_NumeroDiasMinimo INT,
	@pTARIFA_NumeroDiasMaximo INT,
	@pTARIFA_Importe DECIMAL(18,4),
	@pTARIFA_Usuario INT,
    @pTARIFA_Incentivo DECIMAL(18,4),
    @pTARIFA_Publicidad DECIMAL(18,4)
AS
BEGIN
	
	declare @tipoproceso int = 0;
	declare @resultado varchar(300) = '';
	declare @FechaHoraActual datetime = [euroamer_admin_2008].[fuObtenerFechaActualPeruana]();

	SET NOCOUNT ON;
		
		set @tipoproceso=2;

			UPDATE PRODUCTO_TARIFA SET
			tarifaModificadoFecha = @FechaHoraActual,
			tarifaModificadoUsuarioId = @pTARIFA_Usuario,
			tarifaIncentivo = @pTARIFA_Incentivo,
			tarifaPublicidad =  @pTARIFA_Publicidad
			WHERE 
			tarifaNumeroDiasMinimo >= @pTARIFA_NumeroDiasMinimo AND
			tarifaNumeroDiasMaximo <= @pTARIFA_NumeroDiasMaximo

			IF @@ROWCOUNT > 0
			BEGIN
				set @resultado = 'ok|'+cast(@pTARIFA_Id as varchar(100));
			END
		
		select @tipoproceso as errorCodigo, @resultado as errorDescripcion
END
