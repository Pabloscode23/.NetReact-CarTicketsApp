using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessLogic.ReportsService
{
    public class ReportHTMLBuilder
    {
        private readonly string _templatePath;

        public ReportHTMLBuilder(string templatePath) {
            _templatePath = templatePath;
        }

        public string GenerateReport(string title, DateTime reportDate, List<string> headers, List<List<string>> rows)
        {
            var template = File.ReadAllText(_templatePath);

            template = template.Replace("{ReportTitle}", title)
                .Replace("{ReportDate}", reportDate.ToString("yyyy-MM-dd"))
                .Replace("{TableHeaders}", GenerateTableHeaders(headers))
                .Replace("{TableRows}", GenerateTableRows(rows));

            return template;
        }

        private string GenerateTableHeaders(List<string> headers)
        {
            var tableHeaders = new StringBuilder();

            foreach (var header in headers)
            {
                tableHeaders.Append($"<th>{header}</th>");
            }

            return tableHeaders.ToString();
        }

        private string GenerateTableRows(List<List<string>> rows)
        {
            var tableRows = new StringBuilder();

            foreach (var row in rows)
            {
                tableRows.Append("<tr>");

                foreach (var cell in row)
                {
                    tableRows.Append($"<td>{cell}</td>");
                }

                tableRows.Append("</tr>");
            }

            return tableRows.ToString();
        }

    }
}
