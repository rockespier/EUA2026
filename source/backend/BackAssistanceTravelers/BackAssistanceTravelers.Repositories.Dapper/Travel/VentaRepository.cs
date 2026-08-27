using BackAssistanceTravelers.Models.Agencia;
using BackAssistanceTravelers.Models.Error;
using BackAssistanceTravelers.Models.Pasajero;
using BackAssistanceTravelers.Models.Usuario;
using BackAssistanceTravelers.Models.Venta;
using BackAssistanceTravelers.Repositories.Travel;
using Dapper;
using Microsoft.Data.SqlClient;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BackAssistanceTravelers.Repositories.Dapper.Travel
{
    public class VentaRepository : Repository, IVentaRepository
    {
        public VentaRepository(string connectionString) : base(connectionString)
        {
        }
        public async Task<IEnumerable<BEVenta>> Liquidacion_Obtener(string? str_pOrigen = "", DateTime dte_pVentaIngresoInicio = default, DateTime dte_pVentaIngresoFin = default,
                                int int_pVentaID = 0, int int_pUsuarioId = 0, string? str_pEstadoId = "", string? str_pSituacionId = "",
                                int int_pAgenciaId = 0, int int_pAgenciaUsuarioId = 0, string? str_pClienteNombres = "", string? str_pClienteApellidos = "",
                                int int_pPaisId = 0, string? str_pCodigoExterno = "", int int_pPromotorId = 0, int int_pDistritoId = 0, int int_pLiquidacionPendiente = 0,
                                int int_pEjecutivoCobradorId = 0)
        {
            await using (var connection = new SqlConnection(_connectionString))
            {
                Helpers GeneralAyuda = new Helpers();
                string str_vFechaValidoDesde = "";
                string str_vFechaValidoHasta = "";
                if (dte_pVentaIngresoInicio != DateTime.Parse("0001-01-01"))
                    str_vFechaValidoDesde = GeneralAyuda.TraerFechaFormatoServidorBD(dte_pVentaIngresoInicio);
                if (dte_pVentaIngresoFin != DateTime.Parse("0001-01-01"))
                    str_vFechaValidoHasta = GeneralAyuda.TraerFechaFormatoServidorBD(dte_pVentaIngresoFin);
                var parameters = new DynamicParameters();
                parameters.Add("@pORIGEN", str_pOrigen);
                parameters.Add("@pVENTA_FechaIngresoInicio", str_vFechaValidoDesde);
                parameters.Add("@pVENTA_FechaIngresoFin", str_vFechaValidoHasta);
                parameters.Add("@pVENTA_Id", int_pVentaID);
                parameters.Add("@pVENTA_UsuarioId", int_pUsuarioId);
                parameters.Add("@pVENTA_EstadoId", str_pEstadoId);
                parameters.Add("@pVENTA_SituacionId", str_pSituacionId);
                parameters.Add("@pVENTA_AgenciaId", int_pAgenciaId);
                parameters.Add("@pVENTA_AgenciaUsuarioId", int_pAgenciaUsuarioId);
                parameters.Add("@pVENTA_ClienteNombres", str_pClienteNombres);
                parameters.Add("@pVENTA_ClienteApellidos", str_pClienteApellidos);
                parameters.Add("@pVENTA_PaisId", int_pPaisId);
                parameters.Add("@pVENTA_CodigoExterno", str_pCodigoExterno);
                parameters.Add("@pAgenciaPromotorId", int_pPromotorId);
                parameters.Add("@pAgenciaUbigeoId", int_pDistritoId);
                parameters.Add("@pLiquidacionPendiente", int_pLiquidacionPendiente);
                parameters.Add("@pEjecutivoCobradorId", int_pEjecutivoCobradorId);
                var result = await connection.QueryAsync<BEVenta>
                                        ("Liquidacion_Obtener_2026", parameters,
                                        commandType: System.Data.CommandType.StoredProcedure, commandTimeout: 900);
                return result;
            }
        }
        public async Task<BEError> VentaCliente_Eliminar(int int_pVentaClienteID)
        {
            await using (var connection = new SqlConnection(_connectionString))
            {
                var parameters = new DynamicParameters();
                parameters.Add("@pVENTACLIENTE_Id", int_pVentaClienteID);
                var result = await connection.QueryFirstOrDefaultAsync<BEError>("VentaCliente_Eliminar", parameters,
                                        commandType: System.Data.CommandType.StoredProcedure);
                return result!;
            }
        }
        public async Task<IEnumerable<BEVenta>> VentaCliente_Obtener(int int_pVentaClienteVentaID)
        {
            await using (var connection = new SqlConnection(_connectionString))
            {
                var parameters = new DynamicParameters();
                parameters.Add("@pVENTACLIENTE_VentaId", int_pVentaClienteVentaID);
                var result = await connection.QueryAsync<BEVenta>
                                        ("VentaCliente_Obtener", parameters,
                                        commandType: System.Data.CommandType.StoredProcedure);
                return result;
            }
        }
        public async Task<BEError> VentaCliente_Procesar(BEVentaClienteParametro obj_pVentaCliente)
        {
            await using (var connection = new SqlConnection(_connectionString))
            {
                Helpers GeneralAyuda = new Helpers();
                string str_vFechaClienteFechaNacimiento = "";
                if (obj_pVentaCliente.ventaClienteFechaNacimiento != DateTime.Parse("0001-01-01"))
                    str_vFechaClienteFechaNacimiento = GeneralAyuda.TraerFechaFormatoServidorBD(obj_pVentaCliente.ventaClienteFechaNacimiento);
                var parameters = new DynamicParameters();
                parameters.Add("@pVENTACLIENTE_Id", obj_pVentaCliente.ventaClienteId);
                parameters.Add("@pVENTACLIENTE_VentaId", obj_pVentaCliente.ventaId);
                parameters.Add("@pVENTACLIENTE_DocumentoTipo", obj_pVentaCliente.ventaClienteDocumentoTipoId);
                parameters.Add("@pVENTACLIENTE_DocumentoNumero", obj_pVentaCliente.ventaClienteDocumentoNumero);
                parameters.Add("@pVENTACLIENTE_Nombres", obj_pVentaCliente.ventaClienteNombres!.ToString().ToUpper());
                parameters.Add("@pVENTACLIENTE_Apellidos", obj_pVentaCliente.ventaClienteApellidos!.ToString().ToUpper());
                parameters.Add("@pVENTACLIENTE_FechaNacimiento", str_vFechaClienteFechaNacimiento);
                parameters.Add("@pVENTACLIENTE_Edad", obj_pVentaCliente.ventaClienteEdad);
                parameters.Add("@pVENTACLIENTE_Email", obj_pVentaCliente.ventaClienteEmail);
                parameters.Add("@pVENTACLIENTE_Direccion", obj_pVentaCliente.ventaClienteDireccion!.ToString().ToUpper());
                parameters.Add("@pVENTACLIENTE_Telefono", obj_pVentaCliente.ventaClienteTelefono);
                parameters.Add("@pVENTACLIENTE_Distrito", obj_pVentaCliente.ventaClienteDistrito!.ToString().ToUpper());
                parameters.Add("@pVENTACLIENTE_Ciudad", obj_pVentaCliente.ventaClienteCiudad!.ToString().ToUpper());
                parameters.Add("@pVENTACLIENTE_Pais", obj_pVentaCliente.ventaClientePais!.ToString().ToUpper());
                parameters.Add("@pVENTACLIENTE_Nacionalidad", obj_pVentaCliente.VentaNacionalidad!.ToString().ToUpper());
                var result = await connection.QueryFirstOrDefaultAsync<BEError>("VentaCliente_Procesar", parameters,
                                        commandType: System.Data.CommandType.StoredProcedure);
                return result!;
            }
        }
        public async Task<BEError> VentaCodigoExterno_Validar(string? str_pCodigoExterno)
        {
            await using (var connection = new SqlConnection(_connectionString))
            {
                var parameters = new DynamicParameters();
                parameters.Add("@pCodigo_Externo", str_pCodigoExterno);
                var result = await connection.QueryFirstOrDefaultAsync<BEError>("CodigoExterno_ValidaExistencia", parameters,
                                        commandType: System.Data.CommandType.StoredProcedure);
                return result!;
            }
        }
        public async Task<BEError> VentaGestionIncentivos_Procesar(BEVenta obj_pVenta)
        {
            await using (var connection = new SqlConnection(_connectionString))
            {
                Helpers GeneralAyuda = new Helpers();
                string str_vFechaIncentivoFechaPago = "";
                if (obj_pVenta.ventaIncentivoFechaPago != DateTime.Parse("0001-01-01"))
                    str_vFechaIncentivoFechaPago = GeneralAyuda.TraerFechaFormatoServidorBD(obj_pVenta.ventaIncentivoFechaPago);

                var parameters = new DynamicParameters();
                parameters.Add("@pVENTA_Id", obj_pVenta.ventaId);
                parameters.Add("@pVENTA_Observacion", obj_pVenta.ventaObservacion);
                parameters.Add("@pVENTA_IncentivoPost", obj_pVenta.ventaIncentivoPostImporte);
                parameters.Add("@pVENTA_IncentivoFechaPago", str_vFechaIncentivoFechaPago);
                parameters.Add("@pVENTA_IncentivoModificadoUsuario", obj_pVenta.ventaCreadoUsuarioId);
                var result = await connection.QueryFirstOrDefaultAsync<BEError>("Venta_ActualizarGestionIncentivos", parameters,
                                        commandType: System.Data.CommandType.StoredProcedure);
                return result!;
            }
        }
        public async Task<IEnumerable<BEVenta>> VentaGrupalWEB_Procesar(BEVenta obj_pVenta)
        {
            await using (var connection = new SqlConnection(_connectionString))
            {
                Helpers GeneralAyuda = new Helpers();
                string str_vFechaFechaVigenciaInicio = "";
                string str_vFechaFechaVigenciaFin = "";
                if (obj_pVenta.ventaFechaVigenciaInicio != DateTime.Parse("0001-01-01"))
                    str_vFechaFechaVigenciaInicio = GeneralAyuda.TraerFechaFormatoServidorBD(obj_pVenta.ventaFechaVigenciaInicio);
                if (obj_pVenta.ventaFechaVigenciaFin != DateTime.Parse("0001-01-01"))
                    str_vFechaFechaVigenciaFin = GeneralAyuda.TraerFechaFormatoServidorBD(obj_pVenta.ventaFechaVigenciaFin);

                var parameters = new DynamicParameters();
                parameters.Add("@pVENTA_GrupalId", obj_pVenta.ventaGrupalId);
                parameters.Add("@pVENTA_UsuarioOrigen", obj_pVenta.ventaUsuarioOrigen);
                parameters.Add("@pVENTA_UsuarioAgenciaId", obj_pVenta.ventaUsuarioAgenciaId);
                parameters.Add("@pVENTA_FechaVigenciaInicio", str_vFechaFechaVigenciaInicio);
                parameters.Add("@pVENTA_FechaVigenciaFin", str_vFechaFechaVigenciaFin);
                parameters.Add("@pVENTA_NumeroDias", obj_pVenta.ventaNumeroDias);
                parameters.Add("@pVENTA_Destino", obj_pVenta.ventaDestino!.ToString().ToUpper());
                parameters.Add("@pVENTA_ProductoId", obj_pVenta.ventaProductoId);
                parameters.Add("@pVENTA_ProductoImporte", obj_pVenta.ventaProductoImporte);
                parameters.Add("@pVENTA_ContactoNombres", obj_pVenta.ventaContactoNombres!.ToString().ToUpper());
                parameters.Add("@pVENTA_ContactoDireccion", obj_pVenta.ventaContactoDireccion!.ToString().ToUpper());
                parameters.Add("@pVENTA_ContactoEmail", obj_pVenta.ventaContactoEmail);
                parameters.Add("@pVENTA_ContactoTelefono", obj_pVenta.ventaContactoTelefono);
                parameters.Add("@pVENTA_ContactoDistrito", obj_pVenta.ventaContactoDistrito!.ToString().ToUpper());
                parameters.Add("@pVENTA_ContactoPais", obj_pVenta.ventaContactoPais!.ToString().ToUpper());
                parameters.Add("@pVENTA_ImporteVenta", obj_pVenta.ventaImporteVenta);
                parameters.Add("@pVENTA_Usuario", obj_pVenta.ventaCreadoUsuarioId);
                parameters.Add("@pVENTA_Counter", obj_pVenta.ventaCounter);
                parameters.Add("@pVENTA_Observacion", obj_pVenta.ventaObservacion);
                parameters.Add("@pVENTA_Situacion", obj_pVenta.ventaSituacionId);
                var result = await connection.QueryAsync<BEVenta>("VentaGrupalWEB_Procesar", parameters,
                                        commandType: System.Data.CommandType.StoredProcedure);
                return result!;
            }
        }
        public async Task<IEnumerable<BEVenta>> VentaGrupal_Lista(int intVentaGrupalId)
        {
            await using (var connection = new SqlConnection(_connectionString))
            {
                var parameters = new DynamicParameters();
                parameters.Add("@pVENTA_GrupalId", intVentaGrupalId);
                var result = await connection.QueryAsync<BEVenta>("VentaGrupal_Lista", parameters,
                                        commandType: System.Data.CommandType.StoredProcedure);
                return result!;
            }
        }
        public async Task<BEError> VentaGrupal_Procesar(BEVentaParametro obj_pVenta)
        {
            await using (var connection = new SqlConnection(_connectionString))
            {
                Helpers GeneralAyuda = new Helpers();
                string str_vFechaFechaVigenciaInicio = "";
                string str_vFechaFechaVigenciaFin = "";
                if (obj_pVenta.ventaFechaVigenciaInicio != DateTime.Parse("0001-01-01"))
                    str_vFechaFechaVigenciaInicio = GeneralAyuda.TraerFechaFormatoServidorBD(obj_pVenta.ventaFechaVigenciaInicio);
                if (obj_pVenta.ventaFechaVigenciaFin != DateTime.Parse("0001-01-01"))
                    str_vFechaFechaVigenciaFin = GeneralAyuda.TraerFechaFormatoServidorBD(obj_pVenta.ventaFechaVigenciaFin);

                var parameters = new DynamicParameters();
                parameters.Add("@pVENTA_GrupalId", obj_pVenta.ventaGrupalId);
                parameters.Add("@pVENTA_UsuarioOrigen", obj_pVenta.ventaUsuarioOrigen);
                parameters.Add("@pVENTA_UsuarioAgenciaId", obj_pVenta.ventaUsuarioAgenciaId);
                parameters.Add("@pVENTA_FechaVigenciaInicio", str_vFechaFechaVigenciaInicio);
                parameters.Add("@pVENTA_FechaVigenciaFin", str_vFechaFechaVigenciaFin);
                parameters.Add("@pVENTA_NumeroDias", obj_pVenta.ventaNumeroDias);
                parameters.Add("@pVENTA_Destino", obj_pVenta.ventaDestino!.ToString().ToUpper());
                parameters.Add("@pVENTA_Origen", obj_pVenta.ventaOrigen?.ToUpper());
                parameters.Add("@pVENTA_ProductoId", obj_pVenta.ventaProductoId);
                parameters.Add("@pVENTA_ProductoImporte", obj_pVenta.ventaProductoImporte, DbType.Decimal, precision: 18, scale: 4);
                parameters.Add("@pVENTA_ContactoNombres", obj_pVenta.ventaContactoNombres!.ToString().ToUpper());
                parameters.Add("@pVENTA_ContactoDireccion", obj_pVenta.ventaContactoDireccion!.ToString().ToUpper());
                parameters.Add("@pVENTA_ContactoEmail", obj_pVenta.ventaContactoEmail);
                parameters.Add("@pVENTA_ContactoTelefono", obj_pVenta.ventaContactoTelefono);
                parameters.Add("@pVENTA_ContactoDistrito", obj_pVenta.ventaContactoDistrito!.ToString().ToUpper());
                parameters.Add("@pVENTA_ContactoPais", obj_pVenta.ventaContactoPais!.ToString().ToUpper());
                parameters.Add("@pVENTA_ImporteVenta", obj_pVenta.ventaImporteVenta, DbType.Decimal, precision: 18, scale: 4);
                parameters.Add("@pVENTA_Usuario", obj_pVenta.ventaCreadoUsuarioId);
                parameters.Add("@pVENTA_Counter", obj_pVenta.ventaCounter);
                parameters.Add("@pVENTA_Observacion", obj_pVenta.ventaObservacion);
                parameters.Add("@pVENTA_PromocionId", obj_pVenta.ventaPromocionId);
                parameters.Add("@pVENTA_Origen", obj_pVenta.ventaOrigen == null ? "" : obj_pVenta.ventaOrigen);
                var result = await connection.QueryFirstOrDefaultAsync<BEError>("VentaGrupal_Procesar_2026", parameters,
                                        commandType: System.Data.CommandType.StoredProcedure);
                return result!;
            }
        }
        public async Task<BEError> VentaGrupal_Verificar_Situacion(int intVentaGrupalId)
        {
            await using (var connection = new SqlConnection(_connectionString))
            {
                var parameters = new DynamicParameters();
                parameters.Add("@pVENTA_Id", intVentaGrupalId);
                //AQUI
                var result = await connection.QueryFirstOrDefaultAsync<BEError>("Venta_VerificarSituacion", parameters,
                                        commandType: System.Data.CommandType.StoredProcedure);
                return result!;
            }
        }
        public async Task<IEnumerable<BEVenta>> VentaMasivaATV_ProcesarConsultar(int int_pVentaMasivaId)
        {
            await using (var connection = new SqlConnection(_connectionString))
            {
                var parameters = new DynamicParameters();
                parameters.Add("@pVENTA_MasivoId", int_pVentaMasivaId);
                var result = await connection.QueryAsync<BEVenta>("VentaMasivaATV_ProcesarConsultarNuevo", parameters,
                                        commandType: System.Data.CommandType.StoredProcedure);
                return result!;
            }
        }

        public async Task<BEError> VentaMasiva_Procesar(BEVenta obj_pVenta)
        {
            await using (var connection = new SqlConnection(_connectionString))
            {
                Helpers GeneralAyuda = new Helpers();
                string str_vFechaFechaVigenciaInicio = "";
                string str_vFechaFechaVigenciaFin = "";
                string str_vFechaClienteFechaNacimiento = "";
                if (obj_pVenta.ventaFechaVigenciaInicio != DateTime.Parse("0001-01-01"))
                    str_vFechaFechaVigenciaInicio = GeneralAyuda.TraerFechaFormatoServidorBD(obj_pVenta.ventaFechaVigenciaInicio);
                if (obj_pVenta.ventaFechaVigenciaFin != DateTime.Parse("0001-01-01"))
                    str_vFechaFechaVigenciaFin = GeneralAyuda.TraerFechaFormatoServidorBD(obj_pVenta.ventaFechaVigenciaFin);
                if (obj_pVenta.ventaClienteFechaNacimiento != DateTime.Parse("0001-01-01"))
                    str_vFechaClienteFechaNacimiento = GeneralAyuda.TraerFechaFormatoServidorBD(obj_pVenta.ventaClienteFechaNacimiento);

                var parameters = new DynamicParameters();
                parameters.Add("@pVENTA_MasivoId", obj_pVenta.ventaGrupalId);
                parameters.Add("@pVENTA_FechaVigenciaInicio", str_vFechaFechaVigenciaInicio);
                parameters.Add("@pVENTA_FechaVigenciaFin", str_vFechaFechaVigenciaFin);
                parameters.Add("@pVENTA_Destino", obj_pVenta.ventaDestino);
                parameters.Add("@pVENTA_Origen", obj_pVenta.ventaOrigen);
                parameters.Add("@pProductoATVCodigo", obj_pVenta.productoATVCodigo);
                parameters.Add("@pVENTA_AgenciaLogin", obj_pVenta.ventaUsuarioAgenciaNombre);
                parameters.Add("@pVENTA_AgenciaUsuarioLogin", obj_pVenta.ventaCreadoUsuarioNombre);
                parameters.Add("@pVENTA_Counter", obj_pVenta.ventaCounter);
                parameters.Add("@pVENTA_ClienteDocumentoTipo", obj_pVenta.ventaClienteDocumentoTipoId);
                parameters.Add("@pVENTA_ClienteDocumentoNumero", obj_pVenta.ventaClienteDocumentoNumero);
                parameters.Add("@pVENTA_ClienteNombres", obj_pVenta.ventaClienteNombres!.ToString().ToUpper());
                parameters.Add("@pVENTA_ClienteApellidos", obj_pVenta.ventaClienteApellidos!.ToString().ToUpper());
                parameters.Add("@pVENTA_ClienteFechaNacimiento", str_vFechaClienteFechaNacimiento);
                parameters.Add("@pVENTA_ClienteEmail", obj_pVenta.ventaClienteEmail);
                parameters.Add("@pVENTA_ClienteDireccion", obj_pVenta.ventaClienteDireccion!.ToString().ToUpper());
                parameters.Add("@pVENTA_ClienteTelefono", obj_pVenta.ventaClienteTelefono);
                parameters.Add("@pVENTA_ClienteDistrito", obj_pVenta.ventaClienteDistrito!.ToString().ToUpper());
                parameters.Add("@pVENTA_ClienteCiudad", obj_pVenta.ventaClienteCiudad!.ToString().ToUpper());
                parameters.Add("@pVENTA_ClientePais", obj_pVenta.ventaClientePais!.ToString().ToUpper());
                parameters.Add("@pVENTA_ContactoNombres", obj_pVenta.ventaContactoNombres!.ToString().ToUpper());
                parameters.Add("@pVENTA_ContactoDireccion", obj_pVenta.ventaContactoDireccion!.ToString().ToUpper());
                parameters.Add("@pVENTA_ContactoEmail", obj_pVenta.ventaContactoEmail);
                parameters.Add("@pVENTA_ContactoTelefono", obj_pVenta.ventaContactoTelefono);
                parameters.Add("@pVENTA_ContactoDistrito", obj_pVenta.ventaContactoDistrito!.ToString().ToUpper());
                parameters.Add("@pVENTA_ContactoPais", obj_pVenta.ventaContactoPais!.ToString().ToUpper());
                parameters.Add("@pVENTA_CodigoExterno", obj_pVenta.ventaCodigoExterno == null ? "" : obj_pVenta.ventaCodigoExterno);
                parameters.Add("@pVENTA_Clientenacionalidad", obj_pVenta.VentaNacionalidad == null ? "" : obj_pVenta.VentaNacionalidad);
                parameters.Add("@pVENTA_Origen", obj_pVenta.ventaOrigen == null ? "" : obj_pVenta.ventaOrigen);
                var result = await connection.QueryFirstOrDefaultAsync<BEError>("VentaMasiva_ProcesarNuevo_2026", parameters,
                                        commandType: System.Data.CommandType.StoredProcedure);
                return result!;
            }
        }
        public async Task<IEnumerable<BEVenta>> VentaMasiva_ProcesarConsultar(int int_pVentaMasivaId)
        {
            await using (var connection = new SqlConnection(_connectionString))
            {
                var parameters = new DynamicParameters();
                parameters.Add("@pVENTA_MasivoId", int_pVentaMasivaId);
                var result = await connection.QueryAsync<BEVenta>("VentaMasiva_ProcesarConsultarNuevo", parameters,
                                        commandType: System.Data.CommandType.StoredProcedure);
                return result!;
            }
        }
        public async Task<IEnumerable<BEVenta>> VentaObtenerVoucherCancelada(string? int_pVentaId, string? str_Apellidos, string? strBasedeDatos = "O")
        {
            await using (var connection = new SqlConnection(_connectionString))
            {
                var parameters = new DynamicParameters();
                parameters.Add("@pIDVoucher", int_pVentaId);
                parameters.Add("@pApellidos", str_Apellidos);
                var result = await connection.QueryAsync<BEVenta>("VentaCancelada_Detalle", parameters,
                                        commandType: System.Data.CommandType.StoredProcedure);
                return result!;
            }
        }
        public async Task<IEnumerable<BEVenta>> VentaObtenerVoucherPendiente(int int_pVentaId)
        {
            await using (var connection = new SqlConnection(_connectionString))
            {
                var parameters = new DynamicParameters();
                parameters.Add("@pIDVoucher", int_pVentaId);
                var result = await connection.QueryAsync<BEVenta>("VentaPendiente_Detalle", parameters,
                                        commandType: System.Data.CommandType.StoredProcedure);
                return result!;
            }
        }
        public async Task<IEnumerable<BEVenta>> VentaPromo_Procesar(BEVenta obj_pVenta)
        {
            await using (var connection = new SqlConnection(_connectionString))
            {
                Helpers GeneralAyuda = new Helpers();
                string str_vFechaFechaVigenciaInicio = "";
                string str_vFechaFechaVigenciaFin = "";
                if (obj_pVenta.ventaFechaVigenciaInicio != DateTime.Parse("0001-01-01"))
                    str_vFechaFechaVigenciaInicio = GeneralAyuda.TraerFechaFormatoServidorBD(obj_pVenta.ventaFechaVigenciaInicio);
                if (obj_pVenta.ventaFechaVigenciaFin != DateTime.Parse("0001-01-01"))
                    str_vFechaFechaVigenciaFin = GeneralAyuda.TraerFechaFormatoServidorBD(obj_pVenta.ventaFechaVigenciaFin);
                var parameters = new DynamicParameters();
                parameters.Add("@pVENTA_GrupalId", obj_pVenta.ventaGrupalId);
                parameters.Add("@pVENTA_FechaVigenciaInicio", str_vFechaFechaVigenciaInicio);
                parameters.Add("@pVENTA_FechaVigenciaFin", str_vFechaFechaVigenciaFin);
                parameters.Add("@pVENTA_UsuarioOrigen", obj_pVenta.ventaUsuarioOrigen);
                parameters.Add("@pVENTA_UsuarioAgenciaId", obj_pVenta.ventaUsuarioAgenciaId);
                parameters.Add("@pVENTA_NumeroDias", obj_pVenta.ventaNumeroDias);
                parameters.Add("@pVENTA_Destino", obj_pVenta.ventaDestino);
                parameters.Add("@pVENTA_ProductoId", obj_pVenta.ventaProductoId);
                parameters.Add("@pVENTA_ProductoImporte", obj_pVenta.ventaProductoImporte);
                parameters.Add("@pVENTA_ContactoNombres", obj_pVenta.ventaContactoNombres!.ToString().ToUpper());
                parameters.Add("@pVENTA_ContactoDireccion", obj_pVenta.ventaContactoDireccion!.ToString().ToUpper());
                parameters.Add("@pVENTA_ContactoEmail", obj_pVenta.ventaContactoEmail);
                parameters.Add("@pVENTA_ContactoTelefono", obj_pVenta.ventaContactoTelefono);
                parameters.Add("@pVENTA_ContactoDistrito", obj_pVenta.ventaContactoDistrito!.ToString().ToUpper());
                parameters.Add("@pVENTA_ContactoPais", obj_pVenta.ventaContactoPais!.ToString().ToUpper());
                parameters.Add("@pVENTA_ImporteVenta", obj_pVenta.ventaImporteVenta);
                parameters.Add("@pVENTA_Usuario", obj_pVenta.ventaCreadoUsuarioId);
                parameters.Add("@pVENTA_Counter", obj_pVenta.ventaCounter);
                parameters.Add("@pVENTA_PromocionId", obj_pVenta.ventaPromocionId);
                var result = await connection.QueryAsync<BEVenta>("VentaPromo_Procesar", parameters,
                                        commandType: System.Data.CommandType.StoredProcedure);
                return result!;
            }
        }
        public async Task<IEnumerable<BEVenta>> Ventas_Obtener(string? str_pOrigen = "", DateTime dte_pVentaIngresoInicio = default, DateTime dte_pVentaIngresoFin = default,
                    int int_pVentaID = 0, int int_pUsuarioId = 0, string? str_pEstadoId = "", string? str_pSituacionId = "", int int_pAgenciaId = 0,
                    int int_pAgenciaUsuarioId = 0, string? str_pClienteNombres = "", string? str_pClienteApellidos = "", int int_pPaisId = 0,
                    string? str_pCodigoExterno = "", string? str_pTipoDoc = "", string? str_pNumeDoc = "")
        {
            await using (var connection = new SqlConnection(_connectionString))
            {
                Helpers GeneralAyuda = new Helpers();
                string str_vFechaFechaVigenciaInicio = "";
                string str_vFechaFechaVigenciaFin = "";
                if (dte_pVentaIngresoInicio != DateTime.Parse("1900-01-01"))
                    str_vFechaFechaVigenciaInicio = GeneralAyuda.TraerFechaFormatoServidorBD(dte_pVentaIngresoInicio);
                if (dte_pVentaIngresoFin != DateTime.Parse("1900-01-01"))
                    str_vFechaFechaVigenciaFin = GeneralAyuda.TraerFechaFormatoServidorBD(dte_pVentaIngresoFin);
                var parameters = new DynamicParameters();
                parameters.Add("@pORIGEN", str_pOrigen);
                parameters.Add("@pVENTA_FechaIngresoInicio", str_vFechaFechaVigenciaInicio);
                parameters.Add("@pVENTA_FechaIngresoFin", str_vFechaFechaVigenciaFin);
                parameters.Add("@pVENTA_Id", int_pVentaID);
                parameters.Add("@pVENTA_UsuarioId", int_pUsuarioId);
                parameters.Add("@pVENTA_EstadoId", str_pEstadoId);
                parameters.Add("@pVENTA_SituacionId", str_pSituacionId);
                parameters.Add("@pVENTA_AgenciaId", int_pAgenciaId);
                parameters.Add("@pVENTA_AgenciaUsuarioId", int_pAgenciaUsuarioId);
                parameters.Add("@pVENTA_ClienteNombres", str_pClienteNombres);
                parameters.Add("@pVENTA_ClienteApellidos", str_pClienteApellidos);
                parameters.Add("@pVENTA_PaisId", int_pPaisId);
                parameters.Add("@pVENTA_CodigoExterno", str_pCodigoExterno);
                parameters.Add("@pVENTA_ClienteDocumentoTipoId", str_pTipoDoc);
                parameters.Add("@pVENTA_ClienteDocumentoNumero", str_pNumeDoc);

                var result = await connection.QueryAsync<BEVenta>("Venta_Obtener_2026", parameters,
                                        commandType: System.Data.CommandType.StoredProcedure, commandTimeout: 900);
                return result!;
            }
        }
        public async Task<BEError> Ventas_Procesar(BEVenta obj_pVenta)
        {
            await using (var connection = new SqlConnection(_connectionString))
            {
                Helpers GeneralAyuda = new Helpers();
                string str_vFechaFechaVigenciaInicio = "";
                string str_vFechaFechaVigenciaFin = "";
                string str_vFechaClienteFechaNacimiento = "";
                if (obj_pVenta.ventaFechaVigenciaInicio != DateTime.Parse("0001-01-01"))
                    str_vFechaFechaVigenciaInicio = GeneralAyuda.TraerFechaFormatoServidorBD(obj_pVenta.ventaFechaVigenciaInicio);
                if (obj_pVenta.ventaFechaVigenciaFin != DateTime.Parse("0001-01-01"))
                    str_vFechaFechaVigenciaFin = GeneralAyuda.TraerFechaFormatoServidorBD(obj_pVenta.ventaFechaVigenciaFin);
                if (obj_pVenta.ventaClienteFechaNacimiento != DateTime.Parse("0001-01-01"))
                    str_vFechaClienteFechaNacimiento = GeneralAyuda.TraerFechaFormatoServidorBD(obj_pVenta.ventaClienteFechaNacimiento);
                var parameters = new DynamicParameters();
                parameters.Add("@pVENTA_Id", obj_pVenta.ventaId);
                parameters.Add("@pVENTA_UsuarioOrigen", obj_pVenta.ventaUsuarioOrigen);
                parameters.Add("@pVENTA_UsuarioAgenciaId", obj_pVenta.ventaUsuarioAgenciaId);
                parameters.Add("@pVENTA_FechaVigenciaInicio", str_vFechaFechaVigenciaInicio);
                parameters.Add("@pVENTA_FechaVigenciaFin", str_vFechaFechaVigenciaFin);
                parameters.Add("@pVENTA_NumeroDias", obj_pVenta.ventaNumeroDias);
                parameters.Add("@pVENTA_Destino", obj_pVenta.ventaDestino);
                parameters.Add("@pVENTA_ProductoId", obj_pVenta.ventaProductoId);
                parameters.Add("@pVENTA_ProductoImporte", obj_pVenta.ventaProductoImporte);
                parameters.Add("@pVENTA_ClienteDocumentoTipo", obj_pVenta.ventaClienteDocumentoTipoId);
                parameters.Add("@pVENTA_ClienteDocumentoNumero", obj_pVenta.ventaClienteDocumentoNumero);
                parameters.Add("@pVENTA_ClienteNombres", obj_pVenta.ventaClienteNombres!.ToString().ToUpper());
                parameters.Add("@pVENTA_ClienteApellidos", obj_pVenta.ventaClienteApellidos!.ToString().ToUpper());
                parameters.Add("@pVENTA_ClienteFechaNacimiento", str_vFechaClienteFechaNacimiento);
                parameters.Add("@pVENTA_ClienteEmail", obj_pVenta.ventaClienteEmail);
                parameters.Add("@pVENTA_ClienteDireccion", obj_pVenta.ventaClienteDireccion!.ToString().ToUpper());
                parameters.Add("@pVENTA_ClienteTelefono", obj_pVenta.ventaClienteTelefono);
                parameters.Add("@pVENTA_ClienteDistrito", obj_pVenta.ventaClienteDistrito!.ToString().ToUpper());
                parameters.Add("@pVENTA_ClienteCiudad", obj_pVenta.ventaClienteCiudad!.ToString().ToUpper());
                parameters.Add("@pVENTA_ClientePais", obj_pVenta.ventaClientePais!.ToString().ToUpper());
                parameters.Add("@pVENTA_ContactoNombres", obj_pVenta.ventaContactoNombres!.ToString().ToUpper());
                parameters.Add("@pVENTA_ContactoDireccion", obj_pVenta.ventaContactoDireccion!.ToString().ToUpper());
                parameters.Add("@pVENTA_ContactoEmail", obj_pVenta.ventaContactoEmail);
                parameters.Add("@pVENTA_ContactoTelefono", obj_pVenta.ventaContactoTelefono);
                parameters.Add("@pVENTA_ContactoDistrito", obj_pVenta.ventaContactoDistrito!.ToString().ToUpper());
                parameters.Add("@pVENTA_ContactoPais", obj_pVenta.ventaContactoPais!.ToString().ToUpper());
                parameters.Add("@pVENTA_ImporteVenta", obj_pVenta.ventaImporteVenta);
                parameters.Add("@pVENTA_Usuario", obj_pVenta.ventaCreadoUsuarioId);
                parameters.Add("@pVENTA_Counter", obj_pVenta.ventaCounter);
                parameters.Add("@pVENTA_Cupon", obj_pVenta.ventaCupon);
                parameters.Add("@pVENTA_Clientenacionalidad", obj_pVenta.VentaNacionalidad == null ? "" : obj_pVenta.VentaNacionalidad);
                var result = await connection.QueryFirstOrDefaultAsync<BEError>("Venta_ProcesarNuevo", parameters,
                                        commandType: System.Data.CommandType.StoredProcedure);
                return result!;
            }
        }
        public async Task<BEError> Ventas_Validar(DateTime dte_pVentaIngresoInicio, DateTime dte_pVentaIngresoFin, int int_pVentaID, int int_pUsuarioId = 0, string? str_pEstadoId = "", string? str_pSituacionId = "", int int_pAgenciaId = 0, int int_pAgenciaUsuarioId = 0, string? str_pClienteNombres = "", string? str_pClienteApellidos = "", int int_pPaisId = 0, string? str_pCodigoExterno = "")
        {
            await using (var connection = new SqlConnection(_connectionString))
            {
                Helpers GeneralAyuda = new Helpers();
                string str_pVentaIngresoInicio = "";
                string str_pVentaIngresoFin = "";
                if (dte_pVentaIngresoInicio != DateTime.Parse("0001-01-01"))
                    str_pVentaIngresoInicio = GeneralAyuda.TraerFechaFormatoServidorBD(dte_pVentaIngresoInicio);
                if (dte_pVentaIngresoFin != DateTime.Parse("0001-01-01"))
                    str_pVentaIngresoFin = GeneralAyuda.TraerFechaFormatoServidorBD(dte_pVentaIngresoFin);
                var parameters = new DynamicParameters();
                parameters.Add("@pVENTA_FechaIngresoInicio", str_pVentaIngresoInicio);
                parameters.Add("@pVENTA_FechaIngresoFin", str_pVentaIngresoFin);
                parameters.Add("@pVENTA_Id", int_pVentaID);
                parameters.Add("@pVENTA_UsuarioId", int_pUsuarioId);
                parameters.Add("@pVENTA_EstadoId", str_pEstadoId);
                parameters.Add("@pVENTA_SituacionId", str_pSituacionId);
                parameters.Add("@pVENTA_AgenciaId", int_pAgenciaId);
                parameters.Add("@pVENTA_AgenciaUsuarioId", int_pAgenciaUsuarioId);
                parameters.Add("@pVENTA_ClienteNombres", str_pClienteNombres);
                parameters.Add("@pVENTA_ClienteApellidos", str_pClienteApellidos);
                parameters.Add("@pVENTA_PaisId", int_pPaisId);
                parameters.Add("@pVENTA_CodigoExterno", str_pCodigoExterno);
                var result = await connection.QueryFirstOrDefaultAsync<BEError>("Venta_Validar", parameters,
                                        commandType: System.Data.CommandType.StoredProcedure);
                return result!;
            }
        }
        public async Task<BEError> VentaWEB_Situacion_Actualizar(int int_pVentaID, int int_IDUsuario)
        {
            await using (var connection = new SqlConnection(_connectionString))
            {
                var parameters = new DynamicParameters();
                parameters.Add("@pIDGrupo", int_pVentaID);
                parameters.Add("@pUsuario", int_IDUsuario);
                //validar
                var result = await connection.QueryFirstOrDefaultAsync<BEError>("VentaGrupoSituacionWEB_Actualizar", parameters,
                                        commandType: System.Data.CommandType.StoredProcedure);
                return result!;
            }
        }
        public async Task<BEError> Venta_Anular(int int_pVentaID)
        {
            await using (var connection = new SqlConnection(_connectionString))
            {
                var parameters = new DynamicParameters();
                parameters.Add("@pVENTA_Id", int_pVentaID);
                var result = await connection.QueryFirstOrDefaultAsync<BEError>("Venta_Anular", parameters,
                                        commandType: System.Data.CommandType.StoredProcedure);
                return result!;
            }
        }

        public async Task<BEError> Venta_CancelarExtornar(int int_pVentaID, string? int_pVentaSituacionId)
        {
            await using (var connection = new SqlConnection(_connectionString))
            {
                var parameters = new DynamicParameters();
                parameters.Add("@pVENTA_Id", int_pVentaID);
                parameters.Add("@pVENTA_SituacionId", int_pVentaSituacionId);
                var result = await connection.QueryFirstOrDefaultAsync<BEError>("Venta_CancelarExtornar", parameters,
                                        commandType: System.Data.CommandType.StoredProcedure);
                return result!;
            }
        }
        public async Task<BEError> Venta_CuponValidar(string? int_pVentaCupon, string str_pVentaClienteDocumentoTipo, string? str_pVentaClienteDocumentoNumero, int int_DiasViaje = 0, int int_AgenciaID = 0)
        {
            await using (var connection = new SqlConnection(_connectionString))
            {
                var parameters = new DynamicParameters();
                parameters.Add("@pVENTA_Cupon", int_pVentaCupon);
                parameters.Add("@pVENTA_ClienteDocumentoTipo", str_pVentaClienteDocumentoTipo);
                parameters.Add("@pVENTA_ClienteDocumentoNumero", str_pVentaClienteDocumentoNumero);
                parameters.Add("@pVENTA_DiasViaje", int_DiasViaje);
                parameters.Add("@pVENTA_AgenciaID", int_AgenciaID);
                var result = await connection.QueryFirstOrDefaultAsync<BEError>("Venta_CuponValidar", parameters,
                                        commandType: System.Data.CommandType.StoredProcedure);
                return result!;
            }
        }
        public async Task<BEError> Venta_Grupal_Actualizar(int int_pVentaGrupalID, int int_IDUsuario)
        {
            await using (var connection = new SqlConnection(_connectionString))
            {
                var parameters = new DynamicParameters();
                parameters.Add("@pIDVentaGrupal", int_pVentaGrupalID);
                parameters.Add("@pUsuario", int_IDUsuario);
                var result = await connection.QueryFirstOrDefaultAsync<BEError>("VentaGrupal_Actualizar_Situacion", parameters,
                                        commandType: System.Data.CommandType.StoredProcedure);
                return result!;
            }
        }
        public async Task<IEnumerable<BEVenta>> Venta_ObtenerCliente(string? str_pVentaClienteDocumentoTipoId, string? str_pVentaClienteDocumentoNumero)
        {
            await using (var connection = new SqlConnection(_connectionString))
            {
                var parameters = new DynamicParameters();
                parameters.Add("@pVENTA_ClienteDocumentoTipoId", str_pVentaClienteDocumentoTipoId);
                parameters.Add("@pVENTA_ClienteDocumentoNumero", str_pVentaClienteDocumentoNumero);
                var result = await connection.QueryAsync<BEVenta>("Venta_ObtenerCliente", parameters,
                                        commandType: System.Data.CommandType.StoredProcedure);
                return result!;
            }
        }
        public async Task<IEnumerable<BEVenta>> Venta_ObtenerCorreo(int int_pVentaID = 0)
        {
            await using (var connection = new SqlConnection(_connectionString))
            {
                var parameters = new DynamicParameters();
                parameters.Add("@pVENTA_Id", int_pVentaID);
                var result = await connection.QueryAsync<BEVenta>("Venta_ObtenerCorreo", parameters,
                                        commandType: System.Data.CommandType.StoredProcedure);
                return result!;
            }
        }
        public async Task<IEnumerable<BEVenta>> Venta_ObtenerGestionIncentivos(int int_pVentaId)
        {
            await using (var connection = new SqlConnection(_connectionString))
            {
                var parameters = new DynamicParameters();
                parameters.Add("@pVENTA_Id", int_pVentaId);
                var result = await connection.QueryAsync<BEVenta>("Venta_ObtenerGestionIncentivos", parameters,
                                        commandType: System.Data.CommandType.StoredProcedure);
                return result!;
            }
        }
        public async Task<IEnumerable<BEPasajero>> Venta_ObtenerPasajero(string? str_pVentaClienteDocumentoTipoId, string? str_pVentaClienteDocumentoNumero,
            DateTime dte_pVentaIngresoInicio = default, DateTime dte_pVentaIngresoFin = default)
        {
            await using (var connection = new SqlConnection(_connectionString))
            {
                Helpers GeneralAyuda = new Helpers();
                string str_vFechaValidoDesde = "";
                string str_vFechaValidoHasta = "";
                if (dte_pVentaIngresoInicio != DateTime.Parse("0001-01-01"))
                    str_vFechaValidoDesde = GeneralAyuda.TraerFechaFormatoServidorBD(dte_pVentaIngresoInicio);
                if (dte_pVentaIngresoFin != DateTime.Parse("0001-01-01"))
                    str_vFechaValidoHasta = GeneralAyuda.TraerFechaFormatoServidorBD(dte_pVentaIngresoFin);
                var parameters = new DynamicParameters();
                parameters.Add("@pPasajero_DocumentoTipo", str_pVentaClienteDocumentoTipoId);
                parameters.Add("@pPasajero_DocumentoNumero", str_pVentaClienteDocumentoNumero);
                parameters.Add("@pFechaIngresoInicio", str_vFechaValidoDesde);
                parameters.Add("@pFechaIngresoFin", str_vFechaValidoHasta);
                var result = await connection.QueryAsync<BEPasajero>
                                        ("Pasajero_Obtener", parameters,
                                        commandType: System.Data.CommandType.StoredProcedure);
                return result;
            }
        }
        public async Task<IEnumerable<BEPasajero>> Venta_ListaPasajero(string? str_pVentaClienteDocumentoTipoId, string? str_pVentaClienteDocumentoNumero,
            DateTime dte_pVentaIngresoInicio = default, DateTime dte_pVentaIngresoFin = default)
        {
            await using (var connection = new SqlConnection(_connectionString))
            {
                Helpers GeneralAyuda = new Helpers();
                string str_vFechaValidoDesde = "";
                string str_vFechaValidoHasta = "";
                if (dte_pVentaIngresoInicio != DateTime.Parse("0001-01-01"))
                    str_vFechaValidoDesde = GeneralAyuda.TraerFechaFormatoServidorBD(dte_pVentaIngresoInicio);
                if (dte_pVentaIngresoFin != DateTime.Parse("0001-01-01"))
                    str_vFechaValidoHasta = GeneralAyuda.TraerFechaFormatoServidorBD(dte_pVentaIngresoFin);
                var parameters = new DynamicParameters();
                parameters.Add("@pPasajero_DocumentoTipo", str_pVentaClienteDocumentoTipoId);
                parameters.Add("@pPasajero_DocumentoNumero", str_pVentaClienteDocumentoNumero);
                parameters.Add("@pFechaIngresoInicio", str_vFechaValidoDesde);
                parameters.Add("@pFechaIngresoFin", str_vFechaValidoHasta);
                var result = await connection.QueryAsync<BEPasajero>
                                        ("Pasajero_Listado", parameters,
                                        commandType: System.Data.CommandType.StoredProcedure);
                return result;
            }
        }
        public async Task<IEnumerable<BEVenta>> Venta_ObtenerTarjetasVencidas()
        {
            await using (var connection = new SqlConnection(_connectionString))
            {
                var parameters = new DynamicParameters();
                var result = await connection.QueryAsync<BEVenta>("Venta_ObtenerTarjetasVencidas", parameters,
                                        commandType: System.Data.CommandType.StoredProcedure);
                return result!;
            }
        }
        public async Task<IEnumerable<BEAgenciaProducto>> Venta_ObtenerDescuentoVentas(string? str_pVentaCodigos)
        {
            await using (var connection = new SqlConnection(_connectionString))
            {
                var parameters = new DynamicParameters();
                parameters.Add("@pVENTA_Codigos", str_pVentaCodigos);
                var result = await connection.QueryAsync<BEAgenciaProducto>("Venta_ObtenerDescuentoVentas", parameters,
                                        commandType: System.Data.CommandType.StoredProcedure);
                return result!;
            }
        }
        public async Task<IEnumerable<BEVenta>> Venta_ObtenerVentasEspecificas(string? str_pVentaCodigos, string? str_pVentaSituacion)
        {
            await using (var connection = new SqlConnection(_connectionString))
            {
                var parameters = new DynamicParameters();
                parameters.Add("@pVENTA_Codigos", str_pVentaCodigos);
                parameters.Add("@pVENTA_Situacion", str_pVentaSituacion);
                var result = await connection.QueryAsync<BEVenta>("Venta_ObtenerVentasEspecificas", parameters,
                                        commandType: System.Data.CommandType.StoredProcedure);
                return result!;
            }
        }
        public async Task<BEError> Venta_Situacion_Actualizar(int int_pVentaID, int int_IDUsuario)
        {
            await using (var connection = new SqlConnection(_connectionString))
            {
                var parameters = new DynamicParameters();
                parameters.Add("@pIDVoucher", int_pVentaID);
                parameters.Add("@pUsuario", int_IDUsuario);
                var result = await connection.QueryFirstOrDefaultAsync<BEError>("VentaSituacion_Actualizar", parameters,
                                        commandType: System.Data.CommandType.StoredProcedure);
                return result!;
            }
        }
        public async Task<BEError> Venta_VigenciaValidar(int int_DiasViaje, int int_Producto)
        {
            await using (var connection = new SqlConnection(_connectionString))
            {
                var parameters = new DynamicParameters();
                parameters.Add("@pVENTA_DiasViaje", int_DiasViaje);
                parameters.Add("@pVENTA_ProductoID", int_Producto);
                var result = await connection.QueryFirstOrDefaultAsync<BEError>("Venta_VigenciaValidar", parameters,
                                        commandType: System.Data.CommandType.StoredProcedure);
                return result!;
            }
        }
        public async Task<IEnumerable<BEVenta>> Venta_Web_Obtener(string? str_pOrigen = "", DateTime dte_pVentaIngresoInicio = default, DateTime dte_pVentaIngresoFin = default, int int_pVentaID = 0, int int_pUsuarioId = 0, string? str_pEstadoId = "", string? str_pSituacionId = "", int int_pAgenciaId = 0, int int_pAgenciaUsuarioId = 0, string? str_pClienteNombres = "", string? str_pClienteApellidos = "", int int_pPaisId = 0, string? str_pCodigoExterno = "")
        {
            await using (var connection = new SqlConnection(_connectionString))
            {
                Helpers GeneralAyuda = new Helpers();
                string str_vFechaFechaVigenciaInicio = "";
                string str_vFechaFechaVigenciaFin = "";
                if (dte_pVentaIngresoInicio != DateTime.Parse("0001-01-01"))
                    str_vFechaFechaVigenciaInicio = GeneralAyuda.TraerFechaFormatoServidorBD(dte_pVentaIngresoInicio);
                if (dte_pVentaIngresoFin != DateTime.Parse("0001-01-01"))
                    str_vFechaFechaVigenciaFin = GeneralAyuda.TraerFechaFormatoServidorBD(dte_pVentaIngresoFin);
                var parameters = new DynamicParameters();
                parameters.Add("@pORIGEN", str_pOrigen);
                parameters.Add("@pVENTA_FechaVigenciaInicio", str_vFechaFechaVigenciaInicio);
                parameters.Add("@pVENTA_FechaVigenciaFin", str_vFechaFechaVigenciaFin);
                parameters.Add("@pVENTA_Id", int_pVentaID);
                parameters.Add("@pVENTA_UsuarioId", int_pUsuarioId);
                parameters.Add("@pVENTA_EstadoId", str_pEstadoId);
                parameters.Add("@pVENTA_SituacionId", str_pSituacionId);
                parameters.Add("@pVENTA_AgenciaId", int_pAgenciaId);
                parameters.Add("@pVENTA_AgenciaUsuarioId", int_pAgenciaUsuarioId);
                parameters.Add("@pVENTA_ClienteNombres", str_pClienteNombres);
                parameters.Add("@pVENTA_ClienteApellidos", str_pClienteApellidos);
                parameters.Add("@pVENTA_PaisId", int_pPaisId);
                parameters.Add("@pVENTA_CodigoExterno", str_pCodigoExterno);
                var result = await connection.QueryAsync<BEVenta>("Venta_Obtener", parameters,
                                        commandType: System.Data.CommandType.StoredProcedure);
                return result!;
            }
        }
        public async Task<BEError> Venta_WEB_Procesar(BEVenta obj_pVenta)
        {
            await using (var connection = new SqlConnection(_connectionString))
            {
                Helpers GeneralAyuda = new Helpers();
                string str_vFechaFechaVigenciaInicio = "";
                string str_vFechaFechaVigenciaFin = "";
                string str_vFechaClienteFechaNacimiento = "";
                string str_vFechaEmision = "";
                if (obj_pVenta.ventaFechaVigenciaInicio != DateTime.Parse("0001-01-01"))
                    str_vFechaFechaVigenciaInicio = GeneralAyuda.TraerFechaFormatoServidorBD(obj_pVenta.ventaFechaVigenciaInicio);
                if (obj_pVenta.ventaFechaVigenciaFin != DateTime.Parse("0001-01-01"))
                    str_vFechaFechaVigenciaFin = GeneralAyuda.TraerFechaFormatoServidorBD(obj_pVenta.ventaFechaVigenciaFin);
                if (obj_pVenta.ventaClienteFechaNacimiento != DateTime.Parse("0001-01-01"))
                    str_vFechaClienteFechaNacimiento = GeneralAyuda.TraerFechaFormatoServidorBD(obj_pVenta.ventaClienteFechaNacimiento);
                if (obj_pVenta.ventaCreadoFecha != DateTime.Parse("0001-01-01"))
                    str_vFechaEmision = GeneralAyuda.TraerFechaFormatoServidorBD(obj_pVenta.ventaCreadoFecha);
                var parameters = new DynamicParameters();
                parameters.Add("@pVENTA_Id", obj_pVenta.ventaId);
                parameters.Add("@pVENTA_UsuarioOrigen", obj_pVenta.ventaUsuarioOrigen);
                parameters.Add("@pVENTA_UsuarioAgenciaId", obj_pVenta.ventaUsuarioAgenciaId);
                parameters.Add("@pVENTA_FechaVigenciaInicio", str_vFechaFechaVigenciaInicio);
                parameters.Add("@pVENTA_FechaVigenciaFin", str_vFechaFechaVigenciaFin);
                parameters.Add("@pVENTA_NumeroDias", obj_pVenta.ventaNumeroDias);
                parameters.Add("@pVENTA_Destino", obj_pVenta.ventaDestino);
                parameters.Add("@pVENTA_ProductoId", obj_pVenta.ventaProductoId);
                parameters.Add("@pVENTA_ProductoImporte", obj_pVenta.ventaProductoImporte);
                parameters.Add("@pVENTA_ClienteDocumentoTipo", obj_pVenta.ventaClienteDocumentoTipoId);
                parameters.Add("@pVENTA_ClienteDocumentoNumero", obj_pVenta.ventaClienteDocumentoNumero);
                parameters.Add("@pVENTA_ClienteNombres", obj_pVenta.ventaClienteNombres!.ToString().ToUpper());
                parameters.Add("@pVENTA_ClienteApellidos", obj_pVenta.ventaClienteApellidos!.ToString().ToUpper());
                parameters.Add("@pVENTA_ClienteFechaNacimiento", str_vFechaClienteFechaNacimiento);
                parameters.Add("@pVENTA_ClienteEmail", obj_pVenta.ventaClienteEmail);
                parameters.Add("@pVENTA_ClienteDireccion", obj_pVenta.ventaClienteDireccion!.ToString().ToUpper());
                parameters.Add("@pVENTA_ClienteTelefono", obj_pVenta.ventaClienteTelefono);
                parameters.Add("@pVENTA_ClienteDistrito", obj_pVenta.ventaClienteDistrito!.ToString().ToUpper());
                parameters.Add("@pVENTA_ClienteCiudad", obj_pVenta.ventaClienteCiudad!.ToString().ToUpper());
                parameters.Add("@pVENTA_ClientePais", obj_pVenta.ventaClientePais!.ToString().ToUpper());
                parameters.Add("@pVENTA_ContactoNombres", obj_pVenta.ventaContactoNombres!.ToString().ToUpper());
                parameters.Add("@pVENTA_ContactoDireccion", obj_pVenta.ventaContactoDireccion!.ToString().ToUpper());
                parameters.Add("@pVENTA_ContactoEmail", obj_pVenta.ventaContactoEmail);
                parameters.Add("@pVENTA_ContactoTelefono", obj_pVenta.ventaContactoTelefono);
                parameters.Add("@pVENTA_ContactoDistrito", obj_pVenta.ventaContactoDistrito!.ToString().ToUpper());
                parameters.Add("@pVENTA_ContactoPais", obj_pVenta.ventaContactoPais!.ToString().ToUpper());
                parameters.Add("@pVENTA_ImporteVenta", obj_pVenta.ventaImporteVenta);
                parameters.Add("@pVENTA_Usuario", obj_pVenta.ventaCreadoUsuarioId);
                parameters.Add("@pVENTA_Counter", obj_pVenta.ventaCounter);
                parameters.Add("@pVENTA_Cupon", obj_pVenta.ventaCupon);
                parameters.Add("@pVENTA_EstadoId", obj_pVenta.ventaEstadoId);
                parameters.Add("@pVENTA_SituacionId", obj_pVenta.ventaSituacionId);
                parameters.Add("@pVENTA_Observacion", obj_pVenta.ventaObservacion);
                parameters.Add("@pVentaCreadoFecha", str_vFechaEmision);
                var result = await connection.QueryFirstOrDefaultAsync<BEError>("Venta_WEB_Procesar", parameters,
                                        commandType: System.Data.CommandType.StoredProcedure);
                return result!;
            }
        }
        public async Task<BEError> Liquidacion_Procesar(int int_pVentaID, decimal dec_pComision, decimal dec_pIncentivo, decimal dec_pPublicidad, int int_IDUsuario,
                                                        int int_pFormula, decimal dec_pDescuento, decimal dec_pPago, int int_pLiquidacionCod)
        {
            await using (var connection = new SqlConnection(_connectionString))
            {
                var parameters = new DynamicParameters();
                parameters.Add("@pVENTA_Id", int_pVentaID);
                parameters.Add("@pVENTA_Comision", dec_pComision);
                parameters.Add("@pVENTA_Incentivo", dec_pIncentivo);
                parameters.Add("@pVENTA_publicidad", dec_pPublicidad);
                parameters.Add("@pVENTA_formulaLiquidacion", int_pFormula);
                parameters.Add("@pVENTA_descuentoImporte", dec_pDescuento);
                parameters.Add("@pVENTA_UsuarioId", int_IDUsuario);
                parameters.Add("@pVENTA_Pago", dec_pPago);
                parameters.Add("@pLiquidacionCodigo", int_pLiquidacionCod);
                var result = await connection.QueryFirstOrDefaultAsync<BEError>("Liquidacion_Procesar", parameters,
                                        commandType: System.Data.CommandType.StoredProcedure);
                return result!;
            }
        }
        public async Task<BEError> VentaActualizar_Procesar(BEVentaParametro obj_pVenta)
        {
            await using (var connection = new SqlConnection(_connectionString))
            {
                Helpers GeneralAyuda = new Helpers();

                string str_vFechaCancelacion = "";
                if (obj_pVenta.ventaCobranzaPagoFecha != DateTime.Parse("0001-01-01"))
                    str_vFechaCancelacion = GeneralAyuda.TraerFechaFormatoServidorBD(obj_pVenta.ventaCobranzaPagoFecha);

                var parameters = new DynamicParameters();
                parameters.Add("@pVENTA_Id", obj_pVenta.ventaId);
                parameters.Add("@pVENTA_ImporteComision", obj_pVenta.ventaComisionImporte);
                parameters.Add("@pVENTA_ImporteIncentivo", obj_pVenta.ventaIncentivoImporte);
                parameters.Add("@pVENTA_ImportePorPagar", obj_pVenta.ventaPagarLiquidacion);
                parameters.Add("@pVENTA_FechaCancelacion", str_vFechaCancelacion);
                parameters.Add("@pVENTA_Usuario", obj_pVenta.ventaCreadoUsuarioId);
                parameters.Add("@pVENTA_Observacion", obj_pVenta.ventaObservacion);

                // Ejecuta el SP y mapea manualmente el resultado
                var resultData = await connection.QueryFirstOrDefaultAsync<dynamic>("Venta_ActualizarProcesar", parameters,
                                        commandType: System.Data.CommandType.StoredProcedure);

                // Crea el objeto BEError con el mapeo correcto
                var result = new BEError();
                if (resultData != null)
                {
                    result.errorCodigo = resultData.codigo;
                    result.errorDescripcion = resultData.descripcion;
                }

                return result;
            }
        }
        public async Task<BEError> VentaPrecio_Procesar(int int_pVentaID, decimal dec_pPrecio, int int_pUsuarioId)
        {
            await using (var connection = new SqlConnection(_connectionString))
            {
                var parameters = new DynamicParameters();
                parameters.Add("@pVENTA_Id", int_pVentaID);
                parameters.Add("@pVENTA_ImportePrecio", dec_pPrecio);
                parameters.Add("@pVENTA_UsuarioId", int_pUsuarioId);

                var resultData = await connection.QueryFirstOrDefaultAsync<dynamic>("Venta_ActualizarPrecio", parameters,
                                        commandType: System.Data.CommandType.StoredProcedure);

                var result = new BEError();
                if (resultData != null)
                {
                    result.errorCodigo = resultData.codigo;
                    result.errorDescripcion = resultData.descripcion;
                }

                return result;
            }
        }
    }
}
