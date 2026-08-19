using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BackAssistanceTravelers.Models.General
{
	public class BEUbigeo
	{
		public string? ubigeoId { get; set; }
		public string? ubigeoNombre { get; set; }
		public int ubigeoProvinciaId { get; set; }
		public string? ubigeoProvinciaNombre { get; set; }
		public int ubigeoDepartamentoId { get; set; }
		public string? ubigeoDepartamentoNombre { get; set; }
		public int ubigeoPaisId { get; set; }
		public string? ubigeoPaisNombre { get; set; }
		public int ubigeoActivo { get; set; }
		public string? ubigeoDistrito { get; set; }
	}
}
