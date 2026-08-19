using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using System.Security.Claims;

namespace FrontAssistanceTravelers.WebTravel.Controllers
{
    [Authorize]
    public class DashboardController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }

        public IActionResult IndexJefe()
        {
            return View();
        }
       public IActionResult GraficoPromotor() {
			return View();
		}
		public IActionResult GraficoAgencia() {
			return View();
		}
	}
}
