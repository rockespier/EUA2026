-- Objeto: euroamer_admin_2008.Producto_Copiar
-- Creado en BD: 2017-02-03 14:44:32
-- Modificado en BD: 2025-12-24 06:46:28
-- Extraído: 2026-09-07 08:27:16 UTC
-- Referenciado por el backend .NET: SI
-- Parámetros:
--   @pPRODUCTO_Id int (IN)
--   @pPRODUCTO_Usuario int (IN)
--   @pPRODUCTO_PaisId int (IN)

CREATE PROCEDURE [Producto_Copiar]
	@pPRODUCTO_Id INT,
	@pPRODUCTO_Usuario INT,
	@pPRODUCTO_PaisId INT
AS
BEGIN
	
	SET NOCOUNT ON;
	--Producto_Copiar 3146,181,1
	--SET TRANSACTION ISOLATION LEVEL READ UNCOMMITTED;	
	
	SET QUOTED_IDENTIFIER ON;
	declare @tipoproceso int = 0;
	declare @resultado varchar(300) = '';
	DECLARE @wIDProductoNuevo int;
    set @tipoproceso=1;
    insert into PRODUCTO(
	[productoReferenciaId],
	[productoNombre] ,
	[productoServicio],
	[productoURL],
	[productoImporteTarifaFija],
	[productoImporteDiaAdicional],
	[productoEdadMinima],
	[productoEdadMaxima],
	[productoNumeroDias],
	[productoCreadoFecha],
	[productoCreadoUsuarioId],
	[productoModificadoFecha],
	[productoModificadoUsuarioId],
	[productoActivo],
	[ProductoOrdenListado],
	[productoPaisId],
	[productoActivoWeb],
	[productoGrupalActivo],
	[productoGrupalPorcentaje],
	[productoPromocionActivo],
	[productoImporteCero],
	[productoATVCodigo],
	[productoMarca])
    select
	[productoReferenciaId],
	[productoNombre] + '_copia',
	[productoServicio],
	[productoURL],
	[productoImporteTarifaFija],
	[productoImporteDiaAdicional],
	[productoEdadMinima],
	[productoEdadMaxima],
	[productoNumeroDias],
	getdate(),
	@pPRODUCTO_Usuario,
	getdate(),
	@pPRODUCTO_Usuario,
	[productoActivo],
	[ProductoOrdenListado],
	@pPRODUCTO_PaisId,
	[productoActivoWeb],
	[productoGrupalActivo],
	[productoGrupalPorcentaje],
	[productoPromocionActivo],
	[productoImporteCero],
	[productoATVCodigo],
	[productoMarca]
	from PRODUCTO
	where [ProductoId] = @pPRODUCTO_Id
	
	set @wIDProductoNuevo = @@IDENTITY;
	
	insert into PRODUCTO_TARIFA(
	tarifaProductoId,
		[tarifaNumeroDiasMinimo],
		[tarifaNumeroDiasMaximo],
		[tarifaImporte],
		tarifaCreadoFecha,
		tarifaCreadoUsuarioId,
		tarifaModificadoFecha,
		tarifaModificadoUsuarioId
	)
	select @wIDProductoNuevo,
		[tarifaNumeroDiasMinimo],
		[tarifaNumeroDiasMaximo],
		[tarifaImporte],
		getdate(),
		@pPRODUCTO_Usuario,
		getdate(),
		@pPRODUCTO_Usuario
	from PRODUCTO_TARIFA
	where [tarifaProductoId] = @pPRODUCTO_Id
	
	
	insert into PRODUCTO_BENEFICIO(
		beneficioProductoId,
		[beneficioNombre],
		[beneficioImporte],
		beneficioCreadoFecha,
		beneficioCreadoUsuarioId,
		beneficioModificadoFecha,
		beneficioModificadoUsuarioId,
		[beneficioIdiomaId],
		beneficioOrden)
	select @wIDProductoNuevo,
		[beneficioNombre],
		[beneficioImporte],
		getdate(),
		@pPRODUCTO_Usuario,
		getdate(),
		@pPRODUCTO_Usuario,
		[beneficioIdiomaId],
		beneficioOrden
	from PRODUCTO_BENEFICIO
	where [beneficioProductoId] = @pPRODUCTO_Id
	
	set @resultado = 'ok';
	--select @wIDProductoNuevo;
    select @tipoproceso as errorCodigo, @resultado as errorDescripcion   
    
     
END
