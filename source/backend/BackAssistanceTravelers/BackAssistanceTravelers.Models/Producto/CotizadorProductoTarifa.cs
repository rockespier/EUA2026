using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BackAssistanceTravelers.Models.Producto
{
	public class CotizadorProductoTarifa
	{
		public int productoId { get; set; }
		public int productoTipoId { get; set; }
		public int productoTarifaDia { get; set; }
		public string? productoNombre { get; set; }
		public string? productoTipoNombre { get; set; }
		public decimal productoTarifaImporte { get; set; }
		public string? productosLista { get; set; }
        public string? beneficiosHtml { get; set; }
    }
}
