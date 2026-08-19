using BackAssistanceTravelers.Models.Error;
using BackAssistanceTravelers.Models.General;
using BackAssistanceTravelers.Models.Usuario;
using BackAssistanceTravelers.Repositories.Travel;
using Dapper;
using Microsoft.Data.SqlClient;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Numerics;
using System.Text;
using System.Threading.Tasks;

namespace BackAssistanceTravelers.Repositories.Dapper.Travel
{
    public class UsuarioRepository : Repository, IUsuarioRepository
    {
        public UsuarioRepository(string connectionString) : base(connectionString)
        {
        }
        public async Task<IEnumerable<BEUsuarioRelacion>> GraficoPromotor_Obtener(int int_Caso, DateTime str_pFechaInicial, DateTime str_pFechaFinal, int int_UsuarioPromotorID)
        {
            await using (var connection = new SqlConnection(_connectionString))
            {
                Helpers GeneralAyuda = new Helpers();
                string str_vFechaValidoDesde = "";
                string str_vFechaValidoHasta = "";
                if (str_pFechaInicial != DateTime.Parse("0001-01-01"))
                    str_vFechaValidoDesde = GeneralAyuda.TraerFechaFormatoServidorBD(str_pFechaInicial);
                if (str_pFechaFinal != DateTime.Parse("0001-01-01"))
                    str_vFechaValidoHasta = GeneralAyuda.TraerFechaFormatoServidorBD(str_pFechaFinal);
                var parameters = new DynamicParameters();
                parameters.Add("@pGRAFICO_Opcion", int_Caso);
                parameters.Add("@pGRAFICO_FechaInicial", str_vFechaValidoDesde);
                parameters.Add("@pGRAFICO_FechaFinal", str_vFechaValidoHasta);
                parameters.Add("@pGRAFICO_ID", int_UsuarioPromotorID);
                var result = await connection.QueryAsync<BEUsuarioRelacion>
                                        ("GraficoReporte_Obtener", parameters,
                                        commandType: System.Data.CommandType.StoredProcedure);
                return result;
            }
        }

        public async Task<IEnumerable<BEJerarquiaPromotor>> PromotorJerarquia_Obtener(int int_pUusarioID)
        {
            await using (var connection = new SqlConnection(_connectionString))
            {
                var parameters = new DynamicParameters();
                parameters.Add("@pPromotor_UsuarioIDLogin", int_pUusarioID);
                var result = await connection.QueryAsync<BEJerarquiaPromotor>
                                        ("Promotor_Obtener", parameters,
                                        commandType: System.Data.CommandType.StoredProcedure);
                return result;
            }
        }

        public async Task<IEnumerable<BEUsuario>> PromotorPais_Obtener(int int_pUusarioID, int int_pPaisId)
        {
            await using (var connection = new SqlConnection(_connectionString))
            {
                var parameters = new DynamicParameters();
                parameters.Add("@pPromotor_UsuarioIDLogin", int_pUusarioID);
                parameters.Add("@pPaisUsuario", int_pPaisId);
                var result = await connection.QueryAsync<BEUsuario>
                                        ("PromotorPais_Obtener", parameters,
                                        commandType: System.Data.CommandType.StoredProcedure);
                return result;
            }
        }

        public async Task<IEnumerable<BEUsuarioRelacion>> Promotor_Obtener(int int_pCaso, int int_pPaisId, int int_PadreID, int int_HijoID)
        {
            await using (var connection = new SqlConnection(_connectionString))
            {
                var parameters = new DynamicParameters();
                parameters.Add("@pcaso", int_pCaso);
                parameters.Add("@pUSUARIO_PaisId", int_pPaisId);
                parameters.Add("@pUSUARIO_PadreId", int_PadreID);
                parameters.Add("@pUSUARIO_HijoId", int_HijoID);
                var result = await connection.QueryAsync<BEUsuarioRelacion>
                                        ("Usuario_RelacionObtenerSupPro", parameters,
                                        commandType: System.Data.CommandType.StoredProcedure);
                return result;
            }
        }

