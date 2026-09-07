-- Objeto: euroamer_admin_2008.VentaCliente_Procesar_2026
-- Creado en BD: 2026-08-31 08:22:22
-- Modificado en BD: 2026-08-31 08:22:22
-- Extraído: 2026-09-07 08:27:17 UTC
-- Referenciado por el backend .NET: SI
-- Parámetros:
--   @pVENTACLIENTE_Id int (IN)
--   @pVENTACLIENTE_VentaId int (IN)
--   @pVENTACLIENTE_DocumentoTipo varchar (IN)
--   @pVENTACLIENTE_DocumentoNumero varchar (IN)
--   @pVENTACLIENTE_Nombres varchar (IN)
--   @pVENTACLIENTE_Apellidos varchar (IN)
--   @pVENTACLIENTE_FechaNacimiento date (IN)
--   @pVENTACLIENTE_Edad int (IN)
--   @pVENTACLIENTE_Email varchar (IN)
--   @pVENTACLIENTE_Direccion varchar (IN)
--   @pVENTACLIENTE_Telefono varchar (IN)
--   @pVENTACLIENTE_Distrito varchar (IN)
--   @pVENTACLIENTE_Ciudad varchar (IN)
--   @pVENTACLIENTE_Pais varchar (IN)
--   @pVENTACLIENTE_Nacionalidad varchar (IN)
--   @pVENTACLIENTE_Vip int (IN)

CREATE PROCEDURE [VentaCliente_Procesar_2026]
	@pVENTACLIENTE_Id INT = 0,
	@pVENTACLIENTE_VentaId INT = 0,
	@pVENTACLIENTE_DocumentoTipo VARCHAR(3),
	@pVENTACLIENTE_DocumentoNumero VARCHAR(50),
	@pVENTACLIENTE_Nombres VARCHAR(50),
	@pVENTACLIENTE_Apellidos VARCHAR(80),
	@pVENTACLIENTE_FechaNacimiento DATE,
	@pVENTACLIENTE_Edad INT,
	@pVENTACLIENTE_Email VARCHAR(100),
	@pVENTACLIENTE_Direccion VARCHAR(255),
	@pVENTACLIENTE_Telefono VARCHAR(50)='',
	@pVENTACLIENTE_Distrito VARCHAR(50)='',
	@pVENTACLIENTE_Ciudad VARCHAR(50)='',
	@pVENTACLIENTE_Pais VARCHAR(50)='',
	@pVENTACLIENTE_Nacionalidad VARCHAR(50)='',
    @pVENTACLIENTE_Vip INT=0
AS
BEGIN

	SET NOCOUNT ON;
	declare @tipoproceso int = 0;
declare @resultado varchar(300) = '';
declare @FechaHoraActual datetime = [euroamer_admin_2008].[fuObtenerFechaActualPeruana]();
	IF @pVENTACLIENTE_Id = 0
		BEGIN
			set @tipoproceso=1;
			INSERT INTO VENTA_CLIENTE(
				ventaclienteVentaId,
				ventaclienteDocumentoTipoId,
				ventaclienteDocumentoNumero,
				ventaclienteNombres,
				ventaclienteApellidos,
				ventaclienteFechaNacimiento,
				ventaclienteEdad,
				ventaclienteEmail,
				ventaclienteDireccion,
				ventaclienteTelefono,
				ventaclienteDistrito,
				ventaclienteCiudad,
				ventaclientePais,
				ventaclienteNacionalidad,
                ventaclienteVip
			)
			VALUES (
				@pVENTACLIENTE_VentaId,
				@pVENTACLIENTE_DocumentoTipo,
				@pVENTACLIENTE_DocumentoNumero,
				@pVENTACLIENTE_Nombres,
				@pVENTACLIENTE_Apellidos,
				@pVENTACLIENTE_FechaNacimiento,
				@pVENTACLIENTE_Edad,
				@pVENTACLIENTE_Email,
				@pVENTACLIENTE_Direccion,
				@pVENTACLIENTE_Telefono,
				@pVENTACLIENTE_Distrito,
				@pVENTACLIENTE_Ciudad,
				@pVENTACLIENTE_Pais,
				@pVENTACLIENTE_Nacionalidad,
                @pVENTACLIENTE_Vip
			)
			IF @@ROWCOUNT > 0
BEGIN
	set @resultado = 'ok'
END
		END
	ELSE
		BEGIN
		set @tipoproceso=2;
			UPDATE VENTA_CLIENTE SET
				ventaclienteDocumentoTipoId = @pVENTACLIENTE_DocumentoTipo,
				ventaclienteDocumentoNumero = @pVENTACLIENTE_DocumentoNumero,
				ventaclienteNombres = @pVENTACLIENTE_Nombres,
				ventaclienteApellidos = @pVENTACLIENTE_Apellidos,
				ventaclienteFechaNacimiento = @pVENTACLIENTE_FechaNacimiento,
				ventaclienteEdad = @pVENTACLIENTE_Edad,
				ventaclienteEmail = @pVENTACLIENTE_Email,
				ventaclienteDireccion = @pVENTACLIENTE_Direccion,
				ventaclienteTelefono = @pVENTACLIENTE_Telefono,
				ventaclienteDistrito = @pVENTACLIENTE_Distrito,
				ventaclienteCiudad = @pVENTACLIENTE_Ciudad,
				ventaclientePais = @pVENTACLIENTE_Pais,
				ventaclienteNacionalidad = @pVENTACLIENTE_Nacionalidad,
				                ventaclienteVip = @pVENTACLIENTE_Vip
			WHERE ventaclienteId = @pVENTACLIENTE_Id
			IF @@ROWCOUNT > 0
BEGIN
	set @resultado = 'ok'
END
		END
		select @tipoproceso as errorCodigo, @resultado as errorDescripcion
END
