namespace MiniProjet_.NET.Models.Repositories
{
    public interface IArticleRepository
    {

        Article GetArticle(int Id);

        IEnumerable<Article> GetArticles();
        Article AddArticle(Article article);
        Article UpdateArticle(Article article);
        Article DeleteArticle(int Id);

        Article GetArticleBySerieNumber(string serieNumber);

        IEnumerable<Article> GetArticlesByStatusAndVariationId(bool status, int variationId);
        IEnumerable<Article> GetArticlesByRevendeurAndCommande(string RevendeurId, int CommandeId);

    }
}
