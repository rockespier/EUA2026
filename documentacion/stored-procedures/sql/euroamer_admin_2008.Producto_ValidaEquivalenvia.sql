-- Objeto: euroamer_admin_2008.Producto_ValidaEquivalenvia
-- Creado en BD: 2016-02-15 21:13:38
-- Modificado en BD: 2016-12-29 15:50:05
-- Extraído: 2026-09-07 08:27:16 UTC
-- Referenciado por el backend .NET: SI
-- Parámetros:
--   @pPRODUCTO_EquivalenciaId varchar (IN)


CREATE PROCEDURE [Producto_ValidaEquivalenvia]
	@pPRODUCTO_EquivalenciaId VARCHAR(20)
AS
BEGIN
	SET NOCOUNT ON;

	SELECT top 1 productoId
	FROM PRODUCTO
	WHERE productoATVCodigo = @pPRODUCTO_EquivalenciaId AND productoActivo = 1

END
