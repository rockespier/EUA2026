using BackAssistanceTravelers.Repositories.Travel;
using BackAssistanceTravelers.UnitOfWork;
using log4net.Config;
using log4net.Core;
using log4net;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Reflection;
using BackAssistanceTravelers.Models.General;
using Microsoft.AspNetCore.Authorization;
using System.Data;
using System.Text;
using BackAssistanceTravelers.Models.Error;
using Microsoft.Extensions.Logging;
using BackAssistanceTravelers.Models.Pasajero;
using BackAssistanceTravelers.Models.Reporte;
using System.Security.Claims;

namespace BackAssistanceTravelers.ApiTravel.Controllers
	{
	[Route("api/reportes")]
	[ApiController]
	public class ReporteController : BaseApiController {
		private const string PerfilPromotorId = "6";
		private readonly IUnitOfWork unitOfWork;
		private readonly IMailServicio mailService;
		private readonly IConfiguration configuration;
		private readonly ILogger<ReporteController> Log4Net;
		public ReporteController(IUnitOfWork unitOfWork, IMailServicio mailService, IConfiguration configuration, ILogger<ReporteController> Log4Net) {
			this.unitOfWork = unitOfWork;
			this.mailService = mailService;
			this.configuration = configuration;
			this.Log4Net = Log4Net;
		}

		/// <summary>
		/// Si el usuario autenticado tiene perfil Promotor, ignora el filtro de promotor recibido
		/// del cliente y fuerza su propio Id, para que solo pueda consultar sus propios datos.
		/// </summary>
		private int ResolverPromotorId(int int_pPromotorIdSolicitado) {
			if (User.FindFirst(ClaimTypes.Role)?.Value == PerfilPromotorId) {
				var idUsuarioClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
				if (int.TryParse(idUsuarioClaim, out var idUsuarioAutenticado)) {
					return idUsuarioAutenticado;
				}
			}
			return int_pPromotorIdSolicitado;
		}
		[HttpGet, Authorize]
		[Route("DashboardGraficoObtener")]
		[ProducesResponseType(StatusCodes.Status200OK, Type = typeof(DataSet))]
		[ProducesResponseType(StatusCodes.Status400BadRequest, Type = typeof(BEErrorApi))]
		public async Task<IActionResult> getObtenerDashBoardGraficoObtener(int pOpcion, int pPeriodoId, int pUsuarioId, int pPaisId=0, string pOrigen="U", int pPromotorId = 0, DateTime pInicio = default, DateTime pFin = default) {
			try {
				pPromotorId = ResolverPromotorId(pPromotorId);
				var data = await unitOfWork.DashBoardJefes.DashBoard_GraficoObtener(pOpcion,pPeriodoId, pUsuarioId, pPaisId, pOrigen, pPromotorId, pInicio, pFin);
				if (data == null || data.Rows.Count == 0) {
					BEErrorApi objError = new BEErrorApi();
					objError.errorCodigo = 204;
					objError.errorDescripcion = "Sin información.";
					Log4Net.LogInformation(ObjectoTOJson(objError));
					return NoContent();
				}
				string jsResult = Newtonsoft.Json.JsonConvert.SerializeObject(data);
				return Ok(jsResult); //retornar si para tipo 2
			} catch (Exception e) {
				BEError objError = new BEError();
				objError.errorCodigo = 400;
				objError.errorDescripcion = e.Message;
				Log4Net.LogError(ObjectoTOJson(objError));
				return BadRequest(objError);
			}
		}
        /// <summary>
        /// Obtiene el reporte de ventas mensual por agencia
        /// </summary>
        /// <param name="int_pPaisId"></param>
        /// <param name="int_pSituacionId"></param>
        /// <param name="int_pAnio"></param>
        /// <param name="int_TipoReporte"></param>
        /// <param name="int_pAgenciaId"></param>
        /// <param name="int_pUsuarioId"></param>
        /// <returns></returns>
        [HttpGet, Authorize]
		[Route("VentasAgenciaObtener")]
		[ProducesResponseType(StatusCodes.Status200OK, Type = typeof(IEnumerable<BEReporte>))]
		[ProducesResponseType(StatusCodes.Status400BadRequest, Type = typeof(BEErrorApi))]
		public async Task<IActionResult> getObtenerVentasAgencia(int int_pPaisId, string? int_pSituacionId, int int_pAnio, int int_TipoReporte, int int_pAgenciaId, int int_pUsuarioId, int int_pMes) {
			try {
				int_pUsuarioId = ResolverPromotorId(int_pUsuarioId);
				var data = await unitOfWork.Reportes.VentasAgenciaMensuales_Obtener(int_pPaisId, int_pSituacionId, int_pAnio, int_TipoReporte, int_pAgenciaId, int_pUsuarioId, int_pMes);
				if (data == null || !data.Any()) {
					BEErrorApi objError = new BEErrorApi();
					objError.errorCodigo = 204;
					objError.errorDescripcion = "Sin información.";
					Log4Net.LogInformation(ObjectoTOJson(objError));
					return NoContent();
				}
				return Ok(data);
			} catch (Exception e) {
				BEError objError = new BEError();
				objError.errorCodigo = 400;
				objError.errorDescripcion = e.Message;
				Log4Net.LogError(ObjectoTOJson(objError));
				return BadRequest(objError);
			}

		}
        /// <summary>
        /// Obtiene el reporte de ventas por promotor
        /// </summary>
        /// <param name="int_pPaisId"></param>
        /// <param name="int_pAnio"></param>
        /// <param name="int_TipoReporte"></param>
        /// <param name="int_pPromotorId"></param>
        /// <returns></returns>
        [HttpGet, Authorize]
		[Route("VentasPromotorObtener")]
		[ProducesResponseType(StatusCodes.Status200OK, Type = typeof(IEnumerable<BEReporte>))]
		[ProducesResponseType(StatusCodes.Status400BadRequest, Type = typeof(BEErrorApi))]
		public async Task<IActionResult> getObtenerVentasPromotor(int int_pPaisId, int int_pAnio, int int_TipoReporte, int int_pPromotorId) {
			try {
				int_pPromotorId = ResolverPromotorId(int_pPromotorId);
				var data = await unitOfWork.Reportes.VentasPromotorMensuales_Obtener(int_pPaisId, int_pAnio, int_TipoReporte, int_pPromotorId);
				if (data == null || !data.Any()) {
					BEErrorApi objError = new BEErrorApi();
					objError.errorCodigo = 204;
					objError.errorDescripcion = "Sin información.";
					Log4Net.LogInformation(ObjectoTOJson(objError));
					return NoContent();
				}
				return Ok(data);
			} catch (Exception e) {
				BEError objError = new BEError();
				objError.errorCodigo = 400;
				objError.errorDescripcion = e.Message;
				Log4Net.LogError(ObjectoTOJson(objError));
				return BadRequest(objError);
			}

		}
        /// <summary>
        ///  Obtiene el reporte de ventas por pais
        /// </summary>
        /// <param name="int_pPaisId"></param>
        /// <param name="int_pAnio"></param>
        /// <param name="int_TipoReporte"></param>
        /// <returns></returns>
        [HttpGet, Authorize]
		[Route("VentasPaisObtener")]
		[ProducesResponseType(StatusCodes.Status200OK, Type = typeof(IEnumerable<BEReporte>))]
		[ProducesResponseType(StatusCodes.Status400BadRequest, Type = typeof(BEErrorApi))]
		public async Task<IActionResult> getObtenerVentasPais(int int_pPaisId, int int_pAnio, int int_TipoReporte, int int_pPromotorId, int int_pMesId) {
			try {
				int_pPromotorId = ResolverPromotorId(int_pPromotorId);
				var data = await unitOfWork.Reportes.VentasPaisMensuales_Obtener(int_pAnio, int_pPaisId, int_TipoReporte, int_pPromotorId, int_pMesId);
				if (data == null || !data.Any()) {
					BEErrorApi objError = new BEErrorApi();
					objError.errorCodigo = 204;
					objError.errorDescripcion = "Sin información.";
					Log4Net.LogInformation(ObjectoTOJson(objError));
					return NoContent();
				}
				return Ok(data);
			} catch (Exception e) {
				BEError objError = new BEError();
				objError.errorCodigo = 400;
				objError.errorDescripcion = e.Message;
				Log4Net.LogError(ObjectoTOJson(objError));
				return BadRequest(objError);
			}

		}
        /// <summary>
        /// Obtiene el reporte de ventas por producto
        /// </summary>
        /// <param name="int_pPaisId"></param>
        /// <param name="int_pSituacionId"></param>
        /// <param name="int_pAnio"></param>
        /// <param name="int_TipoReporte"></param>
        /// <param name="int_pAgenciaId"></param>
        /// <param name="int_pPromotorId"></param>
        /// <param name="int_pProductoId"></param>
        /// <returns></returns>
        [HttpGet, Authorize]
		[Route("VentasProductoObtener")]
		[ProducesResponseType(StatusCodes.Status200OK, Type = typeof(IEnumerable<BEReporte>))]
		[ProducesResponseType(StatusCodes.Status400BadRequest, Type = typeof(BEErrorApi))]
		public async Task<IActionResult> getObtenerVentasProducto(int int_pPaisId, string? int_pSituacionId, int int_pAnio, int int_TipoReporte, int int_pAgenciaId, int int_pPromotorId, int int_pProductoId) {
			try {
				int_pPromotorId = ResolverPromotorId(int_pPromotorId);
				var data = await unitOfWork.Reportes.VentasProductoMensuales_Obtener(int_pPaisId,int_pSituacionId, int_pAnio, int_TipoReporte, int_pAgenciaId, int_pPromotorId, int_pProductoId);
				if (data == null || !data.Any()) {
					BEErrorApi objError = new BEErrorApi();
					objError.errorCodigo = 204;
					objError.errorDescripcion = "Sin información.";
					Log4Net.LogInformation(ObjectoTOJson(objError));
					return NoContent();
				}
				return Ok(data);
			} catch (Exception e) {
				BEError objError = new BEError();
				objError.errorCodigo = 400;
				objError.errorDescripcion = e.Message;
				Log4Net.LogError(ObjectoTOJson(objError));
				return BadRequest(objError);
			}

		}
        /// <summary>
        /// Obtiene el reporte de ventas por rango de edad
        /// </summary>
        /// <param name="int_pGrupoId"></param>
        /// <param name="int_pPaisId"></param>
        /// <param name="int_pSituacionId"></param>
        /// <param name="int_pAnio"></param>
        /// <param name="int_pMes"></param>
        /// <param name="int_TipoReporte"></param>
        /// <param name="int_pAgenciaId"></param>
        /// <param name="int_pPromotorId"></param>
        /// <param name="int_pProductoId"></param>
        /// <returns></returns>
        [HttpGet, Authorize]
        [Route("VentasRangoEdadObtener")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(IEnumerable<BEReporte>))]
        [ProducesResponseType(StatusCodes.Status400BadRequest, Type = typeof(BEErrorApi))]
        public async Task<IActionResult> getObtenerVentasRangoEdad(int int_pGrupoId,
            int int_pPaisId, string? int_pSituacionId, int int_pAnio, int int_pMes,
            int int_TipoReporte, int int_pAgenciaId, int int_pPromotorId, int int_pProductoId) {
            try {
                int_pPromotorId = ResolverPromotorId(int_pPromotorId);
                var data = await unitOfWork.Reportes.VentasRangoEdad_Obtener(int_pGrupoId,int_pPaisId, int_pSituacionId, int_pAnio, int_pMes, int_TipoReporte, int_pAgenciaId, int_pPromotorId, int_pProductoId);
                if (data == null || !data.Any()) {
                    BEErrorApi objError = new BEErrorApi();
                    objError.errorCodigo = 204;
                    objError.errorDescripcion = "Sin información.";
                    Log4Net.LogInformation(ObjectoTOJson(objError));
                    return NoContent();
                }
                return Ok(data);
            } catch (Exception e) {
                BEError objError = new BEError();
                objError.errorCodigo = 400;
                objError.errorDescripcion = e.Message;
                Log4Net.LogError(ObjectoTOJson(objError));
                return BadRequest(objError);
            }

        }
		/// <summary>
		/// Obtiene el reporte de resumen de la agencia cobranza
		/// </summary>
		/// <param name="pAgenciaId"></param>
		/// <param name="pFechaInicio"></param>
		/// <param name="pFechaFin"></param>
		/// <returns></returns>
		[HttpGet, Authorize]
		[Route("ResumenAgenciaCobranzaObtener")]
		[ProducesResponseType(StatusCodes.Status200OK, Type = typeof(IEnumerable<BEReporte>))]
		[ProducesResponseType(StatusCodes.Status400BadRequest, Type = typeof(BEErrorApi))]
		public async Task<IActionResult> getObtenerResumenAgenciaCobranza(int pAgenciaId = 0, DateTime pFechaInicio = default, DateTime pFechaFin = default, int pcodliquidacion = 0)
		{
			try
			{
				var data = await unitOfWork.Reportes.ResumenCobranzaReporte_Obtener(pAgenciaId, pFechaInicio, pFechaFin, pcodliquidacion);
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
		/// <summary>
		/// Obtiene el reporte de resumen de la agencia comision
		/// </summary>
		/// <param name="pAgenciaId"></param>
		/// <param name="pFechaInicio"></param>
		/// <param name="pFechaFin"></param>
		/// <returns></returns>
		[HttpGet, Authorize]
		[Route("ResumenAgenciaComisionObtener")]
		[ProducesResponseType(StatusCodes.Status200OK, Type = typeof(IEnumerable<BEReporte>))]
		[ProducesResponseType(StatusCodes.Status400BadRequest, Type = typeof(BEErrorApi))]
		public async Task<IActionResult> getObtenerResumenAgenciaComision(int pAgenciaId = 0, DateTime pFechaInicio = default, DateTime pFechaFin = default,int pcodliquidacion = 0)
		{
			try
			{
				var data = await unitOfWork.Reportes.ResumenComisionReporte_Obtener(pAgenciaId, pFechaInicio, pFechaFin, pcodliquidacion);
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
		/// <summary>
		/// Obtiene el reporte de resumen de la agencia descuento
		/// </summary>
		/// <param name="pAgenciaId"></param>
		/// <param name="pFechaInicio"></param>
		/// <param name="pFechaFin"></param>
		/// <returns></returns>
		[HttpGet, Authorize]
		[Route("ResumenAgenciaDescuentoObtener")]
		[ProducesResponseType(StatusCodes.Status200OK, Type = typeof(IEnumerable<BEReporte>))]
		[ProducesResponseType(StatusCodes.Status400BadRequest, Type = typeof(BEErrorApi))]
		public async Task<IActionResult> getObtenerResumenAgenciaDescuento(int pAgenciaId = 0, DateTime pFechaInicio = default, DateTime pFechaFin = default, int pcodliquidacion = 0)
		{
			try
			{
				var data = await unitOfWork.Reportes.ResumenDescuentoReporte_Obtener(pAgenciaId, pFechaInicio, pFechaFin, pcodliquidacion);
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
		/// <summary>
		/// Obtiene el reporte de resumen de la agencia pago
		/// </summary>
		/// <param name="pAgenciaId"></param>
		/// <param name="pFechaInicio"></param>
		/// <param name="pFechaFin"></param>
		/// <returns></returns>
		[HttpGet, Authorize]
		[Route("ResumenAgenciaPagoObtener")]
		[ProducesResponseType(StatusCodes.Status200OK, Type = typeof(IEnumerable<BEReporte>))]
		[ProducesResponseType(StatusCodes.Status400BadRequest, Type = typeof(BEErrorApi))]
		public async Task<IActionResult> getObtenerResumenAgenciaPago(int pAgenciaId = 0, DateTime pFechaInicio = default, DateTime pFechaFin = default, int pcodliquidacion = 0)
		{
			try
			{
				var data = await unitOfWork.Reportes.ResumenPagoReporte_Obtener(pAgenciaId, pFechaInicio, pFechaFin, pcodliquidacion);
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
		/// <summary>
		/// Obtiene el reporte de resumen de la agencia cobranza
		/// </summary>
		/// <param name="pAgenciaId"></param>
		/// <param name="pFechaInicio"></param>
		/// <param name="pFechaFin"></param>
		/// <param name="int_pCodigoLiquidacion"></param>
		/// <returns></returns>
		[HttpGet, Authorize]
		[Route("DetalleAgenciaCobranzaObtener")]
		[ProducesResponseType(StatusCodes.Status200OK, Type = typeof(IEnumerable<BEReporte>))]
		[ProducesResponseType(StatusCodes.Status400BadRequest, Type = typeof(BEErrorApi))]
		public async Task<IActionResult> getObtenerDetalleAgenciaCobranza(int pAgenciaId = 0, DateTime pFechaInicio = default, DateTime pFechaFin = default, int int_pCodigoLiquidacion = 0) {
			try {
				var data = await unitOfWork.Reportes.DetalleCobranzaReporte_Obtener(pAgenciaId, pFechaInicio, pFechaFin, int_pCodigoLiquidacion);
				if (data == null || !data.Any()) {
					BEErrorApi objError = new BEErrorApi();
					objError.errorCodigo = 204;
					objError.errorDescripcion = "Sin información.";
					Log4Net.LogInformation(ObjectoTOJson(objError));
					return NoContent();
				}
				return Ok(data);
			} catch (Exception e) {
				BEError objError = new BEError();
				objError.errorCodigo = 400;
				objError.errorDescripcion = e.Message;
				Log4Net.LogError(ObjectoTOJson(objError));
				return BadRequest(objError);
			}
		}
		/// <summary>
		/// Obtiene el reporte de ventas anual por agencia
		/// </summary>
		/// <param name="int_pPaisId"></param>
		/// <param name="int_pSituacionId"></param>
		/// <param name="int_pAnio"></param>
		/// <param name="int_TipoReporte"></param>		
		/// <param name="int_pUsuarioId"></param>
		/// <returns></returns>
		[HttpGet, Authorize]
		[Route("VentasAnualAgenciaObtener")]
		[ProducesResponseType(StatusCodes.Status200OK, Type = typeof(IEnumerable<BEReporte>))]
		[ProducesResponseType(StatusCodes.Status400BadRequest, Type = typeof(BEErrorApi))]
		public async Task<IActionResult> getObtenerVentasAnualAgencia(int int_pPaisId, string? int_pSituacionId, int int_pAnio, int int_TipoReporte, int int_pUsuarioId) {
			try {
				int_pUsuarioId = ResolverPromotorId(int_pUsuarioId);
				var data = await unitOfWork.Reportes.VentasAgencia_Obtener(int_pPaisId, int_pSituacionId, int_pAnio, int_TipoReporte,int_pUsuarioId);
				if (data == null || !data.Any()) {
					BEErrorApi objError = new BEErrorApi();
					objError.errorCodigo = 204;
					objError.errorDescripcion = "Sin información.";
					Log4Net.LogInformation(ObjectoTOJson(objError));
					return NoContent();
				}
				return Ok(data);
			} catch (Exception e) {
				BEError objError = new BEError();
				objError.errorCodigo = 400;
				objError.errorDescripcion = e.Message;
				Log4Net.LogError(ObjectoTOJson(objError));
				return BadRequest(objError);
			}

		}
		/// <summary>
		/// Obtiene el reporte de ventas anual por agencia
		/// </summary>
		/// <param name="int_pPaisId"></param>		
		/// <param name="int_pAnio"></param>
		/// <param name="int_TipoReporte"></param>		
		/// <param name="int_pUsuarioId"></param>
		/// <returns></returns>
		[HttpGet, Authorize]
		[Route("VentasPromotorAnualObtener")]
		[ProducesResponseType(StatusCodes.Status200OK, Type = typeof(IEnumerable<BEReporte>))]
		[ProducesResponseType(StatusCodes.Status400BadRequest, Type = typeof(BEErrorApi))]
		public async Task<IActionResult> getObtenerVentasPromotorAnual(int int_pPaisId, int int_pAnio, int int_TipoReporte, int int_pUsuarioId) {
			try {
				int_pUsuarioId = ResolverPromotorId(int_pUsuarioId);
				var data = await unitOfWork.Reportes.VentasAgenciaAnuales_Obtener(int_pPaisId, int_pAnio, int_TipoReporte, int_pUsuarioId);
				if (data == null || !data.Any()) {
					BEErrorApi objError = new BEErrorApi();
					objError.errorCodigo = 204;
					objError.errorDescripcion = "Sin información.";
					Log4Net.LogInformation(ObjectoTOJson(objError));
					return NoContent();
				}
				return Ok(data);
			} catch (Exception e) {
				BEError objError = new BEError();
				objError.errorCodigo = 400;
				objError.errorDescripcion = e.Message;
				Log4Net.LogError(ObjectoTOJson(objError));
				return BadRequest(objError);
			}

		}
		/// <summary>
		/// Obtiene el reporte de ventas anual por agencia
		/// </summary>
		/// <param name="int_pPaisId"></param>		
		/// <param name="int_pAnio"></param>
		/// <param name="int_TipoReporte"></param>		
		/// <param name="int_pUsuarioId"></param>
		/// <param name="int_pMes"></param>
		/// <returns></returns>
		[HttpGet, Authorize]
		[Route("VentasPromotorDiarioObtener")]
		[ProducesResponseType(StatusCodes.Status200OK, Type = typeof(IEnumerable<BEReporte>))]
		[ProducesResponseType(StatusCodes.Status400BadRequest, Type = typeof(BEErrorApi))]
		public async Task<IActionResult> getObtenerVentasPromotorDiario(int int_pPaisId, int int_pAnio, int int_TipoReporte, int int_pUsuarioId, int int_pMes) {
			try {
				var data = await unitOfWork.Reportes.VentasPromotorDiarias_Obtener(int_pPaisId, int_pAnio, int_TipoReporte, int_pUsuarioId, int_pMes);
				if (data == null || !data.Any()) {
					BEErrorApi objError = new BEErrorApi();
					objError.errorCodigo = 204;
					objError.errorDescripcion = "Sin información.";
					Log4Net.LogInformation(ObjectoTOJson(objError));
					return NoContent();
				}
				return Ok(data);
			} catch (Exception e) {
				BEError objError = new BEError();
				objError.errorCodigo = 400;
				objError.errorDescripcion = e.Message;
				Log4Net.LogError(ObjectoTOJson(objError));
				return BadRequest(objError);
			}

		}
		/// <summary>
		///  Obtiene el reporte de ventas por pais
		/// </summary>		
		/// <param name="int_pAnio"></param>
		/// <param name="int_TipoReporte"></param>
		/// <returns></returns>
		[HttpGet, Authorize]
		[Route("VentasPaisAnualObtener")]
		[ProducesResponseType(StatusCodes.Status200OK, Type = typeof(IEnumerable<BEReporte>))]
		[ProducesResponseType(StatusCodes.Status400BadRequest, Type = typeof(BEErrorApi))]
		public async Task<IActionResult> getObtenerVentasPaisAnual(int int_pAnio, int int_TipoReporte) {
			try {
				var data = await unitOfWork.Reportes.VentasPaisAnual_Obtener(int_pAnio, int_TipoReporte);
				if (data == null || !data.Any()) {
					BEErrorApi objError = new BEErrorApi();
					objError.errorCodigo = 204;
					objError.errorDescripcion = "Sin información.";
					Log4Net.LogInformation(ObjectoTOJson(objError));
					return NoContent();
				}
				return Ok(data);
			} catch (Exception e) {
				BEError objError = new BEError();
				objError.errorCodigo = 400;
				objError.errorDescripcion = e.Message;
				Log4Net.LogError(ObjectoTOJson(objError));
				return BadRequest(objError);
			}

		}
	}
}
