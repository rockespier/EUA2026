namespace FrontAssistanceTravelers.WebTravel.Models.Procesos
{
	public class BEOrdenTrabajoInventario
	{
		public int OrdenTrabajoInventarioId { get; set; }
		public int OrdenTrabajoInventarioOrdenTrabajoId { get; set; }
		public int OrdenTrabajoInventarioInventarioId { get; set; }
		public string? OrdenTrabajoInventarioInventarioNombre { get; set; }
		public int OrdenTrabajoInventarioInventarioPadreId { get; set; }
		public int OrdenTrabajoInventarioVisible { get; set; }
	}
}
