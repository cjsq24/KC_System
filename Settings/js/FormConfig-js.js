class FormConfig 
{
    constructor(form) {
        this.form = form;
        this.parentInput = '';
        this.data = '';
        this.dataRow = '';
        this.rowSelected = '';
        this.rowSelected2 = '';
        this.contInact = 0;
        this.tbodyEmpty = '<tr><td colspan="50"> <img src="../Public/img/ajax-loaders/ajax-loader-1.gif">Cargando...</td></tr>';
    }

    //paramSearch($("#cmbParamBusq option:selected").text());

    theadTable(rowTable, rowTooltip) {
        let dataToggle = ' data-toggle="tooltip" data-placement="top"';
        let thead = '<th>#</th>';
        for (let key in rowTable) {
            let title = (rowTooltip[key]) ? rowTooltip[key] : '';
            thead += '<th><span ' + dataToggle + ' title="' + title + '">' + rowTable[key] + '</span></th>';
        }
        thead = thead + '<th>Estatus</th>';
        $("#thead-table").html("<tr>" + thead + "</tr>");
    }

    setData(datos) {
        for (let key in datos) {
            if ($("#"+key).val() !== undefined) {
                //console.log(datos + ' - ' + key);
                console.log($("#" + key));
                if (datos[key] != null) {
                    $("#" + key).val(datos[key]).trigger('change.select2');
                }
                else {
                    $("#" + key).val('').trigger('change.select2');
                }
            }
        }
        if (typeof self[this.form+'SetData'] === 'function') self[this.form+'SetData'](datos);
    }

    convertArray2Php(JsArr) {
        var Php = '';
        if (Array.isArray(JsArr)) {
            Php += 'array(';
            for (let i in JsArr) {
                Php += '\'' + i + '\' => ' + this.convertArray2Php(JsArr[i]);
                if (JsArr[i] != JsArr[Object.keys(JsArr)[Object.keys(JsArr).length-1]]) { Php += ', '; }
            }
            Php += ')';
            return Php;
        } else { return '\'' + JsArr + '\''; }
    }

    validateModify(datos) {
        let cont = 0;
        for (let key in datos) {
            if ($('#'+key).val() !== undefined) {
                if (datos[key] != $('#'+key).val()) cont ++;
            }
        }
        if (typeof self[this.form+'ValidateUpdate'] === 'function') cont += self[this.form+'ValidateUpdate']();
        return (cont > 0) ? true : false;
    }

    /*ENVIO DE RECEPCION DE DATOS VIA AJAX*/
    sendData(action, field = '')
    {
        //console.log(this.form);
        let that = this;
        var values = new FormData(document.getElementById(this.form));
        values.append('field', field);
        //console.log(values.values());
        //new Response(values).text().then(console.log)
        /*for (var pair of values.entries()) {
            console.log(pair[0]+ ', ' + pair[1]); 
        }*/
        //var values = $('#Form').serialize();
        //console.log($('#'+this.form).serialize());
        this.request('../admin/controller.php', action, values, function(r,a) {
            /*MENSAJES*/
            /*SI LA OPERACION FUE EXITOSA, MUESTRO MENSAJE Y MUESTRO EL REGISTRO*/
            if ((action == "create" || action == "update") && r.result == "success")
            {
                if (typeof self[that.form+'Success'] === 'function') self[that.form+'Success'](action, r.data);

                var message = (r.message != '') ? r.message : 'Operación exitosa';
                swal('', message, 'success');
                if (action == 'create') {
                    $("#paramS").val($("#paramS option:first").val());
                    $('#statusS').val('1');
                    that.search();
                    that.hideForm();
                }
                else if (action == 'update') {
                    that.rowSelected2 = that.rowSelected;
                    that.search();
                    that.hideForm();
                    $('#searchS').popover('hide');
                }

                /*swal({
                    title: "¡OPERACION EXISTOSA!",
                    text: message,
                    type: "success",
                    showCancelButton: true,
                    cancelButtonText:"NO",
                    confirmButtonColor: "#DD6B55",
                    confirmButtonText: "SI",
                    closeOnConfirm: true,
                    allowEscapeKey: true 
                },
                function(isConfirm) {
                    if (isConfirm) {
                        $('#searchS').val($('#nombre').val());
                        $('#estatusS').val('');
                        search();
                        hideForm();
                        $('#searchS').popover('hide');
                    }
                    else {
                        search();
                        hideForm();
                    }
                });*/
            }
            else if (action == "activate" || action == "inactivate" && r.result == 'success') {
                var tdStatus = that.data[Object.keys(that.data)[0]];
                if (action == 'activate') {
                    that.dataRow[that.rowSelected].status = '1';
                    $('.activate-btn').attr('disabled', 'disabled');
                    $('.inactivate-btn').removeAttr('disabled');
                    $('.update-btn').removeAttr('disabled');
                    $('#status-'+tdStatus+'-td').html('<span class="badge badge-success" style="border-radius:0px;font-size:12px;">ACTIVO</span>');
                }
                else if (action == 'inactivate') {
                    that.dataRow[that.rowSelected].status = '0';
                    $('.activate-btn').removeAttr('disabled');
                    $('.inactivate-btn').attr('disabled', 'disabled');
                    $('.update-btn').attr('disabled', 'disabled');
                    $('#status-'+tdStatus+'-td').html('<span class="badge badge-secondary" style="border-radius:0px;font-size:12px;">INACTIVO</span>');
                    that.contInact ++;
                }
                if (typeof self[that.form+'Success'] === 'function') self[that.form+'Success'](action, r.data);
                //search();
                //resetForm();
                var message = (action == 'activate') ? 'activado' : 'desactivado';
                swal('Operación exitosa', 'Se ha ' + message + ' el registro exitosamente', 'success');
            }
            /*SI LOS DATOS SON INVALIDOS O HUBO UN ERROR EN LA OPERACION, ENVIO MENSAJE DE ERROR*/
            else if (r.result == "invalid_data" || r.result == "failure") {
                if (r.message == '') {
                    var message = (r.result == 'invalid_data') ? 'Datos Inválidos' : 'Operación fallida';
                }
                else {
                    var message = r.message;
                }

                if (action == "update"){}
                else if (action == "activate" || action == "inactivate") {
                    /*DESABILITO EL FORMULARIO*/
                    $(".input-form").attr("disabled","disabled");
                }

                /*MUESTRO EL MENSAJE DE ERROR*/
                swal("!ERROR!", message, "error");
            }
            /*SI LA CEDULA QUE HA INGRESADO EXISTE, PREGUNTO SI DESEA VERIFICAR EL REGISTRO*/
            else if (r.result == "existe") {
                $('#'+that.form+' #'+field+'').addClass('is-invalid');
                $('#'+that.form+' #'+field+'-valid').html(r.message);
                return 1;
                //existsExtra(input);
            }
            else if (r.result == "no_existe") {
                return 0;
            }
            else if (r.result == "access_denied") {
                that.hideForm();
                alert("ACCESO DENEGADO");
                self.location =(" ../Controladores/logout.php");
            }
        });
    }

    request(ruta, action, data, callback = 'request_response', parameters = []) {
        data.append('action', action);
        $.ajax({
            cache: false, type: 'POST', dataType: 'json', url: ruta, processData: false, contentType: false,
            data: data,
            success: function(response) {
                if (callback instanceof Function) {
                    callback(response, action, parameters);
                }
                else if (typeof(callback) == "string") {
                    self[callback](response, action, parameters);
                }
            },
            error: function(e) { /*ERROR DEL SERVIDOR*/
                swal('ERROR', 'Error en el servidor', 'error');
                console.log(e);
            }
        });
    }

    /*VERIFICAR SI EL DATO EXISTE EN LA BASE DE DATOS*/
    verifyIfExist(field, value) {
        $('#'+this.form+' #'+field).removeClass('is-invalid');
        //VALIDAMOS QUE EL CAMPO NO ESTÉ VACÍO PARA HACER LA PETICIÓN
        if ($('#'+this.form+' #action').val() == 'create' && value != '') {
            let a = this.sendData('verify_if_exist', field);
            console.log(a);
        }
        //VALIDAMOS QUE SE HAYA HECHO ALGÚN CAMBIO EN EL CAMPO, DE LO CONTRARIO ME DIRÍA QUE YA EXISTE PORQUE SE ESTARÍA VERIFICANDO A SÍ MISMO
        else if ($('#'+this.form+' #action').val() == 'update' && value != '' && value != this.data[field]) {
            return this.sendData('verify_if_exist', field);
        }
        else if ($('#'+this.form+' #action').val() == '' && value != '') {
            return this.sendData('verify_if_exist', field);
        }
    }

    validateData() {
        let errors = 0;
        errors = submitValidate(this.form);
        if (typeof self[this.form+'ValidateCreate'] === 'function') errors += self[this.form+'ValidateCreate']();
        return (errors == 0) ? true : false;
    }

    /*$('.input-form').keyup(function() {
        if ($('#' + this.id).val() != '') {
            $('#' + this.id).removeClass('is-invalid');
        }
    });*/

    paramSearch() {
        var Busq = $("#paramS option:selected").text();
        $("#searchS").attr("data-content", "Buscar por: " + Busq);
        $("#searchS").attr("placeholder", "Buscar por:" + Busq);
        $("#searchS").focus();
        $("#searchS").val("");
    }

    resetSearch() {
        $("#form-search")[0].reset();
        $('.input-search').trigger('change.select2');
        $("#searchS").focus();
        if (typeof self[this.form+'ResetSearch'] === 'function') self[this.form+'ResetSearch']();
    }

    /*FORMULARIO REGISTRAR*/
    showRegistry() {
        $('[data-toggle=tooltip]').tooltip('hide');
        this.resetForm();
        /*DESBLOQUEO LOS CAMPOS QUE CONTENGAN LA CLASE .input-form(ELEMENTOS DEL FORMULARIO)*/
        //$('.input-form ').removeAttr('disabled').not(':checkbox').val('');
        /*CAMBIO EL TITULO DE LA VENTANA MODAL*/
        $('#formTitle-span').html('REGISTRAR ');
        $('#action').val('create');
        $('#status-div').css('display', 'none');
        $('#send-btn').css('display', '');
        $('#send-btn').html('<a class="orange"> <span class="fa fa-save"> </span> Registrar</a>');
        if (typeof self[this.form+'ShowRegistry'] === 'function') self[this.form+'ShowRegistry']();
        $('#search-div').css('display', 'none');
        $('#form-div').show();
    }

    /*FORMULARIO CONSULTAR*/
    showConsult()
    {
        $('[data-toggle=tooltip]').tooltip('hide');
        $('#action').val('read');
        this.setData(this.data);
        $('#formTitle-span').html('CONSULTA ');
        $('.input-form').attr('disabled','disabled');
        $('.input-group-append button').attr('disabled','disabled');
        //$('.text-obligatorio').html('');
        $('#send-btn').css('display','none');
        $('#status-div').css('display','');
        this.spanStatus($('#status').val());
        if (typeof self[this.form+'ShowConsult'] === 'function') self[this.form+'ShowConsult'](this.data);
        $('#search-div').css('display','none');
        $('#form-div').show();
    }

    spanStatus(valor)
    {
        if (valor == '1') {
            $('#status-span').html('<span class="badge badge-success" style="border-radius:0px;">ACTIVO</span>');
        }
        else if (valor == '0') {
            $('#status-span').html('<span class="badge badge-secondary" style="border-radius:0px;">INACTIVO</span>');
        }
    }

    showActivation()
    {
        let that = this;
        $('[data-toggle=tooltip]').tooltip('hide');
        swal({
                title: "Atención",
                text: '¿Confima activar el registro?',
                type: 'info', 
                showCancelButton: true,
                closeOnConfirm: false,
                showLoaderOnConfirm: true,
                confirmButtonText: 'SI',
                cancelButtonText: 'NO' 
            }, 
            function() {
                that.setData(that.data);
                if (typeof self[this.form+'ShowActivation'] === 'function') self[this.form+'ShowActivation'](this.data);
                that.sendData('activate');
        });
    }

    showInactivation()
    {
        let that = this;
        $('[data-toggle=tooltip]').tooltip('hide');
        swal({
                title: "Atención",
                text: '¿Confima desactivar el registro?',
                type: 'info', 
                showCancelButton: true,
                closeOnConfirm: false,
                showLoaderOnConfirm: true,
                confirmButtonText: 'SI',
                cancelButtonText: 'NO' 
            }, 
            function() {
                that.setData(that.data);
                if (typeof self[this.form+'ShowDesactivation'] === 'function') self[this.form+'ShowDesactivation'](this.data);
                that.sendData('inactivate');
        });
    }

    /*FORMULARIO MODIFICAR*/
    showUpdate()
    {
        $('[data-toggle=tooltip]').tooltip('hide');
        $('#action').val('update');
        this.setData(this.data)
        $('.input-form').removeAttr('disabled');
        $('#formTitle-span').html('Modificación ');
        $('#status-div').css('display','none');
        $('#send-btn').css('display','');
        $('#send-btn').html('<span class="glyphicon glyphicon-pencil"></span> Modificar');
        if (typeof self[this.form+'ShowUpdate'] === 'function') self[this.form+'ShowUpdate'](this.data);
        $('#search-div').css('display','none');
        $('#form-div').show();
    }

    openModalSearch() {
        $('#modalSearch').modal('show');
        $('#action').val('buscar');
    }

    closeModalSearch() {
        $('#modalSearch').modal('hide');
    }

    /*OCULTAR FORMULARIO*/
    hideForm()
    {
        this.resetForm();
        $('#form-div').css('display','none');
        $("#formInput-div").show();
        $('#formTitle-span').html('');
        $("#alertForm-div").hide();
        $('#search-div').show();
    }

    /*RESETEAR FORMULARIO*/
    resetForm()
    {
        $('#alert-div').css('display','none');
        $('#changeStatus-div').css('display','none');
        $('#action').val('');
        this.resetValues();
        $('.input-group-append button').removeAttr('disabled');
    }

    resetValues() {
        let form = (this.form != '') ? '#'+this.form+' ' : '';
        $(form+'.input-form').removeAttr('disabled').prop('checked', '').removeClass('is-invalid').not(':checkbox').val('').trigger('change.select2');
        $(form+'.fieldID').val(0);
        $(form+'.invalid-feedback').html('');
        if (typeof self[this.form+'ResetValues'] === 'function') self[this.form+'ResetValues']();
    }


    selectPage(page)
    {
        var that = this;
        $('[data-toggle=tooltip]').tooltip('hide');
        $('#pageS').val(page);
        $('#tbody-table').html(that.tbodyEmpty);
        setTimeout(function(){ that.tableAjax(); }, 500);
        this.data = '';
        this.lockButtons();
    }

    selectPageSize(pageSize)
    {
        let that = this;
        $('[data-toggle=tooltip]').tooltip('hide');
        $('#tbody-table').html(that.tbodyEmpty);
        $('#pageS').val(1);
        $('#pageSizeS').val(pageSize);
        setTimeout(function(){ that.tableAjax(); }, 500);
        this.data = '';
        this.lockButtons();
    }

    selectRow(id) {
        if (this.rowSelected !== id) {
            $('#tbody-table tr').removeClass('table-info');
            $('#tr'+id).addClass('table-info');
            this.data = this.dataRow[id];
            this.rowSelected = id;
            if (this.data.status == '1') {
                $('.activate-btn').attr('disabled','disabled');
                $('.inactivate-btn').removeAttr('disabled');
                $('.update-btn')    .removeAttr('disabled');
                $('.print-btn')     .removeAttr('disabled');
            }
            else {
                $('.activate-btn').removeAttr('disabled');
                $('.inactivate-btn').attr('disabled','disabled');
                $('.update-btn')    .attr('disabled','disabled');
                $('.print-btn')     .attr('disabled','disabled');
            }
            this.unlockButtons();
        }
        else {
            $('#tbody-table tr').removeClass('table-info');
            this.data = '';
            this.rowSelected = '';
            this.lockButtons();
        }
        if (typeof self[this.form+'SelectRow'] === 'function') self[this.form+'SelectRow'](this.data);
    }

    lockButtons() {
        $('.read-btn').attr         ('disabled','disabled');
        $('.update-btn').attr       ('disabled','disabled');
        $('.activate-btn').attr     ('disabled','disabled');
        $('.inactivate-btn').attr   ('disabled','disabled');
        $('.pdf-btn').attr          ('disabled','disabled');
    }

    //lockButtons();

    unlockButtons() {
        $('.read-btn').removeAttr('disabled');
        $('#send-btndata').removeAttr('disabled');
    }

    //Filtrar registros.
    search() {
        let that = this;
        var cont = 0;
        $("#form-search").find(".input-search").each(function () {
            cont += ($(this).val() != "") ? 1 : 0;
        });
        if (cont > 1) {
            /*Para que cuando se haga una busqueda, comience desde la primera pagina*/
            $('#pageS').val(1);
            $('[data-toggle=tooltip]').tooltip('hide');
            this.data = '';
            this.lockButtons();
            $('#tbody-table').html('<tr><td colspan="50"> <img src="../Public/img/ajax-loaders/ajax-loader-1.gif"></td></tr>Buscando...');
            setTimeout(function(){ that.tableAjax(); }, 500);
            $('#modalSearch').modal('hide');
            $("#alertSearch-div").hide();
        }
        else {
            $("#alertSearch-div").show();
        }
    }

    //Enviar datos de búsqueda al script de la tabla.
    tableAjax(action = 'update') {
        let that = this;
        var inputs = $('.input-search').serialize();
        this.rowSelected = '';
        $.ajax({
            cache: false, type: "POST", dataType: "json", url: $('#'+this.form+' #linkFolder').val() + '/' + $('#'+this.form+' #linkFolder').val() + '-table.php',
            data: inputs + '&rowTD=' + this.convertArray2Php(this.rowTD),
            success: function(r) {
                //console.log(r.dataRow);
                that.dataRow = r.dataRow;
                //console.log(this.dataRow);
                if (r.dataTable != null) {
                    $('#tbody-table').html(r.dataTable);
                }
                else {
                    $('#tbody-table').html('<tr><td colspan="100" style="text-align:center"> No se han encontrado resultados </td></tr>');
                }
                $('#back-table').html(r.footerTable['anterior']);
                $('#pages-table').html(r.footerTable['paginas']);
                $('#next-table').html(r.footerTable['siguiente']);
                $('#totalRecords-table').html(r.footerTable['totalRegistros']);
                if (typeof self[that.form+'TableAjax'] === 'function') self[that.form+'TableAjax']();
                $('[data-toggle=tooltip]').tooltip();
                if (that.contInact == 0) {
                    that.selectRow(that.rowSelected2);
                }
                that.contInact = 0;
            },
            error: function(e) { console.log(e); }
        });
    }

    /*ACCION DE LA TECLA ENTER*/
    stopRKey(evt) 
    {
        var evt =(evt) ? evt :((event) ? event : null);
        var node =(evt.target) ? evt.target :((evt.srcElement) ? evt.srcElement : null);
        if ((evt.keyCode == 13) &&(node.type=='text')) {
            if ($('#action').val()=='buscar') {
            search();
            return false;
            }
        }
    }
    //document.getElementById('Form').onkeypress = stopRKey;

    sendForm() {
        let that = this;
        /*SI LA OPERACION ES MODIFICAR, VERIFICO QUE HAYA REALIZADO ALGUN CAMBIO AL MENOS*/
        if ($('#'+this.form+' #action').val() == 'update' && !this.validateModify(this.data)) {
            /*$("#alertForm-div").show();
            $("#alertForm-span").html("No ha realizado ningún cambio");*/
            swal('Info','No ha realizado ningún cambio','info');
        }
        /*CONFIRMO LA OPERACION A EJECUTAR*/
        else {
            if (this.validateData()) {
                swal({  title: '¡Confirmar!',
                        text: '¿Confirma ejecutar la operación?',
                        type: 'info', 
                        showCancelButton: true,
                        closeOnConfirm: false,
                        showLoaderOnConfirm: true,
                        confirmButtonText: 'SI',
                        cancelButtonText: 'NO' }, 
                    function() {
                        /*HABILITO LOS CAMPOS (LOS CAMPOS BLOQUEADOS NO SERAN ENVIADOS)*/
                        $('#'+that.form+' .input-form').removeAttr('disabled');
                        /*EJECUTO LA FUNCION AJAX*/
                        that.sendData($('#'+that.form+' #action').val());
                });
            }
        }
    }

    invalidAction(btn) {
        $('[data-toggle=tooltip]').tooltip('hide');
        $('.'+btn).attr('disabled', 'disabled');
    }

    startForm(rowTable) {
        this.rowTD = [];
        for (let key in rowTable) this.rowTD.push(key);
        //if ($('#ventPadreS').val() != '') $('#estatusS').val('1');
        $('[data-toggle=tooltip]').tooltip();
        $('[data-toggle=popover]').popover();
        this.lockButtons();
    }

    //Registro vía modal
    createByModal() {
        let that = this;
        let formParent = $('#'+this.form+' #formParent').val();
        //console.log('formParent='+formParent);
        let name = $('#'+this.form+' #name').val();
        if (typeof self[that.form+'ConcatValues'] === 'function') name = self[that.form+'ConcatValues']();
        //console.log('name='+name);
        //if (this.validateData()) {
            let values = new FormData(document.getElementById(this.form));
            values.append('field', '');
            this.request('../admin/controller.php', 'create', values, function(r,a) {
                if (r.result == "success") {
                    addOption2Select('#'+formParent+' #'+that.parentInput, r.data.id, name);
                    $('#'+formParent+' #'+that.parentInput).val(r.data.id).trigger('change.select2');
                    $('#'+that.form+'-modal').modal('hide');
                    that.resetValues();
                    if (typeof self[that.form+'ResetValues'] === 'function') self[that.form+'ResetValues']();
                }
                else if (r.result == "invalid_data" || r.result == "failure") {
                    if (r.message == '') {
                        var message = (r.result == 'invalid_data') ? 'Datos Inválidos' : 'Operación fallida';
                    }
                    else {
                        var message = r.message;
                    }
                    swal("!ERROR!", message, "error");
                }
                /*SI LA CEDULA QUE HA INGRESADO EXISTE, PREGUNTO SI DESEA VERIFICAR EL REGISTRO*/
                else if (r.result == "existe") {
                    $('#'+that.form+' #'+field+'').addClass('is-invalid');
                    $('#'+that.form+' #'+field+'-valid').html(r.message);
                    //existsExtra(input);
                }
                else if (r.result == "access_denied") {
                    alert("ACCESO DENEGADO");
                    self.location =(" ../Controladores/logout.php");
                }
            });
        //}
    }
}

