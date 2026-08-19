namespace FrontAssistanceTravelers.WebTravel.Models.Clientes
{
    public class BEClienteVehiculo
    {
        public int clientevehiculoId { get; set; }
        public string? clientevehiculoPlacaNumero { get; set; }
        public int clientevehiculoMarcaId { get; set; }
        public string? clientevehiculoMarcaNombre { get; set; }
        public int clientevehiculoModeloId { get; set; }
        public string? clientevehiculoModeloNombre { get; set; }
        public int clientevehiculoAnho { get; set; }
        public string? clientevehiculoMotorNumero { get; set; }
        public int clientevehiculoTipoId { get; set; }
        public string? clientevehiculoTipoNombre { get; set; }
        public string? clientevehiculoColor { get; set; }
        public int clientevehiculoRecorridoTipoId { get; set; }
        public string? clientevehiculoRecorridoTipoNombre { get; set; }
        public float clientevehiculoRecorridoNumero { get; set; }
        public DateTime clientevehiculoCreadoFecha { get; set; }
        public int clientevehiculoCreadoUsuarioId { get; set; }
        public DateTime clientevehiculoModificadoFecha { get; set; }
        public int clientevehiculoModificadoUsuarioId { get; set; }
        public int clientevehiculoActivo { get; set; }
        public int clientevehiculoClienteId { get; set; }
        public string? clientevehiculoClienteNombre { get; set; }
        public string? clientevehiculoClienteDocumentoNumero { get; set; }
        public string? clientevehiculoClienteDomicilio { get; set; }
        public string? clientevehiculoClienteDomicilioDistrito { get; set; }
        public string? clientevehiculoClienteTelefonoDomicilio { get; set; }
        public string? clientevehiculoClienteTelefonoOficina { get; set; }
        public string? clientevehiculoClienteTelefonoCelular { get; set; }
        public string? clientevehiculoClienteCorreo { get; set; }
        public string? clientevehiculoClienteNombreSolo { get; set; }
        public string? clientevehiculoClienteApellidoMaterno { get; set; }
        public string? clientevehiculoClienteApellidoPaterno { get; set; }
        public string? clientevehiculoClienteTipoDocumento { get; set; }
        public string? clientevehiculoClienteNombreLogo { get; set; }
        public string? clientevehiculoClienteNombreImagenDanho { get; set; }
        public int clientevehiculoDistribuidorId { get; set; }
        public DateTime clientevehiculoFechaPropiedad { get; set; }
        public string? clientevehiculoClientePlacaVIN { get; set; }
        public string? clientevehiculoDistribuidorEmail { get; set; }
        public string? clientevehiculoVIN { get; set; }
    }
}
