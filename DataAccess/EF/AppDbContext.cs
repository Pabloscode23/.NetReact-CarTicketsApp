using System;
using Microsoft.EntityFrameworkCore;
using DTO;
namespace DataAccess.EF
{

    public class AppDbContext : DbContext
    {
        public DbSet<UserDTO> Users { get; set; }
        public DbSet<RoleDTO> Roles { get; set; }
        public DbSet<Ticket> Tickets { get; set; }

        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
         
        }
    }
	
}