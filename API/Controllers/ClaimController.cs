using BusinessLogic.ClaimService;
using DTO;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using DataAccess.Models;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ClaimController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly ClaimService _claimService;

        public ClaimController(AppDbContext context, ClaimService claimService)
        {
            _context = context;
            _claimService = claimService;
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
        public async Task<IActionResult> CreateClaim([FromBody] CreateClaimDTO createClaimDTO)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Verificar si el tiquete existe
            var ticketExists = await _context.Tickets.AnyAsync(t => t.Id == createClaimDTO.TicketId);
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


            // Crear el reclamo
            var claim = new Claim
            {
                ClaimId = createClaimDTO.ClaimId,
                ClaimDocument = createClaimDTO.ClaimDocument,
                Status = createClaimDTO.Status,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow,
                JudgeId = judge.UserId, // Asignar el ID del juez
                TicketId = createClaimDTO.TicketId
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
            claim.ClaimDocument = updateClaimDTO.ClaimDocument;
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
        public string ClaimId { get; set; }

        [Required]
        public string ClaimDocument { get; set; }

        public string Status { get; set; }

        [Required]
        public string TicketId { get; set; }

  
    }

    public class UpdateClaimDTO
    {
        public string Status { get; set; }
        public string ClaimDocument { get; set; }
    }

}
