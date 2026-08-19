using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FrontAssistanceTravelers.WebTravel.Controllers
{
	[Authorize]
	public class HelpersController : Controller
	{
		public IActionResult Vacia()
		{
			return View();
		}
		public IActionResult Firma()
		{
			return View();
		}
	}
}
