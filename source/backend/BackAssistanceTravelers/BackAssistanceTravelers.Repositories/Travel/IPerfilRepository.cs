using BackAssistanceTravelers.Models.Error;
using BackAssistanceTravelers.Models.Perfil;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BackAssistanceTravelers.Repositories.Travel
{
	public interface IPerfilRepository
	{
		Task<BEError> Perfil_Eliminar(int int_pPerfilID);
		Task<IEnumerable<BEPerfil>> Perfil_Obtener(int int_pPerfilID, string? str_pPerfilOrigen);
		Task<BEError> Perfil_Procesar(BEPerfilBody obj_pPerfil);
        Task<BEError> PerfilMenu_Eliminar(int int_pPerfilId);
        Task<BEError> PerfilMenu_Procesar(int int_pRolId, string? str_pMenuIds);
	}
}
