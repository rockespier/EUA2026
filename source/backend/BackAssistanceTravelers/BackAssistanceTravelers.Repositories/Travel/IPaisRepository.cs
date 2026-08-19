using BackAssistanceTravelers.Models.Error;
using BackAssistanceTravelers.Models.Pais;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BackAssistanceTravelers.Repositories.Travel
{
	public interface IPaisRepository
	{
		Task<BEError> Pais_Eliminar(int int_pPaisID);
		Task<IEnumerable<BEPais>> Pais_Obtener(int int_pPaisID, int int_PaisActivo = -1);
		Task<BEError> Pais_Procesar(BEPaisBody obj_pPais);
		Task<BEError> PaisImagenPromocion_Eliminar(int int_pPaisImagenID);
		Task<IEnumerable<BEPaisImagenPromocion>> PaisImagenPromocion_Obtener(int int_pPaisImagenID, int int_pPaisID, int int_PaisActivo);
		Task<BEError> PaisImagenPromocion_Procesar(BEPaisImagenPromocion obj_pPais);
		Task<IEnumerable<BEPais>> Pais_OrigenDestinoObtener(int int_pOrigenID);
	}
}
