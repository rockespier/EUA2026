using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BackAssistanceTravelers.Models.Perfil
{
	public class BEPerfil
	{
		public int perfilId { get; set; }
		public DateTime perfilCreadoFecha { get; set; }
		public int perfilCreadoUsuarioId { get; set; }
		public DateTime perfilModificadoFecha { get; set; }
		public int perfilModificadoUsuarioId { get; set; }
		public int perfilActivo { get; set; }
		public string? perfilNombre { get; set; }
		public string? perfilOrigen { get; set; }
		public string? perfilCreadoUsuarioNombre { get; set; }
		public string? perfilModificadoUsuarioNombre { get; set; }

		public int perfilCantidadUsuarios { get; set; }
	}
}
