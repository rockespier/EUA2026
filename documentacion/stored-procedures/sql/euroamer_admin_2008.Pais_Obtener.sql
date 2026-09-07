-- Objeto: euroamer_admin_2008.Pais_Obtener
-- Creado en BD: 2014-06-13 22:47:33
-- Modificado en BD: 2025-04-29 08:41:00
-- Extraído: 2026-09-07 08:27:16 UTC
-- Referenciado por el backend .NET: SI
-- Parámetros:
--   @pPAIS_Id int (IN)
--   @pPAIS_Activo int (IN)

CREATE PROCEDURE [euroamer_admin_2008].[Pais_Obtener]
	@pPAIS_Id INT = 0,
	@pPAIS_Activo INT = -1
AS
BEGIN
	--exec Pais_Obtener 0,-1
	SET NOCOUNT ON;

	SELECT	paisId, paisCodigo, upper(paisNombre) paisNombre, paisImpuesto, paisActivo,
			paisImpuestoVenta, upper(paisCorreo) paisCorreo, paisTotalPago, paisDatosEua,
			paisFoto, euroamer_admin_2008.promocionId_Nombres(paisPromocionId), paisCuponDescuento, paisCuponVigenciaId,
			paisDocumentoFormato, paisPromotorDefault,
			[euroamer_admin_2008].Usuario_RecuperarNombre('U',paisPromotorDefault) paisPromotorNombre
	FROM	PAIS
	WHERE	0 = 0 AND
			(@pPAIS_Id = 0 OR paisId = @pPAIS_Id) AND
			(@pPAIS_Activo = -1 OR paisActivo = @pPAIS_Activo)
	ORDER BY paisNombre
END
