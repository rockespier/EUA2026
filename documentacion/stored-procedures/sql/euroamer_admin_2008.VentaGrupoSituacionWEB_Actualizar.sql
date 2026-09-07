-- Objeto: euroamer_admin_2008.VentaGrupoSituacionWEB_Actualizar
-- Creado en BD: 2020-12-10 03:59:13
-- Modificado en BD: 2020-12-10 03:59:13
-- Extraído: 2026-09-07 08:27:17 UTC
-- Referenciado por el backend .NET: SI
-- Parámetros:
--   @pIDGrupo int (IN)
--   @pUsuario int (IN)


CREATE PROCEDURE [euroamer_admin_2008].[VentaGrupoSituacionWEB_Actualizar]
	@pIDGrupo int,
	@pUsuario int
AS
BEGIN
	
	SET NOCOUNT ON;

    UPDATE VENTA set ventaSituacionId = 'C', ventaModificadoFecha = GETDATE(), ventaModificadoUsuarioId = @pUsuario, ventaEstadoId='V' 
	where (ventaGrupalId = @pIDGrupo OR ventaId=@pIDGrupo)
	
END
