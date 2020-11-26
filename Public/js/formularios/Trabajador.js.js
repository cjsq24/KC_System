var Datos='';

function fLlenarCampos(Datos)
{
	$('#txtIdTrabajador').val(Datos.idtrabajador);
	$('#cmbIdNacionalidad').val(Datos.idnacionalidad);
	$('#txtCedula').val(Datos.cedula);
	$('#txtPrimerNombre').val(Datos.primernombre);
	$('#txtSegundoNombre').val(Datos.segundonombre.replace(/\+/g," "));
	$('#txtPrimerApellido').val(Datos.primerapellido);
	$('#txtSegundoApellido').val(Datos.segundoapellido.replace(/\+/g," "));
	$('#txtEmail').val(Datos.email);
	$('#cmbIdTelefono').val(Datos.idtelefono);
	$('#txtTelefonoMovil').val(Datos.telefonomovil);
	$('#cmbIdCodArea').val(Datos.idcodarea);
	$('#txtTelefonoFijo').val(Datos.telefonofijo);
	var FechaIngreso = Datos.fechaingreso.split("-");
	$('#txtFechaIngreso').val( FechaIngreso[2] + '-' + FechaIngreso[1] + '-' + FechaIngreso[0] );
	$('#cmbIdDepartamento').val(Datos.iddepartamento);
	fCmbCargo( $('#txtOperacion').val() , Datos.iddepartamento , Datos.idcargo );
	$('#txtDireccion').val(Datos.direccion.replace(/\+/g," "));
	$('#txtEstatus').val(Datos.estatus);
}

function fEnviarDatos()
{
	if(Datos=='') {
		swal('', 'Seleccione un registro' , 'info');
	}
	else if(Datos.estatus == '0'){
		swal('ERROR!' , 'No puede seleccionar un registro desactivado' , 'error');
	}
	else
	{
		opener.$('#txtIdTrabajador').val(Datos.idtrabajador);
		opener.$('#txtCedulaTrab').val(Datos.cedula);
		opener.$('#txtNombresTrab').val(Datos.primernombre.replace(/\+/g," ") + ' ' + Datos.primerapellido.replace(/\+/g," "));
		window.close();
	}
}

function fVerificarCedula()
{
	if( $('#cmbIdNacionalidad').val() != '' && $('#txtCedula').val().length >= 7 ){
		fAjax('verificar_cedula');
	}
}

function fVerificarEmail()
{
	if( $('#txtEmail').val() != '' || ( $('#txtOperacion').val() == 'modificar' && $('#txtEmail').val() != Datos.enlace ) ) {
		fAjax('verificar_email');
	}
}

