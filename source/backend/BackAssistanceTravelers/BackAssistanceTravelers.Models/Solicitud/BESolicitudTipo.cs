using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BackAssistanceTravelers.Models.Solicitud
{
	public class BESolicitudTipo
	{
		public string? solicitudtipoAccionId { get; set; }
		public string? solicitudtipoAccionNombre { get; set; }
		public string? solicitudtipoNombre { get; set; }
		public string? solicitudtipoCreadoUsuarioNombre { get; set; }
		public string? solicitudtipoModificadoUsuarioNombre { get; set; }
		public int solicitudtipoId { get; set; }
		public int solicitudtipoEnviarCorreo { get; set; }
		public DateTime solicitudtipoCreadoFecha { get; set; }
		public int solicitudtipoCreadoUsuarioId { get; set; }
		public DateTime solicitudtipoModificadoFecha { get; set; }
		public int solicitudtipoModificadoUsuarioId { get; set; }
		public int solicitudtipoActivo { get; set; }
	}
}
