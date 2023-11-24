

namespace MiniProjet_.NET.Models
{
    public class Produit
    {
        public int Id { get; set; }
        public string Reference { get; set; }
        public string Nom { get; set; }
        public string Description { get; set; }
        public decimal Prix { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }

        // One to Many Variations
        public virtual ICollection<Variation> Variations { get; set; } // Collection navigation containing dependents
        //
    }
}
