using BackAssistanceTravelers.Models.Error;
using BackAssistanceTravelers.Models.Producto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BackAssistanceTravelers.Repositories.Travel
{
	public interface IProductoRepository
	{
		Task<BEError> Producto_Eliminar(int int_pProductoID);
		Task<BEError> Producto_Copiar(int int_pProductoID, int int_pProductoPaisId, int int_pUsuarioId);
		Task<IEnumerable<BEProducto>> Productos_Obtener(int int_pProductoID, int int_pProductoActivo = -1, int int_pProductoPaisId = 0, int int_pProductoGrupalActivo= -1, int int_pProductoPromocionActivo  = -1,int int_pProductoAgenciaID = 0);
		Task<BEError> Producto_Procesar(BEProductoBody obj_pProducto);
		Task<BEError> Producto_ValidaEquivalenvia(string? str_pProductoEquivalenviaID);
		Task<BEError> ProductoBeneficio_Eliminar(int int_pBeneficioID);
		Task<IEnumerable<BEProductoBeneficio>> ProductoBeneficio_Obtener(int int_pProductoID, int int_pBeneficioID, int int_pBeneficioIdioma = 1);
		Task<BEError> ProductoBeneficio_Procesar(BEProductoBeneficioBody obj_pProductoBeneficio);
		Task<BEError> ProductoTarifa_Eliminar(int int_pTarifaID);
		Task<IEnumerable<BEProductoTarifa>> ProductoTarifas_Obtener(int int_pProductoID, int int_pTarifaID);
        Task<IEnumerable<BEProductoTarifa>> ProductoTarifa_ObtenerxNumeroDias(int int_pProductoID, int int_pNumeroDias);
        Task<BEError> ProductoTarifa_Procesar(BEProductoTarifaBody obj_pProductoTarifa);
		Task<BEError> ProductoTarifaIncentivo_Procesar(BEProductoTarifaBody obj_pProductoTarifa);
		Task<IEnumerable<CotizadorProductoTarifa>> Cotizacion_Obtener(int pOrigen = 0, int pDestino = 0, int pDias = 0, int pCantidad = 0, int pModalidad = 0, int pEdadMayor = 0);
		Task<IEnumerable<BEProductoBeneficio>> ProductoBeneficioCoti_Obtener(string str_pProductoID, int int_pBeneficioIdioma = 1);
    }
}
