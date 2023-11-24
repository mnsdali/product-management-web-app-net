using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MiniProjet_.NET.Models;
using MiniProjet_.NET.Models.Repositories;
using Net.Codecrete.QrCodeGenerator;
using System.Globalization;

namespace MiniProjet_.NET.Controllers
{
    public class RevendeurCommandeController : Controller
    {
        //Injection de la dépendance
        readonly IRevendeurCommandeRepository RevendeurCommandeRepository;
        readonly IDetailCommandeRepository DetailCommandeRepository;
        readonly IArticleRepository ArticleRepository;
        readonly IVariationRepository VariationRepository;
        private readonly UserManager<ApplicationUser> userManager;
        private readonly IWebHostEnvironment hostingEnvironment;

        public RevendeurCommandeController(IRevendeurCommandeRepository RevendeurCommandeRepository, IWebHostEnvironment hostingEnvironment,
                 UserManager<ApplicationUser> userManager, IDetailCommandeRepository DetailCommandeRepository, IArticleRepository articleRepository,
                 IVariationRepository variationRepository
                 )
        {
            this.RevendeurCommandeRepository = RevendeurCommandeRepository;
            this.DetailCommandeRepository = DetailCommandeRepository;
            ArticleRepository = articleRepository;
            VariationRepository = variationRepository;
            this.hostingEnvironment = hostingEnvironment;
            this.userManager = userManager;
        }

        public string GenerateSerieNumber()
        {
            var rand = new Random();
            string serialNumber;
            while (true)
            {
                serialNumber = "";

                for (int i = 0; i < 13; i++)
                {
                    serialNumber += rand.Next(0, 10).ToString();
                }

                var article = ArticleRepository.GetArticleBySerieNumber(serialNumber);

                if (article == null)
                {
                    break;
                }
            }

            return serialNumber;
        }

        public void GenerateQrCode(string serieNumber, string designation)
        {
            // Encode the text to a QR code
            var qr = QrCode.EncodeText(serieNumber, QrCode.Ecc.Medium);

            // Convert the QR code to SVG string
            string svg = qr.ToSvgString(4);


            // Specify the folder to save the QR code SVG file
            string uploadsFolder = Path.Combine(hostingEnvironment.WebRootPath, $"QrCodes/Articles/{designation}");
            if (!Directory.Exists(uploadsFolder))
            {
                Directory.CreateDirectory(uploadsFolder);
            }
            // Ensure the folder exists
            Directory.CreateDirectory(uploadsFolder);

            // Specify the file path
            string uniqueFileName = $"{serieNumber}_serieNumber.svg";
            string filePath = Path.Combine(uploadsFolder, uniqueFileName);

            // Save the SVG content to the file
            System.IO.File.WriteAllText(filePath, svg);
        }


        // GET: RevendeurCommandeController
        public ActionResult Index()
        {
            var revendeurCommandes = RevendeurCommandeRepository.GetRevendeurCommandes();
            
            return View(revendeurCommandes);
        }

        // GET: RevendeurCommandeController/Details/5
        public ActionResult Details(int id)
        {
            var revendeurCommande = RevendeurCommandeRepository.GetRevendeurCommande(id);
            var detailsCommande = DetailCommandeRepository.GetDetailCommandeRevendeursByCommandeId(id);
            var ariclesCommande = ArticleRepository.GetArticlesByRevendeurAndCommande(revendeurCommande.RevendeurId, revendeurCommande.Id);

            var model = (revendeurCommande, detailsCommande, ariclesCommande);
            return View(model);
        }

        // GET: RevendeurCommandeController/Create
        public ActionResult Create()
        {
            return View();
        }

        // POST: RevendeurCommandeController/Create
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create(IFormCollection collection)
        {
            var series = collection["series[]"];
            var prices = collection["prices[]"];
            var quantities = collection["quantities[]"];
            var sous_totals = collection["sous_totals[]"];
            var revendeurId = collection["revendeur"];

            //parsing de total
            
            var culture = new CultureInfo("en-US");
            decimal total = decimal.Parse(collection["total"], culture);

            var revendeur = await userManager.FindByIdAsync(revendeurId);
            // save commande
            var nbCmdsRevendeur = RevendeurCommandeRepository.GetRevendeurCommandesByRevendeurId(revendeurId).Count();
            nbCmdsRevendeur++; // update to the new number of commands
            RevendeurCommande revendeurCommande = new RevendeurCommande
            {
                Total = total,
                Reference = revendeur.NormalizedUserName.Substring(0, 4) +"x"+ DateTime.Now.ToString("yyyyMMdd")+"x"+nbCmdsRevendeur.ToString(),
                RevendeurId = revendeurId
              
            };
            RevendeurCommandeRepository.AddRevendeurCommande(revendeurCommande);
            
            // save details commande
            for (int i=0; i<series.Count(); i++)
            {
                var serie = VariationRepository.GetVariationByDesignation(series[i]);
                decimal sous_total = decimal.Parse(sous_totals[i], culture);
                decimal prix = decimal.Parse(prices[i], culture);
                DetailCommandeRevendeur detailCommandeRevendeur = new DetailCommandeRevendeur
                {
                    VariationId = serie.Id,
                    Qte = int.Parse(quantities[i]),
                    SousTotal = sous_total,
                    Prix = prix,
                    RevendeurCommandeId = revendeurCommande.Id,
                    
                };
                DetailCommandeRepository.AddDetailCommandeRevendeur(detailCommandeRevendeur);

                var articlesNonAchetes = ArticleRepository.GetArticlesByStatusAndVariationId(false, serie.Id); 

                int j = 0;
                foreach (var article in articlesNonAchetes)
                {
                    if (j == int.Parse(quantities[i]))
                    {
                        break;
                    }

                    article.Status = true;
                    article.RevendeurId = revendeurId;
                    article.RevendeurCommandId = revendeurCommande.Id;
                    ArticleRepository.UpdateArticle(article);

                    j++;
                }

                //in case there was not enough quantities
                for (; j < int.Parse(quantities[i]); j++)
                {
                    var serieNumber = GenerateSerieNumber();
                    Article newArticle = new()
                    {
                        SerieNumber = serieNumber,
                        Status = true,
                        VariationId = serie.Id,
                        RevendeurId = revendeurId,
                        RevendeurCommandId = revendeurCommande.Id
                    };
                    ArticleRepository.AddArticle(newArticle);
                    GenerateQrCode(serieNumber, serie.Designation);
                }

            }

            return RedirectToAction(nameof(Index));
            
        }

        // GET: RevendeurCommandeController/Edit/5
        public ActionResult Edit(int id)
        {
            return View();
        }

        // POST: RevendeurCommandeController/Edit/5
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Edit(int id, IFormCollection collection)
        {
            try
            {
                return RedirectToAction(nameof(Index));
            }
            catch
            {
                return View();
            }
        }

        // GET: RevendeurCommandeController/Delete/5
        public ActionResult Delete(int id)
        {
            return View();
        }

        // POST: RevendeurCommandeController/Delete/5
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Delete(int id, IFormCollection collection)
        {
            try
            {
                return RedirectToAction(nameof(Index));
            }
            catch
            {
                return View();
            }
        }
    }
}
