<script>
    let lis = formID;
    var rowTable = { name:'Nombre', keyName:'Campo Clave', parent:'Lista Padre' };
    var rowTooltip = { keyName:'Para usos referente a la programación del sistema' };

    $(document).ready(function() {
        getOptions4Select('.idParent', 'lists', 'NINGUNO');
    });

    /**************FUNCIONES EXTRAS******************/
    //Creamos las funciones extras iniciando con el id del formulario sin el "-form", seguido del nombre de la función correspondiente.
    function listsSuccess(action, r) {
        //Agregamos el nuevo registro al select y ordenamos por orden alfabético.
        let idParentS = $('#idParentS').val();
        if (action == 'create') {
            addOption2Select('#idParent', r.id, $('#name').val());
            addOption2Select('#idParentS', r.id, $('#name').val());
        }
        else {
            addOption2SelectUpd('#idParent', $('#idList').val(), $('#name').val());
            addOption2SelectUpd('#idParentS', $('#idList').val(), $('#name').val());
        }
        $('#idParentS').val(idParentS);
    }
    //function listasShowRegistry(){}
    //function listasShowConsult(){}
    //function listasShowUpdate(){}
    //function listasShowActivation(){}
    //function listasShowDesactivation(){}
    //function listasResetValues(){}
    //function listasResetSearch(){}
    //function listasTableAjax(){}
</script>