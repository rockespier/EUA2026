using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BackAssistanceTravelers.Models.Promocion
{
	public class BEPromocionPais
	{
		public int promocionPromocionID { get; set; }
		public string? promocionNombre { get; set; }
		public int paisPromocionPaisID { get; set; }
		public string? paisNombre { get; set; }
		public int agenciaID { get; set; }
		public string? agencia { get; set; }
		public int promocionClienteCntPagan { get; set; }
		public int promocionClienteCntIngresan { get; set; }
		public string? promocionTipo { get; set; }
		public int promocionProductoId { get; set; }
		public string? promocionProductoNombre { get; set; }
		public int promocionDiasMin { get; set; }
		public int promocionDiasMax { get; set; }
		public float promocionDescuento { get; set; }		

		public int promocionPasajeroId { get; set; }
                   
    }
}
