namespace FrontAssistanceTravelers.WebTravel.Models.Procesos
{
    public class BEReporteCobranza
    {
        public string? cobranzaDocumentoTipoNombre { get; set; }
        public string? cobranzaDocumentoSerie { get; set; }
        public string? cobranzaDocumentoCorrelativo { get; set; }
        public string? cobranzaCliente { get; set; }
        public double cobranzaImporteBruto { get; set; }
        public double cobranzaComision { get; set; }
        public double cobranzaIncentivo { get; set; }
		public double cobranzaPublicidad { get; set; }
		public double cobranzaDescuento { get; set; }
		public double cobranzaImportePago { get; set; }
        public string? cobranzaPagoMedioNombre { get; set; }
        public string? cobranzaNotaCredito { get; set; }
        public string? cobranzaObservacion { get; set; }
        public string? cobranzaCobradorNombre { get; set; }
		public string? cobranzaFormulaLiquidacion { get; set; }
        public int cobranzaId { get; set; }
		public string? cobranzaCobrador { get; set; }
	}
}
