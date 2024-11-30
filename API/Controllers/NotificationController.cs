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
            _notification.Send2FA("123", "bytedev0101@gmail.com");
            return Ok("Notificación enviada.");
        }

        [HttpPost("AutomaticUserNotification")]
        public IActionResult AutomaticacionUserNotification()
        {
            _notification.AutomaticUserNotification("100", "abc", "bytedev0101@gmail.com", "123", "24-10-2023", "100");
            return Ok("Notificación enviada.");

        }
        [HttpPost("StatusChangesNotification")]
        public IActionResult StatusChangesNotification()
        {
            _notification.StatusChangesNotification("100", "bytedev0101@gmail.com", "Resuelta", "El juez ha revisado su reclamo");
            return Ok("Notificación enviada.");

        }
        [HttpPost("ClaimResolutionNotification")]
        public IActionResult ClaimResolutionNotification()
        {
            _notification.ClaimResolutionNotification("bytedev0101@gmail.com", "123", "Anulada");
            return Ok("Notificación enviada.");

        }
        [HttpPost("JudgeNewClaimsNotification")]
        public IActionResult JudgeNewClaimsNotification()
        {
            _notification.JudgeNewClaimsNotification("bytedev0101@gmail.com", "123", "Se adjunta el documento", "https://pdfobject.com/pdf/sample.pdf");
            return Ok("Notificación enviada.");

        }
        [HttpPost("OfficialDisputesNotification")]
        public IActionResult OfficialDisputesNotification()
        {
            _notification.OfficialDisputesNotification("bytedev0101@gmail.com", "123", "Su multa sigue en proceso de revisión");
            return Ok("Notificación enviada.");

        }
        [HttpPost("AutomaticTicketNotification")]
        public IActionResult AutomaticTicketNotification()
        {
            _notification.AutomaticTicketNotification("123", "abc", "bytedev0101@gmail.com", "123", "24-10-2023", "1200");
            return Ok("Notificación enviada.");

        }
    }
}
