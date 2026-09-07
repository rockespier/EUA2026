-- Objeto: euroamer_admin_2008.Pais_Procesar
-- Creado en BD: 2016-12-09 20:42:56
-- Modificado en BD: 2025-01-19 05:06:51
-- Extraído: 2026-09-07 08:27:16 UTC
-- Referenciado por el backend .NET: SI
-- Parámetros:
--   @pPAIS_Id int (IN)
--   @pPAIS_Codigo char (IN)
--   @pPAIS_Nombre varchar (IN)
--   @pPAIS_Impuesto decimal (IN)
--   @pPAIS_Impuesto_Venta decimal (IN)
--   @pPAIS_Usuario int (IN)
--   @pPAIS_Activo int (IN)
--   @pPAIS_Correo varchar (IN)
--   @pPAIS_TotalPago int (IN)
--   @pPAIS_DatosEua varchar (IN)
--   @pPAIS_Foto varchar (IN)
--   @pPAIS_PromocionId varchar (IN)
--   @pPAIS_CuponDescuento int (IN)
--   @pPAIS_CuponVigenciaId int (IN)
--   @pPAIS_DocumentoFormato int (IN)
--   @pPAIS_PromotorDefault int (IN)


CREATE PROCEDURE [Pais_Procesar]
	@pPAIS_Id INT = 0,
	@pPAIS_Codigo CHAR(2),
	@pPAIS_Nombre VARCHAR(100),
	@pPAIS_Impuesto DECIMAL(18,5),
	@pPAIS_Impuesto_Venta DECIMAL(18,5),
	@pPAIS_Usuario INT,
	@pPAIS_Activo INT,
	@pPAIS_Correo  VARCHAR(100),
	@pPAIS_TotalPago INT,
	@pPAIS_DatosEua VARCHAR(355),
	@pPAIS_Foto VARCHAR(50),
	@pPAIS_PromocionId VARCHAR(10)='',
	@pPAIS_CuponDescuento INT,
	@pPAIS_CuponVigenciaId INT,
	@pPAIS_DocumentoFormato INT,
	@pPAIS_PromotorDefault INT
AS
BEGIN
	declare @tipoproceso int = 0;
	declare @resultado varchar(300) = '';
	declare @FechaHoraActual datetime = [euroamer_admin_2008].[fuObtenerFechaActualPeruana]();

	SET NOCOUNT ON;

	IF @pPAIS_Id = 0
		BEGIN
		set @tipoproceso=1;
			INSERT INTO PAIS (
			paisCodigo,
			paisNombre, 
			paisImpuesto, 
			paisImpuestoVenta, 
			paisCreadoFecha,
			paisCreadoUsuarioId,
			paisModificadoFecha,
			paisModificadoUsuarioId,
			paisActivo,
			paisCorreo,
			paisTotalPago,
			paisDatosEua,
			paisFoto,
			paisPromocionId,
			paisCuponDescuento,
			paisCuponVigenciaId,
			paisDocumentoFormato,
			paisPromotorDefault) 
			VALUES (
			@pPAIS_Codigo,
			@pPAIS_Nombre, 
			@pPAIS_Impuesto, 
			@pPAIS_Impuesto_Venta,
			GETDATE(),
			@pPAIS_Usuario,
			GETDATE(),
			@pPAIS_Usuario,
			1,
			@pPAIS_Correo,
			@pPAIS_TotalPago,
			@pPAIS_DatosEua,
			@pPAIS_Foto,
			@pPAIS_PromocionId,
			@pPAIS_CuponDescuento,
			@pPAIS_CuponVigenciaId,
			@pPAIS_DocumentoFormato,
			@pPAIS_PromotorDefault)

			SELECT @pPAIS_Id = SCOPE_IDENTITY() 
			IF @@ROWCOUNT > 0
			BEGIN
				set @resultado = 'ok|'+cast(@pPAIS_Id as varchar(100));
			END
		END
	ELSE
		BEGIN
		set @tipoproceso=2;

			UPDATE	PAIS SET 
					paisCodigo = @pPAIS_Codigo,
					paisNombre = @pPAIS_Nombre,
					paisImpuesto = @pPAIS_Impuesto,
					paisImpuestoVenta = @pPAIS_Impuesto_Venta,
					paisModificadoFecha = GETDATE(),
					paisModificadoUsuarioId = @pPAIS_Usuario,
					paisActivo = @pPAIS_Activo,
					paisCorreo = @pPAIS_Correo,
					paisTotalPago = @pPAIS_TotalPago,
					paisDatosEua = @pPAIS_DatosEua,
					paisFoto = @pPAIS_Foto,
					paisPromocionId = @pPAIS_PromocionId,
					paisCuponDescuento = @pPAIS_CuponDescuento,
					paisCuponVigenciaId = @pPAIS_CuponVigenciaId, 
					paisDocumentoFormato = @pPAIS_DocumentoFormato,
					paisPromotorDefault = @pPAIS_PromotorDefault
			WHERE	paisId = @pPAIS_Id
		IF @@ROWCOUNT > 0
			BEGIN
				set @resultado = 'ok|'+cast(@pPAIS_Id as varchar(100));
			END

		END

		select @tipoproceso as errorCodigo, @resultado as errorDescripcion  
		
			
END
