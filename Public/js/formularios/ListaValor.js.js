var Datos='';

function fLlenarCampos(Datos)
{
	$('#txtIdListaValor').val(Datos.idlistavalor);
	//$('#cmbIdLista').val(Datos.idlista);
	//$('#cmbIdListaPadre').val(Datos.idlistapadre);
	$('#txtNombre').val(Datos.nombre.replace(/\+/g," "));
	$('#txtAbreviatura').val(Datos.abreviatura);
	$('#cmbIdLista').val(Datos.idlista).trigger('change');
	$('#cmbIdListaPadre').val(Datos.idlistapadre).trigger('change');
	$('#Form').data('formValidation').updateStatus($('#cmbIdLista'), 'NOT_VALIDATED').validateField($('#cmbIdLista'));
	$('#Form').data('formValidation').updateStatus($('#cmbIdListaPadre'), 'NOT_VALIDATED').validateField($('#cmbIdListaPadre'));
	$('#txtPosicion').val(Datos.posicion);
	$('#txtDescripcion').val(Datos.descripcion.replace(/\+/g," "));
	$('#txtEstatus').val(Datos.estatus);
	//fCmbListaPadre( $('#txtOperacion').val() , Datos.idlista , Datos.idlistapadre );
}

function fVerificarNombre()
{
	if ( $('#txtOperacion').val() == 'registrar' && $('#cmbIdLista').val() != '' && $('#txtNombre').val() != '' )	{
		fAjax('verificar_nombre');
	}
	else if ( $('#txtOperacion').val() == 'modificar' && ( $('#txtNombre').val() != Datos.nombre.replace(/\+/g," ") || $('#cmbIdLista').val() != Datos.idlista ) )	{
		fAjax('verificar_nombre');
	}
}

function fVerificarAbrev()
{
	if ( $('#txtOperacion').val() == 'registrar' && $('#cmbIdLista').val() != '' && $('#txtAbreviatura').val() != '' )	{
		fAjax('verificar_abrev');
	}
	else if ( $('#txtOperacion').val() == 'modificar' && ( $('#txtAbreviatura').val() != Datos.abreviatura.replace(/\+/g," ") && $('#cmbIdLista').val() != Datos.idlista ) )	{
		fAjax('verificar_abrev');
	}
}

