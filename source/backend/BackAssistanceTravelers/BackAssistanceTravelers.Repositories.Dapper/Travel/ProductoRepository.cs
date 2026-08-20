using BackAssistanceTravelers.Models.Cobranza;
using BackAssistanceTravelers.Models.Error;
using BackAssistanceTravelers.Models.Producto;
using BackAssistanceTravelers.Repositories.Travel;
using Dapper;
using Microsoft.Data.SqlClient;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BackAssistanceTravelers.Repositories.Dapper.Travel
{
    public class ProductoRepository : Repository, IProductoRepository
    {
        public ProductoRepository(string connectionString) : base(connectionString)
        {
        }
        public async Task<BEError> ProductoBeneficio_Eliminar(int int_pBeneficioID)
        {
            await using (var connection = new SqlConnection(_connectionString))
            {
                var parameters = new DynamicParameters();
                parameters.Add("@pBeneficio_Id", int_pBeneficioID);
                var result = await connection.QueryFirstOrDefaultAsync<BEError>
                                        ("ProductoBeneficio_Eliminar", parameters,
                                        commandType: System.Data.CommandType.StoredProcedure);
                return result!;
            }
        }
        public async Task<IEnumerable<BEProductoBeneficio>> ProductoBeneficio_Obtener(int int_pProductoID, int int_pBeneficioID, int int_pBeneficioIdioma = 1)
        {
            await using (var connection = new SqlConnection(_connectionString))
            {
                var parameters = new DynamicParameters();
                parameters.Add("@pPRODUCTO_Id", int_pProductoID);
                parameters.Add("@pBeneficio_Id", int_pBeneficioID);
                parameters.Add("@pIdioma", int_pBeneficioIdioma);
                var result = await connection.QueryAsync<BEProductoBeneficio>("ProductoBeneficio_Obtener", parameters,
                                        commandType: System.Data.CommandType.StoredProcedure);
                return result;
            }
        }
        public async Task<BEError> ProductoBeneficio_Procesar(BEProductoBeneficioBody obj_pProductoBeneficio)
        {
            await using (var connection = new SqlConnection(_connectionString))
            {
                var parameters = new DynamicParameters();
                parameters.Add("@pPRODUCTO_Id", obj_pProductoBeneficio.beneficioProductoId);
                parameters.Add("@pBeneficio_Id", obj_pProductoBeneficio.beneficioId);
                parameters.Add("@pBeneficio_Nombre", obj_pProductoBeneficio.beneficioNombre);
                parameters.Add("@pBeneficio_Importe", obj_pProductoBeneficio.beneficioImporte);
                parameters.Add("@pBeneficio_Usuario", obj_pProductoBeneficio.beneficioCreadoUsuarioId);
                parameters.Add("@pBeneficio_Idioma", obj_pProductoBeneficio.beneficioIdiomaId);
                parameters.Add("@pBeneficio_Orden", obj_pProductoBeneficio.beneficioOrden);
                var result = await connection.QueryFirstOrDefaultAsync<BEError>
                                        ("ProductoBeneficio_Procesar", parameters,
                                        commandType: System.Data.CommandType.StoredProcedure);
                return result!;
            }
        }
        public async Task<IEnumerable<BEProducto>> Productos_Obtener(int int_pProductoID, int int_pProductoActivo = -1, int int_pProductoPaisId = 0, int int_pProductoGrupalActivo = -1, int int_pProductoPromocionActivo = -1, int int_pProductoAgenciaID = 0)
        {
            await using (var connection = new SqlConnection(_connectionString))
            {
                var parameters = new DynamicParameters();
                parameters.Add("@pPRODUCTO_Id", int_pProductoID);
                parameters.Add("@pPRODUCTO_PaisId", int_pProductoPaisId);
                parameters.Add("@pPRODUCTO_Activo", int_pProductoActivo);
                parameters.Add("@pPRODUCTO_GrupalActivo", int_pProductoGrupalActivo);
                parameters.Add("@pPRODUCTO_PromocionActivo", int_pProductoPromocionActivo);
                parameters.Add("@pPRODUCTO_AgenciaID", int_pProductoAgenciaID);

                var result = await connection.QueryAsync<BEProducto>("Producto_Obtener_2026", parameters,
                                        commandType: System.Data.CommandType.StoredProcedure);
                return result;
            }
        }
        public async Task<IEnumerable<BEProductoTarifa>> ProductoTarifas_Obtener(int int_pProductoID, int int_pTarifaID)
        {
            await using (var connection = new SqlConnection(_connectionString))
            {
                var parameters = new DynamicParameters();
                parameters.Add("@pPRODUCTO_Id", int_pProductoID);
                parameters.Add("@pTARIFA_Id", int_pTarifaID);

                var result = await connection.QueryAsync<BEProductoTarifa>("ProductoTarifa_Obtener", parameters,
                                        commandType: System.Data.CommandType.StoredProcedure);
                return result;
            }
        }
        public async Task<BEError> ProductoTarifa_Eliminar(int int_pTarifaID)
        {
            await using (var connection = new SqlConnection(_connectionString))
            {
                var parameters = new DynamicParameters();
                parameters.Add("@pTARIFA_Id", int_pTarifaID);
                var result = await connection.QueryFirstOrDefaultAsync<BEError>
                                        ("ProductoTarifa_Eliminar", parameters,
                                        commandType: System.Data.CommandType.StoredProcedure);
                return result!;
            }
        }
        public async Task<IEnumerable<BEProductoTarifa>> ProductoTarifa_ObtenerxNumeroDias(int int_pProductoID, int int_pNumeroDias)
        {
            await using (var connection = new SqlConnection(_connectionString))
            {
                var parameters = new DynamicParameters();
                parameters.Add("@pPRODUCTO_Id", int_pProductoID);
                parameters.Add("@pTARIFA_NumeroDias", int_pNumeroDias);

                var result = await connection.QueryAsync<BEProductoTarifa>("ProductoTarifa_ObtenerxNumeroDias", parameters,
                                        commandType: System.Data.CommandType.StoredProcedure);
                return result;
            }
        }
        public async Task<BEError> ProductoTarifa_Procesar(BEProductoTarifaBody obj_pProductoTarifa)
        {
            await using (var connection = new SqlConnection(_connectionString))
            {
                var parameters = new DynamicParameters();
                parameters.Add("@pPRODUCTO_Id", obj_pProductoTarifa.tarifaProductoId);
                parameters.Add("@pTARIFA_Id", obj_pProductoTarifa.tarifaId);
                parameters.Add("@pTARIFA_NumeroDiasMinimo", obj_pProductoTarifa.tarifaNumeroDiasMinimo);
                parameters.Add("@pTARIFA_NumeroDiasMaximo", obj_pProductoTarifa.tarifaNumeroDiasMaximo);
                parameters.Add("@pTARIFA_Importe", obj_pProductoTarifa.tarifaImporte);
                parameters.Add("@pTARIFA_Usuario", obj_pProductoTarifa.tarifaCreadoUsuarioId);
                parameters.Add("@pTARIFA_Incentivo", obj_pProductoTarifa.TarifaIncentivo);
                parameters.Add("@pTARIFA_Publicidad", obj_pProductoTarifa.TarifaPublicidad);
                var result = await connection.QueryFirstOrDefaultAsync<BEError>
                                        ("ProductoTarifa_Procesar", parameters,
                                        commandType: System.Data.CommandType.StoredProcedure);
                return result!;
            }
        }
		public async Task<BEError> ProductoTarifaIncentivo_Procesar(BEProductoTarifaBody obj_pProductoTarifa) {
			await using (var connection = new SqlConnection(_connectionString)) {
				var parameters = new DynamicParameters();
				parameters.Add("@pPRODUCTO_Id", obj_pProductoTarifa.tarifaProductoId);
				parameters.Add("@pTARIFA_Id", obj_pProductoTarifa.tarifaId);
				parameters.Add("@pTARIFA_NumeroDiasMinimo", obj_pProductoTarifa.tarifaNumeroDiasMinimo);
				parameters.Add("@pTARIFA_NumeroDiasMaximo", obj_pProductoTarifa.tarifaNumeroDiasMaximo);
				parameters.Add("@pTARIFA_Importe", obj_pProductoTarifa.tarifaImporte);
				parameters.Add("@pTARIFA_Usuario", obj_pProductoTarifa.tarifaCreadoUsuarioId);
				parameters.Add("@pTARIFA_Incentivo", obj_pProductoTarifa.TarifaIncentivo);
				parameters.Add("@pTARIFA_Publicidad", obj_pProductoTarifa.TarifaPublicidad);
				var result = await connection.QueryFirstOrDefaultAsync<BEError>
										("ProductoTarifaIncentivo_Procesar", parameters,
										commandType: System.Data.CommandType.StoredProcedure);
				return result!;
			}
		}
		public async Task<BEError> Producto_Copiar(int int_pProductoID, int int_pProductoPaisId, int int_pUsuarioId)
        {
            await using (var connection = new SqlConnection(_connectionString))
            {
                var parameters = new DynamicParameters();
                parameters.Add("@pPRODUCTO_Id", int_pProductoID);
                parameters.Add("@pPRODUCTO_Usuario", int_pUsuarioId);
                parameters.Add("@pPRODUCTO_PaisId", int_pProductoPaisId);
                var result = await connection.QueryFirstOrDefaultAsync<BEError>
                                        ("Producto_Copiar", parameters,
                                        commandType: System.Data.CommandType.StoredProcedure);
                return result!;
            }
        }
        public async Task<BEError> Producto_Eliminar(int int_pProductoID)
        {
            await using (var connection = new SqlConnection(_connectionString))
            {
                var parameters = new DynamicParameters();
                parameters.Add("@pPRODUCTO_Id", int_pProductoID);
                var result = await connection.QueryFirstOrDefaultAsync<BEError>
                                        ("Producto_Eliminar", parameters,
                                        commandType: System.Data.CommandType.StoredProcedure);
                return result!;
            }
        }
        public async Task<BEError> Producto_Procesar(BEProductoBody obj_pProducto)
        {
            await using (var connection = new SqlConnection(_connectionString))
            {
                var parameters = new DynamicParameters();
                parameters.Add("@pPRODUCTO_Id", obj_pProducto.productoId);
                parameters.Add("@pPRODUCTO_ReferenciaId", obj_pProducto.productoReferenciaId);
                parameters.Add("@pPRODUCTO_Nombre", obj_pProducto.productoNombre);
                parameters.Add("@pPRODUCTO_Servicio", obj_pProducto.productoServicio);
                parameters.Add("@pPRODUCTO_URL", obj_pProducto.productoURL);
                parameters.Add("@pPRODUCTO_ImporteTarifaFija", obj_pProducto.productoImporteTarifaFija);
                parameters.Add("@pPRODUCTO_ImporteDiaAdicional", obj_pProducto.productoImporteDiaAdicional);
                parameters.Add("@pPRODUCTO_EdadMinima", obj_pProducto.productoEdadMinima);
                parameters.Add("@pPRODUCTO_EdadMaxima", obj_pProducto.productoEdadMaxima);
                parameters.Add("@pPRODUCTO_NumeroDias", obj_pProducto.productoNumeroDias);
                parameters.Add("@pPRODUCTO_Usuario", obj_pProducto.productoCreadoUsuarioId);
                parameters.Add("@pPRODUCTO_Activo", obj_pProducto.productoActivo);
                parameters.Add("@pPRODUCTO_Orden", obj_pProducto.productoOrdenListado);
                parameters.Add("@pPRODUCTO_PaisId", obj_pProducto.productoPaisId);
                parameters.Add("@pPRODUCTO_ActivoWeb", obj_pProducto.productoActivoWeb);
                parameters.Add("@pPRODUCTO_GrupalActivo", obj_pProducto.productoGrupalActivo);
                parameters.Add("@pPRODUCTO_GrupalPorcentaje", obj_pProducto.productoGrupalPorcentaje);
                parameters.Add("@pPRODUCTO_PromocionActivo", obj_pProducto.productoPromocionActivo);
                parameters.Add("@pPRODUCTO_ImporteCero", obj_pProducto.productoImporteCero);
                parameters.Add("@pPRODUCTO_ATVCodigo", obj_pProducto.productoATVCodigo);
                parameters.Add("@pPRODUCTO_Marca", obj_pProducto.productoMarca);

                var result = await connection.QueryFirstOrDefaultAsync<BEError>
                                        ("Producto_Procesar", parameters,
                                        commandType: System.Data.CommandType.StoredProcedure);
                return result!;
            }
        }
        public async Task<BEError> Producto_ValidaEquivalenvia(string? str_pProductoEquivalenviaID)
        {
            await using (var connection = new SqlConnection(_connectionString))
            {
                var parameters = new DynamicParameters();
                parameters.Add("@pPRODUCTO_EquivalenciaId", str_pProductoEquivalenviaID);
                var result = await connection.QueryFirstOrDefaultAsync<BEError>
                                        ("Producto_ValidaEquivalenvia", parameters,
                                        commandType: System.Data.CommandType.StoredProcedure);
                return result!;
            }
        }

        public async Task<IEnumerable<CotizadorProductoTarifa>> Cotizacion_Obtener(int pOrigen = 0, int pDestino = 0, int pDias = 0,
                    int pCantidad = 0, int pModalidad = 0, int pEdadMayor = 0)
        {
            await using (var connection = new SqlConnection(_connectionString))
            {
                var parameters = new DynamicParameters();
                parameters.Add("@pOrigen", pOrigen);
                parameters.Add("@DestinoId", pDestino);
                parameters.Add("@pDias", pDias);
                parameters.Add("@pCantidadPasajeros", pCantidad);
                parameters.Add("@pModalidad", pModalidad);
                parameters.Add("@pEdadMayor", pEdadMayor);

                var result = await connection.QueryAsync<CotizadorProductoTarifa>("Cotizador_Obtener", parameters,
                                        commandType: System.Data.CommandType.StoredProcedure);
                return result;
            }
        }
        public async Task<IEnumerable<BEProductoBeneficio>> ProductoBeneficioCoti_Obtener(string str_pProductoID,  int int_pBeneficioIdioma = 1)
        {
            await using (var connection = new SqlConnection(_connectionString))
            {
                var parameters = new DynamicParameters();
                parameters.Add("@pPRODUCTO_Ids", str_pProductoID);                
                parameters.Add("@pIdioma", int_pBeneficioIdioma);
                var result = await connection.QueryAsync<BEProductoBeneficio>("ProductoBeneficioArr_Obtener", parameters,
                                        commandType: System.Data.CommandType.StoredProcedure);
                return result;
            }
        }
    }
}
