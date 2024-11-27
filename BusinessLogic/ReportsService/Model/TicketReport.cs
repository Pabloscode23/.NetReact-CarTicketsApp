using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessLogic.ReportsService.Model
{
    public class TicketReport: IReportData
    {
        public string Title => "Reporte de Multas";

        public List<string> Headers => new List<string> { "Id", "Usuario", "Oficial", "Fecha", "Tipo de Multa", "Precio", "Estado", };

        public List<List<string>> Rows { get; private set; } = new List<List<string>>();

        public async Task LoadDataAsync(AppDbContext dbContext)
        {
            Rows = await dbContext.Tickets
                .Select(t => new List<string>
                {
                    t.Id.ToString(),
                    t.UserId.ToString(),
                    t.OfficerId.ToString(),
                    t.Date.ToString("yyyy-MM-dd"),
                    t.Description,
                    t.Amount.ToString("C", new System.Globalization.CultureInfo("es-CR")),
                    t.Status
                })
                .ToListAsync();
        }
    }
}
