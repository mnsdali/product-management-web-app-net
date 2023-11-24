
function getTimeAgoString(inputDateTimeString) {
    const inputDateTime = new Date(inputDateTimeString);
    const currentDate = new Date();
    const timeDifferenceMs = currentDate - inputDateTime;

    const secondsPassed = Math.floor(timeDifferenceMs / 1000);
    const minutesPassed = Math.floor(secondsPassed / 60);
    const hoursPassed = Math.floor(minutesPassed / 60);
    const daysPassed = Math.floor(hoursPassed / 24);
    const monthsPassed = Math.floor(daysPassed / 30.42); // Approximate average month length
    const yearsPassed = Math.floor(monthsPassed / 12);

    if (yearsPassed > 0) {
        return `${yearsPassed} ${yearsPassed === 1 ? 'an' : 'ans'}`;
    } else if (monthsPassed > 0) {
        return `${monthsPassed} ${monthsPassed === 1 ? 'mois' : 'mois'}`;
    } else if (daysPassed > 0) {
        return `${daysPassed} ${daysPassed === 1 ? 'jour' : 'jours'}`;
    } else if (hoursPassed > 0) {
        return `${hoursPassed} ${hoursPassed === 1 ? 'heure' : 'heures'}`;
    } else if (minutesPassed > 0) {
        return `${minutesPassed} ${minutesPassed === 1 ? 'minute' : 'minutes'}`;
    } else {
        return 'quelques secondes';
    }
}






$.ajaxSetup({
    headers: {
        'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
    }
});
$(function(){

    $('#type-panne-select').multiselect({
        enableFiltering: true,
        enableCaseInsensitiveFiltering: true,
        maxHeight: 400
    });

    $(document).on("click", ".sort-techs", function(){
        let coords = $(this).closest("tr").find(".coords").val();
        let techDiv =  $(this).closest("tr").find(".techniciens-list");
        let aCheck = $(this).closest("tr").find(".valider-choix");
        $.ajax({
            type: "POST",
            url: "/reclamation/sort",
            data: {'coords': coords},
            success: distances  => {
                let content = '';
                for(const distance of distances){
                    content += `<option class="tech" value="${distance.email} ${distance.distance.toFixed(2)}">${distance.username} ${distance.distance.toFixed(2)}km - (+216) ${distance.num_tel1}</option>`;

                }
                techDiv.html(content);
                $('.techniciens-list').multiselect('rebuild');
                aCheck.removeClass('d-none');
            }
        });

    });

    $(document).on("input", "#panne-descrip-textarea", function(){
        let inputValue = $(this).val();
        let limitedValue = inputValue.slice(0, 500);

        // Set the limited value to the textarea
        $(this).val(limitedValue);

        let strLen = limitedValue.length;
        $('#countCharsPanneDescrip').text(strLen + '/500');

        if (strLen === 500) {
            $('#countCharsPanneDescrip').css('color', 'red');
        } else {
            $('#countCharsPanneDescrip').css('color', 'black');
        }
    });


    // since when the reclamation has been deployed
    $(".rec-time").each(function() {
        const inputDateTimeString = $(this).text(); // Get the value from the element
        const timeAgoString = getTimeAgoString(inputDateTimeString);
        $(this).text(timeAgoString); // Update the content with the calculated time ago string
    });

    $(document).on("mouseenter", ".rec-time", function(event) {
        let created_at = $(this).closest("div").find('.created_at').val();

        const $hoverDiv = $(".hover-div");
        const offsetX = 0; // Adjust as needed
        const offsetY = 5; // Adjust as needed

        // Calculate position
        const posX = event.pageX + offsetX;
        const posY = event.pageY - $hoverDiv.outerHeight() - offsetY;

        // Position the hover div
        $hoverDiv.css({ top: posY, left: posX }).fadeIn();
        $hoverDiv.text(created_at);

    }).on("mouseleave",".rec-time",  function() {
        $(".hover-div").fadeOut();
    });

    $(document).on("input", ".technicien", function(){
        $(this).closest('tr').find('.valider-choix').removeClass('d-none').addClass('d-flex');
    });

    $(document).on("click", ".valider-choix", function(){
        let rec_id = $(this).closest('tr').find('.rec_id').text();
        let rec_select = $(this).closest('tr').find('.techniciens-list');
        // console.log(rec_id);
        // console.log(rec_select.val());
        if (rec_select.val() == "aucun"){
            let warnAlert = `<div class="alert alert-icon alert-warning alert-dismissible fade show" role="alert">
                        <i class="fe fe-alert-triangle mr-2" aria-hidden="true"></i> Veuillez choisir un technicien avant de confirmer!
                    </div>`;
                $('.reclamations-section').prepend(warnAlert);
        }else{

            $.ajax({
                type: "POST",
                url: "/reclamation/assign-tech",
                data: {'reclamation': rec_id, 'technicien': rec_select},
                success: response  => {
                    let successAlert = `<div class="alert alert-icon alert-primary alert-dismissible fade show" role="alert">
                    <i class="fe fe-bell mr-2" aria-hidden="true"></i> Technicien est associé avec succés!
                    </div>`;
                    $('.reclamations-section').prepend(successAlert );

                    setTimeout(function () {
                        // Closing the alert
                        $('.alert').alert('close');
                    }, 5000);
                }
            });
        }





    });

    $(document).on("click", ".archiver-rec-btn", function(){
        let rec_id = $(this).closest('tr').find('.rec_id').text();

        Swal.fire({
            title: 'Êtes vous sûr?',
            text: "Cette action est réversible!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            cancelButtonText: 'Annuler',
            confirmButtonText: 'Oui, rejette la!'
          }).then((result) => {
            if (result.isConfirmed) {
                $.ajax({
                    type: "POST",
                    url: `/reclamation/archive/{${rec_id}}`,
                    success: response  => {
                        let dangerAlert = `<div class="alert alert-icon alert-danger alert-dismissible fade show" role="alert">
                        <i class="fe fe-bell mr-2" aria-hidden="true"></i> Reclamation est déplacée dans l'archive!
                        </div>`;

                        $('.reclamations-section').prepend(dangerAlert );
                        setTimeout(function () {
                            // Closing the alert
                            $('.alert').alert('close');
                        }, 5000);
                    }
                });



            }
          })




    });

});
