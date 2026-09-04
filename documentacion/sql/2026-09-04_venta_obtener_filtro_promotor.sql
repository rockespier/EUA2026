/*
================================================================================
 Optimizacion: filtrado por Promotor en el listado de Ventas
 Issue: #77 (rockespier/EUA2026) - [BUG] Lentitud en listado de Ventas
================================================================================

 CONTEXTO
 --------
 En la busqueda avanzada del listado de Ventas, al filtrar por "Promotor",
 el flujo actual es:

   1) VentaController.getObtenerVentas (api/venta/VentasObtener) llama a
      IUnitOfWork.Ventas.Ventas_Obtener(...), que ejecuta el stored procedure
      "Venta_Obtener_2026" SIN ningun filtro por promotor: siempre trae todas
      las ventas que matchean el resto de filtros (fechas, pais, agencia, etc).
   2) Si se recibio pPromotorId > 0, el controller hace una segunda consulta
      (Agencia_Obtener_nuevo) para resolver las agencias del promotor, y luego
      filtra en memoria (C#, "IEnumerable.Where") el resultado ya traido en el
      paso 1.

 Esto obliga a la base de datos y a la API a transportar y deserializar el
 listado COMPLETO (sin filtrar por promotor) en cada busqueda por promotor,
 lo cual es la causa principal de la lentitud reportada en el issue.

 El propio codebase ya tiene el patron correcto para este caso: el stored
 procedure "Liquidacion_Obtener_2026" (usado por VentaRepository.Liquidacion_Obtener)
 SI acepta un parametro nativo "@pAgenciaPromotorId" y filtra en el propio SQL.

 CAMBIO DE APLICACION (ya incluido en este PR)
 ----------------------------------------------
 Como paso intermedio, sin tocar el SP, se paralelizo (Task.WhenAll) la
 consulta de ventas y la resolucion de agencias del promotor en
 VentaController.getObtenerVentas, para que ambas corran al mismo tiempo en
 vez de en secuencia. Esto reduce la latencia percibida pero NO reduce el
 volumen de datos transferidos/deserializados: la causa raiz sigue siendo que
 "Venta_Obtener_2026" no filtra por promotor en el propio SQL.

 IMPORTANTE - REVISAR ANTES DE EJECUTAR / COORDINAR CON EL DBA
 ---------------------------------------------------------------
 El stored procedure "Venta_Obtener_2026" NO esta versionado en este
 repositorio (vive solo en la base de datos). Este archivo es una PLANTILLA
 de referencia, no un script ejecutable de punta a punta. Para eliminar la
 causa raiz de la lentitud, el DBA debe:

   1) Modificar "Venta_Obtener_2026" para que acepte un nuevo parametro,
      por ejemplo @pAgenciaPromotorId INT = 0 (mismo nombre/convencion que
      "Liquidacion_Obtener_2026"), y que cuando sea > 0 filtre las ventas
      por las agencias asociadas a ese promotor directamente en el WHERE/JOIN
      del SP (en vez de devolver todo y filtrar en la app).
   2) Verificar que exista un indice adecuado sobre la(s) columna(s) que
      relacionan venta -> agencia -> promotor (por ejemplo el FK de agencia
      en la tabla de ventas, y el FK de promotor en la tabla de agencias)
      para que el nuevo filtro sea "index seek" y no "table scan".
   3) Una vez el SP soporte el parametro, actualizar en este repositorio:
        - IVentaRepository.Ventas_Obtener: agregar "int int_pPromotorId = 0".
        - VentaRepository.Ventas_Obtener (Dapper): agregar
          parameters.Add("@pAgenciaPromotorId", int_pPromotorId);
        - VentaController.getObtenerVentas: pasar pPromotorId directamente a
          Ventas_Obtener y eliminar el filtrado en memoria
          (Agencia_Obtener + Where) que hoy compensa la falta de soporte
          nativo en el SP.

 No se incluye un ALTER PROCEDURE porque la definicion actual de
 "Venta_Obtener_2026" no esta disponible en este repositorio, y modificarla
 a ciegas podria romper el listado de Ventas completo (usado por todas las
 busquedas, no solo las filtradas por promotor) si el despliegue de la API
 no queda perfectamente sincronizado con el despliegue del SP.
================================================================================
*/