/*ENVIO DE RECEPCION DE DATOS VIA AJAX*/
function fAjax(Operacion)
{
	/*SERIALIZO EL FORMULARIO (CAMPOS) PARA ENVIARLO AL CONTROLADOR*/
	var str = $('#Form').serialize();
	$.ajax(
	{
	  cache: false, type: 'POST', dataType: 'json', url:'../Controladores/ListaValor.con.php',
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
			else if(response.Resultado == 'existe' && Operacion == 'verificar_nombre')
			{
	      swal({ title: '¡ALERTA!', text: response.Mensaje, type: 'info', showCancelButton: true, cancelButtonText: 'NO', confirmButtonColor: '#DD6B55', confirmButtonText: 'SI', closeOnConfirm: true },function()	
	      {
	      	fResetBusq();
	      	fParametrosBusq('nombre');
	      	$('#txtBusqueda').val($('#txtNombre').val());
	      	$('#cmbIdListaBusq').val( $('#cmbIdLista').val() );
	      	$('#cmbIdListaPadreBusq').val( $('#cmbIdListaPadre').val() );
	      	fBuscar();
	      	fOcultarFormulario();
	      	$('#txtBusqueda').popover('hide');
	      });
			}
			else if(response.Resultado == 'existe' && Operacion == 'verificar_abrev')
			{
	      swal({ title: '¡ALERTA!', text: response.Mensaje, type: 'info', showCancelButton: true, cancelButtonText: 'NO', confirmButtonColor: '#DD6B55', confirmButtonText: 'SI', closeOnConfirm: true },function()	
	      {
	      	fResetBusq();
	      	$('#cmbParamBusq').val('abreviatura');
	      	fParametrosBusq('abreviatura');
	      	$('#txtBusqueda').val($('#txtAbreviatura').val());
	      	$('#cmbIdListaBusq').val( $('#cmbIdLista').val() );
	      	$('#cmbIdListaPadreBusq').val( $('#cmbIdListaPadre').val() );
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
	      		$('#cmbIdListaBusq').val( $('#cmbIdLista').val() );
	      		$('#cmbIdListaPadreBusq').val( $('#cmbIdListaPadre').val() );
		      	$('#txtBusqueda').val( $('#txtNombre').val() );
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
				//self.location = (" ../Controladores/logout.php ");
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
	if( $('#txtOperacion').val() == 'modificar' && fValidModificacion() == 0 )	
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

function fParametrosBusq(Busq)
{
	var Content = 'Buscar por ' + Busq;
	$('#txtBusqueda').attr('data-content',Content);
	$('#txtBusqueda').popover('show');
	$('#txtBusqueda').val('');
	$('#txtBusqueda').focus();
}

function fResetBusq()
{
	fCmbMotivoCEAjax('busqueda','');
	fCmbListaPadre('buscar','','');
	$('#cmbEstatus').val('');
	$('#cmbIdListaBusq').val('');
	$('#cmbParamBusq').val('nombre');
	$('#txtBusqueda').focus();
}

/*FUNCIONES EXTRAS*/
function fRegistroExtra(){}
function fConsultaExtra(){}
function fModificacionExtra(){}
function fActivacionExtra(){}
function fDesactivacionExtra(){}
function fResetFormExtra()
{
	$('#cmbIdLista').val('').trigger('change');
	$('#cmbIdListaPadre').val('0').trigger('change');
	$('#cmbIdLista').select2("close");
	$('#cmbIdListaPadre').select2("close");
}

/**/

/*VALIDAR SI SE HIZO ALGUN CAMBIO EN EL FORMULARIO PARA MODIFICAR*/
function fValidModificacion()
{
	if($('#txtNombre').val() == Datos.nombre.replace(/\+/g," ") && $('#txtAbreviatura').val() == Datos.abreviatura && $('#txtPosicion').val() == Datos.posicion && $('#cmbIdLista').val() == Datos.idlista && $('#cmbIdListaPadre').val() == Datos.idlistapadre && $('#txtDescripcion').val() == Datos.descripcion.replace(/\+/g," ") )	{
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
	var ParamBusq = $('#cmbParamBusq').val();
	var IdMotivoCambioE = $('#cmbIdMotivoCambioEBusq').val();
	var IdLista = $('#cmbIdListaBusq').val();
	var IdListaPadre = $('#cmbIdListaPadreBusq').val();
	
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
	xmlhttp.open('POST','../Modelos/Scripts/ListaValor.ajax.php',true);
	xmlhttp.setRequestHeader('Content-type','application/x-www-form-urlencoded');
	/*DATOS A ENVIAR AL SCRIPT DE LA TABLA*/
	xmlhttp.send('ParamBusq=' + ParamBusq + '&Campo=' + Campo + '&Pagina=' + Pagina + '&TamanoPagina=' + TamanoPagina + '&VentPadre=' + VentPadre + '&Estatus=' + Estatus + '&IdMotivoCambioE=' + IdMotivoCambioE + '&IdLista=' + IdLista + '&IdListaPadre=' + IdListaPadre);
}

/*CARGAR COMBO LISTAPADRE*/
function fCmbListaPadre(Operacion,IdLista,IdListaPadre)
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
				$('#cmbIdListaPadreBusq').html(xmlhttp.responseText);
			}
			else if( Operacion == 'consultar' || Operacion == 'modificar' || Operacion == 'activar' || Operacion == 'desactivar' )
	    {
	    	$('#cmbIdListaPadre').val(IdListaPadre);
	    }
	    else
			{
				$('#cmbIdListaPadre').html(xmlhttp.responseText);
				//$('#Form').data('formValidation').resetField($('#cmbIdListaPadre'));
				/*REVALIDO EL CAMPO*/
				$('#Form').data('formValidation').updateStatus($('#cmbIdListaPadre'), 'NOT_VALIDATED').validateField($('#cmbIdListaPadre'));
			}
		}
	}
	xmlhttp.open('POST','../Modelos/Combos/ListaDinam.cmb.php',true);
	xmlhttp.setRequestHeader('Content-type','application/x-www-form-urlencoded');
	xmlhttp.send( 'Operacion=' + Operacion + '&IdLista=' + IdLista );
}

/*$(document).ready(function(){
	$('#cmbIdLista').select2({});
	$('#cmbIdListaBusq').select2({});
});

/*$('#cmbIdLista').change(function(){
	$('#Form').data('formValidation').updateStatus($('#cmbIdLista'), 'NOT_VALIDATED').validateField($('#cmbIdLista'));
	//$('#Form').formValidation('revalidateField', '#cmbIdLista');
});*/

$(document).ready(function(){
	$('#cmbIdListaPadre').select2();
	$('#cmbIdLista').select2();
});

//setTimeout(function(){ fTablaAjax(); }, 2000);