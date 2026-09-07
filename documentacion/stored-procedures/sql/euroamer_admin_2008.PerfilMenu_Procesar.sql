-- Objeto: euroamer_admin_2008.PerfilMenu_Procesar
-- Creado en BD: 2013-12-24 08:50:58
-- Modificado en BD: 2025-01-17 09:30:49
-- Extraído: 2026-09-07 08:27:16 UTC
-- Referenciado por el backend .NET: SI
-- Parámetros:
--   @pPERFIL_Id int (IN)
--   @pMENU_Id int (IN)

CREATE PROCEDURE [euroamer_admin_2008].[PerfilMenu_Procesar]
	@pPERFIL_Id INT,
	@pMENU_Id INT
AS
BEGIN
	
	declare @tipoproceso int = 0;
	declare @resultado varchar(300) = '';
	declare @FechaHoraActual datetime = [euroamer_admin_2008].[fuObtenerFechaActualPeruana]();

	SET NOCOUNT ON;

	set @tipoproceso=1;

    INSERT INTO PERFIL_MENU (
		perfilId, 
		menuId, 
		menuVisible
	) 
    VALUES (
		@pPERFIL_Id, 
		@pMENU_Id,
		1
	)	
	
		IF @@ROWCOUNT > 0
		BEGIN
			set @resultado = 'ok';
		END

		select @tipoproceso as errorCodigo, @resultado as errorDescripcion

END
