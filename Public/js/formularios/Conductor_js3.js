var Operacion;
var Resultado;
var GlobCedula='';

/*FUNCION QUE LLAMA AL SCRIPT DONDE SE MUESTRAN LOS DATOS DE LA TABLA*/
fBusqAjax();

/*EVENTOS QUE SE REALIZAN CUANDO SE CIERRA LA VENTANA MODAL FORM*/
/*$('#ModalForm').on('hide.bs.modal', function() 
{
  $('#Form').bootstrapValidator('resetForm', true);
  $(".EF").removeAttr("disabled");
  $(".text-obligatorio").html("*");
  $("#spanDetalleEstatus").html("Cargando datos, espere...");
  $('#divDetalleEstatus').css('display','none');
	$('#divEstatus').css('display','none');
	$('#divAlerta').css('display','none');
	$('#divCambioEstatus').css('display','none');
});*/

/*ABRIR VENTANA MODAL FORM PARA REGISTRAR*/
function fAbrirRegistro()
{
	$(".EF").removeAttr("disabled");
	$('#TituloModalForm').html('Registro de Conductor');
	$('#txtOperacion').val('registrar');
	$('#divEstatus').css('display','none');
	$('#btnEnviar').css('display','');
	$('#btnEnviar').html('<span class="glyphicon glyphicon-floppy-disk"></span> Registrar');
	$('#ModalForm').modal('show');
}

/*ABRIR VENTANA MODAL FORM PARA CONSULTAR*/
function fAbrirConsulta()
{
	fVerificarDatosAjax('consultar_estatus');
	$("#TituloModalForm").html("Consulta de Conductor");
	$(".EF").attr("disabled","disabled");
	$(".text-obligatorio").html('');
	$('#btnEnviar').css('display','none');
	$('#divEstatus').css('display','');
	if($("#txtEstatus").val()=='1')
	{
		$("#spanEstatus").html("<span class='input-sm label label-success'>ACTIVADO</span>");
	}
	else if($("#txtEstatus").val()=='0')
	{
		$("#spanEstatus").html("<span class='input-sm label label-default'>DESACTIVADO</span>");
	}
	$('#ModalForm').modal('show');
}

function fAbrirCambioEstatus()
{
	fVerificarDatosAjax('consultar_estatus');
	fComboMotivoAjax();
	$('.EF').attr('disabled','disabled');
	$('.text-obligatorio').html('');
	$('.text-obligatorio-motivo').html('*');
	$('#btnEnviar').css('display','');
	$('#divEstatus').css('display','');
	$('#divAlerta').css('display','');
	$('#divCambioEstatus').css('display','');
	$('#txtOperacion').val('cambiar_estatus');
	if($("#txtEstatus").val()=='1')
	{
		$("#TituloModalForm").html("Desactivación del Registro del Conductor");
		$("#spanEstatus").html("<span class='input-sm label label-success'>ACTIVADO</span>");
		$('#btnEnviar').html('<span class="glyphicon glyphicon-remove"></span> Desactivar');
	}
	else if($("#txtEstatus").val()=='0')
	{
		$("#TituloModalForm").html("Activación del Registro del Conductor");
		$("#spanEstatus").html("<span class='input-sm label label-default'>DESACTIVADO</span>");
		$('#btnEnviar').html('<span class="glyphicon glyphicon-refresh"></span> Activar');
	}
	$('#ModalForm').modal('show');
}

/*ABRIR VENTANA MODAL FORM PARA MODIFICAR*/
function fAbrirModificacion()
{
	$(".EF").removeAttr("disabled");
	$('#txtCedula').attr('disabled','disabled');
	$("#TituloModalForm").html("Modificación de Conductor");
	$("#txtOperacion").val("modificar");
	if($("#txtEstatus").val()=='1')
	{
		$("#spanEstatus").html("<span class='input-sm label label-success'>ACTIVADO</span>");
	}
	else if($("#txtEstatus").val()=='0')
	{
		$("#spanEstatus").html("<span class='input-sm label label-default'>DESACTIVADO</span>");
	}
	$('#btnEnviar').css('display','');
	$('#btnEnviar').html('<span class="glyphicon glyphicon-pencil"></span> Modificar');
	$('#ModalForm').modal('show');
}

/*ABRIR VENTANA MODAL BUSQ PARA */
function fAbrirBusqueda()
{
	$('#ModalBusq').modal('show');
	$('#txtOperacion').val('buscar');
}

function fCerrarModalBusq()
{
	$('#ModalBusq').modal('hide');
}

