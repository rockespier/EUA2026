using BackAssistanceTravelers.Models.Agencia;
using BackAssistanceTravelers.Models.Error;
using BackAssistanceTravelers.Models.General;
using BackAssistanceTravelers.Models.Pasajero;
using BackAssistanceTravelers.Models.Permisos;
using BackAssistanceTravelers.Models.Usuario;
using BackAssistanceTravelers.Repositories.Travel;
using BackAssistanceTravelers.UnitOfWork;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace BackAssistanceTravelers.ApiTravel.Controllers
{
    [Route("api/generales")]
    [ApiController]
    public class HelpersController : BaseApiController
    {
        private readonly IUnitOfWork unitOfWork;
        private readonly IMailServicio mailService;
        private readonly IConfiguration configuration;
        private readonly ILogger<HelpersController> Log4Net;
        public HelpersController(IUnitOfWork unitOfWork, IMailServicio mailService, IConfiguration configuration, ILogger<HelpersController> Log4Net)
        {
            this.unitOfWork = unitOfWork;
            this.mailService = mailService;
            this.configuration = configuration;
            this.Log4Net = Log4Net;
        }
        [HttpGet, Authorize]
        [Route("MenuPerfilObtener")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(IEnumerable<BEMenu>))]
        [ProducesResponseType(StatusCodes.Status400BadRequest, Type = typeof(BEError))]
        public async Task<IActionResult> getMenuPerfiles(int pPerfilId)
        {
            try
            {
                var data = await unitOfWork.Menus.Menu_Obtener(pPerfilId);
                if (data == null || !data.Any())
                {
                    BEError objError = new BEError();
                    objError.errorCodigo = 204;
                    objError.errorDescripcion = "Datos son incorrectas";
                    Log4Net.LogError(ObjectoTOJson(objError));
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
        [Route("PromotorPaisObtener")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(IEnumerable<BEUsuario>))]
        [ProducesResponseType(StatusCodes.Status400BadRequest, Type = typeof(BEErrorApi))]
        public async Task<IActionResult> getPromotorPais(int pIdUsuario, int pIdPais)
        {
            var data = await unitOfWork.Usuarios.PromotorPais_Obtener(pIdUsuario, pIdPais);
            if (data == null || !data.Any())
            {
                BEErrorApi objError = new BEErrorApi();
                objError.errorCodigo = 204;
                objError.errorDescripcion = "Datos son incorrectas";
                Log4Net.LogError(ObjectoTOJson(objError));
                return NoContent();
            }
            return Ok(data);
        }
        [HttpGet, Authorize]
        [Route("CorrelativoObtener")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(IEnumerable<BEUsuario>))]
        [ProducesResponseType(StatusCodes.Status400BadRequest, Type = typeof(BEErrorApi))]
        public async Task<IActionResult> getCorrelativo(string pColumna)
        {
            try
            {
                var data = await unitOfWork.Generales.Correlativo_Generar(pColumna);
                if (string.IsNullOrEmpty(data.errorDescripcion))
                {
                    BEErrorApi objError = new BEErrorApi();
                    objError.errorCodigo = 400;
                    objError.errorDescripcion = "Datos incorrectos";
                    Log4Net.LogInformation(ObjectoTOJson(objError), "error");
                    return BadRequest(objError);
                }
                BEErrorApi objOK = new BEErrorApi();
                objOK.errorCodigo = data.errorCodigo;
                objOK.errorDescripcion = "Se genero correctamente.";
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
        [Route("PasajeroObtener")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(IEnumerable<BEPasajero>))]
        [ProducesResponseType(StatusCodes.Status400BadRequest, Type = typeof(BEErrorApi))]
        public async Task<IActionResult> getPasajero(string? pPasajero_DocumentoTipo, string? pPasajero_DocumentoNumero, DateTime Inicio = default, DateTime Fin = default)
        {
            try
            {
                var data = await unitOfWork.Ventas.Venta_ObtenerPasajero(pPasajero_DocumentoTipo, pPasajero_DocumentoNumero, Inicio, Fin);
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
        [Route("PasajeroListar")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(IEnumerable<BEPasajero>))]
        [ProducesResponseType(StatusCodes.Status400BadRequest, Type = typeof(BEErrorApi))]
        public async Task<IActionResult> getPasajeroListar(string? pPasajero_DocumentoTipo, string? pPasajero_DocumentoNumero, DateTime Inicio = default, DateTime Fin = default)
        {
            try
            {
                var data = await unitOfWork.Ventas.Venta_ListaPasajero(pPasajero_DocumentoTipo, pPasajero_DocumentoNumero, Inicio, Fin);
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
        [Route("TarifaProductosDiasObtener")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(IEnumerable<BEUsuario>))]
        [ProducesResponseType(StatusCodes.Status400BadRequest, Type = typeof(BEErrorApi))]
        public async Task<IActionResult> getTarifaProductoDias(int pProductoID, int pNumeroDias)
        {
            try
            {
                var data = await unitOfWork.Productos.ProductoTarifa_ObtenerxNumeroDias(pProductoID, pNumeroDias);
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
        [Route("AgenciaUsuarioObtener")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(IEnumerable<BEAgenciaUsuario>))]
        [ProducesResponseType(StatusCodes.Status400BadRequest, Type = typeof(BEErrorApi))]
        public async Task<IActionResult> getUsuarioAgencia(int pAgenciaID, int pAgenciaUsuarioId = 0, int pAgenciaUsuarioSupervisorId = 0, int pAgenciaUsuarioPerfilId = 0, int pAgenciaUsuarioActivo = -1, int pAgenciaUsuarioIncluirAgencia = 0)
        {
            try
            {
                var data = await unitOfWork.Agencias.AgenciaUsuario_Obtener(pAgenciaID, pAgenciaUsuarioId, pAgenciaUsuarioSupervisorId, pAgenciaUsuarioPerfilId, pAgenciaUsuarioActivo, pAgenciaUsuarioIncluirAgencia);
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
        [Route("VentaPrecioImpresion")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(IEnumerable<BEImpresion>))]
        [ProducesResponseType(StatusCodes.Status400BadRequest, Type = typeof(BEErrorApi))]
        public async Task<IActionResult> getPrecioImpresion(int pVentaID)
        {
            try
            {
                var data = await unitOfWork.Generales.PrecioImpresion_Obtener(pVentaID);
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
        [Route("ValorTipoIdObtener")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(IEnumerable<BEValoresTipo>))]
        [ProducesResponseType(StatusCodes.Status400BadRequest, Type = typeof(BEErrorApi))]
        public async Task<IActionResult> getValorTipoId(string pValorNombreCampo, string pValorTipoId)
        {
            try
            {
                var data = await unitOfWork.Generales.ValoresTipoId_Obtener(pValorNombreCampo, pValorTipoId);
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
        [Route("UbigeiObtener")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(IEnumerable<BEValoresTipo>))]
        [ProducesResponseType(StatusCodes.Status400BadRequest, Type = typeof(BEErrorApi))]
        public async Task<IActionResult> getUbigeo(int pUbigeoId, int pUbigeoPaisId, int pUbigeoActivo)
        {
            try
            {
                var data = await unitOfWork.Generales.Ubigeo_Obtener(pUbigeoId, pUbigeoPaisId, pUbigeoActivo);
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
        [Route("MenuDashboardObtener")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(IEnumerable<BEMenuDashboard>))]
        [ProducesResponseType(StatusCodes.Status400BadRequest, Type = typeof(BEErrorApi))]
        public async Task<IActionResult> getMenuDashboard(int pPerfilId, int pMenuPadreId)
        {
            try
            {
                var data = await unitOfWork.Menus.MenuDashboard_Obtener(pPerfilId, pMenuPadreId);
                if (data == null || !data.Any())
                {
                    BEError objError = new BEError();
                    objError.errorCodigo = 204;
                    objError.errorDescripcion = "Datos son incorrectas";
                    Log4Net.LogError(ObjectoTOJson(objError));
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
        [Route("UsuarioValidarMenuObtener")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(BEResultado))]
        [ProducesResponseType(StatusCodes.Status400BadRequest, Type = typeof(BEErrorApi))]
        public async Task<IActionResult> getUsuarioMenu(int pIdUsuario, int pMenuId = 100)
        {
            var data = await unitOfWork.Usuarios.Usuario_ValidarMenu(pIdUsuario, pMenuId);
            if (string.IsNullOrEmpty(data.descripcion))
            {
                BEResultado objVacio = new BEResultado();
                objVacio.codigo = 0;
                objVacio.descripcion = "No tiene permiso.";
                return Ok(objVacio);
            }
            return Ok(data);
        }
        [HttpGet, Authorize]
        [Route("LiquidacionCorrelativo")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(IEnumerable<BECorrelativos>))]
        [ProducesResponseType(StatusCodes.Status400BadRequest, Type = typeof(BEErrorApi))]
        public async Task<IActionResult> getLiquidacionCorrelativo()
        {
            try
            {
                var data = await unitOfWork.Generales.CorrelativoLiquidacion_Obtener();
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