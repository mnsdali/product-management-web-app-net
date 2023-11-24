using Microsoft.EntityFrameworkCore;
using MiniProjet_.NET.Models.Data;

namespace MiniProjet_.NET.Models.Repositories
{
    public class SqlPieceVariationRepository : IPieceVariationRepository
    {
        private readonly AppDbContext context;
        public SqlPieceVariationRepository(AppDbContext context)
        {
            this.context = context;
        }
        public PieceVariation AddPieceVariation(PieceVariation P)
        {
            context.PieceVariations.Add(P);
            context.SaveChanges();
            return P;
        }
        public PieceVariation DeletePieceVariation(int Id)
        {
            PieceVariation P = context.PieceVariations.Find(Id);
            if (P != null)
            {
                context.PieceVariations.Remove(P);
                context.SaveChanges();
            }
            return P;
        }
        public IEnumerable<PieceVariation> GetPieceVariations()
        {
            return context.PieceVariations;
        }

        public PieceVariation GetPieceVariation(int Id)

        {
            return context.PieceVariations.Find(Id);
        }
        public PieceVariation UpdatePieceVariation(PieceVariation P)
        {
            var PieceVariation =
            context.PieceVariations.Attach(P);
            PieceVariation.State = EntityState.Modified;
            context.SaveChanges();
            return P;
        }

        public PieceVariation GetPieceVariationByIds(int VariationId, int PieceId)
        {
            return context.PieceVariations
                .FirstOrDefault(dcr => dcr.VariationId == VariationId && dcr.PieceId == PieceId);
        }

        public IEnumerable<PieceVariation> GetPieceVariationsByPieceId(int pieceId)
        {
            return context.PieceVariations.Where(dcr => dcr.PieceId == pieceId);
        }

        public IEnumerable<PieceVariation> GetPieceVariationsByVariationId(int variationId)
        {
            return context.PieceVariations
                .Where(dcr => dcr.VariationId == variationId);
        }

    }
}

