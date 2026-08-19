using FrontAssistanceTravelers.WebTravel.Models.General;
using FrontAssistanceTravelers.WebTravel.Models.Procesos;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System.Configuration;
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
	}
}
