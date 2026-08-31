using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BackAssistanceTravelers.Models.Venta
{
	public class BEVentaClienteParametro
	{
		public int ventaId { get; set; }
		public int ventaClienteId { get; set; }
		public string? ventaClienteDocumentoTipoId { get; set; }
		public string? ventaClienteDocumentoTipoNombre { get; set; }
		public string? ventaClienteDocumentoNumero { get; set; }
		public string? ventaClienteNombres { get; set; }
		public string? ventaClienteApellidos { get; set; }
		public DateTime ventaClienteFechaNacimiento { get; set; }
		public int ventaClienteEdad { get; set; }
		public string? ventaClienteEmail { get; set; }
		public string? ventaClienteDireccion { get; set; }
		public string? ventaClienteTelefono { get; set; }
		public string? ventaClienteDistrito { get; set; }
		public string? ventaClienteCiudad { get; set; }
		public string? ventaClientePais { get; set; }
		public string? VentaNacionalidad { get; set; }
		public int ventaClienteVip { get; set; }
	}
}
