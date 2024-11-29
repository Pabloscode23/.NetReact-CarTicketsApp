using BusinessLogic.PdfGenerationService;
using DataAccess.Models;
using DTO;
using Notifications;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using System.Xml.Linq;

namespace BusinessLogic
{
    public class PaymentService
    {
        private readonly AppDbContext _context;
        private readonly INotification _notification;
        private readonly PdfGenerator _pdfGenerator;
        private readonly UserService _userService;

        // Constructor actualizado
        public PaymentService(AppDbContext context, INotification notification, PdfGenerator pdfGenerator, UserService userService)
        {
            _context = context ?? throw new ArgumentNullException(nameof(context));
            _notification = notification ?? throw new ArgumentNullException(nameof(notification));
            _pdfGenerator = pdfGenerator ?? throw new ArgumentNullException(nameof(pdfGenerator));
            _userService = userService ?? throw new ArgumentNullException(nameof(userService));
        }

        // POST: Agregar un nuevo pago
        public async Task<PaymentDTO> AddPaymentAsync(PaymentDTO paymentDto)
        {
            if (string.IsNullOrEmpty(paymentDto.Id))
                throw new Exception("Payment ID is required.");
            if (string.IsNullOrEmpty(paymentDto.UserEmail))
                throw new Exception("User email is required for notification.");

            var payment = new Payment
            {
                Id = paymentDto.Id,
                Amount = paymentDto.Amount,
                Tax = paymentDto.Tax,
                TotalAmount = paymentDto.TotalAmount,
                PaymentMethod = paymentDto.PaymentMethod,
                UserId = paymentDto.UserId,
                TicketId = paymentDto.TicketId
            };

            _context.Payments.Add(payment);
            await _context.SaveChangesAsync();
            paymentDto.Id = payment.Id;

            var ticket = await _context.Tickets.FindAsync(paymentDto.TicketId)
                ?? throw new Exception("Ticket not found.");

            var user = await _userService.GetUserByIdAsync(paymentDto.UserId);

            string htmlContent = await GenerateInvoiceHtml(paymentDto, ticket, user.Name);
            byte[] pdfContent = await _pdfGenerator.GeneratePdfAsync(htmlContent);

            string xmlContent = GenerateInvoiceXml(paymentDto, ticket, user.Name);
            byte[] xmlBytes = System.Text.Encoding.UTF8.GetBytes(xmlContent);

            await _notification.SendEmailWithAttachmentsAsync(
                "Factura Electrónica del Pago",
                "Factura electrónica adjunta.",
                paymentDto.UserEmail,
                new Dictionary<string, byte[]>
                {
                    { "Factura Electrónica del Pago.pdf", pdfContent },
                    { "Factura Electrónica del Pago.xml", xmlBytes }
                }
            );

            return paymentDto;
        }