Form = new FormConfig(formID);
Form.theadTable(rowTable, rowTooltip);
Form.startForm(rowTable);
Form.paramSearch();
/*FUNCION QUE LLAMA AL SCRIPT DONDE SE MUESTRAN LOS DATOS DE LA TABLA*/
$(document).ready(function() {
    
});

/*EVENTOS DE LA BOTONERA*/
$(".create-btn").click(function()           { Form.showRegistry     (); });
$(".update-btn").click(function()           { if (Form.data != '') Form.showUpdate();         else Form.invalidAction('update-btn');       });
$(".read-btn").click(function()             { if (Form.data != '') Form.showConsult();        else Form.invalidAction('read-btn');         });
$(".activate-btn").click(function()         { if (Form.data != '') Form.showActivation();     else Form.invalidAction('activate-btn');     });
$(".inactivate-btn").click(function()       { if (Form.data != '') Form.showInactivation();  else Form.invalidAction('inactivate-btn');   });
$("#hideForm-btn").click(function()         { Form.hideForm         (); });
$("#openModalSearch-btn").click(function()  { Form.openModalSearch  (); });
$("#closeModalSearch-btn").click(function() { Form.closeModalSearch (); });
$("#resetSearch-btn").click(function()      { Form.resetSearch      (); });
$("#search-btn").click(function()           { Form.search           (); });

