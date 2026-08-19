using BackAssistanceTravelers.Models.Cobranza;
using BackAssistanceTravelers.Models.Grafico;
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
    public class GraficoRepository : Repository, IGraficoRepository
    {
        public GraficoRepository(string connectionString) : base(connectionString)
        {
        }

        public async Task<IEnumerable<BEGrafico>> Grafico_Pie(int int_pOpcion, DateTime dte_pFechaInicial, DateTime dte_pFechaFinal, int int_pPaisId = 0)
        {
            await using (var connection = new SqlConnection(_connectionString))
            {
                Helpers GeneralAyuda = new Helpers();
                string str_pVentaIngresoInicio = "";
                string str_pVentaIngresoFin = "";
                if (dte_pFechaInicial != DateTime.Parse("0001-01-01"))
                    str_pVentaIngresoInicio = GeneralAyuda.TraerFechaFormatoServidorBD(dte_pFechaInicial);
                if (dte_pFechaFinal != DateTime.Parse("0001-01-01"))
                    str_pVentaIngresoFin = GeneralAyuda.TraerFechaFormatoServidorBD(dte_pFechaFinal);
                var parameters = new DynamicParameters();
                parameters.Add("@pGRAFICO_Opcion", int_pOpcion);
                parameters.Add("@pGRAFICO_FechaInicial", str_pVentaIngresoInicio);
                parameters.Add("@pGRAFICO_FechaFinal", str_pVentaIngresoFin);
                parameters.Add("@pGRAFICO_PaisId", int_pPaisId);
                var result = await connection.QueryAsync<BEGrafico>("Grafico_Obtener", parameters,
                                        commandType: System.Data.CommandType.StoredProcedure);
                return result;
            }
        }
    }
}
