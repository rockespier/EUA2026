using BackAssistanceTravelers.Models.Cobranza;
using BackAssistanceTravelers.Models.Error;
using BackAssistanceTravelers.Models.Pais;
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
    public class PaisRepository : Repository, IPaisRepository
    {
        public PaisRepository(string connectionString) : base(connectionString)
        {
        }
        public async Task<BEError> PaisImagenPromocion_Eliminar(int int_pPaisImagenID)
        {
            await using (var connection = new SqlConnection(_connectionString))
            {
                var parameters = new DynamicParameters();
                parameters.Add("@pPAISImagen_Id", int_pPaisImagenID);
                var result = await connection.QueryFirstOrDefaultAsync<BEError>
                                        ("PaisImagenPromocion_Eliminar", parameters,
                                        commandType: System.Data.CommandType.StoredProcedure);
                return result!;
            }
        }
        public async Task<IEnumerable<BEPaisImagenPromocion>> PaisImagenPromocion_Obtener(int int_pPaisImagenID, int int_pPaisID, int int_PaisActivo)
        {
            await using (var connection = new SqlConnection(_connectionString))
            {
                var parameters = new DynamicParameters();
                parameters.Add("@pPAISImagen_Id", int_pPaisImagenID);
                parameters.Add("@pPAIS_Id", int_pPaisID);
                parameters.Add("@pPAIS_Activo", int_PaisActivo);
                var result = await connection.QueryAsync<BEPaisImagenPromocion>("PaisImagenPromocion_Obtener", parameters,
                                        commandType: System.Data.CommandType.StoredProcedure);
                return result;
            }
        }
        public async Task<BEError> PaisImagenPromocion_Procesar(BEPaisImagenPromocion obj_pPais)
        {
            await using (var connection = new SqlConnection(_connectionString))
            {
                var parameters = new DynamicParameters();
                parameters.Add("@pPAISImagen_Id", obj_pPais.paisImagenId);
                parameters.Add("@pPAIS_Id", obj_pPais.paisImagenPaisId);
                parameters.Add("@pPAIS_Usuario", obj_pPais.paisImagenCreadoUsuarioId);
                parameters.Add("@pPAIS_Activo", obj_pPais.paisImagenActivo);
                parameters.Add("@pPAIS_Foto", obj_pPais.paisImagenUrl);
                var result = await connection.QueryFirstOrDefaultAsync<BEError>
                                        ("PaisImagenPromocion_Procesar", parameters,
                                        commandType: System.Data.CommandType.StoredProcedure);
                return result!;
            }
        }
        public async Task<BEError> Pais_Eliminar(int int_pPaisID)
        {
            await using (var connection = new SqlConnection(_connectionString))
            {
                var parameters = new DynamicParameters();
                parameters.Add("@pPAIS_Id", int_pPaisID);
                var result = await connection.QueryFirstOrDefaultAsync<BEError>
                                        ("Pais_Eliminar", parameters,
                                        commandType: System.Data.CommandType.StoredProcedure);
                return result!;
            }
        }
        public async Task<IEnumerable<BEPais>> Pais_Obtener(int int_pPaisID, int int_PaisActivo = -1)
        {
            await using (var connection = new SqlConnection(_connectionString))
            {
                var parameters = new DynamicParameters();
                parameters.Add("@pPAIS_Id", int_pPaisID);
                parameters.Add("@pPAIS_Activo", int_PaisActivo);
                var result = await connection.QueryAsync<BEPais>("Pais_Obtener", parameters,
                                        commandType: System.Data.CommandType.StoredProcedure);
                return result;
            }
        }
        public async Task<BEError> Pais_Procesar(BEPaisBody obj_pPais)
        {
            await using (var connection = new SqlConnection(_connectionString))
            {
                var parameters = new DynamicParameters();
                parameters.Add("@pPAIS_Id", obj_pPais.paisId);
                parameters.Add("@pPAIS_Codigo", obj_pPais.paisCodigo);
                parameters.Add("@pPAIS_Nombre", obj_pPais.paisNombre);
                parameters.Add("@pPAIS_Impuesto", obj_pPais.paisImpuesto);
				parameters.Add("@pPAIS_Impuesto_Venta", obj_pPais.paisImpuestoVenta);
				parameters.Add("@pPAIS_Usuario", obj_pPais.paisCreadoUsuarioId);
                parameters.Add("@pPAIS_Activo", obj_pPais.paisActivo);
                parameters.Add("@pPAIS_Correo", obj_pPais.paisCorreo);
                parameters.Add("@pPAIS_TotalPago", obj_pPais.paisTotalPago);
                parameters.Add("@pPAIS_DatosEua", obj_pPais.paisDatosEua);
                parameters.Add("@pPAIS_Foto", obj_pPais.paisFoto);
                parameters.Add("@pPAIS_PromocionId", obj_pPais.paisPromocionId);
                parameters.Add("@pPAIS_CuponDescuento", obj_pPais.paisCuponDescuento);
                parameters.Add("@pPAIS_CuponVigenciaId", obj_pPais.paisCuponVigenciaId);
                parameters.Add("@pPAIS_DocumentoFormato", obj_pPais.paisDocumentoFormato);
                parameters.Add("@pPAIS_PromotorDefault", obj_pPais.paisPromotorDefault);
                var result = await connection.QueryFirstOrDefaultAsync<BEError>
                                        ("Pais_Procesar", parameters,
                                        commandType: System.Data.CommandType.StoredProcedure);
                return result!;
            }
        }
		public async Task<IEnumerable<BEPais>> Pais_OrigenDestinoObtener(int int_pOrigenID)
		{
			await using (var connection = new SqlConnection(_connectionString))
			{
				var parameters = new DynamicParameters();
				parameters.Add("@pORIGEN", int_pOrigenID);				
				var result = await connection.QueryAsync<BEPais>("Cotizador_OrigenDestino_Obtener", parameters,
										commandType: System.Data.CommandType.StoredProcedure);
				return result;
			}
		}
	}
}
