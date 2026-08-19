namespace FrontAssistanceTravelers.WebTravel.Models.Procesos {
	public class BEOrdenTrabajoTarea {
		public int IDTarea { get; set; }
		public string? Tarea_descripcion { get; set; }
		public int IDTareaDetalle { get; set; }
		public string? TareaDetalle_descripcion { get; set; }
		public decimal Tiempo_estimado { get; set; }
		public decimal Tiempo_real { get; set; }
		public int Check_select { get; set; }
		public string? tecnico { get; set; }
		public int TareaActivo { get; set; }
		public int Id_OrdenTrabajo { get; set; }
	}
}
