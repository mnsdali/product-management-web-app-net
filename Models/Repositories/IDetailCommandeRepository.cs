namespace MiniProjet_.NET.Models.Repositories
{
    public interface IDetailCommandeRepository
    {
        DetailCommandeRevendeur GetDetailCommandeRevendeur(int Id);

        IEnumerable<DetailCommandeRevendeur> GetDetailCommandeRevendeurs();
        DetailCommandeRevendeur AddDetailCommandeRevendeur(DetailCommandeRevendeur rdetailCommandeRevendeur);
        DetailCommandeRevendeur UpdateDetailCommandeRevendeur(DetailCommandeRevendeur rdetailCommandeRevendeur);
        DetailCommandeRevendeur DeleteDetailCommandeRevendeur(int Id);

        IEnumerable<DetailCommandeRevendeur> GetDetailCommandeRevendeursByCommandeId(int commandeId);
    }
}
