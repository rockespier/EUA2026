using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BackAssistanceTravelers.Models.Promocion
{
	public class BEPromocion
	{
		public int promocionId { get; set; }
		public int promocionClienteCntPagan { get; set; }
		public int promocionClienteCntIngresan { get; set; }
		public int promocionCreadoUsuarioId { get; set; }
		public int promocionModificadoUsuarioId { get; set; }
		public int promocionActivo { get; set; }
		public string? promocionTipo { get; set; }
		public string? promocionNombre { get; set; }
		public DateTime promocionCreadoFecha { get; set; }
		public string? promocionCreadoUsuarioNombre { get; set; }
		public DateTime promocionModificadoFecha { get; set; }
		public string? promocionModificadoUsuarioNombre { get; set; }
	}
}
