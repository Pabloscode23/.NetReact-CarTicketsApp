using DataAccess.Models;
using DTO;
using Microsoft.EntityFrameworkCore;

public class AuthDBContext : DbContext
{
    public DbSet<VerificationCodeDTO> VerificationCode { get; set; }

    public AuthDBContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<VerificationCodeDTO>()
            .HasKey(u => u.Id);
    }
}
