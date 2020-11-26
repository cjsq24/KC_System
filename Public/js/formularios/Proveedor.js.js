var Datos='';

function fLlenarCampos(Datos)
{
	$('#txtIdProveedor').val(Datos.idproveedor);
	$('#cmbIdIdentificador').val(Datos.ididentificador);
	$('#txtCedula').val(Datos.cedula);
	$('#txtDigitoRif').val(Datos.digitorif);
	$('#txtNit').val(Datos.nit);
	$('#txtRazonSocial').val(Datos.razonsocial.replace(/\+/g," "));
	$('#txtDireccion').val(Datos.direccion.replace(/\+/g," "));
	$('#txtContacto').val(Datos.contacto.replace(/\+/g," "));
	$('#cmbIdTelefono').val(Datos.idtelefono);
	$('#txtTelefonoMovil').val(Datos.telefonomovil);
	$('#cmbIdCodArea').val(Datos.idcodarea);
	$('#txtTelefonoFijo').val(Datos.telefonofijo);
	$('#txtEmail').val(Datos.email);
	$('#txtEstatus').val(Datos.estatus);
}

function fEnviarDatos()
{
	if ( Datos == '' ) {
		swal('', 'Seleccione un registro' , 'info');
	}
	else if ( Datos.estatus == '0' )	{
		swal('ERROR!' , 'No puede seleccionar un registro desactivado' , 'error');
	}
	else
	{
		opener.$('#txtIdProveedor').val(Datos.idproveedor);
		opener.$('#txtRifProv').val( Datos.identificador + '-' + Datos.cedula + '-' + Datos.digitorif );
		opener.$('#txtRazonSocialProv').val( Datos.razonsocial.replace(/\+/g," ") );
		window.opener.fEnviarDatosExtra();
		window.close();
	}
}

function fVerificarRif()
{
	if( $('#cmbIdIdentificador').val() != '' && $('#txtCedula').val().length == 8 && $('#txtDigitoRif').val().length == 1 ){
		fAjax('verificar_rif');
	}
}

function fVerificarNit()
{
	if( $('#txtOperacion').val() == 'registrar' && $('#txtNit').val().length == 10 )	{
		fAjax('verificar_nit');
	}
	else if( $('#txtOperacion').val() == 'modificar' && $('#txtNit').val().length == 10 && $('#txtNit').val() != Datos.nit )	{
		fAjax('verificar_nit');
	}
}

function fVerificarEmail()
{
	if( $('#txtOperacion').val() == 'registrar' && $('#txtEmail').val() != '' )	{
		fAjax('verificar_email');
	}
	else if( $('#txtOperacion').val() == 'modificar' && $('#txtEmail').val() != '' && $('#txtEmail').val() != Datos.email )	{
		fAjax('verificar_email');
	}
}

function fVerificarRazonSocial()
{
	if( $('#txtOperacion').val() == 'registrar' && $('#txtRazonSocial').val() != '' )	{
		fAjax('verificar_razonsocial');
	}
	else if( $('#txtOperacion').val() == 'modificar' && $('#txtRazonSocial').val() != '' && $('#txtRazonSocial').val() != Datos.razonsocial.replace(/\+/g," ") )	{
		fAjax('verificar_razonsocial');
	}
}

