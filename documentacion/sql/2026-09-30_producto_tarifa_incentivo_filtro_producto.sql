-- Issue #99: la actualizacion masiva de incentivos debe afectar solo al producto seleccionado.
-- SP: euroamer_admin_2008.ProductoTarifaIncentivo_Procesar
-- Cambio: agregar filtro por @pPRODUCTO_Id en el UPDATE (antes actualizaba todos los productos).
-- El frontend (Productos.js) ahora envia tarifaProductoId = producto en edicion.
-- Aplicar en la BD manualmente: los SP no estan versionados.

ALTER PROCEDURE [euroamer_admin_2008].[ProductoTarifaIncentivo_Procesar]
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

		set @tipoproceso=2;

			UPDATE PRODUCTO_TARIFA SET
			tarifaModificadoFecha = @FechaHoraActual,
			tarifaModificadoUsuarioId = @pTARIFA_Usuario,
			tarifaIncentivo = @pTARIFA_Incentivo,
			tarifaPublicidad =  @pTARIFA_Publicidad
			WHERE
			tarifaProductoId = @pPRODUCTO_Id AND
			tarifaNumeroDiasMinimo >= @pTARIFA_NumeroDiasMinimo AND
			tarifaNumeroDiasMaximo <= @pTARIFA_NumeroDiasMaximo

			IF @@ROWCOUNT > 0
			BEGIN
				set @resultado = 'ok|'+cast(@pTARIFA_Id as varchar(100));
			END

		select @tipoproceso as errorCodigo, @resultado as errorDescripcion
END
