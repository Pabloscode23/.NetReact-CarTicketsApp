using DataAccess.Models;
using DTO;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Notifications;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TicketTypeController : ControllerBase
    {

        private readonly AppDbContext _context;

        public TicketTypeController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/<TicketTypeController>
        [HttpGet]
        public async Task<ActionResult<List<TicketType>>> GetTicketTypes()
        {
            var ticketTypes = await _context.TicketTypes.ToListAsync();

          
            return Ok(ticketTypes);
        }

       // // GET api/<TicketTypeController>/5
        //[HttpGet("{id}")]
        //public string Get(int id)
        //{
        //    return "value";
        //}

        // POST api/<TicketTypeController>
        [HttpPost]
        public async Task<ActionResult<TicketType>> PostTicketType(TicketType ticketType)
        {


            _context.TicketTypes.Add(ticketType);
            try
            {
                await _context.SaveChangesAsync();

             }
            catch (DbUpdateException)
            {
                if (TicketTypeExist(ticketType.Id))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }
            return Ok("Tipo de multa creada");
        }

        private bool TicketTypeExist(int id)
        {
            return _context.TicketTypes.Any(e => e.Id == id);
        }

        // PUT api/<TicketTypeController>/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody] string value)
        {
        }

        // DELETE api/<TicketTypeController>/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTicketType(int id)
        {
            var ticketType = await _context.TicketTypes.FindAsync(id);
            if (ticketType == null)
            {
                return NotFound();
            }

            _context.TicketTypes.Remove(ticketType);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
