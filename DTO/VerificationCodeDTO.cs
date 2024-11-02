

using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace DTO
{
    public class VerificationCodeDTO
    {
        [Key]
        public int Id { get; set; }
        [Required]
        public string CodeNumber { get; set; }
        [Required]
        public string UserEmail { get; set; }

        public bool IsUsed { get; set; } = false;   

        public DateTime CreatedDate { get; set; }
        public DateTime ExpiringDate { get; set; }

        public VerificationCodeDTO() // Constructor para establecer las fechas
        {
            CreatedDate = DateTime.Now;
            ExpiringDate = CreatedDate.AddMinutes(5);
        }
    }
}