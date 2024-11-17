using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DTO
{
    //Aquí se definen los atributos que tendrá el objeto UserDTO
    public class UserDTO
    {
        [Key]
        public string UserId { get; set; }
        [Required]
        public string Name { get; set; }
        [Required]
        public string IdNumber { get; set; }
        [Required]
        public string Email { get; set; }
        [Required]
        public string Password { get; set; }
        [Required]
        public string PhoneNumber { get; set; }
        [Required]
        public string Role { get; set; }

        public string ProfilePicture { get; set; }

        public List<ClaimDTO> Claims { get; set; }
    }
}