namespace FrontAssistanceTravelers.WebTravel.Models.Procesos
{
	public class BEOrdenTrabajoDescripcion
	{
		public int OrdentrabajodescripcionId { get; set; }
		public int OrdentrabajodescripcionOrdenTrabajoId { get; set; }
		public string? OrdentrabajodescripcionDescripcion { get; set; }
		public int OrdentrabajodescripcionUsuario { get; set; }
		public int OrdentrabajodescripcionActivo { get; set; }
		public int OrdentrabajodescripcionSecuencia { get; set; }
		public DateTime OrdentrabajodescripcionInicioFecha { get; set; }
		public DateTime OrdentrabajodescripcionFinFecha { get; set; }
		public string? OrdenTrabajoDescripcionEstadoActividad { get; set; }
		public string? OrdentrabajodescripcionMotivoPausado { get; set; }
		public int OrdentrabajodescripcionServicioID { get; set; }
		public string? OrdentrabajodescripcionServicioDesc { get; set; }
		public int OrdentrabajodescripcionServicioCantidad { get; set; }
		public string? OrdenTrabajoDescripcionRecomendacion { get; set; }
		public int ordentrabajodescripcionTareaIDDetalle { get; set; }
		public int ordentrabajodescripcionTareaIDTecnico { get; set; }
	}
}
