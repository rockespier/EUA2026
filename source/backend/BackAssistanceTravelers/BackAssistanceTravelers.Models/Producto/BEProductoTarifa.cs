using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BackAssistanceTravelers.Models.Producto
{
	public class BEProductoTarifa
	{
		public int tarifaId { get; set; }
		public int tarifaProductoId { get; set; }
		public int tarifaNumeroDiasMinimo { get; set; }
		public int tarifaNumeroDiasMaximo { get; set; }
		public int tarifaCreadoUsuarioId { get; set; }
		public int tarifaModificadoUsuarioId { get; set; }
		public float tarifaImporte { get; set; }
		public DateTime tarifaCreadoFecha { get; set; }
		public string? tarifaCreadoUsuarioNombre { get; set; }
		public DateTime tarifaModificadoFecha { get; set; }
		public string? tarifaModificadoUsuarioNombre { get; set; }
		public float TarifaIncentivo { get; set; }
		public float TarifaIncentivoMedio { get; set; }
		public float TarifaPublicidad { get; set; }
	}
}
