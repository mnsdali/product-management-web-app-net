using Microsoft.EntityFrameworkCore;
using MiniProjet_.NET.Models.Data;

namespace MiniProjet_.NET.Models.Repositories
{
    public class SqlProduitRepository : IProduitRepository
    {
        private readonly AppDbContext context;
        public SqlProduitRepository(AppDbContext context)
        {
            this.context = context;
        }
        public Produit AddProduit(Produit P)
        {
            context.Produits.Add(P);
            context.SaveChanges();
            return P;
        }
        public Produit DeleteProduit(int Id)
        {
            Produit P = context.Produits.Find(Id);
            if (P != null)
            {
                context.Produits.Remove(P);
                context.SaveChanges();
            }
            return P;
        }
        public IEnumerable<Produit> GetProduits()
        {
            return context.Produits.Include(p => p.Variations);
        }

        public Produit GetProduit(int Id)

        {
            return context.Produits.Include(p => p.Variations).FirstOrDefault(a => a.Id == Id);
        }
        public Produit UpdateProduit(Produit P)
        {
            var Produit =
            context.Produits.Attach(P);
            Produit.State = EntityState.Modified;
            context.SaveChanges();
            return P;
        }

        public Produit GetProduitByReference(string reference)
        {
            return context.Produits.FirstOrDefault(p => p.Reference == reference);
        }
    }
}

