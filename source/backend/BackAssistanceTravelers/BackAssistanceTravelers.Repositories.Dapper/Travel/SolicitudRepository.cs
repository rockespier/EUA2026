using BackAssistanceTravelers.Models.Cobranza;
using BackAssistanceTravelers.Models.Error;
using BackAssistanceTravelers.Models.Solicitud;
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
    public class SolicitudRepository : Repository, ISolicitudRepository
    {
        public SolicitudRepository(string connectionString) : base(connectionString)
        {
        }
        public async Task<BEError> Solicitudes_Registrar(BESolicitud obj_pSolicitud)
        {
            await using (var connection = new SqlConnection(_connectionString))
            {
                var opt = obj_pSolicitud.solicitudTipoId;
                var parameters = new DynamicParameters();
                var result = new BEError();
                Helpers GeneralAyuda = new Helpers();
                switch (opt)
                {
                    case 1:
                        parameters.Add("@pSOLICITUD_VentaId", obj_pSolicitud.solicitudVentaId);
                        parameters.Add("@pSOLICITUD_Motivo", obj_pSolicitud.solicitudMotivo);
                        parameters.Add("@pSOLICITUD_Adjunto", obj_pSolicitud.solicitudAdjunto);
                        parameters.Add("@pSOLICITUD_Usuario", obj_pSolicitud.solicitudCreadoUsuarioId);
                        parameters.Add("@pSOLICITUD_MotivoAnulacion", obj_pSolicitud.solicitudMotivoAnulacion);
                        result = await connection.QueryFirstOrDefaultAsync<BEError>
                                        ("Solicitud_RegistrarAnulacion", parameters,
                                        commandType: System.Data.CommandType.StoredProcedure);
                        break;
                    case 2: case 11:
                        string str_vSolicitudVigenciaFechaInicial = "";
                        string str_vSolicitudVigenciaFechaFinal = "";
                        if (obj_pSolicitud.solicitudVigenciaFechaInicial != DateTime.Parse("0001-01-01"))
                            str_vSolicitudVigenciaFechaInicial = GeneralAyuda.TraerFechaFormatoServidorBD(obj_pSolicitud.solicitudVigenciaFechaInicial);

                        if (obj_pSolicitud.solicitudVigenciaFechaFinal != DateTime.Parse("0001-01-01"))
                            str_vSolicitudVigenciaFechaFinal = GeneralAyuda.TraerFechaFormatoServidorBD(obj_pSolicitud.solicitudVigenciaFechaFinal);
                        parameters.Add("@pSOLICITUD_VentaId", obj_pSolicitud.solicitudVentaId);
                        parameters.Add("@pSOLICITUD_VigenciaFechaInicial", str_vSolicitudVigenciaFechaInicial);
                        parameters.Add("@pSOLICITUD_VigenciaFechaFinal", str_vSolicitudVigenciaFechaFinal);
                        parameters.Add("@pSOLICITUD_Motivo", obj_pSolicitud.solicitudMotivo);
                        parameters.Add("@pSOLICITUD_Usuario", obj_pSolicitud.solicitudCreadoUsuarioId);
                        result = await connection.QueryFirstOrDefaultAsync<BEError>
                                        ("Solicitud_RegistrarModificacionVigencia", parameters,
                                        commandType: System.Data.CommandType.StoredProcedure);
                        break;
                    case 3:
                        parameters.Add("@pSOLICITUD_VentaId", obj_pSolicitud.solicitudVentaId);
                        parameters.Add("@pSOLICITUD_Motivo", obj_pSolicitud.solicitudMotivo);
                        parameters.Add("@pSOLICITUD_Usuario", obj_pSolicitud.solicitudCreadoUsuarioId);
                        result = await connection.QueryFirstOrDefaultAsync<BEError>
                                        ("Solicitud_RegistrarReActivacion", parameters,
                                        commandType: System.Data.CommandType.StoredProcedure);
                        break;
                    case 4:
                        parameters.Add("@pSOLICITUD_VentaId", obj_pSolicitud.solicitudVentaId);
                        parameters.Add("@pSOLICITUD_AgenciaId", obj_pSolicitud.solicitudAgenciaId);
                        parameters.Add("@pSOLICITUD_AgenciaUsuarioId", obj_pSolicitud.solicitudAgenciaUsuarioId);
                        parameters.Add("@pSOLICITUD_Motivo", obj_pSolicitud.solicitudMotivo);
                        parameters.Add("@pSOLICITUD_Usuario", obj_pSolicitud.solicitudCreadoUsuarioId);
                        result = await connection.QueryFirstOrDefaultAsync<BEError>
                                        ("Solicitud_RegistrarTransferencia", parameters,
                                        commandType: System.Data.CommandType.StoredProcedure);
                        break;
                    case 5:
                        string str_vSolicitudClienteFechaNacimiento = "";
                        if (obj_pSolicitud.solicitudClienteFechaNacimiento != DateTime.Parse("0001-01-01"))
                            str_vSolicitudClienteFechaNacimiento = GeneralAyuda.TraerFechaFormatoServidorBD(obj_pSolicitud.solicitudClienteFechaNacimiento);
                        parameters.Add("@pSOLICITUD_VentaId", obj_pSolicitud.solicitudVentaId);
                        parameters.Add("@pSOLICITUD_ClienteDocumentoTipoId", obj_pSolicitud.solicitudClienteDocumentoTipoId);
                        parameters.Add("@pSOLICITUD_ClienteDocumentoNumero", obj_pSolicitud.solicitudClienteDocumentoNumero);
                        parameters.Add("@pSOLICITUD_ClienteNombres", obj_pSolicitud.solicitudClienteNombres!.ToString().ToUpper());
                        parameters.Add("@pSOLICITUD_ClienteApellidos", obj_pSolicitud.solicitudClienteApellidos);
                        parameters.Add("@pSOLICITUD_ClienteFechaNacimiento", str_vSolicitudClienteFechaNacimiento);
                        parameters.Add("@pSOLICITUD_ClienteEdad", obj_pSolicitud.solicitudClienteEdad);
                        parameters.Add("@pSOLICITUD_ClienteEmail", obj_pSolicitud.solicitudClienteEmail);
                        parameters.Add("@pSOLICITUD_ClienteDireccion", obj_pSolicitud.solicitudClienteDireccion!.ToString().ToUpper());
                        parameters.Add("@pSOLICITUD_ClienteTelefono", obj_pSolicitud.solicitudClienteTelefono);
                        parameters.Add("@pSOLICITUD_ClienteDistrito", obj_pSolicitud.solicitudClienteDistrito!.ToString().ToUpper());
                        parameters.Add("@pSOLICITUD_ClienteCiudad", obj_pSolicitud.solicitudClienteCiudad!.ToString().ToUpper());
                        parameters.Add("@pSOLICITUD_ClientePais", obj_pSolicitud.solicitudClientePais!.ToString().ToUpper());
                        parameters.Add("@pSOLICITUD_Motivo", obj_pSolicitud.solicitudMotivo);
                        parameters.Add("@pSOLICITUD_Usuario", obj_pSolicitud.solicitudCreadoUsuarioId);
                        result = await connection.QueryFirstOrDefaultAsync<BEError>
                                        ("Solicitud_RegistrarModificacionCliente", parameters,
                                        commandType: System.Data.CommandType.StoredProcedure);
                        break;
                    case 6:
                        parameters.Add("@pSOLICITUD_VentaId", obj_pSolicitud.solicitudVentaId);
                        parameters.Add("@pSOLICITUD_ContactoNombre", obj_pSolicitud.solicitudContactoNombre!.ToString().ToUpper());
                        parameters.Add("@pSOLICITUD_ContactoDireccion", obj_pSolicitud.solicitudContactoDireccion!.ToString().ToUpper());
                        parameters.Add("@pSOLICITUD_ContactoDistrito", obj_pSolicitud.solicitudContactoDistrito!.ToString().ToUpper());
                        parameters.Add("@pSOLICITUD_ContactoPais", obj_pSolicitud.solicitudContactoPais!.ToString().ToUpper());
                        parameters.Add("@pSOLICITUD_ContactoTelefono", obj_pSolicitud.solicitudContactoTelefono);
                        parameters.Add("@pSOLICITUD_ContactoEmail", obj_pSolicitud.solicitudContactoEmail);
                        parameters.Add("@pSOLICITUD_Motivo", obj_pSolicitud.solicitudMotivo);
                        parameters.Add("@pSOLICITUD_Usuario", obj_pSolicitud.solicitudCreadoUsuarioId);
                        result = await connection.QueryFirstOrDefaultAsync<BEError>
                                        ("Solicitud_RegistrarModificacionContacto", parameters,
                                        commandType: System.Data.CommandType.StoredProcedure);
                        break;
                    case 7:
                        parameters.Add("@pSOLICITUD_VentaId", obj_pSolicitud.solicitudVentaId);
                        parameters.Add("@pSOLICITUD_VentaImporte", obj_pSolicitud.solicitudVentaImporte);
                        parameters.Add("@pSOLICITUD_Motivo", obj_pSolicitud.solicitudMotivo);
                        parameters.Add("@pSOLICITUD_Usuario", obj_pSolicitud.solicitudCreadoUsuarioId);
                        result = await connection.QueryFirstOrDefaultAsync<BEError>
                                        ("Solicitud_RegistrarModificacionImporte", parameters,
                                        commandType: System.Data.CommandType.StoredProcedure);
                        break;
                    case 8:
                        parameters.Add("@pSOLICITUD_VentaId", obj_pSolicitud.solicitudVentaId);
                        parameters.Add("@pSOLICITUD_VentaImporte", obj_pSolicitud.solicitudVentaImporte);
                        parameters.Add("@pSOLICITUD_Motivo", obj_pSolicitud.solicitudMotivo);
                        parameters.Add("@pSOLICITUD_Usuario", obj_pSolicitud.solicitudCreadoUsuarioId);
                        result = await connection.QueryFirstOrDefaultAsync<BEError>
                                        ("Solicitud_RegistrarCancelacionTarjetasFree", parameters,
                                        commandType: System.Data.CommandType.StoredProcedure);
                        break;
					case 10:
						string str_vSolicitudProductoFechaInicial = "";
						string str_vSolicitudProductoFechaFinal = "";
						if (obj_pSolicitud.solicitudVigenciaFechaInicial != DateTime.Parse("0001-01-01"))
							str_vSolicitudProductoFechaInicial = GeneralAyuda.TraerFechaFormatoServidorBD(obj_pSolicitud.solicitudVigenciaFechaInicial);

						if (obj_pSolicitud.solicitudVigenciaFechaFinal != DateTime.Parse("0001-01-01"))
							str_vSolicitudProductoFechaFinal = GeneralAyuda.TraerFechaFormatoServidorBD(obj_pSolicitud.solicitudVigenciaFechaFinal);
						parameters.Add("@pSOLICITUD_VentaId", obj_pSolicitud.solicitudVentaId);
						parameters.Add("@pSOLICITUD_VigenciaFechaInicial", str_vSolicitudProductoFechaInicial);
						parameters.Add("@pSOLICITUD_VigenciaFechaFinal", str_vSolicitudProductoFechaFinal);
						parameters.Add("@pSOLICITUD_ProductoId", obj_pSolicitud.solicitudProductoId);
						parameters.Add("@pSOLICITUD_VentaImporte", obj_pSolicitud.solicitudVentaImporte);
						parameters.Add("@pSOLICITUD_Edad", obj_pSolicitud.solicitudClienteEdad);
						parameters.Add("@pSOLICITUD_Motivo", obj_pSolicitud.solicitudMotivo);
						parameters.Add("@pSOLICITUD_Usuario", obj_pSolicitud.solicitudCreadoUsuarioId);
						result = await connection.QueryFirstOrDefaultAsync<BEError>
										("Solicitud_RegistrarModificacionProducto", parameters,
										commandType: System.Data.CommandType.StoredProcedure);
						break;
				}
                return result!;
            }
        }
        public async Task<BEError> SolicitudMasiva_Atender(string? int_pSolicitudIds, int int_pSolicitudUsuarioId)
        {
            await using (var connection = new SqlConnection(_connectionString))
            {
                var parameters = new DynamicParameters();
                parameters.Add("@pSOLICITUDMasvia_Ids", int_pSolicitudIds);
                parameters.Add("@pSOLICITUD_Usuario", int_pSolicitudUsuarioId);
                var result = await connection.QueryFirstOrDefaultAsync<BEError>
                                        ("SolicitudMasiva_Atender", parameters,
                                        commandType: System.Data.CommandType.StoredProcedure, commandTimeout: 900);
                return result!;
            }
        }
        public async Task<BEError> SolicitudMasvia_Rechazar(string? int_pSolicitudIds, int int_pSolicitudUsuarioId)
        {
            await using (var connection = new SqlConnection(_connectionString))
            {
                var parameters = new DynamicParameters();
                parameters.Add("@pSOLICITUDMasvia_Ids", int_pSolicitudIds);
                parameters.Add("@pSOLICITUD_Usuario", int_pSolicitudUsuarioId);
                var result = await connection.QueryFirstOrDefaultAsync<BEError>
                                        ("SolicitudMasiva_Rechazar", parameters,
                                        commandType: System.Data.CommandType.StoredProcedure);
                return result!;
            }
        }
        public async Task<BEError> SolicitudTipo_Eliminar(int int_pSolicitudTipoID)
        {
            await using (var connection = new SqlConnection(_connectionString))
            {
                var parameters = new DynamicParameters();
                parameters.Add("@pSOLICITUDTIPO_Id", int_pSolicitudTipoID);
                var result = await connection.QueryFirstOrDefaultAsync<BEError>
                                        ("SolicitudTipo_Eliminar", parameters,
                                        commandType: System.Data.CommandType.StoredProcedure);
                return result!;
            }
        }
        public async Task<IEnumerable<BESolicitudTipo>> SolicitudTipo_Obtener(int int_pSolicitudTipoID, int int_pSolicitudTipoActivo = -1, int int_pSolicitudPerfilId = 0)
        {
            await using (var connection = new SqlConnection(_connectionString))
            {
                var parameters = new DynamicParameters();
                parameters.Add("@pSOLICITUDTIPO_Id", int_pSolicitudTipoID);
                parameters.Add("@pSOLICITUDTIPO_Activo", int_pSolicitudTipoActivo);
                parameters.Add("@pSOLICITUDTIPO_PerfilId", int_pSolicitudPerfilId);
                var result = await connection.QueryAsync<BESolicitudTipo>("SolicitudTipo_Obtener", parameters,
                                        commandType: System.Data.CommandType.StoredProcedure);
                return result;
            }
        }
        public async Task<BEError> SolicitudTipo_Procesar(BESolicitudTipoBody obj_pSolicitudTipo)
        {
            await using (var connection = new SqlConnection(_connectionString))
            {
                var parameters = new DynamicParameters();
                parameters.Add("@pSOLICITUDTIPO_Id", obj_pSolicitudTipo.solicitudtipoId);
                parameters.Add("@pSOLICITUDTIPO_AccionId", obj_pSolicitudTipo.solicitudtipoAccionId);
                parameters.Add("@pSOLICITUDTIPO_Nombre", obj_pSolicitudTipo.solicitudtipoAccionNombre);
                parameters.Add("@pSOLICITUDTIPO_EnviarCorreo", obj_pSolicitudTipo.solicitudtipoEnviarCorreo);
                parameters.Add("@pSOLICITUDTIPO_Usuario", obj_pSolicitudTipo.solicitudtipoCreadoUsuarioId);
                parameters.Add("@pSOLICITUDTIPO_Activo", obj_pSolicitudTipo.solicitudtipoActivo);
                var result = await connection.QueryFirstOrDefaultAsync<BEError>
                                        ("SolicitudTipo_Procesar", parameters,
                                        commandType: System.Data.CommandType.StoredProcedure);
                return result!;
            }
        }
        public async Task<BEError> Solicitud_Anular(int int_pSolicitudId)
        {
            await using (var connection = new SqlConnection(_connectionString))
            {
                var parameters = new DynamicParameters();
                parameters.Add("@pSOLICITUD_Id", int_pSolicitudId);
                var result = await connection.QueryFirstOrDefaultAsync<BEError>
                                        ("Solicitud_Anular", parameters,
                                        commandType: System.Data.CommandType.StoredProcedure);
                return result!;
            }
        }
        public async Task<BEError> Solicitud_Atender(int int_pSolicitudId, int int_pSolicitudTipoId, int int_pSolicitudUsuarioId)
        {
            await using (var connection = new SqlConnection(_connectionString))
            {
                var parameters = new DynamicParameters();
                parameters.Add("@pSOLICITUD_Id", int_pSolicitudId);
                parameters.Add("@pSOLICITUD_TipoId", int_pSolicitudTipoId);
                parameters.Add("@pSOLICITUD_Usuario", int_pSolicitudUsuarioId);
                var result = await connection.QueryFirstOrDefaultAsync<BEError>
                                        ("Solicitud_Atender", parameters,
                                        commandType: System.Data.CommandType.StoredProcedure);
                return result!;
            }
        }
        public async Task<IEnumerable<BESolicitud>> Solicitud_Obtener(string? str_pOrigen, int int_pSolicitudUsuarioId = 0,
                                        DateTime dte_pSolicitudIngresoInicio = default, DateTime dte_pSolicitudIngresoFin = default, 
                                    int int_pSolicitudId = 0, int int_pSolicitudVentaId = 0, int int_pSolicitudTipoId = 0, string? str_pSolicitudEstadoId = "", 
                                    int int_pSolicitudAgenciaId = 0, int int_pSolicitudAgenciaUsuarioId = 0)
        {
            await using (var connection = new SqlConnection(_connectionString))
            {
                Helpers GeneralAyuda = new Helpers();
                string str_pSolicitudIngresoInicio = "";
                string str_pSolicitudIngresoFin = "";
                if (dte_pSolicitudIngresoInicio != DateTime.Parse("0001-01-01"))
                    str_pSolicitudIngresoInicio = GeneralAyuda.TraerFechaFormatoServidorBD(dte_pSolicitudIngresoInicio);

                if (dte_pSolicitudIngresoFin != DateTime.Parse("0001-01-01"))
                    str_pSolicitudIngresoFin = GeneralAyuda.TraerFechaFormatoServidorBD(dte_pSolicitudIngresoFin);
                var parameters = new DynamicParameters();
                parameters.Add("@pORIGEN", str_pOrigen);
                parameters.Add("@pSOLICITUD_UsuarioId", int_pSolicitudUsuarioId);
                parameters.Add("@pSOLICITUD_FechaIngresoInicio", str_pSolicitudIngresoInicio);
                parameters.Add("@pSOLICITUD_FechaIngresoFin", str_pSolicitudIngresoFin);
                parameters.Add("@pSOLICITUD_Id", int_pSolicitudId);
                parameters.Add("@pSOLICITUD_VentaId", int_pSolicitudVentaId);
                parameters.Add("@pSOLICITUD_TipoId", int_pSolicitudTipoId);
                parameters.Add("@pSOLICITUD_EstadoId", str_pSolicitudEstadoId);
                parameters.Add("@pSOLICITUD_AgenciaId", int_pSolicitudAgenciaId);
                parameters.Add("@pSOLICITUD_AgenciaUsuarioId", int_pSolicitudAgenciaUsuarioId);
                var result = await connection.QueryAsync<BESolicitud>("Solicitud_Obtener", parameters,
                                        commandType: System.Data.CommandType.StoredProcedure);
                return result;
            }
        }
        public async Task<BEError> Solicitud_Rechazar(int int_pSolicitudId, int int_pSolicitudUsuarioId)
        {
            await using (var connection = new SqlConnection(_connectionString))
            {
                var parameters = new DynamicParameters();
                parameters.Add("@pSOLICITUD_Id", int_pSolicitudId);
                parameters.Add("@pSOLICITUD_Usuario", int_pSolicitudUsuarioId);
                var result = await connection.QueryFirstOrDefaultAsync<BEError>
                                        ("Solicitud_Rechazar", parameters,
                                        commandType: System.Data.CommandType.StoredProcedure);
                return result!;
            }
        }
    }
}
