using BackAssistanceTravelers.Models.Cobranza;
using BackAssistanceTravelers.Models.Error;
using BackAssistanceTravelers.Models.General;
using BackAssistanceTravelers.Models.Solicitud;
using BackAssistanceTravelers.Models.Venta;
using BackAssistanceTravelers.Repositories.Travel;
using BackAssistanceTravelers.UnitOfWork;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BackAssistanceTravelers.ApiTravel.Controllers
{
    [Route("api/cobranza")]
    [ApiController]
    public class CobranzaController : BaseApiController
    {
        private readonly IUnitOfWork unitOfWork;
        private readonly IMailServicio mailService;
        private readonly IConfiguration configuration;
        private readonly ILogger<CobranzaController> Log4Net;

        public CobranzaController(IUnitOfWork unitOfWork, IMailServicio mailService, IConfiguration configuration, ILogger<CobranzaController> Log4Net)
        {
            this.unitOfWork = unitOfWork;
            this.mailService = mailService;
            this.configuration = configuration;
            this.Log4Net = Log4Net;
        }

        [HttpGet, Authorize]
        [Route("CobranzasObtener")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(IEnumerable<BECobranza>))]
        [ProducesResponseType(StatusCodes.Status400BadRequest, Type = typeof(BEErrorApi))]
        public async Task<IActionResult> getObtenerCobranzas(int pCobranzaId = 0, DateTime pCobranzaIngresoInicio = default, DateTime pCobranzaIngresoFin = default,
                                            DateTime pCobranzaPagoInicio = default, DateTime pCobranzaPagoFin = default, int pUsuarioId = 0, int pcodLiquidacion = 0)
        {
            try
            {
                var data = await unitOfWork.Cobranzas.Cobranza_Obtener(pCobranzaId, pCobranzaIngresoInicio, pCobranzaIngresoFin, pCobranzaPagoInicio, pCobranzaPagoFin, pUsuarioId, pcodLiquidacion);

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
        [Route("CobranzasPagoProcesar")]
        [RequestSizeLimit(10 * 1024 * 1024)]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(BEErrorApi))]
        [ProducesResponseType(StatusCodes.Status400BadRequest, Type = typeof(BEErrorApi))]
        public async Task<IActionResult> postProcesarCobranzaPago([FromBody] BECobranzaPagoParametro parametrosCobranzaPago)
        {
            try
            {
                int cobranzaId = parametrosCobranzaPago.cobranzapagoCobranzaId;
                string extensionArchivo = parametrosCobranzaPago.extensionArchivo!;
                string streamBase64Image = parametrosCobranzaPago.archivoBase64!.Trim();
                string nombreArchivo = "";

                if (streamBase64Image != "")
                {
                    string timeStamp = DateTime.Now.ToString("yyyyMMddhhmmss");
                    string appRutaServer = configuration.GetValue<string>("Archivos:ImgEvidenciaHttp")!;
                    string appRutaLocal = configuration.GetValue<string>("Archivos:ImgEvidenciaServerPath")!;
                    byte[] fileAsBytes = Convert.FromBase64String(streamBase64Image);
                    Stream streamBase64 = new MemoryStream(fileAsBytes, 0, fileAsBytes.Length);

                    string rutaServer = appRutaServer;
                    string rutalocal = appRutaLocal;
                    nombreArchivo = cobranzaId.ToString() + "_" + timeStamp + extensionArchivo;
                    string rutaLocalCopiar = Path.Combine(rutalocal, nombreArchivo!);

                    using (FileStream salidaFilestream = new FileStream(rutaLocalCopiar, FileMode.OpenOrCreate, FileAccess.ReadWrite, FileShare.None))
                    {
                        await streamBase64.CopyToAsync(salidaFilestream);
                    }
                    string rutaServrCopiar = Path.Combine(rutaServer, nombreArchivo!);
                }

                BECobranzaPagoParametro pCobranzaPago = new BECobranzaPagoParametro();
                pCobranzaPago.cobranzapagoId = parametrosCobranzaPago.cobranzapagoId;
                pCobranzaPago.cobranzapagoCobranzaId = cobranzaId;
                pCobranzaPago.cobranzapagoMedioId = parametrosCobranzaPago.cobranzapagoMedioId;
                pCobranzaPago.cobranzapagoFecha = parametrosCobranzaPago.cobranzapagoFecha;
                pCobranzaPago.cobranzapagoImporte = parametrosCobranzaPago.cobranzapagoImporte;
                pCobranzaPago.cobranzapagoCreadoUsuario = parametrosCobranzaPago.cobranzapagoCreadoUsuario;
                pCobranzaPago.cobranzapagoObservacion = parametrosCobranzaPago.cobranzapagoObservacion;
                pCobranzaPago.cobranzapagoEvidenciaRuta = nombreArchivo;

                var data = await unitOfWork.Cobranzas.CobranzaPago_Procesar(pCobranzaPago);

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
                objOK.errorDescripcion = "Se proceso correctamente.";
                Log4Net.LogInformation(ObjectoTOJson(objOK));
                return Ok(objOK);
            }
            catch (FormatException ex)
            {
                BEErrorApi objError = new BEErrorApi();
                objError.errorCodigo = ex.HResult;
                objError.errorDescripcion = ex.Message;
                Log4Net.LogError(ObjectoTOJson(objError));
                return BadRequest(objError);
            }
        }

        [HttpGet, Authorize]
        [Route("CobranzasPagoObtener")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(IEnumerable<BECobranza>))]
        [ProducesResponseType(StatusCodes.Status400BadRequest, Type = typeof(BEErrorApi))]
        public async Task<IActionResult> getObtenerCobranzasPago(int pCobranzaId)
        {
            try
            {
                var data = await unitOfWork.Cobranzas.CobranzaPago_Obtener(pCobranzaId);

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

        [HttpDelete, Authorize]
        [Route("CobranzasPagoEliminar")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(BEErrorApi))]
        [ProducesResponseType(StatusCodes.Status400BadRequest, Type = typeof(BEErrorApi))]
        public async Task<IActionResult> postEliminarCobranzaPago(int pCobranzaPagoID)
        {
            try
            {
                var data = await unitOfWork.Cobranzas.CobranzaPago_Eliminar(pCobranzaPagoID);

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
                objOK.errorDescripcion = "Se elimino correctamente.";
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
        [Route("CobranzasEliminar")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(BEErrorApi))]
        [ProducesResponseType(StatusCodes.Status400BadRequest, Type = typeof(BEErrorApi))]
        public async Task<IActionResult> postEliminarCobranza(int pCobranzaID)
        {
            try
            {
                var data = await unitOfWork.Cobranzas.Cobranza_Eliminar(pCobranzaID);

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
                objOK.errorDescripcion = "Se elimino correctamente.";
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
        [Route("CobranzasVerificarPagoObtener")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(IEnumerable<BECobranzaVerificarPago>))]
        [ProducesResponseType(StatusCodes.Status400BadRequest, Type = typeof(BEErrorApi))]
        public async Task<IActionResult> getObtenerCobranzasVerificarPago(int pAgenciaId, int int_pCodLiquidacion = 0)
        {
            try
            {
                var data = await unitOfWork.Cobranzas.CobranzaVerificarPago_Obtener(pAgenciaId, int_pCodLiquidacion);

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

        [HttpPut, Authorize]
        [Route("CobranzasVerificarPagoProcesar")]
        [RequestSizeLimit(10 * 1024 * 1024)]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(BEErrorApi))]
        [ProducesResponseType(StatusCodes.Status400BadRequest, Type = typeof(BEErrorApi))]
        public async Task<IActionResult> putProcesarCobranzaVerificarPago(int pCobranzaId, int pEstadoId)
        {
            try
            {
                var data = await unitOfWork.Cobranzas.CobranzaVerificarPago_Procesar(pCobranzaId, pEstadoId);

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
                objOK.errorDescripcion = "Se proceso correctamente.";
                Log4Net.LogInformation(ObjectoTOJson(objOK));
                return Ok(objOK);
            }
            catch (FormatException ex)
            {
                BEErrorApi objError = new BEErrorApi();
                objError.errorCodigo = ex.HResult;
                objError.errorDescripcion = ex.Message;
                Log4Net.LogError(ObjectoTOJson(objError));
                return BadRequest(objError);
            }
        }

        [HttpGet, Authorize]
        [Route("IncentivoPagoObtener")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(IEnumerable<BEIncentivo>))]
        [ProducesResponseType(StatusCodes.Status400BadRequest, Type = typeof(BEErrorApi))]
        public async Task<IActionResult> getObtenerIncentivoPago(int int_pBeneficiarioId, DateTime dte_pFechaInicio, DateTime dte_pFechaFin)
        {
            try
            {
                var data = await unitOfWork.Cobranzas.IncentivoPago_Obtener(int_pBeneficiarioId, dte_pFechaInicio, dte_pFechaFin);

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

        [HttpPut, Authorize]
        [Route("IncentivoPagoProcesar")]
        [RequestSizeLimit(10 * 1024 * 1024)]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(BEErrorApi))]
        [ProducesResponseType(StatusCodes.Status400BadRequest, Type = typeof(BEErrorApi))]
        public async Task<IActionResult> putProcesarIncentivoPago(int pVentaId, int pBeneficiarioId, int pUsuarioId)
        {
            try
            {
                var data = await unitOfWork.Cobranzas.IncentivoPago_Procesar(pVentaId, pBeneficiarioId, pUsuarioId);

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
                objOK.errorDescripcion = "Se proceso correctamente.";
                Log4Net.LogInformation(ObjectoTOJson(objOK));
                return Ok(objOK);
            }
            catch (FormatException ex)
            {
                BEErrorApi objError = new BEErrorApi();
                objError.errorCodigo = ex.HResult;
                objError.errorDescripcion = ex.Message;
                Log4Net.LogError(ObjectoTOJson(objError));
                return BadRequest(objError);
            }
        }

        [HttpGet, Authorize]
        [Route("CobranzaReporteObtener")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(IEnumerable<BECobranza>))]
        [ProducesResponseType(StatusCodes.Status400BadRequest, Type = typeof(BEErrorApi))]
        public async Task<IActionResult> getObtenerCobranzaReporte(DateTime dte_pFechaInicio, DateTime dte_pFechaFin, DateTime dte_pFechaInicioPago, DateTime dte_pFechaFinPago)
        {
            try
            {
                var data = await unitOfWork.Cobranzas.CobranzaReporte_Obtener(dte_pFechaInicio, dte_pFechaFin, dte_pFechaInicioPago, dte_pFechaFinPago);

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