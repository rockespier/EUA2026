-- Objeto: euroamer_admin_2008.AgenciaDescuento_Reporte
-- Creado en BD: 2025-05-24 10:47:06
-- Modificado en BD: 2025-07-01 03:58:42
-- Extraído: 2026-09-07 08:27:16 UTC
-- Referenciado por el backend .NET: SI
-- Parámetros:
--   @pAGENCIA_Id int (IN)
--   @pFechaInicio date (IN)
--   @pFechaFin date (IN)
--   @pCodLiquidacion int (IN)

CREATE PROCEDURE [euroamer_admin_2008].[AgenciaDescuento_Reporte]
	@pAGENCIA_Id INT = 0,
    @pFechaInicio DATE = '',
	@pFechaFin DATE = '',
    @pCodLiquidacion INT = 0

AS
BEGIN

	SET NOCOUNT ON;

	if @pCodLiquidacion > 0
	begin
	    set @pFechaInicio = (select distinct ventaFechaLiquidacion from VENTA where ventaCodigoLiquidacion = @pCodLiquidacion)
	    set @pFechaFin = @pFechaInicio
	end 

	select isnull(agenciaproductodescuentonombre,'Descuento Especial') agenciaproductodescuentonombre,
	       cast(agenciaProductoDescuentoVigenciaIni as date) agenciaProductoDescuentoRegistroFecha,
	       agenciaProductoDescuentoImporte
	from AGENCIA_PRODUCTO
	where agenciaProductoDescuentoVigenciaIni between @pFechaInicio and @pFechaFin
    and agenciaProductoDescuentoVigenciaFin <= @pFechaFin
    and (@pAGENCIA_Id =0 or agenciaProductoAgenciaID = @pAGENCIA_Id)

END
