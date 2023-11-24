// import '../*';


const noImageUrl = baseUrl + '/assets/images/noimage.jpg';


function createPiecesOptions(pieces){
    let piecesSelect = ''

    for (let piece of pieces){
        piecesSelect += `<option value="${piece['id']}"> ${piece['ref']} - ${piece['designation']}</option>`
    }


    return piecesSelect;

}


var numberOfVariations = 1;
var createNewPieceModalBtn;
var varsNewPieceSelect;
var varsNewVar;
function updateHtmlContents() {
    createNewPieceModalBtn = ` <button class="float-right new-var-create-piece btn text-white bg-indigo btn-sm ml-4 mb-2" data-toggle="modal"
type="button"   data-target="#create-piece-modal"><small>céer une piéce qui n'existe pas</small></button>`
    varsNewPieceSelect = `
<div class="new-var-curr-piece card col-lg-3 col-md-6 col-sm-12">
    <div class="row d-flex align-items-end">
        <div class="col-sm-10 col-md-10 col-lg-10">
            <label class="form-label">Selectionner une piéce</label>
            <div class="form-group multiselect_div">
                <select name="referencesPieces[${numberOfVariations}][]"
                    class="multiselect multiselect-custom new-var-piece-select" required>
                    ${createPiecesOptions(pieces)}
                </select>
            </div>
        </div>
        <div class="col-lg-2 col-md-2 col-sm-2">
            <div class="form-group custom-control-inline">
                <a class="new-var-add-piece-btn" title="Ajouter une autre piéce" data-toggle="tooltip"
                    data-placement="top">
                    <i class="fe fe-plus-square"></i>
                </a>
                <a class="new-var-del-piece-btn" title="Supprimer la piéce" data-toggle="tooltip" data-placement="right" >
                                <i class="fe fe-trash-2" aria-hidden="true"></i>
                </a>
            </div>
        </div>
        ${createNewPieceModalBtn}
    </div>
</div>`;

    varsNewVar = `
<div class="new-vars-curr-var card">
<div class="card-body">
    <h5 class="text-center"> Détails de la série! </h5>
    <div class="card-body">
        <div class="row d-flex justify-content-center align-items-center">
            <div class="col-10 row">
                <div class="col-8 form-group">
                    <div class="form-group custom-control-inline">
                        <label class="form-label">Designation</label>
                        <input type="text" class="form-control designation"
                            name="designations[]" placeholder="designation de variation..." required>
                        <div class="validity-msg"></div>

                    </div>
                </div>
                <div class="col-4 form-group">
                    <div class="form-group custom-control-inline">
                        <label class="form-label">Quantité</label>
                        <input type="number" name="quantities[]" spellcheck="false" value="0"
                            oninput="this.value = parseInt(this.value) || 0;" min="1"
                            class="form-control quantity-inp" required>
                            <div class="validity-msg"></div>
                    </div>
                </div>
            </div>
            <div class="col-2 form-group">
                <div class="form-group custom-control-inline">
                    <a class="vars-add-var-btn" title="Ajouter une autre série" data-toggle="tooltip"
                        data-placement="top">
                        <i class="fe fe-plus-square"></i>
                    </a>
                    <a class="vars-del-var-btn" title="Supprimer la série" data-toggle="tooltip" data-placement="right" >
                    <i class="fe fe-trash-2" aria-hidden="true"></i>
                    </a>
                </div>
            </div>
        </div>
    </div>
    <h4 class="text-center"> Ajout des piéces à la variation ci-dessus! </h4>
    <hr>
    <div class="new-var-pieces row">
        <div class="new-var-curr-piece card col-lg-3 col-md-6 col-sm-12">
        <div class="row d-flex align-items-end">
            <div class="col-sm-10 col-md-10 col-lg-10">
                <label class="form-label">Selectionner une piéce</label>
                <div class="form-group multiselect_div">
                    <select name="referencesPieces[${numberOfVariations}][]"
                        class="multiselect multiselect-custom new-var-piece-select" required>
                        ${createPiecesOptions(pieces)}
                    </select>
                </div>
            </div>
            <div class="col-lg-2 col-md-2 col-sm-2">
                <div class="form-group custom-control-inline">
                    <a class="new-var-add-piece-btn" title="Ajouter une autre piéce" data-toggle="tooltip"
                        data-placement="top">
                        <i class="fe fe-plus-square"></i>
                    </a>
                </div>
            </div>
            ${createNewPieceModalBtn}
        </div>
    </div>
    </div>

</div>
</div>
`;
}

