using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BackAssistanceTravelers.Models.Solicitud
{
	public class BESolicitudAnularParametro
	{
		public int solicitudTipoId { get; set; }
		public int solicitudVentaId { get; set; }
		public string? solicitudMotivo { get; set; }
		public string? solicitudAdjunto { get; set; }
		public int solicitudCreadoUsuarioId { get; set; }
		public int solicitudMotivoAnulacion { get; set; }
		public string? extensionArchivo { get; set; }
		public string? archivoBase64 { get; set; }

	}
}
