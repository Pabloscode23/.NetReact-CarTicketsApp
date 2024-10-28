using System;
using System.Net;
using System.Net.Mail;

namespace Notifications
{
    public interface INotification
    {
        void Send(string message, string recipient);
        bool ValidateCode(string inputCode); // Método para validar el código
    }

    public class EmailNotification : INotification
    {
        private string senderEmail = "bytedev0101@gmail.com"; //correo de la "empresa"
        private string password = "elkr elbu jlvd qsux"; // NO CAMBIAR
        private string generatedCode; // Almacenar el código generado

        public void Send(string message, string recipient)
        {
            generatedCode = Generate2FACode(); // Generar el código antes de enviarlo
            string messageWithCode = $"{message}\nCódigo de un solo uso"; // mensaje que se enviará

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
                    Subject = "Código de Verificación (2FA)",
                    Body = messageWithCode,
                    IsBodyHtml = false
                };

                mailMessage.To.Add(recipient);

                client.Send(mailMessage);
                Console.WriteLine($"Correo enviado a {recipient} con el código 2FA.");
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

        public bool ValidateCode(string inputCode)
        {
            return inputCode == generatedCode; // Validar el código ingresado
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
