-- Objeto: euroamer_admin_2008.Cotizador_Listado_Producto
-- Creado en BD: 2025-08-13 07:31:41
-- Modificado en BD: 2025-08-13 07:31:41
-- Extraído: 2026-09-07 08:27:16 UTC
-- Referenciado por el backend .NET: NO (revisar si sigue en uso)

CREATE PROCEDURE [euroamer_admin_2008].[Cotizador_Listado_Producto]	
AS
BEGIN
--Cotizador_Listado_Producto
select productoId,productoNombre from cotizador_producto where productoTipo=1 order by productoId

END