        public async Task<BEError> SuperVisorPromotor_Eliminar(int int_pSuper, int int_pPromo)
        {
            await using (var connection = new SqlConnection(_connectionString))
            {
                var parameters = new DynamicParameters();
                parameters.Add("@pUSUARIO_PadreId", int_pSuper);
                parameters.Add("@pUSUARIO_PadrePerfilId", 4);
                parameters.Add("@pUSUARIO_HijoId", int_pPromo);
                parameters.Add("@pUSUARIO_HijoPerfilId", 6);
                var result = await connection.QueryFirstOrDefaultAsync<BEError>("Usuario_RelacionEliminar", parameters,
                                        commandType: System.Data.CommandType.StoredProcedure);
                return result!;
            }
        }
        public async Task<IEnumerable<BEUsuarioRelacion>> SuperVisorPromotor_Obtener(int int_pPaisId, int int_PadreID, int int_HijoID)
        {
            await using (var connection = new SqlConnection(_connectionString))
            {
                var parameters = new DynamicParameters();
                parameters.Add("@pUSUARIO_PaisId", int_pPaisId);
                parameters.Add("@pUSUARIO_PadreId", int_PadreID);
                parameters.Add("@pUSUARIO_PadrePerfilId", 0);
                parameters.Add("@pUSUARIO_HijoId", int_HijoID);
                parameters.Add("@pUSUARIO_HijoPerfilId", 0);
                var result = await connection.QueryAsync<BEUsuarioRelacion>
                                        ("Usuario_RelacionObtener", parameters,
                                        commandType: System.Data.CommandType.StoredProcedure);
                return result;
            }
        }
        public async Task<BEError> SuperVisorPromotor_Procesar(BEUsuarioRelacion oEntidad, int int_pSuper, int int_pPromo)
        {
            await using (var connection = new SqlConnection(_connectionString))
            {
                var parameters = new DynamicParameters();
                parameters.Add("@pUSUARIO_PadreId", int_pSuper);
                parameters.Add("@pUSUARIO_PadrePerfilId", oEntidad.usuarioRelacionPadrePerfilId);
                parameters.Add("@pUSUARIO_HijoId", int_pPromo);
                parameters.Add("@pUSUARIO_HijoPerfilId", oEntidad.usuarioRelacionHijoPerfilId);
                parameters.Add("@pUSUARIO_PadreId_n", oEntidad.usuarioRelacionPadreId);
                parameters.Add("@pUSUARIO_HijoId_n", oEntidad.usuarioRelacionHijoId);
                var result = await connection.QueryFirstOrDefaultAsync<BEError>("Usuario_RelacionProcesar", parameters,
                                        commandType: System.Data.CommandType.StoredProcedure);
                return result!;
            }
        }
        public async Task<IEnumerable<BEUsuarioRelacion>> SuperVisor_Obtener(int int_pCaso, int int_pPaisId, int int_PadreID, int int_HijoID)
        {
            await using (var connection = new SqlConnection(_connectionString))
            {
                var parameters = new DynamicParameters();
                parameters.Add("@pcaso", int_pCaso);
                parameters.Add("@pUSUARIO_PaisId", int_pPaisId);
                parameters.Add("@pUSUARIO_PadreId", int_PadreID);
                parameters.Add("@pUSUARIO_HijoId", int_HijoID);
                var result = await connection.QueryAsync<BEUsuarioRelacion>
                                        ("Usuario_RelacionObtenerSupPro", parameters,
                                        commandType: System.Data.CommandType.StoredProcedure);
                return result;
            }
        }
        public async Task<IEnumerable<BEUsuario>> UsuarioPais_Obtener(int int_pUsuarioId, int int_pUsuarioPerfilId = 0, int int_pUsuarioActivo = -1, int int_pUsuarioPaisId = 0)
        {
            await using (var connection = new SqlConnection(_connectionString))
            {
                var parameters = new DynamicParameters();
                parameters.Add("@pUSUARIO_Id", int_pUsuarioId);
                parameters.Add("@pUSUARIO_PerfilId", int_pUsuarioPerfilId);
                parameters.Add("@pUSUARIO_Activo", int_pUsuarioActivo);
                parameters.Add("@pUSUARIO_PaisId", int_pUsuarioPaisId);
                var result = await connection.QueryAsync<BEUsuario>
                                        ("UsuarioPais_Obtener", parameters,
                                        commandType: System.Data.CommandType.StoredProcedure);
                return result;
            }
        }
        public async Task<BEError> Usuario_Eliminar(int int_pUsuarioID, string str_pOrigen = "U")
        {
            await using (var connection = new SqlConnection(_connectionString))
            {
                var parameters = new DynamicParameters();
                parameters.Add("@pUSUARIO_Id", int_pUsuarioID);
                parameters.Add("@pUSUARIO_Origen", str_pOrigen);
                var result = await connection.QueryFirstOrDefaultAsync<BEError>("Usuario_Eliminar", parameters,
                                        commandType: System.Data.CommandType.StoredProcedure);
                return result!;
            }
        }
        public async Task<IEnumerable<BEUsuario>> Usuario_Obtener(int int_pUsuarioId, int int_pAgenciaId=0, int int_pUsuarioPerfilId = 0, int int_pUsuarioActivo = -1, string str_pOrigen = "U")
        {
            await using (var connection = new SqlConnection(_connectionString)) {

                var parameters = new DynamicParameters();
                parameters.Add("@pUSUARIO_Id", int_pUsuarioId);
                parameters.Add("@pUSUARIO_AgenciaId", int_pAgenciaId);
                parameters.Add("@pUSUARIO_PerfilId", int_pUsuarioPerfilId);
                parameters.Add("@pUSUARIO_Activo", int_pUsuarioActivo);
                parameters.Add("@pUSUARIO_Origen", str_pOrigen);
                var result = await connection.QueryAsync<BEUsuario>
                                        ("Usuario_Obtener", parameters,
                                        commandType: System.Data.CommandType.StoredProcedure);
                return result;
            }
        }
        public async Task<IEnumerable<BEUsuario>> Usuario_ObtenerRecuperar(string? str_pUsuarioLogin, string? str_pUsuarioEmail)
        {
            await using (var connection = new SqlConnection(_connectionString))
            {
                var parameters = new DynamicParameters();
                parameters.Add("@pUSUARIO_Login", str_pUsuarioLogin);
                parameters.Add("@pUSUARIO_EMail", str_pUsuarioEmail);
                var result = await connection.QueryAsync<BEUsuario>
                                        ("Usuario_ObtenerDatos", parameters,
                                        commandType: System.Data.CommandType.StoredProcedure);
                return result;
            }
        }
        public async Task<BEError> Usuario_Procesar(BEUsuarioParametro obj_pUsuario)
        {
            await using (var connection = new SqlConnection(_connectionString))
            {
                Helpers GeneralAyuda = new Helpers();
                string str_vFechaValidoDesde = "";
                string str_vFechaValidoHasta = "";
                if (obj_pUsuario.usuarioValidoDesde != DateTime.Parse("0001-01-01"))
                    str_vFechaValidoDesde = GeneralAyuda.TraerFechaFormatoServidorBD(obj_pUsuario.usuarioValidoDesde);
                if (obj_pUsuario.usuarioValidoHasta != DateTime.Parse("0001-01-01"))
                    str_vFechaValidoHasta = GeneralAyuda.TraerFechaFormatoServidorBD(obj_pUsuario.usuarioValidoHasta);

                var result = new BEError(); 
                if (obj_pUsuario.usuarioOrigen == "U")
                {
                    var parameters = new DynamicParameters();
                    parameters.Add("@pUSUARIO_Id", obj_pUsuario.usuarioId);
                    parameters.Add("@pUSUARIO_Login", obj_pUsuario.usuarioLogin);
                    parameters.Add("@pUSUARIO_Password", obj_pUsuario.usuarioPassword);
                    parameters.Add("@pUSUARIO_Nombre", obj_pUsuario.usuarioNombre);
                    parameters.Add("@pUSUARIO_Email", obj_pUsuario.usuarioEmail);
                    parameters.Add("@pUSUARIO_PerfilId", obj_pUsuario.usuarioPerfilId);
                    parameters.Add("@pUSUARIO_ValidoDesde", str_vFechaValidoDesde);
                    parameters.Add("@pUSUARIO_ValidoHasta", str_vFechaValidoHasta);
                    parameters.Add("@pUSUARIO_Foto", obj_pUsuario.usuarioFoto);
                    parameters.Add("@pUSUARIO_Comentarios", obj_pUsuario.usuarioComentarios);
                    parameters.Add("@pUSUARIO_UsuarioId", obj_pUsuario.usuarioCreadoUsuarioId);
                    parameters.Add("@pUSUARIO_Activo", obj_pUsuario.usuarioActivo);
                    parameters.Add("@pUSUARIO_PaisId", obj_pUsuario.usuarioPaisId);
                    parameters.Add("@pUSUARIO_TipoDocumento", obj_pUsuario.usuarioDocumentoTipoId);
                    parameters.Add("@pUSUARIO_NumeroDocumento", obj_pUsuario.usuarioDocumentoNumero);
                    parameters.Add("@pUSUARIO_Banco", obj_pUsuario.usuarioBanco);
                    parameters.Add("@pUSUARIO_NumeroCuenta", obj_pUsuario.usuarioNumeroCuenta);
                    parameters.Add("@pUSUARIO_ActualizarContrasena", obj_pUsuario.usuarioActualizarContrasena);
                    result = await connection.QueryFirstOrDefaultAsync<BEError>("Usuario_Procesar", parameters,
                                            commandType: System.Data.CommandType.StoredProcedure);
                }
                else
                {
                    var parameters = new DynamicParameters();
                    parameters.Add("@pAGENCIA_Id", obj_pUsuario.usuarioAgenciaId);
                    parameters.Add("@pAGENCIAUSUARIO_Id", obj_pUsuario.usuarioId);
                    parameters.Add("@pAGENCIAUSUARIO_Nombre", obj_pUsuario.usuarioNombre);
                    parameters.Add("@pAGENCIAUSUARIO_TipoDocumento", obj_pUsuario.usuarioDocumentoTipoId);
                    parameters.Add("@pAGENCIAUSUARIO_NumeroDocumento", obj_pUsuario.usuarioDocumentoNumero);
                    parameters.Add("@pAGENCIAUSUARIO_Telefono", "");
                    parameters.Add("@pAGENCIAUSUARIO_Email", obj_pUsuario.usuarioEmail);
                    parameters.Add("@pAGENCIAUSUARIO_Direccion", "");
                    parameters.Add("@pAGENCIAUSUARIO_Login", obj_pUsuario.usuarioLogin);
                    parameters.Add("@pAGENCIAUSUARIO_Clave", obj_pUsuario.usuarioPassword);
                    parameters.Add("@pAGENCIAUSUARIO_PerfilId", obj_pUsuario.usuarioPerfilId);
                    parameters.Add("@pAGENCIAUSUARIO_SupervisorId", 0);
                    parameters.Add("@pAGENCIAUSUARIO_ValidoDesde", str_vFechaValidoDesde);
                    parameters.Add("@pAGENCIAUSUARIO_ValidoHasta", str_vFechaValidoHasta);
                    parameters.Add("@pAGENCIAUSUARIO_Comentarios", obj_pUsuario.usuarioComentarios);
                    parameters.Add("@pAGENCIAUSUARIO_Usuario", obj_pUsuario.usuarioCreadoUsuarioId);
                    parameters.Add("@pAGENCIAUSUARIO_Activo", obj_pUsuario.usuarioActivo);
                    parameters.Add("@pAGENCIAUSUARIO_Banco", obj_pUsuario.usuarioBanco);
                    parameters.Add("@pAGENCIAUSUARIO_NumeroCuenta", obj_pUsuario.usuarioNumeroCuenta);
                    parameters.Add("@pAGENCIAUSUARIO_ActualizarContrasena", obj_pUsuario.usuarioActualizarContrasena);
                    result = await connection.QueryFirstOrDefaultAsync<BEError>("AgenciaUsuario_Procesar", parameters,
                                            commandType: System.Data.CommandType.StoredProcedure);
                }
                
                return result!;
            }
        }
        public async Task<BEError> Usuario_CambiarClave(string? int_pUsuarioOrigen, int int_pUsuarioId, string? int_pUsuarioClave)
        {
            await using (var connection = new SqlConnection(_connectionString))
            {
                var parameters = new DynamicParameters();
                parameters.Add("@pUSUARIO_Id", int_pUsuarioId);
                parameters.Add("@pUSUARIO_Origen", int_pUsuarioOrigen);
                parameters.Add("@pUSUARIO_Password", int_pUsuarioClave);
                var result = await connection.QueryFirstOrDefaultAsync<BEError>("Usuario_CambiarClave", parameters,
                                        commandType: System.Data.CommandType.StoredProcedure);
                return result!;
            }
        }
        public async Task<BEUsuario> Usuario_ValidarAcceso(string? str_pUsuario, string? str_pClave)
        {
            await using (var connection = new SqlConnection(_connectionString))
            {
                var parameters = new DynamicParameters();
                parameters.Add("@pUSUARIO_Login", str_pUsuario);
                parameters.Add("@pUSUARIO_Password", str_pClave);
                var result = await connection.QueryFirstOrDefaultAsync<BEUsuario>
                                        ("Usuario_ValidarAcceso", parameters,
                                        commandType: System.Data.CommandType.StoredProcedure);
                return result!;
            }
        }
        public async Task<BEErrorApi> Usuario_ValidarExistencia(string? str_pOpcion, string? str_pParametro)
        {
            await using (var connection = new SqlConnection(_connectionString))
            {
                var parameters = new DynamicParameters();
                parameters.Add("@pUSUARIO_Opcion", str_pOpcion);
                parameters.Add("@pUSUARIO_Parametro", str_pParametro);
                var result = await connection.QueryFirstOrDefaultAsync<BEErrorApi>("Usuario_ValidarExistencia", parameters,
                                        commandType: System.Data.CommandType.StoredProcedure);
                return result!;
            }
        }
		public async Task<BEErrorApi> Usuario_PrcesarTokenPassword(string pUsuario)
		{
			await using (var connection = new SqlConnection(_connectionString))
			{

				var parameters = new DynamicParameters();
				parameters.Add("@pUSUARIO_Login", pUsuario);

				var result = await connection.QueryFirstOrDefaultAsync<BEErrorApi>
										("Usuario_ProcesarTokenRecuperacion", parameters,
										commandType: System.Data.CommandType.StoredProcedure);
				return result!;
			}
		}
		public async Task<BEResultado> Usuario_ValidarMenu(int pIdUsuario, int pMenuId) {
			await using (var connection = new SqlConnection(_connectionString)) {

				var parameters = new DynamicParameters();
				parameters.Add("@pUSUARIO_Id", pIdUsuario);
				parameters.Add("@pMENU_Id", pMenuId);

				var result = await connection.QueryFirstOrDefaultAsync<BEResultado>
										("Usuario_ValidarMenu", parameters,
										commandType: System.Data.CommandType.StoredProcedure);
				return result!;
			}
		}
		public async Task<BEResultado> Usuario_ValidarTokenRestablecerPassword(string pToken, int pDuracion)
		{
			await using (var connection = new SqlConnection(_connectionString))
			{

				var parameters = new DynamicParameters();
				parameters.Add("@pUSUARIO_Token", pToken);
				parameters.Add("@pUSUARIO_Duracion", pDuracion);

				var result = await connection.QueryFirstOrDefaultAsync<BEResultado>
										("Usuario_ValidarTokenRecuperacion", parameters,
										commandType: System.Data.CommandType.StoredProcedure);
				return result!;
			}
		}

		public async Task<BEResultado> Usuario_CerrarTokenPassword(int pIdUsuario, string str_pOrigen)
		{
			await using (var connection = new SqlConnection(_connectionString))
			{

				var parameters = new DynamicParameters();
				parameters.Add("@pUSUARIO_Id", pIdUsuario);
				parameters.Add("@pUSUARIO_Origen", str_pOrigen);

				var result = await connection.QueryFirstOrDefaultAsync<BEResultado>
										("Usuario_CerrarTokenRecuperacion", parameters,
										commandType: System.Data.CommandType.StoredProcedure);
				return result!;
			}
		}
	}
}
