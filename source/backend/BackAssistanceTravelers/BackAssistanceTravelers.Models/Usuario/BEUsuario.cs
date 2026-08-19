using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BackAssistanceTravelers.Models.Usuario
{
	public class BEUsuario
	{
		public int usuarioId { get; set; }
		public int usuarioIdExterno { get; set; }
		public int usuarioPerfilId { get; set; }
		public DateTime usuarioCreadoFecha { get; set; }
		public int usuarioCreadoUsuarioId { get; set; }
		public int usuarioCreadoUsuarioNombre { get; set; }
		public DateTime usuarioModificadoFecha { get; set; }
		public int usuarioModificadoUsuarioId { get; set; }
		public int usuarioActivo { get; set; }
		public int usuarioAgenciaId { get; set; }
		public int usuarioCaducado { get; set; }
		public int usuarioAgenciaPaisId { get; set; }
		public float usuarioAgenciaImpuesto { get; set; }
		public int usuarioPaisId { get; set; }
		public int usuarioPaisCuponDescuento { get; set; }
		public int usuarioPaisCuponVigenciaId { get; set; }
		public int usuarioAgenciaPaisDocumentoFormato { get; set; }
		public string? usuarioLogin { get; set; }
		public string? usuarioPassword { get; set; }
		public string? usuarioNombre { get; set; }
		public string? usuarioEmail { get; set; }
		public string? usuarioPerfilNombre { get; set; }
		public DateTime usuarioValidoDesde { get; set; }
		public DateTime usuarioValidoHasta { get; set; }
		public string? usuarioFoto { get; set; }
		public string? usuarioComentarios { get; set; }
		public DateTime usuarioUltimoAcceso { get; set; }
		public string? usuarioModificadoUsuarioNombre { get; set; }
		public string? usuarioAgenciaNombre { get; set; }
		public string? usuarioOrigen { get; set; }
		public string? usuarioPaisNombre { get; set; }
		public string? usuarioAgenciaDireccion { get; set; }
		public string? usuarioAgenciaCorreo { get; set; }
        public string? paisDocumentoFormato { get; set; }
        public int usuarioBanco { get; set; }
        public string? usuarioBancoNombre { get; set; }
        public string? usuarioNumeroCuenta { get; set; }
        public int usuarioTipoDocumento { get; set; }
        public string? usuarioTipoDocumentoNombre { get; set; }
        public string? usuarioNumeroDocumento { get; set; }
        public string? resultado { get; set; }

    }
}
