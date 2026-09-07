-- Objeto: euroamer_admin_2008.Cobranza_PagoVerificarProcesar
-- Creado en BD: 2025-03-25 06:22:02
-- Modificado en BD: 2025-07-09 07:58:33
-- Extraído: 2026-09-07 08:27:16 UTC
-- Referenciado por el backend .NET: SI
-- Parámetros:
--   @pCOBRANZAPAGO_CobranzaId int (IN)
--   @pCOBRANZAPAGO_EstadoId int (IN)

CREATE PROCEDURE [euroamer_admin_2008].[Cobranza_PagoVerificarProcesar]
	@pCOBRANZAPAGO_CobranzaId INT = 0,
    @pCOBRANZAPAGO_EstadoId INT = 0 --2 Pago verificado | 3 pago rechazado
AS
BEGIN
	--Cobranza_PagoVerificarprocesar 138568,2
	SET NOCOUNT ON;

	declare @tipoproceso int = 0;
	declare @resultado varchar(300) = '';
	declare @FechaHoraActual datetime = [euroamer_admin_2008].[fuObtenerFechaActualPeruana]();
	declare @importePagado decimal(8,4)
	declare @importeVenta decimal(8,4)

	BEGIN TRY
		BEGIN TRANSACTION

		    set @tipoproceso=2;

            update COBRANZA_PAGO
		    set cobranzapagoEstadoId = @pCOBRANZAPAGO_EstadoId
		    where cobranzapagoId = @pCOBRANZAPAGO_CobranzaId

		    IF @@ROWCOUNT > 0
                BEGIN
                    set @resultado = 'ok'
                END
		    
		    if @pCOBRANZAPAGO_EstadoId = 2
		      begin  
                    set @importePagado = (select sum(cobranzapagoImporte) from COBRANZA_PAGO where cobranzapagoCobranzaId = @pCOBRANZAPAGO_CobranzaId)
                    set @importeVenta = (select cobranzaimportepago from COBRANZA where cobranzaId = @pCOBRANZAPAGO_CobranzaId)
                     
                    print 'pagado ' + convert(varchar,@importePagado)
                    print 'venta ' + convert(varchar,@importeVenta)
                    
                    if @importePagado >= @importeVenta
                        begin
                            --Cancelar las ventas
                            print 'cancelar ventas'

                            update VENTA set ventaSituacionId='C', ventaModificadoFecha= @FechaHoraActual
                            where ventaid in (select cobranzadetalleVentaId from COBRANZA_DETALLE where cobranzaId = @pCOBRANZAPAGO_CobranzaId)
                            and ventaSituacionId in ('P','A')        
                            
                            IF @@ROWCOUNT > 0
                            BEGIN
                                set @resultado = 'ok'
                            END

                        end
                    else
                        begin 
                            if @importePagado < @importeVenta                                
                            begin
                                print 'amortizar ventas'
                                --amortizar las ventas
                                update VENTA set ventaSituacionId='A', ventaModificadoFecha= @FechaHoraActual
                                where ventaid in (select cobranzadetalleVentaId from COBRANZA_DETALLE where cobranzaId = @pCOBRANZAPAGO_CobranzaId)
                                and ventaSituacionId in ('P','A')
                                
                                IF @@ROWCOUNT > 0
                                BEGIN
                                    set @resultado = 'ok'
                                END
                            end
                        end
		        end

	        

        COMMIT TRANSACTION
		select @tipoproceso as errorCodigo, @resultado as errorDescripcion
	END TRY
	BEGIN CATCH

		SELECT
        ERROR_NUMBER() AS errorCodigo
        ,ERROR_MESSAGE() AS errorDescripcion;

		ROLLBACK TRANSACTION

	END CATCH
END
