<script>
    let pro = formID;
    var rowTable = { name:'Nombre', description:'Descripción' };
    var rowTooltip = { name:'Nombre Tooltip' };

    function selectAction(idMenu, idAction) {
        let sel = '#'+idMenu+'-'+idAction+'-i';
        if ($(sel+' :checkbox').is(':checked')) {
            $(sel+' button').removeClass('btn-primary').addClass('btn-outline-dark-check');
            $(sel+' :checkbox').prop('checked', '');
        }
        else {
            $(sel+' button').removeClass('btn-outline-dark-check').addClass('btn-primary');
            $(sel+' :checkbox').prop('checked', 'checked');
        }

        $('#idMenu-'+idMenu).prop('checked', '');
        $('.action-'+idMenu).each(function() {
            if (this.checked == true) {
                $('#idMenu-'+idMenu).prop('checked', 'checked');
            }
        })
    }

    function getProfilesMenus() {
        $('#access-div').html(`
            <div style="text-align:center; padding:30px;">
                <img src="../Public/img/ajax-loaders/ajax-loader-1.gif"> Cargando...
            </div>
        `);
        var values = new FormData();
        values.append('idProfile', $('#idProfile').val());
        new FormConfig('').request('profiles/profilesMenus.php', $('#action').val(), values, function(r,a) {
            $('#access-div').html(r);
            if ($('#action').val() == 'read') {
                $('.access-btn').attr('disabled', 'disabled');
            }
        });
    }

    /**************FUNCIONES EXTRAS******************/
    //Creamos las funciones extras iniciando con el id del formulario sin el "-form", seguido del nombre de la función correspondiente.
    function profilesShowRegistry() {
        getProfilesMenus();
    }
    function profilesShowConsult() {
        getProfilesMenus();
    }
    function profilesShowUpdate() {
        getProfilesMenus();
    }

    function profilesResetValues() {
        $('#error-span').removeClass('d-none').addClass('d-none');
        $('#access-div').html('');
    }

    function profilesValidateUpdate() {
        return 1;
    }

    function profilesValidateCreate() {
        //retornamos 0=válido, 1=inválido.
        let cont = 0;
        $('.access-chx').each(function() {
            cont = (this.checked) ? cont + 1 : cont;
        });

        if (cont > 0) return 0;
        else {
            $('#error-span').removeClass('d-none');
            return 1;
        }
    }
    /*****************FIN FUNCIONES EXTRAS*********************/
</script>