var Datos='';

function fLlenarCampos(Datos)
{
	$('#txtIdVehiculo').val(Datos.idvehiculo);
	$('#txtPlaca').val(Datos.placa);
	$('#txtDescripcion').val(Datos.descripcion.replace(/\+/g," "));
	$('#cmbIdTipoVehiculo').val(Datos.idtipovehiculo);
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
	else if( Datos.recepcionmp == '0' && ( $('#txtVentPadre').val() == 'analisisexternomp' || $('#txtVentPadre').val() == 'boletoentradarmp' ) ){
		swal('ERROR!' , 'Este tipo de vehículo no está admitido en el proceso de Recepción de Materia Prima' , 'error');
	}
	else
	{
		opener.$('#txtIdVehiculo').val(Datos.idvehiculo);
		opener.$('#txtPlacaVeh').val(Datos.placa);
		opener.$('#txtTipoVehiculo').val(Datos.tipovehiculo.replace(/\+/g," "));
		opener.$('#txtRemolqueVeh').val(Datos.remolque);
		window.opener.fEnviarDatosVehiculoExtra();
		window.close();
	}
}

function fVerificarPlaca()
{
	if ( ( $('#txtOperacion').val() == 'registrar' && $('#txtPlaca').val() != '' && $('#cmbTipoVehiculo').val() != '' ) )	{
		fAjax('verificar_placa');
	}
	else if ( $('#txtOperacion').val() == 'modificar' && $('#txtPlaca').val() != Datos.placa )	{
		fAjax('verificar_placa');
	}
}

/*ENVIO DE RECEPCION DE DATOS VIA AJAX*/
function fAjax(Operacion)
{
	/*SERIALIZO EL FORMULARIO (CAMPOS) PARA ENVIARLO AL CONTROLADOR*/
	var str = $('#Form').serialize();
	$.ajax(
	{
	  cache: false, type: 'POST', dataType: 'json', url:'../Controladores/Vehiculo.con.php',
	  data: str + '&Operacion=' + Operacion,
	  success: function(response)
	  {
	  	/*MENSAJES*/
	  	/*SI LOS DATOS SON INVALIDOS O HUBO UN ERROR EN LA OPERACION, ENVIO MENSAJE DE ERROR*/
	  	if(response.Resultado == 'datos_invalidos' || response.Resultado == 'fallido')
	  	{
	  		if(Operacion == 'activar' || Operacion == 'desactivar')
	  		{
	  			/*DESABILITO EL FORMULARIO*/
  				$('.EF').attr('disabled','disabled');
	  		}
	  		/*MUESTRO EL MENSAJE DE ERROR*/
	      swal('!ERROR!', response.Mensaje , 'error');
			}
			/*SI LA CEDULA QUE HA INGRESADO EXISTE, PREGUNTO SI DESEA VERIFICAR EL REGISTRO*/
			else if(response.Resultado == 'existe' && Operacion == 'verificar_placa')
			{
	      swal({ title: '¡ALERTA!', text: response.Mensaje, type: 'info', showCancelButton: true, cancelButtonText: 'NO', confirmButtonColor: '#DD6B55', confirmButtonText: 'SI', closeOnConfirm: true },function()	
	      {
	      	$('#txtBusqueda').val($('#txtPlaca').val());
	      	$('#cmbIdTipoVehiculoBusq').val($('#cmbIdTipoVehiculo').val());
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
	      		$('#cmbIdTipoVehiculoBusq').val($('#cmbIdTipoVehiculo').val());
		      	$('#txtBusqueda').val( $('#txtPlaca').val() );
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

/*EVENTO QUE SE ACTIVA CUANDO PULSO EL BOTON SUBMIT*/
$('#Form').on('success.form.fv', function(e)
{
	/*EVITO EL ENVIO DEL FORMULARIO*/
	e.preventDefault();
	/*SI LA OPERACION ES MODIFICAR, VERIFICO QUE HAYA REALIZADO ALGUN CAMBIO AL MENOS*/
	if($('#txtOperacion').val() == 'modificar' && fValidModificacion() == 0)	
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

function fResetBusq()
{
	fCmbMotivoCEAjax('busqueda','');
	$('#txtBusqueda').focus();
}

/*FUNCIONES EXTRAS*/
function fRegistroExtra(){}
function fConsultaExtra(){}
function fModificacionExtra(){}
function fActivacionExtra(){}
function fDesactivacionExtra(){}
function fResetFormExtra(){}
/**/

/*VALIDAR SI SE HIZO ALGUN CAMBIO EN EL FORMULARIO PARA MODIFICAR*/
function fValidModificacion()
{
	if($('#txtPlaca').val() == Datos.placa.replace(/\+/g," ") && $('#txtDescripcion').val() == Datos.descripcion.replace(/\+/g," ") && $('#cmbIdTipoVehiculo').val() == Datos.idtipovehiculo )	{
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
	var Campo = $('#txtBusqueda').val();
	var Formulario = $('#txtFormulario').val();
	var VentPadre = $('#txtVentPadre').val();
	var Pagina = $('#txtPagina').val();
	var TamanoPagina = $('#txtTamanoPagina').val();
	var Estatus = $('#cmbEstatus').val();
	var IdMotivoCambioE = $('#cmbIdMotivoCambioEBusq').val();
	
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
	xmlhttp.open('POST','../Modelos/Scripts/Vehiculo.ajax.php',true);
	xmlhttp.setRequestHeader('Content-type','application/x-www-form-urlencoded');
	/*DATOS A ENVIAR AL SCRIPT DE LA TABLA*/
	xmlhttp.send('Campo=' + Campo + '&IdTipoVehiculo=' + $('#cmbIdTipoVehiculoBusq').val() + '&Pagina=' + Pagina + '&TamanoPagina=' + TamanoPagina + '&VentPadre=' + VentPadre + '&Estatus=' + Estatus + '&IdMotivoCambioE=' + IdMotivoCambioE);
}

//setTimeout(function(){ fTablaAjax(); }, 2000);