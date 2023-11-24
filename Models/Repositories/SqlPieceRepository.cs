using Microsoft.EntityFrameworkCore;
using MiniProjet_.NET.Models.Data;

namespace MiniProjet_.NET.Models.Repositories
{
    public class SqlPieceRepository : IPieceRepository
    {
        private readonly AppDbContext context;
        public SqlPieceRepository(AppDbContext context)
        {
            this.context = context;
        }
        public Piece AddPiece(Piece piece)
        {
            context.Pieces.Add(piece);
            context.SaveChanges();
            return piece;
        }
        public Piece DeletePiece(int Id)
        {
            Piece piece = context.Pieces.Find(Id);
            if (piece != null)
            {
                context.Pieces.Remove(piece);
                context.SaveChanges();
            }
            return piece;
        }
        public IEnumerable<Piece> GetPieces()
        {
            return context.Pieces;
        }

        public Piece GetPiece(int Id)

        {
            return context.Pieces.Find(Id);
        }
        public Piece UpdatePiece(Piece piece)
        {
            var Piece =
            context.Pieces.Attach(piece);
            Piece.State = EntityState.Modified;
            context.SaveChanges();
            return piece;
        }

        public Piece GetPieceByReference(string reference)
        {
            return context.Pieces.FirstOrDefault(p => p.Ref == reference);
        }
    }
}

