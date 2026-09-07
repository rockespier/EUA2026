-- Objeto: euroamer_admin_2008.Visitas_Procesar
-- Creado en BD: 2016-02-21 18:26:49
-- Modificado en BD: 2016-02-21 18:26:49
-- Extraído: 2026-09-07 08:27:17 UTC
-- Referenciado por el backend .NET: NO (revisar si sigue en uso)
-- Parámetros:
--   @pvisitas_Id int (IN)
--   @pvisitas_UsuarioOrigenID int (IN)
--   @pvisitas_AgenciaID int (IN)
--   @pvisitas_FechaVenta date (IN)
--   @pvisitas_OrdenPrioridad int (IN)

CREATE PROCEDURE [Visitas_Procesar]
	@pvisitas_Id INT = 0,
	@pvisitas_UsuarioOrigenID int,
	@pvisitas_AgenciaID int,
	@pvisitas_FechaVenta date,
	@pvisitas_OrdenPrioridad int
AS
BEGIN
	
	SET NOCOUNT ON;

	IF @pVISITAS_Id = 0
		BEGIN
			INSERT INTO VISITAS 
			(visitasUsuarioOrigenID
           ,visitasAgenciaID
           ,visitasFechaVenta
           ,visitasOrdenPrioridad
           ,visitasActivo)
     VALUES
           (@pvisitas_UsuarioOrigenID
           ,@pvisitas_AgenciaID
           ,@pvisitas_FechaVenta
           ,@pvisitas_OrdenPrioridad
           ,1)
		END
	ELSE
		BEGIN
			UPDATE VISITAS
			   SET visitasUsuarioOrigenID = @pvisitas_UsuarioOrigenID
				  ,visitasAgenciaID = @pvisitas_AgenciaID
				  ,visitasFechaVenta = @pvisitas_FechaVenta
				  ,visitasOrdenPrioridad = @pvisitas_OrdenPrioridad
			 WHERE visitasId = @pVISITAS_Id
		END    
END
