using Microsoft.EntityFrameworkCore;
using MiniProjet_.NET.Models.Data;

namespace MiniProjet_.NET.Models.Repositories
{
    public class SqlRevendeurCommandeRepository : IRevendeurCommandeRepository
    {
        private readonly AppDbContext context;
        public SqlRevendeurCommandeRepository(AppDbContext context)
        {
            this.context = context;
        }
        public RevendeurCommande AddRevendeurCommande(RevendeurCommande P)
        {
            context.RevendeurCommandes.Add(P);
            context.SaveChanges();
            return P;
        }
        public RevendeurCommande DeleteRevendeurCommande(int Id)
        {
            RevendeurCommande P = context.RevendeurCommandes.Find(Id);
            if (P != null)
            {
                context.RevendeurCommandes.Remove(P);
                context.SaveChanges();
            }
            return P;
        }
        public IEnumerable<RevendeurCommande> GetRevendeurCommandes()
        {
            return context.RevendeurCommandes.Include(v => v.Revendeur);
        }

        public RevendeurCommande GetRevendeurCommande(int Id)

        {
            return context.RevendeurCommandes.Find(Id);
        }
        public RevendeurCommande UpdateRevendeurCommande(RevendeurCommande P)
        {
            var RevendeurCommande =
            context.RevendeurCommandes.Attach(P);
            RevendeurCommande.State = EntityState.Modified;
            context.SaveChanges();
            return P;
        }

        public RevendeurCommande GetRevendeurCommandeByReference(string reference)
        {
            return context.RevendeurCommandes.FirstOrDefault(rc => rc.Reference == reference);
        }

        public IEnumerable<RevendeurCommande> GetRevendeurCommandesByRevendeurId(string revendeurId)
        {
            return context.RevendeurCommandes.Where(rc => rc.RevendeurId == revendeurId);
        }
    }
}

