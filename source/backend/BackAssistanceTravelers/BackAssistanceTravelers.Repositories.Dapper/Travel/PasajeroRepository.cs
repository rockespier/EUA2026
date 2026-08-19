using BackAssistanceTravelers.Models.Cobranza;
using BackAssistanceTravelers.Models.Error;
using BackAssistanceTravelers.Models.Pasajero;
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
    public class PasajeroRepository : Repository, IPasajeroRepository
    {
        public PasajeroRepository(string connectionString) : base(connectionString)
        {
        }

        public async Task<IEnumerable<BEPasajero>> Pasajero_Obtener(int int_pPasajero_DocumentoTipo=0, string? str_pPasajero_DocumentoNumero="", DateTime dte_pIngresoInicio=default, DateTime dte_pIngresoFin = default)
        {
            await using (var connection = new SqlConnection(_connectionString))
            {
                Helpers GeneralAyuda = new Helpers();
                string str_pSolicitudIngresoInicio = "";
                string str_pSolicitudIngresoFin = "";
                if (dte_pIngresoInicio != DateTime.Parse("0001-01-01"))
                    str_pSolicitudIngresoInicio = GeneralAyuda.TraerFechaFormatoServidorBD(dte_pIngresoInicio);
                if (dte_pIngresoFin != DateTime.Parse("0001-01-01"))
                    str_pSolicitudIngresoFin = GeneralAyuda.TraerFechaFormatoServidorBD(dte_pIngresoFin);
                var parameters = new DynamicParameters();
                parameters.Add("@pPasajero_DocumentoTipo", int_pPasajero_DocumentoTipo);
                parameters.Add("@pPasajero_DocumentoNumero", str_pPasajero_DocumentoNumero);
                parameters.Add("@pFechaIngresoInicio", str_pSolicitudIngresoInicio);
                parameters.Add("@pFechaIngresoFin", str_pSolicitudIngresoFin);
                var result = await connection.QueryAsync<BEPasajero>("Pasajero_Obtener", parameters,
                                        commandType: System.Data.CommandType.StoredProcedure);
                return result;
            }
        }

        public async Task<BEError> Pasajero_Procesar(BEPasajero obj_pVenta)
        {
            await using (var connection = new SqlConnection(_connectionString))
            {
                Helpers GeneralAyuda = new Helpers();
                string str_vFechaClienteFechaNacimiento = "";
                if (obj_pVenta.pasajeroFechaNacimiento != DateTime.Parse("0001-01-01"))
                    str_vFechaClienteFechaNacimiento = GeneralAyuda.TraerFechaFormatoServidorBD(obj_pVenta.pasajeroFechaNacimiento);

                var parameters = new DynamicParameters();
                parameters.Add("@pPasajero_Id", obj_pVenta.pasajeroId);
                parameters.Add("@pPasajero_DocumentoTipo", obj_pVenta.pasajeroDocumentoTipoId);
                parameters.Add("@pPasajero_DocumentoNumero", obj_pVenta.pasajeroDocumentoNumero);
                parameters.Add("@pPasajero_Nombres", obj_pVenta.pasajeroNombres!.ToString().ToUpper());
                parameters.Add("@pPasajero_Apellidos", obj_pVenta.pasajeroApellidos!.ToString().ToUpper());
                parameters.Add("@pPasajero_FechaNacimiento", str_vFechaClienteFechaNacimiento);
                parameters.Add("@pPasajero_Edad", obj_pVenta.pasajeroEdad);
                parameters.Add("@pPasajero_Email", obj_pVenta.pasajeroEmail);
                parameters.Add("@pPasajero_Direccion", obj_pVenta.pasajeroDireccion);
                parameters.Add("@pPasajero_Telefono", obj_pVenta.pasajeroTelefono);
                parameters.Add("@pPasajero_Distrito", obj_pVenta.pasajeroDistrito == null ? "" : obj_pVenta.pasajeroDistrito);
                parameters.Add("@pPasajero_Ciudad", obj_pVenta.pasajeroCiudad);
                parameters.Add("@pPasajero_Pais", obj_pVenta.pasajeroPais == null ? "" : obj_pVenta.pasajeroPais);
                parameters.Add("@pPasajero_Nacionalidad", obj_pVenta.pasajeroNacionalidad);
                parameters.Add("@pContactoNombres", obj_pVenta.contactoNombres);
                parameters.Add("@pContactoDireccion", obj_pVenta.contactoDireccion);
                parameters.Add("@pContactoEmail", obj_pVenta.contactoEmail);
                parameters.Add("@pContactoTelefono", obj_pVenta.contactoTelefono);
                parameters.Add("@pContactoDistrito", obj_pVenta.contactoDistrito);
                parameters.Add("@pContactoPais", obj_pVenta.contactoPais);
                parameters.Add("@pContactoProducto", obj_pVenta.contactoProducto);
                parameters.Add("@pContactoAgencia", obj_pVenta.contactoAgencia);
                parameters.Add("@pFechaSalida", obj_pVenta.fechaInicio);
                parameters.Add("@pFechaRegreso", obj_pVenta.fechaFin);
                parameters.Add("@pDia", obj_pVenta.dias);


                var result = await connection.QueryFirstOrDefaultAsync<BEError>("Cobranza_Procesar", parameters,
                                        commandType: System.Data.CommandType.StoredProcedure);
                return result!;
            }
        }
    }
}
