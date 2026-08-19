using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BackAssistanceTravelers.Models.General
{
	public class BEGlobal
	{
		public string? usuarioEmail { get; set; }
		public string? usuarioLogin { get; set; }
		public string? usuarioNombre { get; set; }
		public string? usuarioPerfilNombre { get; set; }
		public string? usuarioOrigen { get; set; }
		public string? agenciaNombre { get; set; }
		public string? agenciaDireccion { get; set; }
		public string? agenciaCorreo { get; set; }
		public int usuarioId { get; set; }
		public int usuarioPerfilId { get; set; }
		public int agenciaId { get; set; }
		public int agenciaPaisId { get; set; }
		public float agenciaImpuesto { get; set; }
		public int agenciaPaisDocumentoFormato { get; set; }
	}
}
