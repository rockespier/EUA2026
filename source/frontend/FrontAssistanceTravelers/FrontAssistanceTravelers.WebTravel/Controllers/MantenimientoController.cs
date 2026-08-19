using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FrontAssistanceTravelers.WebTravel.Controllers {
	[Authorize]
	public class MantenimientoController : Controller {
		public IActionResult Index() {
			return View();
		}		
		public IActionResult ListaParametros() {
			return View();
		}		
		public IActionResult ListaProductos() {
			return View();
		}

		public IActionResult ListaSolicitudTipo() {
			return View();
		}
		public IActionResult ListaUbigeo() {
			return View();
		}
		public IActionResult ListaPaisPromocion() {
			return View();
		}
		public IActionResult ListaAgenciaProducto() {
			return View();
		}
	}
}
