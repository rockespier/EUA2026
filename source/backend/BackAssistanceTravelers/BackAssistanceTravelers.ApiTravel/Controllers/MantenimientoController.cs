
using BackAssistanceTravelers.Models.Error;
using BackAssistanceTravelers.Models.General;
using BackAssistanceTravelers.Models.Usuario;
using BackAssistanceTravelers.Models.Producto;
using BackAssistanceTravelers.Repositories.Travel;
using BackAssistanceTravelers.UnitOfWork;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using BackAssistanceTravelers.Models.Solicitud;
using BackAssistanceTravelers.Models.Promocion;
using BackAssistanceTravelers.Models.Valores;
using BackAssistanceTravelers.Models.Venta;
using BackAssistanceTravelers.Models.Agencia;
using System.Linq;
using System.Threading.Tasks;

namespace BackAssistanceTravelers.ApiTravel.Controllers
{
    [Route("api/mantenimiento")]
    [ApiController]
    [Authorize(Policy = "AdminOnly")]
    public class MantenimientoController : BaseApiController
    {
        private readonly IUnitOfWork unitOfWork;
        private readonly IMailServicio mailService;
        private readonly IConfiguration configuration;
        private readonly ILogger<MantenimientoController> Log4Net;
        public MantenimientoController(IUnitOfWork unitOfWork, IMailServicio mailService, IConfiguration configuration, ILogger<MantenimientoController> Log4Net)
        {
            this.unitOfWork = unitOfWork;
            this.mailService = mailService;
            this.configuration = configuration;
            this.Log4Net = Log4Net;
        }
        [HttpGet, Authorize]
        [Route("ProductosObtener")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(IEnumerable<BEProducto>))]
        [ProducesResponseType(StatusCodes.Status400BadRequest, Type = typeof(BEErrorApi))]
        public async Task<IActionResult> getObtenerProductos(int int_pProductoID, int int_pProductoActivo = -1, int int_pProductoPaisId = 0,
            int int_pProductoGrupalActivo = -1, int int_pProductoPromocionActivo = -1, int int_pProductoAgenciaID = 0)
        {
            try
            {
                var data = await unitOfWork.Productos.Productos_Obtener(int_pProductoID, int_pProductoActivo, int_pProductoPaisId, int_pProductoGrupalActivo, int_pProductoPromocionActivo, int_pProductoAgenciaID);
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
        [Route("ProductoProcesar")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(BEProductoBody))]
        [ProducesResponseType(StatusCodes.Status400BadRequest, Type = typeof(BEErrorApi))]
        public async Task<IActionResult> postProcesarProducto([FromBody] BEProductoBody parametrosProducto)
        {
            var data = await unitOfWork.Productos.Producto_Procesar(parametrosProducto);
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
                objOK.descripcion = "Se guarda correctamente.";
            }
            else
            {
                objOK.descripcion = "Se actualizo correctamente.";
            }
            Log4Net.LogInformation(ObjectoTOJson(objOK));
            return Ok(objOK);
        }
        [HttpPost, Authorize]
        [Route("ProductoCopiar")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(BEProductoBody))]
        [ProducesResponseType(StatusCodes.Status400BadRequest, Type = typeof(BEErrorApi))]
        public async Task<IActionResult> postCopiarProducto([FromBody] BEProductoBody parametrosProducto)
        {
            var data = await unitOfWork.Productos.Producto_Copiar(parametrosProducto.productoId, parametrosProducto.productoPaisId, parametrosProducto.productoCreadoUsuarioId);
            if (data == null || data.errorDescripcion == "")
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
                objOK.descripcion = "Se guarda correctamente.";
            }
            else
            {
                objOK.descripcion = "Se actualizo correctamente.";
            }
            Log4Net.LogInformation(ObjectoTOJson(objOK));
            return Ok(objOK);
        }
        [HttpDelete, Authorize]
        [Route("ProductoAnular")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(BEResultado))]
        [ProducesResponseType(StatusCodes.Status400BadRequest, Type = typeof(BEErrorApi))]
        public async Task<IActionResult> postEliminarProducto(int pProductoID)
        {
            var data = await unitOfWork.Productos.Producto_Eliminar(pProductoID);
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
            objOK.descripcion = "Se elimino correctamente.";
            Log4Net.LogInformation(ObjectoTOJson(objOK));
            return Ok(objOK);
        }

        [HttpGet, Authorize]
        [Route("UbigeoObtener")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(IEnumerable<BEUbigeo>))]
        [ProducesResponseType(StatusCodes.Status400BadRequest, Type = typeof(BEErrorApi))]
        public async Task<IActionResult> getObtenerUbigeo(int int_pUbigeoId, int int_pUbigeoPaisId, int int_pUbigeoActivo)
        {
            try
            {
                var data = await unitOfWork.Generales.Ubigeo_Listar(int_pUbigeoId, int_pUbigeoPaisId, int_pUbigeoActivo);
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
        [Route("UbigeoProcesar")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(BEUbigeoBody))]
        [ProducesResponseType(StatusCodes.Status400BadRequest, Type = typeof(BEErrorApi))]
        public async Task<IActionResult> postProcesarSolicitudTipo([FromBody] BEUbigeoBody parametrosValor)
        {
            var data = await unitOfWork.Generales.Ubigeo_Procesar(parametrosValor);
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
                objOK.descripcion = "Se actualizo correctamente.";
            }
            Log4Net.LogInformation(ObjectoTOJson(objOK));
            return Ok(objOK);
        }
        [HttpDelete, Authorize]
        [Route("UbigeoAnular")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(BEResultado))]
        [ProducesResponseType(StatusCodes.Status400BadRequest, Type = typeof(BEErrorApi))]
        public async Task<IActionResult> postEliminarUbigeo(int int_pUbigeoID)
        {
            var data = await unitOfWork.Generales.Ubigeo_Eliminar(int_pUbigeoID);
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
            objOK.descripcion = "Se elimino correctamente.";
            Log4Net.LogInformation(ObjectoTOJson(objOK));
            return Ok(objOK);
        }
        [HttpDelete, Authorize]
        [Route("PromocionPaisAnular")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(BEResultado))]
        [ProducesResponseType(StatusCodes.Status400BadRequest, Type = typeof(BEErrorApi))]
        public async Task<IActionResult> postEliminarPaisPromocion(int int_pPromocionPaisId, int int_pPromocionID, int int_pAgenciaID, int int_pProductoID)
        {
            var data = await unitOfWork.Promociones.PromocionPais_Eliminar(int_pPromocionPaisId, int_pPromocionID, int_pAgenciaID, int_pProductoID);
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
            objOK.descripcion = "Se elimino correctamente.";
            Log4Net.LogInformation(ObjectoTOJson(objOK));
            return Ok(objOK);
        }
        [HttpGet, Authorize]
        [Route("PromocionObtener")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(IEnumerable<BEPromocion>))]
        [ProducesResponseType(StatusCodes.Status400BadRequest, Type = typeof(BEErrorApi))]
        public async Task<IActionResult> getObtenerPromocion(int int_pPromocionPaisId, int int_pPromocionID, int int_pAgenciaID, int int_pActivoID)
        {
            try
            {
                var data = await unitOfWork.Promociones.Promocion_Obtener(int_pPromocionID, int_pActivoID, int_pPromocionPaisId, int_pAgenciaID);
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
        [Route("PromocionPaisObtener")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(IEnumerable<BEPromocionPais>))]
        [ProducesResponseType(StatusCodes.Status400BadRequest, Type = typeof(BEErrorApi))]
        public async Task<IActionResult> getObtenerPaisPromocion(int int_pPromocionPaisId, int int_pPromocionID, int int_pAgenciaID, int int_pProductoID, int int_pDias = 0)
        {
            try
            {
                var data = await unitOfWork.Promociones.PromocionPais_Obtener(int_pPromocionPaisId, int_pPromocionID, int_pAgenciaID, int_pProductoID, int_pDias);
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
        [Route("PromocionPaisProcesar")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(BEPromocionPais))]
        [ProducesResponseType(StatusCodes.Status400BadRequest, Type = typeof(BEErrorApi))]
        public async Task<IActionResult> postProcesarPromocionPais([FromBody] BEPromocionPais parametrosValor)
        {
            var data = await unitOfWork.Promociones.PromocionPais_Procesar(parametrosValor);
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
                objOK.descripcion = "Se actualizo correctamente.";
            }
            Log4Net.LogInformation(ObjectoTOJson(objOK));
            return Ok(objOK);
        }
        [HttpGet, Authorize]
        [Route("ValorObtener")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(IEnumerable<BEValor>))]
        [ProducesResponseType(StatusCodes.Status400BadRequest, Type = typeof(BEErrorApi))]
        public async Task<IActionResult> getObtenerValores(string pValorNombreCampo, string pValorActivo, string pValorId = "")
        {
            var data = await unitOfWork.Valores.Valores_Obtener(pValorNombreCampo, pValorActivo, pValorId);
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
        [HttpDelete, Authorize]
        [Route("ValorAnular")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(BEResultado))]
        [ProducesResponseType(StatusCodes.Status400BadRequest, Type = typeof(BEErrorApi))]
        public async Task<IActionResult> postEliminarValor(string pValorID, string pValorCampo)
        {
            var data = await unitOfWork.Valores.Valores_Eliminar(pValorID, pValorCampo);
            if (data == null || string.IsNullOrEmpty(data.descripcion))
            {
                BEErrorApi objError = new BEErrorApi();
                objError.errorCodigo = 400;
                objError.errorDescripcion = "Datos incorrectos";
                Log4Net.LogError(ObjectoTOJson(objError));
                return BadRequest(objError);
            }
            BEResultado objOK = new BEResultado();
            objOK.codigo = 200;
            objOK.descripcion = "Se elimino correctamente.";
            Log4Net.LogInformation(ObjectoTOJson(objOK));
            return Ok(objOK);
        }
        [HttpPost, Authorize]
        [Route("ValorProcesar")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(BEValorBody))]
        [ProducesResponseType(StatusCodes.Status400BadRequest, Type = typeof(BEErrorApi))]
        public async Task<IActionResult> postProcesarValor([FromBody] BEValorBody parametrosValor)
        {
            var data = await unitOfWork.Valores.Valores_Procesar(parametrosValor);
            if (data == null || string.IsNullOrEmpty(data.descripcion))
            {
                BEErrorApi objError = new BEErrorApi();
                objError.errorCodigo = 400;
                objError.errorDescripcion = "Datos incorrectos";
                Log4Net.LogError(ObjectoTOJson(objError));
                return BadRequest(objError);
            }
            BEResultado objOK = new BEResultado();
            objOK.codigo = 200;
            if (data.codigo == 1)
            {
                objOK.descripcion = "Se guarda correctamente.";
            }
            else
            {
                objOK.descripcion = "Se actualizo correctamente.";
            }
            Log4Net.LogInformation(ObjectoTOJson(objOK));
            return Ok(objOK);
        }
        [HttpGet, Authorize]
        [Route("TipoObtener")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(IEnumerable<BETipo>))]
        [ProducesResponseType(StatusCodes.Status400BadRequest, Type = typeof(BEErrorApi))]
        public async Task<IActionResult> getObtenerTipos()
        {
            var data = await unitOfWork.Valores.Valores_ObtenerTipos();
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
        [HttpGet, Authorize]
        [Route("ProductoTarifasObtener")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(IEnumerable<BEProductoTarifa>))]
        [ProducesResponseType(StatusCodes.Status400BadRequest, Type = typeof(BEErrorApi))]
        public async Task<IActionResult> getObtenerProductoTarifas(int int_pProductoID, int int_pTarifaID)
        {
            var data = await unitOfWork.Productos.ProductoTarifas_Obtener(int_pProductoID, int_pTarifaID);
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
        [HttpPost, Authorize]
        [Route("ProductoTarifaProcesar")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(BEProductoTarifaBody))]
        [ProducesResponseType(StatusCodes.Status400BadRequest, Type = typeof(BEErrorApi))]
        public async Task<IActionResult> postProcesarProductoTarifa([FromBody] BEProductoTarifaBody parametrosValor)
        {
            var data = await unitOfWork.Productos.ProductoTarifa_Procesar(parametrosValor);
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
                objOK.descripcion = "Se actualizo correctamente.";
            }
            Log4Net.LogInformation(ObjectoTOJson(objOK));
            return Ok(objOK);
        }
        [HttpPost, Authorize]
        [Route("ProductoTarifaIncentivoProcesar")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(BEProductoTarifaBody))]
        [ProducesResponseType(StatusCodes.Status400BadRequest, Type = typeof(BEErrorApi))]
        public async Task<IActionResult> postProcesarProductoTarifaIncentivo([FromBody] BEProductoTarifaBody parametrosValor)
        {
            var data = await unitOfWork.Productos.ProductoTarifaIncentivo_Procesar(parametrosValor);
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
                objOK.descripcion = "Se actualizo correctamente.";
            }
            Log4Net.LogInformation(ObjectoTOJson(objOK));
            return Ok(objOK);
        }
        [HttpDelete, Authorize]
        [Route("ProductoTarifaAnular")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(BEResultado))]
        [ProducesResponseType(StatusCodes.Status400BadRequest, Type = typeof(BEErrorApi))]
        public async Task<IActionResult> postEliminarProductoTarifa(int pTarifaID)
        {
            var data = await unitOfWork.Productos.ProductoTarifa_Eliminar(pTarifaID);
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
            objOK.descripcion = "Se elimino correctamente.";
            Log4Net.LogInformation(ObjectoTOJson(objOK));
            return Ok(objOK);
        }
        [HttpGet, Authorize]
        [Route("ProductoBeneficiosObtener")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(IEnumerable<BEProductoBeneficio>))]
        [ProducesResponseType(StatusCodes.Status400BadRequest, Type = typeof(BEErrorApi))]
        public async Task<IActionResult> getObtenerProductoBeneficios(int int_pProductoID, int int_pBeneficioID, int int_pBeneficioIdioma = 1)
        {
            var data = await unitOfWork.Productos.ProductoBeneficio_Obtener(int_pProductoID, int_pBeneficioID, int_pBeneficioIdioma);
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
        [HttpGet, Authorize]
        [Route("ProductoBeneficiosCotizacionObtener")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(IEnumerable<BEProductoBeneficio>))]
        [ProducesResponseType(StatusCodes.Status400BadRequest, Type = typeof(BEErrorApi))]
        public async Task<IActionResult> getObtenerProductoBeneficiosCotizacion(string str_pProductoID, int int_pBeneficioIdioma = 1)
        {
            var data = await unitOfWork.Productos.ProductoBeneficioCoti_Obtener(str_pProductoID, int_pBeneficioIdioma);
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
        [HttpPost, Authorize]
        [Route("ProductoBeneficioProcesar")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(BEProductoBeneficioBody))]
        [ProducesResponseType(StatusCodes.Status400BadRequest, Type = typeof(BEErrorApi))]
        public async Task<IActionResult> postProcesarProductoBeneficio([FromBody] BEProductoBeneficioBody parametrosValor)
        {
            var data = await unitOfWork.Productos.ProductoBeneficio_Procesar(parametrosValor);
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
                objOK.descripcion = "Se actualizo correctamente.";
            }
            Log4Net.LogInformation(ObjectoTOJson(objOK));
            return Ok(objOK);
        }
        [HttpDelete, Authorize]
        [Route("ProductoBeneficioAnular")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(BEResultado))]
        [ProducesResponseType(StatusCodes.Status400BadRequest, Type = typeof(BEErrorApi))]
        public async Task<IActionResult> postEliminarProductoBeneficio(int pBeneficioID)
        {
            var data = await unitOfWork.Productos.ProductoBeneficio_Eliminar(pBeneficioID);
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
            objOK.descripcion = "Se elimino correctamente.";
            Log4Net.LogInformation(ObjectoTOJson(objOK));
            return Ok(objOK);
        }
        [HttpGet, Authorize]
        [Route("SolicitudTipoObtener")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(IEnumerable<BESolicitudTipo>))]
        [ProducesResponseType(StatusCodes.Status400BadRequest, Type = typeof(BEErrorApi))]
        public async Task<IActionResult> getObtenerSolicitudTipo(int int_pSolicitudTipoID, int int_pSolicitudTipoActivo = -1, int int_pSolicitudPerfilId = 0)
        {
            try
            {
                var data = await unitOfWork.Solictudes.SolicitudTipo_Obtener(int_pSolicitudTipoID, int_pSolicitudTipoActivo, int_pSolicitudPerfilId);
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
        [Route("SolicitudTipoProcesar")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(BESolicitudTipoBody))]
        [ProducesResponseType(StatusCodes.Status400BadRequest, Type = typeof(BEErrorApi))]
        public async Task<IActionResult> postProcesarSolicitudTipo([FromBody] BESolicitudTipoBody parametrosValor)
        {
            var data = await unitOfWork.Solictudes.SolicitudTipo_Procesar(parametrosValor);
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
                objOK.descripcion = "Se actualizo correctamente.";
            }
            Log4Net.LogInformation(ObjectoTOJson(objOK));
            return Ok(objOK);
        }
        [HttpDelete, Authorize]
        [Route("SolicitudTipoAnular")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(BEResultado))]
        [ProducesResponseType(StatusCodes.Status400BadRequest, Type = typeof(BEErrorApi))]
        public async Task<IActionResult> postEliminarTipoSolicitud(int int_pSolicitudTipoID)
        {
            var data = await unitOfWork.Solictudes.SolicitudTipo_Eliminar(int_pSolicitudTipoID);
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
            objOK.descripcion = "Se elimino correctamente.";
            Log4Net.LogInformation(ObjectoTOJson(objOK));
            return Ok(objOK);
        }
        [HttpGet, Authorize]
        [Route("AgenciaVentaObtener")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(IEnumerable<BEAgencia>))]
        [ProducesResponseType(StatusCodes.Status400BadRequest, Type = typeof(BEErrorApi))]
        public async Task<IActionResult> getObtenerAgenciaVenta(int pVentaId)
        {
            try
            {
                var data = await unitOfWork.Agencias.AgenciaVenta_Obtener(pVentaId);
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
        [Route("AgenciaAnular")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(BEResultado))]
        [ProducesResponseType(StatusCodes.Status400BadRequest, Type = typeof(BEErrorApi))]
        public async Task<IActionResult> postEliminarAgencia(int int_pAgenciaId)
        {
            var data = await unitOfWork.Agencias.Agencia_Eliminar(int_pAgenciaId);
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
            objOK.descripcion = "Se elimino correctamente.";
            Log4Net.LogInformation(ObjectoTOJson(objOK));
            return Ok(objOK);
        }
        [HttpGet, Authorize]
        [Route("AgenciaProductoObtener")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(IEnumerable<BEAgenciaProducto>))]
        [ProducesResponseType(StatusCodes.Status400BadRequest, Type = typeof(BEErrorApi))]
        public async Task<IActionResult> getObtenerAgenciaProducto(int int_pAgenciaProductoAgenciaId, int int_pAgenciaProductoProductoId, int int_pAgenciaProductoPaisId, int int_pAgenciaProductoId)
        {
            try
            {
                var data = await unitOfWork.Agencias.AgenciaProducto_Obtener(int_pAgenciaProductoAgenciaId, int_pAgenciaProductoProductoId, int_pAgenciaProductoPaisId, int_pAgenciaProductoId);
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
        [Route("AgenciaProductoProcesar")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(BEAgenciaProducto))]
        [ProducesResponseType(StatusCodes.Status400BadRequest, Type = typeof(BEErrorApi))]
        public async Task<IActionResult> postProcesarAgenciaProducto([FromBody] BEAgenciaProducto parametrosValor)
        {
            var data = await unitOfWork.Agencias.AgenciaProducto_Procesar(parametrosValor);
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
                objOK.descripcion = "Se actualizo correctamente.";
            }
            Log4Net.LogInformation(ObjectoTOJson(objOK));
            return Ok(objOK);
        }
        [HttpDelete, Authorize]
        [Route("AgenciaProductoAnular")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(BEResultado))]
        [ProducesResponseType(StatusCodes.Status400BadRequest, Type = typeof(BEErrorApi))]
        public async Task<IActionResult> postEliminarAgenciaProducto(int int_pAgenciaProductoId)
        {
            var data = await unitOfWork.Agencias.AgenciaProducto_Eliminar(int_pAgenciaProductoId);
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
            objOK.descripcion = "Se elimino correctamente.";
            Log4Net.LogInformation(ObjectoTOJson(objOK));
            return Ok(objOK);
        }
        [HttpGet, Authorize]
        [Route("AgenciaFacturaObtener")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(IEnumerable<BEAgenciaFactura>))]
        [ProducesResponseType(StatusCodes.Status400BadRequest, Type = typeof(BEErrorApi))]
        public async Task<IActionResult> getObtenerAgenciaFactura(int int_pAgenciaFacturaId, int int_pAgenciaFacturaAgenciaId, int int_pAgenciaFacturaTipoDocumento, string str_pAgenciaFacturaSerie, int int_pAgenciaFacturaNumero, int int_pAgenciaFacturaEstado, DateTime dte_pAgenciaFacturaInicio = default, DateTime dte_pAgenciaFacturaFin = default)
        {
            try
            {
                var data = await unitOfWork.Agencias.AgenciaFactura_Obtener(int_pAgenciaFacturaId, int_pAgenciaFacturaAgenciaId,
                    int_pAgenciaFacturaTipoDocumento, str_pAgenciaFacturaSerie, int_pAgenciaFacturaNumero, int_pAgenciaFacturaEstado,
                    dte_pAgenciaFacturaInicio, dte_pAgenciaFacturaFin);
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
        [Route("AgenciaFacturaProcesar")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(BEAgenciaFactura))]
        [ProducesResponseType(StatusCodes.Status400BadRequest, Type = typeof(BEErrorApi))]
        public async Task<IActionResult> postProcesarAgenciaFactura([FromBody] BEAgenciaFactura parametrosValor)
        {
            var data = await unitOfWork.Agencias.AgenciaFactura_Procesar(parametrosValor);
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
                objOK.descripcion = "Se actualizo correctamente.";
            }
            Log4Net.LogInformation(ObjectoTOJson(objOK));
            return Ok(objOK);
        }
        [HttpDelete, Authorize]
        [Route("AgenciaFacturaAnular")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(BEResultado))]
        [ProducesResponseType(StatusCodes.Status400BadRequest, Type = typeof(BEErrorApi))]
        public async Task<IActionResult> postEliminarAgenciaFactura(int int_pAgenciaFacturaId)
        {
            var data = await unitOfWork.Agencias.AgenciaFactura_Eliminar(int_pAgenciaFacturaId);
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
            objOK.descripcion = "Se elimino correctamente.";
            Log4Net.LogInformation(ObjectoTOJson(objOK));
            return Ok(objOK);
        }
        [HttpGet, Authorize]
        [Route("AgenciaComisionObtener")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(IEnumerable<BEAgenciaFactura>))]
        [ProducesResponseType(StatusCodes.Status400BadRequest, Type = typeof(BEErrorApi))]
        public async Task<IActionResult> getObtenerComisionAgencia(int int_pCodLiquidacion)
        {
            try
            {
                var data = await unitOfWork.Agencias.Venta_ObtenerComision(int_pCodLiquidacion);
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
        [Route("CotizacionObtener")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(IEnumerable<CotizadorProductoTarifa>))]
        [ProducesResponseType(StatusCodes.Status400BadRequest, Type = typeof(BEErrorApi))]
        public async Task<IActionResult> getObtenerCotizacion(int pOrigen = 0, int pDestino = 0, int pDias = 0,
                    int pCantidad = 0, int pModalidad = 0, int pEdadMayor = 0)
        {
            try
            {
                var data = await unitOfWork.Productos.Cotizacion_Obtener(pOrigen, pDestino, pDias, pCantidad, pModalidad, pEdadMayor);
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