using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BackAssistanceTravelers.Models.Reporte
{
	public class BEResumenPagoReporte
    {
		public string? cobranzapagoMedioNombre { get; set; }
		public DateTime cobranzaPagoFecha { get; set; }
		public float cobranzapagoImporte { get; set; }
	}
}
