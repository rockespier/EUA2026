using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BackAssistanceTravelers.Models.Reporte
{
	public class BEResumenComisionReporte
    {
		public string? agenciaFacturaTipoDocumentoNombre { get; set; }
		public string? agenciafacturaSerie { get; set; }
		public string? agenciafacturaNumero { get; set; }
		public DateTime agenciafacturaFechaEmision { get; set; }
		public float agenciafacturaTotal { get; set; }
	}
}
