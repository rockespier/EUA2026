-- Objeto: euroamer_admin_2008.AgenciaProducto_Obtener
-- Creado en BD: 2025-04-15 03:23:33
-- Modificado en BD: 2025-07-03 07:23:50
-- Extraído: 2026-09-07 08:27:16 UTC
-- Referenciado por el backend .NET: SI
-- Parámetros:
--   @pAGENCIA_Id int (IN)
--   @pAGENCIA_ProductoId int (IN)
--   @pAGENCIA_PaisId int (IN)
--   @pID int (IN)

CREATE PROCEDURE [euroamer_admin_2008].[AgenciaProducto_Obtener]
	@pAGENCIA_Id INT = 0,
	@pAGENCIA_ProductoId INT = 0,
    @pAGENCIA_PaisId INT = 0,
    @pID INT = 0
AS
BEGIN

	SET NOCOUNT ON;
	--exec AgenciaProducto_Obtener 920,0,1

	SELECT agenciaNombre agenciaProductoAgenciaNombre,
	       ISNULL(productoNombre,'NO ASIGNADO') agenciaProductoProductoNombre,
	       valorTipoNombre agenciaProductoDescuentoTipoNombre,
	       agenciaProductoDescuentoImporte,
	       agenciaProductoDescuentoVigenciaIni,
	       agenciaProductoDescuentoVigenciaFin,
	       agenciaProductoAgenciaId,
	       agenciaProductoProductoId,
	       agenciaProductoDescuentoTipo,
	       agenciaProductoDescuentoNombre,
	       agenciaProductoID
	from AGENCIA_PRODUCTO AP 
	INNER JOIN AGENCIA A
	ON AP.agenciaProductoAgenciaID = A.agenciaId
	and A.agenciaActivo=1
	INNER JOIN VALORES_TIPO V
	ON AP.agenciaProductoDescuentoTipo = V.valortipoid AND
	      V.valorTipoColumnaTabla = 'TipoDescuento' AND
	      V.valorTipoActivo = 1 
	LEFT JOIN PRODUCTO P
	ON AP.agenciaProductoProductoID = P.productoId
	where (@pAGENCIA_Id = 0 or agenciaProductoAgenciaID = @pAGENCIA_Id) AND
	      (@pAGENCIA_ProductoId = 0 or agenciaProductoProductoID = @pAGENCIA_ProductoId) AND
	      (@pAGENCIA_PaisId = 0 or agenciaPaisId = @pAGENCIA_PaisId) AND
	      (@pID = 0 or agenciaProductoID = @pID)

END
