using BackAssistanceTravelers.Models.Agencia;
using BackAssistanceTravelers.Models.Error;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BackAssistanceTravelers.Repositories.Travel
{
	public interface IAgenciaRepository
	{
		Task<BEError> Agencia_Eliminar(int int_pAgenciaID, string strBasedeDatos = "O");
		Task<IEnumerable<BEAgencia>> Agencia_Obtener(int int_pAgenciaID, int int_pAgenciaPerfilId = 0, int int_pAgenciaPromotorId = 0, int int_pAgenciaActivo = -1, int int_pAgenciaPaisId = 0, string str_AgenciaNombre="", string str_AgenciaLogin = "", string str_AgenciaRuc = "");
		Task<IEnumerable<BEAgencia>> AgenciaVenta_Obtener(int int_pVentaId);
		Task<BEError> Agencia_Procesar(BEAgenciaParametro obj_pAgencia, string? strBasedeDatos = "O");
		Task<BEError> AgenciaPromotor_Validar(int int_pUsuarioID);
		Task<BEError> AgenciaUsuario_Eliminar(int int_pAgenciaUsuarioId);
		Task<IEnumerable<BEAgenciaUsuario>> AgenciaUsuario_Obtener(int int_pAgenciaID, int int_pAgenciaUsuarioId = 0, int int_pAgenciaUsuarioSupervisorId = 0, int int_pAgenciaUsuarioPerfilId = 0, int int_pAgenciaUsuarioActivo = -1, int int_pAgenciaUsuarioIncluirAgencia = 0);
		Task<BEError> AgenciaUsuario_Procesar(BEAgenciaUsuario obj_pAgenciaUsuario);

		Task<BEError> AgenciaProducto_Eliminar(int int_pAgenciaProductoId);
		Task<IEnumerable<BEAgenciaProducto>> AgenciaProducto_Obtener(int int_pAgenciaId, int int_pAgenciaProductoProductoId, int int_pAgenciaProductoPaisId, int int_pAgenciaProductoId);
		Task<BEError> AgenciaProducto_Procesar(BEAgenciaProducto oEntidad);

		Task<BEError> AgenciaFactura_Eliminar(int int_pAgenciaFacturaId);

		Task<IEnumerable<BEAgenciaFactura>> AgenciaFactura_Obtener(int int_pAgenciaFacturaId, int int_pAgenciaFacturaAgenciaId, int int_pAgenciaFacturaTipoDocumento, string str_pAgenciaFacturaSerie, int int_pAgenciaFacturaNumero, int int_pAgenciaFacturaEstado, DateTime dte_pAgenciaFacturaInicio = default, DateTime dte_pAgenciaFacturaFin = default);

		Task<BEError> AgenciaFactura_Procesar(BEAgenciaFactura oEntidad);

		Task<IEnumerable<BEAgenciaFactura>> Venta_ObtenerComision(int int_pCodLiquidacion);
	}
}
