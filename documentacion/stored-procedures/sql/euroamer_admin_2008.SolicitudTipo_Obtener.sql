-- Objeto: euroamer_admin_2008.SolicitudTipo_Obtener
-- Creado en BD: 2013-12-24 08:50:59
-- Modificado en BD: 2025-04-29 05:43:25
-- Extraído: 2026-09-07 08:27:17 UTC
-- Referenciado por el backend .NET: SI
-- Parámetros:
--   @pSOLICITUDTIPO_Id int (IN)
--   @pSOLICITUDTIPO_Activo int (IN)
--   @pSOLICITUDTIPO_PerfilId int (IN)

CREATE PROCEDURE [SolicitudTipo_Obtener]
	@pSOLICITUDTIPO_Id INT = 0,
	@pSOLICITUDTIPO_Activo INT = -1,
	@pSOLICITUDTIPO_PerfilId INT = 0
AS
BEGIN
	
	SET NOCOUNT ON;
--SolicitudTipo_Obtener 0,1,1
	IF @pSOLICITUDTIPO_PerfilId = 0
		BEGIN
			SELECT	solicitudtipoId,
					solicitudtipoAccionId,
					(euroamer_admin_2008.ValorTipo_RecuperarNombre('solicitudtipoAccionId',solicitudtipoAccionId)) as solicitudtipoAccionNombre,
					solicitudtipoNombre,
					solicitudtipoEnviarCorreo,
					solicitudtipoCreadoFecha,
					euroamer_admin_2008.Usuario_RecuperarNombrexID(solicitudtipoCreadoUsuarioId) as solicitudtipoCreadoUsuarioNombre,
					solicitudtipoModificadoFecha,
					euroamer_admin_2008.Usuario_RecuperarNombrexID(solicitudtipoModificadoUsuarioId) as solicitudtipoModificadoUsuarioNombre,
					solicitudtipoActivo
			FROM	SOLICITUD_TIPO
			WHERE	(@pSOLICITUDTIPO_Id = 0 OR solicitudtipoId = @pSOLICITUDTIPO_Id) AND 
					(@pSOLICITUDTIPO_Activo = -1 OR @pSOLICITUDTIPO_Activo = solicitudtipoActivo)
		END
	ELSE
		BEGIN
		    /*
			SELECT	solicitudtipoId,
					solicitudtipoAccionId,
					(euroamer_admin_2008.ValorTipo_RecuperarNombre('solicitudtipoAccionId',solicitudtipoAccionId)) as solicitudtipoAccionNombre,
					solicitudtipoNombre,
					solicitudtipoEnviarCorreo,
					solicitudtipoCreadoFecha,
					euroamer_admin_2008.Usuario_RecuperarNombrexID(solicitudtipoCreadoUsuarioId) as solicitudtipoCreadoUsuarioNombre,
					solicitudtipoModificadoFecha,
					euroamer_admin_2008.Usuario_RecuperarNombrexID(solicitudtipoModificadoUsuarioId) as solicitudtipoModificadoUsuarioNombre,
					solicitudtipoActivo
			FROM	SOLICITUD_TIPO
			WHERE	solicitudtipoActivo = 1 AND
					solicitudtipoId != 4
			UNION*/
			SELECT	solicitudtipoId,
					solicitudtipoAccionId,
					(euroamer_admin_2008.ValorTipo_RecuperarNombre('solicitudtipoAccionId',solicitudtipoAccionId)) as solicitudtipoAccionNombre,
					solicitudtipoNombre,
					solicitudtipoEnviarCorreo,
					solicitudtipoCreadoFecha,
					euroamer_admin_2008.Usuario_RecuperarNombrexID(solicitudtipoCreadoUsuarioId) as solicitudtipoCreadoUsuarioNombre,
					solicitudtipoModificadoFecha,
					euroamer_admin_2008.Usuario_RecuperarNombrexID(solicitudtipoModificadoUsuarioId) as solicitudtipoModificadoUsuarioNombre,
					solicitudtipoActivo
			FROM	SOLICITUD_TIPO
			WHERE	solicitudtipoActivo = 1 AND
					solicitudtipoId in  (SELECT ISNULL(valorTipoId,0) FROM VALORES_TIPO WHERE valorTipoColumnaTabla='solicitudTipoPermiso' AND valorTipoNombre LIKE '%' + CAST(@pSOLICITUDTIPO_PerfilId as VARCHAR) + '%' AND valorTipoActivo=1)
		END    
END
