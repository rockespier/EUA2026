using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BackAssistanceTravelers.Models.Pasajero
{
	public class BEPasajero
	{
		public int pasajeroId { get; set; }
		public int pasajeroDocumentoTipoId { get; set; }
		public int pasajeroEdad { get; set; }
		public int dias { get; set; }
		public string? pasajeroDocumentoTipoNombre { get; set; }
		public string? pasajeroDocumentoNumero { get; set; }
		public string? pasajeroNombres { get; set; }
		public string? pasajeroApellidos { get; set; }
		public DateTime pasajeroFechaNacimiento { get; set; }
		public string? pasajeroEmail { get; set; }
		public string? pasajeroDireccion { get; set; }
		public string? pasajeroDistrito { get; set; }
		public string? pasajeroTelefono { get; set; }
		public string? pasajeroCiudad { get; set; }
		public string? pasajeroPais { get; set; }
		public string? pasajeroNacionalidad { get; set; }
		public string? contactoNombres { get; set; }
		public string? contactoDireccion { get; set; }
		public string? contactoEmail { get; set; }
		public string? contactoTelefono { get; set; }
		public string? contactoDistrito { get; set; }
		public string? contactoPais { get; set; }
		public DateTime pasajeroFechaRegistro { get; set; }
		public string? contactoProducto { get; set; }
		public string? contactoAgencia { get; set; }
		public string? fechaInicio { get; set; }
		public string? fechaFin { get; set; }
	}
}
