using BackAssistanceTravelers.Models.Error;
using BackAssistanceTravelers.Models.Usuario;
using BackAssistanceTravelers.Repositories.Travel;
using BackAssistanceTravelers.UnitOfWork;
using log4net.Config;
using log4net.Core;
using log4net;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Reflection;
using System.Security.Claims;
using System.Text;
using BackAssistanceTravelers.Models.General;
using static System.Runtime.InteropServices.JavaScript.JSType;
using BackAssistanceTravelers.Models.Agencia;
using BackAssistanceTravelers.Models.Perfil;
using BackAssistanceTravelers.Models.Permisos;
using BackAssistanceTravelers.Models.Pais;

namespace BackAssistanceTravelers.ApiTravel.Controllers
{
    [Route("api/configuracion")]
    [ApiController]
    [Authorize(Policy = "AdminOnly")]
    public class ConfiguracionController : BaseApiController
    {
        private readonly IUnitOfWork unitOfWork;
        private readonly IMailServicio mailService;
        private readonly IConfiguration configuration;
        private readonly ILogger<ConfiguracionController> Log4Net;

        public ConfiguracionController(IUnitOfWork unitOfWork, IMailServicio mailService, IConfiguration configuration, ILogger<ConfiguracionController> Log4Net)
        {
            this.unitOfWork = unitOfWork;
            this.mailService = mailService;
            this.configuration = configuration;
            this.Log4Net = Log4Net;
        }



        [HttpDelete, Authorize]
        [Route("UsuarioAdminAnular")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(BEErrorApi))]
        [ProducesResponseType(StatusCodes.Status400BadRequest, Type = typeof(BEErrorApi))]
        public async Task<IActionResult> postEliminarAdminUsuario(int pIdUsuario, string pOrigen = "U")
        {
            try
            {
                var data = await unitOfWork.Usuarios.Usuario_Eliminar(pIdUsuario, pOrigen);

                if (string.IsNullOrEmpty(data.errorDescripcion))
                {
                    BEErrorApi objError = new BEErrorApi();
                    objError.errorCodigo = 400;
                    objError.errorDescripcion = "Datos incorrectos";
                    Log4Net.LogInformation(ObjectoTOJson(objError), "error");
                    return BadRequest(objError);
                }

                BEError objOK = new BEError();
                objOK.errorCodigo = 200;
                objOK.errorDescripcion = "Se elimino correctamente.";
                Log4Net.LogInformation(ObjectoTOJson(objOK));
                return Ok(objOK);
            }
            catch (Exception e)
            {
                BEErrorApi objError = new BEErrorApi();
                objError.errorCodigo = 400;
                objError.errorDescripcion = e.Message;
                Log4Net.LogInformation(ObjectoTOJson(objError), "error");
                return BadRequest(objError);
            }
        }

