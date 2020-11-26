var Datos='';

function fLlenarCampos(Datos)
{
	$('#txtIdConductor').val(Datos.idconductor);
	$('#txtCedula').val(Datos.nacionalidad+'-'+Datos.cedula);
	$('#txtPrimerNombre').val(Datos.primernombre);
	$('#txtSegundoNombre').val(Datos.segundonombre);
	$('#txtPrimerApellido').val(Datos.primerapellido);
	$('#txtSegundoApellido').val(Datos.segundoapellido);
	$('#txtEstatus').val(Datos.estatus);
}

function f(Operacion,IdConductor,Nacionalidad,Cedula,PrimerNombre,SegundoNombre,PrimerApellido,SegundoApellido,Estatus)
{
	Operacion=Operacion;
	if($('#VentPadre').val()=='si')
	{
		opener.document.Form.txtIdConductor.value=IdConductor;
		opener.document.Form.txtCedulaConductor.value=Cedula;
		opener.document.Form.txtNombresConductor.value=PrimerNombre+' '+PrimerApellido;
		window.close();
	}
}

/*ENVIO DE RECEPCION DE DATOS VIA AJAX*/
function fAjax(Operacion)
{
	var ValidacionOnblur='1';
	
	/*VERIFICO QUE LA CEDULA ESTE VALIDA PARA HACER LA VERIFICACION (EXISTE O NO EN LA BD)*/
	if(Operacion=='verificar_cedula'){
		if($('#txtCedula').val().length<10){
			ValidacionOnblur='0';
		}
	}

	if(ValidacionOnblur=='1')
	{
		/*HABILITO LOS CAMPOS (LOS CAMPOS BLOQUEADOS NO SERAN ENVIADOS)*/
		$('.EF').removeAttr('disabled');
		/*SERIALIZO EL FORMULARIO (CAMPOS) PARA ENVIARLO AL CONTROLADOR*/
		var str = $('#Form').serialize();
		$.ajax({
			cache: false, type: 'POST', dataType: 'json', url:'../Controladores/Conductor.con.php',
			data: str+'&Operacion='+Operacion,
			success: function(response){
				/*MENSAJES*/
				/*SI LOS DATOS SON INVALIDOS O HUBO UN ERROR EN LA OPERACION, ENVIO MENSAJE DE ERROR*/
				if(response.Resultado == 'datos_invalidos' || response.Resultado == 'fallido')
				{
					if(Operacion=='modificar') {
						/*DESHABILITO EL CAMPO CEDULA*/
						$('#txtCedula').attr('disabled','disabled');
					}
					else if(Operacion=='cambiar_estatus') {
						/*DESABILITO EL FORMULARIO*/
						$('.EF').attr('disabled','disabled');
					}
					/*MUESTRO EL MENSAJE DE ERROR*/
					swal('!ERROR!', response.Mensaje , 'error');
				}
				/*SI LA CEDULA QUE HA INGRESADO EXISTE, PREGUNTO SI DESEA VERIFICAR EL REGISTRO*/
				else if(response.Resultado == 'existe' && Operacion == 'verificar_cedula'){
					swal({ title: '¡ALERTA!', text: response.Mensaje, type: 'info', showCancelButton: true, cancelButtonText: 'NO', confirmButtonColor: '#DD6B55', confirmButtonText: 'SI', closeOnConfirm: true },
						function()	{
							$('#cmbParamBusq').val('cedula');
							fParametrosBusq('cedula');
							$('#txtBusqueda').val($('#txtCedula').val());
							$('#cmbEstatus').val(''); fBuscar();
							fOcultarFormulario();
							$('#txtBusqueda').popover('hide');
						});
				}
				/*SI EL REGISTRO TIENE HISTORIAL DE CAMBIO DE ESTATUS...*/
				else if(Operacion == 'consultar_estatus' && response.Resultado == 'existe')
				{
					/*IMPRIMO HISTORIAL DE CAMBIOS DE ESTATUS EN EL DIV CORRESPONDIENTE*/
					fHistorialCE(response.HistorialCE);
				}
				else if(Operacion == 'historialm' && response.Resultado == 'existe')
				{
					/*IMPRIMO HISTORIAL DE CAMBIOS DE ESTATUS EN EL DIV CORRESPONDIENTE*/
					fHistorialM(response.HistorialM,response.DetalleHistorialM);
				}
				/*SI LA OPERACION FUE EXITOSA, MUESTRO MENSAJE Y MUESTRO EL REGISTRO*/
				else if((Operacion=='registrar' || Operacion=='modificar' || Operacion=='cambiar_estatus') && response.Resultado == 'exitoso')
				{
					swal({ title: '¡OPERACION EXISTOSA!', text: response.Mensaje, type: 'success', showCancelButton: false, confirmButtonColor: '#DD6B55', confirmButtonText: 'Aceptar', closeOnConfirm: true, allowEscapeKey: false },
						function(){ 
							$('#cmbParamBusq').val('cedula'); fParametrosBusq('cedula'); $('#txtBusqueda').val($('#txtCedula').val()); $('#cmbEstatus').val(''); fBuscar(); fOcultarFormulario(); $('#txtBusqueda').popover('hide'); 
						});
				}
			},
			error:function(){
				/*ERROR DEL SERVIDOR*/
				swal('!ERROR!', 'HA OCURRIDO UN ERROR CON EL SERVIDOR, VUELVA A INTENTAR' , 'error');
			}
		});
	}
}

