using ClosedXML.Excel;
using DocumentFormat.OpenXml.Office2016.Excel;
using DocumentFormat.OpenXml.Presentation;
using DocumentFormat.OpenXml.Spreadsheet;
using DocumentFormat.OpenXml.Wordprocessing;
using FrontAssistanceTravelers.WebTravel.Models.General;
using FrontAssistanceTravelers.WebTravel.Models.Procesos;
using FrontAssistanceTravelers.WebTravel.Models.Reporte;
using iText.Commons.Utils;
using iText.Html2pdf;
using iText.Kernel.Pdf;
using iText.Kernel.Pdf.Canvas.Wmf;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.VisualBasic;
using Newtonsoft.Json;
using Org.BouncyCastle.Utilities;
using System;
using System.Globalization;
using System.IO;
using System.Net;
using System.Net.Http.Headers;
using System.Numerics;
using System.Reflection;
using System.Runtime.InteropServices;
using System.Runtime.Intrinsics.X86;
using System.Text;
using System.Text.Json;
using JsonSerializer = System.Text.Json.JsonSerializer;

namespace FrontAssistanceTravelers.WebTravel.Controllers
{
	[Authorize]
	public class ProcesoController : Controller
	{
		private readonly IConfiguration configuration;
		private readonly IHttpClientFactory httpClientFactory;
		public ProcesoController(IConfiguration configuration, IHttpClientFactory httpClientFactory)
		{
			this.configuration = configuration;
			this.httpClientFactory = httpClientFactory;
		}
		public IActionResult Index()
		{
			return View();
		}
		public IActionResult ListaOrdenesTrabajos()
		{
			return View();
		}
		public IActionResult ListaPresupuestos()
		{
			return View();
		}
		public IActionResult ListaEntregasRepuestos()
		{
			return View();
		}
		public IActionResult ListaReclamosGarantias()
		{
			return View();
		}
		public IActionResult ListaVentas()
		{
			return View();
		}
		public IActionResult ListaSolicitudes()
		{
			return View();
		}
		public IActionResult ListaLiquidaciones()
		{
			return View();
		}
		public IActionResult ListaCobranzas()
		{
			return View();
		}
		public IActionResult ListaPasajeros()
		{
			return View();
		}
		public IActionResult ListaCotizaciones()
		{
			return View();
		}
		public IActionResult ListaPagos()
		{
			return View();
		}
		public IActionResult ListaPagoIncentivos()
		{
			return View();
		}
		public IActionResult ListaImportar()
		{
			return View();
		}

		public IActionResult Cotizar() {
			return View();
		}	

