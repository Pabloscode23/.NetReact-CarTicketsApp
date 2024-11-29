using DataAccess.Models;  // Para la entidad Payment
          // Para el DTO PaymentDTO
using Microsoft.EntityFrameworkCore;

public class AppDbContext : DbContext
{
    public DbSet<User> Users { get; set; }
    public DbSet<Role> Roles { get; set; }
    public DbSet<Ticket> Tickets { get; set; }
    public DbSet<Payment> Payments { get; set; } // Aquí es donde se mapea la entidad Payment
    public DbSet<Claim> Claims { get; set; }
    public DbSet<TicketType> TicketTypes { get; set; }

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

        modelBuilder.Entity<Claim>()
            .HasOne(c => c.Ticket)
            .WithOne(t => t.Claim)
            .HasForeignKey<Claim>(c => c.TicketId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<Claim>()
            .HasOne(c => c.Judge)
            .WithMany(u => u.ClaimsAsJudge)
            .HasForeignKey(c => c.JudgeId)
            .OnDelete(DeleteBehavior.SetNull);
        modelBuilder.Entity<TicketType>().HasData(
                new TicketType { Id = 1, Description = "Exceso de velocidad", Amount = 68000 },
                new TicketType { Id = 2, Description = "Mal estacionamiento", Amount = 52000 },
                new TicketType { Id = 3, Description = "Conducir en estado de ebriedad", Amount = 240000 },
                new TicketType { Id = 4, Description = "Conducir sin licencia", Amount = 27000 }
            );

    }
}
