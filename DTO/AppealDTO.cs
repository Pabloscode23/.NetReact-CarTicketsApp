using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace DTO
{
    public class Appeal
    {
        [Key]
        public string AppealId { get; set; }

        // Clave foránea a Claim
        [ForeignKey("Claim")]
        public string ClaimId { get; set; }
        public ClaimDTO Claim { get; set; }

        // Clave foránea a User
        [ForeignKey("User")]
        public string UserId { get; set; }
        public UserDTO User { get; set; }

        // Clave foránea a Ticket
        [ForeignKey("Ticket")]
        public string TicketId { get; set; }
        public Ticket Ticket { get; set; }
    }

}
