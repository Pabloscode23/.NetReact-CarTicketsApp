﻿using System;
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

            // Mapeo manual de Ticket a TicketDTO
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
                OfficerId = t.OfficerId
            }).ToList();

            return Ok(ticketDTOs);
        }

        // GET: api/TicketDTO/5
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
                OfficerId = ticket.OfficerId
            };

            return ticketDTO;
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

            // Find the ticket by its ID
            var ticket = await _context.Tickets.FindAsync(id);
            if (ticket == null)
            {
                return NotFound();
            }

            // Map the Description and Date fields
            ticket.Description = ticketUpdate.Description;
            ticket.Date = ticketUpdate.Date;

            // Calculate the amount based on the Description using TicketsInfo
            ticket.Amount = (double)GetAmountForDescription(ticketUpdate.Description);

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

        private decimal GetAmountForDescription(string description)
        {
            // Dictionary that maps Description to Amount
            var ticketsInfo = new Dictionary<string, decimal>
    {
        { "Exceso de velocidad", 68000 },
        { "Mal estacionamiento", 52000 },
        { "Conducir en estado de ebriedad", 240000 },
        { "Conducir sin licencia", 27000 }
    };

            // If the description exists in the dictionary, return the corresponding amount
            if (ticketsInfo.ContainsKey(description))
            {
                return ticketsInfo[description];
            }

            // Default amount if description is not found
            return 0;
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
        public async Task<ActionResult<CreateTicketDTO>> PostTicket(CreateTicketDTO ticket)
        {

            var ticketDTO = new Ticket
            {
                Id = ticket.Id,
                UserId = ticket.UserId,
                Latitude = ticket.Latitude,
                Longitude = ticket.Longitude,
                Description = ticket.Description,
                Amount = ticket.Amount,
                Date = ticket.Date,
                Status = ticket.Status,
                OfficerId = ticket.OfficerId
            };

            _context.Tickets.Add(ticketDTO);
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


    public class CreateTicketDTO
    {
        public string Id { get; set; }
        public string UserId { get; set; }
        public DateTime Date { get; set; }
        public Double Latitude { get; set; }
        public Double Longitude { get; set; }
        public string Description { get; set; }
        public string Status { get; set; }
        public string OfficerId { get; set; }
        public double Amount { get; set; }

    }
}
