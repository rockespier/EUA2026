-- Objeto: euroamer_admin_2008.Cotizador_Obtener
-- Creado en BD: 2025-10-10 05:21:03
-- Modificado en BD: 2025-10-23 08:31:31
-- Extraído: 2026-09-07 08:27:16 UTC
-- Referenciado por el backend .NET: SI
-- Parámetros:
--   @pOrigen int (IN)
--   @DestinoId int (IN)
--   @pDias int (IN)
--   @pCantidadPasajeros int (IN)
--   @pModalidad int (IN)
--   @pEdadMayor int (IN)

CREATE PROCEDURE [euroamer_admin_2008].[Cotizador_Obtener]
	@pOrigen int,
	@DestinoId int,
	@pDias int,
	@pCantidadPasajeros int,
    @pModalidad int,
	@pEdadMayor int = 0
AS
BEGIN
	
	--Cotizador_Obtener 1,1,30,1,0,26
	SET NOCOUNT ON;
	DECLARE @vProductoId INT,@vProductoNombre Varchar(255), @vproductoImporteTarifaFija decimal(18,4), @vproductoordenlistado INT
	DECLARE @vPrecio decimal(18,4) = 0
	DECLARE @vproductoImporteDiaAdicional decimal(18,4)
	DECLARE @vPromocionNombre VARCHAR(100)
	DECLARE @vCantidadPasajeros INT
	DECLARE @vTotalPasajeros decimal(18,4)
	DECLARE @vEdadMinima as int, @vEdadMaxima int
	DECLARE @vCantidadDiasProd INT = 0
	DECLARE @Cantidad_Dias INT = 0


			CREATE TABLE #Resultados(
			productoId int,
			productoNombre varchar(255),
			productoTarifaImporte decimal(18,4),
			productoOrdenListado Int,
			beneficiosHtml varchar(max),
			promocion varchar(100),
			edadMinima int,
			edadMaxima int,
			productoTarifaDia int
			)

			--validar si el pais de origen existe.
			if (select count(*) from PRODUCTO where productopaisId=@pOrigen)=0
			 begin
				set @pOrigen= 1
    		 end			 

			DECLARE cursor_tarifa CURSOR FOR
			select distinct p.productoID, p.productonombre, productoImporteTarifaFija, p.productoordenlistado, p.productoImporteDiaAdicional,
				 productoEdadMinima,productoEdadmaxima , isNull(productonumerodias,0)
			from [PRODUCTO] p JOIN producto_destino pd on p.productoId = pd.cod_producto and  pd.cod_destino = @DestinoId and pd.est_registro=1
			where (@pOrigen=0 or p.productopaisId = @pOrigen)
			and p.productoactivo = 1 and productoMarca=1 and productoActivoWeb = 1
			and (@pEdadMayor between productoEdadMinima and productoEdadmaxima)
			and (( @pModalidad =0 and  productonumerodias=0 )or (@pModalidad = 2 and productonumerodias=365))

			OPEN cursor_tarifa;
			FETCH cursor_tarifa INTO	@vProductoId, @vProductoNombre, @vproductoImporteTarifaFija, @vproductoordenlistado, @vproductoImporteDiaAdicional,
										@vEdadMinima,@vEdadMaxima, @vCantidadDiasProd
			WHILE @@FETCH_STATUS = 0
				BEGIN

				SET @vPrecio = 0
				SET @vTotalPasajeros = 0
				SET @vCantidadPasajeros = @pCantidadPasajeros

				DECLARE @r1 VARCHAR(max)
				EXEC ProductoBeneficio_Obtener_htmlCoti @vProductoId, 0, 1, @r1 OUTPUT

				--print '@vProductoNombre:' + @vProductoNombre
				--print 'tarifafija:' + CAST(@vproductoImporteTarifaFija as varchar(50))

					--Producto Anual
					if @pModalidad = 2
						BEGIN
							SET @Cantidad_Dias = 365 --@vCantidadDiasProd
						END
					else
						BEGIN
							SET @Cantidad_Dias = @pDias
						END
				--print '@pDias:'+ cast(@pDias as varchar(50))
				--print '@vCantidadDiasProd:' + cast(@vCantidadDiasProd as varchar(50))

					--Buscar tarifa por rangos
					select @vPrecio = tarifaImporte
					 from PRODUCTO_TARIFA
					 where tarifaproductoid = @vProductoId
						and @Cantidad_Dias
						between tarifaNumeroDiasMinimo and tarifaNumeroDiasMaximo

						--print '@vPrecio:' + cast(@vPrecio as varchar(50))

					    SET @vTotalPasajeros = (@vPrecio * @vCantidadPasajeros)



				insert into #Resultados
							values(@vProductoId,
							@vProductoNombre,
							@vTotalPasajeros,
							@vproductoordenlistado, @r1,@vPromocionNombre,
							@vEdadMinima,@vEdadMaxima,@Cantidad_Dias)

				FETCH cursor_tarifa INTO	@vProductoId, @vProductoNombre, @vproductoImporteTarifaFija, @vproductoordenlistado, @vproductoImporteDiaAdicional,
											@vEdadMinima,@vEdadMaxima,@vCantidadDiasProd;
				END;
			CLOSE cursor_tarifa;
			DEALLOCATE cursor_tarifa;

			select * from #Resultados where productoTarifaImporte > 0 order by productoTarifaImporte asc

			drop table #Resultados
	end
