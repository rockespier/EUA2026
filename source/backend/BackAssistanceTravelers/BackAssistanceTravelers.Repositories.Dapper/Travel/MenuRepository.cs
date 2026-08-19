using BackAssistanceTravelers.Models.Permisos;
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
    public class MenuRepository : Repository, IMenuRepository
    {
        public MenuRepository(string connectionString) : base(connectionString)
        {
        }

        public async Task<IEnumerable<BEMenu>> Menu_Obtener(int int_pPerfilId)
        {
            await using (var connection = new SqlConnection(_connectionString))
            {
                var parameters = new DynamicParameters();
                parameters.Add("@pPERFIL_Id", int_pPerfilId);
                var result = await connection.QueryAsync<BEMenu>
                                        ("Menu_Obtener", parameters,
                                        commandType: System.Data.CommandType.StoredProcedure);
                return result;
            }
        }

        public async Task<IEnumerable<BEMenuPermiso>> Menu_ObtenerPermisos(int int_pPerfilId, string? int_pPerfilTipo)
        {
            await using (var connection = new SqlConnection(_connectionString))
            {
                var parameters = new DynamicParameters();
                parameters.Add("@pPERFIL_Id", int_pPerfilId);
                                
                var result = await connection.QueryAsync<BEMenuPermiso>
                                        ("Menu_ObtenerPermisos", parameters,
                                        commandType: System.Data.CommandType.StoredProcedure);
                return result;
            }
        }

        public async Task<IEnumerable<BEMenu>> Menu_ObtenerPermisosBotones(int int_pPerfilId, int int_pMenuPadreId)
        {
            await using (var connection = new SqlConnection(_connectionString))
            {
                var parameters = new DynamicParameters();
                parameters.Add("@pPERFIL_Id", int_pPerfilId);
                parameters.Add("@pMENU_PadreId", int_pMenuPadreId);
                var result = await connection.QueryAsync<BEMenu>
                                        ("Menu_ObtenerPermisosBotones", parameters,
                                        commandType: System.Data.CommandType.StoredProcedure);
                return result;
            }
        }
		public async Task<IEnumerable<BEMenuDashboard>> MenuDashboard_Obtener(int pPerfilId, int pMenuPadreId) {
			await using (var connection = new SqlConnection(_connectionString)) {
				var parameters = new DynamicParameters();
				parameters.Add("@pPERFIL_Id", pPerfilId);
				parameters.Add("@pMENUPADRE_Id", pMenuPadreId);
				var result = await connection.QueryAsync<BEMenuDashboard>
										("Menu_ObtenerDashboard", parameters,
										commandType: System.Data.CommandType.StoredProcedure);
				return result;
			}
		}
	}
}
