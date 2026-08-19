using BackAssistanceTravelers.Models.Cobranza;
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
    [Route("api/liquidacion")]
    [ApiController]
    public class LiquidacionController : BaseApiController
    {
        private readonly IUnitOfWork unitOfWork;
        private readonly IMailServicio mailService;
        private readonly IConfiguration configuration;
        private readonly ILogger<LiquidacionController> Log4Net;

        public LiquidacionController(IUnitOfWork unitOfWork, IMailServicio mailService, IConfiguration configuration, ILogger<LiquidacionController> Log4Net)
        {
            this.unitOfWork = unitOfWork;
            this.mailService = mailService;
            this.configuration = configuration;
            this.Log4Net = Log4Net;
        }

        [HttpPost, Authorize]
        [Route("LiqCancelarProcesar")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(BEErrorApi))]
        [ProducesResponseType(StatusCodes.Status400BadRequest, Type = typeof(BEErrorApi))]
        public async Task<IActionResult> postProcesarLiqCancelar([FromBody] BECobranza parametrosCancelar)
        {
            try
            {
                var data = await unitOfWork.Cobranzas.Cobranza_Procesar(parametrosCancelar);

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
                objOK.errorDescripcion = "Documento de cobranza creado correctamente.";
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

        [HttpPost, Authorize]
        [Route("LiqExtornarProcesar")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(BEErrorApi))]
        [ProducesResponseType(StatusCodes.Status400BadRequest, Type = typeof(BEErrorApi))]
        public async Task<IActionResult> postProcesarLiqExtornar(int pVentaID, string? pVentaSituacionId)
        {
            try
            {
                var data = await unitOfWork.Ventas.Venta_CancelarExtornar(pVentaID, pVentaSituacionId);

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
                objOK.errorDescripcion = "Se extorno correctamente.";
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

        [HttpPost, Authorize]
        [Route("LiqCancelarActualizar")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(BEErrorApi))]
        [ProducesResponseType(StatusCodes.Status400BadRequest, Type = typeof(BEErrorApi))]
        public async Task<IActionResult> postActualizarCancelar([FromBody] BECobranza parametrosCancelar)
        {
            try
            {
                var data = await unitOfWork.Cobranzas.Cobranza_Actualizar(parametrosCancelar);

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
                objOK.errorDescripcion = "Documento de cobranza actualizado correctamente.";
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