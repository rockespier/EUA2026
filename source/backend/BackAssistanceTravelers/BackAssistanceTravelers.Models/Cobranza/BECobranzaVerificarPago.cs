using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BackAssistanceTravelers.Models.Cobranza
{
	public class BECobranzaVerificarPago
	{
		public int cobranzapagoId { get; set; }
		public int cobranzapagoMedioId { get; set; }
		public string? cobranzapagoMedioNombre { get; set; }
		public DateTime cobranzapagoFecha { get; set; }
		public float cobranzapagoImporte { get; set; }
		public int cobranzapagoCreadoUsuario { get; set; }
		public DateTime cobranzapagoCreadoFecha { get; set; }
		public string? cobranzapagoEvidenciaRuta { get; set; }
		public int cobranzapagoEstadoId { get; set; }
		public int cobranzapagoActivo { get; set; }
		public string? cobranzapagoEstadoNombre { get; set; }
		public string? cobranzapagoObservacion { get; set; }
		public string? cobranzapagoAgenciaNombre { get; set; }

		public int cobranzaId { get; set; }

		public string documento { get; set; }
		public string cobranzaDocumentoTipoNombre { get; set; }
	}
}
