using BackAssistanceTravelers.Models.Error;
using BackAssistanceTravelers.Models.General;
using BackAssistanceTravelers.Models.Producto;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BackAssistanceTravelers.Repositories.Travel
{
	public interface IGeneralRepository
	{
		Task<BEError> Correlativo_Generar(string? str_pColumna);
		Task<IEnumerable<BEUbigeo>> Ubigeo_Obtener(int int_pUbigeoId, int int_pUbigeoPaisId, int int_pUbigeoActivo);
        Task<IEnumerable<BEUbigeo>> Ubigeo_Listar(int int_pUbigeoId, int int_pUbigeoPaisId, int int_pUbigeoActivo);
        Task<BEError> Ubigeo_Eliminar(int int_pPaisID);
		Task<BEError> Ubigeo_Procesar(BEUbigeoBody obj_pUbigeo);
		Task<IEnumerable<BEValoresTipo>> ValoresTipo_Obtener(string? str_pValorTipoNombreCampo);
		Task<IEnumerable<BEValoresTipo>> ValoresTipoId_Obtener(string? str_pValorTipoNombreCampo, string? str_pvalorTipoId);
		Task<BEError> ValoresTipo_Eliminar(string? str_pValorID, string? str_pValorCampo);
		Task<BEError> ValoresTipo_Procesar(BEValoresTipoParametro obj_pValores);
		Task<IEnumerable<BEValoresTipo>> ValoresTipo_ObtenerTipos();
		Task<IEnumerable<BEImpresion>> PrecioImpresion_Obtener(int int_pVentaId);

		Task<IEnumerable<BECorrelativos>> CorrelativoLiquidacion_Obtener();

	}
}
