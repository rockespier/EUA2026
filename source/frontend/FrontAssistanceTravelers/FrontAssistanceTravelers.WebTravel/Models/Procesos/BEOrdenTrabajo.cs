using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FrontAssistanceTravelers.WebTravel.Models.Procesos
{ 
	public class BEOrdenTrabajo
	{
		//ORDEN TRABAJO
		public int OrdentrabajoId { get; set; }
		public int OrdentrabajoTemporalId { get; set; }
		public int OrdentrabajoEmpresaId { get; set; }
		public int OrdentrabajoPresupuestoId { get; set; }
		public DateTime OrdentrabajoFechaRecepcion { get; set; }
		public int OrdentrabajoTecnicoId { get; set; }
		public string? OrdentrabajoTecnicoNombre { get; set; }
		public int OrdentrabajoEstadoId { get; set; }
		public string? OrdentrabajoEstadoNombre { get; set; }
		public string? OrdentrabajoEstadoColor { get; set; }
		public int OrdentrabajoCombustible { get; set; }
		public int OrdentrabajoUsuario { get; set; }
		public int OrdentrabajoActivo { get; set; }
		public int OrdentrabajoTurnoId { get; set; }
		//ORDEN TRABAJO CLIENTE
		public int OrdentrabajoClienteId { get; set; }
		public string? OrdentrabajoClienteDocumentoNumero { get; set; }
		public string? OrdentrabajoClienteRazonSocial { get; set; }
		public string? OrdentrabajoClienteTelefonoDomicilio { get; set; }
		public string? OrdentrabajoClienteTelefonoOficina { get; set; }
		public string? OrdentrabajoClienteTelefonoCelular { get; set; }
		public string? OrdentrabajoClienteCorreo { get; set; }
		public string? OrdentrabajoClienteDomicilio { get; set; }
		public string? OrdentrabajoClienteDomicilioDistrito { get; set; }
		//ORDEN TRABAJO VEHICULO
		public int OrdentrabajoVehiculoId { get; set; }
		public string? OrdentrabajoVehiculoPlacaNumero { get; set; }
		public int OrdentrabajoVehiculoMarcaId { get; set; }
		public string? OrdentrabajoVehiculoMarcaNombre { get; set; }
		public int OrdentrabajoVehiculoModeloId { get; set; }
		public string? OrdentrabajoVehiculoModeloNombre { get; set; }
		public string? OrdentrabajoVehiculoColor { get; set; }
		public int OrdentrabajoVehiculoAnho { get; set; }
		public string? OrdentrabajoVehiculoMotorNumero { get; set; }
		public int OrdentrabajoVehiculoRecorridoTipoId { get; set; }
		public string? OrdentrabajoVehiculoRecorridoTipoNombre { get; set; }
		public float OrdentrabajovehiculoRecorridoNumero { get; set; }
		//ORDEN TRABAJO DESCRIPCION
		public string? OrdentrabajoDescripcion { get; set; }
		public DateTime OrdentrabajodescripcionInicioFecha { get; set; }
		public int OrdentrabajodescripcionId { get; set; }
		public DateTime OrdentrabajodescripcionModificadoFecha { get; set; }
		public string? OrdentrabajodescripcionMotivoPausado { get; set; }
		//ORDEN TRABAJO ADICIONAL
		public int OrdentrabajoAsesorId { get; set; }
		public string? OrdentrabajoTipoOT { get; set; }
		public int OrdentrabajoSVasos { get; set; }
		public int OrdentrabajoSAros { get; set; }
		public string? OrdentrabajoAsesorNombre { get; set; }
		public int OrdentrabajoTipoServicioEn { get; set; }
		public string? OrdentrabajoAnotacion { get; set; }
		public int OrdenTrabajoTipoServicio { get; set; }
		public string? OrdenTrabajoMarcaNombreLogo { get; set; }
		public string? OrdenTrabajoMarcaNombreImagenDanho { get; set; }
		public int OrdenTrabajoTareaPadreId { get; set; }
		public string? OrdenTrabajofechasRegistrados { get; set; }
		public string? OrdenTrabajofechasPausas { get; set; }
		public string? OrdenTrabajofechasActividades { get; set; }
		public string? OrdenTrabajocantidadActividades { get; set; }
		public string? EmpresaLogo { get; set; }
		public string? EmpresaVehiculo { get; set; }
		public string? ordentrabajoZonauso { get; set; }

	}
}
