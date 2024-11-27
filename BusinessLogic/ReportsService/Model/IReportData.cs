using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessLogic.ReportsService.Model
{
    public interface IReportData
    {
        string Title { get;}
        List<string> Headers { get; }
        List<List<string>> Rows { get;}
    }
}
