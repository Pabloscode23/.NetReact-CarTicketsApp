using DataAccess.Models;
using DTO;
using Microsoft.EntityFrameworkCore;

public class AuthDbContext : DbContext
{
    public DbSet<VerificationCodeDTO> VerificationCode { get; set; }

    public AuthDbContext(DbContextOptions<AuthDbContext> options) : base(options)
    {
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<VerificationCodeDTO>()
            .HasKey(u => u.Id);
    }
}
