using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataAccess.Models
{
    public class TicketType
    {
        [Key]
        public int Id { get; set; }
        public double Amount { get; set; }
        public string Description { get; set; }
    }
}
