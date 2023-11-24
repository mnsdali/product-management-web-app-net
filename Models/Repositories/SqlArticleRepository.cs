using Microsoft.EntityFrameworkCore;
using MiniProjet_.NET.Models.Data;

namespace MiniProjet_.NET.Models.Repositories
{
    public class SqlArticleRepository : IArticleRepository
    {
        private readonly AppDbContext context;
        public SqlArticleRepository(AppDbContext context)
        {
            this.context = context;
        }
        public Article AddArticle(Article article)
        {
            context.Articles.Add(article);
            context.SaveChanges();
            return article;
        }
        public Article DeleteArticle(int Id)
        {
            Article article = GetArticle(Id);
            if (article != null)
            {
                context.Articles.Remove(article);
                context.SaveChanges();
            }
            return article;
        }
        public IEnumerable<Article> GetArticles()
        {
            return context.Articles.Include(a => a.Variation);
        }

        public Article GetArticle(int Id)

        {
            return context.Articles.Include(a => a.Variation).FirstOrDefault(a => a.Id == Id);
        }

        public Article GetArticleBySerieNumber(string SerieNumber)
        {
            return context.Articles.FirstOrDefault(a => a.SerieNumber == SerieNumber);
        }

        public Article UpdateArticle(Article article)
        {
            var Article = context.Articles.Attach(article);
            Article.State = EntityState.Modified;
            context.SaveChanges();
            return article;
        }

        public IEnumerable<Article> GetArticlesByStatusAndVariationId(bool status, int variationId)
        {
            return context.Articles.Where(a => a.Status == status)
                .Where(a=> a.VariationId == variationId);
        }

        public IEnumerable<Article> GetArticlesByRevendeurAndCommande(string RevendeurId, int CommandeId)
        {
            return context.Articles.Where(a => a.RevendeurId == RevendeurId)
                .Where(a => a.RevendeurCommandId == CommandeId);
        }
    }
}

