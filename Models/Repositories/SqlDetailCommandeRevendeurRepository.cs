using Microsoft.EntityFrameworkCore;
using MiniProjet_.NET.Models.Data;

namespace MiniProjet_.NET.Models.Repositories
{
    public class SqlDetailCommandeRevendeurRepository : IDetailCommandeRepository
    {
        private readonly AppDbContext context;
        public SqlDetailCommandeRevendeurRepository(AppDbContext context)
        {
            this.context = context;
        }
        public DetailCommandeRevendeur AddDetailCommandeRevendeur(DetailCommandeRevendeur P)
        {
            context.DetailCommandeRevendeurs.Add(P);
            context.SaveChanges();
            return P;
        }
        public DetailCommandeRevendeur DeleteDetailCommandeRevendeur(int Id)
        {
            DetailCommandeRevendeur P = context.DetailCommandeRevendeurs.Find(Id);
            if (P != null)
            {
                context.DetailCommandeRevendeurs.Remove(P);
                context.SaveChanges();
            }
            return P;
        }
        public IEnumerable<DetailCommandeRevendeur> GetDetailCommandeRevendeurs()
        {
            return context.DetailCommandeRevendeurs;
        }

        

        public DetailCommandeRevendeur GetDetailCommandeRevendeur(int Id)
        {
            return context.DetailCommandeRevendeurs
                .Include(D => D.Variation)
                .FirstOrDefault(d => d.Id == Id);


        }

        public DetailCommandeRevendeur UpdateDetailCommandeRevendeur(DetailCommandeRevendeur t)
        {
            var DetailCommandeRevendeur =
            context.DetailCommandeRevendeurs.Attach(t);
            DetailCommandeRevendeur.State = EntityState.Modified;
            context.SaveChanges();
            return t;
        }

        public IEnumerable<DetailCommandeRevendeur> GetDetailCommandeRevendeursByCommandeId(int commandeId)
        {
            return context.DetailCommandeRevendeurs.Where(rc => rc.RevendeurCommandeId == commandeId);
        }
    }
}

