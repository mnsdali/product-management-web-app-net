using Microsoft.AspNetCore.Mvc;
using MiniProjet_.NET.Models;
using MiniProjet_.NET.Models.Repositories;


namespace MiniProjet_.NET.Controllers
{
    public class PieceController : Controller
    {
        //Injection de la dépendance
        readonly IPieceRepository PieceRepository;
        readonly IProduitRepository ProduitRepository;
        readonly IVariationRepository VariationRepository;

        private readonly IWebHostEnvironment hostingEnvironment;

        public PieceController(IPieceRepository PieceRepository, IProduitRepository ProduitRepository, IVariationRepository VariationRepository, IWebHostEnvironment hostingEnvironment)
        {
            this.PieceRepository = PieceRepository;
            this.ProduitRepository = ProduitRepository;
            this.VariationRepository = VariationRepository;
            this.hostingEnvironment = hostingEnvironment;
        }

        // GET: PieceController
        public ActionResult Index()
        {
            ViewData["Pieces"] = PieceRepository.GetPieces();
            return View();
        }

        // GET: PieceController/Details/5
        public ActionResult Details(int id)
        {
            return View();
        }

        // GET: PieceController/Create
        public ActionResult Create()
        {


            return View();
        }

        // POST: PieceController/Create
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Create(IFormCollection collection)
        {
            var refs = collection["refs[]"];
            var designations = collection["designations[]"];
            var indicesArrivage = collection["indicesArrivage[]"];
            var photoStatus = collection["photoStatus[]"];
            var photos = collection.Files;
            int photosIdx = 0;
            var qtesStock = collection["qtesStock[]"];
            
            for (int i = 0; i< refs.Count(); i++)
            {
                string uniqueFileName = null;
                if (photoStatus[i] != "null")
                {
                    Console.WriteLine(photos[photosIdx].FileName + " <=========");

                    string uploadsFolder = Path.Combine(hostingEnvironment.WebRootPath, "images");

                    uniqueFileName = Guid.NewGuid().ToString() + "_" + photos[photosIdx].FileName;
                    string filePath = Path.Combine(uploadsFolder, uniqueFileName);

                    photos[photosIdx].CopyTo(new FileStream(filePath, FileMode.Create));
                    photosIdx++;
                }

                Piece newPiece = new()
                {
                    Ref = refs[i],
                    Designation = designations[i],
                    IndiceArrivage = indicesArrivage[i],
                    QteSav = 0,
                    QteStock = ulong.Parse(qtesStock[i]),
                    // Store the file name in PhotoPath property of the employee object
                    // which gets saved to the Employees database table
                    Photo = uniqueFileName
                };
                PieceRepository.AddPiece(newPiece);
                
            }
                
            return RedirectToAction("index");
            


            
        }


        // GET: PieceController/Edit/5
        public ActionResult Edit(int id)
        {
            return View();
        }

        // POST: PieceController/Edit/5
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

        // GET: PieceController/Delete/5
        public ActionResult Delete(int id)
        {
            return View();
        }

        // POST: PieceController/Delete/5
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

        public string savePhoto(IFormFile photo)
        {

            string uniqueFileName = null;
            // If the Photo property on the incoming model object is not null, then the user has selected an image to upload.
            if (photo != null)
            {
                Console.WriteLine(photo.FileName + " <=========");
                // The image must be uploaded to the images folder in wwwroot
                // To get the path of the wwwroot folder we are using the inject
                // HostingEnvironment service provided by ASP.NET Core
                string uploadsFolder = Path.Combine(hostingEnvironment.WebRootPath, "images");
                // To make sure the file name is unique we are appending a new
                // GUID value and an underscore to the file name
                uniqueFileName = Guid.NewGuid().ToString() + "_" + photo.FileName;
                string filePath = Path.Combine(uploadsFolder, uniqueFileName);
                // Use CopyTo() method provided by IFormFile interface to
                // copy the file to wwwroot/images folder
                photo.CopyTo(new FileStream(filePath, FileMode.Create));
            }

            return uniqueFileName;
        }
    }
}
