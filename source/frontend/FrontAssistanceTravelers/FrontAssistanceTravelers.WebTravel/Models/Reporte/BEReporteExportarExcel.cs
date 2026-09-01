namespace FrontAssistanceTravelers.WebTravel.Models.Reporte
{
	public class BEReporteExportarPeriodo
	{
		public string? etiqueta { get; set; }
		public List<string>? columnas { get; set; }
		public List<List<string>>? filas { get; set; }
		public string? imagenBase64 { get; set; }
	}

	public class BEReporteExportarDosPeriodos
	{
		public string? titulo { get; set; }
		public int columnaImporte { get; set; } = -1;
		public List<BEReporteExportarPeriodo>? periodos { get; set; }
	}
}
