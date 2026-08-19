using BackAssistanceTravelers.Models.General;
using BackAssistanceTravelers.Models.Valores;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BackAssistanceTravelers.Repositories.Travel {
	public interface IValorRepository {
		Task<IEnumerable<BETipo>> Valores_ObtenerTipos();
		Task<IEnumerable<BEValor>> Valores_Obtener(string pValorNombreCampo, string pValorActivo, string pValorId);
		Task<IEnumerable<BEValor>> Valores_ObtenerAsesores(int idperfil, int idempresa);
		Task<BEResultado> Valores_Eliminar(string pValorID, string pValorCampo);
		Task<BEResultado> Valores_Procesar(BEValorBody pEntValor);			

	}
}
