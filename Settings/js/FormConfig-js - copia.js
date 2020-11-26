var data = '';
var rowSelected = '';
var rowSelected2 = '';
var contInact = 0;
var tbodyEmpty = '<tr><td colspan="50"> <img src="../Public/img/ajax-loaders/ajax-loader-1.gif">Cargando...</td></tr>';

/*FUNCION QUE LLAMA AL SCRIPT DONDE SE MUESTRAN LOS DATOS DE LA TABLA*/
$(document).ready(function() {
	theadTable();
	rowTD = [];
	for (key in rowTable) rowTD.push(key);
	//if ($('#ventPadreS').val() != '') $('#estatusS').val('1');
	$('[data-toggle=tooltip]').tooltip();
    $('[data-toggle=popover]').popover();
    lockButtons();
});

//paramSearch($("#cmbParamBusq option:selected").text());

function theadTable() {
	var dataToggle = ' data-toggle="tooltip" data-placement="top"';
	var thead = '<th>#</th>';
	for (key in rowTable) {
		title =(rowTooltip[key]) ? rowTooltip[key] : '';
		thead += '<th><span ' + dataToggle + ' title="' + title + '">' + rowTable[key] + '</span></th>';
	}
	thead = thead + '<th>Estatus</th>';
	$("#thead-table").html("<tr>" + thead + "</tr>");
}

function setData(datos) {
	for (key in datos) {
        if ($("#"+key).val() !== undefined) {
            if (datos[key] != null) {
                $("#" + key).val(datos[key]);
            }
        }
    }
    if (typeof setDataExtra === 'function') setDataExtra(datos);
}

function convertArray2Php(JsArr) {
	var Php = '';
	if (Array.isArray(JsArr)) {
		Php += 'array(';
		for (var i in JsArr) {
			Php += '\'' + i + '\' => ' + convertArray2Php(JsArr[i]);
			if (JsArr[i] != JsArr[Object.keys(JsArr)[Object.keys(JsArr).length-1]]) { Php += ', '; }
		}
		Php += ')';
		return Php;
	} else { return '\'' + JsArr + '\''; }
}

function validateModify(datos) {
    let cont = 0;
	for (key in datos) {
        if ($('#'+key).val() !== undefined) {
            if (datos[key] != $('#'+key).val()) cont ++;
        }
    }
    if (typeof validateUpdateExtra === 'function') cont += validateUpdateExtra();
    return (cont > 0) ? true : false;
}

