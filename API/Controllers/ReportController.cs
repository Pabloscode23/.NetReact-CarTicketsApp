using BusinessLogic.ReportsService;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    
    // TESTING CONTROLLER
    public class ReportController : ControllerBase
    {

        private readonly ReportService _reportService;

        public ReportController(ReportService reportService)
        {
            _reportService = reportService;
        }


        [HttpPost]
        public async Task<IActionResult> GenerateReport([FromQuery] string email)
        {
            await _reportService.GenerateReportAsync(email, "Tickets");
            return Ok();
        }

    }
}
