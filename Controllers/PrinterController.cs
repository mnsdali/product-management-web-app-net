using Microsoft.AspNetCore.Mvc;

namespace MiniProjet_.NET.Controllers
{
    public class PrinterController : Controller
    {
        // GET: PrinterController
        public ActionResult Index()
        {
            return View();
        }

        // GET: PrinterController/Details/5
        public ActionResult Details(int id)
        {
            return View();
        }

        // GET: PrinterController/Create
        public ActionResult Create()
        {
            return View();
        }

        // POST: PrinterController/Create
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Create(IFormCollection collection)
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

        // GET: PrinterController/Edit/5
        public ActionResult Edit(int id)
        {
            return View();
        }

        // POST: PrinterController/Edit/5
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

        // GET: PrinterController/Delete/5
        public ActionResult Delete(int id)
        {
            return View();
        }

        // POST: PrinterController/Delete/5
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
