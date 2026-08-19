using BackAssistanceTravelers.Models.Error;
using BackAssistanceTravelers.Models.General;
using BackAssistanceTravelers.Models.Usuario;
using BackAssistanceTravelers.Repositories.Travel;
using BackAssistanceTravelers.UnitOfWork;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace BackAssistanceTravelers.ApiTravel.Controllers
{
    public sealed class LoginRequest
    {
        public string pUsuario { get; set; } = string.Empty;
        public string pClave { get; set; } = string.Empty;
    }

    public sealed class ResetPasswordRequest
    {
        public string pToken { get; set; } = string.Empty;
        public string pClaveNueva { get; set; } = string.Empty;
    }

    [Route("api/accesos")]
    [ApiController]
    public class AutenticacionController : BaseApiController
    {
        private readonly IUnitOfWork unitOfWork;
        private readonly IMailServicio mailService;
        private readonly IConfiguration configuration;
        private readonly ILogger<AutenticacionController> Log4Net;
        public AutenticacionController(IUnitOfWork unitOfWork, IMailServicio mailService, IConfiguration configuration, ILogger<AutenticacionController> Log4Net)
        {
            this.unitOfWork = unitOfWork;
            this.mailService = mailService;
            this.configuration = configuration;
            this.Log4Net = Log4Net;
        }
        [HttpPost, Route("token")]
        public async Task<IActionResult> postToken([FromBody] LoginRequest request)
        {
            try
            {
                var pUsuario = request.pUsuario;
                var pClave = request.pClave;
                var data = await unitOfWork.Usuarios.Usuario_ValidarAcceso(pUsuario, pClave);
                if (!string.IsNullOrEmpty(data.resultado))
                {
                    BEError objError = new BEError();
                    objError.errorCodigo = 400;
                    objError.errorDescripcion = data.resultado;
                    Log4Net.LogError(ObjectoTOJson(objError));
                    return BadRequest(objError);
                }
                var issuer = configuration.GetValue<string>("Jwt:Issuer");
                var audience = configuration.GetValue<string>("Jwt:Audience");
                var key = Encoding.ASCII.GetBytes(configuration.GetValue<string>("Jwt:Key")!);
                int TokenCookieTiempo = configuration.GetValue<int>("Generales:TokenCookieTiempo");
                var signinCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha512Signature);
                var tokenDescriptor = new SecurityTokenDescriptor
                {
                    Subject = new ClaimsIdentity(new[]
                    {
                        new Claim("Id", Guid.NewGuid().ToString()),
                        new Claim(JwtRegisteredClaimNames.Sub, pUsuario),
                        new Claim(JwtRegisteredClaimNames.Email, pUsuario),
                        new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                        new Claim(ClaimTypes.Role, data.usuarioPerfilId.ToString()),
                        new Claim("PerfilNombre", data.usuarioPerfilNombre ?? string.Empty)
                    }),
                    Expires = DateTime.UtcNow.AddDays(TokenCookieTiempo),
                    Issuer = issuer,
                    Audience = audience,
                    SigningCredentials = signinCredentials
                };
                var tokenHandler = new JwtSecurityTokenHandler();
                var token = tokenHandler.CreateToken(tokenDescriptor);
                var stringToken = tokenHandler.WriteToken(token);
                return Ok(stringToken);
            }
            catch (Exception e)
            {
                BEError objError = new BEError();
                objError.errorCodigo = 400;
                objError.errorDescripcion = e.Message;
                Log4Net.LogError(ObjectoTOJson(objError));
                return BadRequest(objError);
            }
        }
        [HttpPost, Authorize]
        [Route("Login")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(BEUsuario))]
        [ProducesResponseType(StatusCodes.Status400BadRequest, Type = typeof(BEError))]
        public async Task<IActionResult> postValidarAcceso([FromBody] LoginRequest request)
        {
            try
            {
                var pUsuario = request.pUsuario;
                var pClave = request.pClave;
                var data = await unitOfWork.Usuarios.Usuario_ValidarAcceso(pUsuario, pClave);
                if (!string.IsNullOrEmpty(data.resultado))
                {
                    BEError objError = new BEError();
                    objError.errorCodigo = 404;
                    objError.errorDescripcion = data.resultado;
                    Log4Net.LogError(ObjectoTOJson(objError));
                    return NotFound(objError);
                }
                return Ok(data);
            }
            catch (Exception e)
            {
                BEError objError = new BEError();
                objError.errorCodigo = 400;
                objError.errorDescripcion = e.Message;
                Log4Net.LogError(ObjectoTOJson(objError));
                return BadRequest(objError);
            }
        }

        [HttpPut]
        [Route("OlvidePassword")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(BEErrorApi))]
        [ProducesResponseType(StatusCodes.Status400BadRequest, Type = typeof(BEErrorApi))]
        public async Task<IActionResult> getValidarExistencia(string pOrigen, string pParam)
        {
            try
            {
                var data_Validar = await unitOfWork.Usuarios.Usuario_ValidarExistencia(pOrigen, pParam);
                if (data_Validar == null)
                {
                    BEErrorApi objError = new BEErrorApi();
                    objError.errorCodigo = 400;
                    objError.errorDescripcion = "El correo no se encuentra registrado.";
                    Log4Net.LogError(ObjectoTOJson(objError), "error");
                    return BadRequest(objError);
                }
                var data_Usuario = await unitOfWork.Usuarios.Usuario_Obtener(data_Validar.errorCodigo, 1);
                if (data_Usuario == null || !data_Usuario.Any())
                {
                    BEErrorApi objError = new BEErrorApi();
                    objError.errorCodigo = 400;
                    objError.errorDescripcion = "Usuario inactivo o datos incorrectos.";
                    Log4Net.LogError(ObjectoTOJson(objError), "error");
                    return BadRequest(objError);
                }
                var correoUsuario = data_Usuario.ToList()[0].usuarioEmail;
                var data_Token = await unitOfWork.Usuarios.Usuario_PrcesarTokenPassword(pParam);
                if (data_Token == null || string.IsNullOrEmpty(data_Token.errorDescripcion))
                {
                    BEErrorApi objError = new BEErrorApi();
                    objError.errorCodigo = 400;
                    objError.errorDescripcion = "Error al generar token";
                    Log4Net.LogError(ObjectoTOJson(objError), "error");
                    return BadRequest(objError);
                }
                var urlReseteoPasssword = configuration.GetValue<string>("Generales:UrlReseteoPassword");
                var url_validar = urlReseteoPasssword + data_Token.errorDescripcion;

                var sHTML = new StringBuilder();
                sHTML.Remove(0, sHTML.Length);
                sHTML.Append("<html>");
                sHTML.Append("   <head></head>");
                sHTML.Append("   <body>");
                sHTML.Append("       <table border=\"0\" align=\"center\" width=\"600px\" cellspacing=\"0\" cellpadding=\"0\">");
                sHTML.Append("           <tr>");
                sHTML.Append("               <td>");
                sHTML.Append("<table border='0' width='100%' cellspacing='1' cellpadding='0'>");
                sHTML.Append("<tr>");
                sHTML.Append("<td width='100%' height='70'>");
                sHTML.Append("<img src='https://euroamericanassistance.com/images/logo.webp' />");
                sHTML.Append("</td>	");
                sHTML.Append("</tr>");
                sHTML.Append("</table>");
                sHTML.Append("					<br>");
                sHTML.Append("					<table width=\"100%\" border=\"0\" cellspacing=\"1\" cellpadding=\"0\" style=\"font-size:12px; font-family:Arial, Helvetica, sans-serif;\">");
                sHTML.Append("						<tr>");
                sHTML.AppendFormat("						<td width=\"2%\"></td><td colspan=\"2\">Hola <strong>{0}: </strong></td>", data_Usuario.ToList()[0].usuarioNombre);
                sHTML.Append("						</tr>");
                sHTML.Append("						<tr>");
                sHTML.AppendFormat("						<td width=\"2%\"></td><td colspan=\"2\" style=\"padding-bottom: 20px;\">Acontinuación te mostramos la información de tus datos para ingresar al sistema <strong>Emisión Online</strong></td>");
                sHTML.Append("						</tr>");
                sHTML.Append("						<tr>");
                sHTML.AppendFormat("						<td width=\"2%\"></td><td width=\"15%\"><strong>Correo</strong></td><td>: {0}</td>", correoUsuario);
                sHTML.Append("						</tr>");
                sHTML.Append("						<tr>");
                sHTML.AppendFormat("						<td width=\"2%\"></td><td><strong>Restablecer contraseña</strong></td><td>: {0}</td>", url_validar);
                sHTML.Append("						</tr>");
                sHTML.Append("						<tr>");
                sHTML.Append("							<td colspan=\"3\" style=\"padding-bottom: 20px;\"></td>");
                sHTML.Append("						</tr>");
                sHTML.Append("						<tr>");
                sHTML.Append("							<td width=\"2%\"></td><td colspan=\"2\">En caso de cualquier consulta comuníquese con nosotros: </td>");
                sHTML.Append("						</tr>");
                sHTML.Append("						<tr>");
                sHTML.Append("							<td width=\"2%\"></td><td colspan=\"2\">Teléfonos: +51 959 262 554</td>");
                sHTML.Append("						</tr>");
                sHTML.Append("						<tr>");
                sHTML.Append("							<td width=\"2%\"></td><td colspan=\"2\">E-mail: informes@euroamericanassistance.com</td>");
                sHTML.Append("						</tr>");
                sHTML.Append("						<tr>");
                sHTML.Append("							<td width=\"2%\"></td><td colspan=\"2\">Web: https://euroamericanassistance.com/</td>");
                sHTML.Append("						</tr>");
                sHTML.Append("						<tr>");
                sHTML.Append("							<td colspan=\"3\" style=\"padding-bottom: 20px;\"></td>");
                sHTML.Append("						<tr>");
                sHTML.Append("							<td width=\"2%\"></td><td colspan=\"2\">Muchas gracias,</td>");
                sHTML.Append("						</tr>");
                sHTML.Append("						<tr>");
                sHTML.Append("							<td width=\"2%\"></td><td colspan=\"2\"><strong>Atentamente</strong></td>");
                sHTML.Append("						</tr>");
                sHTML.Append("						<tr>");
                sHTML.Append("							<td width=\"2%\"></td><td colspan=\"2\"><strong>Euroamerican Assistance</strong></td>");
                sHTML.Append("						</tr>");
                sHTML.Append("					</table>");
                sHTML.Append("				</td>");
                sHTML.Append("			</tr>");
                sHTML.Append("		</table>");
                sHTML.Append("	</body>");
                sHTML.Append("</html>");
                BEMailData enviarCorreo = new BEMailData();
                enviarCorreo.EmailSubject = "Restablecer la contraseña";
                enviarCorreo.EmailBody = sHTML.ToString();
                enviarCorreo.EmailToId = data_Usuario.ToList()[0].usuarioEmail;
                enviarCorreo.EmailToName = data_Usuario.ToList()[0].usuarioNombre;
                string correoEnviar = await mailService.SendMail(enviarCorreo, "", default!);
                if (!string.IsNullOrEmpty(correoEnviar))
                {
                    BEErrorApi objError = new BEErrorApi();
                    objError.errorCodigo = 400;
                    objError.errorDescripcion = "Error al enviar correo - " + correoEnviar;
                    Log4Net.LogError(ObjectoTOJson(objError), "error");
                    return BadRequest(objError);
                }
                BEResultado objOK = new BEResultado();
                objOK.codigo = 200;
                objOK.descripcion = "Se envio correo correctamente, para la recuperación de la contraseña.";
                return Ok(objOK);
            }
            catch (Exception e)
            {
                BEError objError = new BEError();
                objError.errorCodigo = 400;
                objError.errorDescripcion = e.Message;
                Log4Net.LogError(ObjectoTOJson(objError));
                return BadRequest(objError);
            }
        }
        [HttpPut]
        [Route("RestablecerPassword")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(BEResultado))]
        [ProducesResponseType(StatusCodes.Status400BadRequest, Type = typeof(BEErrorApi))]
        public async Task<IActionResult> putValiderTokenPassword([FromBody] ResetPasswordRequest request)
        {
            try
            {
                var pToken = request.pToken;
                var pClaveNueva = request.pClaveNueva;
                int TokenMaximoTiempo = configuration.GetValue<int>("Generales:TiempoMaximoToken");
                var data_Token = await unitOfWork.Usuarios.Usuario_ValidarTokenRestablecerPassword(pToken, TokenMaximoTiempo);
                if (data_Token == null || string.IsNullOrEmpty(data_Token.descripcion))
                {
                    BEErrorApi objError = new BEErrorApi();
                    objError.errorCodigo = 400;
                    objError.errorDescripcion = "Token inválido o expirado";
                    Log4Net.LogError(ObjectoTOJson(objError), "error");
                    return BadRequest(objError);
                }
                var data_Password = await unitOfWork.Usuarios.Usuario_CambiarClave(data_Token.descripcion, data_Token.codigo, pClaveNueva);
                if (string.IsNullOrEmpty(data_Password.errorDescripcion))
                {
                    BEErrorApi objError = new BEErrorApi();
                    objError.errorCodigo = 400;
                    objError.errorDescripcion = "Datos incorrectos";
                    Log4Net.LogError(ObjectoTOJson(objError), "error");
                    return BadRequest(objError);
                }

                var data_CerrarToken = await unitOfWork.Usuarios.Usuario_CerrarTokenPassword(data_Token.codigo, data_Token.descripcion!);
                if (data_CerrarToken == null)
                {
                    BEErrorApi objError = new BEErrorApi();
                    objError.errorCodigo = 400;
                    objError.errorDescripcion = "Error al cerrar token";
                    Log4Net.LogError(ObjectoTOJson(objError), "error");
                    return BadRequest(objError);
                }
                BEResultado objOK = new BEResultado();
                objOK.codigo = 200;
                objOK.descripcion = "Se restablecio su nueva contraseña.";
                return Ok(objOK);
            }
            catch (Exception e)
            {
                BEError objError = new BEError();
                objError.errorCodigo = 400;
                objError.errorDescripcion = e.Message;
                Log4Net.LogError(ObjectoTOJson(objError));
                return BadRequest(objError);
            }
        }
    }
}