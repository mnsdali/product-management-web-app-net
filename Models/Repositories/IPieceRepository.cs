namespace MiniProjet_.NET.Models.Repositories
{
    public interface IPieceRepository
    {
        Piece GetPiece(int Id);

        IEnumerable<Piece> GetPieces();
        Piece AddPiece(Piece piece);
        Piece UpdatePiece(Piece piece);
        Piece DeletePiece(int Id);

        Piece GetPieceByReference(string reference);

    }
}
