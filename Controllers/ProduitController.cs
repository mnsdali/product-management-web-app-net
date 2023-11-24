using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Primitives;
using MiniProjet_.NET.Models;
using MiniProjet_.NET.Models.Repositories;
using MiniProjet_.NET.Models.ViewModels;
using Net.Codecrete.QrCodeGenerator;
using System.Globalization;


namespace MiniProjet_.NET.Controllers
{
    public class ProduitController : Controller
    {

        //Injection de la dépendance
        readonly IProduitRepository ProduitRepository;
        readonly IPieceRepository PieceRepository;
        readonly IPieceVariationRepository PieceVariationRepository;
        
        readonly IVariationRepository VariationRepository;
        readonly IArticleRepository ArticleRepository;
        private readonly UserManager<ApplicationUser> userManager;
        private readonly RoleManager<IdentityRole> roleManager;
        private readonly IWebHostEnvironment hostingEnvironment;

        public ProduitController(IProduitRepository ProduitRepository, IPieceRepository PieceRepository,
                                  IVariationRepository VariationRepository,
                                 IArticleRepository ArticleRepository, IPieceVariationRepository PieceVariationRepository,
                                 IWebHostEnvironment hostingEnvironment, UserManager<ApplicationUser> userManager, RoleManager<IdentityRole> roleManager)
        {
            this.ProduitRepository = ProduitRepository;
            this.PieceRepository = PieceRepository;
            this.PieceVariationRepository = PieceVariationRepository;
            this.VariationRepository = VariationRepository;
            this.ArticleRepository = ArticleRepository;
            this.hostingEnvironment = hostingEnvironment;
            this.userManager = userManager;
            this.roleManager = roleManager;
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



        public ActionResult ListProduits()
        {
            var produits = ProduitRepository.GetProduits();
           

            return View(produits);
        }

        // GET: ProduitController
        public async Task<IActionResult> Index()
        {

            var model = new PanierViewModel
            {
                Users = new List<IdentityUser>(),
                Produits = ProduitRepository.GetProduits(),
                Variations = VariationRepository.GetVariations()
            };
            
            // Retrieve all the Users
            foreach (var user in userManager.Users.ToList())
            {
                // If the user is in this role, add the username to
                // Users property of EditRoleViewModel. This model
                // object is then passed to the view for display
                if (await userManager.IsInRoleAsync(user, "Revendeur"))
                {
                    model.Users.Add(user);
                }
            }

            return View(model);
        }

        // GET: ProduitController/Details/5
        public ActionResult Details(int id)
        {
            return View();
        }

        // GET: ProduitController/Create
        public ActionResult Create()
        {
            var pieces = PieceRepository.GetPieces();
            // Create a model of the expected type


            return View(pieces); // Pass the model to the view

        }

        // POST: ProduitController/Create
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Create(IFormCollection collection) 
        { 

            var reference = collection["reference"];
            var nom = collection["nom"];
            var description = collection["description"];


            // FormatException: The input string '0.15' was not in a correct format.
            // float prix = float.Parse(Request.Form["prix"]);
            CultureInfo ci = (CultureInfo)CultureInfo.CurrentCulture.Clone();
            ci.NumberFormat.CurrencyDecimalSeparator = ".";
            float prix = float.Parse(collection["prix"], NumberStyles.Any, ci);


            var designations = collection["designations[]"];
            var quantities = collection["quantities[]"];

            // Assuming you know the number of variations
            var numberOfVariations = int.Parse(collection["numberOfVariations"]);
            var pieceIds = new List<List<int>>();
            for (int i = 0; i < numberOfVariations; i++)
            {
                if (!StringValues.IsNullOrEmpty(collection[$"referencesPieces[{i}][]"]))
                {
                    var variationReferences = collection[$"referencesPieces[{i}][]"];
                    var referencesPieces = variationReferences.Select(int.Parse).ToList();
                    pieceIds.Add(referencesPieces);
                }
            }
            Console.WriteLine(pieceIds);

            var designationsList = designations.ToList();
            var quantitiesList = quantities.ToList();
              

            Produit newProuit = new()
            {
                Reference = reference,
                Nom = nom,
                Description = description,
                Prix = (decimal)prix
            };
            ProduitRepository.AddProduit(newProuit);

            for (int i = 0; i < designations.Count(); i++)
            {
                Variation variation = VariationRepository.GetVariationByDesignation(designations[i]);
                if (variation == null)
                {
                    Variation newVariation = new()
                    {
                        Designation = designations[i],
                        ProduitId = newProuit.Id
                    };
                    VariationRepository.AddVariation(newVariation);
                    for (int j = 0; j < int.Parse(quantities[i]); j++)
                    {
                        var serieNumber = GenerateSerieNumber();
                        Article newArticle = new()
                        {
                            SerieNumber = serieNumber,
                            Status = false,
                            Variation = newVariation
                        };
                        ArticleRepository.AddArticle(newArticle);
                        GenerateQrCode(serieNumber, designations[i]);
                    }

                    foreach (var PieceId in pieceIds[i])
                    {
                        PieceVariation newPieceVariation = PieceVariationRepository.GetPieceVariationByIds(PieceId, newVariation.Id);
                        if (newPieceVariation == null)
                        {
                            newPieceVariation = new()
                            {
                                Variation = newVariation,
                                Piece = PieceRepository.GetPiece(PieceId)
                            };
                            PieceVariationRepository.AddPieceVariation(newPieceVariation);
                        }
                    }
                }
            }

            return RedirectToAction("Index");



        }

        // GET: ProduitController/Edit/5
        public ActionResult Edit(int id)
        {
            return View();
        }

        // POST: ProduitController/Edit/5
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

        // GET: ProduitController/Delete/5
        public ActionResult Delete(int id)
        {
            return View();
        }

        // POST: ProduitController/Delete/5
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