		private async Task<Stream> RetornarStreamImageLogo(string rutaImagen)
		{
			string rutaAppSet = configuration.GetValue<string>("Generales:RutaWebImagenes")!;
			var rutaURLLogo = rutaAppSet + rutaImagen;
			var httpClienteLogo = httpClientFactory.CreateClient();

			var reponseLogo = await httpClienteLogo.GetAsync(rutaURLLogo);
			byte[] descargarLogo = await reponseLogo.Content.ReadAsByteArrayAsync();
			Stream streamLogo = new MemoryStream(descargarLogo);
			return streamLogo;
		}
        private async Task<List<BEAgenciaProducto>> VentaDescuentos_Obtener(string? codigos)
        {
            var httpClient = httpClientFactory.CreateClient();
            string pCodigos = codigos!;
            string parametros = "?pVentaCodigos=" + pCodigos;
            string RutaApi = configuration.GetValue<string>("Generales:RutaAPI")! + "venta/";
            httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", User.FindFirst("Token")?.Value ?? string.Empty);
            var response = await httpClient.GetAsync(RutaApi + "VentasDescuentoObtener" + parametros);

            // ✅ Si es OK o NoContent, devolver la lista (vacía si no hay contenido)
            if (response.StatusCode == HttpStatusCode.OK || response.StatusCode == HttpStatusCode.NoContent)
            {
                string jsonOK = await response.Content.ReadAsStringAsync();

                // Si no hay contenido (NoContent o string vacío), retornar lista vacía
                if (string.IsNullOrWhiteSpace(jsonOK))
                {
                    return new List<BEAgenciaProducto>();
                }

                List<BEAgenciaProducto> objOK = JsonConvert.DeserializeObject<List<BEAgenciaProducto>>(jsonOK)!;
                return objOK ?? new List<BEAgenciaProducto>();
            }

            string jsonError = await response.Content.ReadAsStringAsync();
            BEErrorApi objError = new BEErrorApi();
            if (!string.IsNullOrEmpty(jsonError))
                objError = JsonConvert.DeserializeObject<BEErrorApi>(jsonError) ?? objError;
            if (objError.errorCodigo == 0)
                objError.errorCodigo = (int)response.StatusCode;
            objError.errorDescripcion ??= response.ReasonPhrase;
            throw new HttpRequestException($"Error en VentasDescuentoObtener ({objError.errorCodigo}): {objError.errorDescripcion}");
        }
		private async Task<List<BEAgencia>> AgenciaVenta_Obtener(int Id)
		{
			var httpClient = httpClientFactory.CreateClient();
			string pIdVenta = Id.ToString();
			string parametros = "?pVentaId=" + pIdVenta;
			string RutaApi = configuration.GetValue<string>("Generales:RutaAPI")! + "Mantenimiento/";
			httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", User.FindFirst("Token")?.Value ?? string.Empty);
			var response = await httpClient.GetAsync(RutaApi + "AgenciaVentaObtener" + parametros);
			if (response.StatusCode == HttpStatusCode.OK)
			{
				string jsonOK = await response.Content.ReadAsStringAsync();
				List<BEAgencia> objOK = JsonConvert.DeserializeObject<List<BEAgencia>>(jsonOK)!;

				return objOK;
			}
			string jsonError = await response.Content.ReadAsStringAsync();
			BEErrorApi objError = new BEErrorApi();
			if (!string.IsNullOrEmpty(jsonError))
				objError = JsonConvert.DeserializeObject<BEErrorApi>(jsonError) ?? objError;
			if (objError.errorCodigo == 0)
				objError.errorCodigo = (int)response.StatusCode;
			objError.errorDescripcion ??= response.ReasonPhrase;
			throw new HttpRequestException($"Error en AgenciaVentaObtener ({objError.errorCodigo}): {objError.errorDescripcion}");
		}
		private async Task<List<BEVenta>> VentaEspecificas_Obtener(string? codigos, string? situacion)
		{
			var httpClient = httpClientFactory.CreateClient();
			string pCodigos = codigos!;
			string pSituacion = situacion!;
			string parametros = "?pVentaCodigos=" + pCodigos + "&pVentaSituacion=" + pSituacion;
			string RutaApi = configuration.GetValue<string>("Generales:RutaAPI")! + "Venta/";
			httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", User.FindFirst("Token")?.Value ?? string.Empty);
			var response = await httpClient.GetAsync(RutaApi + "VentasEspecificasObtener" + parametros);
			if (response.StatusCode == HttpStatusCode.OK)
			{
				string jsonOK = await response.Content.ReadAsStringAsync();
				List<BEVenta> objOK = JsonConvert.DeserializeObject<List<BEVenta>>(jsonOK)!;

				return objOK;
			}
			string jsonError = await response.Content.ReadAsStringAsync();
			BEErrorApi objError = new BEErrorApi();
			if (!string.IsNullOrEmpty(jsonError))
				objError = JsonConvert.DeserializeObject<BEErrorApi>(jsonError) ?? objError;
			if (objError.errorCodigo == 0)
				objError.errorCodigo = (int)response.StatusCode;
			objError.errorDescripcion ??= response.ReasonPhrase;
			throw new HttpRequestException($"Error en VentasEspecificasObtener ({objError.errorCodigo}): {objError.errorDescripcion}");
		}
		private async Task<BEErrorApi> Liquidacion_Procesar(int pVentaID, double pComision, double pIncentivo, double pPublicidad, int IDUsuario, int int_pFormula,
														float dec_pDescuento, double pPago, int CodLiquidacion)
		{
			var httpClient = httpClientFactory.CreateClient();
			string parametros = "?pVentaID=" + pVentaID.ToString() + "&pComision=" + pComision.ToString("F2", CultureInfo.InvariantCulture) + "&pIncentivo=" +
				pIncentivo.ToString("F2", CultureInfo.InvariantCulture) + "&pPublicidad=" + pPublicidad.ToString("F2", CultureInfo.InvariantCulture) + "&IDUsuario=" + IDUsuario.ToString() + "&int_pFormula=" + int_pFormula + "&dec_pDescuento=" + dec_pDescuento.ToString("F2", CultureInfo.InvariantCulture) + "&dec_pPago=" + pPago.ToString("F2", CultureInfo.InvariantCulture) + "&int_pLiquidacionCod=" + CodLiquidacion;
			string RutaApi = configuration.GetValue<string>("Generales:RutaAPI")! + "Venta/";
			httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", User.FindFirst("Token")?.Value ?? string.Empty);
			var response = await httpClient.PostAsync(RutaApi + "VentasLiquidacionProcesar" + parametros, null);
			if (response.StatusCode == HttpStatusCode.OK)
			{
				string jsonOK = await response.Content.ReadAsStringAsync();
				BEErrorApi objOK = JsonConvert.DeserializeObject<BEErrorApi>(jsonOK)!;

				return objOK;
			}
			string jsonError = await response.Content.ReadAsStringAsync();
			BEErrorApi objError = new BEErrorApi();
			if (!string.IsNullOrEmpty(jsonError))
				objError = JsonConvert.DeserializeObject<BEErrorApi>(jsonError) ?? objError;
			if (objError.errorCodigo == 0)
				objError.errorCodigo = (int)response.StatusCode;
			objError.errorDescripcion ??= response.ReasonPhrase;
			return objError;
		}
		private string ObjectoTOJson(object objecto)
		{
			JsonSerializerOptions jso = new JsonSerializerOptions();
			jso.Encoder = System.Text.Encodings.Web.JavaScriptEncoder.UnsafeRelaxedJsonEscaping;
			string jsonError = JsonSerializer.Serialize(objecto, jso);
			return jsonError;
		}
		private async Task<BEErrorApi> VentaMasiva_Procesar(BEVenta pVenta)
		{
			var httpClient = httpClientFactory.CreateClient();
			string parametros = ObjectoTOJson(pVenta);
			string RutaApi = configuration.GetValue<string>("Generales:RutaAPI")! + "Venta/";
			httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", User.FindFirst("Token")?.Value ?? string.Empty);
			var enEntidadEnviarJSONContenido = new StringContent(parametros.ToString(), Encoding.UTF8, "application/json");
			var response = await httpClient.PostAsync(RutaApi + "VentasMasivoProcesar", enEntidadEnviarJSONContenido);
			if (response.StatusCode == HttpStatusCode.OK)
			{
				string jsonOK = await response.Content.ReadAsStringAsync();
				BEErrorApi objOK = JsonConvert.DeserializeObject<BEErrorApi>(jsonOK)!;

				return objOK;
			}
			string jsonError = await response.Content.ReadAsStringAsync();
			BEErrorApi objError = new BEErrorApi();
			if (jsonError != "")
			{
				objError = JsonConvert.DeserializeObject<BEErrorApi>(jsonError)!;
			}
			else
			{
				objError.errorCodigo = StatusCode(((int)response.StatusCode)).StatusCode;
				objError.errorDescripcion = response.ReasonPhrase;
			}
			return objError;
		}
		private async Task<BEErrorApi> VentaGestionIncentivos_Procesar(BEVenta pVenta)
		{
			var httpClient = httpClientFactory.CreateClient();
			string parametros = ObjectoTOJson(pVenta);
			string RutaApi = configuration.GetValue<string>("Generales:RutaAPI")! + "Venta/";
			httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", User.FindFirst("Token")?.Value ?? string.Empty);
			var enEntidadEnviarJSONContenido = new StringContent(parametros.ToString(), Encoding.UTF8, "application/json");
			var response = await httpClient.PostAsync(RutaApi + "VentaGestionIncentivosProcesar", enEntidadEnviarJSONContenido);
			if (response.StatusCode == HttpStatusCode.OK)
			{
				string jsonOK = await response.Content.ReadAsStringAsync();
				BEErrorApi objOK = JsonConvert.DeserializeObject<BEErrorApi>(jsonOK)!;

				return objOK;
			}
			string jsonError = await response.Content.ReadAsStringAsync();
			BEErrorApi objError = new BEErrorApi();
			if (jsonError != "")
			{
				objError = JsonConvert.DeserializeObject<BEErrorApi>(jsonError)!;
			}
			else
			{
				objError.errorCodigo = StatusCode(((int)response.StatusCode)).StatusCode;
				objError.errorDescripcion = response.ReasonPhrase;
			}
			return objError;
		}
		private async Task<List<BEVenta>> Venta_Obtener(int Id)
		{
			var httpClient = httpClientFactory.CreateClient();
			string pOrigen = "";
			string pIdVenta = Id.ToString();
			string pfechaIni = "1/1/1900";
			string pfechaFin = "1/1/1900";
			string pIdusuario = "0";
			string pNombres = "";
			string pApellidos = "";
			string pEstado = "";
			string pSituacion = "";
			string pCodExt = "";
			string pPais = "0";
			string pAgencia = "0";
			string pUsuarioAgencia = "0";
			string parametros = "?pOrigen=" + pOrigen + "&pVentaIngresoInicio=" + pfechaIni + "&pVentaIngresoFin=" + pfechaFin
				+ "&pVentaID=" + pIdVenta + "&pUsuarioId=" + pIdusuario + "&pEstadoId=" + pEstado + "&pSituacionId=" + pSituacion
				+ "&pAgenciaId=" + pAgencia + "&pAgenciaUsuarioId=" + pUsuarioAgencia + "&pClienteNombres=" + pNombres
				+ "&pClienteApellidos=" + pApellidos + "&pPaisId=" + pPais + "&pCodigoExterno=" + pCodExt;
			string RutaApi = configuration.GetValue<string>("Generales:RutaAPI")! + "Venta/";
			httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", User.FindFirst("Token")?.Value ?? string.Empty);
			var response = await httpClient.GetAsync(RutaApi + "VentasObtener" + parametros);
			if (response.StatusCode == HttpStatusCode.OK)
			{
				string jsonOK = await response.Content.ReadAsStringAsync();
				List<BEVenta> objOK = JsonConvert.DeserializeObject<List<BEVenta>>(jsonOK)!;

				return objOK;
			}
			string jsonError = await response.Content.ReadAsStringAsync();
			BEErrorApi objError = new BEErrorApi();
			if (!string.IsNullOrEmpty(jsonError))
				objError = JsonConvert.DeserializeObject<BEErrorApi>(jsonError) ?? objError;
			if (objError.errorCodigo == 0)
				objError.errorCodigo = (int)response.StatusCode;
			objError.errorDescripcion ??= response.ReasonPhrase;
			throw new HttpRequestException($"Error en VentasObtener ({objError.errorCodigo}): {objError.errorDescripcion}");
		}
		private async Task<List<BEVenta>> VentaExportar_Obtener(BEVentaExportar pVentaExportar)
		{
			var httpClient = httpClientFactory.CreateClient();
			string pOrigen = pVentaExportar.pOrigen!;
			string pIdVenta = pVentaExportar.pVentaID!.ToString();
			string pfechaIni = pVentaExportar.pVentaIngresoInicio!;
			string pfechaFin = pVentaExportar.pVentaIngresoFin!;
			string pIdusuario = pVentaExportar.pUsuarioId!;
			string pNombres = pVentaExportar.pClienteNombres!;
			string pApellidos = pVentaExportar.pClienteApellidos!;
			string pEstado = pVentaExportar.pEstadoId!;
			string pSituacion = pVentaExportar.pSituacionId!;
			string pCodExt = pVentaExportar.pCodigoExterno!;
			string pPais = pVentaExportar.pPaisId!;
			string pAgencia = pVentaExportar.pAgenciaId!;
			string pUsuarioAgencia = pVentaExportar.pAgenciaUsuarioId!;
			string pTipoDoc = pVentaExportar.pTipoDoc!;
			string pNumDoc = pVentaExportar.pNumeDoc!;

			string parametros = "?pOrigen=" + pOrigen + "&pVentaIngresoInicio=" + pfechaIni + "&pVentaIngresoFin=" + pfechaFin
				+ "&pVentaID=" + pIdVenta + "&pUsuarioId=" + pIdusuario + "&pEstadoId=" + pEstado + "&pSituacionId=" + pSituacion
				+ "&pAgenciaId=" + pAgencia + "&pAgenciaUsuarioId=" + pUsuarioAgencia + "&pClienteNombres=" + pNombres
				+ "&pClienteApellidos=" + pApellidos + "&pPaisId=" + pPais + "&pCodigoExterno=" + pCodExt + "&pTipoDoc=" + pTipoDoc + "&pNumeDoc=" + pNumDoc;
			string RutaApi = configuration.GetValue<string>("Generales:RutaAPI")! + "Venta/";
			httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", User.FindFirst("Token")?.Value ?? string.Empty);
			var response = await httpClient.GetAsync(RutaApi + "VentasObtener" + parametros);
			if (response.StatusCode == HttpStatusCode.OK)
			{
				string jsonOK = await response.Content.ReadAsStringAsync();
				List<BEVenta> objOK = JsonConvert.DeserializeObject<List<BEVenta>>(jsonOK)!;

				return objOK;
			}
			string jsonError = await response.Content.ReadAsStringAsync();
			BEErrorApi objError = new BEErrorApi();
			if (!string.IsNullOrEmpty(jsonError))
				objError = JsonConvert.DeserializeObject<BEErrorApi>(jsonError) ?? objError;
			if (objError.errorCodigo == 0)
				objError.errorCodigo = (int)response.StatusCode;
			objError.errorDescripcion ??= response.ReasonPhrase;
			throw new HttpRequestException($"Error en VentasObtener ({objError.errorCodigo}): {objError.errorDescripcion}");
		}
		private async Task<BEErrorApi> Venta_CodigoExterno(string? codigo)
		{
			var httpClient = httpClientFactory.CreateClient();
			string pCodigoExterno = codigo!.ToString();
			string parametros = "?pCodigoExterno=" + pCodigoExterno;
			string RutaApi = configuration.GetValue<string>("Generales:RutaAPI")! + "Venta/";
			httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", User.FindFirst("Token")?.Value ?? string.Empty);
			var response = await httpClient.GetAsync(RutaApi + "CodigoExternoObtener" + parametros);
			if (response.StatusCode == HttpStatusCode.OK)
			{
				string jsonOK = await response.Content.ReadAsStringAsync();
				BEErrorApi objOK = JsonConvert.DeserializeObject<BEErrorApi>(jsonOK)!;

				return objOK;
			}
			string jsonError = await response.Content.ReadAsStringAsync();
			BEErrorApi objError = new BEErrorApi();
			if (!string.IsNullOrEmpty(jsonError))
				objError = JsonConvert.DeserializeObject<BEErrorApi>(jsonError) ?? objError;
			if (objError.errorCodigo == 0)
				objError.errorCodigo = (int)response.StatusCode;
			objError.errorDescripcion ??= response.ReasonPhrase;
			return objError;
		}
		private async Task<List<BEValoresTipo>> ValoresTipo_Obtener(string Campo, int Id)
		{
			var httpClient = httpClientFactory.CreateClient();
			string nombreCampo = Campo;
			string valorId = Id.ToString();
			string parametros = "?pValorNombreCampo=" + nombreCampo + "&pValorTipoId=" + valorId;
			string RutaApi = configuration.GetValue<string>("Generales:RutaAPI")! + "generales/";
			httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", User.FindFirst("Token")?.Value ?? string.Empty);
			var response = await httpClient.GetAsync(RutaApi + "ValorTipoIdObtener" + parametros);
			if (response.StatusCode == HttpStatusCode.OK)
			{
				string jsonOK = await response.Content.ReadAsStringAsync();
				List<BEValoresTipo> objOK = JsonConvert.DeserializeObject<List<BEValoresTipo>>(jsonOK)!;

				return objOK;
			}
			string jsonError = await response.Content.ReadAsStringAsync();
			BEErrorApi objError = new BEErrorApi();
			if (!string.IsNullOrEmpty(jsonError))
				objError = JsonConvert.DeserializeObject<BEErrorApi>(jsonError) ?? objError;
			if (objError.errorCodigo == 0)
				objError.errorCodigo = (int)response.StatusCode;
			objError.errorDescripcion ??= response.ReasonPhrase;
			throw new HttpRequestException($"Error en ValorTipoIdObtener ({objError.errorCodigo}): {objError.errorDescripcion}");
		}
        private async Task<List<BEProductoBeneficio>> ProductoBeneficioCoti_Obtener(string Ids, int Idioma)
        {
            var httpClient = httpClientFactory.CreateClient();           
            string IdIdioma = Idioma.ToString();
            string parametros = "?str_pProductoID=" + Ids + "&int_pBeneficioIdioma=" + IdIdioma;
            string RutaApi = configuration.GetValue<string>("Generales:RutaAPI")! + "mantenimiento/";
            httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", User.FindFirst("Token")?.Value ?? string.Empty);
            var response = await httpClient.GetAsync(RutaApi + "ProductoBeneficiosCotizacionObtener" + parametros);
            if (response.StatusCode == HttpStatusCode.OK)
            {
                string jsonOK = await response.Content.ReadAsStringAsync();
                List<BEProductoBeneficio> objOK = JsonConvert.DeserializeObject<List<BEProductoBeneficio>>(jsonOK)!;

                return objOK;
            }
            string jsonError = await response.Content.ReadAsStringAsync();
            BEErrorApi objError = new BEErrorApi();
            if (!string.IsNullOrEmpty(jsonError))
                objError = JsonConvert.DeserializeObject<BEErrorApi>(jsonError) ?? objError;
            if (objError.errorCodigo == 0)
                objError.errorCodigo = (int)response.StatusCode;
            objError.errorDescripcion ??= response.ReasonPhrase;
            throw new HttpRequestException($"Error en ProductoBeneficiosCotizacionObtener ({objError.errorCodigo}): {objError.errorDescripcion}");
        }
        private async Task<List<BEProductoBeneficio>> ProductoBeneficio_Obtener(int Id, int Idioma)
		{
			var httpClient = httpClientFactory.CreateClient();
			string idProducto = Id.ToString();
			string IdBeneficio = "0";
			string IdIdioma = Idioma.ToString();
			string parametros = "?int_pProductoID=" + idProducto + "&int_pBeneficioID=" + IdBeneficio + "&int_pBeneficioIdioma=" + IdIdioma;
			string RutaApi = configuration.GetValue<string>("Generales:RutaAPI")! + "mantenimiento/";
			httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", User.FindFirst("Token")?.Value ?? string.Empty);
			var response = await httpClient.GetAsync(RutaApi + "ProductoBeneficiosObtener" + parametros);
            if (response.StatusCode == HttpStatusCode.OK || response.StatusCode == HttpStatusCode.NoContent)
            {
				string jsonOK = await response.Content.ReadAsStringAsync();
                // Si no hay contenido (NoContent o string vacío), retornar lista vacía
                if (string.IsNullOrWhiteSpace(jsonOK))
                {
                    return new List<BEProductoBeneficio>();
                }
                List<BEProductoBeneficio> objOK = JsonConvert.DeserializeObject<List<BEProductoBeneficio>>(jsonOK)!;

                return objOK ?? new List<BEProductoBeneficio>();
            }
			string jsonError = await response.Content.ReadAsStringAsync();
			BEErrorApi objError = new BEErrorApi();
			if (!string.IsNullOrEmpty(jsonError))
				objError = JsonConvert.DeserializeObject<BEErrorApi>(jsonError) ?? objError;
			if (objError.errorCodigo == 0)
				objError.errorCodigo = (int)response.StatusCode;
			objError.errorDescripcion ??= response.ReasonPhrase;
			throw new HttpRequestException($"Error en ProductoBeneficiosObtener ({objError.errorCodigo}): {objError.errorDescripcion}");
		}
		[HttpGet]
		[Route("exportVentaImprimir/{id}")]
		public async Task<FileStreamResult> exportVentaImprimir(string id)
		{
			var parametros = id.Split("_");
			var ventaId = parametros[0];
			var menbreteTipo = parametros[1];
			var precioTipo = parametros[2];
			var origenTipo = parametros[3];
			Stream XLSXGarantiaAdjunto = new MemoryStream(await exportVentaImpHmtlMemory(Int32.Parse(ventaId), Int32.Parse(menbreteTipo), Int32.Parse(precioTipo), Int32.Parse(origenTipo)));
			var XLSXGarantiaType = "application/octet-stream";
			var XLSXGarantiaNombreArchivo = ventaId.ToString().Trim() + ".pdf";
			return File(XLSXGarantiaAdjunto, XLSXGarantiaType, XLSXGarantiaNombreArchivo);
		}
		private async Task<byte[]> exportVentaImpHmtlMemory(int id, int membrete, int precio, int origen)
		{
			string body = await exportVentaImpHmtl(id, membrete, precio, origen);
			using (MemoryStream outputStream = new MemoryStream())
			{
				PdfWriter writer = new PdfWriter(outputStream);
				PdfDocument pdfDoc = new PdfDocument(writer);
				pdfDoc.SetDefaultPageSize(iText.Kernel.Geom.PageSize.A4);
				HtmlConverter.ConvertToPdf(body, pdfDoc, null);
				//outputStream.Position = 0;
				return outputStream.ToArray();
			}
		}
		private async Task<string> exportVentaImpHmtl(int id, int membrete, int precio, int origen)
		{
			string strNro = id.ToString();
			var strValorTipoDatosContacto1 = "ContactoEUALinea1";
			var strValorTipoDatosContacto2 = "ContactoEUALinea2";
			var strValorTipoDatosContacto3 = "ContactoEUALinea3";
			var intIdiomaBeneficio = 1;
			var titulo = "CERTIFICADO DE <BR>ASISTENCIA EN VIAJE<BR>";
			var titulopasajero = "DATOS DEL TITULAR";
			var nombreyapellido = "NOMBRES Y APELLIDOS";
			var documento = "DOCUMENTO";
			var fechanacimiento = "FECHA DE NACIMIENTO";
			var edad = "EDAD";
			var datosdelviaje = "DATOS DEL VIAJE";
			var inicio = "INICIO";
			var fin = "FIN";
			var fechaemision = "FECHA DE EMISIÓN";
			var totaldias = "TOTAL DÍAS";
			var plancontratado = "PLAN CONTRATADO";
			var agencia = "AGENCIA";
			var tarifa = "TARIFA";
			var origenlabel = "ORIGEN";
			var destinolabel = "DESTINO";
			var centrales = "CENTRALES DE EMERGENCIA";
			var mensaje_centrales = "En caso de emergencia, contacte a la central de emergencia a los siguientes números <br> USA +1(954) 678 6680 EUROPA +34(93) 172 7699<br><b>WHATSAPP DE ASISTENCIAS* +51 959262339 ó +51 993325531 *</b> Solo para textos, imágenes y <br>audios.<br> Verifique en el CC.GG. las cláusulas de los límites y/o importes indicados líneas abajo";
			var importante = "IMPORTANTE";
			var condiciones = "<li>En su Voucher y en las condiciones generales de EUROAMERICAN ASSISTANCE encontrará los teléfonos de las centrales de EUROAMERICAN ASSISTANCE.</li><li>Si no hubiera central de EUROAMERICAN ASSISTANCE en el país donde usted se encuentra, llame a la central Internacional o al siguiente correo electrónico: callcenter @euroamericanassistance.com </li></ul>";
			var acepta = "El titular declara conocer y aceptar las Condiciones Generales que rigen la prestación del servicio y que condicionan los beneficios del producto <br> contratado. Usted puede consultar las condiciones generales en nuestro portal web en contrato <br> http://www.euroamericanassistance.com/eaa/condiciones_generales.pdf";
			var cobertura = "COBERTURA";
			if (membrete == 4)
			{
				intIdiomaBeneficio = 2;
				titulo = "VOUCHER OF <BR>TRAVELER ASSIST<BR>";
				titulopasajero = "PASSENGER DATA";
				nombreyapellido = "FULL NAME";
				documento = "DOCUMENT";
				fechanacimiento = "DATE OF BIRTH";
				datosdelviaje = "TRAVEL DATA";
				edad = "AGE";
				inicio = "INITIAL DATE";
				fin = "FINAL DATE";
				fechaemision = "ISSUE DATE";
				totaldias = "TOTAL DAYS";
				plancontratado = "CONTRACTED PLAN";
				agencia = "AGENCY";
				tarifa = "RATE";
				origenlabel = "ORIGIN";
				destinolabel = "DESTINATION";
				centrales = "EMERGENCY CENTERS";
				mensaje_centrales = "For assistance call us the following numbers: USA +1(954) 678 6680 EUROPA +34(93) 172 7699<br>Whatsapp * +51 959262339 or +51 993325531 * Only for texts, images and audios.<br>Check in the CC.GG. the clauses of the limits and/or amounts indicated below.";
				importante = "IMPORTANT";
				condiciones = "<li> In your voucher and general conditions of EUROAMERICAN ASSISTANCE you find the phones of EUROAMERICAN ASSISTANCE.</li><li>If no exists a telephone number of EUROAMERICAN ASSISTANCE in the country where you are, call us the international number or write us the following email: callcenter @euroamericanassistance.com </li></ul>"; 
				acepta = "The holder declares to know and accept the General Conditions that govern the provision of the service and that condition the benefits of the contracted product.<br>You can check the general conditions in our web portal in contract<br>http://www.euroamericanassistance.com/eaa/condiciones_generales.pdf";
				cobertura = "COVERAGE";
			}

			var oResultado = await Venta_Obtener(id);
			var oResultadoValoresTipo1 = await ValoresTipo_Obtener(strValorTipoDatosContacto1, oResultado[0].ventaProductoId);
			var oResultadoValoresTipo2 = await ValoresTipo_Obtener(strValorTipoDatosContacto2, oResultado[0].ventaProductoId);
			var oResultadoValoresTipo3 = await ValoresTipo_Obtener(strValorTipoDatosContacto3, oResultado[0].ventaProductoId);

			var oResultadoProductoBeneficios = await ProductoBeneficio_Obtener(oResultado[0].ventaProductoId, intIdiomaBeneficio);


			string rutaAppSet = configuration.GetValue<string>("Generales:RutaWebImagenes")!;
			var rutaURLLogo = rutaAppSet + "logos/logo.png";
			StringBuilder writer = new StringBuilder();
			#region "CABECERA"
			writer.AppendLine("<html>");
			writer.AppendLine("<head>");
			writer.AppendLine("<link rel='stylesheet' href='https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/css/bootstrap.min.css'>");
			writer.AppendLine("<style>");
			writer.AppendLine("table td{");
			writer.AppendLine("font-size: 90%; font-family:Arial,sans-serif;}");
			writer.AppendLine("table th{");
			writer.AppendLine("font-family:Arial,sans-serif; font-weight: bold;}");
			writer.AppendLine(".titulo {");
			writer.AppendLine("border-collapse:separate;");
			writer.AppendLine("border:solid #f09000 1px;");
			writer.AppendLine("border-radius:6px; font-weight: bold;");
			writer.AppendLine("} #voucher{font-size: 130%; font-family:Arial, sans-serif;}");

			writer.AppendLine(".titulo td, th {");
			writer.AppendLine("border-left:solid #f09000 1px;");
			writer.AppendLine("border-top:solid #f09000 1px; font-weight: bold;}");

			writer.AppendLine(".titulo th {");
			writer.AppendLine("background-color: #f09000;");
			writer.AppendLine("border-top: none;");
			writer.AppendLine("color:#FFF;");
			writer.AppendLine("padding:5px 0 5px 10px; font-weight: bold;");
			writer.AppendLine("}");

			writer.AppendLine("td:first-child, th:first-child {");
			writer.AppendLine("border-left: none;");
			writer.AppendLine("}");
			writer.AppendLine(".espacio{");
			writer.AppendLine("padding:5px 0 5px 10px;");
			writer.AppendLine("}");
						
			writer.AppendLine(".pie {");
			writer.AppendLine("border-collapse:separate;");
			writer.AppendLine("border:solid #E6E6E6 1px;");
			writer.AppendLine("border-radius:6px;");
			writer.AppendLine("}");

			writer.AppendLine(".pie td, th {");
			writer.AppendLine("border-left:solid #E6E6E6 1px;");
			writer.AppendLine("border-top:solid #E6E6E6 1px;");
			writer.AppendLine("}");

			writer.AppendLine(".pie th {");
			writer.AppendLine("background-color: #E6E6E6;");
			writer.AppendLine("border-top: none;");
			writer.AppendLine("color:#022b89;");
			writer.AppendLine("padding:5px 0 5px 10px;");
			writer.AppendLine("}");

			writer.AppendLine("</style>");
			writer.AppendLine("</head>");
			writer.AppendLine("<body>");
			writer.AppendLine("<div class='container'>");
			writer.AppendLine("<table width='702px' cellpadding='4' cellspacing='4' border='0'>");
			writer.AppendLine("<tr>");
			writer.AppendLine("<td colspan='2'>&nbsp;</td></tr>		");
			writer.AppendLine("<tr>");
			writer.AppendFormat("<td width='60%'><img src='{0}' height='120'/></td>", rutaURLLogo);
			#endregion

			writer.AppendLine("<td style='text-align:center;font-size: 70%' class='espacio'>");
			writer.AppendFormat("<span style='color:#022b89'><b>{0}</b></span>", titulo);			
			writer.AppendFormat("<span style='color:#f09000' id='voucher'><b>Voucher Nº {0}</b></span></td>", strNro);
			writer.AppendLine("</tr>");
			writer.AppendLine("<tr><td colspan='2'>&nbsp;</td></tr>");
			writer.AppendLine("<tr><td colspan='2'><table width='100%' class='titulo'>");
			writer.AppendFormat("<tr><th>{0}</th></tr></table></td></tr>", titulopasajero);
			writer.AppendLine("<tr><td colspan='2'><table width='100%' cellpadding='4' cellspacing='4' border='0'>");
			writer.AppendFormat("<tr><td width='50%' class='espacio'><b>{0}:</b></td>			", nombreyapellido);
			writer.AppendFormat("<td width='50%' class='espacio'><b>{0}:</b></td>		", documento);
			writer.AppendFormat("</tr><tr><td class='espacio'>{0} {1}</td>		", oResultado[0].ventaClienteNombres, oResultado[0].ventaClienteApellidos);
			writer.AppendFormat("<td class='espacio'>{0}</td>", oResultado[0].ventaClienteDocumentoNumero);
			writer.AppendLine("</tr><tr>");
			writer.AppendFormat("<td width='50%' class='espacio'><b>{0}:</b></td>			", fechanacimiento);
			writer.AppendFormat("<td class='espacio'><b>{0}:</b></td>	",edad);
			writer.AppendLine("</tr>");
			writer.AppendLine("<tr>");
			writer.AppendFormat("<td class='espacio'>{0}</td>", oResultado[0].ventaClienteFechaNacimiento.ToString("dd/MM/yyyy"));
			writer.AppendFormat("<td class='espacio'>{0}</td>", oResultado[0].ventaClienteEdad);
			writer.AppendLine("</tr>");
			writer.AppendLine("</table></td></tr><tr>");
			writer.AppendLine("<td colspan='2'>");
			writer.AppendLine("<table width='100%' class='titulo'><tr>");
			writer.AppendFormat("<th>{0}</th></tr></table></td></tr>", datosdelviaje);
			writer.AppendLine("<tr><td colspan='2'>");
			writer.AppendLine("<table width='100%' cellpadding='4' cellspacing='4' border='0'>");
			writer.AppendLine("<tr>");
			writer.AppendFormat("<td width='25%'  class='espacio'><b>{0}:</b></td>",inicio);
			writer.AppendFormat("<td width='25%'  class='espacio'>{0}</td>", oResultado[0].ventaFechaVigenciaInicio.ToString("dd/MM/yyyy"));
			writer.AppendFormat("<td width='25%'  class='espacio'><b>{0}:</b></td>",fin);
			writer.AppendFormat("<td width='25%'  class='espacio'>{0}</td>", oResultado[0].ventaFechaVigenciaFin.ToString("dd/MM/yyyy"));
			writer.AppendLine("</tr>");
			writer.AppendLine("<tr>");
			writer.AppendFormat("<td class='espacio'><b>{0}:</b></td>",fechaemision);
			writer.AppendFormat("<td class='espacio'>{0}</td>", oResultado[0].ventaCreadoFecha.ToString("dd/MM/yyyy"));
			writer.AppendFormat("<td class='espacio'><b>{0}:</b></td>",totaldias);
			writer.AppendFormat("<td class='espacio'>{0}</td>	", oResultado[0].ventaNumeroDias);
			writer.AppendLine("</tr>");
			writer.AppendLine("<tr>");
			writer.AppendFormat("<td class='espacio'><b>{0}: </b></td>",plancontratado);
			writer.AppendFormat("<td class='espacio'>{0}</td>", oResultado[0].ventaProductoNombre);
			writer.AppendFormat("<td class='espacio'><b>{0}:</b></td>",agencia);
			writer.AppendFormat("<td class='espacio'>{0}</td>", oResultado[0].ventaUsuarioAgenciaNombre);
			writer.AppendLine("</tr>");
			writer.AppendLine("<tr>");
			if (origen == 1) {
				writer.AppendFormat("<td class='espacio'><b>{0}:</b></td>", origenlabel);
				writer.AppendFormat("<td class='espacio'>{0}</td>", oResultado[0].ventaOrigen);
			} else {
				writer.AppendLine("<td colspan='2'></td>");
			}
			writer.AppendFormat("<td class='espacio'><b>{0}:</b></td>", destinolabel);
			writer.AppendFormat("<td class='espacio'>{0}</td>", oResultado[0].ventaDestino);
			writer.AppendLine("</tr>");
			if (precio == 1) {
				writer.AppendLine("<tr>");
				writer.AppendFormat("<td class='espacio'><b>{0}</b>:</td>",tarifa);
				writer.AppendFormat("<td class='espacio'>USD {0}</td>", oResultado[0].ventaImporteVenta.ToString("0.00"));
				writer.AppendLine("<td colspan='2'></td>");
				writer.AppendLine("</tr>");
			} else {
				writer.AppendLine("<tr>");
				writer.AppendLine("<td colspan='4'></td>");				
				writer.AppendLine("</tr>");
			}
			writer.AppendLine("</table>");
			writer.AppendLine("</td>");
			writer.AppendLine("</tr>");
			writer.AppendLine("<tr>");
			writer.AppendLine("<td colspan='2'>");
			writer.AppendLine("<table width='100%' class='titulo'>");
			writer.AppendLine("<tr>");
			writer.AppendFormat("<th>{0}</th>",centrales);
			writer.AppendLine("</tr>");
			writer.AppendLine("</table>");
			writer.AppendLine("</td>");
			writer.AppendLine("</tr>	");
			writer.AppendLine("<tr>");
			writer.AppendLine("<td colspan='2'>	");
			writer.AppendLine("<table width='100%' cellpadding='4' cellspacing='4' border='0'>");
			writer.AppendLine("<tr>	");
			writer.AppendFormat("<td class='espacio' style='text-align:center;'>{0}<br></td></tr></table></td></tr>", mensaje_centrales);									
			writer.AppendLine("<tr>");
			writer.AppendLine("<td colspan='2'>");
			writer.AppendLine("<table width='100%'>");
			writer.AppendLine("<tr>");
			writer.AppendLine("<td width='80%' >");
			writer.AppendLine("<table width='100%' class='titulo'>");
			writer.AppendLine("<tr>");
			writer.AppendFormat("<th>{0}</th>	",importante);
			writer.AppendLine("</tr></table></td><td></td></tr></table></td></tr>");

			writer.AppendLine("<tr><td colspan='2'>");
			writer.AppendLine("<table width='100%'><tr>");
			writer.AppendLine("<td width='80%' class='espacio'  >");
			writer.AppendFormat("<ul>{0}",condiciones);			
			writer.AppendLine("</td><td><table width='90%'");
			writer.AppendFormat("<tr><td style='text-align:center;padding:8 5 8 5'><img src='{0}' height='80' /></td></tr></table></td></tr></table></td></tr>", rutaAppSet + "logos/qr_logo.jpg");
			writer.AppendLine("<tr>");
			writer.AppendLine("<td colspan='2' style='text-align:center;'>");
			writer.AppendFormat("<img src='{0}' width='550' />", rutaAppSet + "logos/protocolo.jpg");
			writer.AppendLine("</td>	");
			writer.AppendLine("</tr>");
			writer.AppendLine("<tr>");
			writer.AppendLine("<td colspan='2'>");
			writer.AppendLine("<table width='100%' class='pie'>");
			writer.AppendLine("<tr>");
			writer.AppendFormat("<th style='font-size: 80%;text-align:center;'>{0}",acepta);			
			writer.AppendLine("</th>	");
			writer.AppendLine("</tr>");			
			writer.AppendLine("</table>	");
			writer.AppendLine("</td>	");
			writer.AppendLine("</tr>");

			writer.AppendLine("<tr><td colspan='2'><table width='100%' class='titulo'>");
			writer.AppendFormat("<tr><th width='60%'>{1}</th><th>{0}</th></tr></table></td></tr>", oResultado[0]?.ventaProductoNombre?.ToString()?.ToUpper() ?? "N/A",cobertura);

			writer.AppendLine("<tr>");
			writer.AppendLine("<td colspan='2'>");
			writer.AppendLine("<table width='100%'>");

			int int_vColumnas = 1;
			int int_contador = 1;
			string strFondo;
			int int_filas = 0;

			writer.AppendLine("<tr>");
			foreach (BEProductoBeneficio item in oResultadoProductoBeneficios) {
				if (int_contador < 100) {
					if (int_filas % 2 == 0) {
						strFondo = "style='background-color:#e3e9ec'";
					} else {
						strFondo = "";
					}				
					writer.AppendFormat("<tr {0} ><td style='padding:4px 0 4px 10px;' width='60%'>{1}</td><td style='padding:4px 0 4px 10px;' width='40%'>{2}</td></tr>", strFondo, item.beneficioNombre, item.beneficioImporte);
					int_vColumnas = int_vColumnas + 1;
					int_filas = int_filas + 1;
				}
				int_contador = int_contador + 1;
			}

			writer.AppendLine("</table>");
			writer.AppendLine("</td>");
			writer.AppendLine("</tr>");
			writer.AppendLine("<tr><td colspan='2'>&nbsp;<br><br><br><br></td></tr>");
			if (membrete == 3) {
				writer.AppendLine("<tr>");
				writer.AppendLine("<td colspan='2' style='text-align:left;padding:2px 10px 2px 10px;font-size: 85%;'>");
				writer.AppendLine("<h4>RESUMEN DE LAS CONDICIONES GENERALES:</h4><p align='justify'>Este documento es un resumen de las cláusulas en el texto completo de las condiciones Generales que rige la prestación de los servicios de asistencia al viajero y pretende ser una referencia rápida para el usuario.Sin embargo,");
				writer.AppendLine("no reemplaza ni modifica dichas condiciones y ante cualquier disputa sólo se tendrá por válido el texto de las");
				writer.AppendLine("Condiciones Generales completas entregado y / o puesto a su disposición en nuestra página <a href='www.euroamericanassistance.com'>www.euroamericanassistance.com</a>");
				writer.AppendLine("Recuerde que cada producto tiene una combinación de prestaciones y montos máximos diferentes.Por favor,");
				writer.AppendLine("consulte en su voucher la tabla de prestaciones del producto que contrató para conocer los beneficios aplicables.");
				writer.AppendLine("Toda asistencia o reintegro de gastos está sujeto a que el Titular proceda según lo establecido en las Condiciones");
				writer.AppendLine("Generales.</p> A.1.1.VERIFICACIÓN <p align='justify'> Verifique que todos los datos asignados en su voucher y tarjeta EUROAMERICAN ASSISTANCE sean correctos.");
				writer.AppendLine("Controle especialmente los teléfonos indicados como contacto en caso de emergencia, como así también las fechas");
				writer.AppendLine("de vigencia y el plan adquirido.Si hay errores en los datos, comuníquese con la oficina, EUROAMERICAN");
				writer.AppendLine("ASSISTANCE en el país de la emisión de la tarjeta para rectificar los mismos </p>");
				writer.AppendLine("<p align='justify'> Lea atentamente las Instrucciones y Condiciones Generales de los servicios EUROAMERICAN ASSISTANCE.");
				writer.AppendLine("C.1.9.En ningún caso se aceptarán cancelaciones, anulaciones o modificaciones una vez iniciada la validez de Plan");
				writer.AppendLine("EUROAMERICAN ASSISTANCE.La validez de una tarjeta inicia a las cero horas, cero minutos y un segundo del día");
				writer.AppendLine("que figura en la casilla inicio de vigencia de la tarjeta EUROAMERICAN ASSISTANCE.</p>");
				writer.AppendLine("C.2.DEFINICIONES <p align='justify'>");
				writer.AppendLine("A todos los fines interpretativos, se deja expresa constancia que en las presentes “Instrucciones de utilización de los");
				writer.AppendLine("servicios EUROAMERICAN ASSISTANCE” y en las “Condiciones Generales de los servicios EUROAMERICAN");
				writer.AppendLine("ASSISTANCE” se entiende por:		Accidente El evento generativo de un daño corporal que sufre el Titular, causado por agentes extraños, fuera de");
				writer.AppendLine("control y en movimiento, externos, violentos y visibles.Siempre que se mencione el término “accidente” se entenderá");
				writer.AppendLine("que la lesión o dolencia resultante fue provocada directamente por tales agentes e independientemente de cualquier");
				writer.AppendLine("otra causa.</p><p align='justify'>");
				writer.AppendLine("Central Operativa La oficina que coordina la prestación de los servicios requeridos por el titular con motivo de su");
				writer.AppendLine("asistencia.Circunstancias Excepcionales Todas aquellas situaciones extraordinarias de presentación infrecuente, indicadas en la");
				writer.AppendLine("Cláusula C.8.de las presentes Condiciones Generales.Congénito Presente o existente desde antes del momento de nacer.");
				writer.AppendLine("Crónico Todo proceso patológico continuo y persistente en el tiempo, mayor de 30 días de duración.Departamento");
				writer.AppendLine("Médico Grupo de profesionales de la salud que prestando servicios de supervisión, control y / o coordinación para");
				writer.AppendLine("EUROAMERICAN ASSISTANCE intervienen y deciden en todos aquellos asuntos y / o prestaciones brindadas o a");
				writer.AppendLine("brindarse en virtud de las presentes Condiciones Generales y que están directa o indirectamente relacionados con");
				writer.AppendLine("temas médicos.</p><p align='justify'> Dolencia y / o Afección Los términos “dolencia” y / o “afección” se entenderán como sinónimos de “enfermedad” a todos");
				writer.AppendLine("los efectos en las presentes Condiciones Generales.Enfermedad Aguda Proceso corto y relativamente severo de alteración del estado del cuerpo o alguno de sus");
				writer.AppendLine("órganos que pudiera interrumpir o alterar el equilibrio de las funciones vitales, pudiendo provocar dolor, debilidad u");
				writer.AppendLine("otra manifestación extraña al comportamiento normal del mismo.No incluye pre existencias ni exclusiones incluidas");
				writer.AppendLine("en las presentes condiciones generales.Enfermedad Repentina o Imprevista Enfermedad pronta, impensada, no prevista, contraída con posterioridad a la");
				writer.AppendLine("fecha de inicio de vigencia de la Tarjeta EUROAMERICAN ASSISTANCE o a la fecha de inicio de viaje, la que sea");
				writer.AppendLine("posterior.No incluye pre existencias ni exclusiones incluidas en las presentes condiciones generales.");
				writer.AppendLine("Monto Fijo Deducible El monto fijo y determinado que será a cargo del Titular y deberá ser abonado por éste al");
				writer.AppendLine("momento de brindársele la primera asistencia, en concepto de pago inicial obligatorio por los gastos que dicha");
				writer.AppendLine("asistencia origine.</p><p align='justify'> Monto Máximo Global La suma de gastos que EUROAMERICAN ASSISTANCE abonará y / o reembolsará al Titular");
				writer.AppendLine("por todo concepto y por todos los servicios brindados en virtud de las presentes Condiciones Generales.");
				writer.AppendLine("Preexistente Todo proceso fisiopatológico que reconozca un origen o etiología anterior a la fecha de inicio de la");
				writer.AppendLine("vigencia de la Tarjeta o del viaje(la que sea posterior) y que sea factible de ser objetivado a través de métodos");
				writer.AppendLine("complementarios de diagnóstico de uso habitual, cotidiano, accesible y frecuente en todos los países del mundo");
				writer.AppendLine("(incluyendo, pero no limitado a: Doppler, Resonancia Nuclear Magnética, Cateterismo, CT Scan, etc.) Recurrente");
				writer.AppendLine("Regreso de la misma enfermedad luego de haber sido tratada.Usualmente, 3 o más veces durante un año");
				writer.AppendLine("calendario.Tarjeta La credencial que se entrega al Titular antes de su viaje y que contiene su nombre completo y el");
				writer.AppendLine("número, vigencia y tipo del Plan EUROAMERICAN ASSISTANCE contratado.Durante el viaje debe llevarla siempre");
				writer.AppendLine("con usted.</p><p align='justify'> Titular La persona que figura en el “voucher” como beneficiaria de los servicios descritos en el contrato de adhesión");
				writer.AppendLine("formalizado, integrado por dicho voucher más las Condiciones Generales y particulares adjuntas al mismo.");
				writer.AppendLine("Voucher El documento que se entrega al Titular antes de su viaje y que contiene(entre otras constancias) sus datos");
				writer.AppendLine("personales, el número y tipo del Plan EUROAMERICAN ASSISTANCE contratado.</p><p align='justify'>");
				writer.AppendLine("C.3.2.EXCLUSIÓN DE DOLENCIAS PREEXISTENTES Y DOLENCIAS CRÓNICAS Quedan expresamente");
				writer.AppendLine("excluidas de los servicios asistenciales de EUROAMERICAN ASSISTANCE todas las dolencias crónicas o");
				writer.AppendLine("preexistentes o congénitas o recurrentes, conocidas o no por el Titular, como también sus consecuencias y");
				writer.AppendLine("agudizaciones, aun cuando las mismas aparezcan por primera vez durante el viaje.ALGUNOS PRODUCTOS");
				writer.AppendLine("EUROAMERICAN ASSISTANCE INCLUYEN BENEFICIOS EN CASO DE DOLENCIAS CRÓNICAS O PREEXISTENTES VERIFIQUE EN E.CONDICIONES PARTICULARES LAS CARACTERÍSTICAS EL PRODUCTO");
				writer.AppendLine("EUROAMERICAN ASSISTANCE ADQUIRIDO POR USTED.</p><p align='justify'> C.3.1.ASISTENCIA MÉDICA EUROAMERICAN ASSISTANCE pone a disposición del Titular su red mundial de");
				writer.AppendLine("Asistencia a través de sus Centrales de Asistencia.El titular deberá comunicarse telefónicamente y / o por otros");
				writer.AppendLine("medios virtuales con una central EUROAMERICAN ASSISTANCE para todo caso de enfermedad, accidente o");
				writer.AppendLine("emergencia para el cual necesite asistencia.EUROAMERICAN ASSISTANCE brindará al Titular las condiciones para");
				writer.AppendLine("su oportuna atención, sea remitiendo al profesional en cada caso o autorizando la atención en uno de los Centros");
				writer.AppendLine("Asistenciales u hospitales disponibles en el área de ocurrencia del evento cuya asistencia se solicita.El Titular se");
				writer.AppendLine("obliga a dar aviso a EUROAMERICAN ASSISTANCE tantas veces como asistencias requiera.A partir de la primera");
				writer.AppendLine("asistencia o servicio prestado, el Titular deberá siempre comunicarse con EUROAMERICAN ASSISTANCE para");
				writer.AppendLine("obtener la autorización de primera asistencia o nuevas asistencias o servicios originados en la misma causa que el");
				writer.AppendLine("primer evento.En caso el titular requiera asistencia por accidente y este sea en lugar público, tal como: Aeropuerto,");
				writer.AppendLine("estación de buses o trenes, centros comerciales, centros médicos, etc., es necesario presentar el parte policial o");
				writer.AppendLine("parte de la incidencia(expedida por el lugar público), esto para determinar el causante del accidente y aplicar a favor");
				writer.AppendLine("del titular los seguros y / o responsabilidad correspondiente del causante del accidente.En estos casos");
				writer.AppendLine("EUROAMERICAN ASSISTANCE solo será un enlace entre el titular y dicho responsable, mas no asumirá");
				writer.AppendLine("responsabilidad alguna en ese evento.</p> C.6.OBLIGACIONES DEL TITULAR <p align='justify'>");
				writer.AppendLine("En todos los casos para todos los servicios, el Titular se ve obligado a:");
				writer.AppendLine("C.6.1 AUTORIZACIÓN PREVIA Solicitar y Recibir la autorización de un Central EUROAMERICAN ASSISTANCE");
				writer.AppendLine("antes de tomar cualquier iniciativa o comprometer cualquier gasto, de acuerdo al procedimiento indicado en las");
				writer.AppendLine("cláusulas A - INSTRUCCIONES PARA UTILIZAR CORRECTAMENTE LOS SERVICIOS EUROAMERICAN");
				writer.AppendLine("ASSISTANCE.El no cumplimiento de este procedimiento exonera en forma inmediata a EUROAMERICAN");
				writer.AppendLine("ASSISTANCE de toda obligación y responsabilidad.</p> C.6.2 OBLIGATORIEDAD DE INFORMAR DENTRO DE LAS 24 HS.");
				writer.AppendLine("<p align='justify'> C.6.2.1 Si fuera imposible en una emergencia comunicarse con una Central EUROAMERICAN ASSISTANCE para");
				writer.AppendLine("solicitar la autorización previa arriba mencionada, el Titular podrá recurrir al servicio médico de emergencia más");
				writer.AppendLine("próximo al lugar donde se encuentre.En todos estos casos el Titular deberá comunicar a EUROAMERICAN");
				writer.AppendLine("ASSISTANCE la emergencia sufrida y la asistencia recibida desde el lugar de ocurrencia, lo antes posible y siempre");
				writer.AppendLine("dentro de las 24hs.de producido el evento, en cuyo caso deberá proveer las constancias y comprobantes originales");
				writer.AppendLine("que justifiquen tal situación.El no cumplimiento de 26 esta norma exonera a EUROAMERICAN ASSISTANCE de toda");
				writer.AppendLine("obligación y responsabilidad.</p><p align='justify'> C.6.2.2 Previa evaluación del caso y una vez descartadas posibles exclusiones, EUROAMERICAN ASSISTANCE");
				writer.AppendLine("tomara a cargo los gastos producidos por la asistencia hasta los montos establecidos para la asistencia brindada,");
				writer.AppendLine("según el Plan EUROAMERICAN ASSISTANCE adquirido y siempre que los valores se ajusten a los de uso habitual");
				writer.AppendLine("en el país o región donde se produjo el evento.No se efectuará ningún reembolso de gastos devengados en");
				writer.AppendLine("situación de emergencia, si no se diera estricto cumplimiento al procedimiento indicado en las presentes");
				writer.AppendLine("Instrucciones de utilización de los servicios EUROAMERICAN ASSISTANCE.</p><p align='justify'>");
				writer.AppendLine("C.6.3 PROVISIÓN DE DOCUMENTACIÓN El Titular deberá proveer a EUROAMERICAN ASSISTANCE toda la");
				writer.AppendLine("documentación que permita establecer la procedencia del caso, además de todos los comprobantes originales de");
				writer.AppendLine("gastos reembolsables por EURIOAMERICAN ASSISTANCE y toda la información médica, inclusive al anterior del");
				writer.AppendLine("viaje, o de cualquier índole que eventualmente le sea necesaria a EUROAMERICAN ASSISTANCE para la");
				writer.AppendLine("presentación de sus servicios, incluyendo indefectiblemente el informe médico original detallado del centro médico");
				writer.AppendLine("correspondiente.</p><p> C.4.12.7.Deportes Las asistencias que puedan ocurrir a consecuencia de entrenamiento, práctica(entrenamiento y / o");
				writer.AppendLine("pasatiempo), o participación activa en toda clase de competencias deportivas(profesional o amateur).Además,");
				writer.AppendLine("quedan expresamente excluidas las asistencias que puedan ocurrir a consecuencia de la práctica de deportes");
				writer.AppendLine("peligrosos o de alto riesgo, incluyendo, pero no limitado a: motociclismo, boxeo, polo, ski acuático, jet ski, wave");
				writer.AppendLine("runner, moto de nieve, cuadriciclos, vehículos todo terreno, snowboard, skate, parasail, rafting, buceo, aladeltismo,");
				writer.AppendLine("alpinismo, surf, windsurf, mountain bike, down hill, etc.Asimismo, quedan excluidas las asistencias que puedan");
				writer.AppendLine("ocurrir como consecuencia de la práctica de ski y / u otros deportes invernales no mencionados en el párrafo anterior");
				writer.AppendLine("fuera de pistas reglamentarias y autorizadas.</p><p align='justify'> D.1.2.2 EXTRAVÍO DEL EQUIPAJE Extravió del equipaje(bulto completo) durante transporte internacional");
				writer.AppendLine("(entiéndase por internacional de país a país) en avión de línea aérea regular(de itinerario publicados, no aplican");
				writer.AppendLine("vuelos charter o fletados), y despachado en la bodega del mismo.</p><p align='justify'> D.4.8.REEMBOLSOS EUROAMERICAN ASSISTANCE resarcirá al Titular en la misma moneda en que este hubiera");
				writer.AppendLine("pagado el viaje, en un todo de acuerdo con la información obrante en los recibos otorgados por la agencia.De existir");
				writer.AppendLine("impedimentos legales para efectuar los pagos en moneda extranjera, estos se efectuarán en moneda local tomando");
				writer.AppendLine("como cambio el oficial tipo vendedor del día anterior al pago.</p> ");

				writer.AppendLine("</td>");
				writer.AppendLine("</tr>");
			} else if (membrete == 4) {
				writer.AppendLine("<td colspan='2' style='text- align:left ;padding:2px 10px 2px 10 px;font -size: 85%;'>");
				writer.AppendLine("<h4>SUMMARY OF GENERAL CONDITIONS:</h4><p align='justify'>This document is a summary of the clauses in the full text of the General Conditions that govern the provision of travel assistance services and is intended to be a quick reference for the user. However,");
				writer.AppendLine("does not replace or modify these conditions and in any dispute only the text of the");
				writer.AppendLine("Complete General Conditions delivered and/or made available to you on our page <a href='www.euroamericanassistance.com'>www.euroamericanassistance.com</a>");
				writer.AppendLine("Remember that each product has a different combination of benefits and maximum amounts. Please,");
				writer.AppendLine("Please refer to your voucher for the benefits table for the product you purchased to learn about applicable benefits.");
				writer.AppendLine("Any assistance or reimbursement of expenses is subject to the Owner acting in accordance with the Terms and Conditions");
				writer.AppendLine(" General.< /p> A.1. 1.VERIFICATION <p align='justify'> Verify that all the data assigned in your EUROAMERICAN ASSISTANCE voucher and card are correct.");
				writer.AppendLine("Please check the phone numbers listed as emergency contacts, as well as the dates");
				writer.AppendLine("Validity and the plan purchased. If there are errors in the data, contact the office, EUROAMERICAN");
				writer.AppendLine("ASSISTANCE in the country of card issue to rectify the same </p>");
				writer.AppendLine("<p align='justify'> Carefully read the General Instructions and Conditions of the EUROAMERICAN ASSISTANCE services.");
				writer.AppendLine("C.1. 9. Under no circumstances will cancellations, annulments or modifications be accepted once the Plan has become valid");
				writer.AppendLine("EUROAMERICAN ASSISTANCE.The validity of a card starts at zero hours, zero minutes and one second of the day");
				writer.AppendLine("which appears in the start of validity box of the EUROAMERICAN ASSISTANCE card.< /p>");
				writer.AppendLine("C.2.DEFINITIONS <p align='justify'>");
				writer.AppendLine("For all interpretive purposes, it is expressly stated that in these Instructions for use of the");
				writer.AppendLine("EUROAMERICAN ASSISTANCE services and in the General Conditions of EUROAMERICAN services");
				writer.AppendLine("ASSISTANCE” means: 		Accident The event that causes bodily harm suffered by the Holder, caused by external agents, outside of");
				writer.AppendLine("control and in motion, external, violent and visible. Whenever the term “accident” is mentioned it will be understood");
				writer.AppendLine("that the resulting injury or illness was directly caused by such agents and independently of any");
				writer.AppendLine("other cause.< /p><p align='justify'>");
				writer.AppendLine("Operational Center The office that coordinates the provision of services required by the owner due to his");
				writer.AppendLine(" assistance.Exceptional Circumstances All those extraordinary situations of infrequent presentation, indicated in the");
				writer.AppendLine("Clause C.8.of these General Conditions.Congenital Present or existing since before the moment of birth.");
				writer.AppendLine("Chronic Any pathological process that is continuous and persistent over time, lasting more than 30 days. Department");
				writer.AppendLine("Medical Group of health professionals providing supervision, control and/or coordination services for");
				writer.AppendLine("EUROAMERICAN ASSISTANCE intervenes and decides on all matters and/or services provided to or");
				writer.AppendLine("provided under these Terms and Conditions and which are directly or indirectly related to");
				writer.AppendLine("medical topics .< /p><p align='justify'> Ailment and/or Condition The terms “ailment” and/or “condition” shall be understood as synonyms for “disease” to all");
				writer.AppendLine("the effects on these General Conditions. Acute Disease A short and relatively severe process of alteration of the state of the body or one of its");
				writer.AppendLine("organs that could interrupt or alter the balance of vital functions, which could cause pain, weakness or");
				writer.AppendLine("another manifestation strange to the normal behavior of the same. Does not include pre-existing or included exclusions");
				writer.AppendLine("in these general conditions . Sudden or Unforeseen Illness: Immediate, unexpected, unforeseen illness contracted after the");
				writer.AppendLine("Euroamerican Assistance Card validity start date or travel start date, whichever is");
				writer.AppendLine(" subsequent.Does not include pre-existing conditions or exclusions included in these general conditions.");
				writer.AppendLine("Fixed Deductible Amount The fixed and determined amount that will be the responsibility of the Holder and must be paid by him to");
				writer.AppendLine("at the time of providing the first assistance, as a mandatory initial payment for the expenses of said");
				writer.AppendLine("assistance origine.< /p><p align='justify'> Maximum Global Amount The sum of expenses that EUROAMERICAN ASSISTANCE will pay and/or reimburse the Holder");
				writer.AppendLine("for all purposes and for all services provided under these General Conditions.");
				writer.AppendLine("Preexisting Any pathophysiological process that recognizes an origin or etiology prior to the start date of the");
				writer.AppendLine("validity of the Card or the trip ( whichever is later) and that can be objectified through methods");
				writer.AppendLine("diagnostic supplements for common, everyday, accessible and frequent use in all countries of the world");
				writer.AppendLine("(including, but not limited to: Doppler, MRI, Catheterization, CT Scan, etc.) Recurrent");
				writer.AppendLine("Return of the same disease after treatment. Usually 3 or more times a year");
				writer.AppendLine(" calendar.Card The credential that is given to the Cardholder before their trip and that contains their full name and the");
				writer.AppendLine("number, validity and type of the EUROAMERICAN ASSISTANCE Plan contracted. You must always carry it during the trip");
				writer.AppendLine("with you.< /p><p align='justify'> Holder The person listed on the voucher as the beneficiary of the services described in the membership contract");
				writer.AppendLine("formalized, consisting of said voucher plus the General and specific Conditions attached to it.");
				writer.AppendLine("Voucher The document that is given to the Holder before his trip and that contains ( among other documents) his data");
				writer.AppendLine("personal, the number and type of the EUROAMERICAN ASSISTANCE Plan contracted.< /p><p align='justify'>");
				writer.AppendLine("C.3. 2.EXCLUSION OF PRE-EXISTING CONDITIONS AND CHRONIC CONDITIONS Are expressly");
				writer.AppendLine("all chronic or chronic ailments are excluded from EUROAMERICAN ASSISTANCE's assistance services");
				writer.AppendLine("pre-existing or congenital or recurrent, known or unknown to the Holder, as well as their consequences and");
				writer.AppendLine("exacerbations, even if they appear for the first time during the trip.SOME PRODUCTS");
				writer.AppendLine("EUROAMERICAN ASSISTANCE INCLUDES BENEFITS IN CASE OF CHRONIC OR PRE-EXISTING CONDITIONS. CHECK THE PRODUCT'S FEATURES IN E.SPECIAL CONDITIONS ");
				writer.AppendLine("EUROAMERICAN ASSISTANCE PURCHASED BY YOU.< /p><p align='justify'> C.3. 1.MEDICAL ASSISTANCE EUROAMERICAN ASSISTANCE makes its worldwide network available to the Holder");
				writer.AppendLine("Assistance through your Help Centers. The owner must communicate by phone and/or through others");
				writer.AppendLine("virtual media with a EUROAMERICAN ASSISTANCE center for any case of illness, accident or");
				writer.AppendLine("emergency for which assistance is needed.EUROAMERICAN ASSISTANCE will provide the Holder with the conditions for");
				writer.AppendLine("your timely attention, either by referring to the professional in each case or by authorizing care at one of the Centers");
				writer.AppendLine("Assistance services or hospitals available in the area where the event whose assistance is requested occurs . The Holder will");
				writer.AppendLine("requires giving notice to EUROAMERICAN ASSISTANCE as many times as assistance is required. Starting from the first");
				writer.AppendLine("assistance or service provided, the Holder must always contact EUROAMERICAN ASSISTANCE for");
				writer.AppendLine("obtain authorization for first aid or new aid or services arising from the same cause as the");
				writer.AppendLine("first event. In case the owner requires assistance due to an accident and this is in a public place, such as: Airport,");
				writer.AppendLine("bus or train stations, shopping centers, medical centers, etc., it is necessary to present the police report or");
				writer.AppendLine("part of the incident ( issued by the public place), this to determine the cause of the accident and apply in favor");
				writer.AppendLine("the insurance holder and/or the corresponding liability of the person who caused the accident. In these cases");
				writer.AppendLine("EUROAMERICAN ASSISTANCE will only be a link between the owner and said responsible party, but will not assume");
				writer.AppendLine("any liability in that event.< /p> C.6. OBLIGATIONS OF THE HOLDER <p align='justify'>");
				writer.AppendLine("In all cases for all services, the Owner is obliged to:");
				writer.AppendLine("C.6.1 PRIOR AUTHORIZATION Request and Receive authorization from a EUROAMERICAN ASSISTANCE Central");
				writer.AppendLine("before taking any initiative or committing any expense, in accordance with the procedure indicated in the");
				writer.AppendLine("clauses A - INSTRUCTIONS FOR THE CORRECT USE OF EUROAMERICAN SERVICES");
				writer.AppendLine("ASSISTANCE.Failure to comply with this procedure immediately exonerates EUROAMERICAN");
				writer.AppendLine("ASSISTANCE of all obligations and responsibilities.< /p> C.6.2 OBLIGATION TO REPORT WITHIN 24 HOURS.");
				writer.AppendLine("<p align='justify'> C.6.2.1 If it is impossible in an emergency to communicate with a EUROAMERICAN ASSISTANCE Central for");
				writer.AppendLine("request the above-mentioned prior authorization, the Holder may resort to emergency medical service");
				writer.AppendLine("close to the place where you are. In all these cases the Owner must notify EUROAMERICAN");
				writer.AppendLine("ASSISTANCE the emergency suffered and the assistance received from the place of occurrence, as soon as possible and always");
				writer.AppendLine("within 24 hours of the event, in which case you must provide the original documents and receipts");
				writer.AppendLine("that justify such situation . Failure to comply with this rule exonerates EUROAMERICAN ASSISTANCE from all");
				writer.AppendLine("obligation and responsibility.< /p><p align='justify'> C.6.2.2 After evaluating the case and once possible exclusions have been ruled out, EUROAMERICAN ASSISTANCE");
				writer.AppendLine("will take charge of the expenses incurred by the assistance up to the amounts established for the assistance provided,");
				writer.AppendLine("according to the EUROAMERICAN ASSISTANCE Plan purchased and provided that the values are in line with those in regular use");
				writer.AppendLine("in the country or region where the event occurred. No reimbursement will be made for expenses incurred in");
				writer.AppendLine("emergency situation, if the procedure indicated herein is not strictly followed");
				writer.AppendLine("Instructions for using EUROAMERICAN ASSISTANCE services .< /p><p align='justify'>");
				writer.AppendLine("C.6.3 PROVISION OF DOCUMENTATION The Holder must provide EUROAMERICAN ASSISTANCE with all the");
				writer.AppendLine("documentation that allows establishing the origin of the case, in addition to all original receipts of");
				writer.AppendLine("expenses reimbursable by EURIOAMERICAN ASSISTANCE and all medical information, including the above");
				writer.AppendLine("travel, or any other type of assistance that may eventually be necessary for EUROAMERICAN ASSISTANCE");
				writer.AppendLine("presentation of your services, including the original detailed medical report from the medical center");
				writer.AppendLine(" corresponding.< /p><p> C.4.12. 7.Sports Assistance that may occur as a result of training, practice ( coaching and/or");
				writer.AppendLine("hobby), or active participation in all kinds of sports competitions ( professional or amateur ). In addition , ");
				writer.AppendLine("Assistance that may occur as a result of playing sports is expressly excluded");
				writer.AppendLine("dangerous or high-risk, including but not limited to: motorcycling, boxing, polo, water skiing, jet skiing, wave");
				writer.AppendLine("runner, snowmobile, ATV, snowboard, skateboard, parasail, rafting, scuba diving, hang gliding,");
				writer.AppendLine("mountaineering, surfing, windsurfing, mountain biking, downhill, etc. Likewise, any assistance that may be provided is excluded");
				writer.AppendLine("occur as a result of skiing and/or other winter sports not mentioned in the preceding paragraph");
				writer.AppendLine("outside of authorized and regulatory runways.< /p><p align='justify'> D.1.2.2 LOSS OF LUGGAGE Loss of luggage ( full package) during international transport");
				writer.AppendLine("(understand as international from country to country) on a regular airline ( published itinerary, do not apply");
				writer.AppendLine("charter or chartered flights), and dispatched in the hold of the same.< /p><p align='justify'> D.4. 8.REIMBURSEMENTS EUROAMERICAN ASSISTANCE will reimburse the Holder in the same currency in which he/she had");
				writer.AppendLine("trip paid, in full accordance with the information contained in the receipts provided by the agency. If applicable");
				writer.AppendLine("legal impediments to making payments in foreign currency, these will be made in local currency taking");
				writer.AppendLine("how did the official type seller change from the day before payment.< /p> ");

			}
			writer.AppendLine("</table>");
			writer.AppendLine("</div>");
			writer.AppendLine("</body>");
			writer.AppendLine("</html>");
			return writer.ToString();
		}
        [HttpPost]
        [Route("LiquidacionGenerarExcel")]
        public async Task<FileStreamResult> exportLiquidacion([FromBody] BELiquidacionExportar pLiquidacionExportar)
        {
            var listaDatos = pLiquidacionExportar;
            var codigos = pLiquidacionExportar.CodigoTarjeta;
            var agencia = pLiquidacionExportar.CodigoAgencia;
            var situacion = pLiquidacionExportar.CodigoMotivo;
            var formula = pLiquidacionExportar.formula; //1 Desglose Regular |2 Plan B | 3 Full
            bool blnTieneDescuento = pLiquidacionExportar.DescuentoPorcentaje > 0;
            // Si hay descuento, se agrega la columna "DESCUENTO" en S y "A PAGAR"/"DESTINO" se corren a T/U
            string colPagar = blnTieneDescuento ? "T" : "S";
            string colDestino = blnTieneDescuento ? "U" : "T";

            int elcodigVenta1 = Int32.Parse(codigos!.Split(",")[0]);

            var memoryStream = new MemoryStream();
            var oAgencia = await AgenciaVenta_Obtener(elcodigVenta1);
            var oResultado = await VentaEspecificas_Obtener(codigos, situacion);
            var oCodigoLiquidacion = await LiquidacionCodigo_Obtener();

            var oDescuentos = await VentaDescuentos_Obtener(codigos);

            XLWorkbook workbook = new XLWorkbook();
            // Definimos las propiedades del documento
            workbook.Properties.Author = "EuroAmericanAssistance";
            workbook.Properties.Title = "Documento de Cobranza";
            workbook.Properties.Subject = "Documento de Cobranza";
            workbook.Properties.Comments = "Documento de Cobranza generado automaticamente desde el sistema de gestion de EUROAMERICAN.";
            // Seleccionamos el primero worksheet del workbook
            var worksheet = workbook.Worksheets.Add(); ;
            // Nombramos el primer worksheet
            worksheet.Name = "Cobranza";
            worksheet.ShowGridLines = false;
            // Propiedades del worksheet
            worksheet.PageSetup.PaperSize = XLPaperSize.A4Paper;
            worksheet.PageSetup.PageOrientation = XLPageOrientation.Portrait;
            {
                var withBlock = worksheet.PageSetup;
                withBlock.PagesTall = 1;
                withBlock.PagesWide = 1;
            }
            // Margenes de pagina Estrecho
            worksheet.PageSetup.Margins.Left = 0.3;
            worksheet.PageSetup.Margins.Right = 0.3;
            worksheet.PageSetup.Margins.Top = 1;
            worksheet.PageSetup.Margins.Bottom = 1;
            worksheet.PageSetup.Margins.Header = 0.3;
            worksheet.PageSetup.Margins.Footer = 0.3;

            // Aplicando estilo de letra a todo el documento

            var estiloCabeceraInfo = workbook.Style;
            estiloCabeceraInfo.Font.FontName = "Calibri";
            estiloCabeceraInfo.Font.Bold = true;
            estiloCabeceraInfo.Font.FontSize = 9;
            estiloCabeceraInfo.Alignment.Horizontal = XLAlignmentHorizontalValues.Center;
            estiloCabeceraInfo.Alignment.Vertical = XLAlignmentVerticalValues.Center;

            worksheet.Range("H1:H6").Style = estiloCabeceraInfo;

            var estiloCabeceraDoc = workbook.Style;
            estiloCabeceraDoc.Font.FontName = "Calibri";
            estiloCabeceraDoc.Font.Bold = true;
            estiloCabeceraDoc.Font.FontSize = 12;
            estiloCabeceraDoc.Alignment.Horizontal = XLAlignmentHorizontalValues.Center;
            estiloCabeceraDoc.Alignment.Vertical = XLAlignmentVerticalValues.Center;

            var estiloCabeceraCli = workbook.Style;
            estiloCabeceraCli.Font.FontSize = 11;
            estiloCabeceraCli.Font.Bold = true;
            estiloCabeceraCli.Font.FontName = "Calibri";
            estiloCabeceraCli.Alignment.Horizontal = XLAlignmentHorizontalValues.Center;
            estiloCabeceraCli.Alignment.Vertical = XLAlignmentVerticalValues.Center;
            //Estilo de los titulos
            worksheet.Range("A11:A14").Style = estiloCabeceraCli;
            worksheet.Range("E13:E14").Style = estiloCabeceraCli;
            worksheet.Range("H2:I7").Style = estiloCabeceraCli;
            worksheet.Cell("F11").Style = estiloCabeceraCli;

            var estiloCabeceraDatos = workbook.Style;
            estiloCabeceraDatos.Font.FontSize = 11;
            estiloCabeceraDatos.Font.Bold = false;
            estiloCabeceraDatos.Font.FontName = "Calibri";
            estiloCabeceraDatos.Alignment.Horizontal = XLAlignmentHorizontalValues.Left;
            estiloCabeceraDatos.Alignment.Vertical = XLAlignmentVerticalValues.Center;
            estiloCabeceraDatos.Border.BottomBorderColor = XLColor.Black;
            estiloCabeceraDatos.Border.BottomBorder = XLBorderStyleValues.Medium;
            //Estilo de los textos
            worksheet.Range("B11:B11").Style = estiloCabeceraDatos;
            worksheet.Range("B12:F12").Style = estiloCabeceraDatos;
            worksheet.Range("B13:C13").Style = estiloCabeceraDatos;
            worksheet.Range("B14:D14").Style = estiloCabeceraDatos;
            worksheet.Cell("F11").Style = estiloCabeceraDatos;
            worksheet.Cell("F14").Style = estiloCabeceraDatos;

            //FILA 11  - INI
            worksheet.Cell("A11").Value = "Señor(es): ";
            worksheet.Range("B11:D11").Merge();
            worksheet.Cell("B11").Value = oAgencia[0].agenciaNombre!.ToUpper();

            worksheet.Cell("E11").Value = "Cod. Liq: ";
            worksheet.Cell("F11").Value = oCodigoLiquidacion[0].correlativoUltimoGenerado;
            //FILA 11  - FIN
            //FILA 12  - INI
            worksheet.Cell("A12").Value = "Dirección: ";
            worksheet.Range("B12:F12").Merge();
            worksheet.Cell("B12").Value = oAgencia[0].agenciaDireccion!.ToUpper();
            //FILA 12  - FIN
            //FILA 13  - INI
            worksheet.Cell("A13").Value = "R.U.C.: ";
            worksheet.Range("B13:C13").Merge();
            worksheet.Cell("B13").Value = oAgencia[0].agenciaRUC;

            worksheet.Cell("E13").Value = "Promotor: ";
            worksheet.Cell("F13").Value = oAgencia[0].agenciaPromotorNombre!.ToUpper();
            //FILA 13  - FIN
            //FILA 14  - INI
            worksheet.Cell("A14").Value = "Obs.Cob.: ";
            worksheet.Cell("B14").Value = oAgencia[0].agenciaObservacionCobranzas?.ToUpper() ?? "";

            worksheet.Cell("E14").Value = "Com: ";
            worksheet.Cell("F14").Value = oAgencia[0].agenciaComision + "%";
            //FILA 14  - FIN

            if (formula == 2)
            {
                // PLAN B
                worksheet.Columns("M:M").Hide();
                worksheet.Columns("N:N").Hide();
                worksheet.Columns("O:O").Hide();
            }
            else
            {
                if (formula == 3)
                {
                    //FULL
                    worksheet.Columns("M:M").Hide();
                    worksheet.Columns("N:N").Hide();
                    worksheet.Columns("O:O").Hide();
                    worksheet.Columns("P:P").Hide();
                    worksheet.Columns("Q:Q").Hide();
                }
            }
            worksheet.Columns("R:R").Hide();

            // Definir Tamaño filas y columnas
            worksheet.Column("A").Width = 20;
            worksheet.Column("B").Width = 19;
            worksheet.Column("C").Width = 12;
            worksheet.Column("D").Width = 12;
            worksheet.Column("E").Width = 12;
            worksheet.Column("F").Width = 31;
            worksheet.Column("G").Width = 11;
            worksheet.Column("H").Width = 31;
            worksheet.Column("I").Width = 31;
            worksheet.Column("J").Width = 12;
            worksheet.Column("K").Width = 12;
            worksheet.Column("L").Width = 15;
            worksheet.Column("M").Width = 20;
            worksheet.Column("N").Width = 20;
            worksheet.Column("O").Width = 20;
            worksheet.Column("P").Width = 20;
            worksheet.Column("Q").Width = 20;
            worksheet.Column("R").Width = 20;
            worksheet.Column("S").Width = 20;
            worksheet.Column(colPagar).Width = 20;
            worksheet.Column(colDestino).Width = 30;

            Stream streamLogo = await RetornarStreamImageLogo("logos/logo.png");
            worksheet.AddPicture(streamLogo).MoveTo(worksheet.Cell("B2"));
            worksheet.Cell("H2").Value = "United Assistance S.A.C";
            worksheet.Cell("H3").Value = "Av. Ricardo Palma 341 OF. 902 - Miraflores - Lima - Perú";
            worksheet.Cell("H4").Value = "RUC 20513917997";
            worksheet.Cell("H5").Value = "CUENTAS CORRIENTES - UNITED ASSISTANCE SAC.";
            worksheet.Cell("H6").Value = "Banco de Crédito - Moneda extranjera N° 194-2271063-1-39  CCI : 002-1940022710631-3995";
            worksheet.Cell("H7").Value = "Banco Interbank - Moneda extranjera N° 108-300033490-0 CCI : 003-108-003000334900-85";

            // ... (estilos y headers, iguales a tu implementación original) ...


            // cabeceras detalle
            //worksheet.Range("A16:T16").Style = workbook.Style;
            var estiloDetalleTitulos = workbook.Style;
            estiloDetalleTitulos.Alignment.Horizontal = XLAlignmentHorizontalValues.Center;
            estiloDetalleTitulos.Alignment.Vertical = XLAlignmentVerticalValues.Center;
            estiloDetalleTitulos.Font.FontSize = 11;
            estiloDetalleTitulos.Font.Bold = true;
            estiloDetalleTitulos.Font.FontName = "Calibri";
            estiloDetalleTitulos.Font.FontColor = XLColor.White;
            estiloDetalleTitulos.Fill.BackgroundColor = XLColor.FromArgb(226, 107, 10);
            estiloDetalleTitulos.Border.BottomBorderColor = XLColor.Black;
            estiloDetalleTitulos.Border.BottomBorder = XLBorderStyleValues.Medium;
            estiloDetalleTitulos.Border.TopBorderColor = XLColor.Black;
            estiloDetalleTitulos.Border.TopBorder = XLBorderStyleValues.Medium;
            estiloDetalleTitulos.Border.LeftBorderColor = XLColor.Black;
            estiloDetalleTitulos.Border.LeftBorder = XLBorderStyleValues.Medium;
            estiloDetalleTitulos.Border.RightBorderColor = XLColor.Black;
            estiloDetalleTitulos.Border.RightBorder = XLBorderStyleValues.Medium;
            worksheet.Range("A16:" + colDestino + "16").Style = estiloDetalleTitulos;

            int intInicioRegistroInicio = 17;
            int intInicioRegistro = intInicioRegistroInicio;

            worksheet.Cell("B16").Value = "TARJETA";
            worksheet.Cell("C16").Value = "EMITIDO";
            worksheet.Cell("D16").Value = "INI VIG";
            worksheet.Cell("E16").Value = "FIN VIG";
            worksheet.Cell("F16").Value = "PRODUCTO";
            worksheet.Cell("G16").Value = "DOC TIPO";
            worksheet.Cell("H16").Value = "DOC NUMERO";
            worksheet.Cell("I16").Value = "PASAJERO";
            worksheet.Cell("J16").Value = "DIAS";
            worksheet.Cell("K16").Value = "EDAD";
            worksheet.Cell("L16").Value = "TOTAL";
            worksheet.Cell("M16").Value = "NETA";
            worksheet.Cell("N16").Value = "COMISION " + oAgencia[0].agenciaComision + "%";
            worksheet.Cell("O16").Value = "IGV 18%";
            if (formula == 2)
            {
                worksheet.Cell("P16").Value = "COMISION " + oAgencia[0].agenciaComision + "%";
            }
            else
            {
                worksheet.Cell("P16").Value = "TOTAL COMISION ";
            }
            worksheet.Cell("Q16").Value = "INC.";
            worksheet.Cell("R16").Value = "PUB.";
            if (blnTieneDescuento)
            {
                worksheet.Cell("S16").Value = "DESCUENTO";
            }
            worksheet.Cell(colPagar + "16").Value = "A PAGAR";
            worksheet.Cell(colDestino + "16").Value = "DESTINO";
            worksheet.Cell("A16").Value = "COD.EXTERNO";

            double dblAcumulaTotal = 0, dblAcumulaComision = 0, dblAcumulaPagar = 0, dblAcumulaSubTotal = 0;
            double dblinc = 0, dblPubl = 0;
            double dblVentaPaisImpuesto = 0, dblVentaPaisImpuestoVenta = 0;
            double dblSubTotal = 0, dblTarifa = 0, dblNeto = 0, dblComision = 0, dblIGV = 0, dblComisionEUA = 0, dblIGV_EUA = 0;
            double dblIncentivo = 0, publicidad = 0, dblTotalPagar = 0, TotalComision = 0, dblIgvInterno = 0;
            double dblDescuentoPorcentaje = (double)pLiquidacionExportar.DescuentoPorcentaje, dblDescuentoImporte = 0, dblDescuentoImporteAcumula = 0;
            float dblDescuento = 0, dblTarifaDescuento = 0;

            // Lista per processare le liquidazioni dopo aver generato e salvato l'Excel
            var pendingLiquidaciones = new List<(int ventaId, double totalComision, double incentivo, double publicidad, int usuarioId, int formula, float dec_pDescuento, double pago, int codLiquidacion)>();

            foreach (BEVenta item in oResultado)
            {
                dblIncentivo = item.VentaIncentivoTarifa;
                publicidad = item.VentaPublicidadTarifa;
                dblVentaPaisImpuesto = 0.01770;
                dblVentaPaisImpuestoVenta = 0.18000;

                dblComision = oAgencia[0].agenciaComision;

                dblTarifa = item.ventaImporteVenta;
                dblDescuento = item.ventaDescuentoImporte;
                dblIGV_EUA = dblTarifa * dblVentaPaisImpuesto;

                //Calcular Sub Total
                dblSubTotal = dblTarifa - dblIGV_EUA;

                if (formula == 1)
                {
                    dblComisionEUA = dblSubTotal * 0.1;
                    dblNeto = dblSubTotal * (dblComision / 100);
                    dblIGV = dblNeto * dblVentaPaisImpuestoVenta;
                    TotalComision = dblNeto + dblIGV;
                    if (dblIncentivo > 0)
                    {
                        dblTotalPagar = dblTarifa - TotalComision - dblIncentivo;
                    }
                    else
                    {
                        dblTotalPagar = dblTarifa - TotalComision;
                    }
                }
                else if (formula == 2)
                {
                    dblNeto = dblTarifa - dblIGV_EUA;
                    dblComisionEUA = dblNeto * (dblComision / 100);
                    dblIgvInterno = (dblTarifa - dblComisionEUA) * 0.10;
                    dblIGV = dblIgvInterno * 0.18;
                    TotalComision = dblComisionEUA - dblIGV;
                    if (dblIncentivo > 0)
                    {
                        dblTotalPagar = (dblTarifa - dblComisionEUA) + dblIGV - dblIncentivo;
                    }
                    else
                    {
                        dblTotalPagar = (dblTarifa - dblComisionEUA) + dblIGV;
                    }
                }
                else
                {
                    // Full
                    publicidad = 0;
                    dblIncentivo = 0;
                    TotalComision = 0;
                    dblTotalPagar = dblTarifa;
                }
                dblTotalPagar = dblTotalPagar - publicidad;

                double dblTarifaConDescuento = dblTarifa;
                if (dblDescuentoPorcentaje > 0)
                {
                    // El descuento se calcula sobre el total a pagar pero se aplica a la columna "Total" (L),
                    // no reduce el monto "A PAGAR" a la agencia.
                    dblDescuentoImporte = dblTotalPagar * (dblDescuentoPorcentaje / 100);
                    dblTarifaConDescuento = dblTarifa - dblDescuentoImporte;
                    dblDescuentoImporteAcumula += dblDescuentoImporte;
                }

                dblAcumulaSubTotal += dblSubTotal;
                dblAcumulaTotal += dblTarifaConDescuento;
                dblAcumulaComision += TotalComision;
                dblAcumulaPagar += dblTotalPagar;
                dblTarifaDescuento += dblDescuento;

                // Scrivo usando i valori calcolati (snapshot)
                worksheet.Cell("B" + intInicioRegistro).Value = item.ventaId;
                worksheet.Cell("C" + intInicioRegistro).Value = item.ventaCreadoFecha.ToString("dd/MM/yyyy");
                worksheet.Cell("D" + intInicioRegistro).Value = item.ventaFechaVigenciaInicio.ToString("dd/MM/yyyy");
                worksheet.Cell("E" + intInicioRegistro).Value = item.ventaFechaVigenciaFin.ToString("dd/MM/yyyy");
                worksheet.Cell("F" + intInicioRegistro).Value = item.ventaProductoNombre;
                worksheet.Cell("G" + intInicioRegistro).Value = item.ventaClienteDocumentoTipoNombre;
                worksheet.Cell("H" + intInicioRegistro).Value = item.ventaClienteDocumentoNumero;
                worksheet.Cell("I" + intInicioRegistro).Value = item.ventaClienteApellidoNombre;
                worksheet.Cell("J" + intInicioRegistro).Value = item.ventaNumeroDias;
                worksheet.Cell("K" + intInicioRegistro).Value = item.ventaClienteEdad;
                worksheet.Cell("L" + intInicioRegistro).Value = dblTarifaConDescuento;

                if ((int.TryParse(User.FindFirst("PaisDocumentoFormato")?.Value, out var _fmt) ? _fmt : 0) == 2)
                {
                    worksheet.Cell("M" + intInicioRegistro).Value = dblComision;
                    worksheet.Cell("N" + intInicioRegistro).Value = item.ventaImporteVenta - (dblComision + dblIGV);
                }
                else
                {
                    worksheet.Cell("M" + intInicioRegistro).Value = dblSubTotal;
                    worksheet.Cell("N" + intInicioRegistro).Value = dblNeto;
                    worksheet.Cell("O" + intInicioRegistro).Value = dblIGV;
                    worksheet.Cell("P" + intInicioRegistro).Value = TotalComision;
                    worksheet.Cell("Q" + intInicioRegistro).Value = dblIncentivo;
                    worksheet.Cell("R" + intInicioRegistro).Value = publicidad;
                    if (blnTieneDescuento)
                    {
                        worksheet.Cell("S" + intInicioRegistro).Value = Math.Round(dblDescuentoImporte, 2);
                    }
                    worksheet.Cell(colPagar + intInicioRegistro).Value = dblTotalPagar;
                    worksheet.Cell(colDestino + intInicioRegistro).Value = item.ventaDestino;
                    worksheet.Cell("A" + intInicioRegistro).Value = item.ventaCodigoExterno;
                }

                


                // Importe de descuento a registrar en ventaDescuentoImporte: se conserva el descuento ya existente
                // de la venta (otro descuento, sin uso actual) y se le suma el descuento calculado en la liquidacion.
                float dblDescuentoAEnviar = dblDescuento + (float)Math.Round(dblDescuentoImporte, 2);

                // aggiungo alla lista di lavoro post-excel
                pendingLiquidaciones.Add((item.ventaId, TotalComision, dblIncentivo, publicidad, (int.TryParse(User.FindFirst("IdUsuario")?.Value, out var _uid) ? _uid : 0), formula, dblDescuentoAEnviar, dblTotalPagar, oCodigoLiquidacion[0].correlativoUltimoGenerado));

                intInicioRegistro++;
                dblinc += item.VentaIncentivoTarifa;
                dblPubl += publicidad;
            }

            intInicioRegistro -= 1;

            var estiloDetalleDatosCenter = workbook.Style;
            estiloDetalleDatosCenter.Alignment.Horizontal = XLAlignmentHorizontalValues.Center;
            estiloDetalleDatosCenter.Alignment.Vertical = XLAlignmentVerticalValues.Center;
            estiloDetalleDatosCenter.Font.FontSize = 10;
            estiloDetalleDatosCenter.Font.Bold = false;
            estiloDetalleDatosCenter.Font.FontName = "Calibri";
            estiloDetalleDatosCenter.Font.FontColor = XLColor.Black;
            estiloDetalleDatosCenter.Fill.BackgroundColor = XLColor.NoColor;
            estiloDetalleDatosCenter.NumberFormat.SetFormat("0");
            estiloDetalleDatosCenter.Border.BottomBorderColor = XLColor.Black;
            estiloDetalleDatosCenter.Border.BottomBorder = XLBorderStyleValues.Thin;
            estiloDetalleDatosCenter.Border.TopBorderColor = XLColor.Black;
            estiloDetalleDatosCenter.Border.TopBorder = XLBorderStyleValues.Thin;
            estiloDetalleDatosCenter.Border.LeftBorderColor = XLColor.Black;
            estiloDetalleDatosCenter.Border.LeftBorder = XLBorderStyleValues.Thin;
            estiloDetalleDatosCenter.Border.RightBorderColor = XLColor.Black;
            estiloDetalleDatosCenter.Border.RightBorder = XLBorderStyleValues.Thin;

            worksheet.Range("B" + intInicioRegistroInicio + ":B" + intInicioRegistro).Style = estiloDetalleDatosCenter;
            worksheet.Range("C" + intInicioRegistroInicio + ":C" + intInicioRegistro).Style = estiloDetalleDatosCenter;
            worksheet.Range("D" + intInicioRegistroInicio + ":D" + intInicioRegistro).Style = estiloDetalleDatosCenter;
            worksheet.Range("E" + intInicioRegistroInicio + ":E" + intInicioRegistro).Style = estiloDetalleDatosCenter;
            worksheet.Range("G" + intInicioRegistroInicio + ":G" + intInicioRegistro).Style = estiloDetalleDatosCenter;
            worksheet.Range("J" + intInicioRegistroInicio + ":J" + intInicioRegistro).Style = estiloDetalleDatosCenter;
            worksheet.Range("K" + intInicioRegistroInicio + ":K" + intInicioRegistro).Style = estiloDetalleDatosCenter;

            var estiloDetalleDatosLeft = workbook.Style;
            estiloDetalleDatosLeft.Alignment.Horizontal = XLAlignmentHorizontalValues.Left;
            estiloDetalleDatosLeft.Alignment.Vertical = XLAlignmentVerticalValues.Center;
            estiloDetalleDatosLeft.Font.FontSize = 10;
            estiloDetalleDatosLeft.Font.Bold = false;
            estiloDetalleDatosLeft.Font.FontName = "Calibri";
            estiloDetalleDatosLeft.Font.FontColor = XLColor.Black;
            estiloDetalleDatosLeft.Fill.BackgroundColor = XLColor.NoColor;
            estiloDetalleDatosLeft.NumberFormat.SetFormat("0");
            estiloDetalleDatosLeft.Border.BottomBorderColor = XLColor.Black;
            estiloDetalleDatosLeft.Border.BottomBorder = XLBorderStyleValues.Thin;
            estiloDetalleDatosLeft.Border.TopBorderColor = XLColor.Black;
            estiloDetalleDatosLeft.Border.TopBorder = XLBorderStyleValues.Thin;
            estiloDetalleDatosLeft.Border.LeftBorderColor = XLColor.Black;
            estiloDetalleDatosLeft.Border.LeftBorder = XLBorderStyleValues.Thin;
            estiloDetalleDatosLeft.Border.RightBorderColor = XLColor.Black;
            estiloDetalleDatosLeft.Border.RightBorder = XLBorderStyleValues.Thin;
            worksheet.Range("F" + intInicioRegistroInicio + ":F" + intInicioRegistro).Style = estiloDetalleDatosLeft;
            worksheet.Range("I" + intInicioRegistroInicio + ":I" + intInicioRegistro).Style = estiloDetalleDatosLeft;
            worksheet.Range(colDestino + intInicioRegistroInicio + ":" + colDestino + intInicioRegistro).Style = estiloDetalleDatosLeft;
            worksheet.Range("A" + intInicioRegistroInicio + ":A" + intInicioRegistro).Style = estiloDetalleDatosLeft;

            var estiloDetalleDatosRight = workbook.Style;
            estiloDetalleDatosRight.Alignment.Horizontal = XLAlignmentHorizontalValues.Right;
            estiloDetalleDatosRight.Alignment.Vertical = XLAlignmentVerticalValues.Center;
            estiloDetalleDatosRight.Font.FontSize = 10;
            estiloDetalleDatosRight.Font.Bold = false;
            estiloDetalleDatosRight.Font.FontName = "Calibri";
            estiloDetalleDatosRight.Font.FontColor = XLColor.Black;
            estiloDetalleDatosRight.Fill.BackgroundColor = XLColor.NoColor;
            estiloDetalleDatosRight.NumberFormat.SetFormat("0.00");
            estiloDetalleDatosRight.Border.BottomBorderColor = XLColor.Black;
            estiloDetalleDatosRight.Border.BottomBorder = XLBorderStyleValues.Thin;
            estiloDetalleDatosRight.Border.TopBorderColor = XLColor.Black;
            estiloDetalleDatosRight.Border.TopBorder = XLBorderStyleValues.Thin;
            estiloDetalleDatosRight.Border.LeftBorderColor = XLColor.Black;
            estiloDetalleDatosRight.Border.LeftBorder = XLBorderStyleValues.Thin;
            estiloDetalleDatosRight.Border.RightBorderColor = XLColor.Black;
            estiloDetalleDatosRight.Border.RightBorder = XLBorderStyleValues.Thin;
            worksheet.Range("H" + intInicioRegistroInicio + ":H" + intInicioRegistro).Style = estiloDetalleDatosRight;

            var sumaIni = intInicioRegistro + 1;
            worksheet.Range("L" + intInicioRegistroInicio + ":L" + sumaIni).Style = estiloDetalleDatosRight;
            worksheet.Range("L" + intInicioRegistroInicio + ":L" + intInicioRegistro).Style = estiloDetalleDatosRight;
            worksheet.Range("M" + intInicioRegistroInicio + ":M" + intInicioRegistro).Style = estiloDetalleDatosRight;
            worksheet.Range("N" + intInicioRegistroInicio + ":N" + intInicioRegistro).Style = estiloDetalleDatosRight;
            worksheet.Range("O" + intInicioRegistroInicio + ":O" + intInicioRegistro).Style = estiloDetalleDatosRight;

            worksheet.Range("P" + intInicioRegistroInicio + ":P" + sumaIni).Style = estiloDetalleDatosRight;
            worksheet.Range("Q" + intInicioRegistroInicio + ":Q" + sumaIni).Style = estiloDetalleDatosRight;
            worksheet.Range("R" + intInicioRegistroInicio + ":R" + sumaIni).Style = estiloDetalleDatosRight;
            worksheet.Range("S" + intInicioRegistroInicio + ":S" + sumaIni).Style = estiloDetalleDatosRight;
            if (blnTieneDescuento)
            {
                worksheet.Range(colPagar + intInicioRegistroInicio + ":" + colPagar + sumaIni).Style = estiloDetalleDatosRight;
            }
            worksheet.Range("A" + intInicioRegistroInicio + ":A" + intInicioRegistroInicio).Style = estiloDetalleDatosRight;


            worksheet.Cell("L" + sumaIni).Value = Math.Round(dblAcumulaTotal, 2);
            worksheet.Cell("P" + sumaIni).Value = dblAcumulaComision;
            worksheet.Cell("Q" + sumaIni).Value = Math.Round(dblinc, 2);
            worksheet.Cell("R" + sumaIni).Value = Math.Round(dblPubl, 2);
            if (blnTieneDescuento)
            {
                worksheet.Cell("S" + sumaIni).Value = Math.Round(dblDescuentoImporteAcumula, 2);
            }
            worksheet.Cell(colPagar + sumaIni).Value = dblAcumulaPagar;
            

            // Stili e totali (uguali al codice originale)...
            //intInicioRegistro -= 1;

            // ... applica stili come nel tuo codice originale (omesso qui per brevità)

            // Salva l'Excel nello stream
            workbook.SaveAs(memoryStream);

            // Esegui le chiamate di liquidazione DOPO aver salvato l'Excel
            // Eseguire sequenzialmente per evitare conflitti (puoi parallelizzare con cautela)
            foreach (var toProcess in pendingLiquidaciones)
            {
                try
                {
                    await Liquidacion_Procesar(toProcess.ventaId, toProcess.totalComision, toProcess.incentivo, toProcess.publicidad,
                        toProcess.usuarioId, toProcess.formula, toProcess.dec_pDescuento, toProcess.pago, toProcess.codLiquidacion);
                }
                catch
                {
                    // Ignora o logga errori (non bloccare la restituzione del file)
                }
            }

            DateTime fechaAhora = DateTime.Now;
            string fechaString = $"{fechaAhora:dd}{fechaAhora:MM}{fechaAhora.Year}";
            memoryStream.Position = 0;
            var contentType = "application/octet-stream";
            var fileName = agencia + "_DocumentoDeCobranza_" + fechaString + "_" + (situacion == "P" ? "Pendiente" : "Cancelado") + "_.xlsx";
            return File(memoryStream, contentType, fileName);
        }
        [HttpPost]
		[Route("ReporteVentaGenerarExcel")]
		public async Task<FileStreamResult> exportReporteVenta([FromBody] BEVentaExportar pVentaExportar)
		{
			var memoryStream = new MemoryStream();
			var oVentas = await VentaExportar_Obtener(pVentaExportar);

			using var workbook = new XLWorkbook();
			// Definimos las propiedades del documento
			workbook.Properties.Author = "EuroAmericanAssistance";
			workbook.Properties.Title = "Reporte de Ventas";
			workbook.Properties.Subject = "Reporte de Ventas";
			workbook.Properties.Comments = "Reporte de Ventas generado automaticamente desde el sistema de gestion de EUROAMERICAN.";
			// Seleccionamos el primero worksheet del workbook

			var worksheet = workbook.Worksheets.Add("Ventas");

			worksheet.ShowGridLines = false;
			worksheet.PageSetup.PaperSize = XLPaperSize.A4Paper;
			worksheet.PageSetup.PageOrientation = XLPageOrientation.Portrait;
			worksheet.PageSetup.Margins.Left = 1;
			worksheet.PageSetup.Margins.Right = 1;
			worksheet.PageSetup.Margins.Top = 1;
			worksheet.PageSetup.Margins.Bottom = 1;

			// Column widths
			worksheet.Column(1).Width = 1;
			worksheet.Column(2).Width = 10;
			worksheet.Column(3).Width = 10;
			worksheet.Column(4).Width = 10;
			worksheet.Column(5).Width = 25;
			worksheet.Column(6).Width = 45;
			worksheet.Column(7).Width = 8;
			worksheet.Column(8).Width = 20;
			worksheet.Column(9).Width = 25;
			worksheet.Column(10).Width = 25;
			worksheet.Column(11).Width = 25;
			worksheet.Column(12).Width = 10;

			// Estilos
			var estiloCabeceraDatos = workbook.Style;
			estiloCabeceraDatos.Font.Bold = true;
			estiloCabeceraDatos.Font.FontSize = 11;
			estiloCabeceraDatos.Font.FontName = "Calibri";
			estiloCabeceraDatos.Alignment.Horizontal = XLAlignmentHorizontalValues.Center;
			estiloCabeceraDatos.Alignment.Vertical = XLAlignmentVerticalValues.Center;

			//var fechaINI = pVentaExportar.pVentaIngresoInicio;
			//var fechaFIN = pVentaExportar.pVentaIngresoFin;

			var fechaINI = DateTime.Parse(pVentaExportar.pVentaIngresoInicio!);
			var fechaFIN = DateTime.Parse(pVentaExportar.pVentaIngresoFin!);

			worksheet.Cell("B9").Value = $"REPORTE DE VENTAS DESDE EL {fechaINI:dd/MM/yyyy} AL {fechaFIN:dd/MM/yyyy}";
			//worksheet.Cell("B9").Value = $"REPORTE DE VENTAS DESDE EL {DateTime.Today.AddDays(-30):dd/MM/yyyy} AL {DateTime.Today:dd/MM/yyyy}";
			worksheet.Range("B9:L9").Merge().Style = estiloCabeceraDatos;
			worksheet.Row(9).Height = 20;



			// Column titles
			string[] headers = { "TARJETA", "ESTADO", "EMITIDO", "PRODUCTO", "NOMBRE DEL PASAJERO", "DIAS", "SITUACION", "AGENCIA", "PROMOTOR", "COUNTER", "IMPORTE" };
			for (int i = 0; i < headers.Length; i++)
			{
				worksheet.Cell(11, i + 2).Value = headers[i];
			}

			Stream streamLogo = await RetornarStreamImageLogo("logos/logo.png");
			worksheet.AddPicture(streamLogo).MoveTo(worksheet.Cell("C2"));

			var estiloCabeceraInfo = workbook.Style;
			estiloCabeceraInfo.Font.Bold = true;
			estiloCabeceraInfo.Font.FontSize = 9;
			estiloCabeceraInfo.Font.FontName = "Calibri";
			estiloCabeceraInfo.Alignment.Horizontal = XLAlignmentHorizontalValues.Center;
			estiloCabeceraInfo.Alignment.Vertical = XLAlignmentVerticalValues.Center;

			worksheet.Cell("F2").Value = "United Assistance S.A.C";
			worksheet.Cell("F3").Value = "Av. Ricardo Palma 341 OF. 902 - Miraflores - Lima - Perú";
			worksheet.Cell("F4").Value = "Central: 446-2001 / 446-3432";
			worksheet.Cell("F5").Value = "Telefax: 241-5994";
			worksheet.Cell("F6").Value = "cobranzas@euroamericanassistance.com";
			worksheet.Cell("F7").Value = "www.euroamericanassistance.com";
			worksheet.Range("F2:F8").Style = estiloCabeceraInfo;
			worksheet.Rows(2, 8).Height = 12;

			// Data
			int filaInicioStart = 12;
			int filaInicio = filaInicioStart;
			double totalPendiente = 0;
			double totalCancelado = 0;
			double totalVentas = 0;

			foreach (var venta in oVentas)
			{
				string estado = venta.ventaEstadoNombre!;
				string situacion = venta.ventaSituacionNombre!;
				double importe = estado != "VIGENTE" ? 0 : venta.ventaImporteVenta;

				worksheet.Cell(filaInicio, 2).Value = venta.ventaId;
				worksheet.Cell(filaInicio, 3).Value = estado;
				worksheet.Cell(filaInicio, 4).Value = venta.ventaCreadoFecha.ToString("dd/MM/yyyy");
				worksheet.Cell(filaInicio, 5).Value = venta.ventaProductoNombre;
				worksheet.Cell(filaInicio, 6).Value = venta.ventaClienteApellidos + ", " + venta.ventaClienteNombres;
				worksheet.Cell(filaInicio, 7).Value = venta.ventaNumeroDias;
				worksheet.Cell(filaInicio, 8).Value = situacion;
				worksheet.Cell(filaInicio, 9).Value = venta.ventaUsuarioAgenciaNombre;
				worksheet.Cell(filaInicio, 10).Value = venta.ventaPromotorNombre;
				worksheet.Cell(filaInicio, 11).Value = venta.ventaCounter;
				worksheet.Cell(filaInicio, 12).Value = importe;

				/*worksheet.Range(filaInicio, 2, filaInicio, 12).Style = estiloCentro;
				worksheet.Range(filaInicio, 5, filaInicio, 6).Style = estiloIzquierda;
				worksheet.Cell(filaInicio, 12).Style = estiloDerecha;*/

				if (situacion == "PENDIENTE") totalPendiente += importe;
				else totalCancelado += importe;

				totalVentas += importe;
				filaInicio++;
			}

			var estiloCentro = workbook.Style;
			estiloCentro.Alignment.Horizontal = XLAlignmentHorizontalValues.Center;
			estiloCentro.Alignment.Vertical = XLAlignmentVerticalValues.Center;
			estiloCentro.Font.FontSize = 10;
			estiloCentro.Font.FontName = "Calibri";

			worksheet.Range("B" + filaInicioStart + ":B" + filaInicio).Style = estiloCentro;


			var estiloIzquierda = workbook.Style;
			estiloIzquierda.Alignment.Horizontal = XLAlignmentHorizontalValues.Left;
			estiloIzquierda.Alignment.Vertical = XLAlignmentVerticalValues.Center;
			estiloIzquierda.Font.FontSize = 10;
			estiloIzquierda.Font.FontName = "Calibri";

			worksheet.Range("J" + filaInicioStart + ":J" + filaInicio).Style = estiloIzquierda;

			var estiloDerecha = workbook.Style;
			estiloDerecha.Alignment.Horizontal = XLAlignmentHorizontalValues.Right;
			estiloDerecha.Alignment.Vertical = XLAlignmentVerticalValues.Center;
			estiloDerecha.Font.FontSize = 10;
			estiloDerecha.Font.FontName = "Calibri";
			estiloDerecha.NumberFormat.Format = "0.00";

			worksheet.Range("L" + filaInicioStart + ":L" + filaInicio).Style = estiloDerecha;



			// Totals
			worksheet.Cell(filaInicio + 1, 11).Value = "Total Cancelado:";
			worksheet.Cell(filaInicio + 2, 11).Value = "Total Pendiente:";
			worksheet.Cell(filaInicio + 3, 11).Value = "Total Ventas:";
			worksheet.Cell(filaInicio + 1, 12).Value = totalCancelado;
			worksheet.Cell(filaInicio + 2, 12).Value = totalPendiente;
			worksheet.Cell(filaInicio + 3, 12).Value = totalVentas;

			//worksheet.Range(filaInicio + 1, 11, filaInicio + 3, 12).Style = estiloCentro;


			var estiloDetalleImp = workbook.Style; // Or get from a specific range's style
			estiloDetalleImp.Font.FontSize = 11;
			estiloDetalleImp.Font.Bold = true;
			estiloDetalleImp.Font.FontName = "Calibri";
			estiloDetalleImp.Alignment.Horizontal = XLAlignmentHorizontalValues.Right;
			estiloDetalleImp.Alignment.Vertical = XLAlignmentVerticalValues.Center;
			estiloDetalleImp.Border.BottomBorder = XLBorderStyleValues.Medium;
			estiloDetalleImp.Border.TopBorder = XLBorderStyleValues.Medium;
			estiloDetalleImp.Border.LeftBorder = XLBorderStyleValues.Medium;
			estiloDetalleImp.Border.RightBorder = XLBorderStyleValues.Medium;
			estiloDetalleImp.Border.BottomBorderColor = XLColor.Black;
			estiloDetalleImp.Border.TopBorderColor = XLColor.Black;
			estiloDetalleImp.Border.LeftBorderColor = XLColor.Black;
			estiloDetalleImp.Border.RightBorderColor = XLColor.Black;
			estiloDetalleImp.NumberFormat.Format = "0.00";

			worksheet.Range(filaInicio + 1, 12, filaInicio + 3, 12).Style = estiloDetalleImp;


			var estiloDetalleTitulos = workbook.Style; // or from a range like worksheet.Range("A1:D1").Style;
			estiloDetalleTitulos.Alignment.Horizontal = XLAlignmentHorizontalValues.Center;
			estiloDetalleTitulos.Alignment.Vertical = XLAlignmentVerticalValues.Center;
			estiloDetalleTitulos.Font.FontSize = 11;
			estiloDetalleTitulos.Font.Bold = true;
			estiloDetalleTitulos.Font.FontName = "Calibri";
			estiloDetalleTitulos.Border.BottomBorder = XLBorderStyleValues.Medium;
			estiloDetalleTitulos.Border.TopBorder = XLBorderStyleValues.Medium;
			estiloDetalleTitulos.Border.LeftBorder = XLBorderStyleValues.Medium;
			estiloDetalleTitulos.Border.RightBorder = XLBorderStyleValues.Medium;
			estiloDetalleTitulos.Border.BottomBorderColor = XLColor.Black;
			estiloDetalleTitulos.Border.TopBorderColor = XLColor.Black;
			estiloDetalleTitulos.Border.LeftBorderColor = XLColor.Black;
			estiloDetalleTitulos.Border.RightBorderColor = XLColor.Black;
			worksheet.Range("B11:L11").Style = estiloDetalleTitulos;

			// Save and return path
			workbook.SaveAs(memoryStream);

			DateTime fechaAhora = DateTime.Now;
			string fechaString = $"{fechaAhora:dd}{fechaAhora:MM}{fechaAhora.Year}";
			memoryStream.Position = 0;
			var contentType = "application/octet-stream";
			var fileName = (int.TryParse(User.FindFirst("IdUsuario")?.Value, out var _uid) ? _uid : 0) + "_ReporteDeVentas_" + fechaString + "_.xlsx";
			return File(memoryStream, contentType, fileName);

		}
		[HttpPost]
		[Route("ListadoVentaGenerarExcel")]
		public async Task<FileStreamResult> exportListadoVenta([FromBody] BEVentaExportar pVentaExportar)
		{
			var memoryStream = new MemoryStream();
			var oVentas = await VentaExportar_Obtener(pVentaExportar);
			using var workbook = new XLWorkbook();
			// Definimos las propiedades del documento
			workbook.Properties.Author = "EuroAmericanAssistance";
			workbook.Properties.Title = "Reporte de Ventas";
			workbook.Properties.Subject = "Reporte de Ventas";
			workbook.Properties.Comments = "Reporte de Ventas generado automaticamente desde el sistema de gestion de EUROAMERICAN.";
			// Seleccionamos el primero worksheet del workbook
			var worksheet = workbook.Worksheets.Add("Listado");
			worksheet.ShowGridLines = false;
			worksheet.PageSetup.PaperSize = XLPaperSize.A4Paper;
			worksheet.PageSetup.PageOrientation = XLPageOrientation.Portrait;
			worksheet.PageSetup.Margins.Left = 1;
			worksheet.PageSetup.Margins.Right = 1;
			worksheet.PageSetup.Margins.Top = 1;
			worksheet.PageSetup.Margins.Bottom = 1;
			var columns = new (string DataIndex, string Header, string? Format, double? Width)[]
			{
				("ventaId", "VentaId", null, 20),
				("ventaPromotorNombre", "VentaPromotorNombre", null, 30),
				("ventaCreadoFecha", "VentaCreadoFecha", "yyyy-MM-ddTHH:mm:ss", 30),
				("ventaFechaVigenciaInicio", "VentaFechaVigenciaInicio", "yyyy-MM-ddTHH:mm:ss", 30),
				("ventaFechaVigenciaFin", "VentaFechaVigenciaFin", "yyyy-MM-ddTHH:mm:ss", 30),
				("ventaUsuarioAgenciaNombre", "VentaUsuarioAgenciaNombre", null, 30),
				("ventaClienteApellidoNombre", "VentaClienteApellidoNombre", null, 30),
				("ventaNumeroDias", "VentaNumeroDias", null, 10),
				("ventaProductoNombre", "VentaProductoNombre", null, 30),
				("ventaProductoImporte", "VentaProductoImporte", "#,##0.00", 10),
				("ventaProductoEdadMinima", "VentaProductoEdadMinima", null, 10),
				("ventaProductoEdadMaxima", "VentaProductoEdadMaxima", null, 10),
				("ventaEstadoNombre", "VentaEstadoNombre", null, 10),
				("ventaSituacionNombre", "VentaSituacionNombre", null, 10),
				("ventaAnuladoFecha", "VentaFechaCancelacion", "yyyy-MM-ddTHH:mm:ss", 30),
				("ventaCreadoUsuarioNombre", "VentaCreadoUsuarioNombre", null, 20),
				("ventaClienteDocumentoTipoId", "VentaClienteDocumentoTipoId", null, 10),
				("ventaClienteDocumentoNumero", "VentaClienteDocumentoNumero", null, 20),
				("ventaClienteNombres", "VentaClienteNombres", null, 30),
				("ventaClienteApellidos", "VentaClienteApellidos", null, 30),
				("ventaClienteFechaNacimiento", "VentaClienteFechaNacimiento", "yyyy-MM-ddTHH:mm:ss", 30),
				("ventaClienteEdad", "VentaClienteEdad", null, 10),
				("ventaClienteEmail", "VentaClienteEmail", null, 30),
				("ventaClienteDireccion", "VentaClienteDireccion", null, 20),
				("ventaClienteTelefono", "VentaClienteTelefono", null, 20),
				("ventaClienteDistrito", "VentaClienteDistrito", null, 20),
				("ventaClienteCiudad", "VentaClienteCiudad", null, 20),
				("ventaClientePais", "VentaClientePais", null, 20),
				("ventaContactoNombres", "VentaContactoNombres", null, 20),
				("ventaContactoDireccion", "VentaContactoDireccion", null, 20),
				("ventaContactoDistrito", "VentaContactoDistrito", null, 20),
				("ventaContactoPais", "VentaContactoPais", null, 20),
				("ventaContactoTelefono", "VentaContactoTelefono", null, 20),
				("ventaContactoEmail", "VentaContactoEmail", null, 20),
				("ventaCounter", "VentaCounter", null, 20),
				("ventaSituacionId", "VentaSituacionId", null, 10),
				("ventaAgenciaDireccion", "VentaAgenciaDireccion", null, 30),
				("ventaAgenciaComision", "VentaAgenciaComision", "#,##0.00", 10),
				("ventaComisionImporte", "VentaComisionImporte", "#,##0.00", 10),
				("ventaAgenciaRUC", "VentaAgenciaRUC", null, 30),
				("ventaAgenciaIdExterno", "VentaAgenciaIdExterno", null, 30),
				("ventaPaisImpuesto", "VentaPaisImpuesto", "#,##0.00", 10),
				("ventaIncentivo", "VentaIncentivo", "#,##0.00", 10),
				("ventaIncentivoImporte", "VentaIncentivoImporte", "#,##0.00", 10),
				("ventaCobranzaPagoFecha", "VentaCobranzaPagoFecha", "yyyy-MM-ddTHH:mm:ss", 30),
				("cobranzaDocumento", "CobranzaDocumento", null, 30),
				("ventaIncentivoPostImporte", "VentaIncentivoPostImporte", "#,##0.00", 10),
				("ventaImporteVenta", "VentaImporteVenta", "#,##0.00", 10),
				("ventaCodigoExterno", "VentaCodigoExterno", null, 20),
				("ventaObservacion", "VentaObservacion", null, 30),
			};
			for (int i = 0; i < columns.Length; i++)
			{
				var col = columns[i];
				worksheet.Cell(1, i + 1).Value = col.Header;
				worksheet.Cell(1, i + 1).Style.Font.Bold = true;
				if (!string.IsNullOrEmpty(col.Format))
				{
					worksheet.Column(i + 1).Style.DateFormat.Format = col.Format; // Will also work for number format
					worksheet.Column(i + 1).Style.NumberFormat.Format = col.Format;
				}
				if (col.Width.HasValue)
				{
					worksheet.Column(i + 1).Width = col.Width.Value;
				}
			}
			for (int row = 0; row < oVentas.Count; row++)
			{
				var venta = oVentas[row];
				for (int colIndex = 0; colIndex < columns.Length; colIndex++)
				{
					var propName = columns[colIndex].DataIndex;
					if (propName.Equals("VentaClienteApellidoNombre", StringComparison.OrdinalIgnoreCase))
					{
						var nombresProp = venta.GetType().GetProperty("VentaClienteNombres", BindingFlags.IgnoreCase | BindingFlags.Public | BindingFlags.Instance);
						var apellidosProp = venta.GetType().GetProperty("VentaClienteApellidos", BindingFlags.IgnoreCase | BindingFlags.Public | BindingFlags.Instance);
						var nombres = nombresProp?.GetValue(venta, null)?.ToString() ?? "";
						var apellidos = apellidosProp?.GetValue(venta, null)?.ToString() ?? "";
						var fullName = $"{apellidos}, {nombres}".Trim();
						worksheet.Cell(row + 2, colIndex + 1).Value = fullName;
					}
					else
					{
						var prop = venta.GetType().GetProperty(propName, BindingFlags.IgnoreCase | BindingFlags.Public | BindingFlags.Instance);
						var propValue = prop?.GetValue(venta, null);
						if (propValue == null)
						{
							worksheet.Cell(row + 2, colIndex + 1).Value = "";
						}
						else
						{
							if (propValue is DateTime dt)
							{
								worksheet.Cell(row + 2, colIndex + 1).Value = dt.ToString("yyyy-MM-ddTHH:mm:ss");
							}
							else
							{
								worksheet.Cell(row + 2, colIndex + 1).Value = propValue.ToString();
							}
						}
					}
				}
			}
			// Save and return path
			workbook.SaveAs(memoryStream);
			DateTime fechaAhora = DateTime.Now;
			string fechaString = $"{fechaAhora:dd}{fechaAhora:MM}{fechaAhora.Year}";
			memoryStream.Position = 0;
			var contentType = "application/octet-stream";
			var fileName = (int.TryParse(User.FindFirst("IdUsuario")?.Value, out var _uid) ? _uid : 0) + "_ListadoDeVentas_" + fechaString + "_.xlsx";
			return File(memoryStream, contentType, fileName);

		}
		[HttpPost]
		[Route("importarExcelVentas")]
		public async Task<FileStreamResult> importarVentas([FromBody] BEImportarVentas pImportarVentas)
		{
			string streamBase64Image = pImportarVentas.base64archivo!.Trim();
			string tipoProcesar = pImportarVentas.tipoProcesar!.Trim();
			string correlativo = pImportarVentas.correlativo!.Trim();
			byte[] fileAsBytes = Convert.FromBase64String(streamBase64Image);
			Stream streamBase64 = new MemoryStream(fileAsBytes, 0, fileAsBytes.Length);
			StringBuilder erroresValidar = await validarVentas(streamBase64, tipoProcesar);
			if (erroresValidar.Length == 0)
			{
				StringBuilder erroresInsert = await procesarImportarVentas(streamBase64, tipoProcesar, correlativo);
				if (erroresInsert.Length == 0)
				{
					byte[] byteArray = new byte[100];
					MemoryStream memoryStream = new MemoryStream(byteArray);
					memoryStream.Position = 0;
					var contentType = "application/octet-stream";
					var fileName = "ok.xlsx";
					return File(memoryStream, contentType, fileName);
				}
				else
				{
					MemoryStream memoryStream = await CreateLogMemoryStream(erroresInsert);
					var contentType = "text/plain";
					var fileName = "VentaMasivaErrores.txt";
					return File(memoryStream, contentType, fileName);
				}

			}
			else
			{
				MemoryStream memoryStream = await CreateLogMemoryStream(erroresValidar);
				var contentType = "text/plain";
				var fileName = "VentaMasivaErrores.txt";
				return File(memoryStream, contentType, fileName);
			}
		}
		[HttpGet]
		[Route("descargarPlantillaPagoIncentivos")]
		public FileStreamResult descargarPlantillaPagoIncentivos()
		{
			var memoryStream = new MemoryStream();
			using (var workbook = new XLWorkbook())
			{
				workbook.Properties.Author = "EuroAmericanAssistance";
				workbook.Properties.Title = "Plantilla Post-Incentivo";
				workbook.Properties.Subject = "Importación masiva de Post-Incentivo";
				var worksheet = workbook.Worksheets.Add("PostIncentivo");
				worksheet.ShowGridLines = false;
				worksheet.Cell(1, 1).Value = "Plantilla de importación masiva - Post-Incentivo";
				worksheet.Cell(1, 1).Style.Font.Bold = true;
				worksheet.Cell(2, 1).Value = "No modifique el orden de las columnas. Los datos deben ingresarse a partir de la fila 4.";
				worksheet.Cell(3, 1).Value = "VentaId";
				worksheet.Cell(3, 2).Value = "PostIncentivo";
				worksheet.Cell(3, 3).Value = "FechaPagoIncentivo";
				worksheet.Row(3).Style.Font.Bold = true;
				worksheet.Column(1).Width = 15;
				worksheet.Column(2).Width = 18;
				worksheet.Column(3).Width = 22;
				worksheet.Column(2).Style.NumberFormat.Format = "#,##0.00";
				worksheet.Column(3).Style.DateFormat.Format = "dd/MM/yyyy";
				workbook.SaveAs(memoryStream);
			}
			memoryStream.Position = 0;
			var contentType = "application/octet-stream";
			var fileName = "PagoIncentivos_Plantilla.xlsx";
			return File(memoryStream, contentType, fileName);
		}
		[HttpPost]
		[Route("importarExcelPagoIncentivos")]
		public async Task<FileStreamResult> importarPagoIncentivos([FromBody] BEImportarPagoIncentivos pImportarPagoIncentivos)
		{
			string streamBase64Image = pImportarPagoIncentivos.base64archivo!.Trim();
			byte[] fileAsBytes = Convert.FromBase64String(streamBase64Image);
			Stream streamBase64 = new MemoryStream(fileAsBytes, 0, fileAsBytes.Length);
			StringBuilder erroresValidar = await validarPagoIncentivos(streamBase64);
			if (erroresValidar.Length == 0)
			{
				StringBuilder erroresInsert = await procesarImportarPagoIncentivos(streamBase64);
				if (erroresInsert.Length == 0)
				{
					byte[] byteArray = new byte[100];
					MemoryStream memoryStream = new MemoryStream(byteArray);
					memoryStream.Position = 0;
					var contentType = "application/octet-stream";
					var fileName = "ok.xlsx";
					return File(memoryStream, contentType, fileName);
				}
				else
				{
					MemoryStream memoryStream = await CreateLogMemoryStream(erroresInsert);
					var contentType = "text/plain";
					var fileName = "PagoIncentivosErrores.txt";
					return File(memoryStream, contentType, fileName);
				}
			}
			else
			{
				MemoryStream memoryStream = await CreateLogMemoryStream(erroresValidar);
				var contentType = "text/plain";
				var fileName = "PagoIncentivosErrores.txt";
				return File(memoryStream, contentType, fileName);
			}
		}
		private async Task<StringBuilder> procesarImportarPagoIncentivos(Stream archivo)
		{
			StringBuilder errorMessages = new StringBuilder();
			try
			{
				using (var workbook = new XLWorkbook(archivo))
				{
					var worksheet = workbook.Worksheet(1).SetTabActive();
					if (worksheet.RowsUsed().Count() == 0)
					{
						throw new Exception("No existe informacion en el excel");
					}

					int idUsuario = int.TryParse(User.FindFirst("IdUsuario")?.Value, out var _idUsuario) ? _idUsuario : 0;
					foreach (var row in worksheet.RowsUsed().Skip(3))
					{
						if (string.IsNullOrWhiteSpace(row.Cell(1).Value.ToString()))
							break;

						try
						{
							var oVenta = new BEVenta();
							oVenta.ventaId = (int)row.Cell(1).GetDouble();
							oVenta.ventaIncentivoPostImporte = (float)row.Cell(2).GetDouble();
							oVenta.ventaIncentivoFechaPago = SafeGetDateTime(row.Cell(3), row.RowNumber(), "C");
							oVenta.ventaCreadoUsuarioId = idUsuario;

							var oError = await VentaGestionIncentivos_Procesar(oVenta);
							if (oError.errorCodigo != 200)
							{
								errorMessages.AppendLine("==================================================================================================================");
								errorMessages.AppendLine($"Fila ({row.RowNumber()}) Ocurrió un error al intentar enviar los datos de la Hoja Excel a la base de datos.");
								errorMessages.AppendLine($"Fila ({row.RowNumber()}) ERROR: {oError.errorDescripcion} VENTA: {oVenta.ventaId}");
							}
						}
						catch (Exception exRow)
						{
							errorMessages.AppendLine("==================================================================================================================");
							errorMessages.AppendLine($"Fila ({row.RowNumber()}) Error de conversión de datos:");
							errorMessages.AppendLine($"ERROR: {exRow.Message}");
						}
					}
				}
			}
			catch (Exception ex)
			{
				errorMessages.AppendLine("Error al procesar el archivo: " + ex.Message);
			}
			return errorMessages;
		}
		private async Task<StringBuilder> validarPagoIncentivos(Stream archivo)
		{
			StringBuilder errorMessages = new StringBuilder();
			try
			{
				using (var workbook = new XLWorkbook(archivo))
				{
					var worksheet = workbook.Worksheet(1).SetTabActive();
					if (worksheet.RowsUsed().Count() == 0)
					{
						throw new Exception("No existe informacion en el excel");
					}

					foreach (var row in worksheet.RowsUsed().Skip(3))
					{
						ValidateNumericCell(worksheet, row.RowNumber(), 1, "A", errorMessages); // VentaId
						ValidateNumericCell(worksheet, row.RowNumber(), 2, "B", errorMessages); // Post-Incentivo
						ValidateDateCell(worksheet, row.RowNumber(), 3, "C", errorMessages); // Fecha pago Incentivo
					}
				}
			}
			catch (Exception ex)
			{
				errorMessages.AppendLine("Error al procesar el archivo: " + ex.Message);
			}

			return errorMessages;
		}
        // ✅ NUOVO HELPER: converte celle Excel in DateTime con fallback robusto
        private DateTime SafeGetDateTime(IXLCell cell, int rowNumber, string colLetter)
        {
            try
            {
                // Tentativo 1: se la cella è già DateTime, restituiscila
                if (cell.DataType == XLDataType.DateTime)
                {
                    return cell.GetDateTime();
                }

                // Tentativo 2: se è numero (Excel salva le date come numeri), converti
                if (cell.DataType == XLDataType.Number)
                {
                    try
                    {
                        return DateTime.FromOADate(cell.GetDouble());
                    }
                    catch
                    {
                        // Se fallisce, prova parsing stringa sotto
                    }
                }

                // Tentativo 3: parsing da stringa con formati comuni
                string cellValue = cell.GetString().Trim();
                if (string.IsNullOrEmpty(cellValue))
                {
                    throw new Exception($"Cella vacía en Columna {colLetter}, Fila {rowNumber}");
                }

                // Formati supportati (aggiungi altri se necessario)
                string[] formats = {
            "dd/MM/yyyy", "d/M/yyyy", "dd-MM-yyyy", "d-M-yyyy",
            "yyyy-MM-dd", "yyyy/MM/dd",
            "MM/dd/yyyy", "M/d/yyyy",
            "dd/MM/yyyy HH:mm:ss", "yyyy-MM-dd HH:mm:ss"
        };

                if (DateTime.TryParseExact(cellValue, formats,
                    CultureInfo.InvariantCulture,
                    DateTimeStyles.None,
                    out DateTime result))
                {
                    return result;
                }

                // Tentativo 4: parsing generico
                if (DateTime.TryParse(cellValue, CultureInfo.InvariantCulture, DateTimeStyles.None, out result))
                {
                    return result;
                }

                throw new Exception($"Formato de fecha no válido: '{cellValue}' en Columna {colLetter}, Fila {rowNumber}");
            }
            catch (Exception ex)
            {
                throw new Exception($"Error al leer fecha en Columna {colLetter}, Fila {rowNumber}: {ex.Message}");
            }
        }

