using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FrontAssistanceTravelers.WebTravel.Models.Procesos
{
	public class BEPresupuesto
	{
		public int PresupuestoId { get; set; }
		public int PresupuestoTemporalId { get; set; }
		public int PresupuestoEmpresaId { get; set; }
		public int PresupuestoOrdenTrabajoId { get; set; }
		public int PresupuestoMonedaId { get; set; }
		public string? PresupuestoMonedaNombre { get; set; }
		public string? PresupuestoMonedaCodigoExterno { get; set; }
		public float PresupuestoTipoCambio { get; set; }
		public DateTime PresupuestoFechaRecepcion { get; set; }
		public DateTime PresupuestoFechaEntrega { get; set; }
		public DateTime PresupuestoFechaSalida { get; set; }
		public int PresupuestoEstadoId { get; set; }
		public string? PresupuestoEstadoNombre { get; set; }
		public string? PresupuestoEstadoColor { get; set; }
		public int PresupuestoUsuario { get; set; }
		public int PresupuestoActivo { get; set; }
		//PRESUPUESTO CLIENTE
		public int PresupuestoClienteId { get; set; }
		public string? PresupuestoClienteDocumentoNumero { get; set; }
		public string? PresupuestoClienteRazonSocial { get; set; }
		public string? PresupuestoClienteTelefonoDomicilio { get; set; }
		public string? PresupuestoClienteTelefonoOficina { get; set; }
		public string? PresupuestoClienteTelefonoCelular { get; set; }
		public string? PresupuestoClienteCorreo { get; set; }
		public string? PresupuestoClienteDomicilio { get; set; }
		public string? PresupuestoClienteDomicilioDistrito { get; set; }
		//PRESUPUESTO VEHICULO
		public int PresupuestoVehiculoId { get; set; }
		public string? PresupuestoVehiculoPlacaNumero { get; set; }
		public int PresupuestoVehiculoMarcaId { get; set; }
		public string? PresupuestoVehiculoMarcaNombre { get; set; }
		public int PresupuestoVehiculoModeloId { get; set; }
		public string? PresupuestoVehiculoModeloNombre { get; set; }
		public string? PresupuestoVehiculoColor { get; set; }
		public int PresupuestoVehiculoAnho { get; set; }
		public string? PresupuestoVehiculoMotorNumero { get; set; }
		public int PresupuestoVehiculoRecorridoTipoId { get; set; }
		public string? PresupuestoVehiculoRecorridoTipoNombre { get; set; }
		public float PresupuestovehiculoRecorridoNumero { get; set; }
		//PRESUPUESTO DESCRIPCION
		public string? PresupuestosintomaDescripcion { get; set; }
		//PRESUPUESTO FACTURA
		public float PresupuestoValorDescuento { get; set; }
		public string? PresupuestoTipoDescuento { get; set; }
		public float PresupuestoSubTotal { get; set; }
		public float PresupuestoImporteDescuento { get; set; }
		public float PresupuestoImporteBruto { get; set; }
		public float PresupuestoImporteIgv { get; set; }
		public float PresupuestoImporteTotal { get; set; }
		public string? PresupuestoMetodoEnvio { get; set; }
		public string? PresupuestoCodigoCupon { get; set; }
		public float PresupuestoCostoEnvio { get; set; }
		public float PresupuestoDescuento { get; set; }
		public float PresupuestoCreditos { get; set; }
		public int PresupuestoMetodoPago { get; set; }
		public string? PresupuestoTerminal { get; set; }
		public int PresupuestoRecojoTienda { get; set; }
		public int PresupuestoCarroDeComprasId { get; set; }
		public string? PresupuestoMarcaNombreLogo { get; set; }
		public string? PresupuestoMarcaNombreImagenDanho { get; set; }
		public int PresupuestoEstadoProforma { get; set; }
		public DateTime PresupuestoFechaEstado { get; set; }
		public string? PresupuestoAnotacion { get; set; }
		public string? PresupuestoDocumento { get; set; }
		public string? PresupuestoSerie { get; set; }
		public string? PresupuestoCorrelativo { get; set; }
		public string? PresupuestoPedido { get; set; }
		//BEEmpresa Empresa
		public int EmpresaId { get; set; }
		public string? EmpresaRazonSocial { get; set; }
		public string? EmpresaDireccion { get; set; }
		public string? EmpresaTelefono { get; set; }
		public string? EmpresaCorreo { get; set; }
		public string? EmpresaWeb { get; set; }
		public string? EmpresaLogo { get; set; }
		public string? EmpresaRuc { get; set; }
		//BEOrdenTrabajo Ordentrabajo
		public int OrdenTrabajoTipoServicio { get; set; }
		public int OrdentrabajoEstadoId { get; set; }
		public string? OrdentrabajoEstadoNombre { get; set; }
		//BECliente Cliente
		public string? clienteCorreo { get; set; }
		public DateTime clienteNacimientoFecha { get; set; }
		public int clienteRecibeCorreos { get; set; }
		public string? clienteTipoRegistro { get; set; }
		public string? clienteNombres { get; set; }
		public string? clienteApellidoPaterno { get; set; }
		public string? clienteDomicilio { get; set; }
		public string? clienteDomicilioReferencias { get; set; }
		public string? clienteDepartamentoNombre { get; set; }
		public string? clienteProvinciaNombre { get; set; }
		public string? clienteCodigoPostal { get; set; }
		public string? clientePaisNombre { get; set; }
		public string? clienteTelefonoCelular { get; set; }
		public string? clienteCodigoUbigeo { get; set; }
		public string? clienteDocumentoTipoId { get; set; }
		public string? clienteDocumentoNumero { get; set; }
		public string? clienteDomicilioDistrito { get; set; }
	}
}
