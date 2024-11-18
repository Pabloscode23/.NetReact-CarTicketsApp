using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;
using System.Linq;
using DataAccess.Models;
using Notifications;
using BusinessLogic.AuthService;
using Microsoft.AspNetCore.Authorization;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using DTO;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserDTOController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly AuthService _authService;
        private readonly IConfiguration _configuration;

        public UserDTOController(AppDbContext context, AuthService authService, IConfiguration configuration)
        {
            _context = context;
            _authService = authService;
            _configuration = configuration;
        }


        // GET: api/UserDTO
        [HttpGet]
        public async Task<ActionResult<IEnumerable<UserDTO>>> GetUsers()
        {
            var users = await _context.Users
                .Include(u => u.ClaimsAsJudge) // Suponiendo que haya una relación Claims con el usuario
                .ToListAsync();

            // Mapeamos los usuarios a un DTO para no exponer directamente el modelo de la base de datos
            var userDtos = users.Select(u => new UserDTO
            {
                UserId = u.UserId,
                IdNumber = u.IdNumber,
                Name = u.Name,
                Email = u.Email,
                Role = u.Role,
                Password = u.Password,
                ProfilePicture = u.ProfilePicture,
                PhoneNumber = u.PhoneNumber,
                Claims = u.ClaimsAsJudge.Select(c => new ClaimDTO
                {
                    ClaimId = c.ClaimId,
                    ClaimDocument = c.ClaimDocument,
                    Status = c.Status,
                    CreatedAt = c.CreatedAt,
                    UpdatedAt = c.UpdatedAt,
                    TicketId = c.TicketId,
                }).ToList()
                .ToList()
            }).ToList();

            return Ok(userDtos);
        }


        // GET: api/UserDTO/5
        [HttpGet("{id}")]
        public async Task<ActionResult<UserDTO>> GetUser(string id)
        {
            // Buscar al usuario por ID
            var u = await _context.Users
                .Include(u => u.ClaimsAsJudge) // Incluir la navegación para evitar lazy loading
                .FirstOrDefaultAsync(u => u.UserId == id);

            if (u == null)
            {
                return NotFound();
            }

            // Construir el objeto UserDTO
            var userDTO = new UserDTO
            {
                UserId = u.UserId,
                IdNumber = u.IdNumber,
                Name = u.Name,
                Email = u.Email,
                Role = u.Role,
                Password = u.Password,
                ProfilePicture = u.ProfilePicture,
                PhoneNumber = u.PhoneNumber,
                Claims = u.ClaimsAsJudge?
                    .Select(c => new ClaimDTO
                    {
                        ClaimId = c.ClaimId,
                        ClaimDocument = c.ClaimDocument,
                        Status = c.Status,
                        CreatedAt = c.CreatedAt,
                        UpdatedAt = c.UpdatedAt,
                        TicketId = c.TicketId,
                    })
                    .ToList() 
            };

            return userDTO;
        }


        // PUT: api/UserDTO/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutUser(string id, UpdateUserDTO userDto)
        {
            if (id != userDto.UserId)
            {
                return BadRequest(new { message = "El ID en la URL no coincide con el ID del cuerpo de la solicitud." });
            }

            var user = await _context.Users.FindAsync(id);
            if (user == null)
            {
                return NotFound(new { message = "Usuario no encontrado." });
            }

            user.Name = userDto.Name;
            user.Email = userDto.Email;
            user.IdNumber = userDto.IdNumber;
            user.PhoneNumber = userDto.PhoneNumber;
            user.ProfilePicture = userDto.ProfilePicture;

            if (!string.IsNullOrEmpty(userDto.Password))
            {
                user.Password = userDto.Password;
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
                    return NotFound(new { message = "Conflicto de concurrencia: Usuario no existe." });
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        private string HashPassword(string password)
        {
            return BCrypt.Net.BCrypt.HashPassword(password);
        }


        // PUT: api/UserDTO/ChangePassword/5
        [HttpPut("ChangePassword/{token}")]
        public async Task<IActionResult> ChangePassword(string token, ChangePasswordDTO changePasswordDTO)
        {

            var id = token.Substring(0, 9);

            var user = await _context.Users
                    .FirstOrDefaultAsync(u => u.IdNumber == id);

            if (user == null)
            {
                return BadRequest(id);
            }

            user.Password = changePasswordDTO.newPassword;

            _context.Entry(user).Property(u => u.Password).IsModified = true;

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

            return Ok("Contraseña modificada satisfactoriamente.");
        }

        // POST: api/UserDTO
        [HttpPost]
        public async Task<ActionResult<object>> PostUser(CreateUserDTO user)
        {

            var newUser = new User
            {
                IdNumber = user.IdNumber,
                Name = user.Name,
                Email = user.Email,
                PhoneNumber = user.PhoneNumber,
                Role = user.Role,
                ProfilePicture = user.ProfilePicture,
                UserId = user.IdNumber,
                Password = user.Password
            };

            _context.Users.Add(newUser);
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                if (UserExists(newUser.UserId))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            // Return all user attributes without token
            return Ok("Usuario creado exitosamente.");
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
                    return Unauthorized(new { message = "Correo electrónico o contraseña incorrectos" });
                }

                // Handle Code Generation
                var res = await _authService.CodeSendingHandlingAsync(user.Email, "2FA");

                if (res == "Código enviado exitosamente.")
                {
                    return Ok(new { message = "Se ha enviado un código a su correo." });
                }
                else
                {
                    return BadRequest("Error en la servicio.");
                }

            }
            catch (Exception ex)
            {
                // Log the exception
                Console.WriteLine($"Error en el login: {ex.Message}");
                return StatusCode(500, "Un error inesperado ocurrió durante el login");
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

        // Retrieve User from Token

        [HttpGet("details")]
        [Authorize]
        public async Task<IActionResult> GetUserDetails()
        {
            var token = HttpContext.Request.Headers["Authorization"].ToString().Replace("Bearer ", "");

            if (string.IsNullOrEmpty(token))
            {
                return Unauthorized("No token provided.");
            }

            var tokenHandler = new JwtSecurityTokenHandler();
            var validationParameters = new TokenValidationParameters
            {
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["JwtSettings:SecretKey"])),
                ValidateIssuer = true,
                ValidIssuer = _configuration["JwtSettings:Issuer"],
                ValidateAudience = true,
                ValidAudience = _configuration["JwtSettings:Audience"],
                ClockSkew = TimeSpan.Zero
            };

            try
            {
                // Validar el token
                var principal = tokenHandler.ValidateToken(token, validationParameters, out var validatedToken);
                var userId = principal.FindFirst(ClaimTypes.NameIdentifier)?.Value;

                if (string.IsNullOrEmpty(userId))
                {
                    return Unauthorized("Invalid token: User ID not found.");
                }

                // Cargar al usuario con las relaciones necesarias
                var user = await _context.Users
                    .Include(u => u.ClaimsAsJudge) // Incluir la relación de reclamos
                    .ThenInclude(c => c.Ticket)   // Incluir la relación de tickets
                    .FirstOrDefaultAsync(u => u.UserId == userId);

                if (user == null)
                {
                    return NotFound("User not found.");
                }

                // Preparar los claims si existen
                var claims = user.ClaimsAsJudge?
                    .Select(c => new ClaimDTO
                    {
                        ClaimId = c.ClaimId,
                        ClaimDocument = c.ClaimDocument,
                        Status = c.Status,
                        CreatedAt = c.CreatedAt,
                        UpdatedAt = c.UpdatedAt,
                        TicketId = c.TicketId,
                        Ticket = c.Ticket == null ? null : new TicketDTO
                        {
                            Description = c.Ticket.Description // Ajusta según los atributos de tu modelo de Ticket
                        }
                    })
                    .ToList();

                // Retornar información del usuario
                return Ok(new
                {
                    user.IdNumber,
                    user.PhoneNumber,
                    user.Role,
                    user.Email,
                    user.Name,
                    user.ProfilePicture,
                    Claims = claims // Devolver la lista de claims
                });
            }
            catch (SecurityTokenExpiredException)
            {
                return Unauthorized("Token has expired.");
            }
            catch (Exception ex)
            {
                Console.Error.WriteLine(ex.Message); // Loguear el error para diagnóstico
                return Unauthorized("Invalid token.");
            }
        }


    }

    // Create a simple DTO for login requests
    public class LoginDTO
    {
        public string Email { get; set; }
        public string Password { get; set; }
    }

    public class ChangePasswordDTO
    {
        public string newPassword { get; set; }
    }

    public class UpdateUserDTO
    {
        public string UserId { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public string IdNumber { get; set; }
        public string Password { get; set; }    
        public string PhoneNumber { get; set; }
        public string ProfilePicture { get; set; }

    }

        public class CreateUserDTO
    {
        public string UserId { get; set; }
        public string Name { get; set; }

        public string IdNumber { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public string PhoneNumber { get; set; }
        public string Role { get; set; }
        public string ProfilePicture { get; set; }

    }
 }
