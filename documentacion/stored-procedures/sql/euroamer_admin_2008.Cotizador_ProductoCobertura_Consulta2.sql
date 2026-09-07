-- Objeto: euroamer_admin_2008.Cotizador_ProductoCobertura_Consulta2
-- Creado en BD: 2025-08-13 07:29:13
-- Modificado en BD: 2025-08-13 07:29:13
-- Extraído: 2026-09-07 08:27:16 UTC
-- Referenciado por el backend .NET: NO (revisar si sigue en uso)
-- Parámetros:
--   @pInicio date (IN)
--   @pFin date (IN)
--   @pEdadRango varchar (IN)
--   @pDescuentoRango varchar (IN)
--   @pArrProducto varchar (IN)

CREATE PROCEDURE [euroamer_admin_2008].[Cotizador_ProductoCobertura_Consulta2]
@pInicio date,
@pFin date,
@pEdadRango varchar(30),
@pDescuentoRango varchar(max),
@pArrProducto varchar(max)
AS
BEGIN

 SET NOCOUNT ON;
--select * from cotizador_producto
-- Un elemento de edad, 2 descuentos
-- Cotizador_ProductoCobertura_Consulta2 '20231028','20231126','0074|7584','20|','3|0]9|30]12|30]'
--select * from #productos_eua
-- Dos elementos de edad, 4 descuentos
-- Cotizador_ProductoCobertura_Consulta2 '20230818','20230917','7584|','20|25|30|35','CLASSIC|PRIORITY'

--Las tarifas van de  0 a 74 años  =  tarifa regular Y de  75 a  84 años  11  meses =  tarifa regular  + 50%  

