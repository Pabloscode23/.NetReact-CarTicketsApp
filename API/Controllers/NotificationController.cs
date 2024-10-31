using Microsoft.AspNetCore.Mvc;
using Notifications;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class NotificationController : ControllerBase
    {
        private readonly NotificationFA _notificationFA;

        public NotificationController(NotificationFA notificationFA)
        {
            _notificationFA = notificationFA;
        }

        [HttpPost("send")]
        public IActionResult SendNotification()
        {
            _notificationFA.Send("Código de prueba", "Este es un mensaje de prueba.", "example@gmail.com");
            return Ok("Notificación enviada.");
        }
    }
}
