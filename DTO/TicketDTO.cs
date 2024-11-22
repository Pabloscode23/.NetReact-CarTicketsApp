using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;

using System.Text;
using System.Threading.Tasks;

namespace DTO
{
    public class TicketDTO
    {
        [Key]
        public string Id { get; set; }
        [Required]
        [ForeignKey("User")]
        public string UserId { get; set; }
        [Required]
        public DateTime Date { get; set; }
        [Required]
        public Double Latitude { get; set; }
        [Required]
        public Double Longitude { get; set; }
        [Required]
        public string Description { get; set; }
        [Required]
        public string Status { get; set; }
        [Required]
        public string OfficerId { get; set; }
        public double Amount { get; set; }
        public string Plate { get; set; }


    }
}