namespace FrontAssistanceTravelers.WebTravel.Models.Reporte {
	public class BEDetalleCobranzaReporte {
		public string? cobranzaDocumentoTipoNombre { get; set; }
		public string? cobranzaDocumentoSerie { get; set; }
		public string? cobranzaDocumentoCorrelativo { get; set; }
		public DateTime cobranzaCreadoFecha { get; set; }
		public float cobranzaImportePago { get; set; }

		public int cobranzadetalleVentaId { get; set; }
	}
}
