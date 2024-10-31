using System;
using System.Net;
using System.Net.Mail;

namespace Notifications
{
    //interfaz de notificacion
    public interface INotification
    {
        void Send(string subject, string message, string recipient);
    }

    //notificacion standaar que se va a cambiar por 2fa
    public class NotificationFA : INotification
    {
        private readonly INotification _notification;

        public NotificationFA(INotification notification)
        {
            _notification = notification;
        }

        public void Send(string subject, string message, string recipient)
        {
            _notification.Send(subject, message, recipient);
            Console.WriteLine("Notificación de 2FA enviada.");
        }
    }

    //Notificacion cambio contraseña
    public class ResetPasswordNotification : INotification
    {
        private readonly INotification _notification;

        public ResetPasswordNotification(INotification notification)
        {
            _notification = notification;
        }

        public void Send(string subject, string message, string recipient)
        {
            _notification.Send(subject, message, recipient);
            Console.WriteLine("Notificación de restablecimiento de contraseña enviada.");
        }
    }
    

        //Notificacion por correo
        public class EmailNotification : INotification
        {
            private string senderEmail = "bytedev0101@gmail.com";
            private string password = "elkr elbu jlvd qsux";

            public void Send(string subject, string message, string recipient)
            {
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
                        Subject = subject,
                        Body = message,
                        IsBodyHtml = false
                    };

                        mailMessage.To.Add(recipient);
                        client.Send(mailMessage);

                        Console.WriteLine($"Correo enviado a {recipient} con el código 2FA.");
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"Error al enviar el correo: {ex.Message}");
                    throw;
                }
            }
        }

    /*
  public interface ICodeGenerator
  {
      string GenerateCode();
      bool ValidateCode(string inputCode);
  }

  public class TwoFactorCodeGenerator : ICodeGenerator
  {
      private string _generatedCode;

      public string GenerateCode()
      {
          Random random = new Random();
          _generatedCode = random.Next(100000, 999999).ToString();
          return _generatedCode;
      }

      public bool ValidateCode(string inputCode)
      {
          return inputCode == _generatedCode;
      }
  }*/
    
}
