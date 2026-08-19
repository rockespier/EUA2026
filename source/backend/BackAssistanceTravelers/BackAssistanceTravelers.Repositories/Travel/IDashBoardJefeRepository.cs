using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BackAssistanceTravelers.Repositories.Travel
{
    public interface IDashBoardJefeRepository
    {
		Task<DataTable> DashBoard_GraficoObtener(int pOpcion, int pPeriodoId, int pUsuarioId, int pPaisId, string pOrigen, int pPromotorId, DateTime pInicio = default, DateTime pFin = default);

	}
}
