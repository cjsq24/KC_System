<script>
    let lisV = formID;
    var rowTable = { name:'Nombre', parent:'Padre', list:'Lista' };
    var rowTooltip = { parent:'Lista Valor Padre', list:'Lista a la que pertenece' };

    $(document).ready(function() {
        getOptions4Select('.idList', 'lists', 'SELECCIONE');
        //getOptions4Select('.idParent', 'listsValues', 'SELECCIONE');
    });

    $('#idList').change(function() {
        getOptions4Select('#idParent', 'listsValuesParent', 'SELECCIONE', this.value);
    });

    $('#idListS').change(function() {
        getOptions4Select('#idParentS', 'listsValues', '-', this.value);
    });

    /**************FUNCIONES EXTRAS******************/
    //Creamos las funciones extras iniciando con el id del formulario sin el "-form", seguido del nombre de la función correspondiente.
    //function listsValuesShowRegistry(){}

    function listsValuesShowConsult(data) {
        getOptions4Select('#idParent', 'listsValuesParent', 'SELECCIONE', data['idList'], data['idParent']);
    }
    function listsValuesShowUpdate(data) {
        getOptions4Select('#idParent', 'listsValuesParent', 'SELECCIONE', data['idList'], data['idParent']);
    }
    //function listsValuesShowActivation(){}
    //function listsValuesShowDesactivation(){}
    function listsValuesResetValues() {
        $('#idParent').html('<option value="">SELECCIONE<option>');
    }
    function listsValuesResetSearch() {
        $('#idParentS').html('<option value="" selected>-</option>');
    }
    //function listsValuesTableAjax(){}
</script>