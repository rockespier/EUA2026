using BackAssistanceTravelers.Models.Agencia;
using BackAssistanceTravelers.Models.Error;

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
    public class AgenciaRepository : Repository, IAgenciaRepository
    {
        public AgenciaRepository(string connectionString) : base(connectionString)
        {
        }
        public async Task<BEError> AgenciaPromotor_Validar(int int_pUsuarioID)
        {
            await using (var connection = new SqlConnection(_connectionString))
            {
                var parameters = new DynamicParameters();
                parameters.Add("@pUSUARIO_ID", int_pUsuarioID);
                var result = await connection.QueryFirstOrDefaultAsync<BEError>
                                        ("UsuarioPromotor_ValidarExistencia", parameters,
                                        commandType: System.Data.CommandType.StoredProcedure);
                return result!;
            }
        }
        public async Task<BEError> AgenciaUsuario_Eliminar(int int_pAgenciaUsuarioId)
        {
            await using (var connection = new SqlConnection(_connectionString))
            {
                var parameters = new DynamicParameters();
                parameters.Add("@pAGENCIAUSUARIO_Id", int_pAgenciaUsuarioId);
                var result = await connection.QueryFirstOrDefaultAsync<BEError>
                                        ("AgenciaUsuario_Eliminar", parameters,
                                        commandType: System.Data.CommandType.StoredProcedure);
                return result!;
            }
        }
        public async Task<IEnumerable<BEAgenciaUsuario>> AgenciaUsuario_Obtener(int int_pAgenciaID, int int_pAgenciaUsuarioId = 0, int int_pAgenciaUsuarioSupervisorId = 0, int int_pAgenciaUsuarioPerfilId = 0, int int_pAgenciaUsuarioActivo = -1, int int_pAgenciaUsuarioIncluirAgencia = 0)
        {
            await using (var connection = new SqlConnection(_connectionString))
            {
                var parameters = new DynamicParameters();
                parameters.Add("@pAGENCIA_Id", int_pAgenciaID);
                parameters.Add("@pAGENCIAUSUARIO_Id", int_pAgenciaUsuarioId);
                parameters.Add("@pAGENCIAUSUARIO_SupervisorId", int_pAgenciaUsuarioSupervisorId);
                parameters.Add("@pAGENCIAUSUARIO_PerfilId", int_pAgenciaUsuarioPerfilId);
                parameters.Add("@pAGENCIAUSUARIO_Activo", int_pAgenciaUsuarioActivo);
                parameters.Add("@pAGENCIAUSUARIO_IncluirAgencia", int_pAgenciaUsuarioIncluirAgencia);
                var result = await connection.QueryAsync<BEAgenciaUsuario>
                                        ("AgenciaUsuario_Obtener", parameters,
                                        commandType: System.Data.CommandType.StoredProcedure);
                return result;
            }
        }
        public async Task<BEError> AgenciaUsuario_Procesar(BEAgenciaUsuario obj_pAgenciaUsuario)
        {
            await using (var connection = new SqlConnection(_connectionString))
            {
                Helpers GeneralAyuda = new Helpers();
                string str_vFechaValidoDesde = "";
                string str_vFechaValidoHasta = "";
                if (obj_pAgenciaUsuario.agenciausuarioValidoDesde != DateTime.Parse("0001-01-01"))
                    str_vFechaValidoDesde = GeneralAyuda.TraerFechaFormatoServidorBD(obj_pAgenciaUsuario.agenciausuarioValidoDesde);

                if (obj_pAgenciaUsuario.agenciausuarioValidoHasta != DateTime.Parse("0001-01-01"))
                    str_vFechaValidoHasta = GeneralAyuda.TraerFechaFormatoServidorBD(obj_pAgenciaUsuario.agenciausuarioValidoHasta);

                var parameters = new DynamicParameters();
                parameters.Add("@pAGENCIA_Id", obj_pAgenciaUsuario.agenciaId);
                parameters.Add("@pAGENCIAUSUARIO_Id", obj_pAgenciaUsuario.agenciausuarioId);
                parameters.Add("@pAGENCIAUSUARIO_Nombre", obj_pAgenciaUsuario.agenciausuarioNombre);
                parameters.Add("@pAGENCIAUSUARIO_TipoDocumento", obj_pAgenciaUsuario.agenciausuarioTipoDocumentoId);
                parameters.Add("@pAGENCIAUSUARIO_NumeroDocumento", obj_pAgenciaUsuario.agenciausuarioNumeroDocumento);
                parameters.Add("@pAGENCIAUSUARIO_Telefono", obj_pAgenciaUsuario.agenciausuarioTelefono);
                parameters.Add("@pAGENCIAUSUARIO_Email", obj_pAgenciaUsuario.agenciausuarioEMail);
                parameters.Add("@pAGENCIAUSUARIO_Direccion", obj_pAgenciaUsuario.agenciausuarioDireccion);
                parameters.Add("@pAGENCIAUSUARIO_Login", obj_pAgenciaUsuario.agenciausuarioLogin);
                parameters.Add("@pAGENCIAUSUARIO_Clave", obj_pAgenciaUsuario.agenciausuarioClave);
                parameters.Add("@pAGENCIAUSUARIO_PerfilId", obj_pAgenciaUsuario.agenciausuarioPerfilId);
                parameters.Add("@pAGENCIAUSUARIO_SupervisorId", obj_pAgenciaUsuario.agenciausuarioSupervisorId);
                parameters.Add("@pAGENCIAUSUARIO_ValidoDesde", str_vFechaValidoDesde);
                parameters.Add("@pAGENCIAUSUARIO_ValidoHasta", str_vFechaValidoHasta);
                parameters.Add("@pAGENCIAUSUARIO_Comentarios", obj_pAgenciaUsuario.agenciausuarioComentarios);
                parameters.Add("@pAGENCIAUSUARIO_Usuario", obj_pAgenciaUsuario.agenciausuarioCreadoUsuarioId);
                parameters.Add("@pAGENCIAUSUARIO_Activo", obj_pAgenciaUsuario.agenciausuarioActivo);
                var result = await connection.QueryFirstOrDefaultAsync<BEError>("AgenciaUsuario_Procesar", parameters,
                                        commandType: System.Data.CommandType.StoredProcedure);
                return result!;
            }
        }
        public async Task<IEnumerable<BEAgencia>> AgenciaVenta_Obtener(int int_pVentaId)
        {
            await using (var connection = new SqlConnection(_connectionString))
            {
                var parameters = new DynamicParameters();
                parameters.Add("@pVENTA_ID", int_pVentaId);
                var result = await connection.QueryAsync<BEAgencia>
                                        ("AgenciaVenta_Obtener", parameters,
                                        commandType: System.Data.CommandType.StoredProcedure);
                return result;
            }
        }
        public async Task<BEError> Agencia_Eliminar(int int_pAgenciaID, string strBasedeDatos = "O")
        {
            await using (var connection = new SqlConnection(_connectionString))
            {
                var parameters = new DynamicParameters();
                parameters.Add("@pAGENCIA_Id", int_pAgenciaID);
                var result = await connection.QueryFirstOrDefaultAsync<BEError>
                                        ("Agencia_Eliminar", parameters,
                                        commandType: System.Data.CommandType.StoredProcedure);
                return result!;
            }
        }
        public async Task<IEnumerable<BEAgencia>> Agencia_Obtener(int int_pAgenciaID, 
            int int_pAgenciaPerfilId = 0, int int_pAgenciaPromotorId = 0, 
            int int_pAgenciaActivo = -1, int int_pAgenciaPaisId = 0, string str_AgenciaNombre = "", string str_AgenciaLogin = "", string str_AgenciaRuc = "")
        {
            await using (var connection = new SqlConnection(_connectionString))
            {
                var parameters = new DynamicParameters();
                parameters.Add("@pAGENCIA_Id", int_pAgenciaID);
                parameters.Add("@pAGENCIA_PerfilId", int_pAgenciaPerfilId);
                parameters.Add("@pAGENCIA_PromotorId", int_pAgenciaPromotorId);
                parameters.Add("@pAGENCIA_Activo", int_pAgenciaActivo);
                parameters.Add("@pAGENCIA_PaisId", int_pAgenciaPaisId);
				parameters.Add("@pAgencia_Nombre", str_AgenciaNombre);
				parameters.Add("@pAgencia_Login", str_AgenciaLogin);
				parameters.Add("@pAgencia_RUC", str_AgenciaRuc);

				var result = await connection.QueryAsync<BEAgencia>
                                        ("Agencia_Obtener_nuevo", parameters,
                                        commandType: System.Data.CommandType.StoredProcedure);
                return result;
            }
        }
        public async Task<BEError> Agencia_Procesar(BEAgenciaParametro obj_pAgencia, string? strBasedeDatos = "O")
        {
            await using (var connection = new SqlConnection(_connectionString))
            {
                Helpers GeneralAyuda = new Helpers();
                string str_vFechaValidoDesde = "";
                string str_vFechaValidoHasta = "";
                if (obj_pAgencia.agenciaValidoDesde != DateTime.Parse("0001-01-01"))
                    str_vFechaValidoDesde = GeneralAyuda.TraerFechaFormatoServidorBD(obj_pAgencia.agenciaValidoDesde);

                if (obj_pAgencia.agenciaValidoHasta != DateTime.Parse("0001-01-01"))
                    str_vFechaValidoHasta = GeneralAyuda.TraerFechaFormatoServidorBD(obj_pAgencia.agenciaValidoHasta);

                var parameters = new DynamicParameters();
                parameters.Add("@pAGENCIA_Id", obj_pAgencia.agenciaId);
                parameters.Add("@pAGENCIA_IdExterno", obj_pAgencia.agenciaIdExterno);
                parameters.Add("@pAGENCIA_Nombre", obj_pAgencia.agenciaNombre);
                parameters.Add("@pAGENCIA_Direccion", obj_pAgencia.agenciaDireccion);
                parameters.Add("@pAGENCIA_RUC", obj_pAgencia.agenciaRUC);
                parameters.Add("@pAGENCIA_Login", obj_pAgencia.agenciaLogin);
                parameters.Add("@pAGENCIA_Password", obj_pAgencia.agenciaPassword);
                parameters.Add("@pAGENCIA_Email", obj_pAgencia.agenciaEmail);
                parameters.Add("@pAGENCIA_PerfilId", obj_pAgencia.agenciaPerfilId);
                parameters.Add("@pAGENCIA_PromotorId", obj_pAgencia.agenciaPromotorId);
                parameters.Add("@pAGENCIA_Comision", obj_pAgencia.agenciaComision);
                parameters.Add("@pAGENCIA_ValidoDesde", str_vFechaValidoDesde);
                parameters.Add("@pAGENCIA_ValidoHasta", str_vFechaValidoHasta);
                parameters.Add("@pAGENCIA_Comentarios", obj_pAgencia.agenciaComentarios);
                parameters.Add("@pAGENCIA_UsuarioId", obj_pAgencia.agenciaCreadoUsuarioId);
                parameters.Add("@pAGENCIA_Activo", obj_pAgencia.agenciaActivo);
                parameters.Add("@pAGENCIA_Credito", obj_pAgencia.agenciaCredito);
                parameters.Add("@pAGENCIA_PaisId", obj_pAgencia.agenciaPaisId);
                parameters.Add("@pAGENCIA_Telefono", obj_pAgencia.agenciaTelefono);
                parameters.Add("@pAGENCIA_Xcoord", obj_pAgencia.agenciaXcoord);
                parameters.Add("@pAGENCIA_Ycoord", obj_pAgencia.agenciaYcoord);
                parameters.Add("@pAGENCIA_UbigeoId", obj_pAgencia.agenciaUbigeoId);
                parameters.Add("@pAGENCIA_ObservacionCobranza", obj_pAgencia.agenciaObservacionCobranzas);
				parameters.Add("@pAGENCIA_ActualizarContrasena", obj_pAgencia.agencia_ActualizarContrasena);
                parameters.Add("@pAGENCIA_VIP", obj_pAgencia.agenciaVip);
                parameters.Add("@pAGENCIA_EJECUTIVOCOBRADOR", obj_pAgencia.agenciaEjecutivoCobrador);


                var result = await connection.QueryFirstOrDefaultAsync<BEError>("Agencia_Procesar_nuevo", parameters,
                                        commandType: System.Data.CommandType.StoredProcedure);
                return result!;
            }
        }
		public async Task<BEError> AgenciaProducto_Eliminar(int int_pAgenciaProductoId) {
			await using (var connection = new SqlConnection(_connectionString)) {
				var parameters = new DynamicParameters();
				parameters.Add("@pAgenciaProductoId", int_pAgenciaProductoId);			
				
				var result = await connection.QueryFirstOrDefaultAsync<BEError>
										("AgenciaProducto_Eliminar", parameters,
										commandType: System.Data.CommandType.StoredProcedure);
				return result!;
			}
		}
		public async Task<IEnumerable<BEAgenciaProducto>> AgenciaProducto_Obtener(int int_pAgenciaId, int int_pAgenciaProductoProductoId, int int_pAgenciaProductoPaisId, int int_pAgenciaProductoId) {
			await using (var connection = new SqlConnection(_connectionString)) {
				var parameters = new DynamicParameters();
				parameters.Add("@pAGENCIA_Id", int_pAgenciaId);
				parameters.Add("@pAGENCIA_ProductoId", int_pAgenciaProductoProductoId);
				parameters.Add("@pAGENCIA_PaisId", int_pAgenciaProductoPaisId);
				parameters.Add("@pID", int_pAgenciaProductoId);

				var result = await connection.QueryAsync<BEAgenciaProducto>("AgenciaProducto_Obtener", parameters,
										commandType: System.Data.CommandType.StoredProcedure);
				return result;
			}
		}
		public async Task<BEError> AgenciaProducto_Procesar(BEAgenciaProducto oEntidad) {
			await using (var connection = new SqlConnection(_connectionString)) {
				var parameters = new DynamicParameters();
				parameters.Add("@pAgenciaProductoAgencia_Id", oEntidad.agenciaProductoAgenciaId);
				parameters.Add("@pAgenciaProductoProducto_Id", oEntidad.agenciaProductoProductoId);
				parameters.Add("@pAgenciaProductoDescuentoTipo", oEntidad.agenciaProductoDescuentoTipo);
				parameters.Add("@pAgenciaProductoDescuentoImporte", oEntidad.agenciaProductoDescuentoImporte);
				parameters.Add("@pAgenciaProductoDescuentoVigenciaIni", oEntidad.agenciaProductoDescuentoVigenciaIni);
				parameters.Add("@pAgenciaProductoDescuentoVigenciaFin", oEntidad.agenciaProductoDescuentoVigenciafin);
				parameters.Add("@pAgenciaProductoDescuentoNombre", oEntidad.agenciaProductoDescuentoNombre);
                parameters.Add("@pAgenciaProducto_Id", oEntidad.agenciaProductoId);

				var result = await connection.QueryFirstOrDefaultAsync<BEError>
										("AgenciaProducto_Procesar", parameters,
										commandType: System.Data.CommandType.StoredProcedure);
				return result!;
			}
		}

		public async Task<BEError> AgenciaFactura_Eliminar(int int_pAgenciaFacturaId) {
			await using (var connection = new SqlConnection(_connectionString)) {
				var parameters = new DynamicParameters();
				parameters.Add("@pAgenciafacturaId", int_pAgenciaFacturaId);
			
				var result = await connection.QueryFirstOrDefaultAsync<BEError>
										("AgenciaFactura_Eliminar", parameters,
										commandType: System.Data.CommandType.StoredProcedure);
				return result!;
			}
		}
		public async Task<IEnumerable<BEAgenciaFactura>> AgenciaFactura_Obtener(int int_pAgenciaFacturaId,int int_pAgenciaFacturaAgenciaId, int int_pAgenciaFacturaTipoDocumento, string str_pAgenciaFacturaSerie, 
            int int_pAgenciaFacturaNumero, int int_pAgenciaFacturaEstado,DateTime dte_pAgenciaFacturaInicio = default, DateTime dte_pAgenciaFacturaFin = default) {
			await using (var connection = new SqlConnection(_connectionString)) {

				Helpers GeneralAyuda = new Helpers();
				string str_vFechaValidoDesde = "";
				string str_vFechaValidoHasta = "";
				if (dte_pAgenciaFacturaInicio != DateTime.Parse("0001-01-01"))
					str_vFechaValidoDesde = GeneralAyuda.TraerFechaFormatoServidorBD(dte_pAgenciaFacturaInicio);
				if (dte_pAgenciaFacturaFin != DateTime.Parse("0001-01-01"))
					str_vFechaValidoHasta = GeneralAyuda.TraerFechaFormatoServidorBD(dte_pAgenciaFacturaFin);

				var parameters = new DynamicParameters();
				parameters.Add("@pAgenciafacturaId", int_pAgenciaFacturaId);
				parameters.Add("@pAgenciafacturaAgenciaId", int_pAgenciaFacturaAgenciaId);
				parameters.Add("@pAgenciafacturaTipoDocumento", int_pAgenciaFacturaTipoDocumento);
				parameters.Add("@pAgenciafacturaSerie", str_pAgenciaFacturaSerie);
				parameters.Add("@pAgenciafacturaNumero", int_pAgenciaFacturaNumero);
				parameters.Add("@pAgenciafacturaEstado", int_pAgenciaFacturaEstado);
				parameters.Add("@pAgenciafacturaInicio", str_vFechaValidoDesde);
				parameters.Add("@pAgenciafacturaFin", str_vFechaValidoHasta);

				var result = await connection.QueryAsync<BEAgenciaFactura>("AgenciaFactura_Obtener", parameters,
										commandType: System.Data.CommandType.StoredProcedure);
				return result;
			}
		}
		public async Task<BEError> AgenciaFactura_Procesar(BEAgenciaFactura oEntidad) {
			await using (var connection = new SqlConnection(_connectionString)) {
				var parameters = new DynamicParameters();				

				parameters.Add("@pAgenciaFacturaId", oEntidad.agenciaFacturaId);
				parameters.Add("@pAgenciafacturaAgenciaId", oEntidad.agenciaFacturaAgenciaId);
				parameters.Add("@pAgenciafacturaTipoDocumento", oEntidad.agenciaFacturaTipoDocumento);
				parameters.Add("@pAgenciafacturaSerie", oEntidad.agenciaFacturaSerie);
				parameters.Add("@pAgenciafacturaNumero", oEntidad.agenciaFacturaNumero);
				parameters.Add("@pAgenciafacturaFechaEmision", oEntidad.agenciaFacturaFechaEmision);
				parameters.Add("@pAgenciafacturaMonedaId", oEntidad.agenciaFacturaMonedaId);
				parameters.Add("@pAgenciafacturaTotal", oEntidad.agenciaFacturaTotal);
				parameters.Add("@pAgenciafacturaObservacion", oEntidad.agenciaFacturaObservacion);
				parameters.Add("@pAgenciafacturaCobranzaId", oEntidad.agenciaFacturaCobranzaId);
				parameters.Add("@pAgenciafacturaEstado", oEntidad.agenciaFacturaEstado);

				var result = await connection.QueryFirstOrDefaultAsync<BEError>
										("AgenciaFactura_Procesar", parameters,
										commandType: System.Data.CommandType.StoredProcedure);
				return result!;
			}
		}
		public async Task<IEnumerable<BEAgenciaFactura>> Venta_ObtenerComision(int int_pCodLiquidacion) {
			await using (var connection = new SqlConnection(_connectionString)) {
				Helpers GeneralAyuda = new Helpers();
				
				var parameters = new DynamicParameters();
				parameters.Add("@pCodLiquidacion", int_pCodLiquidacion);				
				var result = await connection.QueryAsync<BEAgenciaFactura>
										("Comision_Obtener", parameters,
										commandType: System.Data.CommandType.StoredProcedure);
				return result;
			}
		}
	}
}
