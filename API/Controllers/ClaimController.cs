using BusinessLogic.ClaimService;
using DTO;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using DataAccess.Models;
using BusinessLogic.FileUploadService;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ClaimController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly ClaimService _claimService;
        private readonly IFileUploadService _fileUploadService;
        private readonly IConfiguration _configuration;
        private Cloudinary _cloudinary;

        public ClaimController(AppDbContext context, ClaimService claimService, IFileUploadService fileUploadService, IConfiguration configuration)
        {
            _context = context;
            _claimService = claimService;
            _fileUploadService = fileUploadService;
            _configuration = configuration;

            // Configuración de Cloudinary
            var cloudName = _configuration["Cloudinary:CloudName"];
            var apiKey = _configuration["Cloudinary:ApiKey"];
            var apiSecret = _configuration["Cloudinary:ApiSecret"];
            var account = new CloudinaryDotNet.Account(cloudName, apiKey, apiSecret);
            _cloudinary = new Cloudinary(account);
        }

        // GET: api/<ClaimController>
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ClaimDTO>>> GetClaims()
        {
            var claims = await _context.Claims
                .Include(c => c.Judge)  // Cargar la relación con el juez
                .Include(c => c.Ticket) // Cargar la relación con el tiquete
                .ToListAsync();

            return Ok(claims);
        }

        // GET api/<ClaimController>/5
        [HttpGet("{id}")]
        public async Task<ActionResult<ClaimDTO>> GetClaim(string id)
        {
            var claim = await _context.Claims
                .Include(c => c.Judge)  // Cargar la relación con el juez
                .Include(c => c.Ticket) // Cargar la relación con el tiquete
                .FirstOrDefaultAsync(c => c.ClaimId == id);

            if (claim == null)
            {
                return NotFound("Reclamo no encontrado.");
            }
            return Ok(claim);
        }


        // POST api/<ClaimController>
        [HttpPost]
        public async Task<IActionResult> CreateClaim([FromForm] string ticketId, [FromForm] string status, [FromForm] IFormFile claimDocument)
        {
            if (claimDocument == null || claimDocument.Length == 0)
            {
                return BadRequest("Debe proporcionar un archivo PDF.");
            }

            // Verificar si el tiquete existe
            var ticketExists = await _context.Tickets.AnyAsync(t => t.Id == ticketId);
            if (!ticketExists)
            {
                return NotFound("Tiquete no encontrado.");
            }

            var judgeResult = await _claimService.AssignJudge();

            if (judgeResult is BadRequestObjectResult)
            {
                return BadRequest("No hay jueces disponibles.");
            }

            var judge = judgeResult;

            // Configuración de Cloudinary
            var cloudName = _configuration["Cloudinary:CloudName"];
            var apiKey = _configuration["Cloudinary:ApiKey"];
            var apiSecret = _configuration["Cloudinary:ApiSecret"];



            var fileStream = claimDocument.OpenReadStream();
            var timestamp = DateTime.Now.ToString("yyyyMMddHHmmss"); // Formato: AñoMesDíaHoraMinutoSegundo
            var fileName = Path.GetFileNameWithoutExtension(claimDocument.FileName) + "_" + timestamp + Path.GetExtension(claimDocument.FileName);
            var publicId = Guid.NewGuid().ToString();

            var uploadParams = new RawUploadParams
            {
                File = new FileDescription(fileName, fileStream),
                PublicId = publicId,
                Folder = "proy2_claims"
            };  

            var uploadResult = await _cloudinary.UploadAsync(uploadParams);

            if ( uploadResult.StatusCode != System.Net.HttpStatusCode.OK)
            {
                return BadRequest("Hubo un error al subir el archivo a Cloudinary.");
            }

            
            var filePath = uploadResult.SecureUrl.ToString();


            // Crear el reclamo
            var claim = new Claim
            {
                ClaimId = "claim" + Guid.NewGuid().ToString(),
                ClaimDocument = filePath, // Guardar la URL pública generada
                Status = status,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow,
                JudgeId = judge.UserId,
                TicketId = ticketId
            };

            // Guardar el reclamo en la base de datos
            _context.Claims.Add(claim);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetClaim", new { id = claim.ClaimId }, claim);
            
        }




        // PUT api/<ClaimController>/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateClaim(string id, [FromBody] UpdateClaimDTO updateClaimDTO)
        {
            var claim = await _context.Claims.FindAsync(id);
            if (claim == null)
            {
                return NotFound("Reclamo no encontrado.");
            }

            // Actualizar propiedades del reclamo
            claim.Status = updateClaimDTO.Status;
            claim.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return NoContent();
        }

        // DELETE api/<ClaimController>/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteClaim(string id)
        {
            var claim = await _context.Claims.FindAsync(id);
            if (claim == null)
            {
                return NotFound("Reclamo no encontrado.");
            }

            _context.Claims.Remove(claim);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }

    // DTOs

    public class CreateClaimDTO
    {

        [Required]
        public string ClaimDocument { get; set; }

        public string Status { get; set; }

        [Required]
        public string TicketId { get; set; }

  
    }

    public class UpdateClaimDTO
    {
        public string Status { get; set; }
    }

}
