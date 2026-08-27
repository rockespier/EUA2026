using BackAssistanceTravelers.Models.Agencia;
using BackAssistanceTravelers.Models.Error;
using BackAssistanceTravelers.Models.Pasajero;
using BackAssistanceTravelers.Models.Venta;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace BackAssistanceTravelers.Repositories.Travel
{
	public interface IVentaRepository
	{
		Task<BEError> Venta_Anular(int int_pVentaID);
		Task<IEnumerable<BEVenta>> Ventas_Obtener(string? str_pOrigen = "", DateTime dte_pVentaIngresoInicio = default, DateTime dte_pVentaIngresoFin = default, int int_pVentaID = 0, int int_pUsuarioId = 0,
													string? str_pEstadoId = "", string? str_pSituacionId = "", int int_pAgenciaId = 0, int int_pAgenciaUsuarioId = 0, string? str_pClienteNombres = "",
													string? str_pClienteApellidos = "", int int_pPaisId = 0, string? str_pCodigoExterno = "", string? str_pTipoDoc = "", string? str_pNumeDoc = "");
		Task<IEnumerable<BEVenta>> Venta_Web_Obtener(string? str_pOrigen = "", DateTime dte_pVentaIngresoInicio = default, DateTime dte_pVentaIngresoFin = default, int int_pVentaID = 0, int int_pUsuarioId = 0, string? str_pEstadoId = "", string? str_pSituacionId = "", int int_pAgenciaId = 0, int int_pAgenciaUsuarioId = 0, string? str_pClienteNombres = "", string? str_pClienteApellidos = "", int int_pPaisId = 0, string? str_pCodigoExterno = "");
		Task<IEnumerable<BEVenta>> Liquidacion_Obtener(string? str_pOrigen = "", DateTime dte_pVentaIngresoInicio = default, DateTime dte_pVentaIngresoFin = default, int int_pVentaID = 0, int int_pUsuarioId = 0, string? str_pEstadoId = "", string? str_pSituacionId = "", int int_pAgenciaId = 0, int int_pAgenciaUsuarioId = 0, string? str_pClienteNombres = "", string? str_pClienteApellidos = "", int int_pPaisId = 0, string? str_pCodigoExterno = "", int int_pPromotorId = 0, int int_pDistritoId = 0, int int_pLiquidacionPendiente = 0, int int_pEjecutivoCobradorId = 0);
		Task<BEError> Venta_WEB_Procesar(BEVenta obj_pVenta);
		Task<BEError> Ventas_Procesar(BEVenta obj_pVenta);
		Task<BEError> Venta_CancelarExtornar(int int_pVentaID, string? int_pVentaSituacionId);
		Task<IEnumerable<BEVenta>> Venta_ObtenerVentasEspecificas(string? str_pVentaCodigos, string? str_pVentaSituacion);
		Task<IEnumerable<BEVenta>> Venta_ObtenerCorreo(int int_pVentaID = 0);
		Task<BEError> VentaGrupal_Procesar(BEVentaParametro obj_pVenta);
		Task<IEnumerable<BEVenta>> VentaPromo_Procesar(BEVenta obj_pVenta);
		Task<IEnumerable<BEVenta>> Venta_ObtenerTarjetasVencidas();
		Task<BEError> VentaMasiva_Procesar(BEVenta obj_pVenta);
		Task<IEnumerable<BEVenta>> VentaMasiva_ProcesarConsultar(int int_pVentaMasivaId);
		Task<IEnumerable<BEVenta>> Venta_ObtenerCliente(string? str_pVentaClienteDocumentoTipoId, string str_pVentaClienteDocumentoNumero);
		Task<IEnumerable<BEPasajero>> Venta_ObtenerPasajero(string? str_pVentaClienteDocumentoTipoId, string? str_pVentaClienteDocumentoNumero, DateTime dte_pVentaIngresoInicio = default, DateTime dte_pVentaIngresoFin = default);
		Task<IEnumerable<BEPasajero>> Venta_ListaPasajero(string? str_pVentaClienteDocumentoTipoId, string? str_pVentaClienteDocumentoNumero, DateTime dte_pVentaIngresoInicio = default, DateTime dte_pVentaIngresoFin = default);
		Task<BEError> Venta_CuponValidar(string? int_pVentaCupon, string str_pVentaClienteDocumentoTipo, string? str_pVentaClienteDocumentoNumero, int int_DiasViaje = 0, int int_AgenciaID = 0);
		Task<IEnumerable<BEVenta>> VentaMasivaATV_ProcesarConsultar(int int_pVentaMasivaId);
		Task<IEnumerable<BEVenta>> Venta_ObtenerGestionIncentivos(int int_pVentaId);
		Task<BEError> VentaGestionIncentivos_Procesar(BEVenta obj_pVenta);
		Task<BEError> VentaCodigoExterno_Validar(string? str_pCodigoExterno);
		Task<IEnumerable<BEVenta>> VentaObtenerVoucherPendiente(int int_pVentaId);
		Task<BEError> Venta_Situacion_Actualizar(int int_pVentaID, int int_IDUsuario);
		Task<BEError> Venta_Grupal_Actualizar(int int_pVentaGrupalID, int int_IDUsuario);
		Task<IEnumerable<BEVenta>> VentaGrupal_Lista(int intVentaGrupalId);
		Task<BEError> VentaGrupal_Verificar_Situacion(int intVentaGrupalId);
		Task<IEnumerable<BEVenta>> VentaGrupalWEB_Procesar(BEVenta obj_pVenta);
		Task<BEError> VentaWEB_Situacion_Actualizar(int int_pVentaID, int int_IDUsuario);
		Task<BEError> Ventas_Validar(DateTime dte_pVentaIngresoInicio, DateTime dte_pVentaIngresoFin, int int_pVentaID, int int_pUsuarioId = 0, string? str_pEstadoId = "", string? str_pSituacionId = "", int int_pAgenciaId = 0, int int_pAgenciaUsuarioId = 0, string? str_pClienteNombres = "", string? str_pClienteApellidos = "", int int_pPaisId = 0, string? str_pCodigoExterno = "");
		Task<IEnumerable<BEVenta>> VentaObtenerVoucherCancelada(string? int_pVentaId, string? str_Apellidos, string? strBasedeDatos = "O");
		Task<BEError> Venta_VigenciaValidar(int int_DiasViaje, int int_Producto);
		Task<BEError> VentaCliente_Eliminar(int int_pVentaClienteID);
		Task<IEnumerable<BEVenta>> VentaCliente_Obtener(int int_pVentaClienteVentaID);
		Task<BEError> VentaCliente_Procesar(BEVentaClienteParametro obj_pVentaCliente);
		Task<BEError> Liquidacion_Procesar(int int_pVentaID, decimal dec_pComision, decimal dec_pIncentivo, decimal dec_pPublicidad, int int_IDUsuario, int int_pFormula, decimal dec_pDescuento, decimal dec_pPago, int int_pLiquidacionCod);
		Task<IEnumerable<BEAgenciaProducto>> Venta_ObtenerDescuentoVentas(string? str_pVentaCodigos);
		Task<BEError> VentaActualizar_Procesar(BEVentaParametro obj_pVenta);
		Task<BEError> VentaPrecio_Procesar(int int_pVentaID, decimal dec_pPrecio, int int_pUsuarioId);

    }
}
