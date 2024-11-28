using BusinessLogic.ReportsService.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessLogic.ReportsService.Factory
{
    public class PaymentReportFactory : IReportDataFactory
    {
        private readonly AppDbContext _dbContext;

        public PaymentReportFactory(AppDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<IReportData> CreateReportDataAsync()
        {
            var paymentReport = new PaymentReport();
            await paymentReport.LoadDataAsync(_dbContext);
            return paymentReport;
        }
    }
}
