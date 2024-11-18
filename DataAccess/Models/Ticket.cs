using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using DataAccess;
using System.Linq;

using System.Text;
using System.Threading.Tasks;
using DataAccess.Models;

namespace DataAccess.Models
{
    public class Ticket
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

       // La relación con Claim es opcional
        public virtual Claim Claim { get; set; }

    }
}