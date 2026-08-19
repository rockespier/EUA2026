using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BackAssistanceTravelers.Models.Agencia
{
	public class BEAgenciaParametro
	{
		public int agenciaId { get; set; }
		public int agenciaIdExterno { get; set; }
        public string? agenciaNombre { get; set; }
        public string? agenciaDireccion { get; set; }
        public string? agenciaRUC { get; set; }
        public string? agenciaLogin { get; set; }
        public string? agenciaPassword { get; set; }
        public string? agenciaEmail { get; set; }
        public int agenciaPerfilId { get; set; }
		public int agenciaPromotorId { get; set; }
        public float agenciaComision { get; set; }
        public DateTime agenciaValidoDesde { get; set; }
        public DateTime agenciaValidoHasta { get; set; }
        public string? agenciaComentarios { get; set; }
        public int agenciaCreadoUsuarioId { get; set; }
        public int agenciaActivo { get; set; }
		public int agenciaCredito { get; set; }
		public int agenciaPaisId { get; set; }
        public string? agenciaTelefono { get; set; }
        public float agenciaXcoord { get; set; }
		public float agenciaYcoord { get; set; }
		public int agenciaUbigeoId { get; set; }
		public string? agenciaObservacionCobranzas { get; set; }
        public int agencia_ActualizarContrasena { get; set; }
        public int agenciaVip { get; set; }
        public int agenciaEjecutivoCobrador { get; set; }
    }
}