//Eventos footer tabla
$(document).on("click", "#backPage-btn",   function() { Form.selectPage($(this).attr('page')); });
$(document).on("click", "#nextPage-btn",   function() { Form.selectPage($(this).attr('page')); });
$(document).on("change", "#selectPage-sel", function() { Form.selectPage(this.value); });
$("#pageSize-sel").change( function() { Form.selectPageSize(this.value); });
//$(document).on("change", "#pageSize-sel",   function() { Form.selectPageSize(this.value); });

/*EVENTO QUE SE ACTIVA CUANDO PULSO EL BOTON SUBMIT*/
$('#send-btn').click( function() { Form.sendForm(); });

$(document).on("click", ".selectRow", function() { Form.selectRow($(this).attr('row')); });
//$(".selectRow").click(function() { alert('hola'); console.log($(this).attr('row')); Form.selectRow($(this).attr('row')); });

$(document).on("focusout", "input[checkIfExist]", function() {
    let form = $(this).closest('form');
    let obj = new FormConfig(form[0].id);
    obj.verifyIfExist(this.id, this.value);
});

function addOption2Select(idSelect, id, value, selected = '') {
    //console.log($('#idPerson'));
    //console.log(id + ' - ' + value);
    let cont = 0;
    $(idSelect).append('<option value="'+id+'">'+value.toUpperCase()+'</option>');
    $(idSelect).append($(idSelect+' option').remove().sort(function(a, b) {
        //console.log(cont + ' - ' + $(a).text() + ' | ' + $(b).text());
        //if (cont > 0) {
        if ($(b).val() != '') {
            var at = $(a).text(), bt = $(b).text();
        }
        //}
        cont ++;
        return (at > bt)?1:((at < bt)?-1:0);
    }));
    $(idSelect).trigger('change.select2');
    if (selected == 'selected') $(idSelect).val(id);
}

