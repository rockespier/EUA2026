-- Objeto: euroamer_admin_2008.VisitasApps_Procesar
-- Creado en BD: 2016-02-21 18:26:49
-- Modificado en BD: 2016-03-15 18:57:31
-- Extraído: 2026-09-07 08:27:17 UTC
-- Referenciado por el backend .NET: NO (revisar si sigue en uso)
-- Parámetros:
--   @pvisitasappsId int (IN)
--   @pvisitasappsVisitasId int (IN)
--   @pvisitasappsLoginID int (IN)
--   @pvisitasappsDesAtencion varchar (IN)
--   @pvisitasappsDejaStock int (IN)
--   @pvisitasappsDejaFolleteria int (IN)
--   @pvisitasappsDesComentarios varchar (IN)
--   @pvisitasappsFechaHora datetime (IN)
--   @pvisitasappsXCoord decimal (IN)
--   @pvisitasappsYCoord decimal (IN)


CREATE PROCEDURE [VisitasApps_Procesar]
	@pvisitasappsId int=0,
	@pvisitasappsVisitasId int=0,
	@pvisitasappsLoginID int=0,
	@pvisitasappsDesAtencion varchar(250)='',
	@pvisitasappsDejaStock int=0,
	@pvisitasappsDejaFolleteria int=0,
	@pvisitasappsDesComentarios varchar(250)='',
	@pvisitasappsFechaHora datetime='',
	@pvisitasappsXCoord decimal(20,8)=0,
	@pvisitasappsYCoord decimal(20,8)=0
AS
BEGIN
	
	SET NOCOUNT ON;

	IF @pvisitasappsId = 0
		BEGIN
		
		DELETE FROM VISITAS_APPS where visitasappsVisitasId=@pvisitasappsVisitasId;
		
		INSERT INTO VISITAS_APPS
				   (visitasappsVisitasId
				   ,visitasappsLoginID
				   ,visitasappsDesAtencion
				   ,visitasappsDejaStock
				   ,visitasappsDejaFolleteria
				   ,visitasappsDesComentarios
				   ,visitasappsFechaHora
				   ,visitasappsXCoord
				   ,visitasappsYCoord
				   ,visitasappsActivo
				   ,visitasappsFechaHoraServidor)
			 VALUES
				   (@pvisitasappsVisitasId
				   ,@pvisitasappsLoginID
				   ,@pvisitasappsDesAtencion
				   ,@pvisitasappsDejaStock
				   ,@pvisitasappsDejaFolleteria
				   ,@pvisitasappsDesComentarios
				   ,@pvisitasappsFechaHora
				   ,@pvisitasappsXCoord
				   ,@pvisitasappsYCoord
				   ,1
				   ,GETDATE())
		END
	ELSE
		BEGIN
			 UPDATE VISITAS_APPS
			   SET [visitasappsVisitasId] = @pvisitasappsVisitasId
				  ,[visitasappsLoginID] = @pvisitasappsLoginID
				  ,[visitasappsDesAtencion] = @pvisitasappsDesAtencion
				  ,[visitasappsDejaStock] = @pvisitasappsDejaStock
				  ,[visitasappsDejaFolleteria] = @pvisitasappsDejaFolleteria
				  ,[visitasappsDesComentarios] = @pvisitasappsDesComentarios
				  ,[visitasappsFechaHora] = @pvisitasappsFechaHora
				  ,visitasappsFechaHoraServidor= GETDATE()
			 WHERE visitasappsId=@pvisitasappsId
		END    
END
