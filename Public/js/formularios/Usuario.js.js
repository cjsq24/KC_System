var Datos='';

function fLlenarCampos(Datos)
{
	$('#txtIdUsuario').val(Datos.idusuario);
	$('#txtIdTrabajador').val(Datos.idtrabajador);
	$('#txtCedulaTrab').val(Datos.cedulatrab);
	$('#txtNombresTrab').val(Datos.nombretrab + ' ' + Datos.apellidotrab);
	$('#txtIdRol').val(Datos.idrol);
	$('#txtRol').val(Datos.rol.replace(/\+/g," "));
	$('#txtEstatus').val(Datos.estatus);
}

/*ENVIO DE RECEPCION DE DATOS VIA AJAX*/
function fAjax(Operacion)
{
	/*SERIALIZO EL FORMULARIO (CAMPOS) PARA ENVIARLO AL CONTROLADOR*/
	var str = $('#Form').serialize();
	$.ajax(
	{
	  cache: false, type: 'POST', dataType: 'json', url:'../Controladores/Usuario.con.php',
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
		      	$('#txtBusqueda').val($('#txtCedulaTrab').val());
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
	  	$('.EF').attr('disabled','disabled');
		});
	}
});

/*FUNCION DE PARAMETROS DE BUSQUEDA (COMBO PARAMETROS)*/
function fParametrosBusq(Busq)
{
	$('#txtBusqueda').focus();
	$('#txtBusqueda').val('');
	if(Busq == 'cedula') {
		var Content = 'Ingrese el número de cédula del trabajador que desea buscar';
	}
	else {
		var Content = 'Buscar por ' + Busq;
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
	$('#txtBusqueda').attr('data-content','Ingrese el número de cédula del trabajador que desea buscar');
	$('#txtBusqueda').popover('show');
}

/*FUNCIONES EXTRAS*/
function fRegistroExtra()
{
	$('.EF').attr('disabled','disabled');
	$('#btnPopUpTrab').removeAttr('disabled');
	$('#btnPopUpRol').removeAttr('disabled');
}
function fConsultaExtra(){}
function fModificacionExtra()
{
	$('.EF').attr('disabled','disabled');
	//$('#btnPopUpRol').removeAttr('disabled');
	document.getElementById('btnPopUpRol').disabled = false;
}
function fActivacionExtra()
{
	$('.EF').attr('disabled','disabled');
}
function fDesactivacionExtra()
{
	$('.EF').attr('disabled','disabled');
}
function fResetFormExtra(){}

/**/

/*VALIDAR SI SE HIZO ALGUN CAMBIO EN EL FORMULARIO PARA MODIFICAR*/
function fValidModificacion()
{
	if($('#txtIdRol').val() == Datos.idrol && $('#txtRol').val() == Datos.rol.replace(/\+/g," ") )	{
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
	xmlhttp.open('POST','../Modelos/Scripts/Usuario.ajax.php',true);
	xmlhttp.setRequestHeader('Content-type','application/x-www-form-urlencoded');
	/*DATOS A ENVIAR AL SCRIPT DE LA TABLA*/
	xmlhttp.send('ParamBusq=' + ParamBusq + '&Campo=' + Campo + '&Pagina=' + Pagina + '&TamanoPagina=' + TamanoPagina + '&VentPadre=' + VentPadre + '&Estatus=' + Estatus + '&IdMotivoCambioE=' + IdMotivoCambioE);
}

function fPopUpTrab()
{
	$('#Form').data('formValidation').resetField($('#txtCedulaTrab'));
	$('#Form').data('formValidation').resetField($('#txtNombresTrab'));
  var PopUpTrab;
  PopUpTrab=window.open('trabajador.vis.php?Url=' + $('#txtUrl').val() + '&VentPadre=' + $('#txtUrl').val() ,'Trabajador','width=5000, height=2000, top=0, left=0, toolbar=no, location=no, status=no, menubar=no, scrollbar=yes');
  PopUpTrab.focus();
}

function fPopUpRol()
{
	$('#Form').data('formValidation').resetField($('#txtRol'));
  var PopUpRol;
  PopUpRol=window.open('rol.vis.php?Url=' + $('#txtUrl').val() + '&VentPadre=' + $('#txtUrl').val() ,'Rol','width=5000, height=2000, top=0, left=0, toolbar=no, location=no, status=no, menubar=no, scrollbar=yes');
  PopUpRol.focus();
}

//setTimeout(function(){ fTablaAjax(); }, 2000);