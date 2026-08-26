using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BackAssistanceTravelers.Models.Venta
{
	public class BEVenta
	{
		public string? VentaNacionalidad { get; set; }
		public string? VentaDesOrigen { get; set; }
		public int VentaDescuento { get; set; }
		public string? VentaInicio { get; set; }
		public string? VentaFin { get; set; }
		public float VentaIncentivoTarifa { get; set; }
		public float VentaPublicidadTarifa { get; set; }
		public string? ventaUsuarioOrigen { get; set; }
		public string? ventaUsuarioAgenciaNombre { get; set; }
		public string? ventaDestino { get; set; }
		public string? ventaOrigen { get; set; }
		public int ventaProductoId { get; set; }
		public string? ventaProductoNombre { get; set; }
		public string? ventaClienteDocumentoTipoId { get; set; }
		public string? ventaClienteDocumentoTipoNombre { get; set; }
		public string? ventaClienteDocumentoNumero { get; set; }
		public string? ventaClienteNombres { get; set; }
		public string? ventaClienteApellidos { get; set; }
		public string? ventaClienteEmail { get; set; }
		public string? ventaClienteDireccion { get; set; }
		public string? ventaClienteTelefono { get; set; }
		public string? ventaClienteDistrito { get; set; }
		public string? ventaClienteCiudad { get; set; }
		public string? ventaClientePais { get; set; }
		public string? ventaContactoNombres { get; set; }
		public string? ventaContactoDireccion { get; set; }
		public string? ventaContactoEmail { get; set; }
		public string? ventaContactoTelefono { get; set; }
		public string? ventaContactoDistrito { get; set; }
		public string? ventaContactoPais { get; set; }
		public string? ventaEstadoId { get; set; }
		public string? ventaEstadoNombre { get; set; }
		public string? ventaSituacionId { get; set; }
		public string? ventaSituacionNombre { get; set; }
		public string? ventaCreadoUsuarioNombre { get; set; }
		public string? ventaModificadoUsuarioNombre { get; set; }
		public string? ventaAnuladoUsuarioNombre { get; set; }
		public string? ventaCounter { get; set; }
		public string? ventaClienteApellidoNombre { get; set; }
		public string? ventaPromotorNombre { get; set; }
		public string? ventaAgenciaNombre { get; set; }
		public string? ventaAgenciaDireccion { get; set; }
		public string? ventaAgenciaCorreo { get; set; }
		public string? ventaAgenciaRUC { get; set; }
		public string? ventaAgenciaIdExterno { get; set; }
		public int ventaAgenciaVip { get; set; }
		public string? ventaPagoFecha { get; set; }
		public string? ventaPagoDocumento { get; set; }
		public string? ventaCupon { get; set; }
		public string? ventaCobranzaDocumentoTipoId { get; set; }
		public string? ventaObservacion { get; set; }
		public string? ventaCodigoExterno { get; set; }
		public DateTime ventaCreadoFecha { get; set; }
		public DateTime ventaModificadoFecha { get; set; }
		public DateTime ventaAnuladoFecha { get; set; }
		public DateTime ventaCobranzaPagoFecha { get; set; }
		public DateTime ventaIncentivoFechaPago { get; set; }
        public DateTime ventaIncentivoPostFechaPago { get; set; }
        public DateTime ventaIncentivoModificadoFecha { get; set; }
		public DateTime ventaFechaVigenciaInicio { get; set; }
		public DateTime ventaFechaVigenciaFin { get; set; }
		public DateTime ventaClienteFechaNacimiento { get; set; }
		public float ventaProductoImporte { get; set; }
		public float ventaImporteVenta { get; set; }
		public float ventaPaisImpuesto { get; set; }
		public float ventaPaisImpuestoVenta { get; set; }
		public float ventaAgenciaComision { get; set; }
		public float ventaIncentivo { get; set; }
		public float ventaCobranzaComision { get; set; }
		public float ventaCobranzaIncentivo { get; set; }
		public float ventaCobranzaImportePago { get; set; }
		public float ventaIncentivoPostImporte { get; set; }
		public int ventaId { get; set; }
		public int ventaGrupalId { get; set; }
		public int ventaUsuarioAgenciaId { get; set; }
		public int ventaNumeroDias { get; set; }
		public int ventaProductoEdadMinima { get; set; }
		public int ventaProductoEdadMaxima { get; set; }
		public int ventaClienteEdad { get; set; }
		public int ventaClienteId { get; set; }
		public int ventaCreadoUsuarioId { get; set; }
		public int ventaModificadoUsuarioId { get; set; }
		public int ventaAnuladoUsuarioId { get; set; }
		public int ventaPromocionId { get; set; }
		public int ventaCobranzaPagoMedioId { get; set; }
		public int ventaIncentivoPost { get; set; }
		public int ventaIncentivoModificadoUsuario { get; set; }
		public string? ventaPaisNombre { get; set; }
		public float ventaComisionImporte { get; set; }
		public float ventaIncentivoImporte { get; set; }
		public float ventaPublicidadImporte { get; set; }
		public string? cobranzaDocumento { get; set; }		
		public string? ventaPromocionNombre { get; set; }
		public float ventaDescuentoImporte { get; set; }

		public int ventaCodigoLiquidacion { get; set; }

		public int ventaFormulaLiquidacion { get; set; }
		public string? ventaFormulaLiquidacionNombre { get; set; }
		public float ventaPagarLiquidacion { get; set; }
		public string? productoATVCodigo { get; set; }

        public string? ventaCobranzaPagoFechaString { get; set; }
    }
}