/*EVENTO QUE SE ACTIVA CUANDO PULSO EL BOTON SUBMIT*/
$('#Form').on('success.form.fv', function(e) {
	/*EVITO EL ENVIO DEL FORMULARIO*/
	e.preventDefault();
	/*SI LA OPERACION ES MODIFICAR, VERIFICO QUE HAYA REALIZADO ALGUN CAMBIO AL MENOS*/
	if($('#txtOperacion').val()=='modificar' && fValidModificacion()==0)	{
		swal('Info','No ha realizado ningún cambio','info');
	}
	/*CONFIRMO LA OPERACION A EJECUTAR*/
	else	{
		swal({ title: '¡Confirmar!', text: '¿Confirma ejecutar la operación?', type: 'info', showCancelButton: true, closeOnConfirm: false, showLoaderOnConfirm: true, confirmButtonText: 'SI', cancelButtonText: 'NO' },
			function()
			{
				fAjax($('#txtOperacion').val());
			});
	}
});

function fAgregarGuionCed(e,id)
{
	if( ($('#txtOperacion').val()=='registrar') || ( $('#txtOperacion').val()=='buscar' && $('#cmbParamBusq').val()=='cedula') ) {
		valor = document.getElementById(id);
		if(e.keyCode!=8)
		{
			if(valor.value.length==1)	{
				document.getElementById(id).value += '-';
			}
		}
		else	{
			var a;
		}
	}
}

/*FUNCION DE PARAMETROS DE BUSQUEDA (COMBO PARAMETROS)*/
function fParametrosBusq(Busq)
{
	$('#txtBusqueda').focus();
	$('#txtBusqueda').val('');
	if(Busq=='cedula') {
		var Content = 'Ingrese el número de cédula con la nacionalidad incluida, ejemplo: V-12345678';
	}
	else {
		var Content = 'Buscar por '+Busq;
	}
	$('#txtBusqueda').attr('data-content',Content);
	$('#txtBusqueda').popover('show');
}

function fResetBusq()
{
	$('#cmbEstatus').val('');
	$('#cmbParamBusq').val('cedula');
	$('#txtBusqueda').focus();
	$('#txtBusqueda').val('');
	$('#txtBusqueda').attr('data-content','Ingrese el número de cédula con la nacionalidad incluida, ejemplo: V-12345678');
	$('#txtBusqueda').popover('show');
}

/*FUNCIONES EXTRAS*/
function fRegistroExtra()
{
	$('#divEstatus').css('display','');
}
function fConsultaExtra(){}
function fModificacionExtra()
{
	$('#txtCedula').attr('disabled','disabled');
}
function fCambioEstatusExtra(){}
/**/

/*VALIDAR SI SE HIZO ALGUN CAMBIO EN EL FORMULARIO PARA MODIFICAR*/
function fValidModificacion()
{
	if($('#txtPrimerNombre').val()==Datos.primernombre && $('#txtSegundoNombre').val()==Datos.segundonombre && $('#txtPrimerApellido').val()==Datos.primerapellido && $('#txtSegundoApellido').val()==Datos.segundoapellido)	{
		return 0;
	}
	else {
		return 1;
	}
}

/*ENVIA DATOS AL SCRIPT CON LA TABLA*/
function fTablaAjax()
{
	var xmlhttp;
	var ParamBusq=$('#cmbParamBusq').val();
	var Campo=$('#txtBusqueda').val();
	var Formulario=$('#txtFormulario').val();
	var VentPadre=$('#txtVentPadre').val();
	var Pagina=$('#txtPagina').val();
	var TamanoPagina=$('#txtTamanoPagina').val();
	var Estatus=$('#cmbEstatus').val();
	
	if (window.XMLHttpRequest)	{// code for IE7+, Firefox, Chrome, Opera, Safari
		xmlhttp=new XMLHttpRequest();
	}
	else	{// code for IE6, IE5
		xmlhttp=new ActiveXObject('Microsoft.XMLHTTP');
	}
	
	xmlhttp.onreadystatechange=function()
	{
		if (xmlhttp.readyState==4 && xmlhttp.status==200)	{
			$('#divTablaBusqueda').html(xmlhttp.responseText);
		}
	}
	
	/*SCRIPT QUE CONTENTRA LA TABLA*/
	xmlhttp.open('POST','../Modelos/Scripts/Conductor.ajax.php',true);
	xmlhttp.setRequestHeader('Content-type','application/x-www-form-urlencoded');
	/*DATOS A ENVIAR AL SCRIPT DE LA TABLA*/
	xmlhttp.send('ParamBusq='+ParamBusq+'&Campo='+Campo+'&Pagina='+Pagina+'&TamanoPagina='+TamanoPagina+'&VentPadre='+VentPadre+'&Estatus='+Estatus);
}

function fPopUpConductor()
{
	var PopUpConductor;
	PopUpConductor=window.open('Conductor.vis.php?PopUp=si','Conductor','width=800, height=500, top=0, left=0, toolbar=no, location=no, status=no, menubar=no, scrollbar=yes');
	PopUpConductor.focus();
}

//setTimeout(function(){ fTablaAjax(); }, 2000);