function fCerrarModalForm()
{
	$('#ModalForm').modal('hide');
	$('#Form').bootstrapValidator('resetForm', true);
  $(".text-obligatorio").html("*");
  $("#spanDetalleEstatus").html("Cargando datos, espere...");
  $('#divDetalleEstatus').css('display','none');
	$('#divAlerta').css('display','none');
	$('#divCambioEstatus').css('display','none');
	$('#txtOperacion').val('');
	$(".EF").removeAttr("disabled");
}

function fBuscar()
{
	/*Para que cuando se haga una busqueda, comience desde la primera pagina*/
	$("#txtPagina").val(1);
	fBusqAjax();
	$('#ModalBusq').modal('hide');
}

function fBusqueda(Busq)
{
	$("#txtBusqueda").attr("placeholder", Busq);
	$("#txtBusqueda").focus();
	$("#txtBusqueda").val("");
}

function fSeleccionarFila(Operacion,IdConductor,Nacionalidad,Cedula,PrimerNombre,SegundoNombre,PrimerApellido,SegundoApellido,Estatus)
{
	Operacion=Operacion;
	if($('#VentPadre').val()=="si")
	{
		opener.document.Form.txtIdConductor.value=IdConductor;
		opener.document.Form.txtCedulaConductor.value=Cedula;
		opener.document.Form.txtNombresConductor.value=PrimerNombre+" "+PrimerApellido;
		window.close();
	}
	else
	{
		GlobCedula=Cedula;
		$("#txtIdConductor").val(IdConductor);
		$("#txtCedula").val(Nacionalidad+'-'+Cedula);
		$("#txtPrimerNombre").val(PrimerNombre);
		$("#txtSegundoNombre").val(SegundoNombre);
		$("#txtPrimerApellido").val(PrimerApellido);
		$("#txtSegundoApellido").val(SegundoApellido);
		$("#txtEstatus").val(Estatus);

		if(Operacion=='Consultar'){
			fAbrirConsulta();
		}
		else if(Operacion=='Modificar'){
			fAbrirModificacion();
		}
		else if(Operacion=='CambiarEstatus'){
			fAbrirCambioEstatus();
		}
	}
}

function fPaginacion(Pagina)
{
	$("#txtPagina").val(Pagina);
	fBusqAjax();
}

function fTamanoPagina(TamanoPagina)
{
	$("#txtPagina").val(1);
	$("#txtTamanoPagina").val(TamanoPagina);
	fBusqAjax();
}

/*ACCION DE LA TECLA ENTER*/
function stopRKey(evt) 
{
	var evt = (evt) ? evt : ((event) ? event : null);
	var node = (evt.target) ? evt.target : ((evt.srcElement) ? evt.srcElement : null);
	if ((evt.keyCode == 13) && (node.type=="text")) {
		if($('#txtOperacion').val()=='buscar') {
		fBuscar();
		return false;
		}
	}
}
document.getElementById('Form').onkeypress = stopRKey;

function fEnviarDatosAjax(Operacion)
{
	swal({ title: "¡Confirmar!", text: "¿Confirma ejecutar la operación?", type: "info", showCancelButton: true, closeOnConfirm: false, showLoaderOnConfirm: true, confirmButtonText: 'SI', cancelButtonText: 'NO' },
		function()
		{
			$(".EF").removeAttr("disabled");
			var str = $('#Form').serialize();
			$.ajax({
			  cache: false,
			  type: "POST",
			  dataType: "json",
			  url:"../Controladores/Conductor_con.php",
			  data: str+"&Operacion="+Operacion,
			  success: function(response){
			  	setTimeout(function(){
				  	// Validar mensaje de error
				  	if(response.Resultado == 'datos_invalidos' || response.Resultado == 'fallido')
				  	{
				  		if(Operacion=='modificar')
				  		{
				  			$("#txtCedula").attr("disabled","disabled");
				  		}
				  		else if(Operacion=='cambiar_estatus')
				  		{
			  				$(".EF").attr("disabled","disabled");
				  		}
				      swal("!ERROR!", response.Mensaje , "error");
						}
						else if(response.Resultado == 'exitoso' && (Operacion=='registrar' || Operacion=='modificar' || Operacion=='cambiar_estatus'))
						{
				      swal({ title: "¡OPERACION EXISTOSA!", text: response.Mensaje, type: "success", showCancelButton: false, confirmButtonColor: "#DD6B55", confirmButtonText: "Aceptar", closeOnConfirm: true, allowEscapeKey: false },
				      function(){ $('#cmbParamBusq').val('cedula'); fBusqueda('cedula'); $('#txtBusqueda').val($('#txtCedula').val()); $('#cmbEstatus').val(''); fBuscar(); fCerrarModalForm(); });
						}
					}, 1000);
			  },
			  error:function(){
			      swal("!ERROR!", "HA OCURRIDO UN ERROR CON EL SERVIDOR, VUELVA A INTENTAR" , "error");
			  }
		});
	});
}

