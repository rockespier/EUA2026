using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FrontAssistanceTravelers.WebTravel.Controllers
{
	[Authorize]
	public class SeguridadController : Controller
	{
		public IActionResult Index()
		{
			return View();
		}


		public IActionResult ListaUsuarios()
		{
			return View();
		}

	

		public IActionResult ListaPerfiles() {
			return View();
		}

	

		public IActionResult EditPermisos()
		{
			return View();
		}

		public IActionResult ListaAgencias() {
			return View();
		}

		public IActionResult ListaPaises() {
			return View();
		}

		public IActionResult ListaSupervisorPromotor() {
			return View();
		}

		public IActionResult ListaFacturaAgencia() {
			return View();
		}
	}
}
