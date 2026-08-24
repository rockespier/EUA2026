# Cambios de API

## `POST Venta/VentasProcesar` — nuevo campo `ventaOrigen`

Relacionado a: issue #6 (Origen de ventas).

### Descripción

Se agrega el campo opcional `ventaOrigen` al registro de una venta, para capturar el origen del vuelo del pasajero (texto libre). Es análogo al campo existente `ventaDestino`.

### Body de la petición (`BEVentaParametro`)

```json
{
  "...": "...",
  "ventaDestino": "LIMA",
  "ventaOrigen": "CUSCO",
  "...": "..."
}
```

- `ventaOrigen` (`string`, opcional): puede enviarse vacío o `null`. No tiene validación de longitud ni de formato, igual que `ventaDestino`.

### Endpoints afectados

- `POST Venta/VentasProcesar` (`VentaController.postProcesarVentas`) — creación de venta individual/grupal. Internamente invoca el stored procedure `VentaGrupal_Procesar`, que ahora recibe el parámetro adicional `@pVENTA_Origen`.
- `POST Venta/VentasMasivoProcesar` (`VentaController.postVentasMasivoProcesar`) — importación masiva. Internamente invoca el stored procedure `VentaMasiva_ProcesarNuevo`, que ahora recibe el parámetro adicional `@pVENTA_Origen`.

### ⚠️ Dependencia externa (base de datos)

Este repositorio no contiene scripts de migración ni las definiciones de los stored procedures (viven en la base de datos SQL Server, fuera del repo). El código ya envía el parámetro `@pVENTA_Origen` en las llamadas Dapper a `VentaGrupal_Procesar` y `VentaMasiva_ProcesarNuevo`, pero **estos stored procedures deben actualizarse en la base de datos antes de desplegar este cambio**, o las llamadas fallarán con un error de SQL Server ("procedure or function has too many arguments specified").

Cambios sugeridos a coordinar con el DBA:

```sql
ALTER TABLE Venta ADD Origen NVARCHAR(100) NULL;

-- En VentaGrupal_Procesar y VentaMasiva_ProcesarNuevo:
--   agregar parámetro @pVENTA_Origen NVARCHAR(100) = NULL
--   e incluir la columna Origen en el INSERT/UPDATE correspondiente.

-- Si se desea listar/consultar el origen en pantallas de detalle,
-- agregar la columna Origen también a los SELECT de:
--   Venta_Obtener_2026, Venta_Obtener, Liquidacion_Obtener3
```

### Frontend

- `Views/Shared/_VentaPopup.cshtml`: nuevo campo de texto "Origen" a la izquierda de "Destino" en el formulario de registro de venta (opcional).
- `Views/Proceso/ListaVentas.cshtml`: nuevo campo de solo lectura "Origen" en el popup de consulta de venta.
- `wwwroot/Travel/VentaCotizar.js`: envía `ventaOrigen` al crear la venta; se limpia junto con el resto del formulario.
- `wwwroot/Travel/Venta.js`: muestra `ventaOrigen` en el popup de consulta (depende de que el SP de consulta devuelva la columna `Origen`, ver sección anterior).

### Fuera de alcance de este cambio

- Importación masiva vía Excel (`ProcesoController` — mapeo de columnas del archivo): no se agregó columna "Origen" al layout del Excel para no alterar los índices de columna existentes.
