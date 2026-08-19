using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BackAssistanceTravelers.Models.Solicitud
{
	public class BESolicitud
	{
		public int solicitudId { get; set; }
		public int solicitudVentaId { get; set; }
		public int solicitudTipoId { get; set; }
		public int solicitudTipoEnviarCorreo { get; set; }
		public int solicitudVentaAgenciaId { get; set; }
		public int solicitudAgenciaId { get; set; }
		public int solicitudAgenciaUsuarioId { get; set; }
		public int solicitudClienteEdad { get; set; }
		public int solicitudCreadoUsuarioId { get; set; }
		public int solicitudAtendidoUsuarioId { get; set; }
		public int solicitudMotivoAnulacion { get; set; }
		public DateTime solicitudVigenciaFechaInicial { get; set; }
		public DateTime solicitudVigenciaFechaFinal { get; set; }
		public DateTime solicitudClienteFechaNacimiento { get; set; }
		public DateTime solicitudCreadoFecha { get; set; }
		public DateTime solicitudAtendidoFecha { get; set; }
		public float solicitudVentaImporte { get; set; }
		public string? solicitudTipoNombre { get; set; }
		public string? solicitudVentaAgenciaNombre { get; set; }
		public string? solicitudEstadoId { get; set; }
		public string? solicitudEstadoNombre { get; set; }
		public string? solicitudAgenciaNombre { get; set; }
		public string? solicitudAgenciaUsuarioNombre { get; set; }
		public string? solicitudClienteDocumentoTipoId { get; set; }
		public string? solicitudClienteDocumentoTipoNombre { get; set; }
		public string? solicitudClienteDocumentoNumero { get; set; }
		public string? solicitudClienteNombres { get; set; }
		public string? solicitudClienteApellidos { get; set; }
		public string? solicitudClienteEmail { get; set; }
		public string? solicitudClienteDireccion { get; set; }
		public string? solicitudClienteTelefono { get; set; }
		public string? solicitudClienteDistrito { get; set; }
		public string? solicitudClienteCiudad { get; set; }
		public string? solicitudClientePais { get; set; }
		public string? solicitudMotivo { get; set; }
		public string? solicitudRespuesta { get; set; }
		public string? solicitudAdjunto { get; set; }
		public string? solicitudCreadoUsuarioNombre { get; set; }
		public string? solicitudAtendidoUsuarioNombre { get; set; }
		public string? solicitudContactoNombre { get; set; }
		public string? solicitudContactoDireccion { get; set; }
		public string? solicitudContactoDistrito { get; set; }
		public string? solicitudContactoPais { get; set; }
		public string? solicitudContactoTelefono { get; set; }
		public string? solicitudContactoEmail { get; set; }
		public string? solicitudProductoNombre { get; set; }
		public string? solicitudProductoNombreCambio { get; set; }
		public int solicitudProductoId { get; set; }
		public string? solicitudMotivoAnulacionDescripcion { get; set; }
	}
}
