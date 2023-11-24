namespace MiniProjet_.NET.Models.Repositories
{
    public interface IVariationRepository
    {

        Variation GetVariation(int Id);

        IEnumerable<Variation> GetVariations();
        Variation AddVariation(Variation variation);
        Variation UpdateVariation(Variation variation);
        Variation DeleteVariation(int Id);

        Variation GetVariationByDesignation(string designation);

        IEnumerable<Variation> GetVariationsByProduit(int produitId);
    }
}
