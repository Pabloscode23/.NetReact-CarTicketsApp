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

        [HttpPost("AutomaticUserNotification")]
        public IActionResult AutomaticacionUserNotification()
        {
            _notification.AutomaticacionUserNotification("100","fmadrigalf@ucenfotec.ac.cr","123","24-10-2023","100");
            return Ok("Notificación enviada.");

        }
         [HttpPost("StatusChangesNotification")]
        public IActionResult StatusChangesNotification()
        {
            _notification.StatusChangesNotification("100","fmadrigalf@ucenfotec.ac.cr","Resuelta","El juez ha revisado su reclamo");
            return Ok("Notificación enviada.");

        }
         [HttpPost("ClaimResolutionNotification")]
        public IActionResult ClaimResolutionNotification()
        {
            _notification.ClaimResolutionNotification("fmadrigalf@ucenfotec.ac.cr","123","Anulada");
            return Ok("Notificación enviada.");

        }
         [HttpPost("JudgeNewClaimsNotification")]
        public IActionResult JudgeNewClaimsNotification()
        {
            _notification.JudgeNewClaimsNotification("fmadrigalf@ucenfotec.ac.cr","123","Se adjunta el documento","https://pdfobject.com/pdf/sample.pdf");
            return Ok("Notificación enviada.");

        }
         [HttpPost("OfficialDisputesNotification")]
        public IActionResult OfficialDisputesNotification()
        {
            _notification.OfficialDisputesNotification("fmadrigalf@ucenfotec.ac.cr","123","Su multa sigue en proceso de revision");
            return Ok("Notificación enviada.");

        }
        [HttpPost("AutomaticTicketNotification")]
        public IActionResult AutomaticTicketNotification()
        {
            _notification.AutomaticTicketNotification("123","fmadrigalf@ucenfotec.ac.cr","123","24-10-2023","1200");
            return Ok("Notificación enviada.");

        }
        [HttpPost("UserClaimsNotification")]
        public IActionResult UserClaimsNotification()
        {
            _notification.UserClaimsNotification("fmadrigalf@ucenfotec.ac.cr","123","tengo hambre");
            return Ok("Notificación enviada.");

        }
    }

}
