using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FrontAssistanceTravelers.WebTravel.Controllers {
	[Authorize]
	public class TecnicoController : Controller {
		public IActionResult Index() {
			return View();
		}
		public IActionResult EditarActividades() {
			return View();
		}	
	}
}
