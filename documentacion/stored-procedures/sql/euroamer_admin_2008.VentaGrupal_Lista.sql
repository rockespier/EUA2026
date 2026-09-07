-- Objeto: euroamer_admin_2008.VentaGrupal_Lista
-- Creado en BD: 2018-08-08 09:26:11
-- Modificado en BD: 2020-12-10 03:51:11
-- Extraído: 2026-09-07 08:27:17 UTC
-- Referenciado por el backend .NET: SI
-- Parámetros:
--   @pVENTA_GrupalId int (IN)

CREATE PROCEDURE [euroamer_admin_2008].[VentaGrupal_Lista]
	@pVENTA_GrupalId INT
AS
BEGIN
	
	SET NOCOUNT ON;

	SELECT	v.ventaId, 
			(SELECT valorTipoNombre FROM VALORES_TIPO WHERE valorTipoColumnaTabla='ventaClienteDocumentoTipoId' AND valorTipoId=v.ventaClienteDocumentoTipoId) as ventaClienteDocumentoTipoNombre, 
			v.ventaClienteDocumentoNumero, 
			v.ventaClienteNombres, 
			v.ventaClienteApellidos,			
			p.productoNombre,
			v.ventaNumeroDias,
			v.ventaProductoImporte,
			v.ventaFechaVigenciaInicio,
			v.ventaFechaVigenciaFin
	FROM	VENTA v join PRODUCTO P on v.ventaProductoId = p.productoId
	WHERE	(v.ventaGrupalId = @pVENTA_GrupalId OR v.ventaId=@pVENTA_GrupalId);

END
