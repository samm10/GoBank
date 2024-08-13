using Microsoft.EntityFrameworkCore;
using System.Transactions;

namespace BankApplication.Models
{
    public class BankDBContext : DbContext
    {
        public BankDBContext(DbContextOptions<BankDBContext> options) : base(options) { 
        
        }

        public BankDBContext() { }

        public DbSet<User> Users {  get; set; }
        public DbSet<Account> Accounts { get; set; }
        public DbSet<Transaction> Transactions{ get; set; }
        public DbSet<Payee> Payees { get; set; }
        public DbSet<Admin> Admins { get; set; }
        public DbSet<UserCredentials> UserCredentials { get; set; }
        
        
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            
            modelBuilder.Entity<User>()
                .HasMany(u => u.Transactions)
                .WithOne(t => t.User)
                .HasForeignKey(t => t.UserId);
            
            modelBuilder.Entity<User>()
                .HasMany(u => u.Payees)
                .WithOne(t => t.User)
                .HasForeignKey(t => t.UserId);
        }
    }
    
    
}
