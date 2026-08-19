using BackAssistanceTravelers.Models.Error;
using BackAssistanceTravelers.Models.Solicitud;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BackAssistanceTravelers.Repositories.Travel
{
	public interface ISolicitudRepository
	{
		Task<BEError> Solicitud_Anular(int int_pSolicitudId);
		Task<IEnumerable<BESolicitud>> Solicitud_Obtener(string? str_pOrigen, int int_pSolicitudUsuarioId = 0, DateTime dte_pSolicitudIngresoInicio = default, DateTime dte_pSolicitudIngresoFin = default, int int_pSolicitudId = 0, int int_pSolicitudVentaId = 0, int int_pSolicitudTipoId = 0, string? str_pSolicitudEstadoId = "", int int_pSolicitudAgenciaId = 0, int int_pSolicitudAgenciaUsuarioId = 0);
		Task<BEError> Solicitudes_Registrar(BESolicitud obj_pSolicitud);
		Task<BEError> Solicitud_Atender(int int_pSolicitudId, int int_pSolicitudTipoId, int int_pSolicitudUsuarioId);
		Task<BEError> Solicitud_Rechazar(int int_pSolicitudId, int int_pSolicitudUsuarioId);
		Task<BEError> SolicitudMasiva_Atender(string? int_pSolicitudIds, int int_pSolicitudUsuarioId);
		Task<BEError> SolicitudMasvia_Rechazar(string? int_pSolicitudIds, int int_pSolicitudUsuarioId);
		Task<BEError> SolicitudTipo_Eliminar(int int_pSolicitudTipoID);
		Task<IEnumerable<BESolicitudTipo>> SolicitudTipo_Obtener(int int_pSolicitudTipoID, int int_pSolicitudTipoActivo = -1, int int_pSolicitudPerfilId = 0);
		Task<BEError> SolicitudTipo_Procesar(BESolicitudTipoBody obj_pSolicitudTipo);

	}
}
