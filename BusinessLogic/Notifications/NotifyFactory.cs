using System;
using System.Net;
using System.Net.Mail;

namespace Notifications
{
    public interface INotification
    {
        void Send(string message, string recipient);
    }

    public class EmailNotification : INotification
    {
        private string senderEmail = "bytedev0101@gmail.com"; //correo
        private string password = "elkr elbu jlvd qsux"; //contraseña de correo

        public void Send(string message, string recipient)
        {
            string code2FA = Generate2FACode();
            string messageWithCode = $"{message}\nCodigo 2FA: {code2FA}"; //mensaje que se enviará

            try
            {
                SmtpClient client = new SmtpClient("smtp.gmail.com", 587)
                {
                    Credentials = new NetworkCredential(senderEmail, password),
                    EnableSsl = true
                };

                MailMessage mailMessage = new MailMessage
                {
                    From = new MailAddress(senderEmail),
                    Subject = "Verification Code (2FA)",
                    Body = messageWithCode,
                    IsBodyHtml = false
                };

                mailMessage.To.Add(recipient);

                client.Send(mailMessage);
                Console.WriteLine($"Correo enviado a {recipient} con el codigo 2FA.");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error al enviar el correo: {ex.Message}");
                throw; // Lanzar la excepción para manejo adicional
            }
        }

        private string Generate2FACode()
        {
            Random random = new Random();
            return random.Next(100000, 999999).ToString();
        }
    }

    public static class NotificationFactory
    {
        public static INotification CreateNotification(string type)
        {
            switch (type.ToLower())
            {
                case "email":
                    return new EmailNotification();
                default:
                    throw new ArgumentException("Tipo de notificación no válida.");
            }
        }
    }
}