function addOption2SelectUpd(idSelect, id, value) {
    let cont = 0;
    $(idSelect+' option[value="'+id+'"]').text(value.toUpperCase());
    $(idSelect).append($(idSelect+' option').remove().sort(function(a, b) {
        if (cont > 0) {
            var at = $(a).text(), bt = $(b).text();
        }
        cont ++;
        return (at > bt)?1:((at < bt)?-1:0);
    }));
    $(idSelect).trigger('change.select2');
}

function selectIcon(idForm, idIcon, name, idModal) {
    idForm = idForm.toLowerCase();
    $('#'+idForm+' #icon-i').removeClass();
    $('#'+idForm+' #icon-i').addClass('fa '+name);
    $('#'+idForm+' #idIcon').val(idIcon);
    $('#'+idForm+' #'+idModal).modal('hide');
}

function getOptionsListValue(idSelect, keyName, defaultVal = 'SELECCIONE', val = 0, selectedVal = '') {
    if (val !== '') {
        //val = (val == '') ? 0 : val;
        let obj = new FormConfig('');
        let values = new FormData();
        values.append('defaultVal', defaultVal);
        values.append('keyName', keyName);
        values.append('val', val);
        obj.request('../admin/Select-cont.php', 'listsValuesGeneral', values, function(r,a) {
            $(idSelect).html(r.options).trigger('change.select2');
            $(idSelect).val(selectedVal);
        });
    }
    else {
        $(idSelect).html('<option value="">'+defaultVal+'</option>');
    }
}

