using Microsoft.AspNetCore.Identity;

namespace MiniProjet_.NET.Models.ViewModels
{
    public class PanierViewModel
    {

        public IEnumerable<Variation> Variations { get; set; }
        public IEnumerable<Produit> Produits { get; set; }

        public List<IdentityUser> Users { get; set; }
    }
}
