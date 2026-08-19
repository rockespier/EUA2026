using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BackAssistanceTravelers.Models.Solicitud
{
	public class BESolicitudProductoParametro
	{
		public int solicitudTipoId { get; set; }
		public int solicitudVentaId { get; set; }
		public DateTime solicitudProductoFechaInicial { get; set; }
		public DateTime solicitudProductoFechaFinal { get; set; }
		public int solicitudProductoId { get; set; }
		public float solicitudProductoImporte { get; set; }
		public int solicitudProductoEdad { get; set; }
		public int solicitudCreadoUsuarioId { get; set; }
		public string? solicitudMotivo { get; set; }
	

	}
}
