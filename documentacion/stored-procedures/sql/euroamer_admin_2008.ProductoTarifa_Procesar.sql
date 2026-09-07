-- Objeto: euroamer_admin_2008.ProductoTarifa_Procesar
-- Creado en BD: 2013-12-24 08:50:58
-- Modificado en BD: 2025-04-02 06:12:43
-- Extraído: 2026-09-07 08:27:16 UTC
-- Referenciado por el backend .NET: SI
-- Parámetros:
--   @pPRODUCTO_Id int (IN)
--   @pTARIFA_Id int (IN)
--   @pTARIFA_NumeroDiasMinimo int (IN)
--   @pTARIFA_NumeroDiasMaximo int (IN)
--   @pTARIFA_Importe decimal (IN)
--   @pTARIFA_Usuario int (IN)
--   @pTARIFA_Incentivo decimal (IN)
--   @pTARIFA_Publicidad decimal (IN)

CREATE PROCEDURE [euroamer_admin_2008].[ProductoTarifa_Procesar]
	@pPRODUCTO_Id INT = 0,
	@pTARIFA_Id INT = 0,
	@pTARIFA_NumeroDiasMinimo INT,
	@pTARIFA_NumeroDiasMaximo INT,
	@pTARIFA_Importe DECIMAL(18,4),
	@pTARIFA_Usuario INT,
    @pTARIFA_Incentivo DECIMAL(18,4),
    @pTARIFA_Publicidad DECIMAL(18,4)
AS
BEGIN
	
	declare @tipoproceso int = 0;
	declare @resultado varchar(300) = '';
	declare @FechaHoraActual datetime = [euroamer_admin_2008].[fuObtenerFechaActualPeruana]();

	SET NOCOUNT ON;

	IF @pTARIFA_Id = 0
		BEGIN
		
		set @tipoproceso=1;

			INSERT INTO PRODUCTO_TARIFA (
			tarifaProductoId, 
			tarifaNumeroDiasMinimo, 
			tarifaNumeroDiasMaximo,
			tarifaImporte,
			tarifaCreadoFecha,
			tarifaCreadoUsuarioId,
			tarifaModificadoFecha,
			tarifaModificadoUsuarioId,
			                             tarifaIncentivo,
			                             tarifaPublicidad) 
			VALUES (
			@pPRODUCTO_Id, 
			@pTARIFA_NumeroDiasMinimo, 
			@pTARIFA_NumeroDiasMaximo,
			@pTARIFA_Importe,
			@FechaHoraActual,
			@pTARIFA_Usuario,
			@FechaHoraActual,
			@pTARIFA_Usuario,
			        @pTARIFA_Incentivo,
			        @pTARIFA_Publicidad)

			select @pTARIFA_Id = SCOPE_IDENTITY()

			IF @@ROWCOUNT > 0
			BEGIN
				set @resultado = 'ok|'+cast(@pTARIFA_Id as varchar(100));
			END

		END
	ELSE
		BEGIN
		set @tipoproceso=2;

			UPDATE PRODUCTO_TARIFA SET 
			tarifaNumeroDiasMinimo = @pTARIFA_NumeroDiasMinimo,
			tarifaNumeroDiasMaximo = @pTARIFA_NumeroDiasMaximo,
			tarifaImporte = @pTARIFA_Importe,
			tarifaModificadoFecha = @FechaHoraActual,
			tarifaModificadoUsuarioId = @pTARIFA_Usuario,
			tarifaIncentivo = @pTARIFA_Incentivo,
			tarifaPublicidad =  @pTARIFA_Publicidad
			WHERE tarifaId = @pTARIFA_Id

			IF @@ROWCOUNT > 0
			BEGIN
				set @resultado = 'ok|'+cast(@pTARIFA_Id as varchar(100));
			END

		END

		select @tipoproceso as errorCodigo, @resultado as errorDescripcion
END
