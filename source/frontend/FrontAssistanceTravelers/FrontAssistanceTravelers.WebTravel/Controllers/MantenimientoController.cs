using ClosedXML.Excel;
using FrontAssistanceTravelers.WebTravel.Models.Procesos;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System.Net;
using System.Net.Http.Headers;
using System.Text;

namespace FrontAssistanceTravelers.WebTravel.Controllers
{
    [Authorize]
    public class MantenimientoController : Controller
    {
        private readonly IConfiguration configuration;
        private readonly IHttpClientFactory httpClientFactory;
        public MantenimientoController(IConfiguration configuration, IHttpClientFactory httpClientFactory)
        {
            this.configuration = configuration;
            this.httpClientFactory = httpClientFactory;
        }
        public IActionResult Index()
        {
            return View();
        }
        public IActionResult ListaParametros()
        {
            return View();
        }
        public IActionResult ListaProductos()
        {
            return View();
        }

        public IActionResult ListaSolicitudTipo()
        {
            return View();
        }
        public IActionResult ListaUbigeo()
        {
            return View();
        }
        public IActionResult ListaPaisPromocion()
        {
            return View();
        }
        public IActionResult ListaAgenciaProducto()
        {
            return View();
        }

        // ===== Importación masiva por Excel: Tarifas y Beneficios de un producto =====
        private const int FilaInicioDatos = 4;

        private HttpClient CrearClienteApi()
        {
            var httpClient = httpClientFactory.CreateClient();
            httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", User.FindFirst("Token")?.Value ?? string.Empty);
            return httpClient;
        }
        private string RutaApiMantenimiento() => configuration.GetValue<string>("Generales:RutaAPI")! + "mantenimiento/";

        private async Task<JArray> ObtenerListaApi(string url)
        {
            var response = await CrearClienteApi().GetAsync(url);
            if (response.StatusCode != HttpStatusCode.OK) return new JArray();
            return JArray.Parse(await response.Content.ReadAsStringAsync());
        }
        private async Task<(bool ok, string error)> PostApi(string metodo, object body)
        {
            var contenido = new StringContent(JsonConvert.SerializeObject(body), Encoding.UTF8, "application/json");
            var response = await CrearClienteApi().PostAsync(RutaApiMantenimiento() + metodo, contenido);
            if (response.StatusCode == HttpStatusCode.OK) return (true, "");
            string desc = response.ReasonPhrase ?? "Error";
            try
            {
                var obj = JObject.Parse(await response.Content.ReadAsStringAsync());
                desc = obj["errorDescripcion"]?.ToString() ?? desc;
            }
            catch { }
            return (false, desc);
        }
        private static FileStreamResult ArchivoErrores(StringBuilder errores, string nombre)
        {
            var ms = new MemoryStream(new UTF8Encoding(true).GetBytes(errores.ToString()));
            return new FileStreamResult(ms, "text/plain") { FileDownloadName = nombre };
        }
        private static FileStreamResult ArchivoOk()
        {
            return new FileStreamResult(new MemoryStream(new byte[100]), "application/octet-stream") { FileDownloadName = "ok.xlsx" };
        }
        private FileStreamResult ArmarPlantilla(string hoja, string titulo, string nombreArchivo, string[] columnas, IEnumerable<object[]> filas, int[] anchos)
        {
            var ms = new MemoryStream();
            using (var workbook = new XLWorkbook())
            {
                workbook.Properties.Author = "EuroAmericanAssistance";
                workbook.Properties.Title = titulo;
                var ws = workbook.Worksheets.Add(hoja);
                ws.ShowGridLines = false;
                ws.Cell(1, 1).Value = titulo;
                ws.Cell(1, 1).Style.Font.Bold = true;
                ws.Cell(2, 1).Value = "No modifique el orden de las columnas. Id existente = actualiza; Id = 0 = crea nuevo registro. Los datos van desde la fila 4.";
                for (int c = 0; c < columnas.Length; c++)
                {
                    ws.Cell(3, c + 1).Value = columnas[c];
                    ws.Column(c + 1).Width = anchos[c];
                }
                ws.Row(3).Style.Font.Bold = true;
                int r = FilaInicioDatos;
                foreach (var fila in filas)
                {
                    for (int c = 0; c < fila.Length; c++)
                    {
                        if (fila[c] is double d) ws.Cell(r, c + 1).Value = d;
                        else if (fila[c] is int i) ws.Cell(r, c + 1).Value = i;
                        else ws.Cell(r, c + 1).Value = fila[c]?.ToString() ?? "";
                    }
                    r++;
                }
                workbook.SaveAs(ms);
            }
            ms.Position = 0;
            return File(ms, "application/octet-stream", nombreArchivo);
        }

