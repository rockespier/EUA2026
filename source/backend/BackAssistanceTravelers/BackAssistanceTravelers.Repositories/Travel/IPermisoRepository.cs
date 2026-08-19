using BackAssistanceTravelers.Models.General;
using BackAssistanceTravelers.Models.Permisos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BackAssistanceTravelers.Repositories.Travel {
	public interface IPermisoRepository {
		Task<IEnumerable<BEMenuPermiso>> PermisoArbol_ObtenerPermisos(int pPerfilId);
		Task<BEResultado> PermisoArbol_Procesar(int pPerfilId, string pMenuIds);
	}
}
