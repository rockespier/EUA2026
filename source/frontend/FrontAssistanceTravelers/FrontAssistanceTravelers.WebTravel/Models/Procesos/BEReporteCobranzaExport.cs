namespace FrontAssistanceTravelers.WebTravel.Models.Procesos
{
    public class BEReporteCobranzaExport
    {
        public string? fechaInicio { get; set; }
        public string? fechaFin { get; set; }
        public string? fechaPagoInicio { get; set; }
        public string? fechaPagoFin { get; set; }
        public string? agenciaId { get; set; }
        public int codliquidacion { get; set; }
        public string? usuarioNombre { get; set; }
    }
}
