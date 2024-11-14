using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using DTO;

namespace DTO
{
    public class PaymentDTO
    {
        public string Id { get; set; }
        public string Amount { get; set; }
        public string Tax { get; set; }
        public string TotalAmount { get; set; }
        public string PaymentMethod { get; set; }
        public string UserId { get; set; }
        public string TicketId { get; set; }
        public string UserEmail { get; set; }
    }
}