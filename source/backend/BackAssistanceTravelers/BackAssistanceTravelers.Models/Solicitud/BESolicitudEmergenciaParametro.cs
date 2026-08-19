using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BackAssistanceTravelers.Models.Solicitud
{
	public class BESolicitudEmergenciaParametro
	{
		public int solicitudTipoId { get; set; }
		public int solicitudVentaId { get; set; }
		public int solicitudCreadoUsuarioId { get; set; }
		public string? solicitudContactoNombre { get; set; }
		public string? solicitudContactoDireccion { get; set; }
		public string? solicitudContactoDistrito { get; set; }
		public string? solicitudContactoPais { get; set; }
		public string? solicitudContactoTelefono { get; set; }
		public string? solicitudContactoEmail { get; set; }
		public string? solicitudMotivo { get; set; }

	}
}
