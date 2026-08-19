namespace FrontAssistanceTravelers.WebTravel.Models.Reporte
{
	public class BEResumenCobranzaReporte
    {
		public string? cobranzaDocumentoTipoNombre { get; set; }
		public string? cobranzaDocumentoSerie { get; set; }
		public string? cobranzaDocumentoCorrelativo { get; set; }
		public DateTime cobranzaCreadoFecha { get; set; }
		public float cobranzaImportePago { get; set; }
	}
}
