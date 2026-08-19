using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BackAssistanceTravelers.Models.Pais
{
	public class BEPaisImagenPromocion
	{
		public int paisImagenId { get; set; }
		public int paisImagenPaisId { get; set; }
		public int paisImagenActivo { get; set; }
		public string? paisImagenUrl { get; set; }
		public DateTime paisImagenCreadoFecha { get; set; }
		public int paisImagenCreadoUsuarioId { get; set; }
		public DateTime paisImagenModificadoFecha { get; set; }
		public int paisImagenModificadoUsuarioId { get; set; }
	}
}
