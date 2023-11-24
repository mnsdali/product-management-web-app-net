
let settingsIndex;
$.ajaxSetup({
    headers: {
        'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
    }
});


$(function () {
    
    function initializeEasyPaginate() {
        $('#easyPaginate').easyPaginate({
            paginateElement: '.piece-stats:visible',
            elementsPerPage: 4
        });
    }

    // Initial easyPaginate initialization when the page loads
    initializeEasyPaginate();

    $('[data-toggle="tooltip"]').tooltip();

    $(document).on("click", ".settings-btn", function(){
        let piece_stats = $(this).closest('.curr-piece');
        settingsIndex = piece_stats.index();
        let pieceRef = $('input[name="pieceModalRef"]');
        let pieceDes = $('input[name="pieceModalDesignation"]');
        let pieceIndArr = $('input[name="pieceModalIndiceArrivage"]');
        let piecePhoto = $('input[name="pieceModalPhoto"]');
        let pieceQteStock = $('input[name="pieceModalQteStock"]');

        // Instead of .val(), you should use .eq() to get the value
        pieceRef.val($(piece_stats).find(`.piece-reference`).text());
        pieceDes.val($(piece_stats).find(`.piece-stats-designation`).text());
        pieceIndArr.val($(piece_stats).find(`.piece-stats-ind-arr`).text());
        pieceQteStock.val($(piece_stats).find(`.total-stock`).val());
        $('#edit-piece-modal').modal('show');
    });

    $(document).on("click", "#edit-piece-modal-save-btn", function () {
        let pieceRefOld = $('input[name="piece-references[]"]').eq(settingsIndex);
        let pieceRef = $('input[name="pieceModalRef"]');
        let pieceDes = $('input[name="pieceModalDesignation"]');
        let pieceIndArr = $('input[name="pieceModalIndiceArrivage"]');
        let piecePhoto = $('input[name="pieceModalPhoto"]')[0].files[0];
        let pieceQteStock = $('input[name="pieceModalQteStock"]');
        let formData = new FormData();
        formData.append('reference', pieceRef.val());
        formData.append('designation', pieceDes.val());
        formData.append('indice_arrivage', pieceIndArr.val());
        formData.append('pieceQteStock', pieceQteStock.val());
        formData.append('photo', piecePhoto);
        formData.append('pieceRefOld', pieceRefOld.val());
        $.ajax({
            type: "POST",
            url: "/pieces/maj",
            data: formData,
            processData: false,
            contentType: false,
            success: function (response) {


                let body = $(`.piece-stats:nth-child(${settingsIndex+1})`);
                console.log(response);

                // Clear the input values
                if (response.success){
                    body.find('.piece-stats-photo').attr('src', '../../'+response.photo_path);
                    pieceRefOld.val(pieceRef.val());
                    if (response.warning){
                        let warnAlert = `<div class="alert alert-icon alert-warning alert-dismissible" role="alert">
                        <i class="fe fe-alert-triangle mr-2" aria-hidden="true"></i> ${response.warning}
                    </div>`;
                            let successAlert = `<div class="alert alert-icon alert-primary alert-dismissible" role="alert">
                                            <i class="fe fe-bell mr-2" aria-hidden="true"></i> ${response.success}
                                            </div>`;
                        // append those messages to the begnning of the modal
                        $('#edit-piece-modal .modal-body').prepend(warnAlert);
                        $('#edit-piece-modal .modal-body').prepend(successAlert);
                    }else{
                        body.find('.piece-stats-designation').text(pieceDes.val());
                        let successAlert = `<div class="alert alert-icon alert-primary alert-dismissible" role="alert">
                                        <i class="fe fe-bell mr-2" aria-hidden="true"></i> ${response.success}
                                        </div>`;
                        // prepend this before pieces-stats-content id element
                        $('#pieces-stats-content').prepend(successAlert);
                        pieceRef.val('');
                        pieceDes.val('');
                        pieceIndArr.val('');
                        pieceQteStock.val('');
                        // Reset the file input
                        // piecePhoto.val(null);
                        $('#edit-piece-modal').modal('hide');
                    }
                }else{
                    let errorAlert = `<div class="alert alert-icon alert-danger alert-dismissible" role="alert">
                                        <i class="fe fe-alert-triangle mr-2" aria-hidden="true"></i> ${response.error}
                                        </div>`;
                    // append those messages to the begnning of the modal
                    $('#edit-piece-modal .modal-body').prepend(errorAlert);
                }




            }
        });
    });

    $("#searchReference").on("input", function() {
        var query = $(this).val().toLowerCase();
        $(".piece-stats").each(function() {
            var reference = $(this).find(".piece-reference").val().toLowerCase();
            if (reference.indexOf(query) !== -1) {
                $(this).show();
            } else {
                $(this).hide();
            }
        });
        // Trigger pagination refresh
        // Reinitialize the easyPaginate plugin with updated elements
        initializeEasyPaginate();
    });

    $(document).ready(function() {
        $('.img-hover-zoom').hover(
            function() {
                const $image = $(this).find('img');
                const $displayImage = $('#displayImage');

                $displayImage.html(`<img src="${$image.attr('src')}">`);
                $displayImage.css({
                    'left': `${$(window).innerWidth()/2 - 400}px`,
                    'top': `${$(window).innerHeight()/2}px`,
                    'display': 'block',
                    
                });
            },
            function() {
                $('#displayImage').css('display', 'none');
            }
        );
    });




});
