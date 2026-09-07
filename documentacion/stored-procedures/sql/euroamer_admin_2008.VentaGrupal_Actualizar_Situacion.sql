-- Objeto: euroamer_admin_2008.VentaGrupal_Actualizar_Situacion
-- Creado en BD: 2018-08-07 06:53:51
-- Modificado en BD: 2018-08-07 06:53:51
-- Extraído: 2026-09-07 08:27:17 UTC
-- Referenciado por el backend .NET: SI
-- Parámetros:
--   @pIDVentaGrupal int (IN)
--   @pUsuario int (IN)


create PROCEDURE [VentaGrupal_Actualizar_Situacion]
	@pIDVentaGrupal int,
	@pUsuario int
AS
BEGIN
	
	SET NOCOUNT ON;

    -- Insert statements for procedure here
    UPDATE VENTA set ventaSituacionId = 'C', ventaModificadoFecha = GETDATE(), ventaModificadoUsuarioId = @pUsuario where ventaGrupalId = @pIDVentaGrupal
	
END