        [HttpGet, Authorize]
        [Route("UsuarioAdminObtener")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(IEnumerable<BEUsuario>))]
        [ProducesResponseType(StatusCodes.Status400BadRequest, Type = typeof(BEErrorApi))]
        public async Task<IActionResult> getObtenerAdminUsuarios(int pIdUsuario, int pAgenciaId = 0, int pIdPerfil = 0, int pEstado = -1, string pOrigen = "U")
        {
            try
            {
                var data = await unitOfWork.Usuarios.Usuario_Obtener(pIdUsuario, pAgenciaId, pIdPerfil, pEstado, pOrigen);

                if (data == null || !data.Any())
                {
                    BEErrorApi objError = new BEErrorApi();
                    objError.errorCodigo = 204;
                    objError.errorDescripcion = "Sin información.";
                    Log4Net.LogInformation(ObjectoTOJson(objError));
                    return NoContent();
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

        [HttpPost, Authorize]
        [Route("UsuarioAdminProcesar")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(BEErrorApi))]
        [ProducesResponseType(StatusCodes.Status400BadRequest, Type = typeof(BEErrorApi))]
        public async Task<IActionResult> postProcesarAdminUsuarios([FromBody] BEUsuarioParametro parametrosUsuarios)
        {
            try
            {
                var data = await unitOfWork.Usuarios.Usuario_Procesar(parametrosUsuarios);

                if (string.IsNullOrEmpty(data.errorDescripcion))
                {
                    BEErrorApi objError = new BEErrorApi();
                    objError.errorCodigo = 400;
                    objError.errorDescripcion = "Datos incorrectos";
                    Log4Net.LogInformation(ObjectoTOJson(objError), "error");
                    return BadRequest(objError);
                }

                BEErrorApi objOK = new BEErrorApi();
                objOK.errorCodigo = 200;
                if (data.errorCodigo == 1)
                {
                    objOK.errorDescripcion = "Se guardar correctamente.";
                }
                else
                {
                    objOK.errorDescripcion = "Se actualizo correctamente.";
                }
                Log4Net.LogInformation(ObjectoTOJson(objOK));
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

        [HttpDelete, Authorize]
        [Route("UsuarioAgenciaAnular")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(BEErrorApi))]
        [ProducesResponseType(StatusCodes.Status400BadRequest, Type = typeof(BEErrorApi))]
        public async Task<IActionResult> postEliminarAgenciaUsuario(int pIAgencia)
        {
            try
            {
                var data = await unitOfWork.Agencias.Agencia_Eliminar(pIAgencia);

                if (string.IsNullOrEmpty(data.errorDescripcion))
                {
                    BEErrorApi objError = new BEErrorApi();
                    objError.errorCodigo = 400;
                    objError.errorDescripcion = "Datos incorrectos";
                    Log4Net.LogError(ObjectoTOJson(objError), "error");
                    return BadRequest(objError);
                }

                BEError objOK = new BEError();
                objOK.errorCodigo = 200;
                objOK.errorDescripcion = "Se elimino correctamente.";
                Log4Net.LogInformation(ObjectoTOJson(objOK));
                return Ok(objOK);
            }
            catch (Exception e)
            {
                BEErrorApi objError = new BEErrorApi();
                objError.errorCodigo = 400;
                objError.errorDescripcion = e.Message;
                Log4Net.LogError(ObjectoTOJson(objError), "error");
                return BadRequest(objError);
            }
        }

        [HttpPut, Authorize]
        [Route("UsuarioCambiarPassword")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(BEErrorApi))]
        [ProducesResponseType(StatusCodes.Status400BadRequest, Type = typeof(BEErrorApi))]
        public async Task<IActionResult> postActualizarPassword(string? pUsuarioOrigen, int pIdUsuario, string pNuevoPassword)
        {
            try
            {
                var data = await unitOfWork.Usuarios.Usuario_CambiarClave(pUsuarioOrigen, pIdUsuario, pNuevoPassword);

                if (string.IsNullOrEmpty(data.errorDescripcion))
                {
                    BEErrorApi objError = new BEErrorApi();
                    objError.errorCodigo = 400;
                    objError.errorDescripcion = "Datos incorrectos";
                    Log4Net.LogError(ObjectoTOJson(objError), "error");
                    return BadRequest(objError);
                }

                BEResultado objOK = new BEResultado();
                objOK.codigo = 200;
                objOK.descripcion = "Se actualizo correctamente.";
                return Ok(objOK);
            }
            catch (Exception e)
            {
                BEErrorApi objError = new BEErrorApi();
                objError.errorCodigo = 400;
                objError.errorDescripcion = e.Message;
                Log4Net.LogError(ObjectoTOJson(objError), "error");
                return BadRequest(objError);
            }
        }

        [HttpGet, Authorize]
        [Route("UsuarioAgenciaObtener")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(IEnumerable<BEUsuario>))]
        [ProducesResponseType(StatusCodes.Status400BadRequest, Type = typeof(BEErrorApi))]
        public async Task<IActionResult> getObtenerAgenciaUsuarios(int pIdUsuario, int pAgenciaPerfilId = 0, int pAgenciaPromotorId = 0, int pAgenciaActivo = -1, int pAgenciaPaisId = 0)
        {
            try
            {
                var data = await unitOfWork.Agencias.Agencia_Obtener(pIdUsuario, pAgenciaPerfilId, pAgenciaPromotorId, pAgenciaActivo, pAgenciaPaisId);

                if (data == null || !data.Any())
                {
                    BEErrorApi objError = new BEErrorApi();
                    objError.errorCodigo = 204;
                    objError.errorDescripcion = "Sin información.";
                    Log4Net.LogInformation(ObjectoTOJson(objError));
                    return NoContent();
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

        [HttpPost, Authorize]
        [Route("UsuarioAgenciaProcesar")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(BEErrorApi))]
        [ProducesResponseType(StatusCodes.Status400BadRequest, Type = typeof(BEErrorApi))]
        public async Task<IActionResult> postProcesarAgenciaUsuarios([FromBody] BEAgenciaParametro parametrosAgencias)
        {
            try
            {
                var data = await unitOfWork.Agencias.Agencia_Procesar(parametrosAgencias);

                if (string.IsNullOrEmpty(data.errorDescripcion))
                {
                    BEErrorApi objError = new BEErrorApi();
                    objError.errorCodigo = 400;
                    objError.errorDescripcion = "Datos incorrectos";
                    Log4Net.LogInformation(ObjectoTOJson(objError), "error");
                    return BadRequest(objError);
                }

                BEErrorApi objOK = new BEErrorApi();
                objOK.errorCodigo = 200;
                if (data.errorCodigo == 1)
                {
                    objOK.errorDescripcion = "Se guardar correctamente.";
                }
                else
                {
                    objOK.errorDescripcion = "Se actualizo correctamente.";
                }
                Log4Net.LogInformation(ObjectoTOJson(objOK));
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

        [HttpGet, Authorize]
        [Route("PerfilObtener")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(IEnumerable<BEPerfil>))]
        [ProducesResponseType(StatusCodes.Status400BadRequest, Type = typeof(BEErrorApi))]
        public async Task<IActionResult> getObtenerPerfil(int pIdPerfil, string pPerfilOrigen)
        {
            try
            {
                var data = await unitOfWork.Perfiles.Perfil_Obtener(pIdPerfil, pPerfilOrigen);

                if (data == null || !data.Any())
                {
                    BEErrorApi objError = new BEErrorApi();
                    objError.errorCodigo = 204;
                    objError.errorDescripcion = "Sin información.";
                    Log4Net.LogInformation(ObjectoTOJson(objError));
                    return NoContent();
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

        [HttpGet, Authorize]
        [Route("MenuPermisosObtener")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(IEnumerable<BEMenuPermiso>))]
        [ProducesResponseType(StatusCodes.Status400BadRequest, Type = typeof(BEErrorApi))]
        public async Task<IActionResult> getObtenerMenuPermisos(int pIdPerfil, string pPerfilTipo)
        {
            try
            {
                var data = await unitOfWork.Menus.Menu_ObtenerPermisos(pIdPerfil, pPerfilTipo);

                if (data == null || !data.Any())
                {
                    BEErrorApi objError = new BEErrorApi();
                    objError.errorCodigo = 204;
                    objError.errorDescripcion = "Sin información.";
                    Log4Net.LogInformation(ObjectoTOJson(objError));
                    return NoContent();
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

        [HttpGet, Authorize]
        [Route("AgenciaObtener")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(IEnumerable<BEAgencia>))]
        [ProducesResponseType(StatusCodes.Status400BadRequest, Type = typeof(BEErrorApi))]
        public async Task<IActionResult> getObtenerAgencia(int int_pAgenciaID, int int_pAgenciaPerfilId = 0, int int_pAgenciaPromotorId = 0,
            int int_pAgenciaActivo = -1, int int_pAgenciaPaisId = 0, string str_AgenciaNombre = "", string str_AgenciaLogin = "", string str_AgenciaRuc = "")
        {
            try
            {
                var data = await unitOfWork.Agencias.Agencia_Obtener(int_pAgenciaID, int_pAgenciaPerfilId, int_pAgenciaPromotorId, int_pAgenciaActivo, int_pAgenciaPaisId, str_AgenciaNombre, str_AgenciaLogin, str_AgenciaRuc);

                if (data == null || !data.Any())
                {
                    BEErrorApi objError = new BEErrorApi();
                    objError.errorCodigo = 204;
                    objError.errorDescripcion = "Sin información.";
                    Log4Net.LogInformation(ObjectoTOJson(objError));
                    return NoContent();
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

        [HttpGet, Authorize]
        [Route("PaisObtener")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(IEnumerable<BEPais>))]
        [ProducesResponseType(StatusCodes.Status400BadRequest, Type = typeof(BEErrorApi))]
        public async Task<IActionResult> getObtenerPais(int int_pPaisID, int int_PaisActivo = -1)
        {
            try
            {
                var data = await unitOfWork.Paises.Pais_Obtener(int_pPaisID, int_PaisActivo);

                if (data == null || !data.Any())
                {
                    BEErrorApi objError = new BEErrorApi();
                    objError.errorCodigo = 204;
                    objError.errorDescripcion = "Sin información.";
                    Log4Net.LogInformation(ObjectoTOJson(objError));
                    return NoContent();
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

        [HttpGet, Authorize]
        [Route("UsuarioRelacionObtener")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(IEnumerable<BEUsuarioRelacion>))]
        [ProducesResponseType(StatusCodes.Status400BadRequest, Type = typeof(BEErrorApi))]
        public async Task<IActionResult> getObtenerUsuarioRelacion(int int_pPaisId, int int_PadreID, int int_HijoID)
        {
            try
            {
                var data = await unitOfWork.Usuarios.SuperVisorPromotor_Obtener(int_pPaisId, int_PadreID, int_HijoID);

                if (data == null || !data.Any())
                {
                    BEErrorApi objError = new BEErrorApi();
                    objError.errorCodigo = 204;
                    objError.errorDescripcion = "Sin información.";
                    Log4Net.LogInformation(ObjectoTOJson(objError));
                    return NoContent();
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

        [HttpPost, Authorize]
        [Route("PermisoProcesar")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(BEResultado))]
        [ProducesResponseType(StatusCodes.Status400BadRequest, Type = typeof(BEErrorApi))]
        public async Task<IActionResult> postProcesarPermiso([FromBody] BEPermiso parametrosPermisos)
        {
            try
            {
                var data = await unitOfWork.Permisos.PermisoArbol_Procesar(parametrosPermisos.perfilId, parametrosPermisos.menuIds!);

                if (data == null || string.IsNullOrEmpty(data.descripcion))
                {
                    BEErrorApi objError = new BEErrorApi();
                    objError.errorCodigo = 400;
                    objError.errorDescripcion = "Datos incorrectos";
                    Log4Net.LogInformation(ObjectoTOJson(objError));
                    return BadRequest(objError);
                }

                BEResultado objOK = new BEResultado();
                objOK.codigo = 200;
                objOK.descripcion = "Se relaciono correctamente.";
                Log4Net.LogInformation(ObjectoTOJson(objOK));
                return Ok(objOK);
            }
            catch (Exception e)
            {
                BEErrorApi objError = new BEErrorApi();
                objError.errorCodigo = 400;
                objError.errorDescripcion = e.Message;
                Log4Net.LogInformation(ObjectoTOJson(objError));
                return BadRequest(objError);
            }
        }

        [HttpDelete, Authorize]
        [Route("PerfilAnular")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(BEResultado))]
        [ProducesResponseType(StatusCodes.Status400BadRequest, Type = typeof(BEErrorApi))]
        public async Task<IActionResult> postEliminarPerfil(int pPerfilId)
        {
            try
            {
                var data = await unitOfWork.Perfiles.Perfil_Eliminar(pPerfilId);

                if (data == null || string.IsNullOrEmpty(data.errorDescripcion))
                {
                    BEErrorApi objError = new BEErrorApi();
                    objError.errorCodigo = 400;
                    objError.errorDescripcion = "Datos incorrectos";
                    Log4Net.LogInformation(ObjectoTOJson(objError));
                    return BadRequest(objError);
                }

                BEResultado objOK = new BEResultado();
                objOK.codigo = 200;
                objOK.descripcion = "Se elimino correctamente.";
                Log4Net.LogInformation(ObjectoTOJson(objOK));
                return Ok(objOK);
            }
            catch (Exception e)
            {
                BEErrorApi objError = new BEErrorApi();
                objError.errorCodigo = 400;
                objError.errorDescripcion = e.Message;
                Log4Net.LogInformation(ObjectoTOJson(objError));
                return BadRequest(objError);
            }
        }

        [HttpPost, Authorize]
        [Route("PerfilProcesar")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(BEResultado))]
        [ProducesResponseType(StatusCodes.Status400BadRequest, Type = typeof(BEErrorApi))]
        public async Task<IActionResult> postProcesarPerfil([FromBody] BEPerfilBody parametrosPerfiles)
        {
            try
            {
                var data = await unitOfWork.Perfiles.Perfil_Procesar(parametrosPerfiles);

                if (data == null || string.IsNullOrEmpty(data.errorDescripcion))
                {
                    BEErrorApi objError = new BEErrorApi();
                    objError.errorCodigo = 400;
                    objError.errorDescripcion = "Datos incorrectos";
                    Log4Net.LogInformation(ObjectoTOJson(objError));
                    return BadRequest(objError);
                }

                BEResultado objOK = new BEResultado();
                objOK.codigo = 200;
                if (data.errorCodigo == 1)
                {
                    objOK.descripcion = "Se guardar correctamente.";
                }
                else
                {
                    objOK.descripcion = "Se actualizo correctamente.";
                }
                Log4Net.LogInformation(ObjectoTOJson(objOK));
                return Ok(objOK);
            }
            catch (Exception e)
            {
                BEErrorApi objError = new BEErrorApi();
                objError.errorCodigo = 400;
                objError.errorDescripcion = e.Message;
                Log4Net.LogInformation(ObjectoTOJson(objError));
                return BadRequest(objError);
            }
        }

        [HttpDelete, Authorize]
        [Route("PaisAnular")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(BEResultado))]
        [ProducesResponseType(StatusCodes.Status400BadRequest, Type = typeof(BEErrorApi))]
        public async Task<IActionResult> postEliminarPais(int pPaisId)
        {
            try
            {
                var data = await unitOfWork.Paises.Pais_Eliminar(pPaisId);

                if (data == null || string.IsNullOrEmpty(data.errorDescripcion))
                {
                    BEErrorApi objError = new BEErrorApi();
                    objError.errorCodigo = 400;
                    objError.errorDescripcion = "Datos incorrectos";
                    Log4Net.LogInformation(ObjectoTOJson(objError));
                    return BadRequest(objError);
                }

                BEResultado objOK = new BEResultado();
                objOK.codigo = 200;
                objOK.descripcion = "Se elimino correctamente.";
                Log4Net.LogInformation(ObjectoTOJson(objOK));
                return Ok(objOK);
            }
            catch (Exception e)
            {
                BEErrorApi objError = new BEErrorApi();
                objError.errorCodigo = 400;
                objError.errorDescripcion = e.Message;
                Log4Net.LogInformation(ObjectoTOJson(objError));
                return BadRequest(objError);
            }
        }

        [HttpPost, Authorize]
        [Route("PaisProcesar")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(BEResultado))]
        [ProducesResponseType(StatusCodes.Status400BadRequest, Type = typeof(BEErrorApi))]
        public async Task<IActionResult> postProcesarPais([FromBody] BEPaisBody parametrosPais)
        {
            try
            {
                var data = await unitOfWork.Paises.Pais_Procesar(parametrosPais);

                if (data == null || string.IsNullOrEmpty(data.errorDescripcion))
                {
                    BEErrorApi objError = new BEErrorApi();
                    objError.errorCodigo = 400;
                    objError.errorDescripcion = "Datos incorrectos";
                    Log4Net.LogInformation(ObjectoTOJson(objError));
                    return BadRequest(objError);
                }

                BEResultado objOK = new BEResultado();
                objOK.codigo = 200;
                if (data.errorCodigo == 1)
                {
                    objOK.descripcion = "Se guardar correctamente.";
                }
                else
                {
                    objOK.descripcion = "Se actualizo correctamente.";
                }
                Log4Net.LogInformation(ObjectoTOJson(objOK));
                return Ok(objOK);
            }
            catch (Exception e)
            {
                BEErrorApi objError = new BEErrorApi();
                objError.errorCodigo = 400;
                objError.errorDescripcion = e.Message;
                Log4Net.LogInformation(ObjectoTOJson(objError));
                return BadRequest(objError);
            }
        }

        [HttpPost, Authorize]
        [Route("AgenciaProcesar")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(BEAgenciaParametro))]
        [ProducesResponseType(StatusCodes.Status400BadRequest, Type = typeof(BEErrorApi))]
        public async Task<IActionResult> postProcesarAgencia([FromBody] BEAgenciaParametro parametrosValor)
        {
            try
            {
                var data = await unitOfWork.Agencias.Agencia_Procesar(parametrosValor);

                if (data == null || string.IsNullOrEmpty(data.errorDescripcion))
                {
                    BEErrorApi objError = new BEErrorApi();
                    objError.errorCodigo = 400;
                    objError.errorDescripcion = "Datos incorrectos";
                    Log4Net.LogError(ObjectoTOJson(objError));
                    return BadRequest(objError);
                }

                BEResultado objOK = new BEResultado();
                objOK.codigo = 200;

                if (data.errorCodigo == 1)
                {
                    objOK.descripcion = "Se guardo correctamente.";
                }
                else
                {
                    if (data.errorCodigo == -1)
                    {
                        BEErrorApi objError = new BEErrorApi();
                        objError.errorCodigo = 400;
                        objError.errorDescripcion = data.errorDescripcion;
                        return BadRequest(objError);
                    }
                    else
                    {
                        objOK.descripcion = "Se actualizo correctamente.";
                    }
                }

                Log4Net.LogInformation(ObjectoTOJson(objOK));
                return Ok(objOK);
            }
            catch (Exception e)
            {
                BEErrorApi objError = new BEErrorApi();
                objError.errorCodigo = 400;
                objError.errorDescripcion = e.Message;
                Log4Net.LogError(ObjectoTOJson(objError));
                return BadRequest(objError);
            }
        }

        [HttpGet, Authorize]
        [Route("PaisOrigenDestinoObtener")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(IEnumerable<BEPais>))]
        [ProducesResponseType(StatusCodes.Status400BadRequest, Type = typeof(BEErrorApi))]
        public async Task<IActionResult> getObtenerOrigenDestinoPais(int int_pOrigenID)
        {
            try
            {
                var data = await unitOfWork.Paises.Pais_OrigenDestinoObtener(int_pOrigenID);

                if (data == null || !data.Any())
                {
                    BEErrorApi objError = new BEErrorApi();
                    objError.errorCodigo = 204;
                    objError.errorDescripcion = "Sin información.";
                    Log4Net.LogInformation(ObjectoTOJson(objError));
                    return NoContent();
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
    }
}