/*ENVIO DE RECEPCION DE DATOS VIA AJAX*/
function sendData(action, field = '')
{
    var values = new FormData(document.getElementById("Form"));
    values.append('field', field)
	//var values = $('#Form').serialize();
	request('../admin/controller.php', action, values, function(r,a) {
		/*MENSAJES*/
		/*SI LA OPERACION FUE EXITOSA, MUESTRO MENSAJE Y MUESTRO EL REGISTRO*/
		if ((action == "create" || action == "update") && r.result == "success")
		{
            if (typeof successExtra === 'function') successExtra(action, r.data);

            var message = (r.message != '') ? r.message : 'Operación exitosa';
            swal('', message, 'success');
            if (action == 'create') {
                hideForm();
            }
            else if (action == 'update') {
                rowSelected2 = rowSelected;
                search();
                hideForm();
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
            var tdStatus = data[Object.keys(data)[0]];
            if (action == 'activate') {
                dataRow[rowSelected].status = '1';
                $('.activate-btn').attr('disabled', 'disabled');
                $('.inactivate-btn').removeAttr('disabled');
                $('.update-btn').removeAttr('disabled');
                $('#status-'+tdStatus+'-td').html('<span class="badge badge-success" style="border-radius:0px;font-size:12px;">ACTIVO</span>');
            }
            else if (action == 'inactivate') {
                dataRow[rowSelected].status = '0';
                $('.activate-btn').removeAttr('disabled');
                $('.inactivate-btn').attr('disabled', 'disabled');
                $('.update-btn').attr('disabled', 'disabled');
                $('#status-'+tdStatus+'-td').html('<span class="badge badge-secondary" style="border-radius:0px;font-size:12px;">INACTIVO</span>');
                contInact ++;
            }
            
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
            $('#'+field+'').addClass('is-invalid');
            $('#'+field+'-valid').html(r.message);
			//existsExtra(input);
		}
		else if (r.result == "access_denied") {
			hideForm();
			alert("ACCESO DENEGADO");
			self.location =(" ../Controladores/logout.php");
		}
	});
}

function request(ruta, action, data, callback = 'request_response', parameters = []) {
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
function verifyIfExist(field)
{
	$('#'+field).removeClass('is-invalid');
	//VALIDAMOS QUE EL CAMPO NO ESTÉ VACÍO PARA HACER LA PETICIÓN
	if ($('#action').val() == 'create' && $('#'+field).val() != '') {
		sendData('verify_if_exist', field);
	}
	//VALIDAMOS QUE SE HAYA HECHO ALGÚN CAMBIO EN EL CAMPO, DE LO CONTRARIO ME DIRÍA QUE YA EXISTE PORQUE SE ESTARÍA VERIFICANDO A SÍ MISMO
	else if ($('#action').val() == 'update' && $('#'+field).val() != '' && $('#'+field).val() != data[field]) {
		sendData('verify_if_exist', field);
	}
}

function validateData()
{
	var cont = 0;
	/*$('.input-form').each(function() {
		if ($(this).attr('require') == 'true' && $(this).val() == '') {
			$('#' + this.id).addClass("is-invalid");
			//$('#' + this.id+'-valid').html('Complete este campo');
			cont ++;
		}
    });*/
    cont = submitValidate();
    if (typeof validateCreateExtra === 'function') cont += validateCreateExtra();
	return (cont == 0) ? true : false;
}

/*$('.input-form').keyup(function() {
	if ($('#' + this.id).val() != '') {
		$('#' + this.id).removeClass('is-invalid');
	}
});*/

function paramSearch()
{
	var Busq = $("#cmbParamBusq option:selected").text();
	$("#searchS").attr("data-content", "Buscar por: " + Busq);
	$("#searchS").attr("placeholder", "Buscar por:" + Busq);
	$("#searchS").popover("show");
	$("#searchS").focus();
	$("#searchS").val("");
}

function resetSearch()
{
	$("#form-search")[0].reset();
	$("#searchS").focus();
	if (typeof resetSearchExtra === 'function') resetSearchExtra();
}

/*FORMULARIO REGISTRAR*/
function showRegistry()
{
    $('[data-toggle=tooltip]').tooltip('hide');
    resetForm();
	/*DESBLOQUEO LOS CAMPOS QUE CONTENGAN LA CLASE .input-form(ELEMENTOS DEL FORMULARIO)*/
	//$('.input-form ').removeAttr('disabled').not(':checkbox').val('');
	/*CAMBIO EL TITULO DE LA VENTANA MODAL*/
	$('#formTitle-span').html('REGISTRAR ');
	$('#action').val('create');
	$('#status-div').css('display', 'none');
	$('#send-btn').css('display', '');
	$('#send-btn').html('<a class="orange"> <span class="fa fa-save"> </span> Registrar</a>');
	if (typeof showRegistryExtra === 'function') showRegistryExtra();
	$('#search-div').css('display', 'none');
	$('#form-div').show();
}

/*FORMULARIO CONSULTAR*/
function showConsult()
{
	$('[data-toggle=tooltip]').tooltip('hide');
	$('#action').val('read');
	setData(data);
	$('#formTitle-span').html('CONSULTA ');
	$('.input-form').attr('disabled','disabled');
	//$('.text-obligatorio').html('');
	$('#send-btn').css('display','none');
	$('#status-div').css('display','');
	spanStatus($('#status').val());
	if (typeof showConsultExtra === 'function') showConsultExtra();
	$('#search-div').css('display','none');
	$('#form-div').show();
}

function spanStatus(valor)
{
	if (valor == '1') {
		$('#status-span').html('<span class="badge badge-success" style="border-radius:0px;">ACTIVO</span>');
	}
	else if (valor == '0') {
		$('#status-span').html('<span class="badge badge-secondary" style="border-radius:0px;">INACTIVO</span>');
	}
}

function showActivation()
{
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
            setData(data);
            sendData('activate');
    });
}

function showDesactivation()
{
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
            setData(data);
            sendData('inactivate');
    });
}

/*FORMULARIO MODIFICAR*/
function showUpdate()
{
    $('[data-toggle=tooltip]').tooltip('hide');
    $('#action').val('update');
    setData(data)
    $('.input-form').removeAttr('disabled');
    $('#formTitle-span').html('Modificación ');
    $('#status-div').css('display','none');
    $('#send-btn').css('display','');
    $('#send-btn').html('<span class="glyphicon glyphicon-pencil"></span> Modificar');
    if (typeof showUpdateExtra === 'function') showUpdateExtra();
    $('#search-div').css('display','none');
    $('#form-div').show();
}

function openModalSearch() {
	$('#modalSearch').modal('show');
	$('#action').val('buscar');
}

function closeModalSearch() {
	$('#modalSearch').modal('hide');
}

/*OCULTAR FORMULARIO*/
function hideForm()
{
	resetForm();
	$('#form-div').css('display','none');
	$("#formInput-div").show();
	$('#formTitle-span').html('');
	$("#alertForm-div").hide();
	$('#search-div').show();
}

/*RESETEAR FORMULARIO*/
function resetForm()
{
	$('#alert-div').css('display','none');
	$('#changeStatus-div').css('display','none');
	$('#action').val('');
    $('.input-form').removeAttr('disabled').prop('checked', '').removeClass('is-invalid').not(':checkbox').val('');
    $('.invalid-feedback').html('');
	$('#recordStatus-div').css('display','none');
	$('#recordUpd-div').css('display','none');
	if (typeof resetFormExtra === 'function') resetFormExtra();
}


