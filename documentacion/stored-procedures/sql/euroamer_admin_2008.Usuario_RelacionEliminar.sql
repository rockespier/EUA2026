-- Objeto: euroamer_admin_2008.Usuario_RelacionEliminar
-- Creado en BD: 2017-03-25 18:41:08
-- Modificado en BD: 2025-01-02 06:23:44
-- Extraído: 2026-09-07 08:27:17 UTC
-- Referenciado por el backend .NET: SI
-- Parámetros:
--   @pUSUARIO_PadreId int (IN)
--   @pUSUARIO_PadrePerfilId int (IN)
--   @pUSUARIO_HijoId int (IN)
--   @pUSUARIO_HijoPerfilId int (IN)


CREATE PROCEDURE [Usuario_RelacionEliminar]
		@pUSUARIO_PadreId INT = 0,
	    @pUSUARIO_PadrePerfilId INT = 0,
	    @pUSUARIO_HijoId INT = 0,
	    @pUSUARIO_HijoPerfilId INT = 0
AS
BEGIN

	SET NOCOUNT ON;

    delete from USUARIO_RELACION WHERE usuarioRelacionPadreId = @pUSUARIO_PadreId AND 
		  usuarioRelacionPadrePerfilId = @pUSUARIO_PadrePerfilId AND 
		  usuarioRelacionHijoId = @pUSUARIO_HijoId AND 
		  usuarioRelacionHijoPerfilId = @pUSUARIO_HijoPerfilId 
     IF @@ROWCOUNT = 0
		BEGIN
		   select '' as errorDescripcion
		END
	ELSE 
		BEGIN
		   select 'ok' as errorDescripcion
		END
END
