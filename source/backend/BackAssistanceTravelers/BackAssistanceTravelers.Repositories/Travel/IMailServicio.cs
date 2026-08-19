using BackAssistanceTravelers.Models.General;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BackAssistanceTravelers.Repositories.Travel
{
    public interface IMailServicio
    {
        Task<string> SendMail(BEMailData mailData, string mailCopia = "", List<BEMailAdjuntos> adjuntos = default!);
    }
}
