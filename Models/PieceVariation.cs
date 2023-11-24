namespace MiniProjet_.NET.Models
{
    public class PieceVariation
    {
        public int Id { get; set; }

        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }

        // Many to Many [ Piece - Variation ]
        public int PieceId { get; set; }
        public int VariationId { get; set; }
        public Piece Piece { get; set; } = null!;
        public Variation Variation { get; set; } = null!;
        //
    }
}