$.ajaxSetup({
    headers: {
        'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
    }
});

$(function () {
    updateHtmlContents();
    $(document).on("input", ".quantity-inp", function () {
        let content = $(this).parent('div');
        if (parseInt($(this).val()) == 0){
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

    $('.new-var-piece-select').multiselect({
        enableFiltering: true,
        enableCaseInsensitiveFiltering: true,
        maxHeight: 400
    });
    $('#edit-var-var-select').multiselect({
        enableFiltering: true,
        enableCaseInsensitiveFiltering: true,
        maxHeight: 400
    });


    $(document).on("click", ".vars-add-var-btn", function () {
        let body = $(this).closest('.new-vars');

        body.append(varsNewVar);
        console.log(pieces);
        let pieceSelect = createPiecesOptions(pieces);
        console.log(pieceSelect);
        $('.new-var-piece-select').html(pieceSelect);
        numberOfVariations++;
        
        $('input[name="numberOfVariations"]').val(numberOfVariations);
        $('.new-var-piece-select').multiselect("destroy").multiselect({
            enableFiltering: true,
            enableCaseInsensitiveFiltering: true,
            maxHeight: 400
        });
        $('[data-toggle="tooltip"]').tooltip();

    });

    $(document).on("click", ".vars-del-var-btn", function () {
        let row = $(this).closest(".new-vars-curr-var");
        row.find('[data-toggle="tooltip"]').tooltip('hide').tooltip('dispose');
        row.remove();

    });

    $(document).on("click", ".new-var-add-piece-btn", function () {
        updateHtmlContents();
        let body = $(this).closest('.new-var-pieces');
        let piece = $(this).closest(".new-vars-curr-var");
        piece.find('.new-var-create-piece').remove();
        body.append(varsNewPieceSelect);
        let pieceSelect = createPiecesOptions(pieces);
        body.find('.new-var-piece-select').html(pieceSelect);
        // get the current variation number for the select
        let currentVariationNumber = body.find(".new-var-curr-piece:first-child select").attr('name');
        console.log(currentVariationNumber);
        console.log(numberOfVariations);
        body.find('.new-var-piece-select').attr('name', currentVariationNumber );
        $('.new-var-piece-select').multiselect("destroy").multiselect({
            enableFiltering: true,
            enableCaseInsensitiveFiltering: true,
            maxHeight: 400
        });
        
        $('[data-toggle="tooltip"]').tooltip();

    });

    $(document).on("click", ".new-var-del-piece-btn", function () {
        let row = $(this).closest(".new-var-curr-piece");
        let allCreatePieceBtns = $('.new-var-create-piece');
        allCreatePieceBtns.remove();
        row.find('[data-toggle="tooltip"]').tooltip('hide').tooltip('dispose');
        row.remove();
        console.log($('.new-var-curr-piece').length);
        console.log(pieces);
        $('.new-var-curr-piece:last-child').find('.row').append(createNewPieceModalBtn);



    });


        $(document).on("click", "#piece-modal-save-btn", function () {

            let pieceRef = $('input[name="pieceModalRef"]');
            let pieceDes = $('input[name="pieceModalDesignation"]');
            let pieceIndArr = $('input[name="pieceModalIndiceArrivage"]');
            let piecePhoto = $('input[name="pieceModalPhoto"]')[0].files[0];
            let pieceQteStock = $('input[name="pieceModalQteStock"]');
            if( !pieceRef.val() || !pieceDes.val() || !pieceIndArr.val()){
                let dangerAlert = `<div class="alert alert-icon alert-danger alert-dismissible show fade" role="alert">
                                            <i class="fe fe-bell mr-2" aria-hidden="true"></i> veuillez renseigner tous les champs obligatoires!
                                            </div>`;
                    // append those messages to the begnning of the modal
                    $('#create-piece-modal').prepend(dangerAlert);

                    $(".alert").delay(10000).slideUp(200, function() {
                        $(this).alert('close');
                    });
                    return;
            }

            let formData = new FormData();
            formData.append('reference', pieceRef.val());
            formData.append('designation', pieceDes.val());
            formData.append('indice_arrivage', pieceIndArr.val());
            formData.append('qte_stock', pieceQteStock.val());
            formData.append('photo', piecePhoto);

            $.ajax({
                type: "POST",
                url: "/variations/save-piece-modal",
                data: formData,
                processData: false,
                contentType: false,
                success: function (response) {

                    if (response.failed){
                        let warnAlert = `<div class="alert alert-icon alert-warning alert-dismissible" role="alert">
                        <i class="fe fe-alert-triangle mr-2" aria-hidden="true"></i> ${response.warning}
                    </div>`;
                    $('#create-piece-modal .modal-body').prepend(warnAlert);
                        return;
                    }
                    console.log(pieces);
                    pieces.push(response.piece);
                    let pieceSelect = createPiecesOptions(pieces);
                    $('.new-var-piece-select').html(pieceSelect);
                    $('.new-var-piece-select').multiselect('rebuild');
                    let piecePhotoInput = $('input[name="pieceModalPhoto"]');

                    // Clear the input values
                    pieceRef.val('');
                    pieceDes.val('');
                    pieceIndArr.val('');
                    pieceQteStock.val('');

                    // Reset the file input
                    piecePhotoInput.val(null);
                    $('#create-piece-modal').modal('hide');

                    let successAlert = `<div class="alert alert-icon alert-primary alert-dismissible show fade" role="alert">
                                            <i class="fe fe-bell mr-2" aria-hidden="true"></i> Piéce ajoutée avec succés
                                            </div>`;
                    // append those messages to the begnning of the modal
                    $('.prod-create-section').prepend(successAlert);

                    $(".alert").delay(10000).slideUp(200, function() {
                        $(this).alert('close');
                    });

                }
            });
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

    $(document).on("input", 'input[name="prixNewProd[]"]', function () {
        let content = $(this).parent('div');
        if ($(this).val().length ===0 || !isNumeric($(this).val())){
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

    $('#prodsForm').on("submit", function (event) {
        let prixInputs = $('input[name="prixNewProd[]"]');
        for (const prixInput of prixInputs){
            if (!isNumeric(prixInput.val())) {
                event.preventDefault(); // Prevent form submission
                alert("Un ou plusieur inputs de prix ne sont pas decimaux . Rectifier s'il vous plaît");
            }
        }

    });

    $('#edit-prod-form').on("submit", function (event) {
        let prix = $('input[name="prix"]');
        let qtes = $('input[name="quantities[]"]');

        if (!isNumeric(prix.val())) {
            event.preventDefault(); // Prevent form submission
            alert("Un ou plusieur inputs de prix ne sont pas decimaux . Rectifier s'il vous plaît");
        }

        for (const qte of qtes){
            if (qte.val() == 0) {
                event.preventDefault(); // Prevent form submission
                alert("vous devez ajouter au moins un article en stock pour chaque nouvelle série. Rectifier s'il vous plaît");
            }
        }

    });

    $('#edit-produit-select').on("select", function (event) {
        let ref = $(this).val();

        for (const produit of produits){
            if (ref == produit['reference']){
                $('input[name="newReference"]').val(ref);
                $('input[name="nom"]').val(produit['nom']);
                $('input[name="description"]').val(produit['description']);
                $('input[name="prix"]').val(produit['prix']);
                break;
            }
        }

    })

    $(document).on("input", ".ref-piece-cls", function () {
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
