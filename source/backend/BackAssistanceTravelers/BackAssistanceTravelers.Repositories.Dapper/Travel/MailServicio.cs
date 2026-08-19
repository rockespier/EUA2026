using BackAssistanceTravelers.Models.General;
using BackAssistanceTravelers.Repositories.Travel;
using Microsoft.Extensions.Options;
using System.Net.Mail;

namespace BackAssistanceTravelers.Repositories.Dapper.Travel
{
    public class MailServicio: IMailServicio
    {
        private readonly BEMailConfigurar _mailSettings;
        public MailServicio(IOptions<BEMailConfigurar> mailSettingsOptions)
        {
            _mailSettings = mailSettingsOptions.Value;
        }
        public async Task<string> SendMail(BEMailData mailData, string mailCopia = "", List<BEMailAdjuntos> adjuntos = default!)

        {
            var NetMail = new System.Net.Mail.MailMessage();
            string resutlado = "";
            try
            {
                NetMail.From = new System.Net.Mail.MailAddress(_mailSettings.SenderEmail!);
                var listaCorreos = mailData.EmailToId!.ToString().Split(";");
                for (int i = 0; i < listaCorreos.Length; i++)
                {
                    var elcorreo = listaCorreos[i];
                    NetMail.To.Add(new System.Net.Mail.MailAddress(elcorreo));
                }
                if (mailCopia != "")
                {
                    NetMail.CC.Add(new System.Net.Mail.MailAddress(mailCopia));
                }
                NetMail.IsBodyHtml = true;
                NetMail.Subject = mailData.EmailSubject;
                NetMail.Body = mailData.EmailBody;
                NetMail.Priority = System.Net.Mail.MailPriority.High;
                if (adjuntos != null)
                {
                    if (adjuntos.Count > 0)
                    {
                        foreach (BEMailAdjuntos item in adjuntos)
                        {
                            var oArchivo = new System.Net.Mail.Attachment(new MemoryStream(item.adjuntos!.ToArray()), item.nombadjunto, item.tipoadjunto);
                            NetMail.Attachments.Add(oArchivo);
                        }
                    }
                }

                using (var MailClient = new SmtpClient())
                {
                    MailClient.Host = _mailSettings.Server!;
                    MailClient.Port = _mailSettings.Port;
                    MailClient.EnableSsl = _mailSettings.Ssl;
                    MailClient.DeliveryMethod = System.Net.Mail.SmtpDeliveryMethod.Network;
                    MailClient.UseDefaultCredentials = false;
                    MailClient.Credentials = new System.Net.NetworkCredential(_mailSettings.UserName, _mailSettings.Password);
                    MailClient.Timeout = 500000;
                    await MailClient.SendMailAsync(NetMail);
                    resutlado = "";
                    MailClient.Dispose();
                }

                return resutlado;

            }
            catch (Exception ex)
            {
                // Exception Details
                return ex.Message.ToString();
            }
            finally
            {
                NetMail.Dispose();
                NetMail = null;
            }
        }
    }
}
