using Microsoft.EntityFrameworkCore;
using MiniProjet_.NET.Models.Data;

namespace MiniProjet_.NET.Models.Repositories
{
    public class SqlVariationRepository : IVariationRepository
    {
        private readonly AppDbContext context;
        public SqlVariationRepository(AppDbContext context)
        {
            this.context = context;
        }
        public Variation AddVariation(Variation P)
        {
            context.Variations.Add(P);
            context.SaveChanges();
            return P;
        }
        public Variation DeleteVariation(int Id)
        {
            Variation P = context.Variations.Find(Id);
            if (P != null)
            {
                context.Variations.Remove(P);
                context.SaveChanges();
            }
            return P;
        }
        public IEnumerable<Variation> GetVariations()
        {
            return context.Variations.Include(v => v.Articles).Include(v => v.Produit);
        }

        public Variation GetVariation(int Id)

        {
            return context.Variations
                    .Include(v => v.Articles)
                    .Include(v => v.Produit)
                    .FirstOrDefault(v => v.Id == Id);
        }

        public Variation GetVariationByDesignation(string Designation)
        {
            return context.Variations.FirstOrDefault(a => a.Designation == Designation);
        }
        public Variation UpdateVariation(Variation P)
        {
            var Variation = context.Variations.Attach(P);
            Variation.State = EntityState.Modified;
            context.SaveChanges();
            return P;
        }

        public IEnumerable<Variation> GetVariationsByProduit(int produitId)
        {
            return context.Variations.Where(v => v.ProduitId == produitId);
        }
    }
}

