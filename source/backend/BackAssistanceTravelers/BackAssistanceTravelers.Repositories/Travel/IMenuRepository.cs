using BackAssistanceTravelers.Models.Permisos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BackAssistanceTravelers.Repositories.Travel
{
	public interface IMenuRepository
	{
		Task<IEnumerable<BEMenuPermiso>> Menu_ObtenerPermisos(int int_pPerfilId, string? int_pPerfilTipo);
		Task<IEnumerable<BEMenu>> Menu_Obtener(int int_pPerfilId);
		Task<IEnumerable<BEMenu>> Menu_ObtenerPermisosBotones(int int_pPerfilId, int int_pMenuPadreId);
		Task<IEnumerable<BEMenuDashboard>> MenuDashboard_Obtener(int pPerfilId, int pMenuPadreId);
	}
}
