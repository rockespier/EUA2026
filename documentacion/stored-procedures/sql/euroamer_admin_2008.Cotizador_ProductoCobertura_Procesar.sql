-- Objeto: euroamer_admin_2008.Cotizador_ProductoCobertura_Procesar
-- Creado en BD: 2025-08-13 07:29:03
-- Modificado en BD: 2025-08-13 07:29:03
-- Extraído: 2026-09-07 08:27:16 UTC
-- Referenciado por el backend .NET: NO (revisar si sigue en uso)
-- Parámetros:
--   @pTARIFA_Tipo int (IN)
--   @pCobertura varchar (IN)

CREATE PROCEDURE Cotizador_ProductoCobertura_Procesar
@pTARIFA_Tipo INT,
@pCobertura varchar(max)
AS
BEGIN

DECLARE @vProductoId INT 
DECLARE @vCoberturaProducto varchar(max)

if @pTARIFA_Tipo = 1
	begin
		set @vProductoId = 1
	end
else
	begin
		set @vProductoId = 7
	end

Declare cur_Select Cursor for select item from euroamer_admin_2008.fnSplit2(@pCobertura,'|');
	Open cur_Select;
		Fetch next from cur_Select into @vCoberturaProducto
		While @@fetch_status = 0
			Begin
				if @vCoberturaProducto <> '-'		
				begin
					if ((select count(0) from cotizador_producto_cobertura where coberturaproductoId=@vProductoId) = 0)
						begin
							insert into cotizador_producto_cobertura(coberturaproductoId,coberturadetalle) 
							values(@vProductoId,@vCoberturaProducto)
						end
					else
						begin
							update cotizador_producto_cobertura set coberturadetalle = @vCoberturaProducto
							where coberturaproductoId = @vProductoId 
						end
				end
				set @vProductoId = @vProductoId + 1

			fetch next from cur_Select into @vCoberturaProducto;
		End

	Close cur_Select;
	Deallocate cur_Select;	

END
