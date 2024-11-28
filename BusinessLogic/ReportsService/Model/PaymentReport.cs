using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessLogic.ReportsService.Model
{
    public class PaymentReport : IReportData
    {
        public string Title => "Reporte de Pagos";

        public List<string> Headers => new List<string> { "Id", "Id Multa", "Usuario", "Método de Pago", "Subtotal", "Impuesto" };

        public List<List<string>> Rows { get; private set; } = new List<List<string>>();

        public async Task LoadDataAsync(AppDbContext dbContext)
        {
            Rows = await dbContext.Payments
                .Select(t => new List<string>
                {
                    t.Id.ToString(),
                    t.TicketId.ToString(),
                    t.UserId.ToString(),
                    t.PaymentMethod,
                    "₡" + t.Amount,
                    "₡" + t.Tax
                })
                .ToListAsync();
        }
    }
}
