-- Objeto: euroamer_admin_2008.VentaSituacion_Actualizar
-- Creado en BD: 2018-07-12 13:19:22
-- Modificado en BD: 2018-07-13 07:13:25
-- Extraído: 2026-09-07 08:27:17 UTC
-- Referenciado por el backend .NET: SI
-- Parámetros:
--   @pIDVoucher int (IN)
--   @pUsuario int (IN)


CREATE PROCEDURE [euroamer_admin_2008].[VentaSituacion_Actualizar]
	@pIDVoucher int,
	@pUsuario int
AS
BEGIN
	
	SET NOCOUNT ON;

    -- Insert statements for procedure here
    UPDATE VENTA set ventaSituacionId = 'C', ventaModificadoFecha = GETDATE(), ventaModificadoUsuarioId = @pUsuario where ventaId = @pIDVoucher
	
END
