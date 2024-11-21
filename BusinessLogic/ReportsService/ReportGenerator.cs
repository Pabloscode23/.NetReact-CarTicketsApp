using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessLogic.ReportsService
{
    public class ReportGenerator
    {

        public ReportGenerator() { }
        public string GenerateReport(string reportType)
        {
            if (reportType == "PDF")
            {
                return "PDF Report";
            }
            else if (reportType == "Excel")
            {
                return "Excel Report";
            }
            else
            {
                return "Report type not supported";
            }
        }
    }
}
