using BackAssistanceTravelers.Models.Error;
using BackAssistanceTravelers.Models.Pasajero;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BackAssistanceTravelers.Repositories.Travel
{
	public interface IPasajeroRepository
	{
		Task<IEnumerable<BEPasajero>> Pasajero_Obtener(int int_pPasajero_DocumentoTipo, string? str_pPasajero_DocumentoNumero, DateTime dte_pIngresoInicio = default, DateTime dte_pIngresoFin = default);
		Task<BEError> Pasajero_Procesar(BEPasajero obj_pVenta);
	}
}
