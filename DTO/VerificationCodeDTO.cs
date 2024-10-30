

namespace DTO
{
    public class VerificationCodeDTO
    {
        public int Id { get; set; }
        public string CodeNumber { get; set; }
        public string UserEmail { get; set; }
        public string CodeType { get; set; }

        public DateTime CreatedDate { get; set; }
        public DateTime ExpiringDate { get; set; }
    }
}