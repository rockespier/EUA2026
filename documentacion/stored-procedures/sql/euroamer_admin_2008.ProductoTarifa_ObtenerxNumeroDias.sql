-- Objeto: euroamer_admin_2008.ProductoTarifa_ObtenerxNumeroDias
-- Creado en BD: 2013-12-24 08:50:58
-- Modificado en BD: 2013-12-24 08:50:58
-- Extraído: 2026-09-07 08:27:16 UTC
-- Referenciado por el backend .NET: SI
-- Parámetros:
--   @pPRODUCTO_Id int (IN)
--   @pTARIFA_NumeroDias int (IN)

CREATE PROCEDURE [ProductoTarifa_ObtenerxNumeroDias]
(
	@pPRODUCTO_Id INT,
	@pTARIFA_NumeroDias INT
)
AS
BEGIN
	
	SET NOCOUNT ON;

	SELECT	tarifaId, tarifaNumeroDiasMinimo, tarifaNumeroDiasMaximo, tarifaImporte
	FROM	PRODUCTO_TARIFA
	WHERE	tarifaProductoId = @pPRODUCTO_Id AND
			@pTARIFA_NumeroDias BETWEEN tarifaNumeroDiasMinimo AND tarifaNumeroDiasMaximo
END
