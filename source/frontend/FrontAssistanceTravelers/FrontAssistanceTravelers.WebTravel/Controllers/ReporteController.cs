using FrontAssistanceTravelers.WebTravel.Models.General;
using FrontAssistanceTravelers.WebTravel.Models.Procesos;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System.Configuration;
using System.Globalization;
using System.IO;
using System.Net.Http.Headers;
using System.Net;
using System.Text.Json;
using JsonSerializer = System.Text.Json.JsonSerializer;
using FrontAssistanceTravelers.WebTravel.Models.Reporte;
using ClosedXML.Excel;

namespace FrontAssistanceTravelers.WebTravel.Controllers {
	[Authorize]
	public class ReporteController : Controller {
		public IActionResult Index() {
			return View();
		}
		public IActionResult Lista01AgenciaVentas() {
			return View();
		}
		public IActionResult Lista02PromotorVentas() {
			return View();
		}
		public IActionResult Lista03PaisVentas() {
			return View();
		}
		public IActionResult Lista04ProductoVentas() {
			return View();
		}
        public IActionResult Lista05RangoEdadVentas() {
            return View();
        }
		public IActionResult ListaCobranzaReporte() {
			return View();
		}
		public IActionResult ListaResumenCobranza()
		{
			return View();
		}
		public IActionResult Lista06AgenciaAnualVentas() {
			return View();
		}
		public IActionResult Lista07PromotorAnualVentas() {
			return View();
		}
		public IActionResult Lista08PromotorDiarioVentas() {
			return View();
		}
		public IActionResult Lista09PaisAnualVentas() {
			return View();
		}
		public IActionResult PersonalizadoVentas() {
			return View();
		}

		/// <summary>
		/// Genera un único Excel, con encabezado y formato de tabla, que incluye los datos
		/// (y opcionalmente una imagen fija del gráfico) de cada periodo recibido en un mismo libro,
		/// para reemplazar la exportación anterior que generaba un archivo separado por periodo.
		/// </summary>
		[HttpPost]
		[Route("ExportarExcelDosPeriodos")]
		public IActionResult ExportarExcelDosPeriodos([FromBody] BEReporteExportarDosPeriodos pReporte) {
			if (pReporte?.periodos == null || pReporte.periodos.Count == 0) {
				return BadRequest("No hay periodos para exportar.");
			}

			var memoryStream = new MemoryStream();
			using (var workbook = new XLWorkbook()) {
				workbook.Properties.Author = "EuroAmericanAssistance";
				workbook.Properties.Title = pReporte.titulo ?? "Reporte";
				workbook.Properties.Subject = pReporte.titulo ?? "Reporte";
				workbook.Properties.Comments = "Reporte generado automaticamente desde el sistema de gestion de EUROAMERICAN.";

				var worksheet = workbook.Worksheets.Add(LimpiarNombreHoja(pReporte.titulo ?? "Reporte"));
				worksheet.ShowGridLines = false;

				var estiloTitulo = workbook.Style;
				estiloTitulo.Font.Bold = true;
				estiloTitulo.Font.FontSize = 14;
				estiloTitulo.Font.FontName = "Calibri";

				var estiloSubtitulo = workbook.Style;
				estiloSubtitulo.Font.Bold = true;
				estiloSubtitulo.Font.FontSize = 11;
				estiloSubtitulo.Font.FontName = "Calibri";
				estiloSubtitulo.Fill.BackgroundColor = XLColor.FromHtml("#DCE6F1");

				const int colInicio = 2;
				int fila = 2;
				worksheet.Cell(fila, colInicio).Value = pReporte.titulo ?? "Reporte";
				worksheet.Cell(fila, colInicio).Style = estiloTitulo;
				fila += 2;

				int tablaIndex = 0;
				foreach (var periodo in pReporte.periodos) {
					tablaIndex++;
					worksheet.Cell(fila, colInicio).Value = "Periodo: " + periodo.etiqueta;
					worksheet.Cell(fila, colInicio).Style = estiloSubtitulo;
					fila++;

					if (!string.IsNullOrEmpty(periodo.imagenBase64)) {
						var bytesImagen = Convert.FromBase64String(periodo.imagenBase64);
						using var imgStream = new MemoryStream(bytesImagen);
						var imagen = worksheet.AddPicture(imgStream).MoveTo(worksheet.Cell(fila, colInicio));
						fila += (imagen.Height / 20) + 2;
					}

					if (periodo.columnas != null && periodo.columnas.Count > 0 && periodo.filas != null) {
						int filaHeader = fila;
						for (int c = 0; c < periodo.columnas.Count; c++) {
							worksheet.Cell(filaHeader, colInicio + c).Value = periodo.columnas[c];
						}

						int filaDato = filaHeader + 1;
						foreach (var filaValores in periodo.filas) {
							for (int c = 0; c < periodo.columnas.Count; c++) {
								var texto = c < filaValores.Count ? (filaValores[c] ?? string.Empty) : string.Empty;
								var celda = worksheet.Cell(filaDato, colInicio + c);
								if (c == pReporte.columnaImporte && double.TryParse(texto.Replace(",", ""), NumberStyles.Any, CultureInfo.InvariantCulture, out var numero)) {
									celda.Value = numero;
									celda.Style.NumberFormat.Format = "#,##0.00";
								} else {
									celda.Value = texto;
								}
							}
							filaDato++;
						}

						if (periodo.filas.Count > 0) {
							var rangoTabla = worksheet.Range(filaHeader, colInicio, filaDato - 1, colInicio + periodo.columnas.Count - 1);
							rangoTabla.CreateTable("Tabla_" + tablaIndex).Theme = XLTableTheme.TableStyleMedium9;
						}

						fila = filaDato + 2;
					} else {
						fila += 2;
					}
				}

				worksheet.Columns().AdjustToContents();
				workbook.SaveAs(memoryStream);
			}

			memoryStream.Position = 0;
			var fechaAhora = DateTime.Now;
			var fileName = $"{LimpiarNombreArchivo(pReporte.titulo ?? "Reporte")}_{fechaAhora:ddMMyyyy}.xlsx";
			return File(memoryStream, "application/octet-stream", fileName);
		}

		private static string LimpiarNombreHoja(string nombre) {
			foreach (var c in new[] { ':', '\\', '/', '?', '*', '[', ']' }) {
				nombre = nombre.Replace(c, ' ');
			}
			return nombre.Length > 31 ? nombre.Substring(0, 31) : nombre;
		}

		private static string LimpiarNombreArchivo(string nombre) {
			foreach (var c in Path.GetInvalidFileNameChars()) {
				nombre = nombre.Replace(c, '_');
			}
			return nombre.Replace(' ', '_');
		}
	}
}
