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
    public class RoleDTOController : ControllerBase
    {
        private readonly AppDbContext _context;

        public RoleDTOController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/RoleDTO
        [HttpGet]
        public async Task<ActionResult<IEnumerable<RoleDTO>>> GetRoles()
        {
            return await _context.Roles.ToListAsync();
        }

        // GET: api/RoleDTO/5
        [HttpGet("{id}")]
        public async Task<ActionResult<RoleDTO>> GetRoleDTO(string id)
        {
            var roleDTO = await _context.Roles.FindAsync(id);

            if (roleDTO == null)
            {
                return NotFound();
            }

            return roleDTO;
        }

        // PUT: api/RoleDTO/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutRoleDTO(string id, RoleDTO roleDTO)
        {
            if (id != roleDTO.RoleId)
            {
                return BadRequest();
            }

            _context.Entry(roleDTO).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!RoleDTOExists(id))
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

        // POST: api/RoleDTO
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<RoleDTO>> PostRoleDTO(RoleDTO roleDTO)
        {
            _context.Roles.Add(roleDTO);
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                if (RoleDTOExists(roleDTO.RoleId))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtAction("GetRoleDTO", new { id = roleDTO.RoleId }, roleDTO);
        }

        // DELETE: api/RoleDTO/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteRoleDTO(string id)
        {
            var roleDTO = await _context.Roles.FindAsync(id);
            if (roleDTO == null)
            {
                return NotFound();
            }

            _context.Roles.Remove(roleDTO);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool RoleDTOExists(string id)
        {
            return _context.Roles.Any(e => e.RoleId == id);
        }
    }
}
