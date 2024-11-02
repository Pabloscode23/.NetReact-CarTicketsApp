using Microsoft.AspNetCore.Mvc;
using Notifications;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class NotificationController : ControllerBase
    {
        private readonly NotificationService _notification;

        public NotificationController(NotificationService notification)
        {
            _notification = notification;
        }

        [HttpPost("send")]
        public IActionResult SendNotification()
        {
            _notification.Send2FA("123", "szeledonm@ucenfotec.ac.cr");
            return Ok("Notificación enviada.");
        }
    }
}