        [HttpGet]
        [Route("descargarPlantillaProductoTarifas")]
        public async Task<IActionResult> DescargarPlantillaProductoTarifas(int productoId)
        {
            var lista = await ObtenerListaApi(RutaApiMantenimiento() + "ProductoTarifasObtener?int_pProductoID=" + productoId + "&int_pTarifaID=0");
            var filas = lista.Select(t => new object[] {
                (int)(t["tarifaId"] ?? 0), (int)(t["tarifaNumeroDiasMinimo"] ?? 0), (int)(t["tarifaNumeroDiasMaximo"] ?? 0),
                (double)(t["tarifaImporte"] ?? 0), (double)(t["tarifaIncentivo"] ?? 0), (double)(t["tarifaPublicidad"] ?? 0) });
            return ArmarPlantilla("Tarifas", "Plantilla de importación masiva - Tarifas", "Tarifas_Plantilla.xlsx",
                new[] { "TarifaId", "DiasMinimo", "DiasMaximo", "Importe", "Incentivo", "Publicidad" }, filas, new[] { 12, 14, 14, 14, 14, 14 });
        }

        [HttpGet]
        [Route("descargarPlantillaProductoBeneficios")]
        public async Task<IActionResult> DescargarPlantillaProductoBeneficios(int productoId, int idiomaId = 1)
        {
            var lista = await ObtenerListaApi(RutaApiMantenimiento() + "ProductoBeneficiosObtener?int_pProductoID=" + productoId + "&int_pBeneficioID=0&int_pBeneficioIdioma=" + idiomaId);
            var filas = lista.Select(b => new object[] {
                (int)(b["beneficioId"] ?? 0), (int)(b["beneficioOrden"] ?? 0), (string?)b["beneficioNombre"] ?? "", (string?)b["beneficioImporte"] ?? "" });
            return ArmarPlantilla("Beneficios", "Plantilla de importación masiva - Beneficios", "Beneficios_Plantilla.xlsx",
                new[] { "BeneficioId", "Orden", "Descripcion", "Cobertura" }, filas, new[] { 14, 10, 60, 40 });
        }

        private static bool LeerEntero(IXLRow row, int col, string letra, StringBuilder err, out int valor)
        {
            valor = 0;
            var cell = row.Cell(col);
            if (cell.IsEmpty()) { err.AppendLine($"Columna ({letra}), Fila ({row.RowNumber()}): no puede estar vacía."); return false; }
            if (cell.DataType != XLDataType.Number || cell.GetDouble() % 1 != 0 || cell.GetDouble() < 0)
            {
                err.AppendLine($"Columna ({letra}), Fila ({row.RowNumber()}): debe ser un número entero mayor o igual a 0."); return false;
            }
            valor = (int)cell.GetDouble();
            return true;
        }
        private static bool LeerDecimal(IXLRow row, int col, string letra, StringBuilder err, out double valor)
        {
            valor = 0;
            var cell = row.Cell(col);
            if (cell.IsEmpty()) { err.AppendLine($"Columna ({letra}), Fila ({row.RowNumber()}): no puede estar vacía."); return false; }
            if (cell.DataType != XLDataType.Number || cell.GetDouble() < 0)
            {
                err.AppendLine($"Columna ({letra}), Fila ({row.RowNumber()}): debe ser un número mayor o igual a 0."); return false;
            }
            valor = cell.GetDouble();
            return true;
        }
        private static bool LeerTexto(IXLRow row, int col, string letra, StringBuilder err, out string valor)
        {
            valor = row.Cell(col).GetString().Trim();
            if (valor.Length < 2 || valor.Length > 250)
            {
                err.AppendLine($"Columna ({letra}), Fila ({row.RowNumber()}): debe tener entre 2 y 250 caracteres."); return false;
            }
            return true;
        }
        private static IEnumerable<IXLRow> FilasDatos(XLWorkbook wb)
        {
            return wb.Worksheet(1).RowsUsed().Where(r => r.RowNumber() >= FilaInicioDatos);
        }

