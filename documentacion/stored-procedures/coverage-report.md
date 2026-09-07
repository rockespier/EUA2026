# Reporte de cobertura de stored procedures

Generado: 2026-09-07 08:27:17 UTC

- SPs en la base de datos: 244
- SPs referenciados por el backend (`known-procedures.txt`): 173
- Referenciados en código pero NO encontrados en la BD: 5
- Existen en la BD pero NO referenciados en el código analizado: 76

## Faltantes en la base de datos (posible SP renombrado/eliminado, o entorno distinto)

- Promocion_Eliminar
- Promocion_Procesar
- Solicitud_Anular
- UsuarioAsesor_Listar
- Venta_VerificarSituacion

## Sin referencia en el código analizado (candidatos a revisar/depreciar)

> Nota: esto solo cubre las llamadas Dapper detectadas estáticamente en `Repositories.Dapper`.
> Un SP puede seguir en uso vía jobs de SQL Server, otros sistemas, o llamadas dinámicas no detectadas.

- dbo.CommandExecute
- dbo.DatabaseIntegrityCheck
- dbo.IndexOptimize
- euroamer_admin_2008.Agencia_Obtener
- euroamer_admin_2008.Agencia_Procesar
- euroamer_admin_2008.AgenciaApps_Obtener
- euroamer_admin_2008.Asistencia_Procesar
- euroamer_admin_2008.Cliente_Procesar
- euroamer_admin_2008.Cobrador_Eliminar
- euroamer_admin_2008.Cotizador_Listado_Obtener
- euroamer_admin_2008.Cotizador_Listado_ObtenerN
- euroamer_admin_2008.Cotizador_Listado_ObtenerNuevo
- euroamer_admin_2008.Cotizador_Listado_Producto
- euroamer_admin_2008.Cotizador_Listado_ProductosNuevo
- euroamer_admin_2008.Cotizador_Listado_ProductoTarifa
- euroamer_admin_2008.Cotizador_ProductoCobertura_Consulta
- euroamer_admin_2008.Cotizador_ProductoCobertura_Consulta2
- euroamer_admin_2008.Cotizador_ProductoCobertura_Procesar
- euroamer_admin_2008.Cotizador_ProductoTarifa_Procesar
- euroamer_admin_2008.Empleado_Procesar
- euroamer_admin_2008.FacturacionCaso_Obtener
- euroamer_admin_2008.Liquidacion_Obtener
- euroamer_admin_2008.Liquidacion_Obtener2
- euroamer_admin_2008.Liquidacion_Obtener3
- euroamer_admin_2008.Opcion_Obtener
- euroamer_admin_2008.Pasajero_Procesar
- euroamer_admin_2008.proc_ScriptIndexColumn
- euroamer_admin_2008.Producto_Obtener
- euroamer_admin_2008.ProductoBeneficio_Obtener_html
- euroamer_admin_2008.ProductoBeneficio_Obtener_html2
- euroamer_admin_2008.ProductoBeneficio_Obtener_html3
- euroamer_admin_2008.ProductoBeneficio_Obtener_htmlCoti
- euroamer_admin_2008.Solicitud_Procesar
- euroamer_admin_2008.Solicitud_RegistrarAnulacion_WS
- euroamer_admin_2008.Solicitud_RegistrarCancelacionTarjetasFree_ws
- euroamer_admin_2008.Solicitud_RegistrarModificacionCliente_ws
- euroamer_admin_2008.Solicitud_RegistrarModificacionContacto_ws
- euroamer_admin_2008.Solicitud_RegistrarModificacionImporte_ws
- euroamer_admin_2008.Solicitud_RegistrarModificacionVigencia_ws
- euroamer_admin_2008.Solicitud_RegistrarReActivacion_ws
- euroamer_admin_2008.Solicitud_RegistrarTransferencia_ws
- euroamer_admin_2008.SolicitudAgencia_Obtener
- euroamer_admin_2008.sp_generate_inserts
- euroamer_admin_2008.TarjetaAsistencia_Obtener
- euroamer_admin_2008.TipoCaso_Obtener
- euroamer_admin_2008.usp_ExampleProc
- euroamer_admin_2008.Usuario_ValidarAcceso_old
- euroamer_admin_2008.UsuarioSupervisor_Obtener
- euroamer_admin_2008.Venta_Obtener_backup
- euroamer_admin_2008.Venta_Obtener_nuevo
- euroamer_admin_2008.Venta_Obtener_ORIGINAL
- euroamer_admin_2008.Venta_Obtener_test
- euroamer_admin_2008.Venta_ObtenerNuevo
- euroamer_admin_2008.Venta_ObtenerPasajero
- euroamer_admin_2008.Venta_Procesar
- euroamer_admin_2008.VentaCliente_Obtener
- euroamer_admin_2008.VentaCliente_Procesar
- euroamer_admin_2008.VentaCupon_Eliminar
- euroamer_admin_2008.VentaCupon_Obtener
- euroamer_admin_2008.VentaCupon_Procesar
- euroamer_admin_2008.VentaGrupal_Procesar
- euroamer_admin_2008.VentaGrupal_Procesar_old
- euroamer_admin_2008.VentaMasiva_Procesar
- euroamer_admin_2008.VentaMasiva_ProcesarConsultar
- euroamer_admin_2008.VentaMasiva_ProcesarNuevo
- euroamer_admin_2008.VentaMasivaATV_ProcesarConsultar
- euroamer_admin_2008.VentasPaisAnual_Obtener_old
- euroamer_admin_2008.Visitas_Eliminar
- euroamer_admin_2008.Visitas_Obtener
- euroamer_admin_2008.Visitas_Procesar
- euroamer_admin_2008.VisitasApps_Agencias
- euroamer_admin_2008.VisitasApps_Mapas
- euroamer_admin_2008.VisitasApps_Obtener
- euroamer_admin_2008.VisitasApps_Obtener_Detalle
- euroamer_admin_2008.VisitasApps_Procesar
- euroamer_admin_2008.WS_Venta_Obtener
