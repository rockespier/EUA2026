namespace FrontAssistanceTravelers.WebTravel.Models.General {
	public class BEAgenciaProducto {
		public int agenciaProductoId { get; set; }
		public int agenciaProductoAgenciaId { get; set; }
		public string agenciaProductoAgenciaNombre { get; set; }
		public int agenciaProductoProductoId { get; set; }
		public string agenciaProductoProductoNombre { get; set; }
		public int agenciaProductoDescuentoTipo { get; set; }
		public string agenciaProductoDescuentoTipoNombre { get; set; }
		public int agenciaProductoDescuentoImporte { get; set; }
		public DateTime? agenciaProductoDescuentoVigenciaIni { get; set; }
		public DateTime? agenciaProductoDescuentoVigenciafin { get; set; }

		public string? agenciaProductoDescuentoNombre { get; set; }

	}
}
