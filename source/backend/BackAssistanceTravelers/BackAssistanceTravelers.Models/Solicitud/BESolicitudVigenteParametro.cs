using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BackAssistanceTravelers.Models.Solicitud
{
	public class BESolicitudVigenteParametro
	{
		public int solicitudTipoId { get; set; }
		public int solicitudVentaId { get; set; }
		public DateTime solicitudVigenciaFechaInicial { get; set; }
		public DateTime solicitudVigenciaFechaFinal { get; set; }
		public int solicitudCreadoUsuarioId { get; set; }
		public string? solicitudMotivo { get; set; }
	

	}
}
