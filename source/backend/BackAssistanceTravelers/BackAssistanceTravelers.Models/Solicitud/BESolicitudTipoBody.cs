using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BackAssistanceTravelers.Models.Solicitud {
	public class BESolicitudTipoBody {
		public string? solicitudtipoAccionId { get; set; }
		public string? solicitudtipoAccionNombre { get; set; }
		public int solicitudtipoId { get; set; }
		public int solicitudtipoEnviarCorreo { get; set; }
		public int solicitudtipoCreadoUsuarioId { get; set; }		
		public int solicitudtipoActivo { get; set; }
	}
}
