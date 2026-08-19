using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BackAssistanceTravelers.Models.Producto {
    public class BEProductoBeneficioBody {
        public string? beneficioNombre { get; set; }
        public string? beneficioImporte { get; set; }        
        public int beneficioId { get; set; }
        public int beneficioProductoId { get; set; }
        public int beneficioCreadoUsuarioId { get; set; }        
        public int beneficioIdiomaId { get; set; }
        public int beneficioOrden { get; set; }
    }
}
