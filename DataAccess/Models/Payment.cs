using DTO;

namespace DataAccess.Models
{
    public class Payment
    {
        public string Id { get; set; }
        public string Amount { get; set; }
        public string Tax { get; set; }
        public string TotalAmount { get; set; }
        public string PaymentMethod { get; set; }
        public string UserId { get; set; }
        public string TicketId { get; set; }

        // Relaciones con otras entidades
        public User User { get; set; }
        public Ticket Ticket { get; set; }
    }
}
