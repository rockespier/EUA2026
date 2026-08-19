using BackAssistanceTravelers.Models.Error;
using BackAssistanceTravelers.Models.General;
using BackAssistanceTravelers.Models.Venta;
using BackAssistanceTravelers.Repositories.Travel;
using BackAssistanceTravelers.UnitOfWork;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace BackAssistanceTravelers.ApiTravel.Controllers
{
    [Route("api/solicitud")]
    [ApiController]
    public class SolicitudController : BaseApiController
    {
        private readonly IUnitOfWork unitOfWork;
        private readonly IMailServicio mailService;
        private readonly IConfiguration configuration;
        private readonly ILogger<SolicitudController> Log4Net;

        public SolicitudController(IUnitOfWork unitOfWork, IMailServicio mailService, IConfiguration configuration, ILogger<SolicitudController> Log4Net)
        {
            this.unitOfWork = unitOfWork;
            this.mailService = mailService;
            this.configuration = configuration;
            this.Log4Net = Log4Net;
        }

        [HttpPost, Authorize]
        [Route("SolicitudAtender")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(BEErrorApi))]
        [ProducesResponseType(StatusCodes.Status400BadRequest, Type = typeof(BEErrorApi))]
        public async Task<IActionResult> postAtenderSolicitud(string? pSolicitudIds, int pSolicitudUsuarioId)
        {
            try
            {
                var data = await unitOfWork.Solictudes.SolicitudMasiva_Atender(pSolicitudIds, pSolicitudUsuarioId);

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
                objOK.errorDescripcion = "Se atendio correctamente.";
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
        [Route("SolicitudRechazar")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(BEErrorApi))]
        [ProducesResponseType(StatusCodes.Status400BadRequest, Type = typeof(BEErrorApi))]
        public async Task<IActionResult> postRechazarSolicitud(string? pSolicitudIds, int pSolicitudUsuarioId)
        {
            try
            {
                var data = await unitOfWork.Solictudes.SolicitudMasvia_Rechazar(pSolicitudIds, pSolicitudUsuarioId);

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
                objOK.errorDescripcion = "Se rechazo correctamente.";
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
    }
}