using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BackAssistanceTravelers.Models.Reporte
{
	public class BEReporte
	{
		public int id { get; set; }
		public int paisId { get; set; }
		public int anio { get; set; }
		public int tipoReporte { get; set; }
		public int agenciaId { get; set; }
		public string? nombre { get; set; }
		public float resultado { get; set; }
		public string? situacionId { get; set; }
		public string? mes { get; set; }
		public float importe { get; set; }
        public string? promotorNombre { get; set; }
    }
}
