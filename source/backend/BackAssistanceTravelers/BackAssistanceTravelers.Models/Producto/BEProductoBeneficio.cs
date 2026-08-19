using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BackAssistanceTravelers.Models.Producto
{
	public class BEProductoBeneficio
	{
		public string? beneficioNombre { get; set; }
		public string? beneficioImporte { get; set; }
		public string? beneficioCreadoUsuarioNombre { get; set; }
		public string? beneficioModificadoUsuarioNombre { get; set; }
		public string? beneficioIdiomaNombre { get; set; }
		public DateTime beneficioCreadoFecha { get; set; }
		public DateTime beneficioModificadoFecha { get; set; }
		public int beneficioId { get; set; }
		public int beneficioProductoId { get; set; }
		public int beneficioCreadoUsuarioId { get; set; }
		public int beneficioModificadoUsuarioId { get; set; }
		public int beneficioIdiomaId { get; set; }
		public int beneficioOrden { get; set; }
		public string coberturaProd01 { get; set; }
        public string coberturaProd02 { get; set; }
        public string coberturaProd03 { get; set; }

    }
}
