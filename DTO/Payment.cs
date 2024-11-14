namespace DTO
{
    public class PaymentDTO
    {
        
        public int Id { get; set; }             
        public decimal Amount { get; set; }     
        public decimal Tax { get; set; }     //IVA
        public decimal TotalAmount { get; set; } 
        public string PaymentMethod { get; set; } 

    }
}