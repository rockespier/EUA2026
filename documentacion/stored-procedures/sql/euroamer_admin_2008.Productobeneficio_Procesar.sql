-- Objeto: euroamer_admin_2008.Productobeneficio_Procesar
-- Creado en BD: 2014-08-23 10:52:35
-- Modificado en BD: 2025-01-02 08:57:15
-- Extraído: 2026-09-07 08:27:16 UTC
-- Referenciado por el backend .NET: SI
-- Parámetros:
--   @pPRODUCTO_Id int (IN)
--   @pbeneficio_Id int (IN)
--   @pbeneficio_Nombre varchar (IN)
--   @pbeneficio_Importe varchar (IN)
--   @pbeneficio_Usuario int (IN)
--   @pBeneficio_Idioma int (IN)
--   @pBeneficio_Orden int (IN)

CREATE PROCEDURE [Productobeneficio_Procesar]
	@pPRODUCTO_Id INT = 0,
	@pbeneficio_Id INT = 0,
	@pbeneficio_Nombre VARCHAR(100),
	@pbeneficio_Importe VARCHAR(40),
	@pbeneficio_Usuario INT,
    @pBeneficio_Idioma INT,
	@pBeneficio_Orden INT
AS
BEGIN
	declare @tipoproceso int = 0;
	declare @resultado varchar(300) = '';
	declare @FechaHoraActual datetime = [euroamer_admin_2008].[fuObtenerFechaActualPeruana]();

	SET NOCOUNT ON;
	

	IF @pbeneficio_Id = 0
		BEGIN
		set @tipoproceso=1;

			INSERT INTO PRODUCTO_beneficio (			
			beneficioProductoId, 
			beneficioNombre, 
			beneficioImporte,
			beneficioCreadoFecha,
			beneficioCreadoUsuarioId,
			beneficioModificadoFecha,
			beneficioModificadoUsuarioId, beneficioIdiomaId, beneficioOrden) 
			VALUES (			
			@pPRODUCTO_Id, 
			@pbeneficio_Nombre, 			
			@pbeneficio_Importe,
			GETDATE(),
			@pbeneficio_Usuario,
			GETDATE(),
			@pbeneficio_Usuario,@pBeneficio_Idioma,@pBeneficio_Orden)
			SELECT @pbeneficio_Id = SCOPE_IDENTITY()

			IF @@ROWCOUNT > 0
			BEGIN
				set @resultado = 'ok|'+cast(@pbeneficio_Id as varchar(100));
			END

		END
	ELSE
		BEGIN
		set @tipoproceso=2;

			UPDATE PRODUCTO_beneficio SET 
			beneficioNombre = @pbeneficio_Nombre,			
			beneficioImporte = @pbeneficio_Importe,
			beneficioModificadoFecha = GETDATE(),
			beneficioModificadoUsuarioId = @pbeneficio_Usuario,
                        beneficioIdiomaId = @pBeneficio_Idioma,
						beneficioOrden = @pBeneficio_Orden
			WHERE beneficioId = @pbeneficio_Id

			IF @@ROWCOUNT > 0
			BEGIN
				set @resultado = 'ok|'+cast(@pbeneficio_Id as varchar(100));
			END

		END

		select @tipoproceso as errorCodigo, @resultado as errorDescripcion

END

SET ANSI_NULLS ON
SET QUOTED_IDENTIFIER ON;


/****** Object:  StoredProcedure [euroamer_admin_2008].[ProductoTarifa_Procesar]    Script Date: 02/01/2025 16:56:49 ******/
SET ANSI_NULLS ON