function selectPage(page)
{
	$('[data-toggle=tooltip]').tooltip('hide');
	$('#pageS').val(page);
	$('#tbody-table').html(tbodyEmpty);
	setTimeout(function(){ tableAjax(); }, 500);
	data = '';
	lockButtons();
}

function selectPageSize(pageSize)
{
	$('[data-toggle=tooltip]').tooltip('hide');
	$('#tbody-table').html(tbodyEmpty);
	$('#pageS').val(1);
	$('#pageSizeS').val(pageSize);
	setTimeout(function(){ tableAjax(); }, 500);
	data = '';
	lockButtons();
}

function selectRow(id) {
    if (rowSelected !== id) {
        $('#tbody-table tr').removeClass('table-info');
        $('#tr'+id).addClass('table-info');
        data = dataRow[id];
        rowSelected = id;
        if (data.status == '1') {
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
        unlockButtons();
    }
    else {
        $('#tbody-table tr').removeClass('table-info');
        data = '';
        rowSelected = '';
        lockButtons();
    }
}

function lockButtons()
{
	$('.read-btn').attr         ('disabled','disabled');
	$('.update-btn').attr       ('disabled','disabled');
	$('.activate-btn').attr     ('disabled','disabled');
	$('.inactivate-btn').attr   ('disabled','disabled');
	$('.pdf-btn').attr          ('disabled','disabled');
}

//lockButtons();

function unlockButtons()
{
	$('.read-btn').removeAttr('disabled');
	$('#send-btndata').removeAttr('disabled');
}

//Filtrar registros.
function search() {
	var cont = 0;
	$("#form-search").find(".input-search").each(function () {
		cont += ($(this).val() != "") ? 1 : 0;
	});
	if (cont > 1) {
		/*Para que cuando se haga una busqueda, comience desde la primera pagina*/
		$('#pageS').val(1);
		$('[data-toggle=tbusqtooltip]').tooltip('hide');
		data = '';
		lockButtons();
		$('#tbody-table').html('<tr><td colspan="50"> <img src="../Public/img/ajax-loaders/ajax-loader-1.gif"></td></tr>Buscando...');
		setTimeout(function(){ tableAjax(); }, 500);
		$('#modalSearch').modal('hide');
		$("#alertSearch-div").hide();
	}
	else {
		$("#alertSearch-div").show();
	}
}

//Enviar datos de búsqueda al script de la tabla.
function tableAjax(action = 'update') {
    var inputs = $('.input-search').serialize();
    rowSelected = '';
	$.ajax({
		cache: false, type: "POST", dataType: "json", url: $('#linkFolder').val() + '/' + $('#linkFolder').val() + '-table.php',
		data: inputs + '&rowTD=' + convertArray2Php(rowTD),
		success: function(r) {
            dataRow = r.dataRow;
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
            if (typeof tableAjaxExtra === 'function') tableAjaxExtra();
            $('[data-toggle=tooltip]').tooltip();
            if (contInact == 0) {
                selectRow(rowSelected2);
            }
            contInact = 0;
		},
		error: function(e) { console.log(e); }
	});
}

/*ACCION DE LA TECLA ENTER*/
function stopRKey(evt) 
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

/*EVENTOS DE LA BOTONERA*/
$(".create-btn").click(function()           { showRegistry     (); });
$(".update-btn").click(function()           { if (data != '') showUpdate();         else invalidAction('update-btn');       });
$(".read-btn").click(function()             { if (data != '') showConsult();        else invalidAction('read-btn');         });
$(".activate-btn").click(function()         { if (data != '') showActivation();     else invalidAction('activate-btn');     });
$(".inactivate-btn").click(function()       { if (data != '') showDesactivation();  else invalidAction('inactivate-btn');   });
$("#hideForm-btn").click(function()         { hideForm         (); });
$("#openModalSearch-btn").click(function()  { openModalSearch  (); });
$("#closeModalSearch-btn").click(function() { closeModalSearch (); });
$("#resetSearch-btn").click(function()      { resetSearch      (); });
$("#search-btn").click(function()           { search           (); });

function invalidAction(btn)
{
    $('[data-toggle=tooltip]').tooltip('hide');
    $('.'+btn).attr('disabled', 'disabled');
}

/*EVENTO QUE SE ACTIVA CUANDO PULSO EL BOTON SUBMIT*/
$('#send-btn').click( function() {
	/*SI LA OPERACION ES MODIFICAR, VERIFICO QUE HAYA REALIZADO ALGUN CAMBIO AL MENOS*/
	if ($('#action').val() == 'update' && !validateModify(data)) {
		/*$("#alertForm-div").show();
		$("#alertForm-span").html("No ha realizado ningún cambio");*/
		swal('Info','No ha realizado ningún cambio','info');
	}
	/*CONFIRMO LA OPERACION A EJECUTAR*/
	else {
		if (validateData()) {
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
					$('.input-form').removeAttr('disabled');
					/*EJECUTO LA FUNCION AJAX*/
					sendData ($('#action').val());
			});
		}
	}
});