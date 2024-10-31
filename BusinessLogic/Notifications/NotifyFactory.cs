using System;
using System.Net;
using System.Net.Mail;

namespace Notifications
{
    // Interfaz INotification
    public interface INotification
    {
        void Send(string subject, string message, string recipient);
    }

    // Clase NotificationFA que es la de 2FA
    public class NotificationFA
    {
        private readonly INotification _notification;
        public NotificationFA(INotification notification)
        {
            _notification = notification;
        }

        public void Send(string subject, string message, string recipient)
        {
            _notification.Send(subject, message, recipient);
        }
    }

    // Clase ChangePasswordNotification que es la de cambio de contraseña
    public class ChangePasswordNotification
    {
        private readonly INotification _notification;
        public ChangePasswordNotification(INotification notification)
        {
            _notification = notification;
        }

        public void Send(string subject, string message, string recipient)
        {
            _notification.Send(subject, message, recipient);
        }
    }

    // Implementación de la interfaz INotification
    public class EmailNotification : INotification
    {
        private readonly string senderEmail = "bytedev0101@gmail.com";
        private readonly string password = "elkr elbu jlvd qsux";
        private readonly SmtpClient smtpClient;
        private readonly MailMessage mailMessage;

        public EmailNotification()
        {
            smtpClient = new SmtpClient("smtp.gmail.com", 587)
            {
                Credentials = new NetworkCredential(senderEmail, password),
                EnableSsl = true
            };

            mailMessage = new MailMessage
            {
                From = new MailAddress(senderEmail),
                IsBodyHtml = false
            };
        }

        public void Send(string subject, string message, string recipient)
        {
            try
            {
              
                mailMessage.Subject = subject;
                mailMessage.Body = message;
                mailMessage.To.Clear(); // Limpiamos los destinatarios previos
                mailMessage.To.Add(recipient);

                smtpClient.Send(mailMessage);
                Console.WriteLine($"Correo enviado a {recipient} con el código 2FA.");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error al enviar el correo: {ex.Message}");
                throw;
            }
        }
    }
}
