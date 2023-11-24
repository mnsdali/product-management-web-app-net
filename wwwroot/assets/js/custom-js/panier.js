//###################################### for pdf
// Function to generate PDF
function generateRecu() {
    html2pdf().set({
        pagebreak: { mode: 'avoid-all', before: '#page2el' }
      });
    let pdfName = 'reçu_' + getCurrentDate() + '_' + getCurrentTime();

    // Get the HTML content to be converted into PDF
    let pdfContent = document.getElementById('pdf-content');
    // Change '#pdf-content' to the actual selector of your content

    // Create a configuration object for html2pdf.js
    let config = {
        margin: 1,
        filename: pdfName + '.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        jsPDF: { unit: 'mm', format: 'letter', orientation: 'portrait' }
    };

    // Use html2pdf.js to generate the PDF
    html2pdf().from(pdfContent).set(config).save().then(
        function (pdf) {
            // Success here
            console.log('PDF saved successfully.');
        },
        function () {
            // Error here
            console.error('Error saving PDF.');
        }
    );
}

$(function () {

    $(document).on("click", "#print-commande-btn", function(event) {
        // Get the content to be printed
        var pdfContent = document.getElementById("pdf-content").innerHTML;

        // Open a new window with the content
        var printWindow = window.open("", "_blank");
        printWindow.document.write("<html><head><title>Print</title></head><body>" + pdfContent + "</body></html>");
        printWindow.document.close();

        // Wait for the window content to be fully loaded
        printWindow.onload = function() {
            // Trigger the print function
            printWindow.print();
        };
    });
});
