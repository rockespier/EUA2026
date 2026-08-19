using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BackAssistanceTravelers.Models.Usuario
{
	public class BEUsuarioRelacion
	{
		public int usuarioRelacionPadreId { get; set; }
		public string? NombreUsuarioPadre { get; set; }
		public int usuarioRelacionPadrePerfilId { get; set; }
		public int usuarioRelacionHijoId { get; set; }
		public string? NombreUsuarioHijo { get; set; }
		public int usuarioRelacionHijoPerfilId { get; set; }
	}
}
