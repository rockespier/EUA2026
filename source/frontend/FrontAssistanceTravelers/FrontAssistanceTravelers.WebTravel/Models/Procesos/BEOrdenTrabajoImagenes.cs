namespace FrontAssistanceTravelers.WebTravel.Models.Procesos
{
    public class BEOrdenTrabajoImagenes
    {
        public int ordentrabajoImagenesId { get; set; }
        public string? ordentrabajoImagenesDescripcion { get; set; }
        public int ordentrabajoImagenesOrdentrabajoId { get; set; }
        public string? ordentrabajoImagenesRuta { get; set; }
        public int ordentrabajoImagenesActivo { get; set; }
        public DateTime ordentrabajoImagenesFecha { get; set; }
        public int ordentrabajoImagenesUsuario { get; set; }
        public int ordentrabajoimagenestipoId { get; set; }
        public string? ordentrabajoimagenestipoNombre { get; set; }
    }
}
