using BackAssistanceTravelers.Models.Error;
using BackAssistanceTravelers.Models.General;
using BackAssistanceTravelers.Models.Usuario;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BackAssistanceTravelers.Repositories.Travel
{
	public interface IUsuarioRepository
	{
		Task<BEUsuario> Usuario_ValidarAcceso(string? str_pUsuario, string? str_pClave);
		Task<IEnumerable<BEUsuario>> Usuario_Obtener(int int_pUsuarioId, int int_pAgenciaId = 0, int int_pUsuarioPerfilId = 0, int int_pUsuarioActivo = -1, string str_pOrigen = "U");
		Task<IEnumerable<BEUsuario>> Usuario_ObtenerRecuperar(string? str_pUsuarioLogin, string? str_pUsuarioEmail);
		Task<IEnumerable<BEUsuario>> UsuarioPais_Obtener(int int_pUsuarioId, int int_pUsuarioPerfilId = 0, int int_pUsuarioActivo = -1, int int_pUsuarioPaisId = 0);
		Task<BEError> Usuario_Procesar(BEUsuarioParametro obj_pUsuario);
		Task<BEError> Usuario_CambiarClave(string? int_pUsuarioOrigen,int int_pUsuarioId, string? int_pUsuarioClave);
		Task<BEError> Usuario_Eliminar(int int_pUsuarioID, string str_pOrigen = "U");
		Task<BEErrorApi> Usuario_ValidarExistencia(string? str_pOpcion, string? str_pParametro);
		Task<BEErrorApi> Usuario_PrcesarTokenPassword(string pUsuario);
		Task<IEnumerable<BEUsuarioRelacion>> SuperVisorPromotor_Obtener(int int_pPaisId, int int_PadreID, int int_HijoID);
		Task<IEnumerable<BEUsuarioRelacion>> SuperVisor_Obtener(int int_pCaso, int int_pPaisId, int int_PadreID, int int_HijoID);
		Task<IEnumerable<BEUsuarioRelacion>> Promotor_Obtener(int int_pCaso, int int_pPaisId, int int_PadreID, int int_HijoID);
		Task<BEError> SuperVisorPromotor_Procesar(BEUsuarioRelacion oEntidad, int int_pSuper, int int_pPromo);
		Task<BEError> SuperVisorPromotor_Eliminar(int int_pSuper, int int_pPromo);
		Task<IEnumerable<BEJerarquiaPromotor>> PromotorJerarquia_Obtener(int int_pUusarioID);
		Task<IEnumerable<BEUsuario>> PromotorPais_Obtener(int int_pUusarioID, int int_pPaisId);
		Task<IEnumerable<BEUsuarioRelacion>> GraficoPromotor_Obtener(int int_Caso, DateTime str_pFechaInicial, DateTime str_pFechaFinal, int int_UsuarioPromotorID);
		Task<BEResultado> Usuario_ValidarMenu(int pIdUsuario, int pMenuId);
		Task<BEResultado> Usuario_ValidarTokenRestablecerPassword(string pToken, int pDuracion);
		Task<BEResultado> Usuario_CerrarTokenPassword(int pIdUsuario, string str_pOrigen);
	}
}
