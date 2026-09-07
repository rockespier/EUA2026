-- Objeto: euroamer_admin_2008.Producto_Obtener
-- Creado en BD: 2017-03-25 18:41:08
-- Modificado en BD: 2020-04-22 17:32:38
-- Extraído: 2026-09-07 08:27:16 UTC
-- Referenciado por el backend .NET: NO (revisar si sigue en uso)
-- Parámetros:
--   @pPRODUCTO_Id int (IN)
--   @pPRODUCTO_PaisId int (IN)
--   @pPRODUCTO_Activo int (IN)
--   @pPRODUCTO_GrupalActivo int (IN)
--   @pPRODUCTO_PromocionActivo int (IN)
--   @pPRODUCTO_AgenciaID int (IN)

CREATE PROCEDURE [euroamer_admin_2008].[Producto_Obtener]
    @pPRODUCTO_Id INT = 0,
    @pPRODUCTO_PaisId INT = 0,
    @pPRODUCTO_Activo INT = -1,
    @pPRODUCTO_GrupalActivo INT = -1,
    @pPRODUCTO_PromocionActivo INT = -1,
    @pPRODUCTO_AgenciaID INT = 0
AS
BEGIN
     
    SET NOCOUNT ON;
 
    SELECT  p.productoId,
            p.productoReferenciaId,
            p.productoNombre,
            p.productoServicio,
            p.productoURL,
            p.productoImporteTarifaFija,
            p.productoImporteDiaAdicional,
            p.productoEdadMinima,
            p.productoEdadMaxima,
            p.productoNumeroDias,
            p.productoCreadoFecha,
            euroamer_admin_2008.Usuario_RecuperarNombrexID(p.productoCreadoUsuarioId) as productoCreadoUsuarioNombre,
            p.productoModificadoFecha,
            euroamer_admin_2008.Usuario_RecuperarNombrexID(p.productoModificadoUsuarioId) as productoModificadoUsuarioNombre,
            euroamer_admin_2008.productoTarifa_ObtenerListaPlana(p.productoId) as productoRangos,
            p.productoActivo, p.productoOrdenListado,p.productoActivoWeb,
            p.productoGrupalActivo, p.productoGrupalPorcentaje, p.productoPromocionActivo,
			p.productoImporteCero,p.productoATVCodigo, p.productoMarca
    FROM    PRODUCTO p			
    WHERE   ((@pPRODUCTO_Id = 0 and productoid not in (select valortipoid from valores_tipo where VALORTIPOColumnaTabla='IdDoctorChat')) OR (p.productoId = @pPRODUCTO_Id)) AND
            (@pPRODUCTO_PaisId = 0 OR p.productoPaisId = @pPRODUCTO_PaisId) AND
            (@pPRODUCTO_Activo = -1 OR p.productoActivo = @pPRODUCTO_Activo) AND
            (@pPRODUCTO_GrupalActivo = -1 OR isnull(p.productoGrupalActivo,0) = @pPRODUCTO_GrupalActivo)  AND
            (@pPRODUCTO_PromocionActivo = -1 OR p.productoPromocionActivo = @pPRODUCTO_PromocionActivo)
    ORDER BY p.productoOrdenListado
END
