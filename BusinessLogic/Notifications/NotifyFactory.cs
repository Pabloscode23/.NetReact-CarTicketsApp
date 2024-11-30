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
        Task SendEmailWithPdfAsync(string subject, string message, string recipient, byte[] pdfContent);
        Task SendEmailWithAttachmentsAsync(string subject, string message, string recipient, Dictionary<string, byte[]> attachments);
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
        public void PaymentSuccessNotification(string totalAmount, string recipient, string ticketId, string amount, string paymentMethod)
        {
            string message = $"El pago final de {totalAmount} ha sido procesado exitosamente.\n\n" +
                    $"Detalles de la multa:\n" +
                    $"- ID: {ticketId}\n" +
                    $"- Monto sin impuesto: {amount}\n" +
                    $"- Método de Pago: {paymentMethod}\n\n" +
                    "Gracias por su pago.";


            Console.WriteLine("Mensaje de notificación antes de enviar el correo:");
            Console.WriteLine(message); // Verifica el contenido del mensaje
            Console.WriteLine("Contenido del mensaje de correo:");
            Console.WriteLine(message);

            _notification.Send("Pago exitoso", message, recipient);
            Console.WriteLine("Notificación de pago exitoso enviada.");
        }

        public void SendClaimNotification(string claimId, string claimDocument, string recipient)
        {
            string message = $"Se ha generado una nueva reclamación con el ID {claimId} y el documento {claimDocument}";

            _notification.Send("Nueva reclamación", message, recipient);
            Console.WriteLine("Notificación de reclamación enviada.");
        }

        public void AutomaticUserNotification(string totalAmount, string plate, string recipient, string ticketId, string description, string date)
        {
            string message = $"Se le notifica que se ha generado una multa por un monto de {totalAmount}.\n\n" +
                    $"Detalles de la multa:\n" +
                    $"- ID: {ticketId}\n" +
                    $"- Número de placa: {plate}\n" +
                    $"- Fecha: {date}\n" +
                    $"- Monto: {totalAmount}\n\n";


            Console.WriteLine("Mensaje de notificación antes de enviar el correo:");
            Console.WriteLine(message); // Verifica el contenido del mensaje
            Console.WriteLine("Contenido del mensaje de correo:");
            Console.WriteLine(message);

            _notification.Send("Notificación enviada", message, recipient);
            Console.WriteLine("Notificación enviada con exito.");
        }
        public void StatusChangesNotification(string status, string recipient, string ticketId, string changeReason)
        {
            string message = $"Se le notifica el cambio de estado de su multa. \n\n" +
                    $"Detalles de la multa:\n" +
                    $"- ID: {ticketId}\n" +
                    $"- Nuevo estado: {status}\n";


            Console.WriteLine("Mensaje de notificación antes de enviar el correo:");
            Console.WriteLine(message); // Verifica el contenido del mensaje
            Console.WriteLine("Contenido del mensaje de correo:");
            Console.WriteLine(message);

            _notification.Send("Notificación enviada", message, recipient);
            Console.WriteLine("Notificación enviada con exito.");
        }
        public void ClaimResolutionNotification(string recipient, string ticketId, string resolution)
        {
            string message = $"Se le notifica que su multa ha sido: \n\n" +
                    $"Detalles de la multa:\n" +
                    $"- ID: {ticketId}\n" +
                    $"- Resolución:{resolution}\n";


            Console.WriteLine("Mensaje de notificación antes de enviar el correo:");
            Console.WriteLine(message); // Verifica el contenido del mensaje
            Console.WriteLine("Contenido del mensaje de correo:");
            Console.WriteLine(message);

            _notification.Send("Notificación enviada", message, recipient);
            Console.WriteLine("Notificación enviada con exito.");
        }
        public async void JudgeNewClaimsNotification(string recipient, string ticketId, string description, string pdfUrl)
        {
            string message = $"Se le ha asignado un nuevo reclamo: \n\n" +
                    $"Detalles de la multa:\n" +
                    $"- ID: {ticketId}\n" +
                    $"- Detalle: {description}\n";

            Console.WriteLine("Mensaje de notificación antes de enviar el correo:");
            Console.WriteLine(message); // Verifica el contenido del mensaje
            Console.WriteLine("Contenido del mensaje de correo:");
            Console.WriteLine(message);

            using (var httpClient = new HttpClient())
            {

                var response = await httpClient.GetAsync(pdfUrl);
                var pdfStream = await response.Content.ReadAsStreamAsync();

                using (BinaryReader br = new BinaryReader(pdfStream))
                {
                    await _notification.SendEmailWithPdfAsync("Notificación enviada", message, recipient, br.ReadBytes((int)pdfStream.Length));
                    Console.WriteLine("Notificación enviada con exito.");
                }
            }
        }

        public void OfficialDisputesNotification(string recipient, string ticketId, string description)
        {
            string message = $"Se ha creado un nuevo reclamo por una multa creada por usted.\n\n" +
                    $"Detalles de la multa:\n" +
                    $"- ID: {ticketId}\n" +
                    $"- Detalle: {description}\n";


            Console.WriteLine("Mensaje de notificación antes de enviar el correo:");
            Console.WriteLine(message); // Verifica el contenido del mensaje
            Console.WriteLine("Contenido del mensaje de correo:");
            Console.WriteLine(message);

            _notification.Send("Notificacion enviada", message, recipient);
            Console.WriteLine("Notificación enviada con exito.");
        }

        public void AutomaticTicketNotification(string totalAmount, string plate, string recipient, string ticketId, string date, string description)
        {
            string message = $"Se le notifica que se ha generado una multa automática por un monto de {totalAmount}.\n\n" +
                    $"Detalles de la multa:\n" +
                    $"- ID: {ticketId}\n" +
                    $"- Número de placa: {plate}\n" +
                    $"- Fecha y hora: {date}\n" +
                    $"- Monto: {totalAmount}\n\n";

            Console.WriteLine("Mensaje de notificación antes de enviar el correo:");
            Console.WriteLine(message); // Verifica el contenido del mensaje
            Console.WriteLine("Contenido del mensaje de correo:");
            Console.WriteLine(message);

            _notification.Send("Notificación enviada", message, recipient);
            Console.WriteLine("Notificación enviada con exito.");
        }

        public void UserClaimsNotification(string recipient, string ticketId, string description)
        {
            string message = $"Se ha creado un nuevo reclamo: \n\n" +
                    $"Detalles de la multa:\n" +
                    $"- ID: {ticketId}\n" +
                    $"- Detalle: {description}\n";

            Console.WriteLine("Mensaje de notificación antes de enviar el correo:");
            Console.WriteLine(message); // Verifica el contenido del mensaje
            Console.WriteLine("Contenido del mensaje de correo:");
            Console.WriteLine(message);

            _notification.Send("Notificación enviada", message, recipient);
            Console.WriteLine("Notificación enviada con exito.");
        }

    }


    //
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

        public async Task SendEmailWithPdfAsync(string subject, string message, string recipient, byte[] pdfContent)
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

                    using (var memoryStream = new System.IO.MemoryStream(pdfContent))
                    {
                        mailMessage.Attachments.Add(new Attachment(memoryStream, subject + ".pdf"));

                        await client.SendMailAsync(mailMessage);
                    }
                    Console.WriteLine($"Correo con PDF enviado a {recipient} con el asunto: {subject}");
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error al enviar el correo con PDF: {ex.Message}");
                throw;
            }
        }
        public async Task SendEmailWithAttachmentsAsync(string subject, string message, string recipient, Dictionary<string, byte[]> attachments)
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

                    foreach (var attachment in attachments)
                    {
                        var memoryStream = new System.IO.MemoryStream(attachment.Value);
                        mailMessage.Attachments.Add(new Attachment(memoryStream, attachment.Key));
                    }

                    await client.SendMailAsync(mailMessage);
                    Console.WriteLine($"Correo enviado a {recipient} con los adjuntos.");
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
