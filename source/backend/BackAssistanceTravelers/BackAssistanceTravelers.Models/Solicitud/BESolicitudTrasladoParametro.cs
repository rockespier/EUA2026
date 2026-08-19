using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BackAssistanceTravelers.Models.Solicitud
{
	public class BESolicitudTrasladoParametro
	{
		public int solicitudTipoId { get; set; }
		public int solicitudVentaId { get; set; }
		public int solicitudCreadoUsuarioId { get; set; }
		public int solicitudAgenciaId { get; set; }
		public int solicitudAgenciaUsuarioId { get; set; }
		public string? solicitudMotivo { get; set; }

	}
}