/*ENVIO DE RECEPCION DE DATOS VIA AJAX*/
function fAjax(Operacion)
{
	var ValidacionOnblur = '1';
	
	/*VERIFICO QUE LA CEDULA y la nacionalidad ESTE VALIDA PARA HACER LA VERIFICACION (EXISTE O NO EN LA BD)*/
	if(Operacion == 'verificar_cedula')
	{
		if( $('#cmbIdNacionalidad').val() == '' || $('#txtCedula').val().length < 7){
			ValidacionOnblur = '0';
		}
	}
	else if(Operacion == 'verificar_email')
	{
		if( $('#txtEmail').val() == '' || ( $('#txtOperacion').val() == 'modificar' && $('#txtEmail').val() == Datos.enlace ) ) {
			ValidacionOnblur = '0';
		}
	}

	if(ValidacionOnblur == '1')
	{
		/*SERIALIZO EL FORMULARIO (CAMPOS) PARA ENVIARLO AL CONTROLADOR*/
		var str = $('#Form').serialize();
		$.ajax(
		{
		  cache: false, type: 'POST', dataType: 'json', url:'../Controladores/Trabajador.con.php',
		  data: str + '&Operacion=' + Operacion,
		  success: function(response)
		  {
		  	/*MENSAJES*/
		  	/*SI LOS DATOS SON INVALIDOS O HUBO UN ERROR EN LA OPERACION, ENVIO MENSAJE DE ERROR*/
		  	if(response.Resultado == 'datos_invalidos' || response.Resultado == 'fallido')
		  	{
		  		if(Operacion == 'modificar')
		  		{
		  			/*DESHABILITO EL CAMPO CEDULA*/
		  			$('#cmbIdNacionalidad').attr('disabled','disabled');
		  			$('#txtCedula').attr('disabled','disabled');
		  		}
		  		else if(Operacion == 'activar' || Operacion == 'desactivar') 
		  		{
		  			/*DESABILITO EL FORMULARIO*/
	  				$('.EF').attr('disabled','disabled');
		  		}
		  		/*MUESTRO EL MENSAJE DE ERROR*/
		      swal('!ERROR!', response.Mensaje , 'error');
				}
				/*SI LA CEDULA QUE HA INGRESADO EXISTE, PREGUNTO SI DESEA VERIFICAR EL REGISTRO*/
				else if( response.Resultado == 'existe' && ( Operacion == 'verificar_cedula' || Operacion == 'verificar_email' ) )
				{
		      swal({ title: '¡ALERTA!', text: response.Mensaje, type: 'info', showCancelButton: true, cancelButtonText: 'NO', confirmButtonColor: '#DD6B55', confirmButtonText: 'SI', closeOnConfirm: true },function()	
		      {
		      	if(Operacion == 'verificar_cedula'){
		      		var Busqueda = 'cedula';
		      		var Campo = '#txtCedula';
		      	}
		      	else{
		      		var Busqueda = 'email';
		      		var Campo = '#txtEmail';
		      	}
		      	$('#cmbParamBusq').val(Busqueda);
		      	fParametrosBusq(Busqueda);
		      	
		      	if(Operacion == 'verificar_cedula'){
		      		$('#cmbIdNacionalidadBusq').val($('#cmbIdNacionalidad').val());
			      	$('#txtCedulaBusq').val($('#txtCedula').val());
			    	}
			    	else{
		      		$('#txtBusqueda').val($(Campo).val());
		      	}		      	

		      	$('#cmbEstatus').val('');
		      	fBuscar();
		      	fOcultarFormulario();
		      	$('#txtBusqueda').popover('hide');
		      });
				}
				/*SI EL REGISTRO TIENE HISTORIAL DE CAMBIO DE ESTATUS...*/
				else if(Operacion == 'historialce' && response.Resultado == 'existe')
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
				else if((Operacion == 'registrar' || Operacion == 'modificar' || Operacion == 'activar' || Operacion == 'desactivar') && response.Resultado == 'exitoso')
				{
		      swal({ title: '¡OPERACION EXISTOSA!', text: response.Mensaje, type: 'success', showCancelButton: true, cancelButtonText:'NO', confirmButtonColor: '#DD6B55', confirmButtonText: 'SI', closeOnConfirm: true, allowEscapeKey: true },
		      function( isConfirm )
		      {
		      	if (isConfirm)
		      	{
		      		fResetBusq();
		      		$('#cmbParamBusq').val('cedula');
			      	fParametrosBusq('cedula');
			      	$('#cmbIdNacionalidadBusq').val($('#cmbIdNacionalidad').val());
			      	$('#txtCedulaBusq').val($('#txtCedula').val());
			      	$('#cmbEstatus').val('');
			      	fBuscar();
			      	fOcultarFormulario();
			      	$('#txtBusqueda').popover('hide');
		      	}
		      	else {	
		      		fBuscar();
		      		fOcultarFormulario();	
		      	}
		      });
				}
				else if( response.Resultado == 'acceso_denegado' )
				{
					fOcultarFormulario();
					alert('ACCESO DENEGADO');
					self.location = (" ../Controladores/logout.php ");
				}
		  },
		  error:function()
		  {
		  	/*ERROR DEL SERVIDOR*/
		    swal('!ERROR!', 'HA OCURRIDO UN ERROR CON EL SERVIDOR, VUELVA A INTENTAR' , 'error');
		  }
		});
	}
}

