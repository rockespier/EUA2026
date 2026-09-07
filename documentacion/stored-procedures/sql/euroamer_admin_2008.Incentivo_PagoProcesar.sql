-- Objeto: euroamer_admin_2008.Incentivo_PagoProcesar
-- Creado en BD: 2025-04-04 06:58:18
-- Modificado en BD: 2025-04-17 05:03:48
-- Extraído: 2026-09-07 08:27:16 UTC
-- Referenciado por el backend .NET: SI
-- Parámetros:
--   @pIncentivoPagoVentaId int (IN)
--   @pIncentivoPagoBeneficiarioId int (IN)
--   @pIncentivoPagoUsuario int (IN)
--   @pIncentivoPagoObservaciones varchar (IN)

CREATE PROCEDURE [euroamer_admin_2008].[Incentivo_PagoProcesar]
        @pIncentivoPagoVentaId int,
    @pIncentivoPagoBeneficiarioId int,
    @pIncentivoPagoUsuario int,
    @pIncentivoPagoObservaciones varchar(100)
AS BEGIN

	SET NOCOUNT ON;
	declare @tipoproceso int = 0;
	declare @resultado varchar(300) = '';
	declare @FechaHoraActual datetime = [euroamer_admin_2008].[fuObtenerFechaActualPeruana]();
	BEGIN TRY

		    set @tipoproceso=1;
			INSERT INTO [euroamer_admin_2008].[INCENTIVO_PAGO](
                    incentivoPagoVentaId,
                    incentivoPagoBeneficiarioId,
                    incentivoPagoFecha,
                    incentivoPagoUsuario,
                    incentivoPagoObservaciones
				    )
			VALUES (
			       @pIncentivoPagoVentaId,
                   @pIncentivoPagoBeneficiarioId,
			       @FechaHoraActual,
                   @pIncentivoPagoUsuario,
                   @pIncentivoPagoObservaciones
				    )
			IF @@ROWCOUNT > 0
				BEGIN
					set @resultado = 'ok';
				END

		select @tipoproceso as errorCodigo, @resultado as errorDescripcion
	END TRY
	BEGIN CATCH

		SELECT
        ERROR_NUMBER() AS errorCodigo
        ,ERROR_MESSAGE() AS errorDescripcion;
	END CATCH
END
