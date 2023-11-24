using Azure.Core;
using Microsoft.AspNetCore.Mvc;

using MiniProjet_.NET.Models.Repositories;

namespace MiniProjet_.NET.Controllers
{
    public class VariationController : Controller
    {
        //Injection de la dépendance
        readonly IVariationRepository VariationRepository;
        readonly IProduitRepository ProduitRepository;
        readonly IPieceRepository PieceRepository;
        private readonly IWebHostEnvironment hostingEnvironment;

        public VariationController(IVariationRepository VariationRepository, IProduitRepository ProduitRepository,
                IPieceRepository PieceRepository, 
                 IWebHostEnvironment hostingEnvironment)
        {
            this.VariationRepository = VariationRepository;
            this.ProduitRepository = ProduitRepository;
            this.PieceRepository = PieceRepository;
            this.hostingEnvironment = hostingEnvironment;
        }

        // GET: VariationController
        public ActionResult Index()
        {
            

            return View();
        }

        // GET: VariationController/Details/5
        public ActionResult Details(int id)
        {
            var variation = VariationRepository.GetVariation(id);
            Console.WriteLine(variation.Articles.Count());
            return View(variation);
        }

        public ActionResult PrintAllQrs(int id)
        {
            var variation = VariationRepository.GetVariation(id);

            
            return View(variation);
            
        }

        public ActionResult Create()
        {
            var model = (ProduitRepository.GetProduits(), PieceRepository.GetPieces());

            return View(model);
        }

        // POST: VariationController/Create
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Create(Request request)
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

        // GET: VariationController/Edit/5
        public ActionResult Edit(int id)
        {
            // variations.add-pieces
            ViewData["Variations"] = VariationRepository.GetVariations();
            ViewData["Pieces"] = PieceRepository.GetPieces();

            return View();
        }

        // POST: VariationController/Edit/5
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

        // GET: VariationController/Delete/5
        public ActionResult Delete(int id)
        {
            return View();
        }

        // POST: VariationController/Delete/5
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

        private bool ValidateVarCreation(IFormCollection collection)
        {
            if (string.IsNullOrEmpty(collection["referenceProd"]) ||
                !collection.ContainsKey("designations") ||
                !collection.ContainsKey("quantities"))
            {
                // Add validation errors to the ModelState
                ModelState.AddModelError(string.Empty, "Validation failed. Please provide all required data.");
                return false;
            }

            var designations = collection["designations"];
            var quantities = collection["quantities"];

            if (designations.Count != quantities.Count)
            {
                ModelState.AddModelError(string.Empty, "The number of designations must match the number of quantities.");
                return false;
            }

            for (int i = 0; i < designations.Count; i++)
            {
                if (string.IsNullOrEmpty(designations[i]))
                {
                    ModelState.AddModelError($"designations[{i}]", "Designation is required.");
                }

                if (!int.TryParse(quantities[i], out _))
                {
                    ModelState.AddModelError($"quantities[{i}]", "Quantity must be an integer.");
                }
            }

            return ModelState.IsValid; // Returns true if there are no validation errors
        }

        private bool ValidatePieceSelect(IFormCollection collection)
        {
            if (!collection.ContainsKey("referencesPieces"))
            {
                // Add validation errors to the ModelState
                ModelState.AddModelError("referencesPieces", "ReferencesPieces is required.");
                return false;
            }

            var referencesPieces = collection["referencesPieces"];

            for (int i = 0; i < referencesPieces.Count; i++)
            {
                if (string.IsNullOrEmpty(referencesPieces[i]))
                {
                    ModelState.AddModelError($"referencesPieces[{i}]", "Reference piece is required.");
                }
            }

            return ModelState.IsValid; // Returns true if there are no validation errors
        }


    }
}