/*ENVIO DE RECEPCION DE DATOS VIA AJAX*/
function fAjax(Operacion)
{
	/*SERIALIZO EL FORMULARIO (CAMPOS) PARA ENVIARLO AL CONTROLADOR*/
	var str = $('#Form').serialize();
	$.ajax(
	{
	  cache: false, type: 'POST', dataType: 'json', url:'../Controladores/Proveedor.con.php',data: str + '&Operacion=' + Operacion,
	  success: function(response)
	  {
	  	/*MENSAJES*/
	  	/*SI LOS DATOS SON INVALIDOS O HUBO UN ERROR EN LA OPERACION, ENVIO MENSAJE DE ERROR*/
	  	if(response.Resultado == 'datos_invalidos' || response.Resultado == 'fallido')
	  	{
	  		if(Operacion == 'modificar')
	  		{
	  			/*DESHABILITO EL CAMPO CEDULA*/
	  			$('#cmbIdIdentificador').attr('disabled','disabled');
	  			$('#txtCedula').attr('disabled','disabled');
	  			$('#txtDigitoRif').attr('disabled','disabled');
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
			else if(response.Resultado == 'existe' && Operacion == 'verificar_rif')
			{
	      swal({ title: '¡ALERTA!', text: response.Mensaje, type: 'info', showCancelButton: true, cancelButtonText: 'NO', confirmButtonColor: '#DD6B55', confirmButtonText: 'SI', closeOnConfirm: true },function()	
	      {
	      	fResetBusq();
	      	$('#cmbParamBusq').val('rif');
	      	fParametrosBusq('rif');
	      	$('#cmbIdIdentificadorBusq').val($('#cmbIdIdentificador').val());
	      	$('#txtCedulaBusq').val($('#txtCedula').val());
	      	$('#txtDigitoRifBusq').val($('#txtDigitoRif').val());
	      	fBuscar();
	      	fOcultarFormulario();
	      	$('#txtBusqueda').popover('hide');
	      });
			}
			else if(response.Resultado == 'existe' && Operacion == 'verificar_nit')
			{
	      swal({ title: '¡ALERTA!', text: response.Mensaje, type: 'info', showCancelButton: true, cancelButtonText: 'NO', confirmButtonColor: '#DD6B55', confirmButtonText: 'SI', closeOnConfirm: true },function()
	      {
	      	fResetBusq();
	      	$('#cmbParamBusq').val('nit');
	      	fParametrosBusq('nit');
	      	$('#txtBusqueda').val($('#txtNit').val());
	      	fBuscar();
	      	fOcultarFormulario();
	      	$('#txtBusqueda').popover('hide');
	      });
			}
			else if(response.Resultado == 'existe' && Operacion == 'verificar_razonsocial')
			{
	      swal({ title: '¡ALERTA!', text: response.Mensaje, type: 'info', showCancelButton: true, cancelButtonText: 'NO', confirmButtonColor: '#DD6B55', confirmButtonText: 'SI', closeOnConfirm: true },function()
	      {
	      	fResetBusq();
	      	$('#cmbParamBusq').val('razon social');
	      	fParametrosBusq('razon social');
	      	$('#txtBusqueda').val($('#txtRazonSocial').val());
	      	fBuscar();
	      	fOcultarFormulario();
	      	$('#txtBusqueda').popover('hide');
	      });
			}
			else if(response.Resultado == 'existe' && Operacion == 'verificar_email')
			{
	      swal({ title: '¡ALERTA!', text: response.Mensaje, type: 'info', showCancelButton: true, cancelButtonText: 'NO', confirmButtonColor: '#DD6B55', confirmButtonText: 'SI', closeOnConfirm: true },function()
	      {
	      	fResetBusq();
	      	$('#cmbParamBusq').val('email');
	      	fParametrosBusq('email');
	      	$('#txtBusqueda').val($('#txtEmail').val());
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
				/*IMPRIMO HISTORIAL DE MODIFICACIONES EN EL DIV CORRESPONDIENTE*/
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
	      		$('#cmbParamBusq').val('rif');
		      	fParametrosBusq('rif');
		      	$('#cmbIdIdentificadorBusq').val($('#cmbIdIdentificador').val());
		      	$('#txtCedulaBusq').val($('#txtCedula').val());
		      	$('#txtDigitoRifBusq').val($('#txtDigitoRif').val());
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
	if ( ( $('#cmbIdTelefono').val() == '0' && $('#txtTelefonoMovil').val() != '' ) || ( $('#cmbIdTelefono').val() != '0' && $('#txtTelefonoMovil').val() == '' ) )
	{
		swal('Info','Debe completar el campo del Teléfono Móvil (no es un campo obligatorio)','info');
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
	if(Busq == 'rif') {
		$('#divBusqRif').css('display','');
		$('#divBusqNormal').css('display','none');
		$('#cmbIdIdentificadorBusq').focus();
	}
	else {
		var Content = 'Buscar por ' + Busq;
		$('#divBusqRif').css('display','none');
		$('#divBusqNormal').css('display','');
		$('#txtBusqueda').attr('data-content',Content);
		$('#txtBusqueda').popover('show');
		$('#txtBusqueda').focus();
	}
	$('#cmbIdIdentificadorBusq').val('');
	$('#txtCedulaBusq').val('');
	$('#txtDigitoRifBusq').val('');
	$('#txtBusqueda').val('');
}

function fResetBusq()
{
	fCmbMotivoCEAjax('busqueda','');
	$('#cmbParamBusq').val('rif');
	$('#divBusqNormal').css('display','none');
	$('#divBusqRif').css('display','');
}

/*FUNCIONES EXTRAS*/
function fRegistroExtra(){}
function fConsultaExtra(){}
function fModificacionExtra()
{
	$('#cmbIdIdentificador').attr('disabled','disabled');
	$('#txtCedula').attr('disabled','disabled');
	$('#txtDigitoRif').attr('disabled','disabled');
}
function fActivacionExtra(){}
function fDesactivacionExtra(){}
function fResetFormExtra()
{
	$('#cmbIdTelefono').val('0');
}
/**/

/*VALIDAR SI SE HIZO ALGUN CAMBIO EN EL FORMULARIO PARA MODIFICAR*/
function fValidModificacion()
{
	if($('#txtNit').val() == Datos.nit && $('#txtRazonSocial').val() == Datos.razonsocial.replace(/\+/g," ") && $('#txtEmail').val() == Datos.email && $('#txtContacto').val() == Datos.contacto && $('#txtIdTelefono').val() == Datos.idtelefono && $('#cmbIdCodArea').val() == Datos.idcodarea && $('#txtDireccion').val() == Datos.direccion.replace(/\+/g," "))	{
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
	var IdMotivoCambioE = $('#cmbIdMotivoCambioEBusq').val();

	if( $('#cmbIdIdentificadorBusq').val() != '' || $('#txtCedulaBusq').val() != '' || $('#txtDigitoRifBusq').val() != '' )
	{
		var Campo = $('#cmbIdIdentificadorBusq').val() + '-' + $('#txtCedulaBusq').val() + '-' + $('#txtDigitoRifBusq').val();
	}
	else
	{
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
	xmlhttp.open('POST','../Modelos/Scripts/Proveedor.ajax.php',true);
	xmlhttp.setRequestHeader('Content-type','application/x-www-form-urlencoded');
	/*DATOS A ENVIAR AL SCRIPT DE LA TABLA*/
	xmlhttp.send('ParamBusq=' + ParamBusq + '&Campo=' + Campo + '&Pagina=' + Pagina + '&TamanoPagina=' + TamanoPagina + '&VentPadre=' + VentPadre + '&Estatus=' + Estatus + '&IdMotivoCambioE=' + IdMotivoCambioE);
}

/*EVENTOS DE LOS ELEMENTOS DEL FORMULARIO*/
$('#cmbIdIdentificador').change(function()
{
	fVerificarRif();
});

$('#txtCedula').focusout(function()
{
	fVerificarRif();
});

$('#txtDigitoRif').focusout(function()
{
	fVerificarRif();
});

$('#txtNit').focusout(function()
{
	fVerificarNit();
});

$('#txtEmail').focusout(function()
{
	fVerificarEmail();
});

$('#txtRazonSocial').focusout(function()
{
	fVerificarRazonSocial();
});
/*****************************************/

//setTimeout(function(){ fTablaAjax(); }, 2000);