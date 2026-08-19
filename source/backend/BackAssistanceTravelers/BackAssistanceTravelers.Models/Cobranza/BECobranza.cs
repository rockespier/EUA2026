using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BackAssistanceTravelers.Models.Cobranza
{
	public class BECobranza
	{
		public string? cobranzaCliente { get; set; }
		public string? cobranzaDocumentoTipoId { get; set; }
		public string? cobranzaDocumentoTipoNombre { get; set; }
		public string? cobranzaDocumentoSerie { get; set; }
		public string? cobranzaDocumentoCorrelativo { get; set; }
		public string? cobranzaPagoMedioNombre { get; set; }
		public string? cobranzaNotaCredito { get; set; }
		public string? cobranzaCobradorNombre { get; set; }
		public string? cobranzaObservacion { get; set; }
		public string? cobranzaCreadoUsuarioNombre { get; set; }
		public string? cobranzaModificadoUsuarioNombre { get; set; }
		public string? cobranzaVentaIds { get; set; }
		public string? cobranzaDocumento { get; set; }
		public int cobranzaId { get; set; }
		public float? cobranzaComision { get; set; }
		public float? cobranzaIncentivo { get; set; }
		public int cobranzaPagoMedioId { get; set; }
		public DateTime cobranzaPagoFecha { get; set; }
		public int cobranzaCobradorId { get; set; }
		public float cobranzaImporteBruto { get; set; }
		public float cobranzaImportePago { get; set; }
		public DateTime cobranzaCreadoFecha { get; set; }
		public int cobranzaCreadoUsuarioId { get; set; }
		public DateTime cobranzaModificadoFecha { get; set; }
		public int cobranzaModificadoUsuarioId { get; set; }
		public int cobranzaActivo { get; set; }
		public float? cobranzaDescuento { get; set; }
		public int cobranzaPeriodoAnio { get; set; }
		public int cobranzaPeriodoMes { get; set; }
		public DateTime cobranzaFechaLiquidacion { get; set; }
		public string? cobranzaFormulaLiquidacion { get; set; }
		public float cobranzaPagos { get; set; }
		public string? cobranzaEstadoPago { get; set; }
		public float cobranzaSaldo { get; set; }
		public int cobranzaCodigoLiquidacion { get; set; }
	}
}
