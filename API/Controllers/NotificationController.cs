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
    }

    public class NotificationRequest
    {
        public string Message { get; set; }
        public string Recipient { get; set; }
    }
}
