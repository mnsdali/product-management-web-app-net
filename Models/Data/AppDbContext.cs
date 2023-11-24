using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace MiniProjet_.NET.Models.Data
{
    public class AppDbContext : IdentityDbContext<ApplicationUser>
    {

        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }
        public DbSet<Produit> Produits { get; set; }
        public DbSet<Variation> Variations { get; set; }
        public DbSet<Article> Articles { get; set; }
        public DbSet<Piece> Pieces { get; set; }
        public DbSet<RevendeurCommande> RevendeurCommandes { get; set; }
        public DbSet<DetailCommandeRevendeur> DetailCommandeRevendeurs { get; set; }
        public DbSet<PieceVariation> PieceVariations { get; set; }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Produit>()
                .HasMany(e => e.Variations)
                .WithOne(e => e.Produit)
                .HasForeignKey(e => e.ProduitId)
                .IsRequired();

            modelBuilder.Entity<Variation>()
                .HasMany(e => e.Articles)
                .WithOne(e => e.Variation)
                .HasForeignKey(e => e.VariationId)
                .IsRequired();

            modelBuilder.Entity<RevendeurCommande>()
                .HasOne(e => e.Revendeur)
                .WithMany(e => e.RevendeurCommandes)
                .HasForeignKey(e => e.RevendeurId)
                .IsRequired();

            modelBuilder.Entity<Variation>()
                .HasMany(e => e.RevendeurCommandes)
                .WithMany(e => e.Variations)
                .UsingEntity<DetailCommandeRevendeur>(
                    l => l.HasOne(e => e.RevendeurCommande).WithMany(e => e.DetailCommandeRevendeurs),
                    r => r.HasOne(e => e.Variation).WithMany(e => e.DetailCommandeRevendeurs));

            modelBuilder.Entity<Variation>()
                .HasMany(e => e.Pieces)
                .WithMany(e => e.Variations)
                .UsingEntity<PieceVariation>(
                    l => l.HasOne(e => e.Piece).WithMany(e => e.PieceVariations),
                    r => r.HasOne(e => e.Variation).WithMany(e => e.PieceVariations));

            modelBuilder.Entity<Piece>()
                .Property(p => p.Photo)
                .IsRequired(false);
          

        }
    }
}
