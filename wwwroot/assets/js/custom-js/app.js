

function verifyLeftSideBarActiveLink(id){
    // remove active class from the rest of lis using jquery
    $("#left-sidebar-dashboard-links li").removeClass("active");

    $('#'+id).addClass('active');
    if ($('#'+id).parent('ul').length){
        $('#'+id).parent('ul').parent('li').addClass('active');
    }

}

function getDayName(dayNumber){
    // une fonction qui transforme le nombre de jour de  semaine en nom de jour
    let dayName = '';
    switch (dayNumber) {
        case 0:
            dayName = 'Dimanche';
            break;
        case 1:
            dayName = 'Lundi';
            break;
        case 2:
            dayName = 'Mardi';
            break;
        case 3:
            dayName = 'Mercredi';
            break;
        case 4:
            dayName = 'Jeudi';
            break;
        case 5:
            dayName = 'Vendredi';
            break;
        case 6:
            dayName = 'Samedi';
            break;
        default:
            dayName = 'Dimanche';
            break;
            };
    return dayName;
}



$(document).ready(function() {
    $('.variations-produit-data-table').DataTable();
    // verifyLeftSideBarActiveLink(leftSidebarID);

    let date = new Date();
    $('.currDate').html( getDayName(date.getDay()) + ' Le ' + date.getDate()+'/'+date.getMonth()+'/'+date.getFullYear());

    $(".alert").delay(10000).slideUp(200, function() {
        $(this).alert('close');
    });

    $('#notification-btn').on('click', function() {
        $('.notification-widget').toggle();
    });
});


$(document).on('click', '.print-article-qrs-btn', function() {
    let serie_number = $(this).closest('.curr-article').find('.serie_number').text();
    let qrs = qrCodes[serie_number];
    let qrsContent = '';
    console.log(baseUrl + '/storage/'+qrs[0]);
    // make table with title heads : intervention , s/n , vente
    qrsContent += `<table><thead></thead><tbody>`;
    // loop throughs qr paths and insert inside img with src = baseUrl + qr path
    qrsContent += `<tr>
    <td><pre>        Intervention  <pre></td>
    <td><pre>        S/N d'article  <pre></td>
    <td><pre>           Vente   <pre></td></tr>
    <tr>`
    for (let qr of qrs) {
        qrsContent += `<td><img src="${baseUrl}/storage/${qr}" alt="qr" width="230" height="230"></td>`
    }

    qrsContent += `</tr></tbody>
    </table>`;

    // Open a new window with the content
    var printWindow = window.open("", "_blank");
    printWindow.document.write("<html><head><title>QRS</title></head><body>" + qrsContent + "</body></html>");
    printWindow.document.close();

    // Wait for the window content to be fully loaded
    printWindow.onload = function() {
        // Trigger the print function
        printWindow.print();
    };
});

$(document).on('click', '.print-article-piece-qrs-btn', function() {
    let qr_name = $(this).closest('.curr-article').find('.qr_file_name').val();
    let qr = qrCodesPieces[qr_name];
    let qrsContent = '';
    console.log(baseUrl + '/storage/'+qr);
    // make table with title heads : intervention , s/n , vente
    qrsContent += `<table><thead></thead><tbody>`;
    // loop throughs qr paths and insert inside img with src = baseUrl + qr path
    qrsContent += `<tr>
    <td><pre>        Piece REF  <pre></td>
    <tr>`
    qrsContent += `<td><img src="${baseUrl}/storage/${qr}" alt="qr" width="230" height="230"></td>`
    qrsContent += `</tr></tbody>
    </table>`;

    // Open a new window with the content
    var printWindow = window.open("", "_blank");
    printWindow.document.write("<html><head><title>QRS</title></head><body>" + qrsContent + "</body></html>");
    printWindow.document.close();

    // Wait for the window content to be fully loaded
    printWindow.onload = function() {
        // Trigger the print function
        printWindow.print();
    };




});


// une fonction qui transforme le nombre de jour de  semaine en nom de jour
