<!-- Ejemplo de referencia: cómo queda un SP documentado a partir de _template.md -->

# `dbo.Pais_Obtener`

| Campo | Valor |
|---|---|
| Dominio | `Pais` |
| Repositorio (.NET) | `PaisRepository.cs` |
| Método(s) que lo invoca | `Pais_Obtener(int int_pPaisID, int int_PaisActivo = -1)` |
| Endpoint(s) de API | `GET /Configuracion/PaisObtener` (`ConfiguracionController.getObtenerPais`) |
| Tipo de operación | Lectura |
| Última extracción de fuente | `2026-09-07` (ver `manifest.csv`) |
| `modify_date` en BD al extraer | *pendiente* |
| Archivo fuente | `../../sql/euroamer_admin_2008.Pais_Obtener.sql` |

## Propósito

Devuelve el listado de países configurados en el sistema, opcionalmente filtrado por
`PaisId` (un solo país) y por estado activo/inactivo. Es la fuente de datos del combo/listado
de países en el módulo de Configuración del frontend.

## Parámetros

| Nombre | Tipo SQL | Dirección | Obligatorio | Descripción |
|---|---|---|---|---|
| `@pPAIS_Id` | `int` | IN | No (0 = todos, según convención del resto de SPs `_Obtener`) | Filtra a un país específico |
| `@pPAIS_Activo` | `int` | IN | No, default `-1` | `-1` = sin filtro, `1`/`0` = activo/inactivo |

## Tablas / vistas involucradas

Lee al menos `dbo.PAIS`; también invoca las funciones escalares
`euroamer_admin_2008.promocionId_Nombres` y `euroamer_admin_2008.Usuario_RecuperarNombre`
para resolver nombres de promoción y de promotor por defecto (ver el `.sql` extraído).

## Lógica de negocio relevante

- Si `@pPAIS_Activo = -1` se asume "sin filtro" (patrón repetido en varios `_Obtener` de este
  sistema) — confirmado en el `.sql` extraído.
- `paisNombre` y `paisCorreo` se devuelven en mayúsculas (`UPPER(...)`).

## Dependencias

- Invoca las funciones `euroamer_admin_2008.promocionId_Nombres` y
  `euroamer_admin_2008.Usuario_RecuperarNombre`.

## Manejo de errores

Los métodos `_Obtener` de este repositorio no envuelven el resultado en `BEError`; devuelven
directamente `IEnumerable<BEPais>`. El controller trata "sin filas" como `204` (`Sin información`),
no como error.

## Riesgos / deuda técnica

*Pendiente de completar.*

## Historial de cambios documentados

| Fecha | Autor | Cambio |
|---|---|---|
| `2026-09-07` | Claude (asistente) | Documentación inicial a partir de análisis estático del código y del `.sql` extraído. |
