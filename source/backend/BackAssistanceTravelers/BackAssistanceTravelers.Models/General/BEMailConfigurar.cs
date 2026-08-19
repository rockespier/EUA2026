using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BackAssistanceTravelers.Models.General
{
    public class BEMailConfigurar
    {
        public string? Server { get; set; }
        public int Port { get; set; }
        public bool Ssl { get; set; }
        public string? SenderName { get; set; }
        public string? SenderEmail { get; set; }
        public string? UserName { get; set; }
        public string? Password { get; set; }
    }
}
