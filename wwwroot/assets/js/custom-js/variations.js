// import '../*';

console.log(pieces);



function createPiecesOptions(pieces){
    let piecesSelect = ''

    for (let piece of pieces){
        piecesSelect += `<option value="${piece['id']}"> ${piece['ref']} - ${piece['designation']}</option>`
    }


    return piecesSelect;

}

function createProduitsOptions(produits){
    let piecesSelect = ''

    for (let produit of produits){
        piecesSelect += `<option value="${produit['reference']}"> ${produit['reference']} -
        ${produit['nom']}</option>`
    }


    return piecesSelect;

}

const produitOpts = createProduitsOptions(produits);





$.ajaxSetup({
    headers: {
        'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
    }
});

$(function () {
    $('.new-var-piece-select').multiselect({
        enableFiltering: true,
        enableCaseInsensitiveFiltering: true,
        maxHeight: 400
    });

 


    $(document).on("input", ".designation", function () {
        let content = $(this).parent('div');
        if ($(this).val().length ===0){
            content.find('.validity-msg').removeClass('valid-feedback')
                    .addClass('invalid-feedback')
                    .text('ce champs est invalide');
            $(this).removeClass('is-valid').addClass('is-invalid');
        }else{
            content.find('.validity-msg')
            .removeClass('invalid-feedback')
            .addClass('valid-feedback')
            .text('ce champs est valide');
            $(this).removeClass('is-invalid').addClass('is-valid');
        }
    });
});
