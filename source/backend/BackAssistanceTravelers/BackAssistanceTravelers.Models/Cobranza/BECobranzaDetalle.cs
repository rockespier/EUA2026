using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BackAssistanceTravelers.Models.Cobranza
{
	public class BECobranzaDetalle
	{
		public string? cobranzadetalleId { get; set; }
		public DateTime cobranzadetalleCreadoFecha { get; set; }
		public string? cobranzadetalleCreadoUsuarioNombre { get; set; }
		public DateTime cobranzadetalleModificadoFecha { get; set; }
		public string? cobranzadetalleModificadoUsuarioNombre { get; set; }
		public int cobranzaId { get; set; }
		public int cobranzadetalleVentaId { get; set; }
		public int cobranzadetalleCreadoUsuarioId { get; set; }
		public int cobranzadetalleModificadoUsuarioId { get; set; }
		public int cobranzadetalleActivo { get; set; }
	}
}
