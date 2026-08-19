using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BackAssistanceTravelers.Models.General
{
    public class BEMailAdjuntos
    {
        public MemoryStream? adjuntos { get; set; }
        public string? nombadjunto { get; set; }
        public string? tipoadjunto { get; set; }
    }
}