        private async Task<StringBuilder> procesarImportarVentas(Stream archivo, string tipoProcesar, string correlativo)
        {
            StringBuilder errorMessages = new StringBuilder();
            try
            {
                using (var workbook = new XLWorkbook(archivo))
                {
                    var worksheet = workbook.Worksheet(1).SetTabActive();
                    if (worksheet.RowsUsed().Count() == 0)
                    {
                        throw new Exception("No existe informacion en el excel");
                    }

                    foreach (var row in worksheet.RowsUsed().Skip(3))
                    {
                        if (string.IsNullOrWhiteSpace(row.Cell(1).Value.ToString()))
                            break;

                        try
                        {
                            var oVenta = new BEVenta();
                            oVenta.ventaGrupalId = int.Parse(correlativo.ToString());

                            // ✅ FIX: Usa SafeGetDateTime invece di GetDateTime()
                            oVenta.ventaFechaVigenciaInicio = SafeGetDateTime(row.Cell(2), row.RowNumber(), "B");
                            oVenta.ventaFechaVigenciaFin = SafeGetDateTime(row.Cell(3), row.RowNumber(), "C");
                            oVenta.ventaDestino = row.Cell(4).GetString().Trim();

                            oVenta.productoATVCodigo = row.Cell(5).GetString().Trim();

                            oVenta.ventaUsuarioAgenciaNombre = row.Cell(6).GetString().Trim();
                            oVenta.ventaCreadoUsuarioNombre = row.Cell(7).GetString().Trim();
                            oVenta.ventaCounter = row.Cell(8).GetString().Trim();

                            oVenta.ventaClienteDocumentoTipoId = row.Cell(9).GetString().Trim();
                            oVenta.ventaClienteDocumentoNumero = row.Cell(10).GetString().Trim();
                            oVenta.ventaClienteNombres = row.Cell(11).GetString().Trim();
                            oVenta.ventaClienteApellidos = row.Cell(12).GetString().Trim();

                            // ✅ FIX: Anche per la data di nascita
                            oVenta.ventaClienteFechaNacimiento = SafeGetDateTime(row.Cell(13), row.RowNumber(), "M");

                            oVenta.ventaClienteEmail = row.Cell(14).GetString().Trim();
                            oVenta.ventaClienteDireccion = row.Cell(15).GetString().Trim();
                            oVenta.ventaClienteTelefono = row.Cell(16).GetString().Trim();
                            oVenta.ventaClienteDistrito = row.Cell(17).GetString().Trim();
                            oVenta.ventaClienteCiudad = row.Cell(18).GetString().Trim();
                            oVenta.ventaClientePais = row.Cell(19).GetString().Trim();
                            oVenta.ventaNacionalidad = row.Cell(20).GetString().Trim();

                            oVenta.ventaContactoNombres = row.Cell(21).GetString().Trim();
                            oVenta.ventaContactoDireccion = row.Cell(22).GetString().Trim();
                            oVenta.ventaContactoEmail = row.Cell(23).GetString().Trim();
                            oVenta.ventaContactoTelefono = row.Cell(24).GetString().Trim();
                            oVenta.ventaContactoDistrito = row.Cell(25).GetString().Trim();
                            oVenta.ventaContactoPais = row.Cell(26).GetString().Trim();

                            if (tipoProcesar == "2" && row.Cell(27) != null && !row.Cell(27).IsEmpty())
                            {
                                oVenta.ventaCodigoExterno = row.Cell(27).GetString().Trim();
                            }

                            var oError = await VentaMasiva_Procesar(oVenta);
                            if (oError.errorCodigo != 200)
                            {
                                errorMessages.AppendLine("==================================================================================================================");
                                errorMessages.AppendLine($"Fila ({row.RowNumber()}) Ocurrió un error al intentar enviar los datos de la Hoja Excel a la base de datos.");
                                errorMessages.AppendLine($"Fila ({row.RowNumber()}) ERROR: {oError.errorDescripcion} DOCUMENTO: {oVenta.ventaClienteDocumentoNumero}");
                            }
                        }
                        catch (Exception exRow)
                        {
                            errorMessages.AppendLine("==================================================================================================================");
                            errorMessages.AppendLine($"Fila ({row.RowNumber()}) Error de conversión de datos:");
                            errorMessages.AppendLine($"ERROR: {exRow.Message}");
                            errorMessages.AppendLine($"StackTrace: {exRow.StackTrace}");
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                errorMessages.AppendLine("Error al procesar el archivo: " + ex.Message);
                errorMessages.AppendLine($"StackTrace: {ex.StackTrace}");
            }
            return errorMessages;
        }
        private async Task<StringBuilder> validarVentas(Stream archivo, string tipoProcesar)
		{
			StringBuilder errorMessages = new StringBuilder();
			try
			{
				using (var workbook = new XLWorkbook(archivo))
				{
					var worksheet = workbook.Worksheet(1).SetTabActive();
					if (worksheet.RowsUsed().Count() == 0)
					{
						throw new Exception("No existe informacion en el excel");
					}

					foreach (var row in worksheet.RowsUsed().Skip(3))
					{
						// Apply all validations
						ValidateDateCell(worksheet, row.RowNumber(), 2, "B", errorMessages); // Fecha Inicio
						ValidateDateCell(worksheet, row.RowNumber(), 3, "C", errorMessages); // Fecha Fin
						ValidateStringCell(worksheet, row.RowNumber(), 4, "D", errorMessages); // Destino
						ValidateNumericCell(worksheet, row.RowNumber(), 5, "E", errorMessages); // Producto Id
						ValidateStringCell(worksheet, row.RowNumber(), 6, "F", errorMessages); // Agencia Login
						ValidateStringCell(worksheet, row.RowNumber(), 7, "G", errorMessages); // Usuario Login
						ValidateStringCell(worksheet, row.RowNumber(), 8, "H", errorMessages); // Counter
						ValidateStringCell(worksheet, row.RowNumber(), 9, "I", errorMessages); // Tipo Documento
						ValidateStringCell(worksheet, row.RowNumber(), 10, "J", errorMessages); // Nro Documento
						ValidateStringCell(worksheet, row.RowNumber(), 11, "K", errorMessages); // Nombres
						ValidateStringCell(worksheet, row.RowNumber(), 12, "L", errorMessages); // Apellidos
						ValidateDateCell(worksheet, row.RowNumber(), 13, "M", errorMessages); // Fch. Nacimiento
						ValidateStringCell(worksheet, row.RowNumber(), 14, "N", errorMessages); // Email
						ValidateStringCell(worksheet, row.RowNumber(), 15, "O", errorMessages); // Dirección
						ValidateStringCell(worksheet, row.RowNumber(), 16, "P", errorMessages); // Telefono
						ValidateStringCell(worksheet, row.RowNumber(), 17, "Q", errorMessages); // Distrito/Sector
						ValidateStringCell(worksheet, row.RowNumber(), 18, "R", errorMessages); // Ciudad
						ValidateStringCell(worksheet, row.RowNumber(), 19, "S", errorMessages); // País
						ValidateStringCell(worksheet, row.RowNumber(), 20, "T", errorMessages); // País
						ValidateStringCell(worksheet, row.RowNumber(), 21, "U", errorMessages); // Nombres (again)
						ValidateStringCell(worksheet, row.RowNumber(), 22, "V", errorMessages); // Dirección
						ValidateStringCell(worksheet, row.RowNumber(), 23, "W", errorMessages); // Email
						ValidateStringCell(worksheet, row.RowNumber(), 24, "X", errorMessages); // Teléfono
						ValidateStringCell(worksheet, row.RowNumber(), 25, "Y", errorMessages); // Distrito
						ValidateStringCell(worksheet, row.RowNumber(), 26, "Z", errorMessages); // País
						if (tipoProcesar == "2")
						{
							await ValidateNumericCellCodigoExterno(worksheet, row.RowNumber(), 27, "AA", errorMessages); // Codigo Externo
						}
					}
				}
			}
			catch (Exception ex)
			{
				errorMessages.AppendLine("Error al procesar el archivo: " + ex.Message);
			}

			return errorMessages;
		}
		private void ValidateDateCell(IXLWorksheet worksheet, int row, int col, string colLetter, StringBuilder errorMessages)
		{
			var cell = worksheet.Cell(row, col);
			if (cell.IsEmpty())
			{
				errorMessages.Append($"La Columna ({colLetter}), Fila ({row}) de la Hoja de Excel no puede estar vacía, Favor de revisar la celda especificada.\n");
			}
			else if (cell.DataType == XLDataType.Text)
			{
				string cellValue = cell.GetString().Trim();
				if (!string.IsNullOrEmpty(cellValue))
				{
					if (cellValue.Length > 10)
					{
						cellValue = cellValue.Substring(0, 10);
					}
					if (!DateTime.TryParse(cellValue, out _))
					{
						errorMessages.Append($"La Columna ({colLetter}), Fila ({row}) de la Hoja de Excel contiene el formato de tipo 'Texto' con una fecha no válida al formato de fechas del sistema dd/mm/YYYY, Favor de revisar la celda especificada.\n");
					}
				}
				else
				{
					errorMessages.Append($"La Columna ({colLetter}), Fila ({row}) de la Hoja de Excel contiene una fecha no válida, Favor de revisar la celda especificada.\n");
				}
			}
			else if (cell.DataType != XLDataType.DateTime)
			{
				errorMessages.Append($"La Columna ({colLetter}), Fila ({row}) de la Hoja de Excel contiene una fecha no válida, Favor de revisar la celda especificada.\n");
			}
		}
		private void ValidateStringCell(IXLWorksheet worksheet, int row, int col, string colLetter, StringBuilder errorMessages)
		{
			var cell = worksheet.Cell(row, col);
			if (string.IsNullOrEmpty(cell.GetString()))
			{
				errorMessages.Append($"La Columna ({colLetter}), Fila ({row}) de la Hoja de Excel no puede estar vacía, Favor de revisar la celda especificada.\n");
			}
		}
		private void ValidateNumericCell(IXLWorksheet worksheet, int row, int col, string colLetter, StringBuilder errorMessages)
		{
			var cell = worksheet.Cell(row, col);
			if (cell.IsEmpty())
			{
				errorMessages.Append($"La Columna ({colLetter}), Fila ({row}) de la Hoja de Excel no puede estar vacía, Favor de revisar la celda especificada.\n");
			}
			else if (cell.DataType != XLDataType.Number)
			{
				errorMessages.Append($"La Columna ({colLetter}), Fila ({row}) de la Hoja de Excel tiene que ser numerico, Favor de revisar la celda especificada.\n");
			}
		}
		private async Task ValidateNumericCellCodigoExterno(IXLWorksheet worksheet, int row, int col, string colLetter, StringBuilder errorMessages)
		{
			var cell = worksheet.Cell(row, col);
			string cellReference = $"Columna ({colLetter}), Fila ({row})";

			if (cell.IsEmpty() || string.IsNullOrWhiteSpace(cell.GetValue<string>()))
			{
				errorMessages.AppendLine($"{cellReference} de la Hoja de Excel no puede estar vacía. Favor de revisar la celda especificada.");
			}
			else
			{
				string externalCode = cell.GetValue<string>().Trim();
				var oMetodoVenta = await Venta_CodigoExterno(externalCode);
				int int_vExisteCodigoExterno = oMetodoVenta.errorCodigo;
				if (int_vExisteCodigoExterno <= 0)
				{
					errorMessages.AppendLine($"{cellReference} de la Hoja de Excel el código externo ya existe registrado. Favor de revisar la celda especificada.");
				}
			}
		}
		private async Task<MemoryStream> CreateLogMemoryStream(StringBuilder errorMessages)
		{
			var memoryStream = new MemoryStream();
			using (var writer = new StreamWriter(memoryStream, leaveOpen: true))
			{
				await writer.WriteAsync(errorMessages.ToString());
				await writer.FlushAsync();
			}
			memoryStream.Position = 0;
			return memoryStream;
		}

		private async Task<List<BEResumenPagoReporte>> ReporteAgenciaPago_Obtener(string? Id, string? fechaIni, string? fechaFin, int codliquidacion)
		{
			var httpClient = httpClientFactory.CreateClient();
			string pAgenciaId = Id.ToString();
			string pFechaInicio = fechaIni.ToString();
			string pFechaFin = fechaFin.ToString();
			string parametros = "?pAgenciaId=" + pAgenciaId + "&pFechaInicio=" + pFechaInicio + "&pFechaFin=" + pFechaFin + "&pcodliquidacion=" + codliquidacion;
			string RutaApi = configuration.GetValue<string>("Generales:RutaAPI")! + "Reportes/";
			httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", User.FindFirst("Token")?.Value ?? string.Empty);
			var response = await httpClient.GetAsync(RutaApi + "ResumenAgenciaPagoObtener" + parametros);
			if (response.StatusCode == HttpStatusCode.OK)
			{
				string jsonOK = await response.Content.ReadAsStringAsync();
				List<BEResumenPagoReporte> objOK = JsonConvert.DeserializeObject<List<BEResumenPagoReporte>>(jsonOK)!;

				return objOK;
			}
			string jsonError = await response.Content.ReadAsStringAsync();
			BEErrorApi objError = new BEErrorApi();
			if (!string.IsNullOrEmpty(jsonError))
				objError = JsonConvert.DeserializeObject<BEErrorApi>(jsonError) ?? objError;
			if (objError.errorCodigo == 0)
				objError.errorCodigo = (int)response.StatusCode;
			objError.errorDescripcion ??= response.ReasonPhrase;
			throw new HttpRequestException($"Error en ResumenAgenciaPagoObtener ({objError.errorCodigo}): {objError.errorDescripcion}");
		}
		private async Task<List<BEResumenDescuentoReporte>> ReporteAgenciaDescuento_Obtener(string? Id, string? fechaIni, string? fechaFin, int codliquidacion)
		{
			var httpClient = httpClientFactory.CreateClient();
			string pAgenciaId = Id.ToString();
			string pFechaInicio = fechaIni.ToString();
			string pFechaFin = fechaFin.ToString();
			string parametros = "?pAgenciaId=" + pAgenciaId + "&pFechaInicio=" + pFechaInicio + "&pFechaFin=" + pFechaFin + "&pcodliquidacion=" + codliquidacion;
			string RutaApi = configuration.GetValue<string>("Generales:RutaAPI")! + "Reportes/";
			httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", User.FindFirst("Token")?.Value ?? string.Empty);
			var response = await httpClient.GetAsync(RutaApi + "ResumenAgenciaDescuentoObtener" + parametros);
			if (response.StatusCode == HttpStatusCode.OK)
			{
				string jsonOK = await response.Content.ReadAsStringAsync();
				List<BEResumenDescuentoReporte> objOK = JsonConvert.DeserializeObject<List<BEResumenDescuentoReporte>>(jsonOK)!;

				return objOK;
			}
			string jsonError = await response.Content.ReadAsStringAsync();
			BEErrorApi objError = new BEErrorApi();
			if (!string.IsNullOrEmpty(jsonError))
				objError = JsonConvert.DeserializeObject<BEErrorApi>(jsonError) ?? objError;
			if (objError.errorCodigo == 0)
				objError.errorCodigo = (int)response.StatusCode;
			objError.errorDescripcion ??= response.ReasonPhrase;
			throw new HttpRequestException($"Error en ResumenAgenciaDescuentoObtener ({objError.errorCodigo}): {objError.errorDescripcion}");
		}
		private async Task<List<BEResumenComisionReporte>> ReporteAgenciaComision_Obtener(string? Id, string? fechaIni, string? fechaFin, int codliquidacion)
		{
			var httpClient = httpClientFactory.CreateClient();
			string pAgenciaId = Id.ToString();
			string pFechaInicio = fechaIni.ToString();
			string pFechaFin = fechaFin.ToString();
			string parametros = "?pAgenciaId=" + pAgenciaId + "&pFechaInicio=" + pFechaInicio + "&pFechaFin=" + pFechaFin + "&pcodliquidacion=" + codliquidacion;
			string RutaApi = configuration.GetValue<string>("Generales:RutaAPI")! + "Reportes/";
			httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", User.FindFirst("Token")?.Value ?? string.Empty);
			var response = await httpClient.GetAsync(RutaApi + "ResumenAgenciaComisionObtener" + parametros);
			if (response.StatusCode == HttpStatusCode.OK)
			{
				string jsonOK = await response.Content.ReadAsStringAsync();
				List<BEResumenComisionReporte> objOK = JsonConvert.DeserializeObject<List<BEResumenComisionReporte>>(jsonOK)!;

				return objOK;
			}
			string jsonError = await response.Content.ReadAsStringAsync();
			BEErrorApi objError = new BEErrorApi();
			if (!string.IsNullOrEmpty(jsonError))
				objError = JsonConvert.DeserializeObject<BEErrorApi>(jsonError) ?? objError;
			if (objError.errorCodigo == 0)
				objError.errorCodigo = (int)response.StatusCode;
			objError.errorDescripcion ??= response.ReasonPhrase;
			throw new HttpRequestException($"Error en ResumenAgenciaComisionObtener ({objError.errorCodigo}): {objError.errorDescripcion}");
		}
		private async Task<List<BEResumenCobranzaReporte>> ReporteAgenciaCobranza_Obtener(string? Id, string? fechaIni, string? fechaFin, int codliquidacion)
		{
			var httpClient = httpClientFactory.CreateClient();
			string pAgenciaId = Id.ToString();
			string pFechaInicio = fechaIni.ToString();
			string pFechaFin = fechaFin.ToString();
			string parametros = "?pAgenciaId=" + pAgenciaId + "&pFechaInicio=" + pFechaInicio + "&pFechaFin=" + pFechaFin + "&pcodliquidacion=" + codliquidacion;
			string RutaApi = configuration.GetValue<string>("Generales:RutaAPI")! + "Reportes/";
			httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", User.FindFirst("Token")?.Value ?? string.Empty);
			var response = await httpClient.GetAsync(RutaApi + "ResumenAgenciaCobranzaObtener" + parametros);
			if (response.StatusCode == HttpStatusCode.OK)
			{
				string jsonOK = await response.Content.ReadAsStringAsync();
				List<BEResumenCobranzaReporte> objOK = JsonConvert.DeserializeObject<List<BEResumenCobranzaReporte>>(jsonOK)!;

				return objOK;
			}
			string jsonError = await response.Content.ReadAsStringAsync();
			BEErrorApi objError = new BEErrorApi();
			if (!string.IsNullOrEmpty(jsonError))
				objError = JsonConvert.DeserializeObject<BEErrorApi>(jsonError) ?? objError;
			if (objError.errorCodigo == 0)
				objError.errorCodigo = (int)response.StatusCode;
			objError.errorDescripcion ??= response.ReasonPhrase;
			throw new HttpRequestException($"Error en ResumenAgenciaCobranzaObtener ({objError.errorCodigo}): {objError.errorDescripcion}");
		}

		private async Task<List<BEDetalleCobranzaReporte>> DetalleAgenciaCobranza_Obtener(string? Id, string? fechaIni, string? fechaFin,int liquidacionCodigo) {
			var httpClient = httpClientFactory.CreateClient();
			string pAgenciaId = Id.ToString();
			string pFechaInicio = fechaIni.ToString();
			string pFechaFin = fechaFin.ToString();
			string parametros = "?pAgenciaId=" + pAgenciaId + "&pFechaInicio=" + pFechaInicio + "&pFechaFin=" + pFechaFin + "&int_pCodigoLiquidacion=" + liquidacionCodigo;
			string RutaApi = configuration.GetValue<string>("Generales:RutaAPI")! + "Reportes/";
			httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", User.FindFirst("Token")?.Value ?? string.Empty);
			var response = await httpClient.GetAsync(RutaApi + "DetalleAgenciaCobranzaObtener" + parametros);
			if (response.StatusCode == HttpStatusCode.OK) {
				string jsonOK = await response.Content.ReadAsStringAsync();
				List<BEDetalleCobranzaReporte> objOK = JsonConvert.DeserializeObject<List<BEDetalleCobranzaReporte>>(jsonOK)!;

				return objOK;
			}
			string jsonError = await response.Content.ReadAsStringAsync();
			BEErrorApi objError = new BEErrorApi();
			if (!string.IsNullOrEmpty(jsonError))
				objError = JsonConvert.DeserializeObject<BEErrorApi>(jsonError) ?? objError;
			if (objError.errorCodigo == 0)
				objError.errorCodigo = (int)response.StatusCode;
			objError.errorDescripcion ??= response.ReasonPhrase;
			throw new HttpRequestException($"Error en DetalleAgenciaCobranzaObtener ({objError.errorCodigo}): {objError.errorDescripcion}");
		}

		[HttpPost]
		[Route("ReporteResumenExcel")]
		public async Task<FileStreamResult> exportReporteResumenExcel([FromBody] BEResumenExcel pResumenExportar)
		{
			var memoryStream = new MemoryStream();
			var oPagos = await ReporteAgenciaPago_Obtener(pResumenExportar.agenciaId, pResumenExportar.fechaIni, pResumenExportar.fechaFin, pResumenExportar.codliquidacion);
			var oDescuentos = await ReporteAgenciaDescuento_Obtener(pResumenExportar.agenciaId, pResumenExportar.fechaIni, pResumenExportar.fechaFin, pResumenExportar.codliquidacion);
			var oCobranza = await ReporteAgenciaCobranza_Obtener(pResumenExportar.agenciaId, pResumenExportar.fechaIni, pResumenExportar.fechaFin, pResumenExportar.codliquidacion);
			var oComision = await ReporteAgenciaComision_Obtener(pResumenExportar.agenciaId, pResumenExportar.fechaIni, pResumenExportar.fechaFin, pResumenExportar.codliquidacion);
			var oDetalle = await DetalleAgenciaCobranza_Obtener(pResumenExportar.agenciaId, pResumenExportar.fechaIni, pResumenExportar.fechaFin, pResumenExportar.codliquidacion);

			using var workbook = new XLWorkbook();
			// Definimos las propiedades del documento
			workbook.Properties.Author = "EuroAmericanAssistance";
			workbook.Properties.Title = "Resumen de Cobranza";
			workbook.Properties.Subject = "Resumen de Cobranza";
			workbook.Properties.Comments = "Resumen de Cobranza generado automaticamente desde el sistema de gestion de EUROAMERICAN.";
			// Seleccionamos el primero worksheet del workbook

			var worksheet = workbook.Worksheets.Add("Resumen");

			worksheet.ShowGridLines = false;
			worksheet.PageSetup.PaperSize = XLPaperSize.A4Paper;
			worksheet.PageSetup.PageOrientation = XLPageOrientation.Portrait;
			worksheet.PageSetup.Margins.Left = 1;
			worksheet.PageSetup.Margins.Right = 1;
			worksheet.PageSetup.Margins.Top = 1;
			worksheet.PageSetup.Margins.Bottom = 1;

			// Column widths
			worksheet.Column(1).Width = 1;
			worksheet.Column(2).Width = 10;
			worksheet.Column(3).Width = 50;
			worksheet.Column(4).Width = 30;
			worksheet.Column(5).Width = 15;

			// Estilos
			var estiloCabeceraDatos = workbook.Style;
			estiloCabeceraDatos.Font.Bold = true;
			estiloCabeceraDatos.Font.FontSize = 11;
			estiloCabeceraDatos.Font.FontName = "Calibri";
			estiloCabeceraDatos.Alignment.Horizontal = XLAlignmentHorizontalValues.Center;
			estiloCabeceraDatos.Alignment.Vertical = XLAlignmentVerticalValues.Center;

			var fechaINI = DateTime.Parse(pResumenExportar.fechaIni!);
			var fechaFIN = DateTime.Parse(pResumenExportar.fechaFin!);
			if (pResumenExportar.codliquidacion == 0) {
				worksheet.Cell("B10").Value = $"RESUMEN DE COBRANZA DESDE EL {fechaINI:dd/MM/yyyy} AL {fechaFIN:dd/MM/yyyy}";
			} else {
				worksheet.Cell("B10").Value = $"RESUMEN DE COBRANZA DE LIQUIDACIÓN " + pResumenExportar.codliquidacion;
			}

			worksheet.Range("B10:E10").Merge().Style = estiloCabeceraDatos;
			worksheet.Row(9).Height = 20;

			Stream streamLogo = await RetornarStreamImageLogo("logos/logo.png");
			worksheet.AddPicture(streamLogo).MoveTo(worksheet.Cell("C2"));

			var estiloCabeceraInfo = workbook.Style;
			estiloCabeceraInfo.Font.Bold = true;
			estiloCabeceraInfo.Font.FontSize = 9;
			estiloCabeceraInfo.Font.FontName = "Calibri";
			estiloCabeceraInfo.Alignment.Horizontal = XLAlignmentHorizontalValues.Center;
			estiloCabeceraInfo.Alignment.Vertical = XLAlignmentVerticalValues.Center;

			worksheet.Cell("D2").Value = "United Assistance S.A.C";
			worksheet.Cell("D3").Value = "Av. Ricardo Palma 341 OF. 902 - Miraflores - Lima - Perú";
			worksheet.Cell("D4").Value = "Central: 446-2001 / 446-3432";
			worksheet.Cell("D5").Value = "Telefax: 241-5994";
			worksheet.Cell("D6").Value = "cobranzas@euroamericanassistance.com";
			worksheet.Cell("D7").Value = "www.euroamericanassistance.com";
			worksheet.Range("D2:D8").Style = estiloCabeceraInfo;
			worksheet.Rows(2, 8).Height = 12;

			// Data
			int filaInicioStart = 11;

			int filaInicioTitulo01 = filaInicioStart;

			worksheet.Cell(filaInicioTitulo01, 2).Value = "DESCUENTOS";
			worksheet.Cell(filaInicioTitulo01, 2).Style.Font.Bold = true;

			int filaInicioCabe01 = filaInicioTitulo01 + 1;

			worksheet.Cell(filaInicioCabe01, 2).Value = "#";
			worksheet.Cell(filaInicioCabe01, 3).Value = "NOMBRE DEL DESCUENTOS";
			worksheet.Cell(filaInicioCabe01, 4).Value = "FECHA";
			worksheet.Cell(filaInicioCabe01, 5).Value = "IMPORTE";

			int filaInicio = filaInicioCabe01 + 1;

			double totalDescuento = 0;
			int filaInicioDesc = 1;
			foreach (var descuento in oDescuentos)
			{
				worksheet.Cell(filaInicio, 2).Value = filaInicioDesc;
				worksheet.Cell(filaInicio, 3).Value = descuento.agenciaproductodescuentonombre;
				worksheet.Cell(filaInicio, 4).Value = descuento.agenciaProductoDescuentoRegistroFecha.ToString("dd/MM/yyyy");
				worksheet.Cell(filaInicio, 5).Value = descuento.agenciaProductoDescuentoImporte;
				worksheet.Cell(filaInicio, 5).Style.NumberFormat.Format = "#,##0.00";
				totalDescuento += descuento.agenciaProductoDescuentoImporte;
				filaInicio++;
				filaInicioDesc++;
			}
			worksheet.Cell(filaInicio, 4).Value = "TOTAL";
			worksheet.Cell(filaInicio, 4).Style.Font.Bold = true;
			worksheet.Cell(filaInicio, 5).Value = totalDescuento;
			worksheet.Cell(filaInicio, 5).Style.NumberFormat.Format = "#,##0.00";

			int filaInicioTitulo02 = filaInicio + 1;
			worksheet.Cell(filaInicioTitulo02, 2).Value = "INGRESOS";
			worksheet.Cell(filaInicioTitulo02, 2).Style.Font.Bold = true;
			int filaInicioCabe02 = filaInicioTitulo02 + 1;
			worksheet.Cell(filaInicioCabe02, 2).Value = "#";
			worksheet.Cell(filaInicioCabe02, 3).Value = "METODO DE PAGO";
			worksheet.Cell(filaInicioCabe02, 4).Value = "FECHA";
			worksheet.Cell(filaInicioCabe02, 5).Value = "IMPORTE";

			filaInicio = filaInicioCabe02 + 1;
			double totalIngresos = 0;
			int filaInicioIng = 1;
			foreach (var pago in oPagos)
			{
				worksheet.Cell(filaInicio, 2).Value = filaInicioIng;
				worksheet.Cell(filaInicio, 3).Value = pago.cobranzapagoMedioNombre;
				worksheet.Cell(filaInicio, 4).Value = pago.cobranzaPagoFecha.ToString("dd/MM/yyyy");
				worksheet.Cell(filaInicio, 5).Value = pago.cobranzapagoImporte;
				worksheet.Cell(filaInicio, 5).Style.NumberFormat.Format = "#,##0.00";
				totalIngresos += pago.cobranzapagoImporte;
				filaInicio++;
				filaInicioIng++;
			}
			worksheet.Cell(filaInicio, 4).Value = "TOTAL";
			worksheet.Cell(filaInicio, 4).Style.Font.Bold = true;
			worksheet.Cell(filaInicio, 5).Value = totalIngresos;
			worksheet.Cell(filaInicio, 5).Style.NumberFormat.Format = "#,##0.00";

			int filaInicioTitulo03 = filaInicio + 1;
			worksheet.Cell(filaInicioTitulo03, 2).Value = "FACTURACION DE COBRANZA";
			worksheet.Cell(filaInicioTitulo03, 2).Style.Font.Bold = true;
			int filaInicioCabe03 = filaInicioTitulo03 + 1;
			worksheet.Cell(filaInicioCabe03, 2).Value = "#";
			worksheet.Cell(filaInicioCabe03, 3).Value = "DOCUMENTO";
			worksheet.Cell(filaInicioCabe03, 4).Value = "FECHA";
			worksheet.Cell(filaInicioCabe03, 5).Value = "IMPORTE";

			filaInicio = filaInicioCabe03 + 1;
			double totalCobranza = 0;
			int filaInicioCob = 1;
			foreach (var cobrar in oCobranza)
			{

				worksheet.Cell(filaInicio, 2).Value = filaInicioCob;
				worksheet.Cell(filaInicio, 3).Value = cobrar.cobranzaDocumentoTipoNombre + " " + cobrar.cobranzaDocumentoSerie + "-" + cobrar.cobranzaDocumentoCorrelativo;
				worksheet.Cell(filaInicio, 4).Value = cobrar.cobranzaCreadoFecha.ToString("dd/MM/yyyy");
				worksheet.Cell(filaInicio, 5).Value = cobrar.cobranzaImportePago;
				worksheet.Cell(filaInicio, 5).Style.NumberFormat.Format = "#,##0.00";
				totalCobranza += cobrar.cobranzaImportePago;
				filaInicio++;
				filaInicioCob++;
			}
			worksheet.Cell(filaInicio, 4).Value = "TOTAL";
			worksheet.Cell(filaInicio, 4).Style.Font.Bold = true;
			worksheet.Cell(filaInicio, 5).Value = totalCobranza;
			worksheet.Cell(filaInicio, 5).Style.NumberFormat.Format = "#,##0.00";

			int filaInicioTitulo04 = filaInicio + 1;
			worksheet.Cell(filaInicioTitulo04, 2).Value = "FACTURACION POR COMISION";
			worksheet.Cell(filaInicioTitulo04, 2).Style.Font.Bold = true;
			int filaInicioCabe04 = filaInicioTitulo04 + 1;
			worksheet.Cell(filaInicioCabe04, 2).Value = "#";
			worksheet.Cell(filaInicioCabe04, 3).Value = "DOCUMENTO";
			worksheet.Cell(filaInicioCabe04, 4).Value = "FECHA";
			worksheet.Cell(filaInicioCabe04, 5).Value = "IMPORTE";

			filaInicio = filaInicioCabe04 + 1;
			double totalComision = 0;
			int filaInicioComi = 1;
			foreach (var comi in oComision)
			{

				worksheet.Cell(filaInicio, 2).Value = filaInicioComi;
				worksheet.Cell(filaInicio, 3).Value = comi.agenciaFacturaTipoDocumentoNombre + " " + comi.agenciafacturaSerie + "-" + comi.agenciafacturaNumero;
				worksheet.Cell(filaInicio, 4).Value = comi.agenciafacturaFechaEmision.ToString("dd/MM/yyyy");
				worksheet.Cell(filaInicio, 5).Value = comi.agenciafacturaTotal;
				worksheet.Cell(filaInicio, 5).Style.NumberFormat.Format = "#,##0.00";
				totalComision += comi.agenciafacturaTotal;
				filaInicio++;
				filaInicioComi++;
			}
			worksheet.Cell(filaInicio, 4).Value = "TOTAL";
			worksheet.Cell(filaInicio, 4).Style.Font.Bold = true;
			worksheet.Cell(filaInicio, 5).Value = totalComision;
			worksheet.Cell(filaInicio, 5).Style.NumberFormat.Format = "#,##0.00";


			int filaInicioTitulo05 = filaInicio + 1;
			worksheet.Cell(filaInicioTitulo05, 2).Value = "CUADRE DE LIQUIDACION";
			worksheet.Cell(filaInicioTitulo05, 2).Style.Font.Bold = true;
			int filaInicioCabe05 = filaInicioTitulo05 + 1;
			worksheet.Cell(filaInicioCabe05, 2).Value = "#";
			worksheet.Cell(filaInicioCabe05, 3).Value = "CONCEPTO";
			worksheet.Range("C" + filaInicioCabe05.ToString() + ":D" + filaInicioCabe05.ToString()).Merge();
			worksheet.Cell(filaInicioCabe05, 5).Value = "IMPORTE";

			filaInicio = filaInicioCabe05 + 1;
			worksheet.Cell(filaInicio, 2).Value = 1;
			worksheet.Cell(filaInicio, 3).Value = "IMPORTE BRUTO A PAGAR";
			worksheet.Cell(filaInicio, 5).Value = (totalCobranza);
			worksheet.Cell(filaInicio, 5).Style.NumberFormat.Format = "#,##0.00";
			filaInicio = filaInicio + 1;
			worksheet.Cell(filaInicio, 2).Value = 2;
			worksheet.Cell(filaInicio, 3).Value = "DESCUENTOS";
			worksheet.Cell(filaInicio, 5).Value = (totalDescuento);
			worksheet.Cell(filaInicio, 5).Style.NumberFormat.Format = "#,##0.00";
			filaInicio = filaInicio + 1;
			worksheet.Cell(filaInicio, 2).Value = 3;
			worksheet.Cell(filaInicio, 3).Value = "IMPORTE NETO A PAGAR";
			worksheet.Cell(filaInicio, 5).Value = (totalCobranza - totalDescuento);
			worksheet.Cell(filaInicio, 5).Style.NumberFormat.Format = "#,##0.00";
			filaInicio = filaInicio + 1;
			worksheet.Cell(filaInicio, 2).Value = 4;
			worksheet.Cell(filaInicio, 3).Value = "INGRESOS";
			worksheet.Cell(filaInicio, 5).Value = (totalIngresos);
			worksheet.Cell(filaInicio, 5).Style.NumberFormat.Format = "#,##0.00";
			filaInicio = filaInicio + 1;
			worksheet.Cell(filaInicio, 2).Value = 5;
			worksheet.Cell(filaInicio, 3).Value = "SALDO";
			worksheet.Cell(filaInicio, 5).Value = (totalCobranza - totalDescuento) - totalIngresos;
			worksheet.Cell(filaInicio, 5).Style.NumberFormat.Format = "#,##0.00";

			int filaInicioTitulo06 = filaInicio + 1;
			worksheet.Cell(filaInicioTitulo06, 2).Value = "DETALLE DE VENTAS";
			worksheet.Cell(filaInicioTitulo06, 2).Style.Font.Bold = true;
			int filaInicioCabe06 = filaInicioTitulo06 + 1;
			worksheet.Cell(filaInicioCabe04, 2).Value = "#";
			worksheet.Cell(filaInicioCabe04, 3).Value = "DOCUMENTO";
			worksheet.Cell(filaInicioCabe04, 4).Value = "VENTA";
			worksheet.Cell(filaInicioCabe04, 5).Value = "IMPORTE";

			double totalVenta = 0;
			filaInicio = filaInicioCabe06 + 1;
			int filaInicioDet = 1;
			foreach (var detalle in oDetalle) {

				worksheet.Cell(filaInicio, 2).Value = filaInicioDet;
				worksheet.Cell(filaInicio, 3).Value = detalle.cobranzaDocumentoTipoNombre + " " + detalle.cobranzaDocumentoSerie + "-" + detalle.cobranzaDocumentoCorrelativo;
				worksheet.Cell(filaInicio, 4).Value = detalle.cobranzadetalleVentaId;
				worksheet.Cell(filaInicio, 5).Value = detalle.cobranzaImportePago;
				worksheet.Cell(filaInicio, 5).Style.NumberFormat.Format = "#,##0.00";
				totalVenta += detalle.cobranzaImportePago;
				filaInicio++;
				filaInicioDet++;
			}

			worksheet.Cell(filaInicio, 4).Value = "TOTAL";
			worksheet.Cell(filaInicio, 4).Style.Font.Bold = true;
			worksheet.Cell(filaInicio, 5).Value = totalVenta;
			worksheet.Cell(filaInicio, 5).Style.NumberFormat.Format = "#,##0.00";

			var estiloDetalleTitulos = workbook.Style;
			estiloDetalleTitulos.Alignment.Horizontal = XLAlignmentHorizontalValues.Center;
			estiloDetalleTitulos.Alignment.Vertical = XLAlignmentVerticalValues.Center;
			estiloDetalleTitulos.Font.FontSize = 11;
			estiloDetalleTitulos.Font.Bold = true;
			estiloDetalleTitulos.Font.FontName = "Calibri";
			estiloDetalleTitulos.Border.BottomBorder = XLBorderStyleValues.Medium;
			estiloDetalleTitulos.Border.TopBorder = XLBorderStyleValues.Medium;
			estiloDetalleTitulos.Border.LeftBorder = XLBorderStyleValues.Medium;
			estiloDetalleTitulos.Border.RightBorder = XLBorderStyleValues.Medium;
			estiloDetalleTitulos.Border.BottomBorderColor = XLColor.Black;
			estiloDetalleTitulos.Border.TopBorderColor = XLColor.Black;
			estiloDetalleTitulos.Border.LeftBorderColor = XLColor.Black;
			estiloDetalleTitulos.Border.RightBorderColor = XLColor.Black;
			worksheet.Range("B" + filaInicioCabe01 + ":E" + filaInicioCabe01).Style = estiloDetalleTitulos;
			worksheet.Range("B" + filaInicioCabe02 + ":E" + filaInicioCabe02).Style = estiloDetalleTitulos;
			worksheet.Range("B" + filaInicioCabe03 + ":E" + filaInicioCabe03).Style = estiloDetalleTitulos;
			worksheet.Range("B" + filaInicioCabe04 + ":E" + filaInicioCabe04).Style = estiloDetalleTitulos;
			worksheet.Range("B" + filaInicioCabe05 + ":E" + filaInicioCabe05).Style = estiloDetalleTitulos;
			worksheet.Range("B" + filaInicioCabe06 + ":E" + filaInicioCabe06).Style = estiloDetalleTitulos;

			// Save and return path
			workbook.SaveAs(memoryStream);

			DateTime fechaAhora = DateTime.Now;
			string fechaString = $"{fechaAhora:dd}{fechaAhora:MM}{fechaAhora.Year}";
			memoryStream.Position = 0;
			var contentType = "application/octet-stream";
			var fileName = (int.TryParse(User.FindFirst("IdUsuario")?.Value, out var _uid) ? _uid : 0) + "_ResumenCobranza_" + fechaString + "_.xlsx";
			return File(memoryStream, contentType, fileName);

		}
		private async Task<List<BECorrelativos>> LiquidacionCodigo_Obtener() {
			var httpClient = httpClientFactory.CreateClient();			
			
			string RutaApi = configuration.GetValue<string>("Generales:RutaAPI")! + "generales/";
			httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", User.FindFirst("Token")?.Value ?? string.Empty);
			var response = await httpClient.GetAsync(RutaApi + "LiquidacionCorrelativo");
			if (response.StatusCode == HttpStatusCode.OK) {
				string jsonOK = await response.Content.ReadAsStringAsync();
				List<BECorrelativos> objOK = JsonConvert.DeserializeObject<List<BECorrelativos>>(jsonOK)!;

				return objOK;
			}
			string jsonError = await response.Content.ReadAsStringAsync();
			BEErrorApi objError = new BEErrorApi();
			if (!string.IsNullOrEmpty(jsonError))
				objError = JsonConvert.DeserializeObject<BEErrorApi>(jsonError) ?? objError;
			if (objError.errorCodigo == 0)
				objError.errorCodigo = (int)response.StatusCode;
			objError.errorDescripcion ??= response.ReasonPhrase;
			throw new HttpRequestException($"Error en LiquidacionCorrelativo ({objError.errorCodigo}): {objError.errorDescripcion}");
		}

        [HttpGet]
        [Route("exportCotizacionImprimir/{id}")]
        public async Task<FileStreamResult> exportCotizacionImprimir(string id)
        {
            var parametros = id.Split("_");
            var fechainicio = parametros[0];
            var fechafin = parametros[1];
            var origen = parametros[2];
            var destino = parametros[3];
            var personas = parametros[4];
			var arrProductoId = parametros[5];
			var arrProductosNombre = parametros[6];
			var arrPrecio = parametros[7];

            Stream XLSXGarantiaAdjunto = new MemoryStream(await exportCotizacionImpHmtlMemory(
                fechainicio.ToString(),
                fechafin.ToString(),
                origen.ToString(),
                destino.ToString(),
                int.Parse(personas),
                arrProductoId,
                arrProductosNombre,                
                arrPrecio));
            var XLSXGarantiaType = "application/octet-stream";
            var XLSXGarantiaNombreArchivo = "Cotizacion para " + destino.ToString().Trim() + ".pdf";
            return File(XLSXGarantiaAdjunto, XLSXGarantiaType, XLSXGarantiaNombreArchivo);
        }
        private async Task<byte[]> exportCotizacionImpHmtlMemory(string fechainicio, string fechafin, string origen, string destino,
            int personas, string arrProductoId, string arrProductosNombre, string arrPrecio)
        {
            string body = await exportCotizacionHmtl(fechainicio, fechafin, origen, destino, personas, arrProductoId, arrProductosNombre, arrPrecio);
            
            using (MemoryStream outputStream = new MemoryStream())
            {
                PdfWriter writer = new PdfWriter(outputStream);
                PdfDocument pdfDoc = new PdfDocument(writer);
                pdfDoc.SetDefaultPageSize(iText.Kernel.Geom.PageSize.A4);
                var converterProperties = new ConverterProperties();
                HtmlConverter.ConvertToPdf(body, pdfDoc, converterProperties);
                //outputStream.Position = 0;
                return outputStream.ToArray();
            }
        }

        private async Task<string> exportCotizacionHmtl(string fechainicio, string fechafin, string origen, string destino,
			int personas, string ProductoId, string ProductosNombre, string Precio)
        {

			string rutaAppSet = configuration.GetValue<string>("Generales:RutaWebImagenes")!;
			var rutaURLLogo = rutaAppSet + "logos/cabecera_cotizacion_eua.png";
			string[] arrProductoId = ProductoId.Split(',');
            string[] arrProductosNombre = ProductosNombre.Split(',');
            string[] arrPrecio = Precio.Split(',');	

            StringBuilder writer = new StringBuilder();
            #region "CABECERA"
            writer.AppendLine("<html>");
            writer.AppendLine("<head>");
            writer.AppendLine("<meta charset='UTF-8'>");
            writer.AppendLine("<meta name='viewport' content='width=device-width, initial-scale=1.0'>");
			writer.AppendLine("<title> Cotización EUA - EUROAMERICAN ASSISTANCE </title>");   
            writer.AppendLine("<style>");
            writer.AppendLine("body {font-family: Arial, sans-serif;margin: 20px;color: #333;}");
            writer.AppendLine("h1, h2, h3 {color: #f09000; /* Color azul para títulos */");
            writer.AppendLine("border-bottom: 2px solid #ccc;padding-bottom: 5px;margin-top: 20px;}");
            writer.AppendLine(".header-section {");
            writer.AppendLine("text-align: center;");
            writer.AppendLine("margin-bottom: 30px;");
            writer.AppendLine("}");
            writer.AppendLine(".header-logo {");
            writer.AppendLine("font-size: 2em;");
            writer.AppendLine("font-weight: bold;");
            writer.AppendLine("color: #e30013; /* Color rojo para el logo */");
            writer.AppendLine("}");
            writer.AppendLine(".tagline {");
            writer.AppendLine("font-style: italic;");
            writer.AppendLine("color: #555;");
            writer.AppendLine("margin-top: 5px;");
            writer.AppendLine("}");
            writer.AppendLine(".travel-data-table, .coverage-table {");
            writer.AppendLine("width: 100%;");
            writer.AppendLine("border-collapse: collapse;");
            writer.AppendLine("margin-bottom: 30px;");
            writer.AppendLine("}");
            writer.AppendLine(".travel-data-table th, .travel-data-table td,");
            writer.AppendLine(".coverage-table th, .coverage-table td {");
            writer.AppendLine("border: 1px solid #ddd;");
            writer.AppendLine("padding: 8px;");
            writer.AppendLine("text-align: left;");
            writer.AppendLine("}");
            writer.AppendLine(".coverage-table td {font-size:70%}");
            writer.AppendLine(".travel-data-table th, .coverage-table th {");
            writer.AppendLine("background-color: #f2f2f2;");
            writer.AppendLine("font-weight: bold;");
            writer.AppendLine("color: #333;");
            writer.AppendLine("}");
            writer.AppendLine(".coverage-table th:first-child {");
            writer.AppendLine("width: 30%; /* Ancho para la columna de Coberturas */");
            writer.AppendLine("}");
            writer.AppendLine(".coverage-table td:nth-child(n+3) {");
            writer.AppendLine("text-align: center; /* Centrar valores en las columnas de planes */");
            writer.AppendLine("white-space: nowrap; /* Evitar saltos de línea en valores de cobertura */");
            writer.AppendLine("}");
            writer.AppendLine(".prices-section {");
            writer.AppendLine("margin-bottom: 30px;");
            writer.AppendLine("}");
            writer.AppendLine(".price-list {");
            writer.AppendLine("list-style: none;");
            writer.AppendLine("padding: 0;");
            writer.AppendLine("display: flex;");
            writer.AppendLine("gap: 20px;");
            writer.AppendLine("justify-content: center;");
            writer.AppendLine("}");
            writer.AppendLine(".price-item {");
            writer.AppendLine("border: 1px solid #004aad;");
            writer.AppendLine("padding: 15px;");
            writer.AppendLine("text-align: center;");
            writer.AppendLine("border-radius: 5px;");
            writer.AppendLine("min-width: 150px;");
            writer.AppendLine("background-color: #f9f9ff;");
            writer.AppendLine("}");
            writer.AppendLine(".price-plan {");
            writer.AppendLine("font-weight: bold;");
            writer.AppendLine("font-size: 1.1em;");
            writer.AppendLine("color: #004aad;");
            writer.AppendLine("margin-bottom: 5px;");
            writer.AppendLine("}");
            writer.AppendLine(".price-value {");
            writer.AppendLine("font-size: 1.5em;");
            writer.AppendLine("font-weight: bolder;");
            writer.AppendLine("color: #e30013;");
            writer.AppendLine("}");

            writer.AppendLine("</style>");
            writer.AppendLine("</head>");

            writer.AppendLine("<body>");
			writer.AppendLine("<div class='header-section'>");
			writer.AppendFormat("<img src='{0}' width='99%' />", rutaURLLogo);
			writer.AppendLine("</div>");
			#endregion

			writer.AppendLine("<h1>Datos del Viaje</h1>");

            writer.AppendLine("<table class='travel-data-table'><thead><tr style='background-color:#e3e9ec'>");
            writer.AppendFormat("<td>Fecha de Salida</td><td>{0}</td></tr>", fechainicio);
            writer.AppendFormat("<tr><td>Fecha de Regreso</td><td>{0}</td></tr>", fechafin);
            writer.AppendFormat("<tr style='background-color:#e3e9ec'><td>Origen</td><td>{0}</td></tr>", origen);
            writer.AppendFormat("<tr><td>Destino</td><td>{0}</td></tr>", destino);
            writer.AppendFormat("<tr style='background-color:#e3e9ec'><td>Personas</td><td>{0}</td></tr></table>", personas);

			//writer.AppendLine("<div class='prices-section'>");
			//writer.AppendLine("<h2>Precios</h2>");
			//writer.AppendLine("<ul class='price-list'>");

           
            string strIds = "";
            string strTitulos = "";
			//string strPrecios = "";

            for (int j = 0; j < 3; j++)
			{
				
				
                //strPrecios = strPrecios + "<li class='price-item'><div class='price-plan'>" + arrProductosNombre[j] + "</div><div class='price-value'>" + arrPrecio[j] + "</div></li>";
                if (strIds == "")
                {
                    strIds = strIds + arrProductoId[j];
                }
                else
                {
                    strIds = strIds + "," + arrProductoId[j];
                }

                strTitulos = strTitulos + "<th  style='background-color:#004aad;color:#fff'>" + arrProductosNombre[j] + "</br> <span style='color:#f09000'> " + arrPrecio[j]  + " USD </span> </th>";	
            }

			//writer.AppendLine(strPrecios);
			// writer.AppendLine("</ul>");
			//writer.AppendLine("</div>");

			writer.AppendLine("<h1>Coberturas</h1>");


			List<BEProductoBeneficio> oResultadoProductoBeneficios = new List<BEProductoBeneficio>();
						

			writer.AppendLine("<table class='coverage-table'><thead><tr><th></th>");

            writer.AppendLine(strTitulos);

            writer.AppendLine("</tr></thead><tbody>");

            int intIdiomaBeneficio = 1;
            int int_contador = 1;
            string strFondo ="" ;
            int int_filas = 0;

            oResultadoProductoBeneficios = await ProductoBeneficioCoti_Obtener(strIds, intIdiomaBeneficio);
			
			foreach (BEProductoBeneficio item in oResultadoProductoBeneficios)
			{
				if (int_contador < 100)
				{
					if (int_filas % 2 == 0)
					{
						strFondo = "style='background-color:#e3e9ec'";
					}
					else
					{
						strFondo = "";
					}
					writer.AppendFormat("<tr {0} ><td>{1}</td><td>{2}</td><td>{3}</td><td>{4}</td></tr>", strFondo, item.beneficioNombre, item.coberturaProd01, item.coberturaProd02, item.coberturaProd03);

					int_filas = int_filas + 1;
				}
				int_contador = int_contador + 1;
			}

			writer.AppendLine("</tr>");
			writer.AppendLine("</tbody>");
			writer.AppendLine("</table>");

			writer.AppendLine("</body>");
            writer.AppendLine("</html>");
            return writer.ToString();
        }


        // Helper: chiama l'API CobranzaReporteObtener usando stringhe (non DateTime)
        private async Task<List<BEReporteCobranza>> CobranzaReporte_Obtener(string dte_pFechaInicio, string dte_pFechaFin, string dte_pFechaInicioPago, string dte_pFechaFinPago)
        {
            var httpClient = httpClientFactory.CreateClient();
            // Usa Uri.EscapeDataString per sicurezza sui parametri            
            string parametros = "?dte_pFechaInicio=" + dte_pFechaInicio + "&dte_pFechaFin=" + dte_pFechaFin + "&dte_pFechaInicioPago=" + dte_pFechaInicioPago
                + "&dte_pFechaFinPago=" + dte_pFechaFinPago;

            string RutaApi = configuration.GetValue<string>("Generales:RutaAPI")! + "Cobranza/";
            httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", User.FindFirst("Token")?.Value ?? string.Empty);
            var response = await httpClient.GetAsync(RutaApi + "CobranzaReporteObtener" + parametros);
            if (response.StatusCode == HttpStatusCode.OK)
            {
                string jsonOK = await response.Content.ReadAsStringAsync();
                List<BEReporteCobranza> objOK = JsonConvert.DeserializeObject<List<BEReporteCobranza>>(jsonOK)!;
                return objOK ?? new List<BEReporteCobranza>();
            }
            string jsonError = await response.Content.ReadAsStringAsync();
            BEErrorApi objError = new BEErrorApi();
            if (!string.IsNullOrEmpty(jsonError))
                objError = JsonConvert.DeserializeObject<BEErrorApi>(jsonError) ?? objError;
            if (objError.errorCodigo == 0)
                objError.errorCodigo = (int)response.StatusCode;
            objError.errorDescripcion ??= response.ReasonPhrase;
            throw new HttpRequestException($"Error en CobranzaReporteObtener ({objError.errorCodigo}): {objError.errorDescripcion}");
        }

       

        [HttpPost]
        [Route("ReporteCobranzaGenerarExcel")]
        public async Task<FileStreamResult> exportReporteCobranza([FromBody] BEReporteCobranzaExport pReporte)
        {
            var memoryStream = new MemoryStream();

            // Normalizza le date al formato YYYYMMDD (senza trattini)
            var fechaInicioApi = pReporte.fechaInicio;
            var fechaFinApi = pReporte.fechaFin;
            // se le date di pago non sono fornite, usiamo le date di inizio/fine
            var fechaPagoInicioApi = string.IsNullOrWhiteSpace(pReporte.fechaPagoInicio) ? pReporte.fechaInicio : pReporte.fechaPagoInicio;
            var fechaPagoFinApi = string.IsNullOrWhiteSpace(pReporte.fechaPagoFin) ? pReporte.fechaFin : pReporte.fechaPagoFin;

            // Chiama l'helper passando le date già formattate (YYYYMMDD)
            var registros = await CobranzaReporte_Obtener(fechaInicioApi, fechaFinApi, fechaPagoInicioApi, fechaPagoFinApi);

            using var workbook = new XLWorkbook();
            var worksheet = workbook.AddWorksheet("Cobranza");
            worksheet.ShowGridLines = false;

            // Stili base
            var estiloTitulo = workbook.Style;
            estiloTitulo.Font.Bold = true;
            estiloTitulo.Font.FontSize = 11;
            estiloTitulo.Alignment.Horizontal = XLAlignmentHorizontalValues.Center;
			estiloTitulo.Alignment.Vertical = XLAlignmentVerticalValues.Center;

			var estiloHeader = workbook.Style;
            estiloHeader.Font.Bold = true;
            estiloHeader.Alignment.Horizontal = XLAlignmentHorizontalValues.Center;
            estiloHeader.Fill.BackgroundColor = XLColor.FromArgb(226, 226, 226);
			estiloHeader.Border.BottomBorder = XLBorderStyleValues.Medium;
			estiloHeader.Border.TopBorder = XLBorderStyleValues.Medium;		
			estiloHeader.Border.LeftBorder = XLBorderStyleValues.Medium;
			estiloHeader.Border.RightBorder = XLBorderStyleValues.Medium;
			estiloHeader.Border.BottomBorderColor = XLColor.Black;
			estiloHeader.Border.TopBorderColor = XLColor.Black;
			estiloHeader.Border.LeftBorderColor = XLColor.Black;
			estiloHeader.Border.RightBorderColor = XLColor.Black;


			// Titolo
			worksheet.Range("B2:N2").Merge();
            worksheet.Cell("B2").Value = "REPORTE DE COBRANZA";
            worksheet.Range("B2:N2").Style = estiloTitulo;

            // Intestazioni (riga 4)
            int headerRow = 4;
            string[] headers = { "CLIENTE", "DOCUMENTO","TIPO DE LIQUIDACION",  "POR PAGAR", "COMISION", "INCENTIVO","PUBLICIDAD","DESCUENTO", "TOTAL","OBSERVACIONES", "MEDIO DE PAGO", "ID", "COBRADOR" };
            for (int i = 0; i < headers.Length; i++)
            {
                worksheet.Cell(headerRow, i + 2).Value = headers[i];
                worksheet.Cell(headerRow, i + 2).Style = estiloHeader;
            }

			// ✅ DEFINIR ANCHO DE COLUMNAS MANUALMENTE
			worksheet.Column(1).Width = 1;   // Columna vacía
			worksheet.Column(2).Width = 45;  // CLIENTE
			worksheet.Column(3).Width = 25;  // DOCUMENTO
			worksheet.Column(4).Width = 20;  // TIPO DE LIQUIDACION
			worksheet.Column(5).Width = 12;  // TOTAL
			worksheet.Column(6).Width = 12;  // COMISION
			worksheet.Column(7).Width = 12;  // INCENTIVO
			worksheet.Column(8).Width = 12;  // PUBLICIDAD
			worksheet.Column(9).Width = 12;  // DESCUENTO
			worksheet.Column(10).Width = 12; // POR PAGAR
			worksheet.Column(11).Width = 30; // OBSERVACIONES
			worksheet.Column(12).Width = 20; // MEDIO DE PAGO
			worksheet.Column(13).Width = 10; // ID
			worksheet.Column(14).Width = 25; // COBRADOR

			

			// Dati
			int fila = headerRow + 1;
            double sumaTotalBruto = 0, sumaComision = 0, sumaIncentivo = 0, sumaTotalAPagar = 0, sumaPublicidad = 0, sumaDescuento = 0, sumaPorForma = 0;
            var totalesPorForma = new Dictionary<string, double>(StringComparer.OrdinalIgnoreCase);

			// Estilo para filas alternadas (gris claro)
			var estiloFilaAlternada = workbook.Style;
			estiloFilaAlternada.Fill.BackgroundColor = XLColor.FromArgb(242, 242, 242); // Gris claro

			int filaIndex = 0; // Contador para alternar colores

			foreach (var r in registros)
            {
                worksheet.Cell(fila, 2).Value = r.cobranzaCliente; 
                worksheet.Cell(fila, 3).Value = r.cobranzaDocumentoTipoNombre + " " + r.cobranzaDocumentoSerie + " " + r.cobranzaDocumentoCorrelativo;
				worksheet.Cell(fila, 4).Value = r.cobranzaFormulaLiquidacion;
				worksheet.Cell(fila, 5).Value = r.cobranzaImportePago;
                worksheet.Cell(fila, 6).Value = r.cobranzaComision;
                worksheet.Cell(fila, 7).Value = r.cobranzaIncentivo;
				worksheet.Cell(fila, 8).Value = r.cobranzaNotaCredito;
				worksheet.Cell(fila, 9).Value = r.cobranzaDescuento;
				worksheet.Cell(fila, 10).Value = r.cobranzaImporteBruto;
				worksheet.Cell(fila, 11).Value = r.cobranzaObservacion;
				worksheet.Cell(fila, 12).Value = r.cobranzaPagoMedioNombre;
                worksheet.Cell(fila, 13).Value = r.cobranzaId;                
                worksheet.Cell(fila, 14).Value = r.cobranzaCobradorNombre;
				                
                worksheet.Cell(fila, 5).Style.NumberFormat.Format = "0.00";
                worksheet.Cell(fila, 6).Style.NumberFormat.Format = "0.00";
                worksheet.Cell(fila, 7).Style.NumberFormat.Format = "0.00";
				worksheet.Cell(fila, 8).Style.NumberFormat.Format = "0.00";
				worksheet.Cell(fila, 9).Style.NumberFormat.Format = "0.00";
				worksheet.Cell(fila, 10).Style.NumberFormat.Format = "0.00";

				// Aplicar color de fondo alternado
				if (filaIndex % 2 == 0)
				{
					// Fila par: aplicar fondo gris claro a todas las celdas de la fila
					worksheet.Range(fila, 2, fila, 14).Style.Fill.BackgroundColor = XLColor.FromArgb(242, 242, 242);
				}
				// Las filas impares mantienen el fondo blanco (predeterminado)

				sumaTotalBruto += r.cobranzaImportePago;
                sumaComision += r.cobranzaComision;
                sumaIncentivo += r.cobranzaIncentivo;
				sumaPublicidad += r.cobranzaPublicidad;
				sumaDescuento += r.cobranzaDescuento;
				sumaTotalAPagar += r.cobranzaImporteBruto;

                if (!string.IsNullOrEmpty(r.cobranzaPagoMedioNombre))
                {
                    if (!totalesPorForma.ContainsKey(r.cobranzaPagoMedioNombre)) totalesPorForma[r.cobranzaPagoMedioNombre] = 0;
                    totalesPorForma[r.cobranzaPagoMedioNombre] += r.cobranzaImportePago;
                }

                fila++;
				filaIndex++;
			}

			var estiloHeaderDerecha = workbook.Style;
			estiloHeaderDerecha.Font.Bold = true;
			estiloHeaderDerecha.Alignment.Horizontal = XLAlignmentHorizontalValues.Right;
			estiloHeaderDerecha.Fill.BackgroundColor = XLColor.FromArgb(226, 226, 226);
			estiloHeaderDerecha.Border.BottomBorder = XLBorderStyleValues.Medium;
			estiloHeaderDerecha.Border.TopBorder = XLBorderStyleValues.Medium;
			estiloHeaderDerecha.Border.LeftBorder = XLBorderStyleValues.Medium;
			estiloHeaderDerecha.Border.RightBorder = XLBorderStyleValues.Medium;
			estiloHeaderDerecha.Border.BottomBorderColor = XLColor.Black;
			estiloHeaderDerecha.Border.TopBorderColor = XLColor.Black;
			estiloHeaderDerecha.Border.LeftBorderColor = XLColor.Black;
			estiloHeaderDerecha.Border.RightBorderColor = XLColor.Black;

			// Totali
			int filaTotales = fila;
            worksheet.Cell(filaTotales, 2).Value = "Total";			
			worksheet.Cell(filaTotales, 2).Style = estiloHeaderDerecha;
			worksheet.Cell(filaTotales, 2).Style.Font.Bold = true;
			worksheet.Cell(filaTotales, 3).Style = estiloHeaderDerecha;
			worksheet.Cell(filaTotales, 4).Style = estiloHeaderDerecha;

			worksheet.Cell(filaTotales, 5).Value = sumaTotalBruto;
			worksheet.Cell(filaTotales, 5).Style.NumberFormat.Format = "0.00";			
			worksheet.Cell(filaTotales, 5).Style = estiloHeaderDerecha;
			worksheet.Cell(filaTotales, 5).Style.Font.Bold = true;

			worksheet.Cell(filaTotales, 6).Value = sumaComision;
			worksheet.Cell(filaTotales, 6).Style.NumberFormat.Format = "0.00";			
			worksheet.Cell(filaTotales, 6).Style = estiloHeaderDerecha;
			worksheet.Cell(filaTotales, 6).Style.Font.Bold = true;

			worksheet.Cell(filaTotales, 7).Value = sumaIncentivo;
			worksheet.Cell(filaTotales, 7).Style.NumberFormat.Format = "0.00";
			worksheet.Cell(filaTotales, 7).Style = estiloHeaderDerecha;
			worksheet.Cell(filaTotales, 7).Style.Font.Bold = true;

			worksheet.Cell(filaTotales, 8).Value = sumaPublicidad;
			worksheet.Cell(filaTotales, 8).Style.NumberFormat.Format = "0.00";
			worksheet.Cell(filaTotales, 8).Style = estiloHeaderDerecha;
			worksheet.Cell(filaTotales, 8).Style.Font.Bold = true;

			worksheet.Cell(filaTotales, 9).Value = sumaDescuento;
			worksheet.Cell(filaTotales, 9).Style.NumberFormat.Format = "0.00";
			worksheet.Cell(filaTotales, 9).Style = estiloHeaderDerecha;
			worksheet.Cell(filaTotales, 9).Style.Font.Bold = true;

			worksheet.Cell(filaTotales, 10).Value = sumaTotalAPagar;
            worksheet.Cell(filaTotales, 10).Style.NumberFormat.Format = "0.00";
			worksheet.Cell(filaTotales, 10).Style = estiloHeaderDerecha;
			worksheet.Cell(filaTotales, 10).Style.Font.Bold = true;

			var estiloDetalleImp = workbook.Style; // Or get from a specific range's style			
			estiloDetalleImp.Alignment.Horizontal = XLAlignmentHorizontalValues.Right;
			estiloDetalleImp.Alignment.Vertical = XLAlignmentVerticalValues.Center;
			estiloDetalleImp.Border.BottomBorder = XLBorderStyleValues.Medium;
			estiloDetalleImp.Border.TopBorder = XLBorderStyleValues.Medium;
			estiloDetalleImp.Border.LeftBorder = XLBorderStyleValues.Medium;
			estiloDetalleImp.Border.RightBorder = XLBorderStyleValues.Medium;
			estiloDetalleImp.Border.BottomBorderColor = XLColor.Black;
			estiloDetalleImp.Border.TopBorderColor = XLColor.Black;
			estiloDetalleImp.Border.LeftBorderColor = XLColor.Black;
			estiloDetalleImp.Border.RightBorderColor = XLColor.Black;


			int filaForma = filaTotales + 2;
            foreach (var kv in totalesPorForma)
            {
                worksheet.Cell(filaForma, 2).Value = kv.Key;
                worksheet.Cell(filaForma, 3).Value = kv.Value;
                worksheet.Cell(filaForma, 3).Style.NumberFormat.Format = "0.00";
				worksheet.Cell(filaForma, 2).Style = estiloDetalleImp;
				worksheet.Cell(filaForma, 3).Style = estiloDetalleImp;
				filaForma++;
				sumaPorForma = sumaPorForma + kv.Value;

			}

			worksheet.Cell(filaForma, 2).Value = "TOTAL";
			worksheet.Cell(filaForma, 3).Value = sumaPorForma;
			worksheet.Cell(filaForma, 3).Style.NumberFormat.Format = "0.00";
			worksheet.Cell(filaForma, 2).Style = estiloDetalleImp;
			worksheet.Cell(filaForma, 3).Style = estiloDetalleImp;

			if (!string.IsNullOrEmpty(pReporte.usuarioNombre))
            {
                worksheet.Cell(filaForma + 2, 11).Value = "Usuario : " + pReporte.usuarioNombre + " " + DateTime.Now.ToString("dd/MM/yyyy");
			}

            worksheet.Range(headerRow, 2, headerRow, 11).Style = estiloHeader;
            //worksheet.Columns().AdjustToContents();

            workbook.SaveAs(memoryStream);
            DateTime fechaAhora = DateTime.Now;
            string fechaString = $"{fechaAhora:dd}{fechaAhora:MM}{fechaAhora.Year}";
            memoryStream.Position = 0;
            var contentType = "application/octet-stream";
            var fileName = (pReporte.agenciaId ?? "Cobranza") + "_ReporteDeCobranza_" + fechaString + "_.xlsx";
            return File(memoryStream, contentType, fileName);
        }
    }
}
