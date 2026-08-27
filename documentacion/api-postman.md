# Cambios de API

## Mejoras en Liquidaciones (precio editable, descuento y filtro por ejecutivo cobrador)

Relacionado a: issue #9 (Mejoras en Liquidaciones).

### Descripción

1. La columna "Precio" de la grilla de Liquidación (`VentasLiquidacionObtener`) ahora es editable directamente en el datatable; el guardado se hace con un nuevo endpoint dedicado y queda constancia de la edición manual.
2. Se agrega una caja de texto de "Descuento (%)" en la pantalla de Liquidación; al hacer clic en "Liquidación" el porcentaje se aplica al total a pagar antes de generar el Excel y de liquidar cada venta.
3. Se agrega el filtro "Ejecutivo cobrador" (dropdown) al popup de búsqueda avanzada de Liquidación.

### `GET Venta/VentasLiquidacionObtener` — nuevo parámetro `pEjecutivoCobradorId`

- `pEjecutivoCobradorId` (`int`, opcional, default `0`): filtra la búsqueda por el ejecutivo cobrador asociado a la agencia de la venta (mismo campo de valores `cobranzaCobradorId` ya usado en el combo "Cobrador" de la Cancelación de Liquidación y en `Agencia.agenciaEjecutivoCobrador`). `0` = sin filtro.
- Internamente se agrega el parámetro `@pEjecutivoCobradorId` a la llamada del stored procedure `Liquidacion_Obtener3`.

### `POST Venta/VentaPrecioActualizarProcesar` — nuevo endpoint

Actualiza únicamente el precio (`ventaImporteVenta`) de una venta desde la edición inline de la grilla de Liquidación, dejando constancia de que fue una edición manual (para auditoría). Se creó como endpoint independiente de `VentaActualizarProcesar` para no arrastrar los demás campos que ese endpoint actualiza (comisión, incentivo, importe por pagar, fecha de cancelación), que corresponden a otro flujo (cancelación de venta).

Parámetros (query string, `POST`):

```
pVentaID: int
pPrecio: decimal
pUsuarioId: int
```

Internamente invoca un nuevo stored procedure `Venta_ActualizarPrecio`.

### `POST LiquidacionGenerarExcel` (frontend, `ProcesoController`) — nuevo campo `DescuentoPorcentaje`

Se agrega el campo `DescuentoPorcentaje` (`decimal`, opcional, default `0`) al body `BELiquidacionExportar` que arma el botón "Liquidación". El porcentaje se aplica al total a pagar de cada venta (después de restar la publicidad y antes de acumular/grabar), impactando tanto el Excel generado como el importe (`pago`) enviado a `Venta/VentasLiquidacionProcesar`.

```json
{
  "CodigoTarjeta": "1001, 1002",
  "CodigoAgencia": 55,
  "CodigoMotivo": "P",
  "formula": 1,
  "DescuentoPorcentaje": 5.5
}
```

### `BEVenta` — nuevo campo `ventaPrecioEditadoManual`

Se agrega la propiedad `ventaPrecioEditadoManual` (`bool`) al modelo `BEVenta`, para que la grilla pueda marcar visualmente el precio editado manualmente. Requiere que `Liquidacion_Obtener3` incluya esta columna en el `SELECT`; mientras no se actualice el stored procedure, el campo llega en `false` por defecto y la marca visual simplemente no aparece (no rompe el listado existente).

### ⚠️ Dependencia externa (base de datos)

Este repositorio no contiene stored procedures (viven en SQL Server, fuera del repo). Los siguientes cambios deben coordinarse con el DBA antes de desplegar, o las llamadas fallarán / los filtros y la auditoría no tendrán efecto:

```sql
-- 1) Nueva columna de auditoría para saber si el precio fue editado manualmente
ALTER TABLE Venta ADD PrecioEditadoManual BIT NOT NULL DEFAULT 0;

-- 2) Nuevo stored procedure para el guardado inline del precio (POST Venta/VentaPrecioActualizarProcesar)
--    Firma esperada por el código Dapper:
--      @pVENTA_Id INT,
--      @pVENTA_ImportePrecio DECIMAL(18,2),
--      @pVENTA_Usuario INT
--    Debe actualizar Venta.ImporteVenta = @pVENTA_ImportePrecio,
--    Venta.PrecioEditadoManual = 1, Venta.ModificadoUsuarioId = @pVENTA_Usuario,
--    Venta.ModificadoFecha = GETDATE(), y devolver (codigo, descripcion) como los demás SP de actualización.

-- 3) Liquidacion_Obtener3: agregar el parámetro @pEjecutivoCobradorId INT = 0
--    y filtrar por el ejecutivo cobrador de la agencia (Agencia.EjecutivoCobrador),
--    además de incluir la columna PrecioEditadoManual AS ventaPrecioEditadoManual en el SELECT
--    para que se refleje en la grilla.

-- 4) Liquidacion_Procesar: dado que el importe a pagar (@pVENTA_Pago) ya llega
--    con el descuento porcentual aplicado desde el backend .NET, no requiere cambios,
--    pero se recomienda verificar que el SP no recalcule ese importe internamente.
```

### Frontend

- `Views/Proceso/ListaLiquidaciones.cshtml`: nuevo campo "Descuento (%)" junto al selector de fórmula, y nuevo dropdown "Ejecutivo cobrador" (`#mdvenSelEjeCobradorSearch`) en el popup de búsqueda avanzada.
- `wwwroot/Travel/Liquidacion.js`: columna "Precio" editable (`contenteditable`) con guardado vía `Venta/VentaPrecioActualizarProcesar` al perder el foco; carga y lectura del filtro "Ejecutivo cobrador" (reutiliza `getValoresTipo('cobranzaCobradorId', 1)`); lectura del descuento (%) y envío en el body de `/LiquidacionGenerarExcel`.

### Fuera de alcance de este cambio

- No se agregó una tabla de auditoría/bitácora genérica; se reutiliza el patrón existente de columnas `ModificadoUsuarioId`/`ModificadoFecha` + el nuevo flag `PrecioEditadoManual`.
- No se agregó una columna de "Descuento" nueva al Excel generado; el descuento se refleja en la columna existente "A PAGAR".

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
