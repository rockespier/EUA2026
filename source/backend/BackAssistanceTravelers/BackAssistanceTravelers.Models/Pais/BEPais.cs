using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BackAssistanceTravelers.Models.Pais
{
	public class BEPais
	{
		public int paisId { get; set; }
		public float paisImpuesto { get; set; }
		public float paisImpuestoVenta { get; set; }
		public DateTime paisCreadoFecha { get; set; }
		public int paisCreadoUsuarioId { get; set; }
		public DateTime paisModificadoFecha { get; set; }
		public int paisModificadoUsuarioId { get; set; }
		public int paisActivo { get; set; }
		public float ventaPaisImpuesto { get; set; }
		public float ventaPaisImpuestoVenta { get; set; }
		public int paisTotalPago { get; set; }
		public int paisCuponDescuento { get; set; }
		public int paisCuponVigenciaId { get; set; }
		public int paisDocumentoFormato { get; set; }
		public int paisPromotorDefault { get; set; }
		public string? paisCodigo { get; set; }
		public string? paisNombre { get; set; }
		public string? paisCreadoUsuarioNombre { get; set; }
		public string? paisModificadoUsuarioNombre { get; set; }
		public string? paisCorreo { get; set; }
		public string? paisDatosEua { get; set; }
		public string? paisFoto { get; set; }
		public string? paisPromocionId { get; set; }
		public string? paisPromotorNombre { get; set; }
		
	}
}
