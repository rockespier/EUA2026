-- Objeto: euroamer_admin_2008.ValoresTipo_Eliminar
-- Creado en BD: 2024-12-30 02:47:48
-- Modificado en BD: 2024-12-30 02:49:13
-- Extraído: 2026-09-07 08:27:17 UTC
-- Referenciado por el backend .NET: SI
-- Parámetros:
--   @pVALORTIPO_valorTipoId varchar (IN)
--   @pVALORTIPO_ColumnaTabla varchar (IN)

CREATE PROCEDURE [ValoresTipo_Eliminar]
	@pVALORTIPO_valorTipoId varchar(4),
	@pVALORTIPO_ColumnaTabla varchar(50)
AS
BEGIN

	SET NOCOUNT ON;

    DELETE FROM VALORES_TIPO 
	WHERE valorTipoColumnaTabla = @pVALORTIPO_ColumnaTabla AND valorTipoId = @pVALORTIPO_valorTipoId
	
	IF @@ROWCOUNT = 0
		BEGIN
		   select '' as errorDescripcion
		END
	ELSE 
		BEGIN
		   select 'ok' as errorDescripcion
		END
    
END
