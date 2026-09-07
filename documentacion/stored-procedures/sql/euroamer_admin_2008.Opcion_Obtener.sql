-- Objeto: euroamer_admin_2008.Opcion_Obtener
-- Creado en BD: 2026-05-14 04:48:53
-- Modificado en BD: 2026-08-19 03:16:49
-- Extraído: 2026-09-07 08:27:16 UTC
-- Referenciado por el backend .NET: NO (revisar si sigue en uso)
-- Parámetros:
--   @pOPCION_Id int (IN)

CREATE PROCEDURE [euroamer_admin_2008].[Opcion_Obtener]
	@pOPCION_Id INT = 0
AS
BEGIN
	--exec Opcion_Obtener 2
	SET NOCOUNT ON;

	SELECT	id_opcion,des_opcion,img_opcion,url_destino
	FROM	opciones
	WHERE	(@pOPCION_Id = 0 OR id_opcion = @pOPCION_Id)
	ORDER BY num_orden
END
