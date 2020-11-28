<script>
    let useF = formID;
    //Datos que aparecerán en la tabla (nombre del campo de la base de datos y nombre que quieres que aparezca en la cabecera de la tabla).
    var rowTable = { email:'Usuario', person:'Datos Personales', conditions: 'Condición' };
    //Tooltip de los datos de la tabla (opcional).
    var rowTooltip = { conditions:'Condición actual del usuario' };

    /*var usersValid = {
        name: 'required|notEdit|lae:1,30', 
    }*/

    $('#buttonsGroup-div').append('<button type="button" id="changeCond-btn" class="btn btn-secondary" data-toggle="tooltip" data-placement="top" data-trigger="hover" disabled><span class="fa fa-lock bigger-130"></span></button>');

    $(document).ready(function() {
        getOptions4Select('#idProfile', 'profiles', 'SELECCIONE');
    });

    $('#changeCond-btn').click(function() {
        changeCondition();
    });

    function changeCondition() {
        let conditions = Form.dataRow[Form.rowSelected]['conditions'];
        let idUser     = Form.dataRow[Form.rowSelected]['idUser'];
        if (conditions == '1' || conditions == '2') {
            let type = (conditions == '1') ? 'locked' : 'active';
            let values = new FormData();
            values.append('idUser', idUser);
            values.append('linkFolder', $('#linkFolder').val());
            values.append('conditions', conditions);
            Form.request('../Admin/controller.php', 'changeCondition', values, function(r, a) {
                if (r.result == 'success') {
                    let message = (conditions == '1') ? 'Se ha bloqueado el usuario' : 'El usuario ha sido desbloqueado';
                    swal('Operación exitosa', message, 'success');
                    setCondition(idUser, type);
                }
                else {
                    swal('ERROR', 'No se ha ejecutado ninguna operación', 'error');
                }
            });
        }
    }

    function setCondition(idUser, type) {
        if (type == 'locked') {
            $('#cond'+idUser+'-span').removeClass().addClass('badge badge-secondary').html('BLOQUEADO');
            buttonCondition('unlock');
            Form.dataRow[Form.rowSelected]['conditions'] = '2';
        }
        else if ( type == 'active') {
            $('#cond'+idUser+'-span').removeClass().addClass('badge badge-success').html('ACTIVO');
            buttonCondition('lock');
            Form.dataRow[Form.rowSelected]['conditions'] = '1';
        }
    }

    function buttonCondition(type) {
        if (type == 'lock') {
            $('#changeCond-btn').removeAttr('disabled').attr('title', 'BLOQUEAR').html('<span class="fa fa-lock bigger-130"></span>');
        }
        else if (type == 'unlock') {
            $('#changeCond-btn').removeAttr('disabled').attr('title', 'DESBLOQUEAR').html('<span class="fa fa-unlock bigger-130"></span>');
        }
        else if (type == 'disabled') {
            $('#changeCond-btn').attr('disabled', '');
        }
    }

    /**************FUNCIONES EXTRAS******************/
    self[useF+'ShowRegistry']=function() {
        getOptions4Select('#idPerson', 'personsNotInUsers', 'SELECCIONE');
    }
    self[useF+'ShowConsult']=function(data) {
        self[useF+'Show'](data);
    }
    self[useF+'ShowUpdate']=function(data) {
        self[useF+'Show'](data);
    }
    self[useF+'Show']=function(data) {
        addOption2Select('#idPerson', data['idPerson'], data['person'], 'selected');
        /*getOptions4SelectExtra('#idPerson', 'personsNotInUsers', 'SELECCIONE', function(r) {
            addOption2Select('#idPerson', data['idPerson'], data['person'], 'selected');
        });*/
    }
    self[useF+'Success']=function(action, data) {
        let idUser = $('#idUser').val();
        if (action == 'inactivate') {
            setCondition(idUser, 'locked');
            $('#changeCond-btn').attr('disabled', '');
        }
        else if (action == 'activate') {
            let conditions = Form.dataRow[Form.rowSelected]['conditions'];
            if (conditions != '0') {
                let type = (conditions == '1') ? 'lock' : 'unlock';
                buttonCondition(type);
            }
        }
    }
    self[useF+'SelectRow']=function(data) {
        if (data == '') {
            buttonCondition('disabled');
        }
        else if (data.conditions == '0' || data.status == '0' ) {
            buttonCondition('disabled');
        }
        else if (data.conditions == '2') {
            buttonCondition('unlock');
        }
        else if (data.conditions == '1') {
            buttonCondition('lock');
        }
    }
    /**************FIN FUNCIONES EXTRAS******************/
</script>