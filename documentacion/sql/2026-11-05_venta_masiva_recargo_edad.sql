-- Issue #113 (RT-107): la importacion masiva de ventas no aplicaba el recargo por edad.
-- SP: euroamer_admin_2008.VentaMasiva_ProcesarNuevo_2026
-- Cambio: si la edad del pasajero esta entre productoEdadMaxima (exclusivo) y
--         productoImporteDiaAdicional (inclusivo, limite de edad con recargo, ej. 84),
--         ventaImporteVenta = ROUND(tarifa * 1.5, 0). ventaProductoImporte conserva la tarifa base.
--         Misma regla que VentaGrupal_Procesar_2026 (venta manual) y el cotizador.
-- Aplica a importacion interna y externa (ambas usan este SP) y a todos los paises.
-- Aplicar en la BD manualmente: los SP no estan versionados.
-- Solo se muestran los bloques modificados; el resto del SP queda igual.

-- 1) Declaraciones (junto a las demas variables):
--    DECLARE @vVENTA_ImporteVenta DECIMAL(18,4)

-- 2) Despues de calcular @vVENTA_ClienteEdad y @vVENTA_ProductoImporte:
SET @vVENTA_ImporteVenta = @vVENTA_ProductoImporte;

IF EXISTS (SELECT 1 FROM PRODUCTO
           WHERE productoId = @pVENTA_ProductoId
             AND @vVENTA_ClienteEdad > productoEdadMaxima
             AND @vVENTA_ClienteEdad <= productoImporteDiaAdicional)
BEGIN
    SET @vVENTA_ImporteVenta = ROUND((@vVENTA_ProductoImporte * 1.5), 0);
END

-- 3) En el INSERT INTO VENTA_TMP, en VALUES, reemplazar el segundo
--    @vVENTA_ProductoImporte (columna ventaImporteVenta) por:
--        @vVENTA_ImporteVenta
