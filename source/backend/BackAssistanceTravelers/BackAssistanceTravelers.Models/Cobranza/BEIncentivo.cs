using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BackAssistanceTravelers.Models.Cobranza
{
    public class BEIncentivo
    {
        public string agenciaNombre { get; set; }   
        public DateTime ventaCreadoFecha { get; set; }
        public string ventaUsuarioAgenciaNombre { get; set; }
        public double ventaImporteventa { get; set; }
        public double ventaIncentivoImporte { get; set; }
        public string incentivoEstadoPago { get; set; }
        public DateTime incentivoPagoFecha { get; set; }
        public string incentivoPagoObservaciones { get; set; }
        public string incentivoCuentaBancaria { get; set; }
        public int ventaid { get; set; }
        public int beneficiarioId { get; set; }
	}
}