function fVerificarDatosAjax(Operacion)
{
	/*$('#txtOperacion').val('verificar_cedula');
	document.getElementById('Form').submit();*/
	var Validacion='1';
	
	if(Operacion=='verificar_cedula' && document.getElementById('txtOperacion').value=='registrar'){
		if(document.getElementById('txtCedula').value.length<10){
			Validacion='0';
		}
	}

	if(Validacion=='1')
	{
		var str = $('#Form').serialize();
		$.ajax({
		  cache: false,
		  type: "POST",
		  dataType: "json",
		  url:"../Controladores/Conductor_con.php",
		  data: str+"&Operacion="+Operacion,
		  success: function(response)
		  {
		   	if(response.Resultado == 'datos_invalidos'){
		      swal("!ERROR!", response.Mensaje , "error");
				}
				else if(response.Resultado == 'existe' && Operacion=='verificar_cedula'){
		      swal({ title: "¡ALERTA!", text: response.Mensaje, type: "info", showCancelButton: true, confirmButtonText: "NO", confirmButtonColor: "#DD6B55", confirmButtonText: "SI", closeOnConfirm: true },
		      function(){ $('#cmbParamBusq').val('cedula'); fBusqueda('cedula'); $('#txtBusqueda').val($('#txtCedula').val()); $('#cmbEstatus').val(''); fBuscar(); fCerrarModalForm(); });
				}
				else if(response.Resultado == 'existe' && Operacion == 'consultar_estatus')
				{
					$("#divDetalleEstatus").css('display','');
		      if(document.getElementById('txtEstatus').value=='1'){
		      	var Estatus1='Activado';
		      	var Estatus2='Activación';
		      }
		      else if(document.getElementById('txtEstatus').value=='0'){
		      	var Estatus1='Desactivado';
		      	var Estatus2='Desactivación';
		      }
		      $("#labelDetalleEstatus").html('Detalles de la '+Estatus2);
		      $("#spanDetalleEstatus").html('<b>'+Estatus1+' por:</b> '+response.ConsultaEstatus['UsuarioTrab']+', <b>CI:</b> '+response.ConsultaEstatus['CedulaTrab']+' <br><b>Motivo:</b> '+response.ConsultaEstatus['NombreMot']+'<br><b>Explicación del Motivo:</b> '+response.ConsultaEstatus['DescripcionMot']+'<br><b>Fecha:</b> '+response.ConsultaEstatus['FechaMot']+' <b>- Hora:</b> '+response.ConsultaEstatus['HoraMot']);
				}
		  },
		  error:function(){
		      swal("!ERROR!", "Ha ocurrido un error con el servidor" , "error");
		  }
		});
	}
}

$(document).ready(function(){
    $('[data-toggle="tooltip"]').tooltip(); 
});

$(document).ready(function(){
    $('[data-toggle="popover"]').popover(); 
});

/**/
$(document).ready(function() {
	$('#Form').on('success.form.bv', function(e) {
    // Prevent submit form
    e.preventDefault();
    fEnviarDatosAjax($('#txtOperacion').val());
    $("#btnEnviar").removeAttr("disabled");
  });
});

function fAgregarGuionCed(e,id)
{
	if( ($('#txtOperacion').val()=='registrar') || ( $('#txtOperacion').val()=='buscar' && $('#cmbParamBusq').val()=='cedula') ) {
		valor = document.getElementById(id);
		if(e.keyCode!=8)
		{
			if(valor.value.length==1)
				document.getElementById(id).value += "-";
		}
		else{
			var a;
		}
	}
}

/*EVENTOS VIA TECLADO*/
var ctrlPressed = false;
var teclaCtrl = 17, teclaC = 67;

$(document).keydown(function(e){
	if (e.keyCode == teclaCtrl)
	ctrlPressed = true;

	if (ctrlPressed && (e.keyCode == teclaC))
	fAbrirRegistro();
});

$(document).keyup(function(e){
	if (e.keyCode == teclaCtrl)
	ctrlPressed = false;
});