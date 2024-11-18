using DTO;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataAccess.Models
{
    public class Claim
    {
        [Key] // Define la clave primaria
        public string ClaimId { get; set; }

        [Required] // Indica que esta propiedad es obligatoria
        public string ClaimDocument { get; set; }

        [MaxLength(50)] // Limita la longitud de la propiedad
        public string Status { get; set; }

        [Required] // La fecha de creación es obligatoria
        public DateTime CreatedAt { get; set; }

        [Required] // La fecha de actualización es obligatoria
        public DateTime UpdatedAt { get; set; }

        // Definición de las relaciones (ForeignKey)
        [Required]
        [ForeignKey("Judge")] // Relación con la entidad "User" (como el juez)
        public string JudgeId { get; set; }

        [Required]
        [ForeignKey("Ticket")] // Relación con la entidad "Ticket"
        public string TicketId { get; set; }

        // Propiedades de navegación
        public virtual User Judge { get; set; }
        public virtual Ticket Ticket { get; set; }
    }
}
