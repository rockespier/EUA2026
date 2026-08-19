using BackAssistanceTravelers.Models.Cobranza;
using BackAssistanceTravelers.Models.Error;
using BackAssistanceTravelers.Models.Perfil;
using BackAssistanceTravelers.Repositories.Travel;
using Dapper;
using Microsoft.Data.SqlClient;
using Microsoft.VisualBasic;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BackAssistanceTravelers.Repositories.Dapper.Travel
{
    public class PerfilRepository : Repository, IPerfilRepository
    {
        public PerfilRepository(string connectionString) : base(connectionString)
        {
        }

        public async Task<BEError> PerfilMenu_Eliminar(int int_pPerfilId)
        {
            await using (var connection = new SqlConnection(_connectionString))
            {
                var parameters = new DynamicParameters();
                parameters.Add("@pPERFIL_Id", int_pPerfilId);
                var result = await connection.QueryFirstOrDefaultAsync<BEError>
                                        ("PerfilMenu_Eliminar", parameters,
                                        commandType: System.Data.CommandType.StoredProcedure);
                return result!;
            }
        }

        public async Task<BEError> PerfilMenu_Procesar(int int_pRolId, string? str_pMenuIds)
        {
            string[] vtnMenuIds = Strings.Split(str_pMenuIds, ",");
            BEError Resultado = new BEError();
            for (int i = 0; i < vtnMenuIds.Length; i++)
            {
                await using (var connection = new SqlConnection(_connectionString))
                {
                    var parameters = new DynamicParameters();
                    parameters.Add("@pPERFIL_Id", int_pRolId);
                    parameters.Add("@pMENU_Id", int.Parse(vtnMenuIds[i].ToString()));
                    var result = await connection.QueryFirstOrDefaultAsync<BEError>
                                            ("PerfilMenu_Procesar", parameters,
                                            commandType: System.Data.CommandType.StoredProcedure);
                    if (result!.errorDescripcion == "")
                    {
                        Resultado.errorDescripcion = "";
                    }
                    else
                    {
                        Resultado.errorDescripcion = result.errorDescripcion;
                    }
                }
            }
            return Resultado;
        }

        public async Task<BEError> Perfil_Eliminar(int int_pPerfilID)
        {
            await using (var connection = new SqlConnection(_connectionString))
            {
                var parameters = new DynamicParameters();
                parameters.Add("@pPERFIL_Id", int_pPerfilID);
                var result = await connection.QueryFirstOrDefaultAsync<BEError>
                                        ("Perfil_Eliminar", parameters,
                                        commandType: System.Data.CommandType.StoredProcedure);
                return result!;
            }
        }

        public async Task<IEnumerable<BEPerfil>> Perfil_Obtener(int int_pPerfilID, string? str_pPerfilOrigen)
        {
            await using (var connection = new SqlConnection(_connectionString))
            {
                var parameters = new DynamicParameters();
                parameters.Add("@pPERFIL_Id", int_pPerfilID);
                parameters.Add("@pPERFIL_Origen", str_pPerfilOrigen);
                var result = await connection.QueryAsync<BEPerfil>("Perfil_Obtener", parameters,
                                        commandType: System.Data.CommandType.StoredProcedure);
                return result;
            }
        }

        public async Task<BEError> Perfil_Procesar(BEPerfilBody obj_pPerfil)
        {
            await using (var connection = new SqlConnection(_connectionString))
            {
                var parameters = new DynamicParameters();
                parameters.Add("@pPERFIL_Id", obj_pPerfil.perfilId);
                parameters.Add("@pPERFIL_Nombre", obj_pPerfil.perfilNombre);
                parameters.Add("@pPERFIL_Origen", obj_pPerfil.perfilOrigen);
                parameters.Add("@pPERFIL_Usuario", obj_pPerfil.perfilCreadoUsuarioId);
                parameters.Add("@pPERFIL_Activo", obj_pPerfil.perfilActivo);
                var result = await connection.QueryFirstOrDefaultAsync<BEError>
                                        ("Perfil_Procesar", parameters,
                                        commandType: System.Data.CommandType.StoredProcedure);
                return result!;
            }
        }
    }
}
