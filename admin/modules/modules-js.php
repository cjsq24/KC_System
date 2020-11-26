<script>
    let mod = formID;
    var rowTable    = { name:'Nombre', icon:'Icon', parent:'Módulo Padre' };
    var rowTooltip  = { parent:'Módulo al que pertenece' };

    $(document).ready(function() {
        getOptions4Select('.idParent', 'modulesParentNull', 'NINGUNO');
    });

    /**************FUNCIONES EXTRAS******************/
    //Creamos las funciones extras iniciando con el id del formulario sin el "-form", seguido del nombre de la función correspondiente.
    function modulesResetValues() {
        $('#'+mod+' #icon-i').removeClass();
        $('#'+mod+' #icon-span').css('background', 'white');
    }

    function modulesSetData(data) {
        $('#'+mod+' #icon-i').addClass('fa '+data['icon']);
        if ($('#'+mod+' #action').val() == 'read') {
            $('#'+mod+' #icon-span').css('background', '#E6E6E6');
        }
    }

    function modulesSuccess(action, r) {
        //Agregamos el nuevo registro al select y ordenamos por orden alfabético.
        let idModule = $('#idModule').val();
        if ($('#idParent').val() == '') {
            if (action == 'create') {
                addOption2Select( '#idParent', r.id, $('#name').val());
                let idParentS = $('#idParentS').val();
                addOption2Select('#idParentS', r.id, $('#name').val());
                $('#idParentS').val(idParentS);
            }
            else {
                console.log($('#idModule').val()+' - '+$('#name').val());
                let idParentS = $('#idParentS').val();
                addOption2SelectUpd( '#idParent', $('#idModule').val(), $('#name').val());
                addOption2SelectUpd('#idParentS', $('#idModule').val(), $('#name').val());
                $('#idParentS').val(idParentS);
            }
        }
    }
    /*****************FIN FUNCIONES EXTRAS***********************/

    $('#'+mod+' #show-icons-btn').click(function() {
        $('#'+mod+' #icons-modal').modal('show');
    });
    $('#'+mod+' .hide-icons-btn').click(function() {
        $('#'+mod+' #icons-modal').modal('hide');
    });

</script>