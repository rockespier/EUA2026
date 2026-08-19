using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BackAssistanceTravelers.Models.Usuario
{
	public class BEUsuarioParametro
	{
		public int usuarioId { get; set; }
		public string? usuarioNombre { get; set; }
		public string? usuarioEmail { get; set; }
		public string? usuarioLogin { get; set; }
        public string? usuarioPassword { get; set; }
		public int usuarioDocumentoTipoId { get; set; }
		public string? usuarioDocumentoNumero { get; set; }
		public int usuarioPerfilId { get; set; }
		public int usuarioPaisId { get; set; }
		public DateTime usuarioValidoDesde { get; set; }
        public DateTime usuarioValidoHasta { get; set; }
		public int usuarioActivo { get; set; }
		public string? usuarioComentarios { get; set; }
		public int usuarioActualizarContrasena { get; set; }
		public string? usuarioFoto { get; set; }
		public int usuarioAgenciaId { get; set; }
        public int usuarioCreadoUsuarioId { get; set; }
        public int usuarioBanco { get; set; }
		public string? usuarioNumeroCuenta { get; set; }
        public string? usuarioOrigen { get; set; }
        

    }
}
