using BackAssistanceTravelers.Repositories.Travel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BackAssistanceTravelers.UnitOfWork
{
	public interface IUnitOfWork : IDisposable
	{
        IAgenciaRepository Agencias { get; }
        ICobranzaRepository Cobranzas { get; }
        IGeneralRepository Generales { get; }
        IMenuRepository Menus { get; }
        IPaisRepository Paises { get; }
        IPasajeroRepository Pasajeros { get; }
        IPerfilRepository Perfiles { get; }
        IPermisoRepository Permisos { get; }
        IProductoRepository Productos { get; }
        IPromocionRepository Promociones { get; }
        IReporteRepository Reportes { get; }
        ISolicitudRepository Solictudes { get; }
        IUsuarioRepository Usuarios { get; }
        IVentaRepository Ventas { get; }
		IValorRepository Valores { get; }
		IDashBoardJefeRepository DashBoardJefes { get; }
	}
}
