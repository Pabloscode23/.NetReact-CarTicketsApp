using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using DTO;
using DataAccess.Models;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TicketDTOController : ControllerBase
    {
        private readonly AppDbContext _context;

        public TicketDTOController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/TicketDTO
        [HttpGet]
        public async Task<ActionResult<List<TicketDTO>>> GetTickets()
        {
            var tickets = await _context.Tickets.ToListAsync();

            var ticketDTOs = tickets.Select(t => new TicketDTO
            {
                Id = t.Id,
                UserId = t.UserId,
                Latitude = t.Latitude,
                Longitude = t.Longitude,
                Description = t.Description,
                Amount = t.Amount,
                Date = t.Date,
                Status = t.Status,
                OfficerId = t.OfficerId,
                Plate = t.Plate
            }).ToList();

            return Ok(ticketDTOs);
        }

        // GET: api/TicketDTO/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<TicketDTO>> GetTicket(string id)
        {
            var ticket = await _context.Tickets.FindAsync(id);

            if (ticket == null)
            {
                return NotFound();
            }

            var ticketDTO = new TicketDTO
            {
                Id = ticket.Id,
                UserId = ticket.UserId,
                Latitude = ticket.Latitude,
                Longitude = ticket.Longitude,
                Description = ticket.Description,
                Amount = ticket.Amount,
                Date = ticket.Date,
                Status = ticket.Status,
                OfficerId = ticket.OfficerId,
                Plate = ticket.Plate
            };

            return ticketDTO;
        }

     // GET: api/TicketDTO/search
[HttpGet("search")]
public async Task<ActionResult<List<TicketDTO>>> GetTicketsByPlate([FromQuery] string placa)
{
    if (string.IsNullOrEmpty(placa))
    {
        return BadRequest("El parámetro placa es requerido.");
    }

    // Realizar la consulta sin usar StringComparison
    var tickets = await _context.Tickets
        .Where(t => t.Plate != null && EF.Functions.Like(t.Plate, placa))
        .ToListAsync();

    if (!tickets.Any())
    {
        return NotFound("No se encontraron multas asociadas a esta placa.");
    }

    // Mapear a DTO
    var ticketDTOs = tickets.Select(t => new TicketDTO
    {
        Id = t.Id,
        UserId = t.UserId,
        Latitude = t.Latitude,
        Longitude = t.Longitude,
        Description = t.Description,
        Amount = t.Amount,
        Date = t.Date,
        Status = t.Status,
        OfficerId = t.OfficerId,
        Plate = t.Plate
    }).ToList();

    return Ok(ticketDTOs);
}

        // PUT: api/TicketDTO/{id}/status
        [HttpPut("{id}/status")]
        public async Task<IActionResult> UpdateTicketStatus(string id, [FromBody] TicketStatusUpdateDto statusUpdate)
        {
            if (statusUpdate == null || string.IsNullOrEmpty(statusUpdate.Status))
            {
                return BadRequest("Invalid status update request.");
            }

            var ticket = await _context.Tickets.FindAsync(id);
            if (ticket == null)
            {
                return NotFound();
            }

            ticket.Status = statusUpdate.Status;

            _context.Entry(ticket).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!TicketExists(id))
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

        // PUT: api/TicketDTO/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateTicket(string id, [FromBody] TicketUpdateDto ticketUpdate)
        {
            if (ticketUpdate == null || string.IsNullOrEmpty(ticketUpdate.Description) || ticketUpdate.Date == default)
            {
                return BadRequest("Invalid ticket update request.");
            }

            var ticket = await _context.Tickets.FindAsync(id);
            if (ticket == null)
            {
                return NotFound();
            }

            ticket.Description = ticketUpdate.Description;
            ticket.Date = ticketUpdate.Date;
            ticket.Plate = ticketUpdate.Plate;

            _context.Entry(ticket).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!TicketExists(id))
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

        // POST: api/TicketDTO
        [HttpPost]
        public async Task<ActionResult<CreateTicketDTO>> PostTicket(CreateTicketDTO ticket)
        {
            var ticketEntity = new Ticket
            {
                Id = ticket.Id,
                UserId = ticket.UserId,
                Latitude = ticket.Latitude,
                Longitude = ticket.Longitude,
                Description = ticket.Description,
                Amount = ticket.Amount,
                Date = ticket.Date,
                Status = ticket.Status,
                OfficerId = ticket.OfficerId,
                Plate = ticket.Plate
            };

            _context.Tickets.Add(ticketEntity);
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                if (TicketExists(ticket.Id))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtAction("GetTicket", new { id = ticket.Id }, ticket);
        }

        // DELETE: api/TicketDTO/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTicket(string id)
        {
            var ticket = await _context.Tickets.FindAsync(id);
            if (ticket == null)
            {
                return NotFound();
            }

            _context.Tickets.Remove(ticket);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool TicketExists(string id)
        {
            return _context.Tickets.Any(e => e.Id == id);
        }
    }

    public class TicketStatusUpdateDto
    {
        public string Status { get; set; }
    }

    public class TicketUpdateDto
    {
        public string Description { get; set; }
        public DateTime Date { get; set; }
        public string Plate { get; set; }
    }

    public class CreateTicketDTO
    {
        public string Id { get; set; }
        public string UserId { get; set; }
        public DateTime Date { get; set; }
        public double Latitude { get; set; }
        public double Longitude { get; set; }
        public string Description { get; set; }
        public string Status { get; set; }
        public string OfficerId { get; set; }
        public double Amount { get; set; }
        public string Plate { get; set; }
    }
}
