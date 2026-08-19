using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FrontAssistanceTravelers.WebTravel.Models.Usuarios
{
    public class BEUsuario
    {
        public int usuarioId { get; set; }
        public string? usuarioLogin { get; set; }
        public string? usuarioPassword { get; set; }
        public string? usuarioNombre { get; set; }
        public string? usuarioEmail { get; set; }
        public int usuarioEmpresaId { get; set; }
        public string? usuarioEmpresaNombre { get; set; }
        public int usuarioPerfilId { get; set; }
        public string? usuarioPerfilNombre { get; set; }
        public string? usuarioValidoDesde { get; set; }
        public string? usuarioValidoHasta { get; set; }
        public string? usuarioComentarios { get; set; }
        public string? usuarioFechaRegistro { get; set; }
        public string? usuarioUltimoAcceso { get; set; }
		public string? usuarioOrigen { get; set; }
		public int usuarioCaducado { get; set; }
        public int usuarioActivo { get; set; }
        public int usuarioAgenciaPaisId { get; set; }
		public int usuarioAgenciaId { get; set; }
		public string? paisDocumentoFormato { get; set; }
		public int usuarioAgenciaPaisDocumentoFormato { get; set; }
	}
}
