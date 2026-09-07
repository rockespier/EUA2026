-- Objeto: euroamer_admin_2008.Cotizador_ProductoCobertura_Consulta
-- Creado en BD: 2025-08-13 07:29:23
-- Modificado en BD: 2025-08-13 07:29:23
-- Extraído: 2026-09-07 08:27:16 UTC
-- Referenciado por el backend .NET: NO (revisar si sigue en uso)
-- Parámetros:
--   @pInicio date (IN)
--   @pFin date (IN)
--   @pEdadRango varchar (IN)
--   @pDescuento20 varchar (IN)
--   @pDescuento25 varchar (IN)
--   @pArrProducto varchar (IN)

CREATE PROCEDURE [euroamer_admin_2008].[Cotizador_ProductoCobertura_Consulta]
@pInicio date,
@pFin date,
@pEdadRango varchar(30),
@pDescuento20 varchar(8),
@pDescuento25 varchar(8),
@pArrProducto varchar(max)
AS
BEGIN

 SET NOCOUNT ON;
-- select * from cotizador_producto
-- Cotizador_ProductoCobertura_Consulta '20230818','20230917','Edad00_74','Dscto_20','','CLASSIC|PRIORITY'"
-- select datediff(D,'20230818','20230917')
--Las tarifas van de  0 a 74 años  =  tarifa regular Y de  75 a  84 años  11  meses =  tarifa regular  + 50%  

declare @pDias INT
Declare @Factor INT
Declare @productoId INT
Declare @productoNombre varchar(30)
Declare @productoImporte decimal(10,2)
Declare @productoTipo int
Declare @productoAge varchar(30) = 'AGE UP GRADE >=75 A 84'
Declare @pEdad varchar(10)

    set @pDias = datediff(D,@pInicio,@pFin)

	CREATE table #productos(
	descripcion varchar(30)
	)

	insert into #productos 
	select item from euroamer_admin_2008.fnSplit2(@pArrProducto,'|')

	CREATE TABLE #resultados(
	id int,
	col1 varchar(max),
	col2 varchar(max)
	)

Declare cur_Edad Cursor for select item from euroamer_admin_2008.fnSplit2(@pEdadRango,'|');
	Open cur_Edad;
		Fetch next from cur_Edad into @pEdad
		While @@fetch_status = 0
			Begin

	if @pEdad = 'Edad00_74'
		begin
			SET @Factor = 1
			SET @productoAge = ''
		end
	else
		begin
			SET @Factor = 1.5
			SET @productoAge = 'AGE UP GRADE >=75 A 84'
		end
			
			Declare cur_Select Cursor for 
			select cp.productoId,cp.productoNombre,ROUND((cpt.tarifaImporte * @Factor),2,1),cp.productoTipo
			from cotizador_producto_tarifa cpt, cotizador_producto cp
			where tarifadia = @pDias
			and cpt.productoId = cp.productoId
			and cp.productonombre in (select descripcion from #productos)
			order by cp.productoTipo,cp.productonombre
			
			Open cur_Select;
			Fetch next from cur_Select into @productoId,@productoNombre,@productoImporte, @productoTipo
			While @@fetch_status = 0
			Begin
				if @pEdad = 'Edad00_74'
				begin
					insert into #resultados values(@productoId,'PRODUCTOS POR PASAJERO DE 0 A 74 AÑOS / CON COBERTURA COVID','COLSPAN2')
				end
				if @pEdad = 'Edad75_85'
				begin
					insert into #resultados values(@productoId,'PRODUCTOS POR PASAJERO DE 75 A 84 AÑOS / CON COBERTURA COVID','COLSPAN2')
				end

				if @productoTipo=1
				begin
					insert into #resultados values(@productoId,'PRODUCTO', @productoNombre + ' ' + @productoAge)
				end
				else
					begin
						insert into #resultados values(@productoId,'PRODUCTO', @productoNombre + ' ' + @productoAge + ' ANUAL')
					end

				insert into #resultados values(@productoId,'TARIFA NORMAL USD (DOLAR AMERICANO)','USD ' + convert(varchar,@productoImporte))
				
				if @pDescuento20 = 'Dscto_20'
					begin
						insert into #resultados values(@productoId,'TARIFA CON 20%','USD ' + convert(varchar, convert(decimal(10,2),(@productoImporte - (@productoImporte * 0.20)))))
					end
	
				if @pDescuento25 = 'Dscto_25'
					begin
						insert into #resultados values(@productoId,'TARIFA CON 25%','USD ' + convert(varchar, convert(decimal(10,2),(@productoImporte - (@productoImporte * 0.25)))))
					end
				
					insert into #resultados
					select @productoId,'COBERTURA',coberturadetalle from cotizador_producto_cobertura where coberturaproductoId = @productoId
				

				fetch next from cur_Select into @productoId,@productoNombre,@productoImporte, @productoTipo;
			End

			Close cur_Select;
			Deallocate cur_Select;	

fetch next from cur_Edad into @pEdad;
			End

			Close cur_Edad;
			Deallocate cur_Edad;	

    select * from #resultados

	select * from #productos

	--drop table #resultados
	--drop table #productos

	

END
