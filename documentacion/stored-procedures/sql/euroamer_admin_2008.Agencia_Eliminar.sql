-- Objeto: euroamer_admin_2008.Agencia_Eliminar
-- Creado en BD: 2013-12-24 08:50:57
-- Modificado en BD: 2025-01-02 06:23:39
-- Extraído: 2026-09-07 08:27:16 UTC
-- Referenciado por el backend .NET: SI
-- Parámetros:
--   @pAGENCIA_Id int (IN)

CREATE PROCEDURE [Agencia_Eliminar] 
	@pAGENCIA_Id INT
AS
BEGIN

	SET NOCOUNT ON;

    UPDATE AGENCIA SET agenciaActivo=0 WHERE agenciaId = @pAGENCIA_Id

	IF @@ROWCOUNT = 0
		BEGIN
		   select '' as errorDescripcion
		END
	ELSE 
		BEGIN
		   select 'ok' as errorDescripcion
		END
    
END
