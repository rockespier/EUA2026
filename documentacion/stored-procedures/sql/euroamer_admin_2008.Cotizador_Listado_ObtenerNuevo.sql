-- Objeto: euroamer_admin_2008.Cotizador_Listado_ObtenerNuevo
-- Creado en BD: 2019-09-10 12:38:35
-- Modificado en BD: 2026-03-25 08:21:39
-- Extraído: 2026-09-07 08:27:16 UTC
-- Referenciado por el backend .NET: NO (revisar si sigue en uso)
-- Parámetros:
--   @pOrigen int (IN)
--   @pDestino varchar (IN)
--   @pDias int (IN)
--   @pCantidadPasajeros int (IN)
--   @pProductoId int (IN)
--   @pEdadMayor int (IN)

CREATE PROCEDURE [euroamer_admin_2008].[Cotizador_Listado_ObtenerNuevo] 
	@pOrigen int,
	@pDestino varchar(50),
	@pDias int,
	@pCantidadPasajeros int,
	@pProductoId int = 0,
	@pEdadMayor int = 0
AS
BEGIN
	--Cotizador_Listado_ObtenerNuevo 1,'Europa',17,1,0,18
	--Cotizador_Listado_ObtenerNuevo 1,'Europa',30,1,0,30
	--Cotizador_Listado_ObtenerNuevo 2,'Norte América',30,1,0,30
	SET NOCOUNT ON;
	DECLARE @vProductoId INT,@vProductoNombre Varchar(255), @vproductoImporteTarifaFija decimal(18,4), @vproductoordenlistado INT
	DECLARE @vPrecio decimal(18,4) = 0
	DECLARE @vproductoImporteDiaAdicional decimal(18,4)
	DECLARE @vPromocionNombre VARCHAR(100), @vPromocionClienteCntPagan int,@vPromocionClienteCntIngresan int,@vPromocionDescuento int
	DECLARE @vCantidadPasajeros INT
	DECLARE @vTotalPasajeros decimal(18,4)
	DECLARE @vEdadMinima as int, @vEdadMaxima int
	DECLARE @vCantidadDiasProd INT = 0
	DECLARE @Cantidad_Dias INT = 0
	DECLARE @DestinoId INT = 0
	
	if @pDias <= 366
	begin
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
		
			--validar si el pais de origen existe.
			if (select count(*) from PRODUCTO where productopaisId=@pOrigen)=0
			 begin
				set @pOrigen= 1
			 end

			 --Validar el destino	 
			 set @DestinoId = (select valorTipoId from VALORES_TIPO where valorTipoColumnaTabla='destino' and valorTiponombre=@pDestino and valortipoactivo=1)
			 	
	 
			DECLARE cursor_tarifa CURSOR FOR
			select distinct p.productoID, p.productonombre, productoImporteTarifaFija, p.productoordenlistado, p.productoImporteDiaAdicional,
				 '' PromocionNombre, 0 PromocionClienteCntPagan, 0 PromocionClienteCntIngresan,0 PromocionDescuento,
				 productoEdadMinima,productoEdadmaxima , isNull(productonumerodias,0)	
			from [PRODUCTO] p JOIN producto_destino pd on p.productoId = pd.cod_producto and  pd.cod_destino = @DestinoId and pd.est_registro=1			
			where (@pOrigen=0 or p.productopaisId = @pOrigen)			
			and p.productoactivo = 1 and p.productoactivoweb = 1 --and productoMarca=1 //se le quita la marca a pedido de Yessica 25/03/2026
			and (@pEdadMayor between productoEdadMinima and productoEdadmaxima)
			and (@pProductoId = 0 or p.productoId = @pProductoId)
			and ((@pDias < 366 and productonumerodias=0 ) or  productonumerodias=@pDias)

			OPEN cursor_tarifa;
			FETCH cursor_tarifa INTO	@vProductoId, @vProductoNombre, @vproductoImporteTarifaFija, @vproductoordenlistado, @vproductoImporteDiaAdicional,
										@vPromocionNombre, @vPromocionClienteCntPagan,@vPromocionClienteCntIngresan,@vPromocionDescuento,
										@vEdadMinima,@vEdadMaxima, @vCantidadDiasProd
			WHILE @@FETCH_STATUS = 0
				BEGIN
		
				SET @vPrecio = 0
				SET @vTotalPasajeros = 0
				SET @vCantidadPasajeros = @pCantidadPasajeros
		
				DECLARE @r1 VARCHAR(max)
				EXEC ProductoBeneficio_Obtener_html2 @vProductoId, 0, 1, @r1 OUTPUT
		
				--print '@vProductoNombre:' + @vProductoNombre
				--print 'tarifafija:' + CAST(@vproductoImporteTarifaFija as varchar(50))
					
					--Producto Anual 
					if @vCantidadDiasProd = 366 
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

					   if ISNULL(@vPrecio,0) > 0 
					   begin			   		
		                        --print '@vPromocionNombre' + @vPromocionNombre
							IF ISNULL(@vPromocionNombre,'') <> ''
							--Existe Promoción
							BEGIN						
								--Validar si existe porcentaje de descuento
								IF @vPromocionDescuento = 0
									BEGIN
										--Validar cantidad de pasajeros
										IF @vPromocionClienteCntIngresan = @vCantidadPasajeros
											BEGIN
												SET @vCantidadPasajeros = @vPromocionClienteCntPagan
											END
									END
								ELSE
									BEGIN								
										SET @vPrecio = @vPrecio - (@vPrecio * CAST(@vPromocionDescuento AS float) / 100)
									END							
							END
							ELSE
							--No existe promocion
								BEGIN
									SET @vPromocionNombre = ''
								END
					/*
							if @vproductoImporteDiaAdicional > 0
							BEGIN
								SET @vTotalPasajeros = (@vPrecio * @vCantidadPasajeros) * @vproductoImporteDiaAdicional	
							END
					 			ELSE
					 			BEGIN
						 			SET @vTotalPasajeros = (@vPrecio * @vCantidadPasajeros)
					 			END
							print '@vTotalPasajeros:'+ cast(@vTotalPasajeros as varchar(50))
							
					 */
					       SET @vTotalPasajeros = (@vPrecio * @vCantidadPasajeros)
					   end
				
		
				insert into #Resultados 
							values(@vProductoId,
							@vProductoNombre,					
							@vTotalPasajeros,
							@vproductoordenlistado, @r1,@vPromocionNombre,
							@vEdadMinima,@vEdadMaxima,@Cantidad_Dias)
		
				FETCH cursor_tarifa INTO	@vProductoId, @vProductoNombre, @vproductoImporteTarifaFija, @vproductoordenlistado, @vproductoImporteDiaAdicional,
											@vPromocionNombre, @vPromocionClienteCntPagan,@vPromocionClienteCntIngresan,@vPromocionDescuento,
											@vEdadMinima,@vEdadMaxima,@vCantidadDiasProd;
				END;
			CLOSE cursor_tarifa;
			DEALLOCATE cursor_tarifa;

			select * from #Resultados where Total > 0 order by Total asc

			drop table #Resultados
	end
END;
