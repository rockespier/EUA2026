-- Objeto: euroamer_admin_2008.Cotizador_Listado_ProductosNuevo
-- Creado en BD: 2021-12-23 09:59:25
-- Modificado en BD: 2025-08-13 07:31:30
-- Extraído: 2026-09-07 08:27:16 UTC
-- Referenciado por el backend .NET: NO (revisar si sigue en uso)
-- Parámetros:
--   @pOrigen int (IN)

CREATE PROCEDURE [euroamer_admin_2008].[Cotizador_Listado_ProductosNuevo] 
	@pOrigen int
AS
BEGIN

	--exec Cotizador_Listado_ProductosNuevo 1
	
	SET NOCOUNT ON;
	DECLARE @vProductoId INT,@vProductoNombre Varchar(255)

	CREATE TABLE #Resultados(
	ProductoId int,
	ProductoNombre varchar(255), 
	Total decimal(18,4),
	ProductoOrdenListado Int,
	Beneficios varchar(max),
	Promocion varchar(100),
	EdadMinima int,
	EdadMaxima int,
	DiasProd int
	)

	DECLARE cursor_tarifa CURSOR FOR
	select p.productoID, p.productonombre 
	from [PRODUCTO] p left JOIN promocion r on  p.productoPromocionActivo = promocionId 	
	where (@pOrigen=0 or p.productopaisId = @pOrigen)
	and p.productoId in (1,12,3,2,1139,1140)
	and p.productoactivo = 1 and p.productoactivoweb = 1 and productoMarca=1
	
	OPEN cursor_tarifa;
	FETCH cursor_tarifa INTO	@vProductoId, @vProductoNombre
	WHILE @@FETCH_STATUS = 0
		BEGIN
				
		
		DECLARE @r1 VARCHAR(max)
		EXEC ProductoBeneficio_Obtener_html2 @vProductoId, 0, 1, @r1 OUTPUT

		insert into #Resultados 
					values(@vProductoId,Rtrim(@vProductoNombre),0,0, @r1,'',0,0,0)
		
		FETCH cursor_tarifa INTO	@vProductoId, @vProductoNombre;
		END;
	CLOSE cursor_tarifa;
	DEALLOCATE cursor_tarifa;

	select * from #Resultados

	drop table #Resultados
END;
