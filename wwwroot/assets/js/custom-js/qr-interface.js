// There is no way to retrive client location this data via PHP, remember that PHP is executed in the server,
//  not in the client, so you need a client execution language like javascript.
var serie_numbers = [];
if ($('#readerQrReclamation').length){
var scannerReclamation = new Html5QrcodeScanner("readerQrReclamation", {
    // Scanner will be initialized in DOM inside element with id of 'reader'
    qrbox: {
        width: 250,
        height: 250,
    }, // Sets dimensions of scanning box (set relative to reader element width)
    fps: 20, // Frames per second to attempt a scan
});
}
if ($('#venteLinkReader').length){
var scannerVente = new Html5QrcodeScanner("venteLinkReader", {
    // Scanner will be initialized in DOM inside element with id of 'reader'
    qrbox: {
        width: 250,
        height: 250,
    }, // Sets dimensions of scanning box (set relative to reader element width)
    fps: 20, // Frames per second to attempt a scan
});
}
$(function () {

    $(document).on('click', '.quantity-cl-commande-confirm-btn', function(){
        if (lenCommandeClient==-1){
            Swal.fire({
                title: 'Etes vous sûr?',
                text: "Cette action est irreversible!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Oui, je suis sûr!'
              }).then((result) => {
                if (result.isConfirmed) {
                  lenCommandeClient = $('.quantity-cl-commande').val();
                  Swal.fire(
                    'À-jour!',
                    'vous pourrez maintenant scanner les articles',
                    'success'
                  )
                }
              })

        }

    });

    if ($('#readerQrReclamation').length) {
        scannerReclamation.render(successQrReclamation, errorQrReclamation);
        // Starts scanner
    }

    function successQrReclamation(result) {
        $("#qr_status").html(`<div class="qr_detected">MATCH</div>`);
        let verif = false;
        let referenceProd;
        let variation;
        let serie_number;
        let created_at;
        let pseudo;
        if (typeof articles !== undefined) {
            for (let article of articles) {
                if (result == article["serie_number"]) {
                    verif = true;
                    referenceProd = article["reference"];
                    variation = article["var_designation"];
                    serie_number = article["serie_number"];
                    created_at = article["created_at"];
                    pseudo = article["client_pseudo"];
                    break;
                }
            }
        }

        if (verif) {
            getLocation();

            scannerReclamation.clear();
            // Clears scanning instance

            $("#readerQrReclamation").remove();

            $('#referenceProd b').text(referenceProd);
            $('#variation b').text(variation);
            $('#serie_number b').text(serie_number);
            $('#created_at b').text(new Date(created_at.slice(0, -1))); // to convert from iso to local time
            $('#pseudo b').text(pseudo);
            console.log($('#pseudo b').text());

            $('#recl_prod_details').css('display','block');
            // Removes reader element from DOM since no longer needed

            // Fetch the IP address from the API and set it to the 'ipaddr' element value
            fetch("https://api.ipify.org?format=json")
                .then((response) => response.json())
                .then((data) => { $("#ipaddr").val(data.ip); })
                .catch((error) => { console.error("Error fetching IP address:", error); });

            // Show a success message
            swal.fire({
                title: "Félicitations!",
                text: "Vous avez scanné votre produit avec succès!",
                icon: "success",
            });

            $("#prodSerial").val(result);
        } else {
            swal.fire({
                title: "Whoops!",
                text: "Un problème s'est produit! Veuillez réessayer!",
                icon: "error",
            });
        }
    }

    function errorQrReclamation(err) {
        $("#qr_status").html(`<div class="qr_not_detected">Scanning</div>`);
    }
    if ($('#venteLinkReader').length) {
        scannerVente.render(successQrVente, errorQrVente);
        // Starts scanner
    }

    function successQrVente(url) {
        if (lenCommandeClient==-1){
            return
         }

         if (counterArticlesCommandeClient < lenCommandeClient-1){


            // find 'update' index of position in url
            let updateIndex = url.indexOf('update');
            // get only the sub string that is after update/
            let serie_number = url.substring(updateIndex + 7);
            if (serie_numbers.includes(serie_number)){
                $("#qr_status").html(`<div class="qr_detected">Already matched ${counterArticlesCommandeClient}/${lenCommandeClient}</div>`);
                return;
            }
            counterArticlesCommandeClient++;
            serie_numbers.push(serie_number);

            $("#qr_status").html(`<div class="qr_detected">MATCH ${counterArticlesCommandeClient}/${lenCommandeClient}</div>`);
            console.log(serie_numbers);
        }else if(counterArticlesCommandeClient == lenCommandeClient-1){

            // find 'update' index of position in url
            let updateIndex = url.indexOf('update');
            // get only the sub string that is after update/
            let serie_number = url.substring(updateIndex + 7);
            if (serie_numbers.includes(serie_number)){
                $("#qr_status").html(`<div class="qr_detected">Already matched ${counterArticlesCommandeClient}/${lenCommandeClient}</div>`);
                return;
            }
            serie_numbers.push(serie_number);

            // Redirect to the Laravel route venteProduitIndex with serie_number as an argument
            redirectUrl = redirectUrl.replace(':s_n', JSON.stringify( serie_numbers ));


            $(location).attr('href', redirectUrl).catch((error) => {
                console.error("Error redirecting:", error);
                // Handle the error here
            });
         }


    }

    function errorQrVente(err) {
        // $("#qr_status").html(`<div class="qr_not_detected">Veuillez rapprocher le QR pour le détecter</div>`);
    }


});



