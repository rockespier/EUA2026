/*
================================================================================
 Alta de campo: "Pasajero VIP" en Venta
 Issue: #43 (rockespier/EUA2026) - [FEATURE] Pasajero VIP
================================================================================

 CONTEXTO
 --------
 Se agrego un check "Pasajero VIP" en el formulario de registro de pasajeros
 de una venta (pantalla de Cotizar/Registrar Venta, tab "Pasajero"). El valor
 se envia desde el frontend (wwwroot/Travel/VentaCotizar.js, funcion
 ProcesarPasajero) al endpoint existente:

   POST api/venta/VentasPasajeroGrupoProcesar
   (VentaController.postObtenerVentasPasajeroGrupo ->
    IUnitOfWork.Ventas.VentaCliente_Procesar(BEVentaClienteParametro))

 El repositorio (VentaRepository.VentaCliente_Procesar) ya envia el nuevo
 parametro @pVENTACLIENTE_Vip (BIT, 0/1) al stored procedure existente
 "VentaCliente_Procesar".

 IMPORTANTE - REVISAR ANTES DE EJECUTAR
 ---------------------------------------
 Los procedimientos almacenados (VentaCliente_Procesar, VentaCliente_Obtener,
 Venta_Obtener_2026, etc.) NO estan versionados en este repositorio (viven
 solo en la base de datos). Este script es una PLANTILLA de referencia; el
 DBA debe:

   1) Agregar la columna "ventaClienteVip" a la tabla real de la entidad
      Venta (se asume "dbo.venta" por convencion con el resto de columnas
      "ventaCliente*"). Ajustar el nombre de tabla si difiere.
   2) Modificar el stored procedure "VentaCliente_Procesar" para que reciba
      el nuevo parametro @pVENTACLIENTE_Vip BIT y lo guarde en la columna
      "ventaClienteVip".
   3) Modificar los stored procedures de lectura que devuelven las columnas
      de Venta/Pasajero (por ejemplo "VentaCliente_Obtener" y
      "Venta_Obtener_2026") para que tambien devuelvan "ventaClienteVip", de
      forma que el listado de pasajeros y los reportes puedan mostrarla.

================================================================================
*/

SET NOCOUNT ON;

IF NOT EXISTS (
    SELECT 1 FROM sys.columns
    WHERE object_id = OBJECT_ID(N'dbo.venta') AND name = N'ventaClienteVip'
)
BEGIN
    ALTER TABLE dbo.venta
        ADD ventaClienteVip BIT NOT NULL
            CONSTRAINT DF_venta_ventaClienteVip DEFAULT (0);

    PRINT N'Columna ventaClienteVip agregada a dbo.venta.';
END
ELSE
BEGIN
    PRINT N'La columna ventaClienteVip ya existe en dbo.venta. No se realizaron cambios.';
END

-- TODO (DBA): actualizar el stored procedure "VentaCliente_Procesar" para
-- aceptar @pVENTACLIENTE_Vip BIT y persistirlo en ventaClienteVip.
-- No se incluye el ALTER PROCEDURE porque su definicion actual no esta
-- disponible en este repositorio.

-- TODO (DBA): actualizar los stored procedures de lectura ("VentaCliente_Obtener",
-- "Venta_Obtener_2026", etc.) para que el SELECT incluya la columna
-- ventaClienteVip.