function getOptions4Select(idSelect, action, defaultVal = 'SELECCIONE', val = 0, selectedVal = '') {
    val = (val == '') ? 0 : val;
    let obj = new FormConfig('');
    let values = new FormData();
    values.append('defaultVal', defaultVal);
    values.append('val', val);
    obj.request('../admin/Select-cont.php', action, values, function(r,a) {
        $(idSelect).html(r.options).trigger('change.select2');
        $(idSelect).val(selectedVal);
    });
}

function getOptions4SelectExtra(idSelect, action, defaultVal = 'SELECCIONE', callback = '') {
    let obj = new FormConfig('');
    let values = new FormData();
    values.append('defaultVal', defaultVal);
    obj.request('../admin/Select-cont.php', action, values, function(r,a) {
        $(idSelect).html(r.options).trigger('change.select2');
        if (callback instanceof Function) {
            callback(r);
        }
    });
}

//Abrir modal de registro
$(document).on("click", ".show-modal-form-btn", function() {
    let idForm = $(this).attr('idform');
    if (typeof self[idForm+'ShowRegistry'] === 'function') self[idForm+'ShowRegistry']();
    $('#'+idForm+'-modal').modal('show');
    let obj = new FormConfig(idForm);
    obj.resetValues();
});
//Cerrar modal de registro
$(document).on("click", ".hide-modal-form-btn", function() {
    let idForm = $(this).attr('form-modal');
    $('#'+idForm+'-modal').modal('hide');
    let obj = new FormConfig(idForm);
    obj.resetValues();
    if (typeof self[idForm+'ResetValues'] === 'function') self[idForm+'ResetValues']();
});
//Registrar a traves de modal de registro
$(document).on("click", ".sendModal-btn", function() {
    let form = $(this).closest('form');
    let obj = new FormConfig(form[0].id);
    obj.parentInput = $('.'+form[0].id+'-modal-btn').attr('idinput');
    obj.createByModal();
});