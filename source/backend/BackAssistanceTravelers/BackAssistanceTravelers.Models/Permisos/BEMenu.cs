using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BackAssistanceTravelers.Models.Permisos {
	public class BEMenu {
		public int menuId { get; set; }
		public int menuIdPadre { get; set; }
		public string? menuNombre { get; set; }
		public string? menuPagina { get; set; }
		public string? menuIcono { get; set; }
		public int menuVisible { get; set; }
	}
}
