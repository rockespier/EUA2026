using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BackAssistanceTravelers.Models.Agencia {
	public class BEAgenciaFactura {
		public int agenciaFacturaId { get; set; }
		public int agenciaFacturaAgenciaId { get; set; }
		public int agenciaFacturaTipoDocumento { get; set; }
		public string? agenciaFacturaTipoDocumentoNombre { get; set; }
		public string? agenciaFacturaSerie { get; set; }
		public string? agenciaFacturaNombre { get; set; }
		public int agenciaFacturaNumero { get; set; }
		public DateTime agenciaFacturaFechaEmision { get; set; }
		public int agenciaFacturaMonedaId { get; set; }	
		public string? agenciaFacturaMonedaNombre { get; set; }
		public float agenciaFacturaTotal { get; set; }
		public string? agenciaFacturaObservacion { get; set; }
		public int agenciaFacturaCobranzaId { get; set; }
		public int agenciaFacturaEstado { get; set; }
		
	}
}
