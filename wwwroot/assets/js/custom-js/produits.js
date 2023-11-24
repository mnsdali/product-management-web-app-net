

function getCurrentDate(){
    let date = new Date();
    let curr_date = date.getDate();
    let curr_month = date.getMonth();
    let curr_year = date.getFullYear();
    return curr_date + "_" + curr_month + "_" + curr_year;
}

function getCurrentTime(){
    let date = new Date();
    let curr_hour = date.getHours();
    let curr_min = date.getMinutes();
    let curr_sec = date.getSeconds();
    return curr_hour + "_" + curr_min + "_" + curr_sec;
}

function updatePanier(){
    let selects = $('.liste-produits-select');
    let cart_table_ids = $('#cart-table').find('tr');
    for(let tr of cart_table_ids){
        if(!selectedProduits.includes($(tr).attr('id'))){
            $(tr).remove();
        }
    }
    updateTotal();
}

// Reinitialize the multiselect in the newly added .curr-commande element
function reinitProduitSelect(target){
    target.find('.liste-produits-select').multiselect("destroy").multiselect({
        enableFiltering: true,
        enableCaseInsensitiveFiltering: true,
        maxHeight: 400
    });
}

function addRowToPanier(reference, designation, prix, qte){
    let cart_id = reference +'_'+ designation;
    let row = `
        <tr id="${cart_id}" class="cart_row bg-white border-b border-gray-700">
            <td><b>${reference}</b> <input type="hidden" name="references[]" value="${reference}"></td>
            <td><b>${designation}</b> <input type="hidden" name="series[]" value="${designation}"></td>
            <td class="prix">${prix} <input type="hidden" name="prices[]" value="${prix}"></td>
            <td class="qte">${qte} <input type="hidden" name="quantities[]" value="${qte}"></td>
            <td class="sout_total"><b>${prix}</b><input type="hidden" name="sous_totals[]" value="${prix}"></td>
        </tr>
    `;

    // Check if the row already exists
    let existingRow = $('#' + cart_id);
    if (existingRow.length === 0) {
        $('#cart-table').append(row);
    } else {
        existingRow.replaceWith(row);
    }

    let qteLabel = $('#' + cart_id).find('.qte');
    let sout_total = $('#' + cart_id).find('.sout_total');
    // $(qteLabel).text(qte);
    changeSubTotal(sout_total, qte, prix);
    updateTotal();
}

function updateTotal() {
    let subTotalElements = $('.sout_total b');
    let total = 0;
    subTotalElements.each(function() {
        total += parseFloat($(this).text());
    });
    $('#total').html(total.toFixed(2));
    $('input[name="total"]').val(total.toFixed(2));
}

function changeSubTotal(sout_totalElem, qte, prix) {
    let sous_total = (parseFloat(qte) * parseFloat(prix)).toFixed(2);
    $(sout_totalElem).html(`<b>${sous_total}</b><input type="hidden" name="sous_totals[]" value="${sous_total}">`);

    // Update hidden input for quantities
    let tr = $(sout_totalElem).closest('tr');
    let qteInput = tr.find('.qte input[name="quantities[]"]');

    qteInput.val(qte);

    updateTotal();
}



function createProduitsOptions(produits, variations){
    let prouitsSelect = ''
    console.log("here's variations");
    console.log(variations);
    for (let produit of produits){
        for(let variation of variations){
            if(variation['produitId']==produit['id']){
                prouitsSelect += `<option value="${produit['reference']}_${variation['designation']}">${produit['reference']} - ${variation['designation']} </option>`
            }
        }
    }
    return prouitsSelect;

}

var newCommande = ` <div class="curr-commande  card">
<div class="row card-body">
    <div class="col-sm-12 col-md-6 col-lg-6 mx-auto">
        <label class="form-label text-center">Selectionner un produit</label>
        <div class="form-group multiselect_div">
            <select name="designations[]" class="multiselect multiselect-custom liste-produits-select designation" required>
                ${createProduitsOptions(produits, variations)}
            </select>
        </div>
    </div>
    <div class="col-sm-12 col-md-6 col-lg-4 mx-auto">
        <label class="form-label text-center">Préciser la quantité à donner au revendeur</label>
        <input type="number" class="form-control cartQte" value="1" min="1"
            placeholder="quantité">
    </div>
    <div class="col-sm-12 col-md-6 col-lg-2 mx-auto form-group">
        <div class="form-group custom-control-inline" style="margin-left: 10%; margin-top: 20%">
            <a class="add-to-cart-btn" title="Ajouter au commande" data-toggle="tooltip" data-placement="top">
                <i class="fe fe-check-square"></i>
            </a>
            <a class="add-new-prod-for-cart" title="Ajouter un autre produit" data-toggle="tooltip"
                                data-placement="top">
                                <i class="fe fe-copy"></i>
                            </a>
            <a class="remove-from-cart-btn" title="Supprimer" data-toggle="tooltip" data-placement="right" >
                                <i class="fe fe-trash-2" aria-hidden="true"></i>
                </a>
        </div>
    </div>
</div></div>
`

let selectedProduits = [$($('.liste-produits-select')[0]).val()];






