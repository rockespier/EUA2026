-- Objeto: euroamer_admin_2008.Cotizador_ProductoTarifa_Procesar
-- Creado en BD: 2025-08-13 07:28:52
-- Modificado en BD: 2025-08-13 07:28:52
-- Extraído: 2026-09-07 08:27:16 UTC
-- Referenciado por el backend .NET: NO (revisar si sigue en uso)
-- Parámetros:
--   @pTARIFA_Dia int (IN)
--   @pTARIFA_Tipo int (IN)
--   @pTARIFA_Importe varchar (IN)

CREATE PROCEDURE [euroamer_admin_2008].[Cotizador_ProductoTarifa_Procesar]
@pTARIFA_Dia INT,
@pTARIFA_Tipo INT,
@pTARIFA_Importe varchar(max)
AS
BEGIN

 SET NOCOUNT ON;

DECLARE @vImporte DECIMAL(18,4)
DECLARE @vProductoId INT 

if @pTARIFA_Tipo = 1
	begin
		set @vProductoId = 1
	end
else
	begin
		set @vProductoId = 7
	end

DECLARE @vConsecutivo int = @pTARIFA_Dia
DECLARE @cnt INT = 1
DECLARE @cnt_total INT = 365


Declare cur_Select Cursor for select item from euroamer_admin_2008.fnSplit2(@pTARIFA_Importe,',');
	Open cur_Select;
		Fetch next from cur_Select into @vImporte
		While @@fetch_status = 0
			Begin
			--SI es producto Anual?
			if @vProductoId >= 7
				begin
					if @vImporte > 0		
					begin			
						
						SET @cnt = 1
						SET @cnt_total = 365

						WHILE @cnt <= @cnt_total
						BEGIN
						   
						   --select count(0) from cotizador_producto_tarifa where productoId=9 and tarifaDia = 1
						   --insert into cotizador_producto_tarifa(productoId,tarifaDia,tarifaImporte,tarifaDiaConsecutivo) values(9,1,129,30)
							if ((select count(0) from cotizador_producto_tarifa where productoId=@vProductoId and tarifaDia = @cnt and tarifaDiaConsecutivo = @vConsecutivo) = 0)
								begin
									insert into cotizador_producto_tarifa(productoId,tarifaDia,tarifaImporte,tarifaDiaConsecutivo) 
									values(@vProductoId,@cnt,@vImporte,@vConsecutivo)
									--print 'insert' + '|' + convert(varchar,@vProductoId) + '|' + convert(varchar,@cnt) + '|' + convert(varchar,@vConsecutivo)
								end
							else
								begin
									update cotizador_producto_tarifa set tarifaImporte = @vImporte
									where productoId = @vProductoId and tarifaDia = @cnt and tarifaDiaConsecutivo = @vConsecutivo
									--print 'update'+ '|' + convert(varchar,@vProductoId) + '|' + convert(varchar,@cnt) + '|' + convert(varchar,@vConsecutivo)
								end					
							--

						   SET @cnt = @cnt + 1
						END
						
					end
				end
				else
					begin
					--Productos no anuales
						if @vImporte > 0		
						begin
				
							if ((select count(0) from cotizador_producto_tarifa where productoId=@vProductoId and tarifaDia=@pTARIFA_Dia) = 0)
								begin
									insert into cotizador_producto_tarifa(productoId,tarifaDia,tarifaImporte,tarifaDiaConsecutivo) 
									values(@vProductoId,@pTARIFA_Dia,@vImporte,@vConsecutivo)
								end
							else
								begin
									update cotizador_producto_tarifa set tarifaImporte = @vImporte
									where productoId = @vProductoId and tarifaDia = @pTARIFA_Dia
								end					
						end
					end

				set @vProductoId = @vProductoId + 1

			fetch next from cur_Select into @vImporte;
		End

	Close cur_Select;
	Deallocate cur_Select;	

END
