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

## `GET Venta/VentaGestionIncentivosObtener` y `POST Venta/VentaGestionIncentivosProcesar` — nuevos endpoints

Relacionado a: issue #8 (Agregar Post-Incentivo).

### Descripción

Se agregan los campos "Post-Incentivo" (importe) y "Fecha pago Incentivo" a la ficha de venta, debajo de "Comisión", y se habilita su actualización masiva vía Excel desde la pantalla "Pagos Incentivos".

El modelo `BEVenta` (backend y frontend) ya declaraba `ventaIncentivoPostImporte` (float) y `ventaIncentivoFechaPago` (DateTime), y el repositorio Dapper ya tenía implementados — pero sin exponer — `Venta_ObtenerGestionIncentivos` y `VentaGestionIncentivos_Procesar`, que invocan los stored procedures `Venta_ObtenerGestionIncentivos` y `Venta_ActualizarGestionIncentivos`. Este cambio únicamente agrega los controllers/endpoints y la UI que faltaban; **no se creó ningún stored procedure ni columna nueva**, se reutilizan los existentes.

### Endpoints nuevos (`VentaController`)

- `GET Venta/VentaGestionIncentivosObtener?pVentaId={id}` — devuelve `IEnumerable<BEVenta>` (mismo shape que `VentasObtener`) con `ventaIncentivoPostImporte` y `ventaIncentivoFechaPago` para la venta indicada. Internamente invoca `Venta_ObtenerGestionIncentivos`.
- `POST Venta/VentaGestionIncentivosProcesar` — body `BEVentaParametro` (se agregaron los campos `ventaIncentivoPostImporte: decimal` y `ventaIncentivoFechaPago: DateTime`). Internamente invoca `VentaGestionIncentivos_Procesar` → SP `Venta_ActualizarGestionIncentivos`.

```json
{
  "ventaId": 12345,
  "ventaIncentivoPostImporte": 150.00,
  "ventaIncentivoFechaPago": "2026-08-25",
  "ventaCreadoUsuarioId": 10,
  "ventaObservacion": "Pago post-incentivo agosto"
}
```

### ⚠️ Dependencia externa (base de datos)

Este repositorio no contiene los stored procedures (viven en SQL Server, fuera del repo). El código Dapper ya invocaba `Venta_ObtenerGestionIncentivos` y `Venta_ActualizarGestionIncentivos` antes de este cambio (sin usarse desde ningún controller), lo que sugiere que ya existen en la base de datos — **pero debe verificarse con el DBA antes de desplegar**, ya que no hay forma de confirmarlo desde el repositorio. Si no existen, deben crearse con esta firma esperada por el código:

```sql
-- Venta_ObtenerGestionIncentivos: @pVENTA_Id INT -> SELECT que incluya (al menos) VentaId, VentaIncentivoPostImporte, VentaIncentivoFechaPago

-- Venta_ActualizarGestionIncentivos:
--   @pVENTA_Id INT,
--   @pVENTA_Observacion NVARCHAR(...) = NULL,
--   @pVENTA_IncentivoPost DECIMAL(18,2) = NULL,
--   @pVENTA_IncentivoFechaPago DATETIME = NULL,
--   @pVENTA_IncentivoModificadoUsuario INT
-- Debe actualizar Venta.IncentivoPostImporte, Venta.IncentivoFechaPago, Venta.IncentivoModificadoUsuario y devolver (codigo, descripcion).
```

### Frontend

- `Views/Proceso/ListaVentas.cshtml`: nuevos campos "Post-Incentivo" y "Fecha pago Incentivo" en la ficha de venta, debajo de la fila de "Comisión" / "Incentivo" / "Por pagar" / "Fecha Cancelación".
- `wwwroot/Travel/Venta.js`: carga los nuevos campos vía `VentaGestionIncentivosObtener` al abrir la ficha de venta, los habilita/deshabilita junto con el resto de campos editables (permiso de menú 100), y los guarda con una llamada adicional a `VentaGestionIncentivosProcesar` al confirmar la actualización (`ProcesarActualizarVenta`).
- `Views/Proceso/ListaPagoIncentivos.cshtml` + `wwwroot/Travel/ListaPagoIncentivos.js`: nuevo botón "Importar Post-Incentivo" que abre un modal de carga de Excel (mismo patrón que `Views/Proceso/ListaImportar.cshtml` / `ImportarVenta.js`), con descarga de plantilla y reporte de errores por fila.
- `Controllers/ProcesoController.cs` (frontend, no API): nuevas acciones `GET descargarPlantillaPagoIncentivos` (genera la plantilla `.xlsx` en memoria con ClosedXML) y `POST importarExcelPagoIncentivos` (valida y procesa el Excel subido, columnas `VentaId` (numérico), `PostIncentivo` (numérico) y `FechaPagoIncentivo` (fecha), fila de encabezados en la fila 3 y datos desde la fila 4, igual que el layout de `VentasMasivas_*_Plantilla.xlsx`). Por cada fila llama a `Venta/VentaGestionIncentivosProcesar`.

### Fuera de alcance de este cambio

- No se agregó `ventaIncentivoPostImporte`/`ventaIncentivoFechaPago` a los SELECT de `Venta_Obtener`/`Venta_Obtener_2026` (los usados por el listado general de ventas); la ficha de venta los consulta con el endpoint dedicado `VentaGestionIncentivosObtener` en su lugar.
- No se modificó el flujo de aprobación de pago de incentivos existente (`Cobranza/IncentivoPagoObtener` / `IncentivoPagoProcesar`), que es un mecanismo distinto (aprobación de pago al beneficiario) al de "Post-Incentivo" agregado aquí.
