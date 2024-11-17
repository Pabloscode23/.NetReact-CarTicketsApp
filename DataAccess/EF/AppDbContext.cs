using DataAccess.Models;  // Para la entidad Payment
using DTO;                // Para el DTO PaymentDTO
using Microsoft.EntityFrameworkCore;

public class AppDbContext : DbContext
{
    public DbSet<User> Users { get; set; }
    public DbSet<RoleDTO> Roles { get; set; }
    public DbSet<Ticket> Tickets { get; set; }
    public DbSet<Payment> Payments { get; set; } // Aquí es donde se mapea la entidad Payment
    public DbSet<ClaimDTO> Claims { get; set; }

    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<User>()
            .HasKey(u => u.UserId);

        // Si quieres personalizar las relaciones, puedes hacerlo aquí.
        modelBuilder.Entity<Payment>()
            .HasOne(p => p.User)
            .WithMany()
            .HasForeignKey(p => p.UserId);

        modelBuilder.Entity<Payment>()
            .HasOne(p => p.Ticket)
            .WithMany()
            .HasForeignKey(p => p.TicketId);

        modelBuilder.Entity<UserDTO>()
            .HasMany(p => p.Claims);

    }
}
