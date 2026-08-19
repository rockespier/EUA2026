using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BackAssistanceTravelers.Models.Perfil {
	public class BEPerfilBody {
		public int perfilId { get; set; }
		public string? perfilNombre { get; set; }
		public int perfilActivo { get; set; }
		public string? perfilOrigen { get; set; }

		public int perfilCreadoUsuarioId { get; set; }
	}
}
