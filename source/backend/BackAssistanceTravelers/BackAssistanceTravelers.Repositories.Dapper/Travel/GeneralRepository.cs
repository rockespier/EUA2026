using BackAssistanceTravelers.Models.Cobranza;
using BackAssistanceTravelers.Models.Error;
using BackAssistanceTravelers.Models.General;
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
    public class GeneralRepository : Repository, IGeneralRepository
    {
        public GeneralRepository(string connectionString) : base(connectionString)
        {
        }
        public async Task<BEError> Correlativo_Generar(string? str_pColumna)
        {
            await using (var connection = new SqlConnection(_connectionString))
            {
                var parameters = new DynamicParameters();
                parameters.Add("@pCORRELATIVO_Columna", str_pColumna);
                var result = await connection.QueryFirstOrDefaultAsync<BEError>
                                        ("Correlativo_Generar", parameters,
                                        commandType: System.Data.CommandType.StoredProcedure);
                return result!;
            }
        }
        public async Task<IEnumerable<BEImpresion>> PrecioImpresion_Obtener(int int_pVentaId)
        {
            await using (var connection = new SqlConnection(_connectionString))
            {
                var parameters = new DynamicParameters();
                parameters.Add("@pVENTA_Id", int_pVentaId);
				var result = await connection.QueryAsync<BEImpresion> 
                                        ("PrecioImpresion_Obtener", parameters,
                                        commandType: System.Data.CommandType.StoredProcedure);
                return result!;
            }
        }
        public async Task<BEError> Ubigeo_Eliminar(int int_pUbigeoID)
        {
            await using (var connection = new SqlConnection(_connectionString))
            {
                var parameters = new DynamicParameters();
                parameters.Add("@pUbigeo_Id", int_pUbigeoID);
                var result = await connection.QueryFirstOrDefaultAsync<BEError>("Ubigeo_Eliminar", parameters,
                                        commandType: System.Data.CommandType.StoredProcedure);
                return result!;
            }
        }
        public async Task<IEnumerable<BEUbigeo>> Ubigeo_Obtener(int int_pUbigeoId, int int_pUbigeoPaisId, int int_pUbigeoActivo)
        {
            await using (var connection = new SqlConnection(_connectionString))
            {
                var parameters = new DynamicParameters();
                parameters.Add("@pUBIGEO_Id", int_pUbigeoId);
                parameters.Add("@pUBIGEO_PaisId", int_pUbigeoPaisId);
                parameters.Add("@pUBIGEO_Activo", int_pUbigeoActivo);
                var result = await connection.QueryAsync<BEUbigeo>("Ubigeo_Obtener", parameters,
                                        commandType: System.Data.CommandType.StoredProcedure);
                return result;
            }
        }
        public async Task<IEnumerable<BEUbigeo>> Ubigeo_Listar(int int_pUbigeoId, int int_pUbigeoPaisId, int int_pUbigeoActivo)
        {
            await using (var connection = new SqlConnection(_connectionString))
            {
                var parameters = new DynamicParameters();
                parameters.Add("@pUBIGEO_Id", int_pUbigeoId);
                parameters.Add("@pUBIGEO_PaisId", int_pUbigeoPaisId);
                parameters.Add("@pUBIGEO_Activo", int_pUbigeoActivo);
                var result = await connection.QueryAsync<BEUbigeo>("Ubigeo_Listar", parameters,
                                        commandType: System.Data.CommandType.StoredProcedure);
                return result;
            }
        }
        public async Task<BEError> Ubigeo_Procesar(BEUbigeoBody obj_pUbigeo)
        {
            await using (var connection = new SqlConnection(_connectionString))
            {
                var parameters = new DynamicParameters();
                parameters.Add("@pUbigeoId", obj_pUbigeo.ubigeoId);
                parameters.Add("@pUbigeoDistrito", obj_pUbigeo.ubigeoNombre);
                parameters.Add("@pUbigeoProvinciaId", obj_pUbigeo.ubigeoProvinciaId);
                parameters.Add("@pUbigeoDepartamentoId", obj_pUbigeo.ubigeoDepartamentoId);
                parameters.Add("@pUbigeoActivo", obj_pUbigeo.ubigeoActivo);
                parameters.Add("@pUbigeoPaisId", obj_pUbigeo.ubigeoPaisId);
                var result = await connection.QueryFirstOrDefaultAsync<BEError>("Ubigeo_Procesar", parameters,
                                        commandType: System.Data.CommandType.StoredProcedure);
                return result!;
            }
        }
        public async Task<IEnumerable<BEValoresTipo>> ValoresTipoId_Obtener(string? str_pValorTipoNombreCampo, string? str_pvalorTipoId)
        {
            await using (var connection = new SqlConnection(_connectionString))
            {

                var parameters = new DynamicParameters();
                parameters.Add("@pVALORTIPO_ColumnaTabla", str_pValorTipoNombreCampo);
                parameters.Add("@pVALORTIPO_valorTipoId", str_pvalorTipoId);
                var result = await connection.QueryAsync<BEValoresTipo>("ValoresTipoId_Obtener", parameters,
                                        commandType: System.Data.CommandType.StoredProcedure);
                return result;
            }
        }
        public async Task<BEError> ValoresTipo_Eliminar(string? str_pValorID, string? str_pValorCampo)
        {
            await using (var connection = new SqlConnection(_connectionString))
            {
                var parameters = new DynamicParameters();
                parameters.Add("@pVALORTIPO_valorTipoId", str_pValorID);
                parameters.Add("@pUbigeoDistrito", str_pValorCampo);
                
                var result = await connection.QueryFirstOrDefaultAsync<BEError>("ValoresTipo_Eliminar", parameters,
                                        commandType: System.Data.CommandType.StoredProcedure);
                return result!;
            }
        }
        public async Task<IEnumerable<BEValoresTipo>> ValoresTipo_Obtener(string? str_pValorTipoNombreCampo)
        {
            await using (var connection = new SqlConnection(_connectionString))
            {
                var parameters = new DynamicParameters();
                parameters.Add("@pVALORTIPO_ColumnaTabla", str_pValorTipoNombreCampo);
                var result = await connection.QueryAsync<BEValoresTipo>("ValoresTipo_Obtener", parameters,
                                        commandType: System.Data.CommandType.StoredProcedure);
                return result;
            }
        }
        public async Task<IEnumerable<BEValoresTipo>> ValoresTipo_ObtenerTipos()
        {
            await using (var connection = new SqlConnection(_connectionString))
            {

                var parameters = new DynamicParameters();                
                var result = await connection.QueryAsync<BEValoresTipo>("ValoresTipo_ObtenerTipos", parameters,
                                        commandType: System.Data.CommandType.StoredProcedure);
                return result;
            }
        }
        public async Task<BEError> ValoresTipo_Procesar(BEValoresTipoParametro obj_pValores)
        {
            await using (var connection = new SqlConnection(_connectionString))
            {
                var parameters = new DynamicParameters();
                parameters.Add("@pVALORTIPO_ColumnaTabla", obj_pValores.valorTipoColumnaTabla);
                parameters.Add("@pVALORTIPO_TipoId", obj_pValores.valorTipoId);
                parameters.Add("@pVALORTIPO_TipoNombre", obj_pValores.valorTipoNombre);
                
                var result = await connection.QueryFirstOrDefaultAsync<BEError>("ValoresTipo_Procesar", parameters,
                                        commandType: System.Data.CommandType.StoredProcedure);
                return result!;
            }
        }
		public async Task<IEnumerable<BECorrelativos>> CorrelativoLiquidacion_Obtener() {
			await using (var connection = new SqlConnection(_connectionString)) {
				var parameters = new DynamicParameters();
				var result = await connection.QueryAsync<BECorrelativos>
										("GenerarCodigoLiquidacion_Procesar", parameters, commandType: System.Data.CommandType.StoredProcedure);
				return result!;
			}
		}

	}
}
