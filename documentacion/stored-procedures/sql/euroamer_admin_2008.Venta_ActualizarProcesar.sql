-- Objeto: euroamer_admin_2008.Venta_ActualizarProcesar
-- Creado en BD: 2025-10-21 09:28:50
-- Modificado en BD: 2026-03-19 10:10:50
-- Extraído: 2026-09-07 08:27:17 UTC
-- Referenciado por el backend .NET: SI
-- Parámetros:
--   @pVENTA_Id int (IN)
--   @pVENTA_ImporteComision decimal (IN)
--   @pVENTA_ImporteIncentivo decimal (IN)
--   @pVENTA_ImportePorPagar decimal (IN)
--   @pVENTA_FechaCancelacion date (IN)
--   @pVENTA_Usuario int (IN)
--   @pVENTA_Observacion varchar (IN)

CREATE PROCEDURE [Venta_ActualizarProcesar]
	@pVENTA_Id INT = 0,
	@pVENTA_ImporteComision DECIMAL(18,4),
    @pVENTA_ImporteIncentivo DECIMAL(18,4),
    @pVENTA_ImportePorPagar DECIMAL(18,4),
    @pVENTA_FechaCancelacion DATE,
	@pVENTA_Usuario INT,
    @pVENTA_Observacion VARCHAR(500)
AS
BEGIN

	SET NOCOUNT ON;

	declare @vCodLiquidacion INT
    declare @tipoproceso int = 0;
	--exec Venta_ActualizarProcesar 3020247,7.22,6,12.38,'2026-03-02',0,'pruebazzz'
	IF @pVENTA_Id > 0

		BEGIN
		    set @vCodLiquidacion = (select ventaCodigoLiquidacion from venta where ventaId = @pVENTA_Id)
		    set @tipoproceso=2;
		    if @vCodLiquidacion > 0 
		        begin
                    update COBRANZA set cobranzaPagoFecha =  @pVENTA_FechaCancelacion
                    where cobranzaCodigoLiquidacion = @vCodLiquidacion
                      and cobranzaActivo=1
                end
		        
			UPDATE VENTA SET
				ventaComisionImporte = @pVENTA_ImporteComision,
				ventaIncentivoImporte = @pVENTA_ImporteIncentivo,
				ventaPagarLiquidacion = @pVENTA_ImportePorPagar,
				ventaModificadoUsuarioId = @pVENTA_Usuario,
				ventaModificadoFecha = GETDATE(),
				ventaObservacion = @pVENTA_Observacion
			WHERE ventaId = @pVENTA_Id;

		   

		END

   /* IF @@ROWCOUNT = 0
		BEGIN
			select @tipoproceso as codigo, '' as descripcion
		END
	ELSE 
		BEGIN*/
			select @tipoproceso as codigo, 'ok' as descripcion
		/*END*/

END;
