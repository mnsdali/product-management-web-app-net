namespace MiniProjet_.NET.Models.Repositories
{
    public interface IPieceVariationRepository
    {
        PieceVariation GetPieceVariation(int Id);

        IEnumerable<PieceVariation> GetPieceVariations();
        PieceVariation AddPieceVariation(PieceVariation pieceVariation);
        PieceVariation UpdatePieceVariation(PieceVariation pieceVariation);
        PieceVariation DeletePieceVariation(int Id);

        IEnumerable<PieceVariation> GetPieceVariationsByPieceId(int pieceId);
        IEnumerable<PieceVariation> GetPieceVariationsByVariationId(int variationId);

        PieceVariation GetPieceVariationByIds(int pieceId, int variationId);

    }
}
