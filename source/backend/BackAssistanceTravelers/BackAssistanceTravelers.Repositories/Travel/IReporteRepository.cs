using BackAssistanceTravelers.Models.Reporte;
using BackAssistanceTravelers.Models.Venta;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BackAssistanceTravelers.Repositories.Travel
{
	public interface IReporteRepository
	{
		Task<IEnumerable<BEReporte>> VentasAgencia_Obtener(int int_pPaisId, string? int_pSituacionId,int int_pAnio,int int_TipoReporte,int int_pUsuarioId);
		Task<IEnumerable<BEReporte>> VentasAgenciaMensuales_Obtener(int int_pPaisId, string? int_pSituacionId, int int_pAnio, int int_TipoReporte, int int_pAgenciaId, int int_pUsuarioId, int int_pMes);
		Task<IEnumerable<BEReporte>> VentasPromotorMensuales_Obtener(int int_pPaisId, int int_pAnio, int int_TipoReporte, int int_pPromotorId);
		Task<IEnumerable<BEReporte>> VentasPromotorDiarias_Obtener(int int_pPaisId, int int_pAnio, int int_TipoReporte, int int_pPromotorId, int int_pMes);
		Task<IEnumerable<BEReporte>> VentasAgenciaAnuales_Obtener(int int_pPaisId, int int_pAnio, int int_TipoReporte, int int_pPromotorId);
		Task<IEnumerable<BEReporte>> VentasPaisMensuales_Obtener(int int_pAnio, int int_pPaisId, int int_TipoReporte, int int_pPromotorId,int int_pMesId);
		Task<IEnumerable<BEReporte>> VentasPaisAnual_Obtener(int int_pAnio, int int_TipoReporte);
		Task<IEnumerable<BEReporte>> VentasProductoMensuales_Obtener(int int_pPaisId, string? int_pSituacionId, int int_pAnio, int int_TipoReporte, int int_pAgenciaId, int int_pPromotorId, int int_pProductoId);
		Task<IEnumerable<BEReporte>> VentasRangoEdad_Obtener(int int_pGrupoId,
			int int_pPaisId, string? int_pSituacionId, int int_pAnio, int int_pMes,
			int int_TipoReporte, int int_pAgenciaId, int int_pPromotorId, int int_pProductoId);
		Task<IEnumerable<BEResumenCobranzaReporte>> ResumenCobranzaReporte_Obtener(int int_pAgenciaId = 0, DateTime dte_pFechaInicio = default, DateTime dte_pFechaFin= default, int pcodliquidacion = 0);
		Task<IEnumerable<BEResumenComisionReporte>> ResumenComisionReporte_Obtener(int int_pAgenciaId = 0, DateTime dte_pFechaInicio = default, DateTime dte_pFechaFin = default, int pcodliquidacion = 0);
		Task<IEnumerable<BEResumenDescuentoReporte>> ResumenDescuentoReporte_Obtener(int int_pAgenciaId = 0, DateTime dte_pFechaInicio = default, DateTime dte_pFechaFin = default, int pcodliquidacion = 0);
		Task<IEnumerable<BEResumenPagoReporte>> ResumenPagoReporte_Obtener(int int_pAgenciaId = 0, DateTime dte_pFechaInicio = default, DateTime dte_pFechaFin = default, int pcodliquidacion = 0);
		Task<IEnumerable<BEDetalleCobranzaReporte>> DetalleCobranzaReporte_Obtener(int int_pAgenciaId = 0, DateTime dte_pFechaInicio = default, DateTime dte_pFechaFin = default, int pcodliquidacion = 0);

	}
}
