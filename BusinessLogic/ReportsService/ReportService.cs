using BusinessLogic.PdfGenerationService;
using BusinessLogic.ReportsService.Factory;
using Notifications;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessLogic.ReportsService
{
    using BusinessLogic.ReportsService.Model;
    using Notifications;

    public class ReportService
    {
        private readonly ReportGeneratorFactory _factory;
        private readonly ReportHTMLBuilder _htmlBuilder;
        private readonly PdfGenerator _pdfGenerator;
        private readonly INotification _notification;

        public ReportService(
            ReportGeneratorFactory factory,
            ReportHTMLBuilder htmlBuilder,
            PdfGenerator pdfGenerator,
            INotification notification)
        {
            _factory = factory;
            _htmlBuilder = htmlBuilder;
            _pdfGenerator = pdfGenerator;
            _notification = notification;
        }

        public async Task GenerateReportAsync(string email, string reportType)
        {
            try
            {
                // Obtener los datos del reporte de manera asincrónica
                var reportData = await _factory.GetFactoryAsync(reportType);

                // Generar HTML
                var html = _htmlBuilder.GenerateReport(
                    reportData.Title,
                    DateTime.Now,
                    reportData.Headers,
                    reportData.Rows
                );

                // Generar PDF
                var pdfContent = await _pdfGenerator.GeneratePdfAsync(html);

                // Enviar el correo
                await _notification.SendEmailWithPdfAsync(
                    "Reporte generado",
                    "Por favor, encuentre adjunto el reporte solicitado.",
                    email,
                    pdfContent
                );
            }
            catch (Exception ex)
            {
                // Aquí puedes loggear el error
                throw new ApplicationException($"Error al generar el reporte: {ex.Message}", ex);
            }
        }
    }
}
