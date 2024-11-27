using BusinessLogic.PdfGenerationService;
using BusinessLogic.ReportsService.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessLogic.ReportsService.Factory
{
    public class TicketReportFactory : IReportDataFactory
    {
        private readonly AppDbContext _dbContext;

        public TicketReportFactory(AppDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<IReportData> CreateReportDataAsync()
        {
            var ticketReport = new TicketReport();
            await ticketReport.LoadDataAsync(_dbContext);
            return ticketReport;
        }
    }
}