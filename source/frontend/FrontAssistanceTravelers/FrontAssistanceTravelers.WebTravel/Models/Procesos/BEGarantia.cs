namespace FrontAssistanceTravelers.WebTravel.Models.Procesos
{
    public class BEGarantia
    {
        public int reclamogarantia_id { get; set; }
        public string? reclamogarantia_distribuidorNombre { get; set; }
        public int reclamogarantia_estadoid { get; set; }
        public string? reclamogarantia_estadonombre { get; set; }
        public DateTime reclamogarantia_estadofecha { get; set; }
        public int reclamogarantia_vehiculoid { get; set; }
        public int reclamogarantia_ordentrabajo { get; set; }
        public string? reclamogarantia_zonadeuso { get; set; }
        public string? reclamogarantia_fr { get; set; }
        public string? reclamogarantia_tecnico { get; set; }
        public string? reclamogarantia_descripcionfalla { get; set; }
        public string? reclamogarantia_diagnosticotaller { get; set; }
        public int reclamogarantia_usuarioid { get; set; }
        public int reclamogarantia_pedidorecepcionado { get; set; }
        public string? reclamogarantia_observacionrecepcion { get; set; }
        public string? reclamogarantia_rcl { get; set; }
        public string? reclamogarantia_cadcaf { get; set; }
        public int reclamogarantia_pedidodespachado { get; set; }
        public string? reclamogarantia_pedidoseguimiento { get; set; }
        public string? reclamogarantia_PlacaNumero { get; set; }
        public int reclamogarantia_RecorridoNumero { get; set; }
        public string? reclamogarantia_TallerNombre { get; set; }
        public DateTime reclamogarantia_fecha { get; set; }
        public string? reclamogarantia_motivorechazo { get; set; }
        public float reclamogarantia_kilometraje { get; set; }
        public string? reclamogarantia_EstadoColor { get; set; }

        public string? reclamogarantia_TallerEmail { get; set; }

	}
}
