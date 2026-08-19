using BackAssistanceTravelers.Models.Cobranza;
using BackAssistanceTravelers.Models.Error;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BackAssistanceTravelers.Repositories.Travel
{
	public interface ICobranzaRepository
	{
		Task<BEError> Cobranza_Eliminar(int int_pCobranzaID);
		Task<IEnumerable<BECobranza>> Cobranza_Obtener(int int_pCobranzaId = 0, DateTime dte_pCobranzaIngresoInicio = default, DateTime dte_pCobranzaIngresoFin = default, DateTime dte_pCobranzaPagoInicio = default, DateTime dte_pCobranzaPagoFin = default, int int_pUsuarioId = 0, int pcodLiquidacion = 0);
		Task<BEError> Cobranza_Procesar(BECobranza obj_pCobranza);
		Task<BEError> Cobranza_Actualizar(BECobranza obj_pCobranza);
		Task<BEError> CobranzaPago_Procesar(BECobranzaPagoParametro obj_pCobranza);
		Task<BEError> CobranzaPago_Eliminar(int int_pCobranzaPagoID);
		Task<IEnumerable<BECobranzaPago>> CobranzaPago_Obtener(int int_pCobranzaId);
		Task<IEnumerable<BECobranzaVerificarPago>> CobranzaVerificarPago_Obtener(int int_pAgenciaId = 0, int int_pCodLiquidacion = 0);
		Task<BEError> CobranzaVerificarPago_Procesar(int int_pCobranzaId, int int_pEstadoId);
		Task<IEnumerable<BEIncentivo>> IncentivoPago_Obtener(int int_pBeneficiarioId, DateTime dte_pFechaInicio, DateTime dte_pFechaFin);
		Task<BEError> IncentivoPago_Procesar(int pVentaId, int pBeneficiarioId, int pUsuarioId);
		Task<IEnumerable<BECobranza>> CobranzaReporte_Obtener(DateTime dte_pCobranzaIngresoInicio = default, DateTime dte_pCobranzaIngresoFin = default, DateTime dte_pCobranzaIngresoInicioPago = default, DateTime dte_pCobranzaIngresoFinPago = default);
	}
}
