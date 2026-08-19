using BackAssistanceTravelers.Models.Error;
using BackAssistanceTravelers.Models.Producto;
using BackAssistanceTravelers.Models.Promocion;
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
    public class PromocionRepository : Repository, IPromocionRepository
    {
        public PromocionRepository(string connectionString) : base(connectionString)
        {
        }
        public async Task<BEError> PromocionPais_Eliminar(int int_pPromocionPaisId, int int_pPromocionID, int int_pAgenciaID, int int_pProductoID)
        {
            await using (var connection = new SqlConnection(_connectionString))
            {
                var parameters = new DynamicParameters();
                parameters.Add("@pPROMOCION_Id", int_pPromocionID);
                parameters.Add("@pPROMOCION_PaisId", int_pPromocionPaisId);
                parameters.Add("@pPROMOCION_AgenciaId", int_pAgenciaID);
				parameters.Add("@pPROMOCION_ProductoId", int_pProductoID);
				var result = await connection.QueryFirstOrDefaultAsync<BEError>
                                        ("PromocionPais_Eliminar", parameters,
                                        commandType: System.Data.CommandType.StoredProcedure);
                return result!;
            }
        }
        public async Task<IEnumerable<BEPromocionPais>> PromocionPais_Obtener(int int_pPromocionPaisId, int int_pPromocionID, int int_pAgenciaID, int int_pProductoID, int int_pDias = 0)
        {
            await using (var connection = new SqlConnection(_connectionString))
            {
                var parameters = new DynamicParameters();
                parameters.Add("@pPROMOCION_Id", int_pPromocionID);
                parameters.Add("@pPROMOCION_PaisId", int_pPromocionPaisId);
                parameters.Add("@pPROMOCION_AgenciaId", int_pAgenciaID);
                parameters.Add("@pPROMOCION_productoId", int_pProductoID);
				parameters.Add("@pPROMOCION_dias", int_pDias);
				var result = await connection.QueryAsync<BEPromocionPais>("PromocionPais_Obtener", parameters,
                                        commandType: System.Data.CommandType.StoredProcedure);
                return result;
            }
        }
        public async Task<BEError> PromocionPais_Procesar(BEPromocionPais oEntidad)
        {
            await using (var connection = new SqlConnection(_connectionString))
            {
                var parameters = new DynamicParameters();
                parameters.Add("@pPROMOCION_Id", oEntidad.promocionPromocionID);
                parameters.Add("@pPROMOCION_PaisId", oEntidad.paisPromocionPaisID);
                parameters.Add("@pPROMOCION_AgenciaId", oEntidad.agenciaID);
                parameters.Add("@pPROMOCION_productoId", oEntidad.promocionProductoId);                
                parameters.Add("@pPROMOCION_DiasMin", oEntidad.promocionDiasMin);
                parameters.Add("@pPROMOCION_DiasMax", oEntidad.promocionDiasMax);
                parameters.Add("@pPROMOCION_Descuento", oEntidad.promocionDescuento);
                parameters.Add("@pPROMOCION_Pasajero", oEntidad.promocionPasajeroId); 
                var result = await connection.QueryFirstOrDefaultAsync<BEError>
                                        ("PromocionPais_Procesar", parameters,
                                        commandType: System.Data.CommandType.StoredProcedure);
                return result!;
            }
        }
        public async Task<BEError> Promocion_Eliminar(int int_pPromocionID)
        {
            await using (var connection = new SqlConnection(_connectionString))
            {
                var parameters = new DynamicParameters();
                parameters.Add("@pPROMOCION_Id", int_pPromocionID);
                var result = await connection.QueryFirstOrDefaultAsync<BEError>
                                        ("Promocion_Eliminar", parameters,
                                        commandType: System.Data.CommandType.StoredProcedure);
                return result!;
            }
        }
        public async Task<IEnumerable<BEPromocion>> Promocion_Obtener(int int_pPromocionID, int int_pPromocionActivo, int int_pPromocionPaisId = 0, int int_pCodigoAgencia = 0)
        {
            await using (var connection = new SqlConnection(_connectionString))
            {
                var parameters = new DynamicParameters();
                parameters.Add("@pPROMOCION_Id", int_pPromocionID);
                parameters.Add("@pPROMOCION_Activo", int_pPromocionActivo);
                parameters.Add("@pPROMOCION_PaisId", int_pPromocionPaisId);
                parameters.Add("@pPROMOCION_AgenciaId", int_pCodigoAgencia);
                var result = await connection.QueryAsync<BEPromocion>("Promocion_Obtener", parameters,
                                        commandType: System.Data.CommandType.StoredProcedure);
                return result;
            }
        }
        public async Task<BEError> Promocion_Procesar(BEPromocion obj_pPromocion)
        {
            await using (var connection = new SqlConnection(_connectionString))
            {
                var parameters = new DynamicParameters();
                parameters.Add("@pPROMOCION_Id", obj_pPromocion.promocionId);
                parameters.Add("@pPROMOCION_Nombre", obj_pPromocion.promocionNombre);
                parameters.Add("@pPROMOCION_Origen", obj_pPromocion.promocionTipo);
                parameters.Add("@pPROMOCION_Usuario", obj_pPromocion.promocionCreadoUsuarioId);
                parameters.Add("@pPROMOCION_Activo", obj_pPromocion.promocionActivo);
                var result = await connection.QueryFirstOrDefaultAsync<BEError>
                                        ("Promocion_Procesar", parameters,
                                        commandType: System.Data.CommandType.StoredProcedure);
                return result!;
            }
        }
    }
}
