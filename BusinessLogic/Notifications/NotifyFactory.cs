using Microsoft.Extensions.Options;
using System;
using System.Net;
using System.Net.Mail;

namespace Notifications
{
    // Interfaz de notificación
    public interface INotification
    {
        void Send(string subject, string message, string recipient);
    }

    // Servicio de notificación
    public class NotificationService
    {
        private readonly INotification _notification;

        // Constructor que recibe una implementación de INotification (inyección de dependencias)
        public NotificationService(INotification notification)
        {
            _notification = notification ?? throw new ArgumentNullException(nameof(notification));
        }

        public void ResetPasswordNotification(string code, string recipient)
        {
            _notification.Send("Restablecimiento de contraseña", $"Haga clic en el siguiente enlace para restablecer su contraseña: http://localhost:5173/cambiar-contrasena?t={code}", recipient);
            Console.WriteLine("Notificación de restablecimiento de contraseña enviada.");
        }

        public void Send2FA(string code, string recipient)
        {
            _notification.Send("Código de verificación", $"Su código de verificación es: {code}", recipient);
            Console.WriteLine("Notificación de 2FA enviada.");
        }
    }

    public class EmailSettings
    {
        public string SenderEmail { get; set; }
        public string Password { get; set; }
    }


        public class EmailNotification : INotification
    {
        private readonly EmailSettings _emailSettings;

        // Modifica el constructor para aceptar IOptions<EmailSettings>
        public EmailNotification(IOptions<EmailSettings> emailSettings)
        {
            _emailSettings = emailSettings.Value ?? throw new ArgumentNullException(nameof(emailSettings));
        }

        public void Send(string subject, string message, string recipient)
        {
            try
            {
                using (var client = new SmtpClient("smtp.gmail.com", 587))
                {
                    client.Credentials = new NetworkCredential(_emailSettings.SenderEmail, _emailSettings.Password);
                    client.EnableSsl = true;

                    var mailMessage = new MailMessage
                    {
                        From = new MailAddress(_emailSettings.SenderEmail),
                        Subject = subject,
                        Body = message,
                        IsBodyHtml = false
                    };

                    mailMessage.To.Add(recipient);
                    client.Send(mailMessage);

                    Console.WriteLine($"Correo enviado a {recipient} con el asunto: {subject}");
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error al enviar el correo: {ex.Message}");
                throw;
            }
        }
    }
    
}
