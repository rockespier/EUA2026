-- Objeto: euroamer_admin_2008.ProductoBeneficio_Obtener
-- Creado en BD: 2014-08-23 10:52:35
-- Modificado en BD: 2025-01-25 07:34:10
-- Extraído: 2026-09-07 08:27:16 UTC
-- Referenciado por el backend .NET: SI
-- Parámetros:
--   @pPRODUCTO_Id int (IN)
--   @pbeneficio_Id int (IN)
--   @pIdioma int (IN)

CREATE PROCEDURE [euroamer_admin_2008].[ProductoBeneficio_Obtener]
(
	@pPRODUCTO_Id INT,
	@pbeneficio_Id INT = 0,
        @pIdioma INT = 1    
)
AS
BEGIN
	--exec ProductoBeneficio_Obtener 582,0,1
	SET NOCOUNT ON;

	SELECT	beneficioId, 
			beneficioNombre, 
			beneficioImporte, 			
			beneficioCreadoFecha,
			euroamer_admin_2008.Usuario_RecuperarNombrexID(beneficioCreadoUsuarioId) as beneficioCreadoUsuarioNombre,
			beneficioModificadoFecha,
			euroamer_admin_2008.Usuario_RecuperarNombrexID(beneficioModificadoUsuarioId) as beneficioModificadoUsuarioNombre,
            beneficioIdiomaId,
            euroamer_admin_2008.ValorTipo_RecuperarNombre('beneficioIdioma',beneficioIdiomaId) beneficioIdiomaNombre,
			case beneficioOrden when 0 then 99 else beneficioOrden end beneficioOrden
	FROM	PRODUCTO_beneficio
	WHERE	beneficioProductoId = @pPRODUCTO_Id AND
			(@pbeneficio_Id = 0 OR beneficioId = @pbeneficio_Id) AND
                        (@pIdioma = 0 OR beneficioIdiomaId = @pIdioma)
    order by 10
END
