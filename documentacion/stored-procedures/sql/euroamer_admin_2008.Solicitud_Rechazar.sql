-- Objeto: euroamer_admin_2008.Solicitud_Rechazar
-- Creado en BD: 2013-12-24 08:50:58
-- Modificado en BD: 2013-12-24 08:50:58
-- Extraído: 2026-09-07 08:27:16 UTC
-- Referenciado por el backend .NET: SI
-- Parámetros:
--   @pSOLICITUD_Id int (IN)
--   @pSOLICITUD_Usuario int (IN)

CREATE PROCEDURE [Solicitud_Rechazar]
	@pSOLICITUD_Id INT,
	@pSOLICITUD_Usuario INT
AS
BEGIN
	
	SET NOCOUNT ON;

	UPDATE	SOLICITUD SET
			solicitudEstadoId = 'X',
			solicitudAtendidoUsuarioId = @pSOLICITUD_Usuario,
			solicitudAtendidoFecha = GETDATE()
	WHERE	solicitudId = @pSOLICITUD_Id
END
