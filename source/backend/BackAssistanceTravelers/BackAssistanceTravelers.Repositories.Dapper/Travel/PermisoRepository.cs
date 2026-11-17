using BackAssistanceTravelers.Models.Error;
using BackAssistanceTravelers.Models.General;
using BackAssistanceTravelers.Models.Permisos;
using BackAssistanceTravelers.Repositories.Travel;
using Dapper;
using Microsoft.Data.SqlClient;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BackAssistanceTravelers.Repositories.Dapper.Travel {
	public class PermisoRepository : Repository, IPermisoRepository {
		public PermisoRepository(string connectionString) : base(connectionString) {
		}
		private async Task<BEError> PermisoArbol_Eliminar(int pPerfilId) {
			await using (var connection = new SqlConnection(_connectionString)) {
				var parameters = new DynamicParameters();
				parameters.Add("@pPERFIL_Id", pPerfilId);
				var result = await connection.QueryFirstOrDefaultAsync<BEError>
										("PerfilMenu_Eliminar", parameters,
										commandType: System.Data.CommandType.StoredProcedure);
				return result!;
			}
		}
		public async Task<IEnumerable<BEMenuPermiso>> PermisoArbol_ObtenerPermisos(int pPerfilId) {
			await using (var connection = new SqlConnection(_connectionString)) {
				var parameters = new DynamicParameters();
				parameters.Add("@pPERFIL_Id", pPerfilId);
				var result = await connection.QueryAsync<BEMenuPermiso>
										("Menu_ObtenerPermisos", parameters,
										commandType: System.Data.CommandType.StoredProcedure);
				return result;
			}
		}
		public async Task<BEResultado> PermisoArbol_Procesar(int pPerfilId, string pMenuIds) {
			// PerfilMenu_Eliminar devuelve '' cuando el perfil no tenía permisos: no es un error
			await PermisoArbol_Eliminar(pPerfilId);
			string[] vtnMenuIds = (pMenuIds ?? "").Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries);
			for (int i = 0; i < vtnMenuIds.Length; i++) {
				await using (var connection = new SqlConnection(_connectionString)) {
					var parameters = new DynamicParameters();
					parameters.Add("@pPERFIL_Id", pPerfilId);
					parameters.Add("@pMENU_Id", int.Parse(vtnMenuIds[i]));
					var result = await connection.QueryFirstOrDefaultAsync<BEError>
											("PerfilMenu_Procesar", parameters,
											commandType: System.Data.CommandType.StoredProcedure);
					if (result == null || result.errorDescripcion != "ok") {
						return new BEResultado { descripcion = "" };
					}
				}
			}
			return new BEResultado { descripcion = "ok" };
		}
	}
}
