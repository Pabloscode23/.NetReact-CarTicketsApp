using BusinessLogic.ReportsService.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessLogic.ReportsService.Factory
{
    public interface IReportDataFactory
    {
        Task<IReportData> CreateReportDataAsync();
    }
}
