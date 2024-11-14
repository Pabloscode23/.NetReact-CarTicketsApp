using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace DTO
{
    public class ClaimDTO
    {
        [Key]
        public string ClaimId { get; set; }
        [Required]
        public string ClaimDocument { get; set; }

        public string Status { get; set; }

        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set;}

        [ForeignKey("Judge")] // Nombre de la propuedad de navegación
        public string JudgeId { get; set; }

        // Propiedad de navegación
        public UserDTO Judge { get; set; }

    }
}
