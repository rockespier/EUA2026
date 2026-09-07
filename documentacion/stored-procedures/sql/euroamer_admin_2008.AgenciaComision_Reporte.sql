-- Objeto: euroamer_admin_2008.AgenciaComision_Reporte
-- Creado en BD: 2025-05-24 11:01:57
-- Modificado en BD: 2025-07-01 06:00:58
-- Extraído: 2026-09-07 08:27:16 UTC
-- Referenciado por el backend .NET: SI
-- Parámetros:
--   @pAGENCIA_Id int (IN)
--   @pFechaInicio date (IN)
--   @pFechaFin date (IN)
--   @pCodLiquidacion int (IN)

CREATE PROCEDURE [euroamer_admin_2008].[AgenciaComision_Reporte]
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

	select euroamer_admin_2008.valorTipo_RecuperarNombre('DocumentoComision', agenciafacturaTipoDocumento) agenciaFacturaTipoDocumentoNombre,
	       agenciafacturaSerie,agenciafacturaNumero,
	       agenciafacturaFechaEmision,
	       agenciafacturaTotal
	from AGENCIA_FACTURA
    where (@pAGENCIA_Id = 0 or agenciafacturaAgenciaId = @pAGENCIA_Id)
    and agenciafacturaFechaEmision between  @pFechaInicio and  @pFechaFin


END
