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
        // Asegurarse de que el ID no sea nulo
        if (string.IsNullOrEmpty(paymentDto.Id))
        {
            throw new Exception("Payment ID is required.");
        }

        // Asegurarse de que el email no sea nulo
        if (string.IsNullOrEmpty(paymentDto.UserEmail))
        {
            throw new Exception("User email is required for notification.");
        }

        // Crear la entidad Payment con el ID y email proporcionado por el frontend
        var payment = new Payment
        {
            Id = paymentDto.Id,  // Establecer el ID proporcionado por el frontend
            Amount = paymentDto.Amount,
            Tax = paymentDto.Tax,
            TotalAmount = paymentDto.TotalAmount,
            PaymentMethod = paymentDto.PaymentMethod,
            UserId = paymentDto.UserId,  // Asigna solo el ID del usuario
            TicketId = paymentDto.TicketId  // Asigna solo el ID del ticket
        };

        // Agregar y guardar cambios
        _context.Payments.Add(payment);
        await _context.SaveChangesAsync();

        // Mapear nuevamente a DTO después de guardar
        paymentDto.Id = payment.Id;

        // Obtener el correo del usuario desde el frontend
        var userEmail = paymentDto.UserEmail;  // Usar el email desde el DTO

        // Enviar notificación de pago exitoso
        _notificationService.PaymentSuccessNotification(paymentDto.TotalAmount, userEmail);

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
