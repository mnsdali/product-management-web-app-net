using System.ComponentModel.DataAnnotations;

namespace MiniProjet_.NET.Models
{
    public class Article
    {
        public int Id { get; set; }
        [Required]
        public string SerieNumber { get; set; }

        public bool Status { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }

        // Many to one Variation
        public int VariationId { get; set; } // Required foreign key property
        public virtual Variation Variation { get; set; }  // Required reference navigation to principal
                                                          // 

        // Many to one Commande
        public int? RevendeurCommandId { get; set; }
        public RevendeurCommande? RevendeurCommande { get; set; }
        //

        // Many to one Revendeur
        public string? RevendeurId { get; set; }
        public Revendeur Revendeur { get; set; }
 

        //
    }
}
