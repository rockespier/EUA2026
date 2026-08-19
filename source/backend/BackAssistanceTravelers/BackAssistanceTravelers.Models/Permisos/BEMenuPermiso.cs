using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BackAssistanceTravelers.Models.Permisos {
	public class BEMenuPermiso {
		public string? id { get; set; }
		public string? parent { get; set; }
		public string? type { get; set; }
		public string? text { get; set; }
		public string? state { get; set; }
	}
}
