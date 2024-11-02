using BusinessLogic.AuthService;
using DataAccess.Models;
using DTO;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using DataAccess;
using Microsoft.EntityFrameworkCore;
using Microsoft.VisualStudio.Web.CodeGenerators.Mvc.Templates.BlazorIdentity.Pages.Manage;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly AuthDbContext _context;
        private readonly AppDbContext _appContext;
        private readonly IAuthService _authService;

        public AuthController(AuthDbContext context, AppDbContext appContext, IAuthService authService)
        {
            _context = context ?? throw new ArgumentNullException(nameof(context));
            _authService = authService ?? throw new ArgumentNullException(nameof(authService));
            _appContext = appContext ?? throw new ArgumentNullException(nameof(appContext));

        }

        // GET VerificationCodes
        [HttpGet("VerificationCodes")]
        public async Task<ActionResult<IEnumerable<VerificationCodeDTO>>> GetCodes()
        {
            var codes = await _context.VerificationCodes.ToListAsync();

            if (codes == null || !codes.Any())
            {
                return NotFound();
            }

            return Ok(codes);
        }

        // POST VerificationCode
        [HttpPost("VerificationCode")]
        public async Task<ActionResult<VerificationCodeDTO>> PostCode(VerificationCodeDTO verificationCodeDto)
        {
            if (verificationCodeDto == null)
            {
                return BadRequest("Verification code cannot be null.");
            }

            // Agregar el nuevo código de verificación a la base de datos
            _context.VerificationCodes.Add(verificationCodeDto);

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                if (VerificationCodeExists(verificationCodeDto.Id)) // Si hay un problema, verifica si ya existe
                {
                    return Conflict();
                }
                else
                {
                    throw; // Lanza la excepción si es un error diferente
                }
            }

            return CreatedAtAction(nameof(GetCodes), new { id = verificationCodeDto.Id }, verificationCodeDto);
        }

        [HttpPost("ValidateCodePassRecover")]
        public async Task<ActionResult<bool>> ValidateCodePassRecover(VerificationCodeDTO verificationCodeDto)
        {
            if (verificationCodeDto == null)
            {
                return BadRequest("Verification code cannot be null.");
            }

            var code = await _context.VerificationCodes.FindAsync(verificationCodeDto.Id);

            if (code == null)
            {
                return NotFound();
            }

            if (code.CodeNumber != verificationCodeDto.CodeNumber)
            {
                return BadRequest("Invalid verification code.");
            }

            if (code.IsUsed)
            {
                return BadRequest("Verification code is already used.");
            }

            if (code.ExpiringDate < DateTime.UtcNow)
            {
                return BadRequest("Verification code is expired.");
            }

            return Ok(true);
        }

        [HttpPost("ValidateCode2FA")]
        public async Task<IActionResult> ValidateCode2FA(Validation2FACodeDTO verificationCodeDto)
        {
            if (verificationCodeDto == null)
            {
                return BadRequest("Verification code cannot be null.");
            }

            var user = await _appContext.Users
                .FirstOrDefaultAsync(u => u.Email == verificationCodeDto.Email);

            if (user == null)
            {
                return NotFound("User not found.");
            }

            var code = await _context.VerificationCodes
                .FirstOrDefaultAsync(c => c.CodeNumber == verificationCodeDto.Code &&
                                           c.UserEmail == verificationCodeDto.Email);

            if (code == null)
            {
                return NotFound("Verification code not found.");
            }

            if (code.CodeNumber != verificationCodeDto.Code)
            {
                return BadRequest("Invalid verification code.");
            }

            if (code.IsUsed)
            {
                return BadRequest("Verification code is already used.");
            }

            if (code.ExpiringDate < DateTime.UtcNow)
            {
                return BadRequest("Verification code is expired.");
            }

            // Actualiza la tabla de códigos de verificación
            code.IsUsed = true;
            _context.VerificationCodes.Update(code);
            await _context.SaveChangesAsync();

            // Genera el token JWT
            var token = _authService.GenerateJwtToken(user);

            // Retorna el token y la información del usuario
            return Ok(new
            {
                token = token,
                user = new
                {
                    user.IdNumber,
                    user.PhoneNumber,
                    user.Role,
                    user.Email,
                    user.Name,
                    user.ProfilePicture
                }
            });
        }


        [HttpPost("RecoverPassword")]
        public async Task<ActionResult<string>> RecoverPassword([FromBody] RecoverPasswordDTO recoverPassword)
        {
            var user = await _appContext.Users
                    .FirstOrDefaultAsync(u => u.Email == recoverPassword.Email);

            if (user == null)
            {
                return BadRequest("No account found.");
            }

            var result = await _authService.CodeSendingHandlingAsync(recoverPassword.Email, "RecoverPassword");

            return Ok(result);
        }

        private bool VerificationCodeExists(int id)
        {
            return _context.VerificationCodes.Any(e => e.Id == id);
        }
    }

    public class RecoverPasswordDTO
    {
        public string Email { get; set; }
    }

    public class Validation2FACodeDTO
    {
        public string Email { get; set; }
        public string Code { get; set; }
    }
}