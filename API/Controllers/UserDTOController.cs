using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using DTO;
using DataAccess.EF;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserDTOController : ControllerBase
    {
        private readonly AppDbContext _context;

        public UserDTOController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/UserDTO
        [HttpGet]
        public async Task<ActionResult<IEnumerable<UserDTO>>> GetUsers()
        {
            return await _context.Users.ToListAsync();
        }

        // GET: api/UserDTO/5
        [HttpGet("{id}")]
        public async Task<ActionResult<UserDTO>> GetUserDTO(string id)
        {
            var userDTO = await _context.Users.FindAsync(id);

            if (userDTO == null)
            {
                return NotFound();
            }

            return userDTO;
        }

        // PUT: api/UserDTO/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutUserDTO(string id, UserDTO userDTO)
        {
            if (id != userDTO.UserId)
            {
                return BadRequest();
            }

            _context.Entry(userDTO).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!UserDTOExists(id))
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
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<UserDTO>> PostUserDTO(UserDTO userDTO)
        {
            _context.Users.Add(userDTO);
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                if (UserDTOExists(userDTO.UserId))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtAction("GetUserDTO", new { id = userDTO.UserId }, userDTO);
        }

        // DELETE: api/UserDTO/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUserDTO(string id)
        {
            var userDTO = await _context.Users.FindAsync(id);
            if (userDTO == null)
            {
                return NotFound();
            }

            _context.Users.Remove(userDTO);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool UserDTOExists(string id)
        {
            return _context.Users.Any(e => e.UserId == id);
        }
    }
}