/*EVENTO QUE SE ACTIVA CUANDO PULSO EL BOTON SUBMIT*/
$('#Form').on('success.form.fv', function(e)
{
	/*EVITO EL ENVIO DEL FORMULARIO*/
	e.preventDefault();
	/*SI LA OPERACION ES MODIFICAR, VERIFICO QUE HAYA REALIZADO ALGUN CAMBIO AL MENOS*/
	if ( ( $('#cmbIdTelefono').val() == '0' && $('#txtTelefonoMovil').val() != '' ) || ( $('#cmbIdTelefono').val() != '0' && $('#txtTelefonoMovil').val() == '' ) )
	{
		swal('Info','Debe completar el campo del Teléfono Móvil (no es un campo obligatorio)','info');
	}
	else if ( ( $('#cmbIdCodArea').val() == '0' && $('#txtTelefonoFijo').val() != '' ) || ( $('#cmbIdCodArea').val() != '0' && $('#txtTelefonoFijo').val() == '' ) )
	{
		swal('Info','Debe completar el campo del Teléfono Fijo (no es un campo obligatorio)','info');
	}
	else if($('#txtOperacion').val() == 'modificar' && fValidModificacion() == 0)	
	{
		swal('Info','No ha realizado ningún cambio','info');
	}
	/*CONFIRMO LA OPERACION A EJECUTAR*/
	else	
	{
		swal({ title: '¡Confirmar!', text: '¿Confirma ejecutar la operación?', type: 'info', showCancelButton: true, closeOnConfirm: false, showLoaderOnConfirm: true, confirmButtonText: 'SI', cancelButtonText: 'NO' },function()
		{
			/*HABILITO LOS CAMPOS (LOS CAMPOS BLOQUEADOS NO SERAN ENVIADOS)*/
			$('.EF').removeAttr('disabled');
			/*EJECUTO LA FUNCION AJAX*/
	  	fAjax($('#txtOperacion').val());
		});
	}
});

/*FUNCION DE PARAMETROS DE BUSQUEDA (COMBO PARAMETROS)*/
function fParametrosBusq(Busq)
{
	if(Busq == 'cedula') {
		$('#divBusqCedula').css('display','');
		$('#divBusqNormal').css('display','none');
		$('#cmbIdNacionalidadBusq').focus();
	}
	else {
		var Content = 'Buscar por ' + Busq;
		$('#divBusqCedula').css('display','none');
		$('#divBusqNormal').css('display','');
		$('#txtBusqueda').attr('data-content',Content);
		$('#txtBusqueda').popover('show');
		$('#txtBusqueda').focus();
	}
	$('#cmbIdNacionalidadBusq').val('');
	$('#txtCedulaBusq').val('');
	$('#txtBusqueda').val('');
}

function fResetBusq()
{
	fCmbMotivoCEAjax('busqueda','');
	fCmbCargo('buscar','','');
	$('#cmbParamBusq').val('cedula');
	$('#divBusqNormal').css('display','none');
	$('#divBusqCedula').css('display','');
}

/*FUNCIONES EXTRAS*/
function fRegistroExtra(){}
function fConsultaExtra(){}
function fModificacionExtra()
{
	$('#cmbIdNacionalidad').attr('disabled','disabled');
	$('#txtCedula').attr('disabled','disabled');
}
function fActivacionExtra(){}
function fDesactivacionExtra(){}
function fResetFormExtra()
{
	$('#cmbIdNacionalidad').val('');
	/*$('#cmbIdTelefono').val('0');
	$('#cmbIdCodArea').val('0');*/
}
/**/

