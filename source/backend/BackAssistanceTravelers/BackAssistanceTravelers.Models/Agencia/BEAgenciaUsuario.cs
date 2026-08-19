using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BackAssistanceTravelers.Models.Agencia
{
	public class BEAgenciaUsuario
	{
		public string? agenciausuarioNombre { get; set; }
		public string? agenciausuarioTipoDocumentoId { get; set; }
		public string? agenciausuarioTipoDocumentoNombre { get; set; }
		public string? agenciausuarioNumeroDocumento { get; set; }
		public string? agenciausuarioTelefono { get; set; }
		public string? agenciausuarioEMail { get; set; }
		public string? agenciausuarioDireccion { get; set; }
		public string? agenciausuarioLogin { get; set; }
		public string? agenciausuarioClave { get; set; }
		public string? agenciausuarioPerfilNombre { get; set; }
		public string? agenciausuarioSupervisorNombre { get; set; }
		public string? agenciausuarioComentarios { get; set; }
		public string? agenciausuarioCreadoUsuarioNombre { get; set; }
		public string? agenciausuarioModificadoUsuarioNombre { get; set; }
		public int agenciaId { get; set; }
		public int agenciausuarioId { get; set; }
		public int agenciausuarioPerfilId { get; set; }
		public int agenciausuarioSupervisorId { get; set; }
		public DateTime agenciausuarioValidoDesde { get; set; }
		public DateTime agenciausuarioValidoHasta { get; set; }
		public DateTime agenciausuarioUltimoAcceso { get; set; }
		public DateTime agenciausuarioCreadoFecha { get; set; }
		public int agenciausuarioCreadoUsuarioId { get; set; }
		public DateTime agenciausuarioModificadoFecha { get; set; }
		public int agenciausuarioModificadoUsuarioId { get; set; }
		public int agenciausuarioActivo { get; set; }
	}
}
