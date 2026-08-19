using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BackAssistanceTravelers.Models.Solicitud
{
	public class BESolicitudClienteParametro
	{
		public int solicitudTipoId { get; set; }
		public int solicitudVentaId { get; set; }
		public int solicitudCreadoUsuarioId { get; set; }
		public string? solicitudClienteDocumentoTipoId { get; set; }
		public string? solicitudClienteDocumentoTipoNombre { get; set; }
		public string? solicitudClienteDocumentoNumero { get; set; }
		public string? solicitudClienteNombres { get; set; }
		public string? solicitudClienteApellidos { get; set; }
		public DateTime solicitudClienteFechaNacimiento { get; set; }
		public int solicitudClienteEdad { get; set; }
		public string? solicitudClienteEmail { get; set; }
		public string? solicitudClienteDireccion { get; set; }
		public string? solicitudClienteTelefono { get; set; }
		public string? solicitudClienteDistrito { get; set; }
		public string? solicitudClienteCiudad { get; set; }
		public string? solicitudClientePais { get; set; }
		public string? solicitudMotivo { get; set; }

	}
}
