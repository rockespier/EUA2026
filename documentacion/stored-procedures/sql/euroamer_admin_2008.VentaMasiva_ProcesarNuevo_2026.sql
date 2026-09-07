-- Objeto: euroamer_admin_2008.VentaMasiva_ProcesarNuevo_2026
-- Creado en BD: 2026-08-24 08:43:00
-- Modificado en BD: 2026-08-24 08:43:00
-- Extraído: 2026-09-07 08:27:17 UTC
-- Referenciado por el backend .NET: SI
-- Parámetros:
--   @pVENTA_MasivoId int (IN)
--   @pVENTA_FechaVigenciaInicio date (IN)
--   @pVENTA_FechaVigenciaFin date (IN)
--   @pVENTA_Destino varchar (IN)
--   @pProductoATVCodigo varchar (IN)
--   @pVENTA_AgenciaLogin varchar (IN)
--   @pVENTA_AgenciaUsuarioLogin varchar (IN)
--   @pVENTA_Counter varchar (IN)
--   @pVENTA_ClienteDocumentoTipo varchar (IN)
--   @pVENTA_ClienteDocumentoNumero varchar (IN)
--   @pVENTA_ClienteNombres varchar (IN)
--   @pVENTA_ClienteApellidos varchar (IN)
--   @pVENTA_ClienteFechaNacimiento date (IN)
--   @pVENTA_ClienteEmail varchar (IN)
--   @pVENTA_ClienteDireccion varchar (IN)
--   @pVENTA_ClienteTelefono varchar (IN)
--   @pVENTA_ClienteDistrito varchar (IN)
--   @pVENTA_ClienteCiudad varchar (IN)
--   @pVENTA_ClientePais varchar (IN)
--   @pVENTA_ContactoNombres varchar (IN)
--   @pVENTA_ContactoDireccion varchar (IN)
--   @pVENTA_ContactoEmail varchar (IN)
--   @pVENTA_ContactoTelefono varchar (IN)
--   @pVENTA_ContactoDistrito varchar (IN)
--   @pVENTA_ContactoPais varchar (IN)
--   @pVENTA_CodigoExterno varchar (IN)
--   @pVENTA_Clientenacionalidad varchar (IN)
--   @pVENTA_Origen varchar (IN)

CREATE PROCEDURE [euroamer_admin_2008].[VentaMasiva_ProcesarNuevo_2026]
	@pVENTA_MasivoId INT,
	@pVENTA_FechaVigenciaInicio DATE,
	@pVENTA_FechaVigenciaFin DATE,
	@pVENTA_Destino VARCHAR(255),
	@pProductoATVCodigo VARCHAR(25),
	@pVENTA_AgenciaLogin VARCHAR(50),
	@pVENTA_AgenciaUsuarioLogin VARCHAR(50),
	@pVENTA_Counter VARCHAR(100),
	@pVENTA_ClienteDocumentoTipo VARCHAR(3),
	@pVENTA_ClienteDocumentoNumero VARCHAR(50),
	@pVENTA_ClienteNombres VARCHAR(50),
	@pVENTA_ClienteApellidos VARCHAR(80),
	@pVENTA_ClienteFechaNacimiento DATE,
	@pVENTA_ClienteEmail VARCHAR(100),
	@pVENTA_ClienteDireccion VARCHAR(255),
	@pVENTA_ClienteTelefono VARCHAR(50),
	@pVENTA_ClienteDistrito VARCHAR(50),
	@pVENTA_ClienteCiudad VARCHAR(50),
	@pVENTA_ClientePais VARCHAR(50),
	@pVENTA_ContactoNombres VARCHAR(255),
	@pVENTA_ContactoDireccion VARCHAR(255),
	@pVENTA_ContactoEmail VARCHAR(50),
	@pVENTA_ContactoTelefono VARCHAR(50),
	@pVENTA_ContactoDistrito VARCHAR(25),
	@pVENTA_ContactoPais VARCHAR(50),
	@pVENTA_CodigoExterno VARCHAR(50),
	@pVENTA_Clientenacionalidad VARCHAR(50),
    @pVENTA_Origen VARCHAR(50) = ''