$(function () {

    $('.liste-produits-select').multiselect({
        enableFiltering: true,
        enableCaseInsensitiveFiltering: true,
        maxHeight: 400
    });
    $('#revendeur-select').multiselect({
        enableFiltering: true,
        enableCaseInsensitiveFiltering: true,
        maxHeight: 400
    });



    console.log(selectedProduits);
    $(document).on("change", ".liste-produits-select", function() {
        let selectedValue = $(this).val();
        let currCommande = $(this).closest('.curr-commande');
        // Enable the previously selected option in all other .curr-commande selects
        for (let i=0; i<selectedProduits.length; i++){
            if (i != currCommande.index()){
                $($('.liste-produits-select')[i]).find('option[value="' + selectedProduits[currCommande.index()] + '"]').prop('disabled', false);
            }
        }

        selectedProduits[currCommande.index()] = selectedValue;
        console.log('updated: ', selectedProduits);

        // Disable the selected option in all other .curr-commande selects
        $('.curr-commande .liste-produits-select').not(this).find('option[value="' + selectedValue + '"]').prop('disabled', true);

        // Reinitialize the multiselect in all .curr-commande elements
        $('.curr-commande .liste-produits-select').multiselect("destroy").multiselect({
            enableFiltering: true,
            enableCaseInsensitiveFiltering: true,
            maxHeight: 400
        });
        updatePanier();
    });

    $(document).on("click", ".add-new-prod-for-cart", function() {
        let inputField = $(this).closest('.curr-commande').find('.designation');
        let selectedValue = inputField.val(); // Get the selected value
        
        if (produits.length + 1 >= selectedProduits.length) {
            let body = $(this).closest('.commandes');
            body.append(newCommande);

            let lastVar = body.find('.curr-commande:last-child');

            // Enable the previously selected option in all other .curr-commande selects
            for (let prod of selectedProduits){
                lastVar.find('.liste-produits-select option[value="' + prod + '"]').prop('disabled', true);
            }

            let selectedLastVar = body.find('.curr-commande:last-child .liste-produits-select').val();

            if (selectedLastVar == selectedValue || selectedLastVar == null) {
                // Loop over the options of lastVar and if there's a value that doesn't exist inside selectedProduits, make it selected for lastVar and append it to selectedProduits array
                let options = lastVar.find('.liste-produits-select option');
                for (let option of options) {
                    if (!selectedProduits.includes($(option).val())) {
                        selectedLastVar = $(option).val();
                        body.find('.curr-commande:last-child .liste-produits-select').val(selectedLastVar);
                        break;
                    }
                }
            }

            selectedProduits.push(selectedLastVar);
            console.log('updated: ', selectedProduits);

            reinitProduitSelect(lastVar);
            $('[data-toggle="tooltip"]').tooltip();
        } else {
            // Use swal to alert about exceeding the total number of produits
            swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Vous avez atteint le nombre maximal de produits pour cette commande!',
                confirmButtonText: 'OK',
            });
        }
    });

    $(document).on("click", ".add-to-cart-btn", function() {
        let qte = $(this).closest('.curr-commande').find('.cartQte');
        let inputField = $(this).closest('.curr-commande').find('.designation');
        let selectedValue = inputField.val(); // Get the selected value


        let arr = inputField.val().split('_'); // 'reference designation' -> 'reference' 'designation'
        let reference = arr[0];
        let designation = arr[1];

        let prix = 0.00;
        for (let produit of produits) {
            if (reference == produit['reference']) {
                prix = parseFloat(produit['prix']).toFixed(2);
                break;
            }
        }

        updatePanier();

        addRowToPanier(reference, designation, prix, qte.val());



        var references = $("input[name='references[]']") .map(function(){return $(this).val();}).get();
        var series = $("input[name='series[]']").map(function(){return $(this).val();}).get();
        var prices = $("input[name='prices[]']").map(function(){return $(this).val();}).get();
        var quantities = $("input[name='quantities[]']").map(function(){return $(this).val();}).get();
        let sous_totals = $('input[name="sous_totals[]"]').map(function(){return $(this).val();}).get();
        console.log(references)
        console.log(series)
        console.log(prices)
        console.log(quantities)
        console.log(sous_totals)



    });



    $(document).on("click", ".checkout-btn", function(event) {
        event.preventDefault();

        if ($('revendeur-select').val() != null) {
            $("#commandeForm").submit();
        } else {

            // swal.fire({
            //     icon: 'error',
            //     title: 'Oops...',
            //     text: 'Veuillez sélectionner un revendeur!',
            //     confirmButtonText: 'OK',
            // });
            $("#commandeForm").submit();
        }

    });

    $(document).on("click", ".remove-from-cart-btn", function(event) {
        let inputField = $(this).closest('.curr-commande').find('.designation');
        let selectedValue = inputField.val(); // Get the selected value


        let arr = inputField.val().split('_'); // 'reference designation' -> 'reference' 'designation'
        let reference = arr[0];
        let designation = arr[1];
        let cart_id = '#'+reference+'_'+designation;
        if ($(cart_id).length){
            $(cart_id).remove();
        }

        // remove option value of that reference and designation from selectedProduits
        let index = selectedProduits.indexOf(selectedValue);
        if (index > -1) {
            selectedProduits.splice(index, 1);
        }
        $(this).closest('.curr-commande').remove();



    });


});
 // $(document).on("input", ".cartQte", function() {
    //     let inputField = $(this).closest('.curr-commande').find('.designation');
    //     let arr = inputField.val().split(' ');
    //     let reference = arr[0];
    //     let designation = arr[1];
    //     let cart_id= reference+designation;

    //     let qte = $(this).closest('.curr-commande').find('.cartQte');

    //     let qteLabel = $('#'+cart_id).find('.qte');
    //     console.log(qteLabel.text());
    //     let sout_total = $('#'+cart_id).find('.sout_total');
    //     console.log('then: ',sout_total);
    //     $(qteLabel).text(qte.val());
    //     changeSubTotal(sout_total, qte.val(), prix);
    //     console.log('now: ',sout_total);

    //     let prix = parseFloat(currentRow.find("td.prix").text()); // Get the price
    //     let subTotal = currentRow.find("td.sout_total");

    //     changeSubTotal(subTotal, qte, prix.toFixed(2));
    // });
