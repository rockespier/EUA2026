using BackAssistanceTravelers.Models.Valores;
using BackAssistanceTravelers.Models.General;
using BackAssistanceTravelers.Repositories.Travel;
using Dapper;
using Microsoft.Data.SqlClient;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BackAssistanceTravelers.Repositories.Dapper.Travel {
	public class ValorRepository : Repository, IValorRepository {
		public ValorRepository(string connectionString) : base(connectionString) {
		}
		public async Task<BEResultado> Valores_Eliminar(string pValorID, string pValorCampo) {
			await using (var connection = new SqlConnection(_connectionString)) {
				var parameters = new DynamicParameters();
				parameters.Add("@pVALOR_CampoTabla", pValorCampo);
				parameters.Add("@pVALOR_valorId", pValorID);
				var result = await connection.QueryFirstOrDefaultAsync<BEResultado>
										("Valores_Eliminar", parameters,
										commandType: System.Data.CommandType.StoredProcedure);
				return result!;
			}
		}
		public async Task<IEnumerable<BEValor>> Valores_Obtener(string pValorNombreCampo, string pValorActivo, string pValorId) {
			await using (var connection = new SqlConnection(_connectionString)) {
				var parameters = new DynamicParameters();
				parameters.Add("@pVALOR_CampoTabla", pValorNombreCampo);
				parameters.Add("@pVALOR_Acitvo", pValorActivo);
				parameters.Add("@pVALOR_id", pValorId);
				var result = await connection.QueryAsync<BEValor>
										("Valores_Obtener", parameters,
										commandType: System.Data.CommandType.StoredProcedure);
				return result;
			}
		}

		public async Task<IEnumerable<BEValor>> Valores_ObtenerAsesores(int idperfil, int idempresa) {
			await using (var connection = new SqlConnection(_connectionString)) {
				var parameters = new DynamicParameters();
				parameters.Add("@pIdPerfil", idperfil);
				parameters.Add("@pUsuarioEmpresaId", idempresa);
				var result = await connection.QueryAsync<BEValor>
										("UsuarioAsesor_Listar", parameters,
										commandType: System.Data.CommandType.StoredProcedure);
				return result;
			}
		}

		public async Task<IEnumerable<BETipo>> Valores_ObtenerTipos() {
			await using (var connection = new SqlConnection(_connectionString)) {
				var result = await connection.QueryAsync<BETipo>
										("ValorTipos_Obtener", null,
										commandType: System.Data.CommandType.StoredProcedure);
				return result;
			}
		}
		public async Task<BEResultado> Valores_Procesar(BEValorBody pEntValor) {
			await using (var connection = new SqlConnection(_connectionString)) {
				var parameters = new DynamicParameters();
				parameters.Add("@pVALOR_CampoTabla", pEntValor.valorCampoTabla);
				parameters.Add("@pVALOR_valorId", pEntValor.valorId);
				parameters.Add("@pVALOR_ValorNombre", pEntValor.valorNombre);
				parameters.Add("@pValorAux", pEntValor.valorAux);
				parameters.Add("@pValorAux2", pEntValor.valorAux2);
				parameters.Add("@pValorAux3", pEntValor.valorAux3);
				parameters.Add("@pValorUsuarioId", pEntValor.valorUsuarioId);
				var result = await connection.QueryFirstOrDefaultAsync<BEResultado>
										("Valores_Procesar", parameters,
										commandType: System.Data.CommandType.StoredProcedure);
				return result!;
			}
		}

		
		}
	}
