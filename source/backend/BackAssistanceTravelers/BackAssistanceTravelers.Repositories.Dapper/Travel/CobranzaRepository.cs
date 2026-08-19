using BackAssistanceTravelers.Models.Agencia;
using BackAssistanceTravelers.Models.Cobranza;
using BackAssistanceTravelers.Models.Error;
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
    public class CobranzaRepository : Repository, ICobranzaRepository
    {
        public CobranzaRepository(string connectionString) : base(connectionString)
        {
        }
		public async Task<BEError> CobranzaPago_Eliminar(int int_pCobranzaPagoID)
		{
			await using (var connection = new SqlConnection(_connectionString))
			{
				var parameters = new DynamicParameters();
				parameters.Add("@pCobranzaPago_Id", int_pCobranzaPagoID);
				var result = await connection.QueryFirstOrDefaultAsync<BEError>
										("Cobranza_PagoEliminar", parameters,
										commandType: System.Data.CommandType.StoredProcedure);
				return result!;
			}
		}
		public async Task<IEnumerable<BECobranzaPago>> CobranzaPago_Obtener(int int_pCobranzaId)
		{
			await using (var connection = new SqlConnection(_connectionString))
			{

				var parameters = new DynamicParameters();
				parameters.Add("@pCOBRANZAPAGO_CobranzaId", int_pCobranzaId);
				var result = await connection.QueryAsync<BECobranzaPago>("Cobranza_PagoObtener", parameters,
										commandType: System.Data.CommandType.StoredProcedure);
				return result;
			}
		}
		public async Task<BEError> CobranzaPago_Procesar(BECobranzaPagoParametro obj_pCobranza)
		{
			await using (var connection = new SqlConnection(_connectionString))
			{
				Helpers GeneralAyuda = new Helpers();
				string str_pCobranzaPagoFecha = "";
				if (obj_pCobranza.cobranzapagoFecha != DateTime.Parse("0001-01-01"))
					str_pCobranzaPagoFecha = GeneralAyuda.TraerFechaFormatoServidorBD(obj_pCobranza.cobranzapagoFecha);

				var parameters = new DynamicParameters();
				parameters.Add("@pcobranzapagoId", obj_pCobranza.cobranzapagoId);
				parameters.Add("@pcobranzapagoCobranzaId", obj_pCobranza.cobranzapagoCobranzaId);
				parameters.Add("@pcobranzapagoMedioId", obj_pCobranza.cobranzapagoMedioId);
				parameters.Add("@pcobranzapagoFecha", str_pCobranzaPagoFecha);
				parameters.Add("@pcobranzapagoImporte", obj_pCobranza.cobranzapagoImporte);
				parameters.Add("@pcobranzapagoCreadoUsuario", obj_pCobranza.cobranzapagoCreadoUsuario);
				parameters.Add("@pcobranzapagoEvidenciaRuta", obj_pCobranza.cobranzapagoEvidenciaRuta);
				parameters.Add("@pcobranzapagoObservacion", obj_pCobranza.cobranzapagoObservacion);
				var result = await connection.QueryFirstOrDefaultAsync<BEError>("Cobranza_PagoProcesar", parameters,
										commandType: System.Data.CommandType.StoredProcedure);
				return result!;
			}
		}

		public async Task<BEError> Cobranza_Actualizar(BECobranza obj_pCobranza)
        {
            await using (var connection = new SqlConnection(_connectionString))
            {
                Helpers GeneralAyuda = new Helpers();
                string str_pCobranzaPagoFecha = "";
                if (obj_pCobranza.cobranzaPagoFecha != DateTime.Parse("0001-01-01"))
                    str_pCobranzaPagoFecha = GeneralAyuda.TraerFechaFormatoServidorBD(obj_pCobranza.cobranzaPagoFecha);

                var parameters = new DynamicParameters();
                parameters.Add("@pCOBRANZA_Id", obj_pCobranza.cobranzaId);
                parameters.Add("@pCOBRANZA_Cliente", obj_pCobranza.cobranzaCliente);
                parameters.Add("@pCOBRANZA_DocumentoTipoId", obj_pCobranza.cobranzaDocumentoTipoId);
                parameters.Add("@pCOBRANZA_DocumentoSerie", obj_pCobranza.cobranzaDocumentoSerie);
                parameters.Add("@pCOBRANZA_DocumentoCorrelativo", obj_pCobranza.cobranzaDocumentoCorrelativo);
                parameters.Add("@pCOBRANZA_Comision", obj_pCobranza.cobranzaComision == null ? 0 : obj_pCobranza.cobranzaComision);
                parameters.Add("@pCOBRANZA_Incentivo", obj_pCobranza.cobranzaIncentivo == null ? 0 : obj_pCobranza.cobranzaIncentivo);
                parameters.Add("@pCOBRANZA_PagoMedioId", obj_pCobranza.cobranzaPagoMedioId);
                parameters.Add("@pCOBRANZA_PagoFecha", str_pCobranzaPagoFecha);
                parameters.Add("@pCOBRANZA_NotaCredito", obj_pCobranza.cobranzaNotaCredito == null ? "" : obj_pCobranza.cobranzaNotaCredito);
                parameters.Add("@pCOBRANZA_CobradorId", obj_pCobranza.cobranzaCobradorId);
                parameters.Add("@pCOBRANZA_ImporteBruto", obj_pCobranza.cobranzaImporteBruto);
                parameters.Add("@pCOBRANZA_ImportePago", obj_pCobranza.cobranzaImportePago);
                parameters.Add("@pCOBRANZA_Observacion", obj_pCobranza.cobranzaObservacion == null ? "" : obj_pCobranza.cobranzaObservacion);
                parameters.Add("@pCOBRANZA_Usuario", obj_pCobranza.cobranzaCreadoUsuarioId);
                parameters.Add("@pCOBRANZA_Descuento", obj_pCobranza.cobranzaDescuento);
                var result = await connection.QueryFirstOrDefaultAsync<BEError>("Cobranza_Actualizar", parameters,
                                        commandType: System.Data.CommandType.StoredProcedure);
                return result!;
            }
        }
        public async Task<BEError> Cobranza_Eliminar(int int_pCobranzaID)
        {
            await using (var connection = new SqlConnection(_connectionString))
            {
                var parameters = new DynamicParameters();
                parameters.Add("@pCOBRANZA_Id", int_pCobranzaID);
                var result = await connection.QueryFirstOrDefaultAsync<BEError>
                                        ("Cobranza_Eliminar", parameters,
                                        commandType: System.Data.CommandType.StoredProcedure);
                return result!;
            }
        }
        public async Task<IEnumerable<BECobranza>> Cobranza_Obtener(int int_pCobranzaId = 0, DateTime dte_pCobranzaIngresoInicio = default, 
			DateTime dte_pCobranzaIngresoFin = default, DateTime dte_pCobranzaPagoInicio = default, 
			DateTime dte_pCobranzaPagoFin = default, int int_pUsuarioId = 0,
			int pcodLiquidacion = 0)
        {
            await using (var connection = new SqlConnection(_connectionString))
            {
                Helpers GeneralAyuda = new Helpers();
                string str_pCobranzaIngresoInicio = "";
                string str_pCobranzaIngresoFin = "";
                string str_pCobranzaPagoInicio = "";
                string str_pCobranzaPagoFin = "";

                if (dte_pCobranzaIngresoInicio != DateTime.Parse("1970-01-01"))
                    str_pCobranzaIngresoInicio = GeneralAyuda.TraerFechaFormatoServidorBD(dte_pCobranzaIngresoInicio);

                if (dte_pCobranzaIngresoFin != DateTime.Parse("1970-01-01"))
                    str_pCobranzaIngresoFin = GeneralAyuda.TraerFechaFormatoServidorBD(dte_pCobranzaIngresoFin);
                
                if (dte_pCobranzaPagoInicio != DateTime.Parse("1970-01-01"))
                    str_pCobranzaPagoInicio = GeneralAyuda.TraerFechaFormatoServidorBD(dte_pCobranzaPagoInicio);

                if (dte_pCobranzaPagoFin != DateTime.Parse("1970-01-01"))
                    str_pCobranzaPagoFin = GeneralAyuda.TraerFechaFormatoServidorBD(dte_pCobranzaPagoFin);

                var parameters = new DynamicParameters();
                parameters.Add("@pCOBRANZA_Id", int_pCobranzaId);
                parameters.Add("@pCOBRANZA_FechaIngresoInicio", str_pCobranzaIngresoInicio);
                parameters.Add("@pCOBRANZA_FechaIngresoFin", str_pCobranzaIngresoFin);
                parameters.Add("@pCOBRANZA_FechaPagoInicio", str_pCobranzaPagoInicio);
                parameters.Add("@pCOBRANZA_FechaPagoFin", str_pCobranzaPagoFin);
                parameters.Add("@pUsuario_Id", int_pUsuarioId);
				parameters.Add("@pCodLiquidacion", pcodLiquidacion);
				var result = await connection.QueryAsync<BECobranza>("Cobranza_Obtener", parameters,
                                        commandType: System.Data.CommandType.StoredProcedure);
                return result;
            }
        }
        public async Task<BEError> Cobranza_Procesar(BECobranza obj_pCobranza)
        {
            await using (var connection = new SqlConnection(_connectionString))
            {
                Helpers GeneralAyuda = new Helpers();
                string str_pCobranzaPagoFecha = "";
                if (obj_pCobranza.cobranzaPagoFecha != DateTime.Parse("0001-01-01"))
                    str_pCobranzaPagoFecha = GeneralAyuda.TraerFechaFormatoServidorBD(obj_pCobranza.cobranzaPagoFecha);

                var parameters = new DynamicParameters();
                parameters.Add("@pCOBRANZA_Id", obj_pCobranza.cobranzaId);
                parameters.Add("@pCOBRANZA_Cliente", obj_pCobranza.cobranzaCliente);
                parameters.Add("@pCOBRANZA_DocumentoTipoId", obj_pCobranza.cobranzaDocumentoTipoId);
                parameters.Add("@pCOBRANZA_DocumentoSerie", obj_pCobranza.cobranzaDocumentoSerie);
                parameters.Add("@pCOBRANZA_DocumentoCorrelativo", obj_pCobranza.cobranzaDocumentoCorrelativo);
                parameters.Add("@pCOBRANZA_Comision", obj_pCobranza.cobranzaComision);
                parameters.Add("@pCOBRANZA_Incentivo", obj_pCobranza.cobranzaIncentivo);
                parameters.Add("@pCOBRANZA_PagoMedioId", obj_pCobranza.cobranzaPagoMedioId);
                parameters.Add("@pCOBRANZA_PagoFecha", str_pCobranzaPagoFecha);
                parameters.Add("@pCOBRANZA_NotaCredito", obj_pCobranza.cobranzaNotaCredito);
                parameters.Add("@pCOBRANZA_CobradorId", obj_pCobranza.cobranzaCobradorId);
                parameters.Add("@pCOBRANZA_ImporteBruto", obj_pCobranza.cobranzaImporteBruto);
                parameters.Add("@pCOBRANZA_ImportePago", obj_pCobranza.cobranzaImportePago);
                parameters.Add("@pCOBRANZA_Observacion", obj_pCobranza.cobranzaObservacion);
                parameters.Add("@pCOBRANZA_Usuario", obj_pCobranza.cobranzaCreadoUsuarioId);
                parameters.Add("@pCOBRANZA_VentaIds", obj_pCobranza.cobranzaVentaIds);
                parameters.Add("@pCOBRANZA_Descuento", obj_pCobranza.cobranzaDescuento);
				parameters.Add("@pCOBRANZA_CodLiquidacion", obj_pCobranza.cobranzaCodigoLiquidacion);
				var result = await connection.QueryFirstOrDefaultAsync<BEError>("Cobranza_Procesar", parameters,
                                        commandType: System.Data.CommandType.StoredProcedure);
                return result!;
            }
        }
		public async Task<IEnumerable<BECobranzaVerificarPago>> CobranzaVerificarPago_Obtener(int int_pAgenciaId = 0, int int_pCodLiquidacion = 0)
		{
			await using (var connection = new SqlConnection(_connectionString))
			{

				var parameters = new DynamicParameters();
				parameters.Add("@pCOBRANZAPAGO_AgenciaId", int_pAgenciaId);
				parameters.Add("@pCodLiquidacion", int_pCodLiquidacion);
				var result = await connection.QueryAsync<BECobranzaVerificarPago>("Cobranza_PagoVerificarObtener", parameters,
										commandType: System.Data.CommandType.StoredProcedure);
				return result;
			}
		}
		public async Task<BEError> CobranzaVerificarPago_Procesar(int int_pCobranzaId, int int_pEstadoId)
		{
			await using (var connection = new SqlConnection(_connectionString))
			{
				var parameters = new DynamicParameters();
				parameters.Add("@pCOBRANZAPAGO_CobranzaId", int_pCobranzaId);
				parameters.Add("@pCOBRANZAPAGO_EstadoId", int_pEstadoId);
				var result = await connection.QueryFirstOrDefaultAsync<BEError>("Cobranza_PagoVerificarProcesar", parameters,
										commandType: System.Data.CommandType.StoredProcedure);
				return result!;
			}
		}
	
		public async Task<IEnumerable<BEIncentivo>> IncentivoPago_Obtener(int int_pBeneficiarioId, DateTime dte_pFechaInicio, DateTime dte_pFechaFin) {
			await using (var connection = new SqlConnection(_connectionString)) {
				Helpers GeneralAyuda = new Helpers();
				string str_vFechaFechaVigenciaInicio = "";
				string str_vFechaFechaVigenciaFin = "";
				if (dte_pFechaInicio != DateTime.Parse("1900-01-01"))
					str_vFechaFechaVigenciaInicio = GeneralAyuda.TraerFechaFormatoServidorBD(dte_pFechaInicio);
				if (dte_pFechaFin != DateTime.Parse("1900-01-01"))
					str_vFechaFechaVigenciaFin = GeneralAyuda.TraerFechaFormatoServidorBD(dte_pFechaFin);
				var parameters = new DynamicParameters();
				parameters.Add("@pIncentivoPagoBeneficiarioId", int_pBeneficiarioId);
				parameters.Add("@pFechainicio", str_vFechaFechaVigenciaInicio);
				parameters.Add("@pFechaFin", str_vFechaFechaVigenciaFin);
				var result = await connection.QueryAsync<BEIncentivo>("Incentivo_PagoObtener", parameters,
										commandType: System.Data.CommandType.StoredProcedure);
				return result;
			}
		}
		public async Task<BEError> IncentivoPago_Procesar(int pVentaId, int pBeneficiarioId, int pUsuarioId) {
			await using (var connection = new SqlConnection(_connectionString)) {
				var parameters = new DynamicParameters();
				parameters.Add("@pIncentivoPagoVentaId", pVentaId);
				parameters.Add("@pIncentivoPagoBeneficiarioId", pBeneficiarioId);
				parameters.Add("@pIncentivoPagoUsuario", pUsuarioId);
				parameters.Add("@pIncentivoPagoObservaciones", "");
				var result = await connection.QueryFirstOrDefaultAsync<BEError>("Incentivo_PagoProcesar", parameters,
										commandType: System.Data.CommandType.StoredProcedure);
				return result!;
			}
		}
		public async Task<IEnumerable<BECobranza>> CobranzaReporte_Obtener(DateTime dte_pCobranzaIngresoInicio = default, DateTime dte_pCobranzaIngresoFin = default, DateTime dte_pCobranzaIngresoInicioPago = default, DateTime dte_pCobranzaIngresoFinPago = default) {
			await using (var connection = new SqlConnection(_connectionString)) {
				Helpers GeneralAyuda = new Helpers();
				string str_pCobranzaIngresoInicio = "";
				string str_pCobranzaIngresoFin = "";
				
				if (dte_pCobranzaIngresoInicio != DateTime.Parse("1970-01-01"))
					str_pCobranzaIngresoInicio = GeneralAyuda.TraerFechaFormatoServidorBD(dte_pCobranzaIngresoInicio);

				if (dte_pCobranzaIngresoFin != DateTime.Parse("1970-01-01"))
					str_pCobranzaIngresoFin = GeneralAyuda.TraerFechaFormatoServidorBD(dte_pCobranzaIngresoFin);

				string str_pCobranzaIngresoInicioPago = "";
				string str_pCobranzaIngresoFinPago = "";

				if (dte_pCobranzaIngresoInicioPago != DateTime.Parse("1970-01-01"))
					str_pCobranzaIngresoInicioPago = GeneralAyuda.TraerFechaFormatoServidorBD(dte_pCobranzaIngresoInicioPago);

				if (dte_pCobranzaIngresoFinPago != DateTime.Parse("1970-01-01"))
					str_pCobranzaIngresoFinPago = GeneralAyuda.TraerFechaFormatoServidorBD(dte_pCobranzaIngresoFinPago);

				var parameters = new DynamicParameters();				
				parameters.Add("@pFechaInicio", str_pCobranzaIngresoInicio);
				parameters.Add("@pFechaFin", str_pCobranzaIngresoFin);
				parameters.Add("@pAgenciaId", 0);
				parameters.Add("@pFechaInicioPago", str_pCobranzaIngresoInicioPago);
				parameters.Add("@pFechaFinPago", str_pCobranzaIngresoFinPago);
				var result = await connection.QueryAsync<BECobranza>("LiquidacionCuadre_Obtener", parameters,
										commandType: System.Data.CommandType.StoredProcedure);
				return result;
			}
		}
	}
}
