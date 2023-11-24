using Microsoft.AspNetCore.Identity;

namespace MiniProjet_.NET.Models
{
    public class Revendeur : ApplicationUser
    {
        public virtual ICollection<RevendeurCommande> RevendeurCommandes { get; set; }
    }
}
