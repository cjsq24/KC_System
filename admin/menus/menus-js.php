<script>
    //Identificador del formulario, para diferenciar del formulario de módulos que tiene algunos elementos repetidos como los iconos, name y description
    let men = formID;
    var rowTable = { name:'Nombre', icon:'Icon', link:'Link', module:'Módulo' };
    var rowTooltip = { module:'Módulo al que pertenece el menú' };

    $(document).ready(function() {
        getOptions4Select('.idModule', 'modules', 'NINGUNO');
    });

    function selectAction(id) {
        if ($('#action-'+id+'-td :checkbox').is(':checked')) {
            $('#action-'+id+'-td button').removeClass('btn-primary').addClass('btn-outline-dark-check');
            $('#action-'+id+'-td :checkbox').prop('checked', '');
        }
        else {
            $('#action-'+id+'-td button').removeClass('btn-outline-dark-check').addClass('btn-primary');
            $('#action-'+id+'-td :checkbox').prop('checked', 'checked');
        }
    }

    /**************FUNCIONES EXTRAS******************/
    //Creamos las funciones extras iniciando con el id del formulario sin el "-form", seguido del nombre de la función correspondiente.
    function menusResetValues() {
        $('#'+men+' #icon-i').removeClass();
        $('#'+men+' #icon-span').css('background', 'white');
        $('.actions-td button').removeClass('btn-primary').addClass('btn-outline-dark-check').removeAttr('disabled');
        $('#error-span').removeClass('d-none').addClass('d-none');
        $('#modulesModal-btn').removeAttr('disabled');
    }

    function menusValidateCreate() {
        //retornamos 0=válido, 1=inválido.
        let cont = 0;
        $('input[name="actions[]"').each(function() {
            cont = (this.checked) ? cont + 1 : cont;
        });

        if (cont > 0) return 0;
        else {
            $('#error-span').removeClass('d-none');
            return 1;
        }
    }

    function menusValidateUpdate() {
        return 1;
    }

    function menusSetData(data) {
        $('#'+men+' #icon-i').addClass('fa '+data['icon']);
        if ($('#'+men+' #action').val() == 'read') {
            $('#'+men+' .actions-td button').attr('disabled', 'disabled');
            $('#'+men+' #show-icons-btn').attr('disabled', 'disabled');
            $('#'+men+' #icon-span').css('background', '#E6E6E6');
        }
        actions = data['actions'].split(',');
        for (let key in actions) {
            $('#'+men+' #action-'+actions[key]+'-td button').removeClass('btn-outline-dark-check').addClass('btn-primary');
            $('#'+men+' #action-'+actions[key]+'-td :checkbox').prop('checked', 'checked');
        }
        $('#idModule').trigger('change');
    }
    /*****************FIN FUNCIONES EXTRAS***********************/

    $('#'+men+' #show-icons-btn').click(function() {
        $('#'+men+' #icons-modal').modal('show');
    });
    $('#'+men+' .hide-icons-btn').click(function() {
        $('#'+men+' #icons-modal').modal('hide');
    });
</script>