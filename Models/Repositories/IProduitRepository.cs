namespace MiniProjet_.NET.Models.Repositories
{
    public interface IProduitRepository
    {
        Produit GetProduit(int Id);

        IEnumerable<Produit> GetProduits();
        Produit AddProduit(Produit produit);
        Produit UpdateProduit(Produit produit);
        Produit DeleteProduit(int Id);

        Produit GetProduitByReference(string reference);
    }
}
