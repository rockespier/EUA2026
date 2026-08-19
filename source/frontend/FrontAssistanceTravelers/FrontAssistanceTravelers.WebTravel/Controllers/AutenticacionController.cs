using Microsoft.AspNetCore.Mvc;

using System.Security.Claims;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using FrontAssistanceTravelers.WebTravel.Models;
using FrontAssistanceTravelers.WebTravel.Models.Usuarios;

using Microsoft.AspNetCore.Mvc.RazorPages;
using Newtonsoft.Json;
using System.Net.Http.Headers;
using System.Net;
using System;
using System.Text;
using System.Text.Json;
using FrontAssistanceTravelers.WebTravel.Models.General;


namespace FrontAssistanceTravelers.WebTravel.Controllers
{
    public class AutenticacionController : Controller
    {
        private readonly IConfiguration configuration;
        private readonly IHttpClientFactory httpClientFactory;

        public AutenticacionController(IConfiguration configuration, IHttpClientFactory httpClientFactory)
        {
            this.configuration = configuration;
            this.httpClientFactory = httpClientFactory;
        }
        public IActionResult Acceso(string returnUrl)
        {
            ViewBag.ReturnUrl = returnUrl;
            return View();
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Acceso(VMLogin model, string returnUrl)
        {
            var httpClient = httpClientFactory.CreateClient();
            string RutaApi = configuration.GetValue<string>("Generales:RutaAPI")!;
            string RutaApiImagenes = configuration.GetValue<string>("Generales:RutaWebImagenes")!;
            string RutaApiAcceso = RutaApi! + "accesos/";

            var loginBody = new { pUsuario = model.inpAccesoAcceso, pClave = model.inpAccesoPassword };
            var loginContent = new StringContent(
                System.Text.Json.JsonSerializer.Serialize(loginBody),
                Encoding.UTF8, "application/json");

            var response = await httpClient.PostAsync(RutaApiAcceso + "token", loginContent);
            if (response.StatusCode == HttpStatusCode.OK)
            {
                var tokenContent = await response.Content.ReadAsStringAsync();

                httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", tokenContent);

                var loginUserContent = new StringContent(
                    System.Text.Json.JsonSerializer.Serialize(loginBody),
                    Encoding.UTF8, "application/json");
                var loginResponse = await httpClient.PostAsync(RutaApiAcceso + "Login", loginUserContent);
                var json = await loginResponse.Content.ReadAsStringAsync();
                BEUsuario objBEUsuario = JsonConvert.DeserializeObject<BEUsuario>(json)!;

                string SafeStr(object? o) => o?.ToString() ?? string.Empty;

                if (!int.TryParse(objBEUsuario.paisDocumentoFormato, out var formato)) formato = 0;

                List<Claim> claims = new List<Claim>() {
                    new Claim(ClaimTypes.NameIdentifier, SafeStr(objBEUsuario.usuarioEmail)),
                    new Claim(ClaimTypes.Name, SafeStr(objBEUsuario.usuarioNombre)),
                    new Claim(ClaimTypes.Role, SafeStr(objBEUsuario.usuarioPerfilId)),
                    new Claim("RoleNombre", SafeStr(objBEUsuario.usuarioPerfilNombre)),
                    new Claim("IdUsuario", SafeStr(objBEUsuario.usuarioId)),
                    new Claim("AccesoUsuario", SafeStr(model.inpAccesoAcceso)),
                    new Claim("IdPais", SafeStr(objBEUsuario.usuarioAgenciaPaisId)),
                    new Claim("IdEmpresa", SafeStr(objBEUsuario.usuarioEmpresaId)),
                    new Claim("DesEmpresa", SafeStr(objBEUsuario.usuarioEmpresaNombre)),
                    new Claim("BackApi", SafeStr(RutaApi)),
                    new Claim("Origen", SafeStr(objBEUsuario.usuarioOrigen)),
                    new Claim("IdAgenciaUsuario", SafeStr(objBEUsuario.usuarioAgenciaId)),
                    new Claim("IdAgenciaPais", SafeStr(objBEUsuario.usuarioAgenciaPaisId)),
                    new Claim("Token", SafeStr(tokenContent)),
                    new Claim("BackApiImagenes", SafeStr(RutaApiImagenes)),
                    new Claim("PaisDocumentoFormato", formato.ToString()),
                };

                var perfilId = objBEUsuario.usuarioPerfilId;
                var usuarioId = objBEUsuario.usuarioId;

                try
                {
                    string RutaApiAccesoMenu = RutaApi! + "generales/";
                    string menuIdJefe = configuration.GetValue<string>("Generales:DashBIdJefe")!;
                    string parametrosMenuJefe = "?pIdUsuario=" + usuarioId.ToString() + "&pMenuId=" + menuIdJefe;

                    var jsonAccesoJef = await httpClient.GetStringAsync(RutaApiAccesoMenu + "UsuarioValidarMenuObtener" + parametrosMenuJefe);
                    BEResultado objResultado = JsonConvert.DeserializeObject<BEResultado>(jsonAccesoJef)!;
                    if (objResultado.codigo > 0)
                    {
                        claims.Add(new Claim("PaginaDashboard", "IndexJefe"));
                        claims.Add(new Claim("idDashBoard", menuIdJefe));
                        ClaimsIdentity claimsIdentity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);
                        AuthenticationProperties properties = new AuthenticationProperties() { AllowRefresh = true };
                        await HttpContext.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme, new ClaimsPrincipal(claimsIdentity), properties);
                        if (!string.IsNullOrEmpty(returnUrl)) return LocalRedirect(returnUrl);
                        return RedirectToAction("IndexJefe", "Dashboard");
                    }
                    else
                    {
                        claims.Add(new Claim("PaginaDashboard", "Vacia"));
                        claims.Add(new Claim("idDashBoard", "0"));
                        ClaimsIdentity claimsIdentity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);
                        AuthenticationProperties properties = new AuthenticationProperties() { AllowRefresh = true };
                        await HttpContext.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme, new ClaimsPrincipal(claimsIdentity), properties);
                        if (!string.IsNullOrEmpty(returnUrl)) return LocalRedirect(returnUrl);
                        return RedirectToAction("Vacia", "Helpers");
                    }
                }
                catch (Exception)
                {
                    claims.Add(new Claim("PaginaDashboard", "Vacia"));
                    claims.Add(new Claim("idDashBoard", "0"));
                    ClaimsIdentity claimsIdentity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);
                    AuthenticationProperties properties = new AuthenticationProperties() { AllowRefresh = true };
                    await HttpContext.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme, new ClaimsPrincipal(claimsIdentity), properties);
                    if (!string.IsNullOrEmpty(returnUrl)) return LocalRedirect(returnUrl);
                    return RedirectToAction("Vacia", "Helpers");
                }
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
            ViewData["ValidarError"] = objError.errorDescripcion + "(" + objError.errorCodigo + ")";
            return View();
        }

        public async Task<IActionResult> LogOut()
        {
            await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
            return RedirectToAction("Acceso", "Autenticacion");
        }

        public IActionResult OlvideAcceso()
        {
            return View();
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> OlvideAcceso(VMLogin model)
        {
            var httpClient = httpClientFactory.CreateClient();
            string parametros = "?pOrigen=L&pParam=" + model.inpAccesoAcceso;
            string RutaApi = configuration.GetValue<string>("Generales:RutaAPI")! + "accesos/";
            var response = await httpClient.PutAsync(RutaApi + "OlvidePassword" + parametros, null);

            if (response.StatusCode == HttpStatusCode.OK)
            {
                string jsonOK = await response.Content.ReadAsStringAsync();
                BEResultado objOK = JsonConvert.DeserializeObject<BEResultado>(jsonOK)!;
                ViewData["ValidarOK"] = objOK.descripcion;
                return View();
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
            ViewData["ValidarError"] = objError.errorDescripcion;
            return View();
        }

        public IActionResult ReseteoAcceso()
        {
            return View();
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> ReseteoAcceso(string Id, VMLogin model)
        {
            var httpClient = httpClientFactory.CreateClient();
            string RutaApi = configuration.GetValue<string>("Generales:RutaAPI")! + "accesos/";

            var resetBody = new { pToken = Id, pClaveNueva = model.inpAccesoRepetirPassword };
            var resetContent = new StringContent(
                System.Text.Json.JsonSerializer.Serialize(resetBody),
                Encoding.UTF8, "application/json");
            var response = await httpClient.PutAsync(RutaApi + "RestablecerPassword", resetContent);

            if (response.StatusCode == HttpStatusCode.OK)
            {
                string jsonOK = await response.Content.ReadAsStringAsync();
                BEResultado objOK = JsonConvert.DeserializeObject<BEResultado>(jsonOK)!;
                ViewData["ValidarOK"] = objOK.descripcion + "(" + objOK.codigo + ")";
                return View();
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
            ViewData["ValidarError"] = objError.errorDescripcion;
            return View();
        }

        [HttpGet("validateJS")]
        public IActionResult ValidateSession()
        {
            if (User.Identity != null && User.Identity.IsAuthenticated)
            {
                var userInfo = new
                {
                    isAuthenticated = true,
                    username = User.Identity.Name,
                    usuarioId = User.FindFirst("IdUsuario")?.Value,
                    dashboard = User.FindFirst("PaginaDashboard")?.Value
                };

                return Ok(userInfo);
            }

            return Unauthorized(new
            {
                isAuthenticated = false
            });
        }
    }
}
