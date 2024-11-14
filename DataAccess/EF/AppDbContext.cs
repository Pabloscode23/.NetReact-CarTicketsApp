using DataAccess.Models;
using DTO;
using Microsoft.EntityFrameworkCore;

public class AppDbContext : DbContext
{
    public DbSet<User> Users { get; set; }
    public DbSet<RoleDTO> Roles { get; set; }
    public DbSet<Ticket> Tickets { get; set; }
    public DbSet<ClaimDTO> Claims { get; set; }
    public DbSet<Appeal> Appeals { get; set; }

    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<User>()
            .HasKey(u => u.UserId);

        modelBuilder.Entity<UserDTO>()
            .HasMany(p => p.Claims)

    }
}
