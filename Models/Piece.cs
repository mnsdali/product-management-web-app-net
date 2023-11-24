using System.ComponentModel.DataAnnotations;

namespace MiniProjet_.NET.Models
{
    public class Piece
    {
        public int Id { get; set; }


        [Required]
        public string Ref { get; set; }

        [Required]
        public string Designation { get; set; }


        public string? Photo { get; set; }

        [Required]
        public string? IndiceArrivage { get; set; }

        public ulong? QteSav { get; set; }
        public ulong? QteStock { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }

        // Many to many Variations
        public List<PieceVariation> PieceVariations { get; } = new();
        public List<Variation> Variations { get; } = new();
        //
    }
}
