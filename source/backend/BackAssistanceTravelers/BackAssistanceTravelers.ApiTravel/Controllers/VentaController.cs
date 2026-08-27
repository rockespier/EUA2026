using BackAssistanceTravelers.Models.Agencia;
using BackAssistanceTravelers.Models.Error;
using BackAssistanceTravelers.Models.General;
using BackAssistanceTravelers.Models.Pasajero;
using BackAssistanceTravelers.Models.Producto;
using BackAssistanceTravelers.Models.Solicitud;
using BackAssistanceTravelers.Models.Usuario;
using BackAssistanceTravelers.Models.Venta;
using BackAssistanceTravelers.Repositories.Travel;
using BackAssistanceTravelers.UnitOfWork;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace BackAssistanceTravelers.ApiTravel.Controllers
{
    [Route("api/venta")]
    [ApiController]
    public class VentaController : BaseApiController
    {
        private readonly IUnitOfWork unitOfWork;
        private readonly IMailServicio mailService;
        private readonly IConfiguration configuration;
        private readonly ILogger<VentaController> Log4Net;
        public VentaController(IUnitOfWork unitOfWork, IMailServicio mailService, IConfiguration configuration, ILogger<VentaController> Log4Net)
        {
            this.unitOfWork = unitOfWork;
            this.mailService = mailService;
            this.configuration = configuration;
            this.Log4Net = Log4Net;
        }

        [HttpGet, Authorize]
        [Route("VentasObtener")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(IEnumerable<BEVenta>))]
        [ProducesResponseType(StatusCodes.Status400BadRequest, Type = typeof(BEErrorApi))]
        public async Task<IActionResult> getObtenerVentas(string? pOrigen = "", DateTime pVentaIngresoInicio = default, DateTime pVentaIngresoFin = default,
                    int pVentaID = 0, int pUsuarioId = 0, string? pEstadoId = "", string? pSituacionId = "", int pAgenciaId = 0,
                    int pAgenciaUsuarioId = 0, string? pClienteNombres = "", string? pClienteApellidos = "", int pPaisId = 0,
                    string? pCodigoExterno = "", string? pTipoDoc = "", string? pNumeDoc = "", int pPromotorId = 0)
        {
            try
            {
                var data = await unitOfWork.Ventas.Ventas_Obtener(pOrigen, pVentaIngresoInicio, pVentaIngresoFin, pVentaID, pUsuarioId, pEstadoId, pSituacionId, pAgenciaId,
                                                            pAgenciaUsuarioId, pClienteNombres, pClienteApellidos, pPaisId, pCodigoExterno, pTipoDoc, pNumeDoc);
                if (pPromotorId > 0)
                {
                    var agenciasPromotor = await unitOfWork.Agencias.Agencia_Obtener(0, 0, pPromotorId, -1, pPaisId);
                    var agenciaIdsPromotor = agenciasPromotor.Select(a => a.agenciaId).ToHashSet();
                    data = data.Where(v => agenciaIdsPromotor.Contains(v.ventaUsuarioAgenciaId));
                }
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
        [Route("VentasProcesar")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(BEErrorApi))]
        [ProducesResponseType(StatusCodes.Status400BadRequest, Type = typeof(BEErrorApi))]
        public async Task<IActionResult> postProcesarVentas([FromBody] BEVentaParametro parametrosVenta)
        {
            try
            {
                var data = await unitOfWork.Ventas.VentaGrupal_Procesar(parametrosVenta);
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
                    objOK.errorDescripcion = "Se registro la venta correctamente.";
                }
                else
                {
                    objOK.errorDescripcion = "Se actualizo la venta correctamente.";
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
        [Route("VentasPasajeroGrupoObtener")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(IEnumerable<BEVenta>))]
        [ProducesResponseType(StatusCodes.Status400BadRequest, Type = typeof(BEErrorApi))]
        public async Task<IActionResult> getObtenerVentasPasajeroGrupo(int pVentaClienteVentaID)
        {
            try
            {
                var data = await unitOfWork.Ventas.VentaCliente_Obtener(pVentaClienteVentaID);
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
        [Route("VentasPasajeroGrupoProcesar")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(BEErrorApi))]
        [ProducesResponseType(StatusCodes.Status400BadRequest, Type = typeof(BEErrorApi))]
        public async Task<IActionResult> postObtenerVentasPasajeroGrupo([FromBody] BEVentaClienteParametro parametrosVentaCliente)
        {
            try
            {
                var data = await unitOfWork.Ventas.VentaCliente_Procesar(parametrosVentaCliente);
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
                    objOK.errorDescripcion = "Se agrego al pasajero correctamente.";
                }
                else
                {
                    objOK.errorDescripcion = "Se actualizo el pasajero correctamente.";
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
        [Route("VentasPasajeroGrupoEliminar")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(BEErrorApi))]
        [ProducesResponseType(StatusCodes.Status400BadRequest, Type = typeof(BEErrorApi))]
        public async Task<IActionResult> postEliminarVentasPasajeroGrupo(int pVentaClienteID)
        {
            try
            {
                var data = await unitOfWork.Ventas.VentaCliente_Eliminar(pVentaClienteID);
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
        [HttpPost, Authorize]
        [Route("VentasSituacionAnular")]
        [RequestSizeLimit(10 * 1024 * 1024)]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(BEErrorApi))]
        [ProducesResponseType(StatusCodes.Status400BadRequest, Type = typeof(BEErrorApi))]
        public async Task<IActionResult> postProcesarVentasAnular([FromBody] BESolicitudAnularParametro parametrosSolicitud)
        {
            try
            {
                int ventaId = parametrosSolicitud.solicitudVentaId;
                string extensionArchivo = parametrosSolicitud.extensionArchivo!;
                string streamBase64Image = parametrosSolicitud.archivoBase64!.Trim();
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
                    nombreArchivo = ventaId.ToString() + "_" + timeStamp + extensionArchivo;
                    string rutaLocalCopiar = Path.Combine(rutalocal, nombreArchivo!);
                    using (FileStream salidaFilestream = new FileStream(rutaLocalCopiar, FileMode.OpenOrCreate, FileAccess.ReadWrite, FileShare.None))
                    {
                        await streamBase64.CopyToAsync(salidaFilestream);
                    }
                    string rutaServrCopiar = Path.Combine(rutaServer, nombreArchivo!);
                }
                BESolicitud pSolicitud = new BESolicitud();
                pSolicitud.solicitudTipoId = parametrosSolicitud.solicitudTipoId;
                pSolicitud.solicitudVentaId = ventaId;
                pSolicitud.solicitudMotivo = parametrosSolicitud.solicitudMotivo;
                pSolicitud.solicitudAdjunto = nombreArchivo;
                pSolicitud.solicitudCreadoUsuarioId = parametrosSolicitud.solicitudCreadoUsuarioId;
                pSolicitud.solicitudMotivoAnulacion = parametrosSolicitud.solicitudMotivoAnulacion;
                var data = await unitOfWork.Solictudes.Solicitudes_Registrar(pSolicitud);
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
                objOK.errorDescripcion = "Se anulo correctamente.";
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
        [HttpPost, Authorize]
        [Route("VentasSituacionVigente")]
        [RequestSizeLimit(10 * 1024 * 1024)]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(BEErrorApi))]
        [ProducesResponseType(StatusCodes.Status400BadRequest, Type = typeof(BEErrorApi))]
        public async Task<IActionResult> postProcesarVentasVigente([FromBody] BESolicitudVigenteParametro parametrosSolicitud)
        {
            try
            {
                BESolicitud pSolicitud = new BESolicitud();
                pSolicitud.solicitudTipoId = parametrosSolicitud.solicitudTipoId;
                pSolicitud.solicitudVentaId = parametrosSolicitud.solicitudVentaId;
                pSolicitud.solicitudVigenciaFechaInicial = parametrosSolicitud.solicitudVigenciaFechaInicial;
                pSolicitud.solicitudVigenciaFechaFinal = parametrosSolicitud.solicitudVigenciaFechaFinal;
                pSolicitud.solicitudCreadoUsuarioId = parametrosSolicitud.solicitudCreadoUsuarioId;
                pSolicitud.solicitudMotivo = parametrosSolicitud.solicitudMotivo;
                var data = await unitOfWork.Solictudes.Solicitudes_Registrar(pSolicitud);
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
        [HttpPost, Authorize]
        [Route("VentasSituacionReactivacion")]
        [RequestSizeLimit(10 * 1024 * 1024)]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(BEErrorApi))]
        [ProducesResponseType(StatusCodes.Status400BadRequest, Type = typeof(BEErrorApi))]
        public async Task<IActionResult> postProcesarVentasReactivacion([FromBody] BESolicitudReactivacionParametro parametrosSolicitud)
        {
            try
            {
                BESolicitud pSolicitud = new BESolicitud();
                pSolicitud.solicitudTipoId = parametrosSolicitud.solicitudTipoId;
                pSolicitud.solicitudVentaId = parametrosSolicitud.solicitudVentaId;
                pSolicitud.solicitudCreadoUsuarioId = parametrosSolicitud.solicitudCreadoUsuarioId;
                pSolicitud.solicitudMotivo = parametrosSolicitud.solicitudMotivo;
                var data = await unitOfWork.Solictudes.Solicitudes_Registrar(pSolicitud);
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
                objOK.errorDescripcion = "Se registro correctamente.";
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
        [HttpPost, Authorize]
        [Route("VentasSituacionTraslado")]
        [RequestSizeLimit(10 * 1024 * 1024)]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(BEErrorApi))]
        [ProducesResponseType(StatusCodes.Status400BadRequest, Type = typeof(BEErrorApi))]
        public async Task<IActionResult> postProcesarVentasTraslado([FromBody] BESolicitudTrasladoParametro parametrosSolicitud)
        {
            try
            {
                BESolicitud pSolicitud = new BESolicitud();
                pSolicitud.solicitudTipoId = parametrosSolicitud.solicitudTipoId;
                pSolicitud.solicitudVentaId = parametrosSolicitud.solicitudVentaId;
                pSolicitud.solicitudCreadoUsuarioId = parametrosSolicitud.solicitudCreadoUsuarioId;
                pSolicitud.solicitudAgenciaId = parametrosSolicitud.solicitudAgenciaId;
                pSolicitud.solicitudAgenciaUsuarioId = parametrosSolicitud.solicitudAgenciaUsuarioId;
                pSolicitud.solicitudMotivo = parametrosSolicitud.solicitudMotivo;
                var data = await unitOfWork.Solictudes.Solicitudes_Registrar(pSolicitud);
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
                objOK.errorDescripcion = "Se registro correctamente.";
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
        [HttpPost, Authorize]
        [Route("VentasSituacionImporTarje")]
        [RequestSizeLimit(10 * 1024 * 1024)]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(BEErrorApi))]
        [ProducesResponseType(StatusCodes.Status400BadRequest, Type = typeof(BEErrorApi))]
        public async Task<IActionResult> postProcesarVentasVentaTarje([FromBody] BESolicitudImpoTarjParametro parametrosSolicitud)
        {
            try
            {
                BESolicitud pSolicitud = new BESolicitud();
                pSolicitud.solicitudTipoId = parametrosSolicitud.solicitudTipoId;
                pSolicitud.solicitudVentaId = parametrosSolicitud.solicitudVentaId;
                pSolicitud.solicitudCreadoUsuarioId = parametrosSolicitud.solicitudCreadoUsuarioId;
                pSolicitud.solicitudVentaImporte = parametrosSolicitud.solicitudVentaImporte;
                pSolicitud.solicitudMotivo = parametrosSolicitud.solicitudMotivo;
                var data = await unitOfWork.Solictudes.Solicitudes_Registrar(pSolicitud);
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
                objOK.errorDescripcion = "Se registro correctamente.";
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
        [HttpPost, Authorize]
        [Route("VentasSituacionCliente")]
        [RequestSizeLimit(10 * 1024 * 1024)]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(BEErrorApi))]
        [ProducesResponseType(StatusCodes.Status400BadRequest, Type = typeof(BEErrorApi))]
        public async Task<IActionResult> postProcesarVentasCliente([FromBody] BESolicitudClienteParametro parametrosSolicitud)
        {
            try
            {
                BESolicitud pSolicitud = new BESolicitud();
                pSolicitud.solicitudTipoId = parametrosSolicitud.solicitudTipoId;
                pSolicitud.solicitudVentaId = parametrosSolicitud.solicitudVentaId;
                pSolicitud.solicitudCreadoUsuarioId = parametrosSolicitud.solicitudCreadoUsuarioId;
                pSolicitud.solicitudClienteDocumentoTipoId = parametrosSolicitud.solicitudClienteDocumentoTipoId;
                pSolicitud.solicitudClienteDocumentoNumero = parametrosSolicitud.solicitudClienteDocumentoNumero;
                pSolicitud.solicitudClienteNombres = parametrosSolicitud.solicitudClienteNombres;
                pSolicitud.solicitudClienteApellidos = parametrosSolicitud.solicitudClienteApellidos;
                pSolicitud.solicitudClienteFechaNacimiento = parametrosSolicitud.solicitudClienteFechaNacimiento;
                pSolicitud.solicitudClienteEdad = parametrosSolicitud.solicitudClienteEdad;
                pSolicitud.solicitudClienteEmail = parametrosSolicitud.solicitudClienteEmail;
                pSolicitud.solicitudClienteDireccion = parametrosSolicitud.solicitudClienteDireccion;
                pSolicitud.solicitudClienteTelefono = parametrosSolicitud.solicitudClienteTelefono;
                pSolicitud.solicitudClienteDistrito = parametrosSolicitud.solicitudClienteDistrito;
                pSolicitud.solicitudClienteCiudad = parametrosSolicitud.solicitudClienteCiudad;
                pSolicitud.solicitudClientePais = parametrosSolicitud.solicitudClientePais;
                pSolicitud.solicitudMotivo = parametrosSolicitud.solicitudMotivo;
                var data = await unitOfWork.Solictudes.Solicitudes_Registrar(pSolicitud);
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
                objOK.errorDescripcion = "Se registro correctamente.";
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
        [HttpPost, Authorize]
        [Route("VentasSituacionEmergencia")]
        [RequestSizeLimit(10 * 1024 * 1024)]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(BEErrorApi))]
        [ProducesResponseType(StatusCodes.Status400BadRequest, Type = typeof(BEErrorApi))]
        public async Task<IActionResult> postProcesarVentasEmergencia([FromBody] BESolicitudEmergenciaParametro parametrosSolicitud)
        {
            try
            {
                BESolicitud pSolicitud = new BESolicitud();
                pSolicitud.solicitudTipoId = parametrosSolicitud.solicitudTipoId;
                pSolicitud.solicitudVentaId = parametrosSolicitud.solicitudVentaId;
                pSolicitud.solicitudCreadoUsuarioId = parametrosSolicitud.solicitudCreadoUsuarioId;
                pSolicitud.solicitudContactoNombre = parametrosSolicitud.solicitudContactoNombre;
                pSolicitud.solicitudContactoDireccion = parametrosSolicitud.solicitudContactoDireccion;
                pSolicitud.solicitudContactoDistrito = parametrosSolicitud.solicitudContactoDistrito;
                pSolicitud.solicitudContactoPais = parametrosSolicitud.solicitudContactoPais;
                pSolicitud.solicitudContactoTelefono = parametrosSolicitud.solicitudContactoTelefono;
                pSolicitud.solicitudContactoEmail = parametrosSolicitud.solicitudContactoEmail;
                pSolicitud.solicitudMotivo = parametrosSolicitud.solicitudMotivo;
                var data = await unitOfWork.Solictudes.Solicitudes_Registrar(pSolicitud);
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
                objOK.errorDescripcion = "Se registro correctamente.";
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
        [HttpPost, Authorize]
        [Route("VentasSituacionProducto")]
        [RequestSizeLimit(10 * 1024 * 1024)]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(BEErrorApi))]
        [ProducesResponseType(StatusCodes.Status400BadRequest, Type = typeof(BEErrorApi))]
        public async Task<IActionResult> postProcesarVentasProducto([FromBody] BESolicitudProductoParametro parametrosSolicitud)
        {
            try
            {
                BESolicitud pSolicitud = new BESolicitud();
                pSolicitud.solicitudTipoId = parametrosSolicitud.solicitudTipoId;
                pSolicitud.solicitudVentaId = parametrosSolicitud.solicitudVentaId;
                pSolicitud.solicitudVigenciaFechaInicial = parametrosSolicitud.solicitudProductoFechaInicial;
                pSolicitud.solicitudVigenciaFechaFinal = parametrosSolicitud.solicitudProductoFechaFinal;
                pSolicitud.solicitudVentaImporte = parametrosSolicitud.solicitudProductoImporte;
                pSolicitud.solicitudClienteEdad = parametrosSolicitud.solicitudProductoEdad;
                pSolicitud.solicitudProductoId = parametrosSolicitud.solicitudProductoId;
                pSolicitud.solicitudCreadoUsuarioId = parametrosSolicitud.solicitudCreadoUsuarioId;
                pSolicitud.solicitudMotivo = parametrosSolicitud.solicitudMotivo;
                var data = await unitOfWork.Solictudes.Solicitudes_Registrar(pSolicitud);
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
        [Route("SolicitudObtener")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(IEnumerable<BEVenta>))]
        [ProducesResponseType(StatusCodes.Status400BadRequest, Type = typeof(BEErrorApi))]
        public async Task<IActionResult> getObtenerSolicitud(string? str_pOrigen, int int_pSolicitudUsuarioId,
                                        DateTime dte_pSolicitudIngresoInicio, DateTime dte_pSolicitudIngresoFin,
                                        int int_pSolicitudId, int int_pSolicitudVentaId, int int_pSolicitudTipoId = 0,
                                        string? str_pSolicitudEstadoId = "",
                                        int int_pSolicitudAgenciaId = 0, int int_pSolicitudAgenciaUsuarioId = 0)
        {
            try
            {
                var data = await unitOfWork.Solictudes.Solicitud_Obtener(str_pOrigen, int_pSolicitudUsuarioId, dte_pSolicitudIngresoInicio,
                    dte_pSolicitudIngresoFin, int_pSolicitudId, int_pSolicitudVentaId, int_pSolicitudTipoId, str_pSolicitudEstadoId,
                    int_pSolicitudAgenciaId, int_pSolicitudAgenciaUsuarioId);
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
        [Route("VentasLiquidacionObtener")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(IEnumerable<BEVenta>))]
        [ProducesResponseType(StatusCodes.Status400BadRequest, Type = typeof(BEErrorApi))]
        public async Task<IActionResult> getObtenerLiquidacionVentas(string? pOrigen = "", DateTime pVentaIngresoInicio = default, DateTime pVentaIngresoFin = default,
                    int pVentaID = 0, int pUsuarioId = 0, string? pEstadoId = "", string? pSituacionId = "", int pAgenciaId = 0,
                    int pAgenciaUsuarioId = 0, string? pClienteNombres = "", string? pClienteApellidos = "", int pPaisId = 0, string? pCodigoExterno = "",
                    int pPromotorId = 0, int pDistritoId = 0, int int_pLiquidacionPendiente = 0, int pEjecutivoCobradorId = 0)
        {
            try
            {
                var data = await unitOfWork.Ventas.Liquidacion_Obtener(pOrigen, pVentaIngresoInicio, pVentaIngresoFin, pVentaID, pUsuarioId, pEstadoId, pSituacionId, pAgenciaId, pAgenciaUsuarioId, pClienteNombres, pClienteApellidos, pPaisId, pCodigoExterno, pPromotorId, pDistritoId, int_pLiquidacionPendiente, pEjecutivoCobradorId);
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
        [Route("JerarquiaPromotorObtener")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(IEnumerable<BEJerarquiaPromotor>))]
        [ProducesResponseType(StatusCodes.Status400BadRequest, Type = typeof(BEErrorApi))]
        public async Task<IActionResult> getObtenerPromotorJerarquia(int pUusarioID)
        {
            try
            {
                var data = await unitOfWork.Usuarios.PromotorJerarquia_Obtener(pUusarioID);
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
        [Route("VentasEspecificasObtener")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(IEnumerable<BEVenta>))]
        [ProducesResponseType(StatusCodes.Status400BadRequest, Type = typeof(BEErrorApi))]
        public async Task<IActionResult> getObtenerVentasEspecificas(string? pVentaCodigos, string? pVentaSituacion)
        {
            try
            {
                var data = await unitOfWork.Ventas.Venta_ObtenerVentasEspecificas(pVentaCodigos, pVentaSituacion);
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
        [Route("VentasDescuentoObtener")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(IEnumerable<BEAgenciaProducto>))]
        [ProducesResponseType(StatusCodes.Status400BadRequest, Type = typeof(BEErrorApi))]
        public async Task<IActionResult> getObtenerVentasDescuento(string? pVentaCodigos)
        {
            try
            {
                var data = await unitOfWork.Ventas.Venta_ObtenerDescuentoVentas(pVentaCodigos);
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
        [Route("VentasLiquidacionProcesar")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(BEErrorApi))]
        [ProducesResponseType(StatusCodes.Status400BadRequest, Type = typeof(BEErrorApi))]
        public async Task<IActionResult> postLiquidacionVentasProcesar(int pVentaID, decimal pComision, decimal pIncentivo, decimal pPublicidad, int IDUsuario,
                                                        int int_pFormula, decimal dec_pDescuento, decimal dec_pPago, int int_pLiquidacionCod)
        {
            try
            {
                var data = await unitOfWork.Ventas.Liquidacion_Procesar(pVentaID, pComision, pIncentivo, pPublicidad, IDUsuario, int_pFormula, dec_pDescuento, dec_pPago, int_pLiquidacionCod);
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
        [Route("CodigoExternoObtener")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(BEErrorApi))]
        [ProducesResponseType(StatusCodes.Status400BadRequest, Type = typeof(BEErrorApi))]
        public async Task<IActionResult> getObtenerCodigoExterno(string? pCodigoExterno)
        {
            try
            {
                var data = await unitOfWork.Ventas.VentaCodigoExterno_Validar(pCodigoExterno);
                if (data == null)
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
        [Route("VentasMasivoProcesar")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(BEErrorApi))]
        [ProducesResponseType(StatusCodes.Status400BadRequest, Type = typeof(BEErrorApi))]
        public async Task<IActionResult> postVentasMasivoProcesar([FromBody] BEVenta parametrosVentaMasiva)
        {
            try
            {
                var data = await unitOfWork.Ventas.VentaMasiva_Procesar(parametrosVentaMasiva);
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
        [Route("VentasMasivasObtenerProcesar")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(IEnumerable<BEVenta>))]
        [ProducesResponseType(StatusCodes.Status400BadRequest, Type = typeof(BEErrorApi))]
        public async Task<IActionResult> getObtenerVentasMasivaProcesarConsulta(int pVentaMasivaId)
        {
            try
            {
                var data = await unitOfWork.Ventas.VentaMasivaATV_ProcesarConsultar(pVentaMasivaId);
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
        [Route("VentaActualizarProcesar")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(BEErrorApi))]
        [ProducesResponseType(StatusCodes.Status400BadRequest, Type = typeof(BEErrorApi))]
        public async Task<IActionResult> postProcesarVentaActualizar([FromBody] BEVentaParametro parametrosVenta)
        {
            try
            {
                var data = await unitOfWork.Ventas.VentaActualizar_Procesar(parametrosVenta);
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
                    objOK.errorDescripcion = "Se registro la venta correctamente.";
                }
                else
                {
                    objOK.errorDescripcion = "Se actualizo la venta correctamente.";
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

        [HttpPost, Authorize]
        [Route("VentaPrecioActualizarProcesar")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(BEErrorApi))]
        [ProducesResponseType(StatusCodes.Status400BadRequest, Type = typeof(BEErrorApi))]
        public async Task<IActionResult> postVentaPrecioActualizarProcesar(int pVentaID, decimal pPrecio, int pUsuarioId)
        {
            try
            {
                var data = await unitOfWork.Ventas.VentaPrecio_Procesar(pVentaID, pPrecio, pUsuarioId);
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
                objOK.errorDescripcion = "Se actualizo el precio de la venta correctamente.";
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
        [Route("VentaGestionIncentivosObtener")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(IEnumerable<BEVenta>))]
        [ProducesResponseType(StatusCodes.Status400BadRequest, Type = typeof(BEErrorApi))]
        public async Task<IActionResult> getVentaGestionIncentivosObtener(int pVentaId)
        {
            try
            {
                var data = await unitOfWork.Ventas.Venta_ObtenerGestionIncentivos(pVentaId);
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
        [Route("VentaGestionIncentivosProcesar")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(BEErrorApi))]
        [ProducesResponseType(StatusCodes.Status400BadRequest, Type = typeof(BEErrorApi))]
        public async Task<IActionResult> postVentaGestionIncentivosProcesar([FromBody] BEVentaParametro parametrosVenta)
        {
            try
            {
                var venta = new BEVenta
                {
                    ventaId = parametrosVenta.ventaId,
                    ventaObservacion = parametrosVenta.ventaObservacion,
                    ventaIncentivoPostImporte = (float)parametrosVenta.ventaIncentivoPostImporte,
                    ventaIncentivoFechaPago = parametrosVenta.ventaIncentivoFechaPago,
                    ventaCreadoUsuarioId = parametrosVenta.ventaCreadoUsuarioId
                };
                var data = await unitOfWork.Ventas.VentaGestionIncentivos_Procesar(venta);
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
                objOK.errorDescripcion = "Se actualizo el post-incentivo correctamente.";
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
