<script>
    let per = formID;
    //Datos que aparecerán en la tabla (nombre del campo de la base de datos y nombre que quieres que aparezca en la cabecera de la tabla).
    var rowTable = { 
        idDocument:'N° Documento', 
        names:'Nombre y Apellido', 
        email:'Email', 
        cellPhoneNumber:'Celular', 
        city:'Ciudad', 
        state:'Estado', 
        country:'País'
    };
    //Tooltip de los datos de la tabla (opcional).
    var rowTooltip = { city:'Ciudad donde vive' };

    $(document).ready(function() {
        getOptionsListValue('#idTypeDocument', 'typeDocument', 'SELECCIONE');
        getOptionsListValue('.idCountry', 'countries', 'SELECCIONE');
        $('#dateBirth').datepicker({ uiLibrary: 'bootstrap4' });
    });

    $('#idCountry').change(function() {
        getOptionsListValue('#idState', 'states', 'SELECCIONE', this.value);
        $('#idCity').html('<option value="">SELECCIONE</option>');
    });
    $('#idState').change(function() {
        getOptionsListValue('#idCity', 'citys', 'SELECCIONE', this.value);
    });
    $('#idCountryS').change(function() {
        getOptionsListValue('#idStateS', 'state', 'SELECCIONE', this.value);
        $('#idCityS').html('<option value="">SELECCIONE</option>');
    });
    $('#idStateS').change(function() {
        getOptionsListValue('#idCityS', 'city', 'SELECCIONE', this.value);
    });

    /*FUNCIONES EXTRAS*/
    //function personsShowRegistry(){}
    function personsShowConsult(data) {
        personsShow(data);
    }
    function personsShowUpdate(data) {
        personsShow(data);
    }
    //Concateno valores que van al selec cuando es modal, en este caso porque envío id de documento y nombres.
    function personsConcatValues() {
        //return '('+$('#'+per+' #idDocument').val()+') | '+$('#'+per+' #name').val()+' '+$('#'+per+' #surname').val();
        return $('#'+per+' #name').val()+' '+$('#'+per+' #surname').val()+' | ('+$('#'+per+' #idDocument').val()+')';
    }
    //function personsShowActivation(){}
    //function personsShowDesactivation(){}
    function personsResetValues() {
        $('#idState').html('<option value="">SELECCIONE</option>');
        $('#idCity').html('<option value="">SELECCIONE</option>');
    }
    //function personsResetSearch(){}
    //function personsTableAjax(){}
    function personsShow(data) {
        $('#idCountry').val(data['idCountry']).trigger('change.select2');
        getOptionsListValue('#idState', 'state', 'SELECCIONE', data['idCountry'], data['idState']);
        getOptionsListValue('#idCity', 'city', 'SELECCIONE', data['idState'], data['idCity']);
    }
</script>