/*VALIDAR SI SE HIZO ALGUN CAMBIO EN EL FORMULARIO PARA MODIFICAR*/
function fValidModificacion()
{
	if($('#txtPrimerNombre').val() == Datos.primernombre && $('#txtSegundoNombre').val() == Datos.segundonombre.replace(/\+/g," ") && $('#txtPrimerApellido').val() == Datos.primerapellido && $('#txtSegundoApellido').val() == Datos.segundoapellido.replace(/\+/g," ") && $('#txtEmail').val() == Datos.email && $('#cmbIdTelefono').val() == Datos.idtelefono && $('#txtTelefonoMovil').val() == Datos.telefonomovil && $('#cmbIdCodArea').val() == Datos.idcodarea && $('#txtTelefonoFijo').val() == Datos.telefonofijo && $('#cmbIdDepartamento').val() == Datos.iddepartamento && $('#cmbIdCargo').val() == Datos.idcargo && $('#txtFechaIngreso').val() == Datos.fechaingreso && $('#txtDireccion').val() == Datos.direccion.replace(/\+/g," ") )	{
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
	var ParamBusq = $('#cmbParamBusq').val();
	var Formulario = $('#txtFormulario').val();
	var VentPadre = $('#txtVentPadre').val();
	var Pagina = $('#txtPagina').val();
	var TamanoPagina = $('#txtTamanoPagina').val();
	var Estatus = $('#cmbEstatus').val();
	var IdDepartamento = $('#cmbIdDepartamentoBusq').val();
	var IdCargo = $('#cmbIdCargoBusq').val();
	var IdMotivoCambioE = $('#cmbIdMotivoCambioEBusq').val();

	if( $('#cmbIdNacionalidadBusq').val() != '' || $('#txtCedulaBusq').val() != '' )	{
		var Campo = $('#cmbIdNacionalidadBusq').val() + '-' + $('#txtCedulaBusq').val();
	}
	else	{
		var Campo = $('#txtBusqueda').val();
	}
	
	if (window.XMLHttpRequest)	{// code for IE7+, Firefox, Chrome, Opera, Safari
		xmlhttp = new XMLHttpRequest();
	}
	else	{// code for IE6, IE5
		xmlhttp = new ActiveXObject('Microsoft.XMLHTTP');
	}
	
	xmlhttp.onreadystatechange=function()
	{
		if (xmlhttp.readyState == 4 && xmlhttp.status == 200)	{
			$('#divTablaBusqueda').html(xmlhttp.responseText);
		}
	}
	
	/*SCRIPT QUE CONTENTRA LA TABLA*/
	xmlhttp.open('POST','../Modelos/Scripts/Trabajador.ajax.php',true);
	xmlhttp.setRequestHeader('Content-type','application/x-www-form-urlencoded');
	/*DATOS A ENVIAR AL SCRIPT DE LA TABLA*/
	xmlhttp.send('ParamBusq=' + ParamBusq + '&Campo=' + Campo + '&Pagina=' + Pagina + '&TamanoPagina=' + TamanoPagina + '&VentPadre=' + VentPadre + '&Estatus=' + Estatus + '&IdMotivoCambioE=' + IdMotivoCambioE + '&IdDepartamento=' + IdDepartamento + '&IdCargo=' + IdCargo);
}

/*CARGAR COMBO CARGO*/
function fCmbCargo(Operacion,IdDepartamento,IdCargo)
{
	var xmlhttp;
	
	
	if (window.XMLHttpRequest)	{// code for IE7+, Firefox, Chrome, Opera, Safari
		xmlhttp = new XMLHttpRequest();
	}
	else	{// code for IE6, IE5
		xmlhttp = new ActiveXObject('Microsoft.XMLHTTP');
	}
	xmlhttp.onreadystatechange=function()
	{
		if (xmlhttp.readyState == 4 && xmlhttp.status == 200)	
		{
			if(Operacion == 'buscar')
			{
				$('#cmbIdCargoBusq').html(xmlhttp.responseText);
			}
			else if( Operacion == 'consultar' || Operacion == 'modificar' || Operacion == 'activar' || Operacion == 'desactivar' )
	    {
	    	$('#cmbIdCargo').html(xmlhttp.responseText);
	    	$('#cmbIdCargo').val(IdCargo);
	    }
	    else
			{
				$('#cmbIdCargo').html(xmlhttp.responseText);
				//$('#Form').data('formValidation').resetField($('#cmbIdCargo'));
				/*REVALIDO EL CAMPO*/
				$('#Form').data('formValidation').updateStatus($('#cmbIdCargo'), 'NOT_VALIDATED').validateField($('#cmbIdCargo'));
			}
		}
	}
	xmlhttp.open('POST','../Modelos/Combos/CargoDinam.cmb.php',true);
	xmlhttp.setRequestHeader('Content-type','application/x-www-form-urlencoded');
	xmlhttp.send( 'Operacion=' + Operacion + '&IdDepartamento=' + IdDepartamento );
}

$('#txtFechaIngreso').datepicker({
	autoclose: true,
	todayHighlight: true,
	format: 'dd-mm-yyyy'
});

$('#txtFechaIngreso').change(function()
{
	//$('#Form').data('formValidation').resetField($('#txtFechaIngreso'));
	$('#Form').data('formValidation').updateStatus($('#txtFechaIngreso'), 'NOT_VALIDATED').validateField($('#txtFechaIngreso'));
});

//setTimeout(function(){ fTablaAjax(); }, 2000);