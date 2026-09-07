-- Objeto: euroamer_admin_2008.Cotizador_Listado_Obtener
-- Creado en BD: 2018-10-04 12:41:48
-- Modificado en BD: 2025-08-13 07:32:52
-- Extraído: 2026-09-07 08:27:16 UTC
-- Referenciado por el backend .NET: NO (revisar si sigue en uso)
-- Parámetros:
--   @pOrigen int (IN)
--   @pDestino int (IN)
--   @pDias int (IN)
--   @pCantidadPasajeros int (IN)
--   @pProductoId int (IN)

CREATE PROCEDURE [euroamer_admin_2008].[Cotizador_Listado_Obtener] 
	@pOrigen int,
	@pDestino int,
	@pDias int,
	@pCantidadPasajeros int,
	@pProductoId int = 0
AS
BEGIN
	
	SET NOCOUNT ON;
	DECLARE @vProductoId INT,@vProductoNombre Varchar(255), @vproductoImporteTarifaFija decimal(18,4), @vproductoordenlistado INT
	DECLARE @vPrecio decimal(18,4) = 0
	DECLARE @vproductoImporteDiaAdicional decimal(18,4)
	DECLARE @vPromocionNombre VARCHAR(100), @vPromocionClienteCntPagan int,@vPromocionClienteCntIngresan int,@vPromocionDescuento int
	DECLARE @vCantidadPasajeros INT
	DECLARE @vTotalPasajeros decimal(18,4)
	DECLARE @vEdadMinima as int, @vEdadMaxima int
		
	CREATE TABLE #Resultados(
	ProductoId int,
	ProductoNombre varchar(255), 
	Total decimal(18,4),
	ProductoOrdenListado Int,
	Beneficios varchar(max),
	Promocion varchar(100),
	EdadMinima int,
	EdadMaxima int
	)
		

	DECLARE cursor_tarifa CURSOR FOR
	select p.productoID, p.productonombre, productoImporteTarifaFija, p.productoordenlistado, p.productoImporteDiaAdicional,
	     PromocionNombre,PromocionClienteCntPagan,PromocionClienteCntIngresan,PromocionDescuento,
		 productoEdadMinima,productoEdadmaxima 
	from [PRODUCTO_DESTINO] pd,[PRODUCTO] p left JOIN promocion r on  p.productoPromocionActivo = promocionId 
	where pd.cod_destino = @pDestino 
	and p.productopaisId = @pOrigen
	and p.productoID = pd.cod_producto	
	and p.productoactivo = 1 and p.productoactivoweb = 1
	and (@pProductoId = 0 or p.productoId = @pProductoId)
	--and p.productonumerodias >= @pDias
	and pd.est_registro=1

	OPEN cursor_tarifa;
	FETCH cursor_tarifa INTO	@vProductoId, @vProductoNombre, @vproductoImporteTarifaFija, @vproductoordenlistado, @vproductoImporteDiaAdicional,
	                            @vPromocionNombre, @vPromocionClienteCntPagan,@vPromocionClienteCntIngresan,@vPromocionDescuento,
								@vEdadMinima,@vEdadMaxima
	WHILE @@FETCH_STATUS = 0
		BEGIN
		
		SET @vPrecio = 0
		SET @vCantidadPasajeros = @pCantidadPasajeros
		
		DECLARE @r1 VARCHAR(max)
		EXEC ProductoBeneficio_Obtener_html @vProductoId, 0, 1, @r1 OUTPUT
		
		if @vproductoImporteTarifaFija = 0
		Begin
			
			--Buscar tarifa por rangos
			select @vPrecio = tarifaImporte
			 from PRODUCTO_TARIFA 
			 where tarifaproductoid = @vProductoId			    
			    and @pDias 				
				between tarifaNumeroDiasMinimo and tarifaNumeroDiasMaximo
							
			   if ISNULL(@vPrecio,0) > 0 
			   begin			   		
		
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
								--SET @vPrecio = @vPrecio - (@vPrecio * (@vPromocionDescuento/100))
								SET @vPrecio = @vPrecio - (@vPrecio * CAST(@vPromocionDescuento AS float) / 100)
							END							
					END
					ELSE
						BEGIN
							SET @vPromocionNombre = ''
						END
					
					
					SET @vTotalPasajeros = (@vPrecio * @vCantidadPasajeros) * @vproductoImporteDiaAdicional 						
						
			   end
		End
		else
		BEGIN
			
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
									SET @vproductoImporteTarifaFija = @vproductoImporteTarifaFija - (@vproductoImporteTarifaFija * (@vPromocionDescuento/100))
								END							
					END
					ELSE
						BEGIN
							SET @vPromocionNombre = ''
						END					
					
					SET @vTotalPasajeros = (@vproductoImporteTarifaFija * @pDias * @vCantidadPasajeros) * @vproductoImporteDiaAdicional
		END
		
		insert into #Resultados 
					values(@vProductoId,
					@vProductoNombre,					
					@vTotalPasajeros,
					@vproductoordenlistado, @r1,@vPromocionNombre,
					@vEdadMinima,@vEdadMaxima)
		
		FETCH cursor_tarifa INTO	@vProductoId, @vProductoNombre, @vproductoImporteTarifaFija, @vproductoordenlistado, @vproductoImporteDiaAdicional,
                                    @vPromocionNombre, @vPromocionClienteCntPagan,@vPromocionClienteCntIngresan,@vPromocionDescuento,
									@vEdadMinima,@vEdadMaxima;
		END;
	CLOSE cursor_tarifa;
	DEALLOCATE cursor_tarifa;

	select * from #Resultados order by ProductoOrdenListado,Total

	drop table #Resultados
END;
