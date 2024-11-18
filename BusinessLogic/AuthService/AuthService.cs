using DataAccess.Models;
using DTO;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using Notifications;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace BusinessLogic.AuthService
{
    public class AuthService : IAuthService
    {
        private readonly AuthDbContext _context;
        private readonly AppDbContext _appContext;
        private readonly NotificationService _notificationService;
        private readonly IConfiguration _configuration;

        public AuthService(AuthDbContext context, NotificationService notificationService, IConfiguration configuration, AppDbContext _appDbContext)
        {
            _context = context;
            _notificationService = notificationService;
            _configuration = configuration;
            _appContext = _appDbContext;
        }

        public string GenerateValidationCode()
        {
            Random random = new Random();
            return random.Next(100000, 999999).ToString();
        }

        public async Task<bool> ValidateCode(string code, string email, DateTime actualTime)
        {
            return await _context.VerificationCodes.AnyAsync(v =>
                v.CodeNumber == code &&
                v.UserEmail == email &&
                !v.IsUsed &&
                v.ExpiringDate > actualTime);
        }

        public async Task<ActionResult<IEnumerable<VerificationCodeDTO>>> GetCodes()
        {
            var codes = await _context.VerificationCodes
                .Select(v => new VerificationCodeDTO
                {
                    Id = v.Id,
                    CodeNumber = v.CodeNumber,
                    UserEmail = v.UserEmail,
                    ExpiringDate = v.ExpiringDate
                })
                .ToListAsync();

            if (!codes.Any())
            {
                return new NoContentResult(); 
            }

            return new OkObjectResult(codes);
        }


        public async Task<string> CodeSendingHandlingAsync(string email, string type)
        {
            // Generate Code
            var verificationCode = GenerateValidationCode();
            // Add Code to Database
            await AddVerificationCodeAsync(verificationCode, email);

            var user = await _appContext.Users
                    .FirstOrDefaultAsync(u => u.Email == email);

            if (user == null)
            {
                return "Usuario no encontrado.";
            }

            switch (type)
            {
                case "2FA":
                    _notificationService.Send2FA(verificationCode, email);
                    break;
                case "RecoverPassword":
                    string newCode = user.IdNumber + verificationCode;
                    _notificationService.ResetPasswordNotification(newCode, email);
                    break;
                default:
                    return "Tipo de notificación no válido.";
            }
            

            return "Código enviado exitosamente.";
        }

        public async Task<string> AddVerificationCodeAsync(string codeNumber, string userEmail)
        {
            var verificationCode = new VerificationCodeDTO
            {
                CodeNumber = codeNumber,
                UserEmail = userEmail,
                ExpiringDate = DateTime.UtcNow.AddMinutes(5), // Asigna una fecha de expiración
                IsUsed = false
            };

            _context.VerificationCodes.Add(verificationCode);

            try
            {
                await _context.SaveChangesAsync();
                return "Código de verificación agregado exitosamente."; // Retornamos un mensaje de éxito
            }
            catch (DbUpdateException)
            {
                if (VerificationCodeExists(verificationCode.Id))
                {
                    return ("El código de verificación ya existe.");
                }
                throw;
            }
        }

        private bool VerificationCodeExists(int id)
        {
            return _context.VerificationCodes.Any(e => e.Id == id);
        }

        public string GenerateJwtToken(User user)
        {
            var jwtSettings = _configuration.GetSection("JwtSettings");
            var secretKey = jwtSettings["SecretKey"];
            var issuer = jwtSettings["Issuer"];
            var audience = jwtSettings["Audience"];

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey));
            var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
            new System.Security.Claims.Claim(JwtRegisteredClaimNames.Sub, user.IdNumber.ToString()),
            new System.Security.Claims.Claim(JwtRegisteredClaimNames.Email, user.Email),
            new System.Security.Claims.Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            };

            var token = new JwtSecurityToken(
                issuer: issuer,
                audience: audience,
                claims: claims,
                expires: DateTime.UtcNow.AddHours(24),
                signingCredentials: credentials
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

    }
}
