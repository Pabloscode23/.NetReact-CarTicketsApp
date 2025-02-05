﻿using BusinessLogic.ReportsService.Model;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace BusinessLogic.ReportsService.Factory
{
    public class ReportGeneratorFactory
    {
        private readonly Dictionary<string, IReportDataFactory> _factories;

        // Constructor que recibe las diferentes fábricas
        public ReportGeneratorFactory(
            TicketReportFactory ticketFactory,
            PaymentReportFactory paymentFactory,
            ClaimReportFactory claimFactory
        )
        {
            // Inicializa el diccionario con las fábricas disponibles
            _factories = new Dictionary<string, IReportDataFactory>
            {
                { "Tickets", ticketFactory },
                { "Payments", paymentFactory },
                { "Claims", claimFactory }
            };
        }

        // Método para obtener la fábrica correcta
        public async Task<IReportData> GetFactoryAsync(string reportType)
        {
            if (_factories.TryGetValue(reportType, out var factory))
            {
                // Crea el reporte usando la fábrica encontrada de manera asincrónica
                return await factory.CreateReportDataAsync();
            }

            throw new ArgumentException($"Reporte no válido: {reportType}");
        }
    }
}
