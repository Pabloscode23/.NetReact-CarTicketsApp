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
        public async Task<IActionResult> GenerateReport(ReportDTO reportInfo)
        {

            await _reportService.GenerateReportAsync(reportInfo.email, reportInfo.reportType);
            return Ok();
        }

    }

    public class ReportDTO
    {
        public string email { get; set; }
        public string reportType { get; set; }
    }

}
