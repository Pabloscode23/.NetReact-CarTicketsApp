using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using DTO;

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
        public async Task<ActionResult<IEnumerable<Ticket>>> GetTickets()
        {
            return await _context.Tickets.ToListAsync();
        }

        // GET: api/TicketDTO/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Ticket>> GetTicket(string id)
        {
            var ticket = await _context.Tickets.FindAsync(id);

            if (ticket == null)
            {
                return NotFound();
            }

            return ticket;
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

            ticket.Status = statusUpdate.Status; // Update the status to the new value

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

        // New PUT method to update Description and Date
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

            // Update the Description and Date fields
            ticket.Description = ticketUpdate.Description;
            ticket.Date = ticketUpdate.Date;

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

        // DTO class for status update
        public class TicketStatusUpdateDto
        {
            public string Status { get; set; }
        }

        // DTO class for ticket update
        public class TicketUpdateDto
        {
            public string Description { get; set; }
            public DateTime Date { get; set; }
        }

        // POST: api/TicketDTO
        [HttpPost]
        public async Task<ActionResult<Ticket>> PostTicket(Ticket ticket)
        {
            _context.Tickets.Add(ticket);
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

        // DELETE: api/TicketDTO/5
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
}