        // Generar HTML para la factura
        private async Task<string> GenerateInvoiceHtml(PaymentDTO paymentDto, Ticket ticket, string userName)
        {
            return $@"
      <html>
        <head>
            <style>
                body {{
                    font-family: Arial, sans-serif;
                    margin: 0;
                    padding: 0;
                    background-color: #f4f4f4;
                }}

                .invoice-container {{
                    width: 80%;
                    margin: 20px auto;
                    padding: 20px;
                    background-color: #fff;
                    border: 1px solid #ddd;
                    border-radius: 8px;
                }}

                .invoice-header {{
                    text-align: center;
                    margin-bottom: 20px;
                }}

                .invoice-header h1 {{
                    font-size: 24px;
                    margin: 0;
                }}

                .invoice-header p {{
                    font-size: 16px;
                    color: #555;
                }}

                .invoice-details,
                .client-details,
                .payment-details {{
                    margin-bottom: 30px;
                }}

                .invoice-details table,
                .client-details table,
                .payment-details table {{
                    width: 100%;
                    border-collapse: collapse;
                    margin-bottom: 20px;
                }}

                th,
                td {{
                    padding: 8px 12px;
                    text-align: left;
                    border: 1px solid #ddd;
                }}

                th {{
                    background-color: #f2f2f2;
                }}

                .footer {{
                    text-align: center;
                    font-size: 14px;
                    color: #777;
                    margin-top: 20px;
                }}

                .total-amount {{
                    font-size: 20px;
                    font-weight: bold;
                    color: #4CAF50;
                }}
            </style>
        </head>
        <body>
            <div class='invoice-container'>
                <!-- Header -->
                <div class='invoice-header'>
                    <h1>Factura Electrónica</h1>
                    <p>Fecha de emisión: <strong>{DateTime.Now.ToString("dd/MM/yyyy")}</strong></p>
                    <p>Factura N°: <strong>{paymentDto.Id}</strong></p>
                </div>

                <!-- Client Details -->
                <div class='client-details'>
                    <h2>Datos del Usuario</h2>
                    <table>
                        <tr>
                            <th>Nombre</th>
                            <td>{userName}</td> <!-- Displaying user's name -->
                        </tr>
                        <tr>
                            <th>Número de cédula</th>
                            <td>{ticket.UserId}</td>
                        </tr>
                    </table>
                </div>

                <!-- Invoice Details -->
                <div class='invoice-details'>
                    <h2>Detalles de la Multa</h2>
                    <table>
                        <tr>
                            <th>ID de la multa</th>
                            <td>{ticket.Id}</td>
                        </tr>
                        <tr>
                            <th>Descripción de la multa</th>
                            <td>{ticket.Description}</td>
                        </tr>
                        <tr>
                            <th>Monto sin IVA</th>
                            <td>₡{paymentDto.Amount}</td>
                        </tr>
                        <tr>
                            <th>IVA</th>
                            <td>{paymentDto.Tax}</td>
                        </tr>
                        <tr>
                            <th>Total con IVA</th>
                            <td>₡{paymentDto.TotalAmount}</td>
                        </tr>
                    </table>
                </div>

                <!-- Payment Details -->
                <div class='payment-details'>
                    <h2>Detalles de Pago</h2>
                    <table>
                        <tr>
                            <th>Método de Pago</th>
                            <td>{paymentDto.PaymentMethod}</td>
                        </tr>
                        <tr>
                            <th>Fecha de Pago</th>
                            <td>{DateTime.Now}</td>
                        </tr>
                    </table>
                </div>

                <!-- Total Amount -->
                <div class='total-amount'>
                    <p><strong>Total a Pagar: ₡{paymentDto.TotalAmount}</strong></p>
                </div>

                <!-- Footer -->
                <div class='footer'>
                    <p>Gracias por su pago.</p>
                    <p>Para cualquier consulta, no dude en ponerse en contacto con nosotros.</p>
                </div>
            </div>
        </body>
    </html>";
        }

        // Generar XML para la factura
        private string GenerateInvoiceXml(PaymentDTO paymentDto, Ticket ticket, string userName)
        {
            var xml = new XDocument(
                new XElement("FacturaElectronica",
                    new XElement("DatosUsuario",
                        new XElement("Nombre", userName),
                        new XElement("NumeroCedula", ticket.UserId)
                    ),
                    new XElement("DetallesMulta",
                        new XElement("IDMulta", ticket.Id),
                        new XElement("DescripcionMulta", ticket.Description),
                        new XElement("MontoSinIVA", paymentDto.Amount),
                        new XElement("IVA", paymentDto.Tax),
                        new XElement("TotalConIVA", paymentDto.TotalAmount)
                    ),
                    new XElement("DetallesPago",
                        new XElement("MetodoPago", paymentDto.PaymentMethod),
                        new XElement("FechaPago", DateTime.Now.ToString("yyyy-MM-ddTHH:mm:ss"))
                    )
                )
            );
            return xml.ToString();
        }

        // GET: Recuperar pago por ID
        public async Task<PaymentDTO> GetPaymentByIdAsync(string paymentId)
        {
            var payment = await _context.Payments.FindAsync(paymentId)
                ?? throw new Exception("Payment not found.");

            return new PaymentDTO
            {
                Id = payment.Id,
                Amount = payment.Amount,
                Tax = payment.Tax,
                TotalAmount = payment.TotalAmount,
                PaymentMethod = payment.PaymentMethod,
                UserId = payment.UserId,
                TicketId = payment.TicketId
            };
        }

        // GET: Recuperar todos los pagos
        public async Task<IEnumerable<PaymentDTO>> GetAllPaymentsAsync()
        {
            return await _context.Payments
                .Select(p => new PaymentDTO
                {
                    Id = p.Id,
                    Amount = p.Amount,
                    Tax = p.Tax,
                    TotalAmount = p.TotalAmount,
                    PaymentMethod = p.PaymentMethod,
                    UserId = p.UserId,
                    TicketId = p.TicketId
                })
                .ToListAsync();
        }
    }
}
