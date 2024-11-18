
using System.Security.Claims;

namespace DataAccess.Models 
{
    public class User
    {

        public string UserId { get; set; }
        public string Name { get; set; }
        public string IdNumber { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public string PhoneNumber { get; set; }
        public string Role { get; set; }
        public string ProfilePicture { get; set; }

        // Relación de uno a muchos con Claims
        public ICollection<Claim> ClaimsAsJudge { get; set; }
    }
}
