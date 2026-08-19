using BackAssistanceTravelers.Models.General;
using BackAssistanceTravelers.Repositories.Travel;
using BackAssistanceTravelers.UnitOfWork;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BackAssistanceTravelers.Repositories.Dapper.Travel
{
    public class TravelUnitOfWork : IUnitOfWork
    {
        private bool _disposed = false;

        public TravelUnitOfWork(string connectionString)
        {
            Agencias = new AgenciaRepository(connectionString);
            Cobranzas = new CobranzaRepository(connectionString);
            Generales = new GeneralRepository(connectionString);
            Menus = new MenuRepository(connectionString);
            Paises = new PaisRepository(connectionString);
            Pasajeros = new PasajeroRepository(connectionString);
            Perfiles = new PerfilRepository(connectionString);
            Permisos = new PermisoRepository(connectionString);
            Productos = new ProductoRepository(connectionString);
            Promociones = new PromocionRepository(connectionString);
            Reportes = new ReporteRepository(connectionString);
            Solictudes = new SolicitudRepository(connectionString);
            Usuarios = new UsuarioRepository(connectionString);
            Ventas = new VentaRepository(connectionString);
            Valores = new ValorRepository(connectionString);
			DashBoardJefes = new DashBoardJefeRepository(connectionString);
		}
        public IAgenciaRepository Agencias
        {
            get;
            private set;
        }
        public ICobranzaRepository Cobranzas
        {
            get;
            private set;
        }
        public IGeneralRepository Generales
        {
            get;
            private set;
        }
        public IMenuRepository Menus
        {
            get;
            private set;
        }
        public IPaisRepository Paises
        {
            get;
            private set;
        }
        public IPasajeroRepository Pasajeros
        {
            get;
            private set;
        }
		public IPermisoRepository Permisos {
			get;
			private set;

		}
		public IPerfilRepository Perfiles
        {
            get;
            private set;

        }
        public IProductoRepository Productos
        {
            get;
            private set;
        }
        public IPromocionRepository Promociones
        {
            get;
            private set;
        }
        public IReporteRepository Reportes
        {
            get;
            private set;
        }
        public ISolicitudRepository Solictudes
        {
            get;
            private set;
        }
        public IUsuarioRepository Usuarios
        {
            get;
            private set;
        }
        public IVentaRepository Ventas
        {
            get;
            private set;
        }
		public IValorRepository Valores {
			get;
			private set;
		}
		public IDashBoardJefeRepository DashBoardJefes {
			get;
			private set;
		}

        public void Dispose()
        {
            Dispose(true);
            GC.SuppressFinalize(this);
        }

        protected virtual void Dispose(bool disposing)
        {
            if (!_disposed)
            {
                _disposed = true;
            }
        }
	}
}
