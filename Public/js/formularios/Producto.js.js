var Datos='';

function fLlenarCampos(Datos)
{
	$('#txtIdProducto').val(Datos.idproducto);
	$('#txtNombre').val(Datos.nombre.replace(/\+/g," "));
	$('#cmbIdTipoProducto').val(Datos.idtipoproducto);
	$('#cmbIdMagnitud').val(Datos.idmagnitud);
	fCmbUnidad( $('#txtOperacion').val() , Datos.idmagnitud , Datos.idunidadmedida );

	$('#txtEstatus').val(Datos.estatus);
}

function fVerificarNombre()
{
	if ( $('#txtOperacion').val() == 'registrar' && $('#txtNombre').val() != '' )	{
		fAjax('verificar_nombre');
	}
	else if ( $('#txtOperacion').val() == 'modificar' && $('#txtNombre').val() != Datos.nombre.replace(/\+/g," ") )	{
		fAjax('verificar_nombre');
	}
}

/*ENVIO DE RECEPCION DE DATOS VIA AJAX*/
function fAjax(Operacion)
{
	/*SERIALIZO EL FORMULARIO (CAMPOS) PARA ENVIARLO AL CONTROLADOR*/
	var str = $('#Form').serialize();
	$.ajax(
	{
	  cache: false, type: 'POST', dataType: 'json', url:'../Controladores/Producto.con.php',
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
	      	$('#txtBusqueda').val($('#txtNombre').val());
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
		      	$('#txtBusqueda').val( $('#txtNombre').val() );
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

function fResetBusq()
{

	fCmbMotivoCEAjax('busqueda','');
	fCmbUnidad('buscar','','');
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
	if($('#txtNombre').val() == Datos.nombre && $('#cmbIdTipoProducto').val() == Datos.idtipoproducto && $('#cmbIdMagnitud').val() == Datos.idmagnitud && $('#cmbIdUnidadMedida').val() == Datos.idunidadmedida )	{
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
	var IdTipoProducto = $('#cmbIdTipoProductoBusq').val();
	var IdMagnitud = $('#cmbIdMagnitudBusq').val();
	var IdUnidadMedida = $('#cmbIdUnidadMedidaBusq').val();
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
	xmlhttp.open('POST','../Modelos/Scripts/Producto.ajax.php',true);
	xmlhttp.setRequestHeader('Content-type','application/x-www-form-urlencoded');
	/*DATOS A ENVIAR AL SCRIPT DE LA TABLA*/
	xmlhttp.send('Campo=' + Campo + '&Pagina=' + Pagina + '&TamanoPagina=' + TamanoPagina + '&VentPadre=' + VentPadre + '&Estatus=' + Estatus + '&IdMotivoCambioE=' + IdMotivoCambioE+ '&IdTipoProducto=' + IdTipoProducto+ '&IdMagnitud=' + IdMagnitud+ '&IdUnidadMedida=' + IdUnidadMedida);
}
function fCmbUnidad(Operacion,IdMagnitud,IdUnidadMedida)
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
				$('#cmbIdUnidadMedidaBusq').html(xmlhttp.responseText);
			}
			else if( Operacion == 'consultar' || Operacion == 'modificar' || Operacion == 'activar' || Operacion == 'desactivar' )
	    {
	    	$('#cmbIdUnidadMedida').html(xmlhttp.responseText);
	    	$('#cmbIdUnidadMedida').val(IdUnidadMedida);
	    }
	    else
			{
				$('#cmbIdUnidadMedida').html(xmlhttp.responseText);
				//$('#Form').data('formValidation').resetField($('#cmbIdUnidadMedida'));
				/*REVALIDO EL CAMPO*/
				$('#Form').data('formValidation').updateStatus($('#cmbIdUnidadMedida'), 'NOT_VALIDATED').validateField($('#cmbIdUnidadMedida'));
			}
		}
	}
	xmlhttp.open('POST','../Modelos/Combos/ListaValorDinam.cmb.php',true);
	xmlhttp.setRequestHeader('Content-type','application/x-www-form-urlencoded');
	xmlhttp.send( 'Operacion=' + Operacion + '&IdListaPadre=' + IdMagnitud );
}


//setTimeout(function(){ fTablaAjax(); }, 2000);