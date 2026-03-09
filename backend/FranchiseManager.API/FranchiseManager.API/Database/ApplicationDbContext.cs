// NAMESPACE IMPORTS
using FranchiseManager.API.Models;      // To use entities (Franchise, Branch, Product)
using Microsoft.EntityFrameworkCore;    // To use EF Core (DbContext, DbSet, etc.)
using Microsoft.EntityFrameworkCore.Infrastructure;  // To access internal EF Core services
using Microsoft.EntityFrameworkCore.Storage;         // To work with database creation

namespace FranchiseManager.API.Database
{
    public class ApplicationDbContext : DbContext  // Inherits from DbContext (EF Core base class)
    {
        // DbSet represents a TABLE in the database
        // Here we say: "I want a table called Franchises based on the Franchise model"
        public DbSet<Franchise> Franchises { get; set; }
        //public DbSet<Branch> Branches { get; set; }
        //public DbSet<Product> Products { get; set; }

        // CONSTRUCTOR - Executes when a DbContext instance is created
        // DbContextOptions contains configuration (connection string, etc.)
        // : base(options) passes that configuration to the parent class (DbContext)
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
            // TRY-CATCH BLOCK: Attempts to do something and if it fails, captures the error
            try
            {
                // Database.GetService<IDatabaseCreator>() - Gets the service that can create databases
                var dbCreator = Database.GetService<IDatabaseCreator>() as RelationalDatabaseCreator;

                // We verify that dbCreator is not null (that we were able to get the service)
                if (dbCreator != null)
                {
                    // Can we connect to the database?
                    // If we CANNOT connect, it means the database DOES NOT EXIST
                    if (!dbCreator.CanConnect())
                        dbCreator.Create();  // Then, CREATE the database

                    // Does the database have no tables?
                    if (!dbCreator.HasTables())
                        dbCreator.CreateTables();  // Then, CREATE the tables based on the models
                }
            }
            catch (Exception ex)  // If something goes wrong in the try, we catch the error
            {
                // Write the error message to the console
                Console.WriteLine($"Error creating/verifying the database: {ex.Message}");
            }
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configure unique name for franchises (cannot have two with the same name)
            modelBuilder.Entity<Franchise>()
                .HasIndex(f => f.Name)
                .IsUnique();

            // Configure relationships between tables
            // Relationship: Branch (many) -> Franchise (one)
         //   modelBuilder.Entity<Branch>()
         //       .HasOne(b => b.Franchise)           // A branch has one franchise
         //       .WithMany(f => f.Branches)          // A franchise has many branches
         //       .HasForeignKey(b => b.FranchiseId)  // The foreign key is FranchiseId
         //       .OnDelete(DeleteBehavior.Cascade);  // If the franchise is deleted, its branches are also deleted

            // Relationship: Product (many) -> Branch (one)
         //   modelBuilder.Entity<Product>()
         //       .HasOne(p => p.Branch)               // A product has one branch
         //       .WithMany(b => b.Products)           // A branch has many products
         //       .HasForeignKey(p => p.BranchId)      // The foreign key is BranchId
         //       .OnDelete(DeleteBehavior.Cascade);   // If the branch is deleted, its products are also deleted
        }
    }
}