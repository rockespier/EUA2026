-- Objeto: euroamer_admin_2008.Incentivo_PagoObtener
-- Creado en BD: 2025-04-04 06:58:33
-- Modificado en BD: 2025-07-14 06:49:01
-- Extraído: 2026-09-07 08:27:16 UTC
-- Referenciado por el backend .NET: SI
-- Parámetros:
--   @pIncentivoPagoBeneficiarioId int (IN)
--   @pFechainicio date (IN)
--   @pFechaFin date (IN)

CREATE PROCEDURE [euroamer_admin_2008].[Incentivo_PagoObtener]
	@pIncentivoPagoBeneficiarioId INT = 0,
    @pFechainicio date,
    @pFechaFin date
AS
BEGIN
	--incentivo_PagoObtener 0,'20250101','20250404'
	SET NOCOUNT ON;

	select euroamer_admin_2008.Usuario_RecuperarAgenciaNombre(ventaUsuarioOrigen,ventaUsuarioAgenciaId) as agenciaNombre,
	       ventaCreadoFecha,
    euroamer_admin_2008.Usuario_RecuperarNombreVenta(VENTA.ventaId) as ventaUsuarioAgenciaNombre,
    ventaImporteventa, 
    isnull(ventaIncentivoImporte,0) as ventaIncentivoImporte,
    case when isnull(incentivoPagoVentaId,0) = 0 then 'PENDIENTE' else  'PAGADO' END incentivoEstadoPago,
    incentivoPagoFecha,
    incentivoPagoObservaciones,
    euroamer_admin_2008.Usuario_RecuperarCuentabancaria(ventaUsuarioOrigen,euroamer_admin_2008.Usuario_RecuperarAgenciaId(ventaUsuarioOrigen,ventaCreadoUsuarioId),ventaCreadoUsuarioId) incentivoCuentaBancaria,
    VENTA.ventaId,
    ventaCreadoUsuarioId as beneficiarioId
	from VENTA left join INCENTIVO_PAGO on ventaId = incentivoPagoVentaId, AGENCIA
    where ventaUsuarioAgenciaId = agenciaId
      AND ventaCreadoFecha >= @pFechainicio
      AND ventaCreadoFecha <= @pFechaFin
      AND (@pIncentivoPagoBeneficiarioId = 0 OR ventaCreadoUsuarioId = @pIncentivoPagoBeneficiarioId)
      AND ventaSituacionId = 'C'
      AND ventaEstadoId = 'V'
order by 3,1,2 desc

END
