using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;
using System.Linq;
using DataAccess.Models;
using System; // For JWT-related functionality

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserDTOController : ControllerBase
    {
        private readonly AppDbContext _context;

        public UserDTOController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/UserDTO
        [HttpGet]
        public async Task<ActionResult<IEnumerable<User>>> GetUsers()
        {
            return await _context.Users.ToListAsync();
        }

        // GET: api/UserDTO/5
        [HttpGet("{id}")]
        public async Task<ActionResult<User>> GetUser(string id)
        {
            var user = await _context.Users.FindAsync(id);

            if (user == null)
            {
                return NotFound();
            }

            return user;
        }

        // PUT: api/UserDTO/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutUser(string id, User user)
        {
            if (id != user.UserId)
            {
                return BadRequest();
            }

            _context.Entry(user).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!UserExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/UserDTO
        [HttpPost]
        public async Task<ActionResult<object>> PostUser(User user)
        {
            _context.Users.Add(user);
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                if (UserExists(user.UserId))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            // Generate JWT for the registered user
            var token = GenerateJwtToken(user, "register");

            // Return all user attributes and JWT token
            return new
            {
                user = new
                {
                    user.UserId,
                    user.Name,
                    user.IdNumber,
                    user.Email,
                    user.Password, // Keep the plain text password here (not secure in production)
                    user.PhoneNumber,
                    user.Role,
                    user.ProfilePicture
                },
                token = token
            };
        }

        // POST: api/UserDTO/login
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDTO loginDto)
        {
            try
            {
                var user = await _context.Users
                    .FirstOrDefaultAsync(u => u.Email == loginDto.Email);

                // Check if user exists and passwords match (plain-text comparison)
                if (user == null || user.Password != loginDto.Password)
                {
                    return Unauthorized(new { message = "Invalid email or password" });
                }

                // Generate JWT for the authenticated user
                var token = GenerateJwtToken(user, "login");

                return Ok(new { token });
            }
            catch (Exception ex)
            {
                // Log the exception
                Console.WriteLine($"Error during login: {ex.Message}");
                return StatusCode(500, "An error occurred during login. Please try again.");
            }
        }

        // DELETE: api/UserDTO/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(string id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null)
            {
                return NotFound();
            }

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool UserExists(string id)
        {
            return _context.Users.Any(e => e.UserId == id);
        }

        // Updated GenerateJwtToken method to handle different contexts
        private string GenerateJwtToken(User user, string context)
        {
            // Example logic to differentiate tokens based on the context
            if (context == "register")
            {
                // Generate a token for registration (custom claims, expiration, etc.)
                return $"RegisterToken_{user.UserId}_{DateTime.Now.Ticks}";
            }
            else if (context == "login")
            {
                // Generate a different token for login (custom claims, expiration, etc.)
                return $"LoginToken_{user.UserId}_{DateTime.Now.Ticks}";
            }

            // Fallback in case of unrecognized context
            return $"DefaultToken_{user.UserId}_{DateTime.Now.Ticks}";
        }
    }

    // Create a simple DTO for login requests
    public class LoginDTO
    {
        public string Email { get; set; }
        public string Password { get; set; }
    }
}
