using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;

namespace MiniProjet_.NET.Models
{
    public class RevendeurCommande
    {
        public int Id { get; set; }
        [Required]
        public string Reference { get; set; }
        public decimal Total { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }

        // Many to one Revendeur
        public string RevendeurId { get; set; }
        public virtual Revendeur Revendeur { get; set; }

        //


        // Many to many Variations
        public List<DetailCommandeRevendeur> DetailCommandeRevendeurs { get; } = new();
        public List<Variation> Variations { get; } = new();
        //


    }
}