        [HttpPost]
        [Route("importarExcelProductoTarifas")]
        public async Task<IActionResult> ImportarProductoTarifas([FromBody] BEImportarProductoExcel pImportar)
        {
            var errores = new StringBuilder();
            var aProcesar = new List<(int fila, object body)>();
            try
            {
                byte[] bytes = Convert.FromBase64String(pImportar.base64archivo!.Trim());
                var existentes = (await ObtenerListaApi(RutaApiMantenimiento() + "ProductoTarifasObtener?int_pProductoID=" + pImportar.productoId + "&int_pTarifaID=0"))
                    .Select(t => (int)(t["tarifaId"] ?? 0)).ToHashSet();
                int idUsuario = int.TryParse(User.FindFirst("IdUsuario")?.Value, out var u) ? u : 0;
                using var wb = new XLWorkbook(new MemoryStream(bytes));
                foreach (var row in FilasDatos(wb))
                {
                    int n0 = errores.Length;
                    bool ok = LeerEntero(row, 1, "A", errores, out int id) & LeerEntero(row, 2, "B", errores, out int dMin) & LeerEntero(row, 3, "C", errores, out int dMax)
                        & LeerDecimal(row, 4, "D", errores, out double imp) & LeerDecimal(row, 5, "E", errores, out double inc) & LeerDecimal(row, 6, "F", errores, out double pub);
                    if (!ok) continue;
                    if (id != 0 && !existentes.Contains(id)) errores.AppendLine($"Fila ({row.RowNumber()}): TarifaId {id} no pertenece al producto.");
                    if (dMin > dMax) errores.AppendLine($"Fila ({row.RowNumber()}): DiasMinimo no puede ser mayor que DiasMaximo.");
                    if (errores.Length == n0) aProcesar.Add((row.RowNumber(), new
                    {
                        tarifaId = id,
                        tarifaProductoId = pImportar.productoId,
                        tarifaNumeroDiasMinimo = dMin,
                        tarifaNumeroDiasMaximo = dMax,
                        tarifaImporte = imp,
                        tarifaIncentivo = inc,
                        tarifaPublicidad = pub,
                        tarifaCreadoUsuarioId = idUsuario
                    }));
                }
                if (aProcesar.Count == 0 && errores.Length == 0) errores.AppendLine("No existe información en el Excel.");
            }
            catch (Exception ex)
            {
                errores.AppendLine("Error al procesar el archivo: " + ex.Message);
            }
            if (errores.Length > 0) return ArchivoErrores(errores, "TarifasErrores.txt");
            foreach (var (fila, body) in aProcesar)
            {
                var (ok, error) = await PostApi("ProductoTarifaProcesar", body);
                if (!ok) errores.AppendLine($"Fila ({fila}) ERROR: {error}");
            }
            return errores.Length > 0 ? ArchivoErrores(errores, "TarifasErrores.txt") : ArchivoOk();
        }

        [HttpPost]
        [Route("importarExcelProductoBeneficios")]
        public async Task<IActionResult> ImportarProductoBeneficios([FromBody] BEImportarProductoExcel pImportar)
        {
            var errores = new StringBuilder();
            var aProcesar = new List<(int fila, object body)>();
            int idioma = pImportar.idiomaId > 0 ? pImportar.idiomaId : 1;
            try
            {
                byte[] bytes = Convert.FromBase64String(pImportar.base64archivo!.Trim());
                var existentes = (await ObtenerListaApi(RutaApiMantenimiento() + "ProductoBeneficiosObtener?int_pProductoID=" + pImportar.productoId + "&int_pBeneficioID=0&int_pBeneficioIdioma=" + idioma))
                    .Select(b => (int)(b["beneficioId"] ?? 0)).ToHashSet();
                int idUsuario = int.TryParse(User.FindFirst("IdUsuario")?.Value, out var u) ? u : 0;
                using var wb = new XLWorkbook(new MemoryStream(bytes));
                foreach (var row in FilasDatos(wb))
                {
                    int n0 = errores.Length;
                    bool ok = LeerEntero(row, 1, "A", errores, out int id) & LeerEntero(row, 2, "B", errores, out int orden)
                        & LeerTexto(row, 3, "C", errores, out string desc) & LeerTexto(row, 4, "D", errores, out string cob);
                    if (!ok) continue;
                    if (id != 0 && !existentes.Contains(id)) errores.AppendLine($"Fila ({row.RowNumber()}): BeneficioId {id} no pertenece al producto/idioma.");
                    if (errores.Length == n0) aProcesar.Add((row.RowNumber(), new
                    {
                        beneficioId = id,
                        beneficioProductoId = pImportar.productoId,
                        beneficioOrden = orden,
                        beneficioNombre = desc,
                        beneficioImporte = cob,
                        beneficioCreadoUsuarioId = idUsuario,
                        beneficioIdiomaId = idioma
                    }));
                }
                if (aProcesar.Count == 0 && errores.Length == 0) errores.AppendLine("No existe información en el Excel.");
            }
            catch (Exception ex)
            {
                errores.AppendLine("Error al procesar el archivo: " + ex.Message);
            }
            if (errores.Length > 0) return ArchivoErrores(errores, "BeneficiosErrores.txt");
            foreach (var (fila, body) in aProcesar)
            {
                var (ok, error) = await PostApi("ProductoBeneficioProcesar", body);
                if (!ok) errores.AppendLine($"Fila ({fila}) ERROR: {error}");
            }
            return errores.Length > 0 ? ArchivoErrores(errores, "BeneficiosErrores.txt") : ArchivoOk();
        }
    }
}
