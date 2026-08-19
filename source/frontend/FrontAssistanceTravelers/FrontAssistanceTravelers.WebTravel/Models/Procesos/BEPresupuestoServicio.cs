namespace FrontAssistanceTravelers.WebTravel.Models.Procesos
{
	public class BEPresupuestoServicio
	{
		public int PresupuestoservicioId { get; set; }
		public int PresupuestoservicioPresupuestoId { get; set; }
		public int PresupuestoservicioServicioId { get; set; }
		public string? PresupuestoservicioServicioNombre { get; set; }
		public int PresupuestoservicioServicioPadreId { get; set; }
		public string? PresupuestoservicioServicioPadreNombre { get; set; }
		public double PresupuestoservicioServicioPrecio { get; set; }
		public string? PresupuestoservicioServicioTipoNombre { get; set; }
		public int PresupuestoservicioUsuario { get; set; }
		public string? PresupuestoservicioServicioTipoID { get; set; }
		public string? PresupuestoservicioServicioMarca { get; set; }
		public string? PresupuestoservicioServicioModelo { get; set; }
		public int PresupuestoservicioServicioStock { get; set; }
		public int PresupuestoservicioServicioStockMinimo { get; set; }
		public string? PresupuestoservicioServicioAlmacenCodigo { get; set; }
		public int PresupuestoservicioServicioUnidadMedidaId { get; set; }
		public string? PresupuestoservicioServicioGabinete { get; set; }
		public string? PresupuestoservicioServicioSeccion { get; set; }
		public string? PresupuestoservicioServicioCajon { get; set; }
		public double PresupuestoservicioServicioCostoUnitario { get; set; }
		public double PresupuestoservicioServicioPrecioVenta { get; set; }
		public double PresupuestoservicioServicioCantidad { get; set; }
		public double PresupuestoservicioServicioCosto { get; set; }
		public int presupuestoservicioOrdentrabajoDescripcionId { get; set; }
		public double presupuestoservicioSubTotalPrecio { get; set; }
		public string? presupuestoServicioSKU { get; set; }
		public int PresupuestoServicioServicioMonedaId { get; set; }
		public string? PresupuestoServicioServicioAlmacenNombre { get; set; }
		public string? PresupuestoServicioServicioCentro { get; set; }
		public string? PresupuestoServicioEstadoNombre { get; set; }
		public int PresupuestoServicioEstadoId { get; set; }
	}
}
