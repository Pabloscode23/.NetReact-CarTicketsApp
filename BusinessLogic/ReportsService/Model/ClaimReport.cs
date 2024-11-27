using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessLogic.ReportsService.Model
{
    public class ClaimReport : IReportData
    {
        public string Title => "Reporte de Reclamos";

        public List<string> Headers => new List<string> { "Id", "Fecha", "Juez", "Infraccion", "Estado", "URL Reclamo" };

        public List<List<string>> Rows { get; private set; } = new List<List<string>>();

        public async Task LoadDataAsync(AppDbContext dbContext)
        {
            Rows = await dbContext.Claims
            .OrderByDescending(t => t.CreatedAt) // Ordenar por fecha descendente
            .Select(t => new List<string>
            {
                t.ClaimId.ToString(),
                t.CreatedAt.ToString("yyyy-MM-dd"),
                t.Judge.Name,
                t.Ticket.Description,
                t.Status,
                "<a href='" + t.ClaimDocument + "'>Ver</a>"
            })
            .ToListAsync();

        }
    }
}
