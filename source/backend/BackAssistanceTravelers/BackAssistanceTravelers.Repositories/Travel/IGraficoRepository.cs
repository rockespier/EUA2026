using BackAssistanceTravelers.Models.Grafico;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BackAssistanceTravelers.Repositories.Travel
{
	public interface IGraficoRepository
	{
		Task<IEnumerable<BEGrafico>> Grafico_Pie(int int_pOpcion, DateTime dte_pFechaInicial, DateTime dte_pFechaFinal, int int_pPaisId = 0);
	}
}
