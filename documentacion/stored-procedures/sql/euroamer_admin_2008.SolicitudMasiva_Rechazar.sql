-- Objeto: euroamer_admin_2008.SolicitudMasiva_Rechazar
-- Creado en BD: 2017-03-25 18:41:08
-- Modificado en BD: 2025-02-26 09:11:56
-- Extraído: 2026-09-07 08:27:17 UTC
-- Referenciado por el backend .NET: SI
-- Parámetros:
--   @pSOLICITUDMasvia_Ids varchar (IN)
--   @pSOLICITUD_Usuario int (IN)

CREATE PROCEDURE [euroamer_admin_2008].[SolicitudMasiva_Rechazar]
	@pSOLICITUDMasvia_Ids varchar(5000),
	@pSOLICITUD_Usuario INT
AS
BEGIN
	SET NOCOUNT ON;
		declare @tipoproceso int = 0;
	declare @resultado varchar(300) = '';
	declare @FechaHoraActual datetime = [euroamer_admin_2008].[fuObtenerFechaActualPeruana]();
	DECLARE @pSOLICITUD_Id INT;
	
	Declare cur_Select Cursor for select item from euroamer_admin_2008.fnSplit2(@pSOLICITUDMasvia_Ids,',');
	Open cur_Select;
	Fetch next from cur_Select into @pSOLICITUD_Id
	While @@fetch_status = 0
		Begin
				UPDATE	SOLICITUD SET
						solicitudEstadoId = 'X',
						solicitudAtendidoUsuarioId = @pSOLICITUD_Usuario,
						solicitudAtendidoFecha =@FechaHoraActual
				WHERE	solicitudId = @pSOLICITUD_Id
				IF @@ROWCOUNT > 0
					BEGIN
						set @resultado = 'ok'
					END
		fetch next from cur_Select into @pSOLICITUD_Id;
		End

	Close cur_Select;
	Deallocate cur_Select;	
	
	select @tipoproceso as errorCodigo, @resultado as errorDescripcion
END
