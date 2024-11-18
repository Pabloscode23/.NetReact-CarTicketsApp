using DataAccess.Models;
using DTO;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessLogic.ClaimService
{
    public class ClaimService
    {
        private readonly AppDbContext _context;
        public ClaimService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<User> AssignJudge()
        {
            var judgeWithLeastClaims = await _context.Users
                .Where(u => u.Role == "juez")
                .OrderBy(u => u.ClaimsAsJudge.Count)
                .FirstOrDefaultAsync();

            return judgeWithLeastClaims;
        }



    }
}
