<script>
    let depF = formID;
    //Datos que aparecerán en la tabla (nombre del campo de la base de datos y nombre que quieres que aparezca en la cabecera de la tabla).
    var rowTable = { name:'Nombre', description:'Descripción' };
    //Tooltip de los datos de la tabla (opcional).
    var rowTooltip = { name:'Nombre Tooltip' };

    let rules = {
        name: 'required|unique|lae:1,50', 
        description: 'lae:1,200'
    };
</script>