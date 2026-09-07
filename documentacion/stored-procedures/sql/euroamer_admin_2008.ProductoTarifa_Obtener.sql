-- Objeto: euroamer_admin_2008.ProductoTarifa_Obtener
-- Creado en BD: 2013-12-24 08:50:58
-- Modificado en BD: 2025-01-29 09:37:03
-- Extraído: 2026-09-07 08:27:16 UTC
-- Referenciado por el backend .NET: SI
-- Parámetros:
--   @pPRODUCTO_Id int (IN)
--   @pTARIFA_Id int (IN)

CREATE PROCEDURE [euroamer_admin_2008].[ProductoTarifa_Obtener]
(
	@pPRODUCTO_Id INT,
	@pTARIFA_Id INT = 0
)
AS
BEGIN
	--exec ProductoTarifa_Obtener 1,0
	SET NOCOUNT ON;

	SELECT	tarifaId, 
			tarifaNumeroDiasMinimo, 
			tarifaNumeroDiasMaximo, 
			tarifaImporte,
			tarifaCreadoFecha,
			euroamer_admin_2008.Usuario_RecuperarNombrexID(tarifaCreadoUsuarioId) as tarifaCreadoUsuarioNombre,
			tarifaModificadoFecha,
			euroamer_admin_2008.Usuario_RecuperarNombrexID(tarifaModificadoUsuarioId) as tarifaModificadoUsuarioNombre,
isnull(tarifaIncentivo,0) tarifaIncentivo,(isnull(tarifaIncentivo,0) * 1.5) tarifaIncentivoMedio,isnull(tarifaPublicidad,0) tarifaPublicidad
	FROM	PRODUCTO_TARIFA
	WHERE	tarifaProductoId = @pPRODUCTO_Id AND
			(@pTARIFA_Id = 0 OR tarifaId = @pTARIFA_Id)
    order by tarifaNumeroDiasMinimo
END
