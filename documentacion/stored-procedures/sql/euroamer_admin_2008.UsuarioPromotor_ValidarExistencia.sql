-- Objeto: euroamer_admin_2008.UsuarioPromotor_ValidarExistencia
-- Creado en BD: 2016-12-09 20:42:05
-- Modificado en BD: 2017-03-13 16:42:59
-- Extraído: 2026-09-07 08:27:17 UTC
-- Referenciado por el backend .NET: SI
-- Parámetros:
--   @pUSUARIO_ID int (IN)

CREATE PROCEDURE [euroamer_admin_2008].[UsuarioPromotor_ValidarExistencia] 
	@pUSUARIO_ID int
AS
BEGIN

	SET NOCOUNT ON;
	
	DECLARE @vExiste INT = 0
	DECLARE @vUsuarioPerfilID INT = 0
	DECLARE @vUsuarioPaisID INT = 0
	
	select @vUsuarioPerfilID =usuarioperfilid, @vUsuarioPaisID = usuariopaisId from  USUARIO where usuarioid= @pUSUARIO_ID;
	--Validar si es promotor
	select @vExiste = count(valortipoid) from VALORES_TIPO where valorTipoColumnaTabla='FiltroPerfilPais' and valortipoid=@vUsuarioPerfilID;
	
	if @vExiste < 1
		begin
		  set @vUsuarioPaisID = 0;
		end
	

	SELECT cast(@vUsuarioPaisID as varchar) + '|' + cast(@vUsuarioPerfilID as varchar) ;
END
