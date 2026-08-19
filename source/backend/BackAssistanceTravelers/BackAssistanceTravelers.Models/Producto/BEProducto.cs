using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BackAssistanceTravelers.Models.Producto
{
	public class BEProducto
	{
		public string? productoReferenciaId { get; set; }
		public string? productoNombre { get; set; }
		public string? productoServicio { get; set; }
		public string? productoURL { get; set; }
		public string? productoRangos { get; set; }
		public string? productoCreadoUsuarioNombre { get; set; }
		public string? productoModificadoUsuarioNombre { get; set; }
		public string? productoATVCodigo { get; set; }
		public float productoImporteTarifaFija { get; set; }
		public float productoImporteDiaAdicional { get; set; }
		public float productoGrupalPorcentaje { get; set; }
		public DateTime productoCreadoFecha { get; set; }
		public DateTime productoModificadoFecha { get; set; }
		public int productoId { get; set; }
		public int productoEdadMinima { get; set; }
		public int productoEdadMaxima { get; set; }
		public int productoNumeroDias { get; set; }
		public int productoCreadoUsuarioId { get; set; }
		public int productoModificadoUsuarioId { get; set; }
		public int productoActivo { get; set; }
		public int productoOrdenListado { get; set; }
		public int productoPaisId { get; set; }
		public int productoActivoWeb { get; set; }
		public int productoGrupalActivo { get; set; }
		public int productoImporteCero { get; set; }
		public int productoPromocionActivo { get; set; }
		public int productoMarca { get; set; }
	}
}
