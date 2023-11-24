
const typePanneCreateDiv = `
<div class="curr-type-panne card col-lg-3 col-md-6 col-sm-12 p-2">
    <div class="row d-flex align-items-end">
        <div class="col-sm-10 col-md-10 col-lg-10">

                <div class="form-group custom-control-inline">
                    <label class="form-label">Designation</label>
                    <input type="text" class="form-control designation"
                        name="designations[]" placeholder="designation de type de panne...">
                    <div class="validity-msg"></div>
                </div>

        </div>
        <div class="col-lg-2 col-md-2 col-sm-2">
            <div class="form-group custom-control-inline">
                <a class="new-type-add-btn" title="Ajouter un autre type de panne" data-toggle="tooltip"
                    data-placement="top">
                    <i class="fe fe-plus-square"></i>
                </a>
                <a class="new-type-del-var-btn" title="Supprimer la série" data-toggle="tooltip" data-placement="right" >
                    <i class="fe fe-trash-2" aria-hidden="true"></i>
                </a>
            </div>
        </div>
    </div>
</div>
`




$(document).ready(function() {

    $(document).on("click", ".check-status-type-panne", function () {
        let typeBody = $(this).closest('.curr-type-panne');
        let typePanne = $(this).closest('.curr-type-panne').find('.type-id').text();
        console.log(typePanne);
        // send the id of typepanne using ajax link
        $.ajax({
            url: '/type_panne/check_status',
            type: 'POST',
            data: {typePanne: typePanne},
            success: function (data) {
                typeBody.find('[data-toggle="tooltip"]').tooltip('hide').tooltip('dispose');
                typeBody.find('.isHiddenSpan').html(`
                <a href="javascript:void(0)"  title="${data.typePanne.isHidden ? "afficher ce type pour les utilisateurs" : "cacher ce type de utilisateurs"}" data-toggle="tooltip" data-placement="top" class="icon d-md-inline-block ml-2 check-status-type-panne">
                ${data.typePanne.isHidden ? '<i class="fe fe-eye"></i>' : '<i class="fe fe-eye-off"></i>'}</a>
                `);

                $('[data-toggle="tooltip"]').tooltip();

            }
        });
    });

    $(document).on("click", ".new-type-add-btn", function () {
        let body = $(this).closest('.types-panne');
        body.append(typePanneCreateDiv);
        $('[data-toggle="tooltip"]').tooltip();
    });

    $(document).on("click", ".new-type-del-var-btn", function () {
        let row = $(this).closest(".curr-type-panne");
        row.find('[data-toggle="tooltip"]').tooltip('hide').tooltip('dispose');
        row.remove();


    });

});
