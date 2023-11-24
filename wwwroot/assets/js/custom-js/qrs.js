


$(function () {

    $(document).on("click", "#print-qrs-btn", function() {
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



    $(document).on("click", "#print-commande-qrs-btn", function() {
        // Get the content to be printed
        var pdfContent = document.getElementById("pdf-qrs-content").innerHTML;

        // Open a new window with the content
        var printWindow = window.open("", "_blank");
        printWindow.document.write("<html><head><title>QRs De La commande</title></head><body>" + pdfContent + "</body></html>");
        printWindow.document.close();

        // Wait for the window content to be fully loaded
        printWindow.onload = function() {
            // Trigger the print function
            printWindow.print();
        };
    });

});


