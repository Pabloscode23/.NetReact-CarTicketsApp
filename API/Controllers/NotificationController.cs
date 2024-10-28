using Microsoft.AspNetCore.Mvc;
using Notifications;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class NotificationController : ControllerBase
    {
        private readonly INotification _notification;

        // Inyección de dependencias en el constructor
        public NotificationController(INotification notification)
        {
            _notification = notification;
        }

        [HttpPost("send")]
        public IActionResult SendNotification([FromBody] NotificationRequest request)
        {
            try
            {
                _notification.Send(request.Message, request.Recipient);
                return Ok("Notification sent");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error sending notification: {ex.Message}");
            }
        }

        [HttpPost("validate-code")]
        public IActionResult ValidateCode([FromBody] ValidateCodeRequest request)
        {
            try
            {
                // Suponiendo que _notification es de tipo EmailNotification
                var emailNotification = _notification as EmailNotification;

                if (emailNotification == null)
                {
                    return BadRequest("Notification type is not supported.");
                }

                bool isValid = emailNotification.ValidateCode(request.InputCode);
                return Ok(new { IsValid = isValid });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error validating code: {ex.Message}");
            }
        }
    }

    public class NotificationRequest
    {
        public string Message { get; set; }
        public string Recipient { get; set; }
    }

    //validacion de codigo
    public class ValidateCodeRequest
    {
        public string InputCode { get; set; }
    }
}
