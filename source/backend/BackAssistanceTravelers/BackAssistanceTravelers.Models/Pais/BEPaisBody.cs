using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BackAssistanceTravelers.Models.Pais {
	public class BEPaisBody {
		public int paisId { get; set; }
		public string? paisCodigo { get; set; }
		public string? paisNombre { get; set; }
		public float paisImpuesto { get; set; }
		public float paisImpuestoVenta { get; set; }
		public int paisCreadoUsuarioId { get; set; }
		public int paisActivo { get; set; }
		public string? paisCorreo { get; set; }
		public int paisTotalPago { get; set; }
		public string? paisDatosEua { get; set; }
		public string? paisFoto { get; set; }
		public string? paisPromocionId { get; set; }
		public int paisCuponDescuento { get; set; }
		public int paisCuponVigenciaId { get; set; }
		public int paisDocumentoFormato { get; set; }
		public int paisPromotorDefault { get; set; }

		
	}
}