Declare @pDias INT
Declare @pDiasDescripcion varchar(100)
Declare @Factor decimal(10,2)
Declare @productoId INT
Declare @productoNombre varchar(60)
Declare @productoImporte decimal(10,2)
Declare @productoTipo int
Declare @productoDiaConsecutivo int
Declare @productoAge varchar(30) 
Declare @pEdad varchar(10)
Declare @TarifaEdad1 varchar(100)
Declare @TarifaEdad2 varchar(100)
Declare @Descuento1 varchar(100)
Declare @Descuento2 varchar(100)
Declare @Descuento3 varchar(100)
Declare @Descuento4 varchar(100)
Declare @descuentoImporte int
Declare @Cobertura1 varchar(100)
Declare @Cobertura2 varchar(100)
Declare @Cobertura3 varchar(100)
Declare @Cobertura4 varchar(100)

    set @pDias = datediff(D,@pInicio,@pFin)+1

	--print @pDias

	CREATE table #productos_eua(
	id_producto int,
	dias_consecutivos int
	)
		
	Declare cur_prods Cursor for 
	select item from euroamer_admin_2008.fnSplit2(@pArrProducto,']')
	Open cur_prods;
			Fetch next from cur_prods into @productoNombre
			While @@fetch_status = 0
			Begin
			
			--print @productoNombre
					insert into #productos_eua 
					SELECT  
					SUBSTRING(@productoNombre, 1, CHARINDEX('|', @productoNombre) - 1) AS FirstPart, 
					SUBSTRING(@productoNombre, CHARINDEX('|', @productoNombre) + 1, LEN(@productoNombre)) AS SecondPart 		
					
			fetch next from cur_prods into @productoNombre;
			End

	Close cur_prods;
	Deallocate cur_prods;		

	CREATE TABLE #resultados(		
	nom_producto varchar(max), --International
	can_dias varchar(max), --Del 20/07/2023 al 18/08/2023 Son: 30 días
	imp_precioEdad1 varchar(max), --De 0 a 74 años: USD 95.00
	imp_precioEdad2 varchar(max), --De 75 a 84 años: USD 124.00
	imp_descuento1 varchar(max), --20% off: USD 76.00
	imp_descuento2 varchar(max), --30% off: USD 66.50
	imp_descuento3 varchar(max), --40% off: USD 57.00
	imp_descuento4 varchar(max), --50% off: USD 47.50
	dsc_beneficio1 varchar(max), --Validez geografica:
	dsc_beneficio2 varchar(max), --Asistencia
	dsc_beneficio3 varchar(max), --Asistencia
	dsc_beneficio4 varchar(max)  --Asistencia
	)
	
	SET @pDiasDescripcion = 'Del ' + convert(varchar,@pInicio) +' al '+ convert(varchar,@pFin)+' Son: '+ convert(varchar, @pDias) +' días'
	
	--select * from cotizador_producto_tarifa where productoid=12
	
			Declare cur_Select Cursor for 
			select cp.productoId,cp.productoNombre,cpt.tarifaImporte,cp.productoTipo,cpt.tarifaDiaConsecutivo
			from cotizador_producto_tarifa cpt, cotizador_producto cp,#productos_eua pe
			where tarifadia = @pDias
			and cpt.productoId = cp.productoId
			and cp.productoId = pe.id_producto and  cpt.tarifaDiaConsecutivo = pe.dias_consecutivos
			order by cp.productoTipo,cp.productoId
			
			Open cur_Select;
			Fetch next from cur_Select into @productoId,@productoNombre,@productoImporte, @productoTipo, @productoDiaConsecutivo
			While @@fetch_status = 0
			Begin
					print @productoId

					--Determinar tarifas por edad
					SET @TarifaEdad1=''
					SET @TarifaEdad2=''

					Declare cur_Edad Cursor for select item from euroamer_admin_2008.fnSplit2(@pEdadRango,'|');
					Open cur_Edad;
						Fetch next from cur_Edad into @pEdad
						While @@fetch_status = 0
							Begin

							if @pEdad = '0074'
								begin
									SET @Factor = @productoImporte * 1
									SET @productoAge = 'De 0 a 74 años: USD '
									SET @TarifaEdad1 = @productoAge + convert(varchar, (@Factor))
								end
							else
								begin
									SET @Factor = ROUND((@productoImporte * 1.5),0,0)
									SET @productoAge = 'De 75 a 84 años: USD '
									SET @TarifaEdad2 = @productoAge + convert(varchar, (@Factor))
								end										

								fetch next from cur_Edad into @pEdad;
							End

					 Close cur_Edad;
					 Deallocate cur_Edad;					
		
					--Determinar precios con descuento
					Set @Descuento1 =''
					Set @Descuento2 =''
					Set @Descuento3 =''
					Set @Descuento4 =''
					print @pEdadRango
					if @pEdadRango <> '7584|'
					begin
						Declare @contador as int = 1
						Declare @importeConDescuento decimal(10,2)
						Declare @valorDescuento decimal(10,2)

						Declare cur_Dscto Cursor for select item from euroamer_admin_2008.fnSplit2(@pDescuentoRango,'|');
						Open cur_Dscto;
							Fetch next from cur_Dscto into @descuentoImporte
							While @@fetch_status = 0
								Begin
									if @contador < 5
									begin
										set @valorDescuento = (@productoImporte * @descuentoImporte) / 100
										set @importeConDescuento = ROUND((@productoImporte - @valorDescuento),0,0)
										--ROUND(235.515, 0, 0)
										if @contador = 1 Set @Descuento1 = CONVERT(varchar,@descuentoImporte) + '% off: USD '+ CONVERT(varchar,@importeConDescuento)
										if @contador = 2 Set @Descuento2 = CONVERT(varchar,@descuentoImporte) + '% off: USD '+ CONVERT(varchar,@importeConDescuento)
										if @contador = 3 Set @Descuento3 = CONVERT(varchar,@descuentoImporte) + '% off: USD '+ CONVERT(varchar,@importeConDescuento)
										if @contador = 4 Set @Descuento4 = CONVERT(varchar,@descuentoImporte) + '% off: USD '+ CONVERT(varchar,@importeConDescuento)
									end
									
										Set @contador = @contador + 1
									fetch next from cur_Dscto into @descuentoImporte;
								End

						 Close cur_Dscto;
						 Deallocate cur_Dscto;
					end
					Set @contador = 1

					Declare @Cobertura varchar(max)
					--Determinar los beneficios
					Declare cur_Bene Cursor for select item from euroamer_admin_2008.fnSplit2((select coberturadetalle from cotizador_producto_cobertura where coberturaproductoId = @productoId),'<BR>');
					Open cur_Bene;
						Fetch next from cur_Bene into @Cobertura
						While @@fetch_status = 0
							Begin
								if @contador < 5
								begin
									if @contador = 1 Set @Cobertura1 = @Cobertura
									if @contador = 2 Set @Cobertura2 = @Cobertura
									if @contador = 3 Set @Cobertura3 = @Cobertura
									if @contador = 4 Set @Cobertura4 = @Cobertura
								end								
									Set @contador = @contador + 1;
								fetch next from cur_Bene into @Cobertura;
							End

					 Close cur_Bene;
					 Deallocate cur_Bene;
					
					if @productoDiaConsecutivo > 0 
						begin
							set @productoNombre = @productoNombre + ' (' + convert(varchar,@productoDiaConsecutivo) +' Días consecutivos' + ')'
						end
					
					insert into #resultados(nom_producto,can_dias,imp_precioEdad1,imp_precioEdad2,
											imp_descuento1,imp_descuento2,imp_descuento3,imp_descuento4,
											dsc_beneficio1,dsc_beneficio2,dsc_beneficio3,dsc_beneficio4)
					select @productoNombre,@pDiasDescripcion,@TarifaEdad1,@TarifaEdad2,
					       @Descuento1,@Descuento2,@Descuento3,@Descuento4,
						   @Cobertura1,@Cobertura2,@Cobertura3,@Cobertura4
									
				fetch next from cur_Select into @productoId,@productoNombre,@productoImporte, @productoTipo, @productoDiaConsecutivo;
			End

			Close cur_Select;
			Deallocate cur_Select;	

	--select * from #productos_eua				
    select * from #resultados
	
	drop table #resultados
	drop table #productos_eua
	
	
END