AS
BEGIN

	SET NOCOUNT ON;
	declare @tipoproceso int = 0;
    declare @resultado varchar(300) = '';
	DECLARE @vVENTA_NumeroDias INT
	DECLARE @vVENTA_ProductoImporte DECIMAL(18,4)
	DECLARE @vVENTA_UsuarioOrigen CHAR(1)
	DECLARE @vVENTA_ClienteEdad INT
	DECLARE @vVENTA_AgenciaId INT
	DECLARE @vVENTA_AgenciaUsuarioId INT
	DECLARE @vVENTA_ClienteDocumentoTipoId INT
	DECLARE @pVENTA_ProductoId INT

	set @pVENTA_ProductoId = (SELECT top 1 productoId FROM PRODUCTO	WHERE productoATVCodigo = @pProductoATVCodigo AND productoActivo = 1)
	SET @vVENTA_NumeroDias = (SELECT DATEDIFF(DAY, @pVENTA_FechaVigenciaInicio, @pVENTA_FechaVigenciaFin)) + 1
	SET @vVENTA_ProductoImporte = ISNULL((SELECT top 1 tarifaImporte FROM PRODUCTO_TARIFA WHERE tarifaProductoId = @pVENTA_ProductoId AND @vVENTA_NumeroDias BETWEEN tarifaNumeroDiasMinimo AND tarifaNumeroDiasMaximo),0)
	SET @vVENTA_UsuarioOrigen = 'N'
	SET @vVENTA_ClienteEdad = (SELECT (CAST((DATEDIFF(DD, @pVENTA_ClienteFechaNacimiento, GETDATE()) + 1) / 365.25 AS INT)))
	SET @vVENTA_AgenciaId = (SELECT agenciaId FROM AGENCIA WHERE agenciaLogin=@pVENTA_AgenciaLogin AND agenciaActivo = 1)
	SET @vVENTA_AgenciaUsuarioId = (SELECT agenciausuarioId FROM AGENCIA_USUARIO WHERE agenciausuarioLogin=@pVENTA_AgenciaUsuarioLogin AND agenciausuarioActivo = 1)
    SET @vVENTA_ClienteDocumentoTipoId = ISNULL((SELECT valorTipoId FROM VALORES_TIPO WHERE valorTipoColumnaTabla = 'agenciausuarioTipoDocumento' AND UPPER(valorTipoNombre) = UPPER(@pVENTA_ClienteDocumentoTipo) AND valorTipoActivo= 1),2)

    if ISNULL(@vVENTA_AgenciaUsuarioId,'') = ''
		begin
			set @vVENTA_AgenciaUsuarioId = @vVENTA_AgenciaId;
		end
	set @tipoproceso=1;
	INSERT INTO VENTA_TMP(
		ventaId,
		ventaMasivoId,
		ventaFechaVigenciaInicio,
		ventaFechaVigenciaFin,
		ventaNumeroDias,
		ventaDestino,
		ventaProductoId,
		ventaProductoImporte,
		ventaUsuarioOrigen,
		ventaAgenciaId,
		ventaAgenciaUsuarioId,
		ventaCounter,
		ventaClienteDocumentoTipoId,
		ventaClienteDocumentoNumero,
		ventaClienteNombres,
		ventaClienteApellidos,
		ventaClienteFechaNacimiento,
		ventaClienteEdad,
		ventaClienteEmail,
		ventaClienteDireccion,
		ventaClienteTelefono,
		ventaClienteDistrito,
		ventaClienteCiudad,
		ventaClientePais,
		ventaContactoNombres,
		ventaContactoDireccion,
		ventaContactoEmail,
		ventaContactoTelefono,
		ventaContactoDistrito,
		ventaContactoPais,
		ventaImporteVenta,
		ventaCodigoExterno,
		ventaClienteNacionalidad,
	                              venta_origen
	)
	VALUES (
		0,
		@pVENTA_MasivoId,
		@pVENTA_FechaVigenciaInicio,
		@pVENTA_FechaVigenciaFin,
		@vVENTA_NumeroDias,
		@pVENTA_Destino,
		@pVENTA_ProductoId,
		@vVENTA_ProductoImporte,
		@vVENTA_UsuarioOrigen,
		@vVENTA_AgenciaId,
		@vVENTA_AgenciaUsuarioId,
		@pVENTA_Counter,
		@vVENTA_ClienteDocumentoTipoId,
		@pVENTA_ClienteDocumentoNumero,
		@pVENTA_ClienteNombres,
		@pVENTA_ClienteApellidos,
		@pVENTA_ClienteFechaNacimiento,
		@vVENTA_ClienteEdad,
		@pVENTA_ClienteEmail,
		@pVENTA_ClienteDireccion,
		@pVENTA_ClienteTelefono,
		@pVENTA_ClienteDistrito,
		@pVENTA_ClienteCiudad,
		@pVENTA_ClientePais,
		@pVENTA_ContactoNombres,
		@pVENTA_ContactoDireccion,
		@pVENTA_ContactoEmail,
		@pVENTA_ContactoTelefono,
		@pVENTA_ContactoDistrito,
		@pVENTA_ContactoPais,
		@vVENTA_ProductoImporte,
		@pVENTA_CodigoExterno,
		@pVENTA_Clientenacionalidad,
        @pVENTA_Origen
	)

IF @@ROWCOUNT > 0
BEGIN
	set @resultado = 'ok'
END
select @tipoproceso as errorCodigo, @resultado as errorDescripcion

END;
