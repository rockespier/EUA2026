using BackAssistanceTravelers.Repositories.Travel;
using Microsoft.Data.SqlClient;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BackAssistanceTravelers.Repositories.Dapper.Travel
{
	public class DashBoardJefeRepository : Repository, IDashBoardJefeRepository {
		public DashBoardJefeRepository(string connectionString) : base(connectionString) {
		}
		public async Task<DataTable> DashBoard_GraficoObtener(int pOpcion,int pPeriodoId, int pUsuarioId, int pPaisId, string pOrigen, int pPromotorId, DateTime pInicio = default, DateTime pFin = default) {
			Helpers GeneralAyuda = new Helpers();
			string str_vFechaFechaVigenciaInicio = "";
			string str_vFechaFechaVigenciaFin = "";
			if (pInicio != DateTime.Parse("1900-01-01"))
				str_vFechaFechaVigenciaInicio = GeneralAyuda.TraerFechaFormatoServidorBD(pInicio);
			if (pFin != DateTime.Parse("1900-01-01"))
				str_vFechaFechaVigenciaFin = GeneralAyuda.TraerFechaFormatoServidorBD(pFin);

			DataTable dataResultado = new DataTable();
			await using (var connection = new SqlConnection(_connectionString)) {
				using (SqlCommand cmd = new SqlCommand("Grafico_ObtenerNuevo", connection)) {
					cmd.CommandType = CommandType.StoredProcedure;
					cmd.Parameters.Add("@pGRAFICO_Opcion", SqlDbType.Int).Value = pOpcion;
					cmd.Parameters.Add("@pGRAFICO_PeriodoiId", SqlDbType.Int).Value = pPeriodoId;
					cmd.Parameters.Add("@pGRAFICO_UsuarioId", SqlDbType.Int).Value = pUsuarioId;
					cmd.Parameters.Add("@pGRAFICO_PaisId", SqlDbType.Int).Value = pPaisId;
					cmd.Parameters.Add("@pOrigenId", SqlDbType.Char).Value = pOrigen;
					cmd.Parameters.Add("@pPromotorId", SqlDbType.Int).Value = pPromotorId;
					cmd.Parameters.Add("@pFechaInicio", SqlDbType.VarChar).Value = str_vFechaFechaVigenciaInicio;
					cmd.Parameters.Add("@pFechaFin", SqlDbType.VarChar).Value = str_vFechaFechaVigenciaFin;
					connection.Open();
					SqlDataAdapter da = new SqlDataAdapter(cmd);
					da.Fill(dataResultado);
					connection.Close();
					da.Dispose();
				}
				return dataResultado;
			}
		}

		
	}
}
