-- Objeto: euroamer_admin_2008.Cotizador_Listado_ProductoTarifa
-- Creado en BD: 2025-08-13 07:31:11
-- Modificado en BD: 2025-08-13 07:31:11
-- Extraído: 2026-09-07 08:27:16 UTC
-- Referenciado por el backend .NET: NO (revisar si sigue en uso)

CREATE PROCEDURE Cotizador_Listado_ProductoTarifa	
AS
BEGIN
--Cotizador_Listado_ProductoTarifa

    
declare @dia INT

CREATE TABLE #Resultado
	   (   
	   dia int,
	   classic decimal(10,2),
	   priority decimal(10,2),
	   international decimal(10,2),
	   invicta decimal(10,2),
	   gold decimal(10,2),
	   platino decimal(10,2)
	   ) 

DECLARE db_cursor CURSOR FOR
select distinct tarifadia from cotizador_producto_tarifa order by tarifaDia
	OPEN db_cursor;
	FETCH db_cursor INTO @dia
		WHILE @@FETCH_STATUS = 0
			BEGIN

			insert into #Resultado
			select	@dia,(select tarifaimporte from cotizador_producto_tarifa where tarifadia=@dia and productoid=1) [CLASSIC],
					(select tarifaimporte from cotizador_producto_tarifa where tarifadia=@dia and productoid=2) [PRIORITY],
					(select tarifaimporte from cotizador_producto_tarifa where tarifadia=@dia and productoid=3) [INTERNATIONAL],
					(select tarifaimporte from cotizador_producto_tarifa where tarifadia=@dia and productoid=4) [INVICTA],
					(select tarifaimporte from cotizador_producto_tarifa where tarifadia=@dia and productoid=5) [GOLD],
					(select tarifaimporte from cotizador_producto_tarifa where tarifadia=@dia and productoid=6) [PLATINO]

			FETCH db_cursor INTO @dia
			END;
CLOSE db_cursor;
DEALLOCATE db_cursor;  

select * from #Resultado
    
END
