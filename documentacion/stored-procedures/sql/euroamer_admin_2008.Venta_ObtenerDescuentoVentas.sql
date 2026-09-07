-- Objeto: euroamer_admin_2008.Venta_ObtenerDescuentoVentas
-- Creado en BD: 2025-08-04 04:04:39
-- Modificado en BD: 2025-08-04 04:48:27
-- Extraído: 2026-09-07 08:27:17 UTC
-- Referenciado por el backend .NET: SI
-- Parámetros:
--   @pVENTA_Codigos varchar (IN)

CREATE PROCEDURE [euroamer_admin_2008].[Venta_ObtenerDescuentoVentas]
	@pVENTA_Codigos VARCHAR(1000)
AS
BEGIN
	--exec Venta_ObtenerDescuentoVentas '2267550,2267552'
	SET NOCOUNT ON;
	DECLARE @vQUERY VARCHAR(5000)

	SET @vQUERY = 'select distinct agenciaProductoDescuentoNombre,agenciaProductoDescuentoImporte
                    from AGENCIA_PRODUCTO where getdate() between agenciaProductoDescuentoVigenciaIni and agenciaProductoDescuentoVigenciaFin
                    and ((agenciaProductoProductoID in (select ventaProductoId from venta WHERE	ventaId IN (' + @pVENTA_Codigos + ')))
                    OR
                    (agenciaProductoAgenciaID in (select ventaUsuarioAgenciaId from venta  WHERE	ventaId IN (' + @pVENTA_Codigos + '))))'
	EXEC(@vQUERY)
END
