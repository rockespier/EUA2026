-- Objeto: euroamer_admin_2008.Pasajero_Procesar
-- Creado en BD: 2021-12-13 11:52:36
-- Modificado en BD: 2022-01-27 20:27:23
-- Extraído: 2026-09-07 08:27:16 UTC
-- Referenciado por el backend .NET: NO (revisar si sigue en uso)
-- Parámetros:
--   @pPasajero_Id int (IN)
--   @pPasajero_DocumentoTipo varchar (IN)
--   @pPasajero_DocumentoNumero varchar (IN)
--   @pPasajero_Nombres varchar (IN)
--   @pPasajero_Apellidos varchar (IN)
--   @pPasajero_FechaNacimiento date (IN)
--   @pPasajero_Edad int (IN)
--   @pPasajero_Email varchar (IN)
--   @pPasajero_Direccion varchar (IN)
--   @pPasajero_Telefono varchar (IN)
--   @pPasajero_Distrito varchar (IN)
--   @pPasajero_Ciudad varchar (IN)
--   @pPasajero_Pais varchar (IN)
--   @pPasajero_Nacionalidad varchar (IN)
--   @pContactoNombres varchar (IN)
--   @pContactoDireccion varchar (IN)
--   @pContactoEmail varchar (IN)
--   @pContactoTelefono varchar (IN)
--   @pContactoDistrito varchar (IN)
--   @pContactoPais varchar (IN)
--   @pContactoProducto varchar (IN)
--   @pContactoAgencia varchar (IN)
--   @pFechaSalida varchar (IN)
--   @pFechaRegreso varchar (IN)
--   @pDia int (IN)

CREATE PROCEDURE [euroamer_admin_2008].[Pasajero_Procesar]
	@pPasajero_Id INT = 0,
	@pPasajero_DocumentoTipo VARCHAR(3),
	@pPasajero_DocumentoNumero VARCHAR(50),
	@pPasajero_Nombres VARCHAR(50),
	@pPasajero_Apellidos VARCHAR(80),
	@pPasajero_FechaNacimiento DATE='19000101',
	@pPasajero_Edad INT=0,
	@pPasajero_Email VARCHAR(100)='',
	@pPasajero_Direccion VARCHAR(255)='',
	@pPasajero_Telefono VARCHAR(50)='',
	@pPasajero_Distrito VARCHAR(50)='',
	@pPasajero_Ciudad VARCHAR(50)='',
	@pPasajero_Pais VARCHAR(50)='',
	@pPasajero_Nacionalidad VARCHAR(50)='',
	@pContactoNombres varchar(255), 
	@pContactoDireccion varchar(255), 
	@pContactoEmail varchar(50), 
	@pContactoTelefono varchar(50), 
	@pContactoDistrito varchar(25), 
	@pContactoPais varchar(50),
	@pContactoProducto varchar(100),
	@pContactoAgencia varchar(100),
	@pFechaSalida varchar(10),
	@pFechaRegreso varchar(10),
	@pDia integer
AS
BEGIN
	
	SET NOCOUNT ON;

	set @pPasajero_Id = isnull((select pasajeroid from PASAJERO where PasajeroDocumentoTipoId = @pPasajero_DocumentoTipo and PasajeroDocumentoNumero = @pPasajero_DocumentoNumero),0)

	IF @pPasajero_Id = 0
		BEGIN
			
			INSERT INTO PASAJERO(				
				PasajeroDocumentoTipoId,
				PasajeroDocumentoNumero,
				PasajeroNombres,
				PasajeroApellidos,
				PasajeroFechaNacimiento,
				PasajeroEdad,
				PasajeroEmail,
				PasajeroDireccion,
				PasajeroTelefono,				
				PasajeroCiudad,				
				PasajeroNacionalidad,
				PasajeroDistrito,
				PasajeroPais,
				ContactoNombres, 
				ContactoDireccion, 
				ContactoEmail, 
				ContactoTelefono, 
				ContactoDistrito, 
				ContactoPais,
				pasajeroFechaRegistro,
				ContactoProducto,
				ContactoAgencia,
				Fechasalida,
				Fecharegreso,
				dia			) 
			VALUES (				
				@pPasajero_DocumentoTipo,
				@pPasajero_DocumentoNumero,
				@pPasajero_Nombres,
				@pPasajero_Apellidos,
				@pPasajero_FechaNacimiento,
				@pPasajero_Edad,
				@pPasajero_Email,
				upper(@pPasajero_Direccion),
				@pPasajero_Telefono,				
				upper(@pPasajero_Ciudad),				
				upper(@pPasajero_Nacionalidad),
				upper(@pPasajero_Distrito),
				upper(@pPasajero_Pais),
				@pContactoNombres, 
				@pContactoDireccion, 
				@pContactoEmail, 
				@pContactoTelefono, 
				@pContactoDistrito, 
				@pContactoPais,
				getdate(),
				@pContactoProducto,
				@pContactoAgencia,
				@pFechaSalida,
				@pFechaRegreso,
				@pDia
			)
			
		END
	ELSE
		BEGIN
			UPDATE PASAJERO SET 
				PasajeroDocumentoTipoId = @pPasajero_DocumentoTipo,
				PasajeroDocumentoNumero = @pPasajero_DocumentoNumero,
				PasajeroNombres = @pPasajero_Nombres,
				PasajeroApellidos = @pPasajero_Apellidos,
				PasajeroFechaNacimiento = @pPasajero_FechaNacimiento,
				PasajeroEdad = @pPasajero_Edad,
				PasajeroEmail = @pPasajero_Email,
				PasajeroDireccion = upper(@pPasajero_Direccion),
				PasajeroTelefono = @pPasajero_Telefono,				
				PasajeroCiudad = upper(@pPasajero_Ciudad),				
				PasajeroNacionalidad = upper(@pPasajero_Nacionalidad),
				PasajeroDistrito = upper(@pPasajero_Distrito),
				PasajeroPais = upper(@pPasajero_Pais),
				ContactoNombres= upper(@pContactoNombres),
				ContactoDireccion= upper(@pContactoDireccion),
				ContactoEmail= upper(@pContactoEmail),
				ContactoTelefono= upper(@pContactoTelefono),
				ContactoDistrito= upper(@pContactoDistrito),
				ContactoPais= upper(@pContactoPais),
				pasajeroFechaRegistro = getdate(),
				ContactoProducto = @pContactoProducto,
				ContactoAgencia = @pContactoAgencia,
				Fechasalida = @pFechaSalida,
				Fecharegreso = @pFecharegreso,
				dia= @pDia
			WHERE PasajeroId = @pPasajero_Id
		END
END
