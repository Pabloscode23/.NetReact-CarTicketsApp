using BusinessLogic.ReportsService.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessLogic.ReportsService.Factory
{
    public class ClaimReportFactory : IReportDataFactory
    {
        private readonly AppDbContext _dbContext;

        public ClaimReportFactory(AppDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<IReportData> CreateReportDataAsync()
        {
            var claimReport = new ClaimReport();
            await claimReport.LoadDataAsync(_dbContext);
            return claimReport;
        }
    }
}
