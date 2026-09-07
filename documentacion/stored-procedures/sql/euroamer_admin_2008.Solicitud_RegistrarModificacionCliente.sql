-- Objeto: euroamer_admin_2008.Solicitud_RegistrarModificacionCliente
-- Creado en BD: 2014-01-28 20:00:59
-- Modificado en BD: 2025-01-02 08:57:21
-- Extraído: 2026-09-07 08:27:16 UTC
-- Referenciado por el backend .NET: SI
-- Parámetros:
--   @pSOLICITUD_VentaId int (IN)
--   @pSOLICITUD_ClienteDocumentoTipoId varchar (IN)
--   @pSOLICITUD_ClienteDocumentoNumero varchar (IN)
--   @pSOLICITUD_ClienteNombres varchar (IN)
--   @pSOLICITUD_ClienteApellidos varchar (IN)
--   @pSOLICITUD_ClienteFechaNacimiento date (IN)
--   @pSOLICITUD_ClienteEdad int (IN)
--   @pSOLICITUD_ClienteEmail varchar (IN)
--   @pSOLICITUD_ClienteDireccion varchar (IN)
--   @pSOLICITUD_ClienteTelefono varchar (IN)
--   @pSOLICITUD_ClienteDistrito varchar (IN)
--   @pSOLICITUD_ClienteCiudad varchar (IN)
--   @pSOLICITUD_ClientePais varchar (IN)
--   @pSOLICITUD_Motivo text (IN)
--   @pSOLICITUD_Usuario int (IN)


CREATE PROCEDURE [Solicitud_RegistrarModificacionCliente]
	@pSOLICITUD_VentaId INT,
	@pSOLICITUD_ClienteDocumentoTipoId VARCHAR(3),
	@pSOLICITUD_ClienteDocumentoNumero VARCHAR(50),
	@pSOLICITUD_ClienteNombres VARCHAR(50),
	@pSOLICITUD_ClienteApellidos VARCHAR(80),
	@pSOLICITUD_ClienteFechaNacimiento DATE,
	@pSOLICITUD_ClienteEdad INT,
	@pSOLICITUD_ClienteEmail VARCHAR(100),
	@pSOLICITUD_ClienteDireccion VARCHAR(255),
	@pSOLICITUD_ClienteTelefono VARCHAR(50),
	@pSOLICITUD_ClienteDistrito VARCHAR(50),
	@pSOLICITUD_ClienteCiudad VARCHAR(50),
	@pSOLICITUD_ClientePais VARCHAR(50),
	@pSOLICITUD_Motivo TEXT='',
	@pSOLICITUD_Usuario INT
AS
BEGIN
	
	SET NOCOUNT ON;
	declare @tipoproceso int = 0;
declare @resultado varchar(300) = '';
declare @FechaHoraActual datetime = [euroamer_admin_2008].[fuObtenerFechaActualPeruana]();
	INSERT INTO SOLICITUD (
		solicitudVentaId,
		solicitudTipoId,
		solicitudEstadoId,
		solicitudClienteDocumentoTipoId,
		solicitudClienteDocumentoNumero,
		solicitudClienteNombres,
		solicitudClienteApellidos,
		solicitudClienteFechaNacimiento,
		solicitudClienteEdad,
		solicitudClienteEmail,
		solicitudClienteDireccion,
		solicitudClienteTelefono,
		solicitudClienteDistrito,
		solicitudClienteCiudad,
		solicitudClientePais,
		solicitudMotivo,
		solicitudCreadoFecha,
		solicitudCreadoUsuarioId)
	VALUES (
		@pSOLICITUD_VentaId, 
		5, 
		'P',
		@pSOLICITUD_ClienteDocumentoTipoId,
		@pSOLICITUD_ClienteDocumentoNumero,
		@pSOLICITUD_ClienteNombres,
		@pSOLICITUD_ClienteApellidos,
		@pSOLICITUD_ClienteFechaNacimiento,
		@pSOLICITUD_ClienteEdad,
		@pSOLICITUD_ClienteEmail,
		@pSOLICITUD_ClienteDireccion,
		@pSOLICITUD_ClienteTelefono,
		@pSOLICITUD_ClienteDistrito,
		@pSOLICITUD_ClienteCiudad,
		@pSOLICITUD_ClientePais,
		@pSOLICITUD_Motivo,
		@FechaHoraActual,
		@pSOLICITUD_Usuario)
	
set @tipoproceso=1;

IF @@ROWCOUNT > 0
BEGIN
	set @resultado = 'ok'
END
select @tipoproceso as errorCodigo, @resultado as errorDescripcion
END
