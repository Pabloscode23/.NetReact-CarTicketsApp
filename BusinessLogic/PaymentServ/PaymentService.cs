using DataAccess.Models;
using DTO;
using Microsoft.EntityFrameworkCore;
using Notifications;

public class PaymentService
{
    private readonly AppDbContext _context;
    private readonly NotificationService _notificationService;

    public PaymentService(AppDbContext context, NotificationService notificationService)
    {
        _context = context;
        _notificationService = notificationService;
    }

    // POST: Agregar un nuevo pago
    public async Task<PaymentDTO> AddPaymentAsync(PaymentDTO paymentDto)
    {
        // Validar el ID y el email
        if (string.IsNullOrEmpty(paymentDto.Id))
        {
            throw new Exception("Payment ID is required.");
        }

        if (string.IsNullOrEmpty(paymentDto.UserEmail))
        {
            throw new Exception("User email is required for notification.");
        }

        // Crear y guardar el pago
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

        // Mapear a DTO después de guardar
        paymentDto.Id = payment.Id;

        // Obtener detalles del ticket para la notificación
        var ticket = await _context.Tickets.FindAsync(paymentDto.TicketId);
        if (ticket == null)
        {
            throw new Exception("Ticket not found.");
        }

        // Enviar notificación de pago exitoso con detalles del ticket
        _notificationService.PaymentSuccessNotification(
            paymentDto.TotalAmount,
            paymentDto.UserEmail,
            ticket.Id,
            paymentDto.Amount,
            paymentDto.PaymentMethod
        );

        return paymentDto;
    }

    // Obtener todos los pagos
    public async Task<IEnumerable<PaymentDTO>> GetAllPaymentsAsync()
    {
        return await _context.Payments
            .Select(payment => new PaymentDTO
            {
                Id = payment.Id,
                Amount = payment.Amount,
                Tax = payment.Tax,
                TotalAmount = payment.TotalAmount,
                PaymentMethod = payment.PaymentMethod,
                UserId = payment.UserId,
                TicketId = payment.TicketId
            })
            .ToListAsync();
    }

    // Obtener un pago por ID
    public async Task<PaymentDTO> GetPaymentByIdAsync(string id)
    {
        var payment = await _context.Payments.FindAsync(id);
        if (payment == null)
        {
            return null;
        }

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
}
