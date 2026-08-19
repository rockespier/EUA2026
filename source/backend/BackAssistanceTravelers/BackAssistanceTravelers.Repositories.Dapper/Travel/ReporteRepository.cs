using BackAssistanceTravelers.Models.Producto;
using BackAssistanceTravelers.Models.Reporte;
using BackAssistanceTravelers.Models.Venta;
using BackAssistanceTravelers.Repositories.Travel;
using Dapper;
using Microsoft.Data.SqlClient;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BackAssistanceTravelers.Repositories.Dapper.Travel
{
    public class ReporteRepository : Repository, IReporteRepository
    {
        public ReporteRepository(string connectionString) : base(connectionString)
        {
        }
        public async Task<IEnumerable<BEReporte>> VentasAgenciaAnuales_Obtener(int int_pPaisId, int int_pAnio, int int_TipoReporte, int int_pPromotorId)
        {
            await using (var connection = new SqlConnection(_connectionString))
            {
                var parameters = new DynamicParameters();
                parameters.Add("@pPAIS_Id", int_pPaisId);
                parameters.Add("@pAnio", int_pAnio);
                parameters.Add("@pTipoReporte", int_TipoReporte);
                parameters.Add("@pPromotorId", int_pPromotorId);
                var result = await connection.QueryAsync<BEReporte>("VentasPromotorAnual_Obtener", parameters,
                                        commandType: System.Data.CommandType.StoredProcedure);
                return result;
            }
        }
        public async Task<IEnumerable<BEReporte>> VentasAgenciaMensuales_Obtener(int int_pPaisId, string? int_pSituacionId = "", 
            int int_pAnio=0, int int_TipoReporte=1, int int_pAgenciaId = 0, int int_pUsuarioId = 0, int int_pMes = 0)
        {
            await using (var connection = new SqlConnection(_connectionString))
            {
                var parameters = new DynamicParameters();
                parameters.Add("@pPAIS_Id", int_pPaisId);
                parameters.Add("@pSituacion_Id", int_pSituacionId);
                parameters.Add("@pAnio", int_pAnio);
                parameters.Add("@pTipoReporte", int_TipoReporte);
                parameters.Add("@pAgenciaId", int_pAgenciaId);
                parameters.Add("@pPromotorId", int_pUsuarioId);
                parameters.Add("@pMes", int_pMes);
                var result = await connection.QueryAsync<BEReporte>("VentasAgenciaMensuales_Obtener", parameters,
                                        commandType: System.Data.CommandType.StoredProcedure);
                return result;
            }
        }
        public async Task<IEnumerable<BEReporte>> VentasAgencia_Obtener(int int_pPaisId, string? int_pSituacionId, int int_pAnio, int int_TipoReporte, int int_pUsuarioId)
        {
            await using (var connection = new SqlConnection(_connectionString))
            {
                var parameters = new DynamicParameters();
                parameters.Add("@pPAIS_Id", int_pPaisId);
                parameters.Add("@pSituacion_Id", int_pSituacionId);
                parameters.Add("@pAnio", int_pAnio);
                parameters.Add("@pTipoReporte", int_TipoReporte);
                parameters.Add("@pPromotorId", int_pUsuarioId);
                var result = await connection.QueryAsync<BEReporte>("VentasAgencia_Obtener", parameters,
                                        commandType: System.Data.CommandType.StoredProcedure);
                return result;
            }
        }
        public async Task<IEnumerable<BEReporte>> VentasPaisAnual_Obtener(int int_pAnio, int int_TipoReporte)
        {
            await using (var connection = new SqlConnection(_connectionString))
            {
                var parameters = new DynamicParameters();
                parameters.Add("@pAnio", int_pAnio);
                parameters.Add("@pTipoReporte", int_TipoReporte);
                var result = await connection.QueryAsync<BEReporte>("VentasPaisAnual_Obtener", parameters,
                                        commandType: System.Data.CommandType.StoredProcedure);
                return result;
            }
        }
        public async Task<IEnumerable<BEReporte>> VentasPaisMensuales_Obtener(int int_pAnio, int int_pPaisId, int int_TipoReporte, int int_pPromotorId, int int_pMesId)
        {
            await using (var connection = new SqlConnection(_connectionString))
            {
                var parameters = new DynamicParameters();
                parameters.Add("@pAnio", int_pAnio);
                parameters.Add("@pPaisId", int_pPaisId);
                parameters.Add("@pTipoReporte", int_TipoReporte);
                parameters.Add("@pPromotorId", int_pPromotorId);
                parameters.Add("@pMes", int_pMesId);
                var result = await connection.QueryAsync<BEReporte>("VentasPaisMensual_Obtener", parameters,
                                        commandType: System.Data.CommandType.StoredProcedure);
                return result;
            }
        }
        public async Task<IEnumerable<BEReporte>> VentasPromotorDiarias_Obtener(int int_pPaisId, int int_pAnio, int int_TipoReporte, int int_pPromotorId, int int_pMes)
        {
            await using (var connection = new SqlConnection(_connectionString))
            {
                var parameters = new DynamicParameters();
                parameters.Add("@pPAIS_Id", int_pPaisId);
                parameters.Add("@pAnio", int_pAnio);
                parameters.Add("@pTipoReporte", int_TipoReporte);
                parameters.Add("@pPromotorId", int_pPromotorId);
                parameters.Add("@pMesId", int_pMes);
                var result = await connection.QueryAsync<BEReporte>("VentasPromotorDiario_Obtener", parameters,
                                        commandType: System.Data.CommandType.StoredProcedure);
                return result;
            }
        }
        public async Task<IEnumerable<BEReporte>> VentasPromotorMensuales_Obtener(int int_pPaisId, int int_pAnio, int int_TipoReporte, int int_pPromotorId)
        {
            await using (var connection = new SqlConnection(_connectionString))
            {
                var parameters = new DynamicParameters();
                parameters.Add("@pPAIS_Id", int_pPaisId);
                parameters.Add("@pAnio", int_pAnio);
                parameters.Add("@pTipoReporte", int_TipoReporte);
                parameters.Add("@pPromotorId", int_pPromotorId);
                var result = await connection.QueryAsync<BEReporte>("VentasPromotorMensuales_Obtener", parameters,
                                        commandType: System.Data.CommandType.StoredProcedure);
                return result;
            }
        }
		public async Task<IEnumerable<BEReporte>> VentasProductoMensuales_Obtener(int int_pPaisId, string? int_pSituacionId, int int_pAnio, int int_TipoReporte,int int_pAgenciaId, int int_pPromotorId, int int_pProductoId) {
			await using (var connection = new SqlConnection(_connectionString)) {
				var parameters = new DynamicParameters();
				parameters.Add("@pPAIS_Id", int_pPaisId);
				parameters.Add("@pSituacion_Id", int_pSituacionId);
				parameters.Add("@pAnio", int_pAnio);
				parameters.Add("@pTipoReporte", int_TipoReporte);
				parameters.Add("@pAgenciaId", int_pAgenciaId);
				parameters.Add("@pPromotorId", int_pPromotorId);
				parameters.Add("@pProductoId", int_pProductoId);
				var result = await connection.QueryAsync<BEReporte>("VentasProductoMensuales_Obtener", parameters,
										commandType: System.Data.CommandType.StoredProcedure);
				return result;
			}
		}
        public async Task<IEnumerable<BEReporte>> VentasRangoEdad_Obtener(int int_pGrupoId,
            int int_pPaisId, string? int_pSituacionId, int int_pAnio, int int_pMes,
            int int_TipoReporte, int int_pAgenciaId, int int_pPromotorId, int int_pProductoId) {
            await using (var connection = new SqlConnection(_connectionString)) {
                var parameters = new DynamicParameters();
                parameters.Add("@pGRUPO_Id", int_pGrupoId);
                parameters.Add("@pPAIS_Id", int_pPaisId);
                parameters.Add("@pSituacion_Id", int_pSituacionId);
                parameters.Add("@pAnio", int_pAnio);
                parameters.Add("@pMes", int_pMes);
                parameters.Add("@pTipoReporte", int_TipoReporte);
                parameters.Add("@pAgenciaId", int_pAgenciaId);
                parameters.Add("@pPromotorId", int_pPromotorId);
                parameters.Add("@pProductoId", int_pProductoId);
                var result = await connection.QueryAsync<BEReporte>("Ventas_RangoEdad_Obtener", parameters,
                                        commandType: System.Data.CommandType.StoredProcedure);
                return result;
            }
        }

		public async Task<IEnumerable<BEResumenCobranzaReporte>> ResumenCobranzaReporte_Obtener(int int_pAgenciaId = 0, DateTime dte_pFechaInicio = default, DateTime dte_pFechaFin = default, int pcodliquidacion = 0)
		{
			await using (var connection = new SqlConnection(_connectionString))
			{
				Helpers GeneralAyuda = new Helpers();
				string str_vFechaFechaInicio = "";
				string str_vFechaFechaFin = "";
				if (dte_pFechaInicio != DateTime.Parse("1900-01-01"))
					str_vFechaFechaInicio = GeneralAyuda.TraerFechaFormatoServidorBD(dte_pFechaInicio);
				if (dte_pFechaFin != DateTime.Parse("1900-01-01"))
					str_vFechaFechaFin = GeneralAyuda.TraerFechaFormatoServidorBD(dte_pFechaFin);
				var parameters = new DynamicParameters();
				parameters.Add("@pAGENCIA_Id", int_pAgenciaId);
				parameters.Add("@pFechaInicio", str_vFechaFechaInicio);
				parameters.Add("@pFechaFin", str_vFechaFechaFin);
				parameters.Add("@pCodLiquidacion", pcodliquidacion);
				var result = await connection.QueryAsync<BEResumenCobranzaReporte>("AgenciaCobranaza_Reporte", parameters,
										commandType: System.Data.CommandType.StoredProcedure);
				return result!;
			}
		}

		public async Task<IEnumerable<BEResumenComisionReporte>> ResumenComisionReporte_Obtener(int int_pAgenciaId = 0, DateTime dte_pFechaInicio = default, DateTime dte_pFechaFin = default, int pcodliquidacion = 0)
		{
			await using (var connection = new SqlConnection(_connectionString))
			{
				Helpers GeneralAyuda = new Helpers();
				string str_vFechaFechaInicio = "";
				string str_vFechaFechaFin = "";
				if (dte_pFechaInicio != DateTime.Parse("1900-01-01"))
					str_vFechaFechaInicio = GeneralAyuda.TraerFechaFormatoServidorBD(dte_pFechaInicio);
				if (dte_pFechaFin != DateTime.Parse("1900-01-01"))
					str_vFechaFechaFin = GeneralAyuda.TraerFechaFormatoServidorBD(dte_pFechaFin);
				var parameters = new DynamicParameters();
				parameters.Add("@pAGENCIA_Id", int_pAgenciaId);
				parameters.Add("@pFechaInicio", str_vFechaFechaInicio);
				parameters.Add("@pFechaFin", str_vFechaFechaFin);
				parameters.Add("@pCodLiquidacion", pcodliquidacion);
				var result = await connection.QueryAsync<BEResumenComisionReporte>("AgenciaComision_Reporte", parameters,
										commandType: System.Data.CommandType.StoredProcedure);
				return result!;
			}
		}

		public async Task<IEnumerable<BEResumenDescuentoReporte>> ResumenDescuentoReporte_Obtener(int int_pAgenciaId = 0, DateTime dte_pFechaInicio = default, DateTime dte_pFechaFin = default, int pcodliquidacion = 0)
		{
			await using (var connection = new SqlConnection(_connectionString))
			{
				Helpers GeneralAyuda = new Helpers();
				string str_vFechaFechaInicio = "";
				string str_vFechaFechaFin = "";
				if (dte_pFechaInicio != DateTime.Parse("1900-01-01"))
					str_vFechaFechaInicio = GeneralAyuda.TraerFechaFormatoServidorBD(dte_pFechaInicio);
				if (dte_pFechaFin != DateTime.Parse("1900-01-01"))
					str_vFechaFechaFin = GeneralAyuda.TraerFechaFormatoServidorBD(dte_pFechaFin);
				var parameters = new DynamicParameters();
				parameters.Add("@pAGENCIA_Id", int_pAgenciaId);
				parameters.Add("@pFechaInicio", str_vFechaFechaInicio);
				parameters.Add("@pFechaFin", str_vFechaFechaFin);
				parameters.Add("@pCodLiquidacion", pcodliquidacion);
				var result = await connection.QueryAsync<BEResumenDescuentoReporte>("AgenciaDescuento_Reporte", parameters,
										commandType: System.Data.CommandType.StoredProcedure);
				return result!;
			}
		}

		public async Task<IEnumerable<BEResumenPagoReporte>> ResumenPagoReporte_Obtener(int int_pAgenciaId = 0, DateTime dte_pFechaInicio = default, DateTime dte_pFechaFin = default, int pcodliquidacion = 0)
		{
			await using (var connection = new SqlConnection(_connectionString))
			{
				Helpers GeneralAyuda = new Helpers();
				string str_vFechaFechaInicio = "";
				string str_vFechaFechaFin = "";
				if (dte_pFechaInicio != DateTime.Parse("1900-01-01"))
					str_vFechaFechaInicio = GeneralAyuda.TraerFechaFormatoServidorBD(dte_pFechaInicio);
				if (dte_pFechaFin != DateTime.Parse("1900-01-01"))
					str_vFechaFechaFin = GeneralAyuda.TraerFechaFormatoServidorBD(dte_pFechaFin);
				var parameters = new DynamicParameters();
				parameters.Add("@pAGENCIA_Id", int_pAgenciaId);
				parameters.Add("@pFechaInicio", str_vFechaFechaInicio);
				parameters.Add("@pFechaFin", str_vFechaFechaFin);
                parameters.Add("@pCodLiquidacion", pcodliquidacion);

				var result = await connection.QueryAsync<BEResumenPagoReporte>("AgenciaPagos_Reporte", parameters,
										commandType: System.Data.CommandType.StoredProcedure);
				return result!;
			}
		}
		public async Task<IEnumerable<BEDetalleCobranzaReporte>> DetalleCobranzaReporte_Obtener(int int_pAgenciaId = 0, DateTime dte_pFechaInicio = default, DateTime dte_pFechaFin = default, int int_pCodigoLiquidacion = 0) {
			await using (var connection = new SqlConnection(_connectionString)) {
				Helpers GeneralAyuda = new Helpers();
				string str_vFechaFechaInicio = "";
				string str_vFechaFechaFin = "";
				if (dte_pFechaInicio != DateTime.Parse("1900-01-01"))
					str_vFechaFechaInicio = GeneralAyuda.TraerFechaFormatoServidorBD(dte_pFechaInicio);
				if (dte_pFechaFin != DateTime.Parse("1900-01-01"))
					str_vFechaFechaFin = GeneralAyuda.TraerFechaFormatoServidorBD(dte_pFechaFin);
				var parameters = new DynamicParameters();
				parameters.Add("@pAGENCIA_Id", int_pAgenciaId);
				parameters.Add("@pFechaInicio", str_vFechaFechaInicio);
				parameters.Add("@pFechaFin", str_vFechaFechaFin);
				parameters.Add("@pCodigoLiquidacion", int_pCodigoLiquidacion);
				var result = await connection.QueryAsync<BEDetalleCobranzaReporte>("AgenciaCobranza_Detalle", parameters,
										commandType: System.Data.CommandType.StoredProcedure);
				return result!;
			}
		}
	}
}
