using System.ComponentModel.DataAnnotations;

namespace MiniProjet_.NET.Models
{
    public class Variation
    {
        public int Id { get; set; }
        [Required]
        public string Designation { get; set; }

        public bool EstDisponible { get; set; }

        [DataType(DataType.Date)]
        public DateTime CreatedAt { get; set; }

        [DataType(DataType.Date)]
        public DateTime UpdatedAt { get; set; }

        //Many-to-one with Produit
        public int ProduitId { get; set; } // Required foreign key property
        public virtual Produit Produit { get; set; } // Required reference navigation to principal
                                                      //

        // One to Many Articles
        public virtual ICollection<Article> Articles { get; set; } 
        //

        // Many to many Revendeur Commande
        public List<DetailCommandeRevendeur> DetailCommandeRevendeurs { get; } 
        public List<RevendeurCommande> RevendeurCommandes { get; } 
        //

        // Many to many Piece
        public List<PieceVariation> PieceVariations { get; } 
        public List<Piece> Pieces { get; } 
        //
    }
}
