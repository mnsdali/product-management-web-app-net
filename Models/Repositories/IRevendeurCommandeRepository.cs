namespace MiniProjet_.NET.Models.Repositories
{
    public interface IRevendeurCommandeRepository
    {
        RevendeurCommande GetRevendeurCommande(int Id);

        IEnumerable<RevendeurCommande> GetRevendeurCommandes();
        RevendeurCommande AddRevendeurCommande(RevendeurCommande revendeurCommande);
        RevendeurCommande UpdateRevendeurCommande(RevendeurCommande revendeurCommande);
        RevendeurCommande DeleteRevendeurCommande(int Id);

        RevendeurCommande GetRevendeurCommandeByReference(string reference);

        IEnumerable<RevendeurCommande> GetRevendeurCommandesByRevendeurId(string revendeurId);
    }
}
