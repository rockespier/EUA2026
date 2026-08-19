using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BackAssistanceTravelers.Models.Cobranza
{
	public class BECobranzaPago
	{
		public int cobranzapagoId { get; set; }
		public int cobranzapagoCobranzaId { get; set; }
		public int cobranzapagoMedioId { get; set; }
		public string? cobranzapagoMedioNombre { get; set; }
		public DateTime cobranzapagoFecha { get; set; }
		public float cobranzapagoImporte { get; set; }
		public int cobranzapagoCreadoUsuario { get; set; }
		public DateTime cobranzapagoCreadoFecha { get; set; }
		public string? cobranzapagoEvidenciaRuta { get; set; }
		public int cobranzapagoEstadoId { get; set; }
		public string? cobranzapagoEstadoNombre { get; set; }
		public string? cobranzapagoObservacion { get; set; }
	}
}
