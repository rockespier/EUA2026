-- Objeto: euroamer_admin_2008.Liquidacion_Procesar
-- Creado en BD: 2025-03-11 06:26:40
-- Modificado en BD: 2025-07-07 06:57:34
-- Extraído: 2026-09-07 08:27:16 UTC
-- Referenciado por el backend .NET: SI
-- Parámetros:
--   @pVENTA_Id int (IN)
--   @pVENTA_Comision decimal (IN)
--   @pVENTA_Incentivo decimal (IN)
--   @pVENTA_publicidad decimal (IN)
--   @pVENTA_formulaLiquidacion int (IN)
--   @pVENTA_descuentoImporte decimal (IN)
--   @pVENTA_UsuarioId int (IN)
--   @pVENTA_Pago decimal (IN)
--   @pLiquidacionCodigo int (IN)

CREATE PROCEDURE [euroamer_admin_2008].[Liquidacion_Procesar]
	@pVENTA_Id INT = 0,
	@pVENTA_Comision decimal(18,4),
    @pVENTA_Incentivo decimal(18,4),
    @pVENTA_publicidad decimal(18,4),
    @pVENTA_formulaLiquidacion INT, 
    @pVENTA_descuentoImporte decimal(18,4),
    @pVENTA_UsuarioId INT,
    @pVENTA_Pago decimal(18,4),
    @pLiquidacionCodigo int = 0
AS
BEGIN

    declare @tipoproceso int = 2;
	declare @resultado varchar(300) = '';
    declare @FechaHoraActual datetime = [euroamer_admin_2008].[fuObtenerFechaActualPeruana]();

	SET NOCOUNT ON;

    UPDATE VENTA set ventaComisionImporte = @pVENTA_Comision, ventaIncentivoImporte = @pVENTA_Incentivo,
                     ventaPublicidadImporte = @pVENTA_publicidad,ventaFormulaLiquidacion =@pVENTA_formulaLiquidacion,
                     ventaDescuentoImporte = @pVENTA_descuentoImporte, ventaFechaLiquidacion = @FechaHoraActual,
                     ventaIncentivoModificadoFecha = @FechaHoraActual, ventaIncentivoModificadoUsuario = @pVENTA_UsuarioId,
                     ventaCodigoLiquidacion = @pLiquidacionCodigo, ventaPagarLiquidacion = @pVENTA_Pago
    WHERE ventaId = @pVENTA_Id

    IF @@ROWCOUNT > 0
    BEGIN
        set @resultado = 'ok|';
    END

	select @tipoproceso as errorCodigo, @resultado as errorDescripcion
END
