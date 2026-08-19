using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BackAssistanceTravelers.Models.Venta
{
	public class BEVentaParametro
	{
		public int ventaGrupalId { get; set; }
		public DateTime ventaFechaVigenciaInicio { get; set; }
		public DateTime ventaFechaVigenciaFin { get; set; }
		public int ventaNumeroDias { get; set; }

		public string? ventaDestino { get; set; }
		public int ventaProductoId { get; set; }
		public string? ventaProductoNombre { get; set; }
		public decimal ventaProductoImporte { get; set; }

		public int ventaCreadoUsuarioId { get; set; }
		public int ventaUsuarioAgenciaId { get; set; }
		public string? ventaUsuarioOrigen { get; set; }
		public string? ventaCounter { get; set; }

		public string? ventaAgenciaNombre { get; set; }
		public string? ventaAgenciaDireccion { get; set; }
		public string? ventaAgenciaCorreo { get; set; }

		public string? ventaContactoNombres { get; set; }
		public string? ventaContactoDireccion { get; set; }
		public string? ventaContactoEmail { get; set; }
		public string? ventaContactoTelefono { get; set; }
		public string? ventaContactoDistrito { get; set; }
		public string? ventaContactoPais { get; set; }

		public decimal ventaImporteVenta { get; set; }
		public string? ventaSituacionId { get; set; }

		public string? ventaObservacion { get; set; }
		public int ventaPromocionId { get; set; }
		public DateTime ventaCobranzaPagoFecha { get; set; }
		public int ventaId { get; set; }	
		public decimal ventaComisionImporte { get; set; }
		public decimal ventaIncentivoImporte { get; set; }
        public decimal ventaPublicidadImporte { get; set; }
		public decimal ventaPagarLiquidacion { get; set; }	

    }
}
