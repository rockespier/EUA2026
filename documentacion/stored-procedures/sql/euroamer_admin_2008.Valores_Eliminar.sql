-- Objeto: euroamer_admin_2008.Valores_Eliminar
-- Creado en BD: 2025-01-17 07:41:17
-- Modificado en BD: 2025-01-17 07:55:52
-- Extraído: 2026-09-07 08:27:17 UTC
-- Referenciado por el backend .NET: SI
-- Parámetros:
--   @pVALOR_CampoTabla varchar (IN)
--   @pVALOR_valorId varchar (IN)

CREATE PROCEDURE [Valores_Eliminar]
	@pVALOR_CampoTabla VARCHAR(25),
	@pVALOR_valorId VARCHAR(3) = ''
AS
BEGIN
	--exec Valores_Eliminar 'SOLICITUDTIPOACCIONID','E'
	SET NOCOUNT ON;
	
	DELETE FROM VALORES_TIPO WHERE upper(valorTipoColumnaTabla) = @pVALOR_CampoTabla AND valorTipoId = @pVALOR_valorId
	
	IF @@ROWCOUNT = 0
		BEGIN
		   select '' as descripcion
		END
	ELSE 
		BEGIN
		   select 'ok' as descripcion
		END
    
END
