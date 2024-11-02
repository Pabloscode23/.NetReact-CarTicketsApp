﻿using Microsoft.AspNetCore.Mvc;
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
                ClockSkew = TimeSpan.Zero // Remove delay of token when expired
            };

            try
            {
                var principal = tokenHandler.ValidateToken(token, validationParameters, out var validatedToken);
                var userId = principal.FindFirst(ClaimTypes.NameIdentifier)?.Value; // Or whichever claim you need

                // Fetch user information from your database using userId
                var user = await _context.Users.FindAsync(userId);

                if (user != null)
                {
                    return Ok(new
                    {
                        user.IdNumber,
                        user.PhoneNumber,
                        user.Role,
                        user.Email,
                        user.Name,
                        user.ProfilePicture
                    });
                }

                return NotFound("User not found.");
            }
            catch (SecurityTokenExpiredException)
            {
                return Unauthorized("Token has expired.");
            }
            catch (Exception)
            {
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
}
