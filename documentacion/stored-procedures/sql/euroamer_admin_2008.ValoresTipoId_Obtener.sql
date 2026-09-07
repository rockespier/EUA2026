-- Objeto: euroamer_admin_2008.ValoresTipoId_Obtener
-- Creado en BD: 2017-11-22 09:41:27
-- Modificado en BD: 2017-11-22 09:41:27
-- Extraído: 2026-09-07 08:27:17 UTC
-- Referenciado por el backend .NET: SI
-- Parámetros:
--   @pVALORTIPO_ColumnaTabla varchar (IN)
--   @pVALORTIPO_valorTipoId varchar (IN)


CREATE PROCEDURE [euroamer_admin_2008].[ValoresTipoId_Obtener]
	@pVALORTIPO_ColumnaTabla VARCHAR(50),
	@pVALORTIPO_valorTipoId VARCHAR(3)
AS
BEGIN
	
	SET NOCOUNT ON;

	declare @vint_contador integer

	SELECT @vint_contador = count(*)  
	FROM VALORES_TIPO
	WHERE valorTipoColumnaTabla  like @pVALORTIPO_ColumnaTabla +'%'
	AND valorTipoId = @pVALORTIPO_valorTipoId
	
	IF @vint_contador = 0
		begin
			SET @pVALORTIPO_valorTipoId = 0
		end

	SELECT valorTipoId, valorTipoNombre, valorTipoActivo
	FROM VALORES_TIPO
	WHERE valorTipoColumnaTabla  like @pVALORTIPO_ColumnaTabla +'%'
	AND valorTipoId = @pVALORTIPO_valorTipoId
	ORDER BY valorTipoNombre
    
END
