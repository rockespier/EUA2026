using BackAssistanceTravelers.Models.Error;
using BackAssistanceTravelers.Models.Promocion;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BackAssistanceTravelers.Repositories.Travel
{
	public interface IPromocionRepository
	{
		Task<BEError> Promocion_Eliminar(int int_pPromocionID);
		Task<IEnumerable<BEPromocion>> Promocion_Obtener(int int_pPromocionID, int int_pPromocionActivo, int int_pPromocionPaisId = 0, int int_pCodigoAgencia = 0);
		Task<BEError> Promocion_Procesar(BEPromocion obj_pPromocion);
        Task<IEnumerable<BEPromocionPais>> PromocionPais_Obtener(int int_pPromocionPaisId, int int_pPromocionID, int int_pAgenciaID, int int_pProductoID, int int_pDias = 0);
		Task<BEError> PromocionPais_Eliminar(int int_pPromocionPaisId, int int_pPromocionID, int int_pAgenciaID, int int_pProductoID);
		Task<BEError> PromocionPais_Procesar(BEPromocionPais oEntidad);
	}
}
