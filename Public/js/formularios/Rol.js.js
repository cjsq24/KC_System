var Datos='';
var Valid = 0;

function fLlenarCampos(Datos)
{
	$('#txtIdRol').val(Datos.idrol);
	$('#txtNombre').val(Datos.nombre.replace(/\+/g," "));
	$('#txtDescripcion').val(Datos.descripcion.replace(/\+/g," "));
	$('#txtEstatus').val(Datos.estatus);
}

function fEnviarDatos()
{
	if(Datos=='') {
		swal('', 'Seleccione un registro' , 'info');
	}
	else if(Datos.estatus == '0')
	{
		swal('ERROR!' , 'No puede seleccionar un registro desactivado' , 'error');
	}
	else
	{
		opener.$('#txtIdRol').val(Datos.idrol);
		opener.$('#txtRol').val(Datos.nombre.replace(/\+/g," "));
		window.close();
	}
}

function fVerificarNombre()
{
	if ( $('#txtOperacion').val() == 'registrar' && $('#txtNombre').val().length != '' )	{
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
	  cache: false, type: 'POST', dataType: 'json', url:'../Controladores/Rol.con.php',
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
	  			//$('#txtCedula').attr('disabled','disabled');
	  		}
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
	      	$('#txtBusqueda').val( $('#txtNombre').val() );
	      	$('#cmbEstatus').val('');
	      	fBuscar();
	      	fOcultarFormulario();
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
		      	$('#txtBusqueda').val( $('#txtNombre').val() );
		      	$('#cmbEstatus').val('');
		      	fBuscar();
		      	fOcultarFormulario();
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
function fRegistroExtra()
{
	fModuloMenuOperacion('registrar');
}
function fConsultaExtra()
{
	fModuloMenuOperacion('consultar');
}
function fModificacionExtra()
{
	fModuloMenuOperacion('modificar');
}
function fActivacionExtra()
{
	$('#divModuloMenuOperacion').css('display','none');
}
function fDesactivacionExtra()
{
	$('#divModuloMenuOperacion').css('display','none');
}

function fResetFormExtra()
{
	Valid = 0;
}

/**/

/*VALIDAR SI SE HIZO ALGUN CAMBIO EN EL FORMULARIO PARA MODIFICAR*/
function fValidModificacion()
{
	if($('#txtNombre').val() == Datos.nombre.replace(/\+/g," ") && $('#txtDescripcion').val() == Datos.descripcion.replace(/\+/g," ") && Valid == 0 )	{
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
	xmlhttp.open('POST','../Modelos/Scripts/Rol.ajax.php',true);
	xmlhttp.setRequestHeader('Content-type','application/x-www-form-urlencoded');
	/*DATOS A ENVIAR AL SCRIPT DE LA TABLA*/
	xmlhttp.send('Campo=' + Campo + '&Pagina=' + Pagina + '&TamanoPagina=' + TamanoPagina + '&VentPadre=' + VentPadre + '&Estatus=' + Estatus + '&IdMotivoCambioE=' + IdMotivoCambioE);
}

/**/
function fModuloMenuOperacion(Operacion)
{
	$('#divModuloMenuOperacion').css('display','');
	$('#divModuloMenuOperacion').html('<div class="col-lg-offset-4 col-md-offset-4 col-sm-offset-3 col-xs-offset-0"> <img src="../Public/img/ajax-loaders/ajax-loader-1.gif"> Cargando módulos y menus </div>');
	var xmlhttp;
	var IdRol=$('#txtIdRol').val();
	if (window.XMLHttpRequest)	{// code for IE7+, Firefox, Chrome, Opera, Safari
		xmlhttp=new XMLHttpRequest();
	}
	else	{// code for IE6, IE5
		xmlhttp=new ActiveXObject('Microsoft.XMLHTTP');
	}
	
	xmlhttp.onreadystatechange=function()
	{
		if (xmlhttp.readyState==4 && xmlhttp.status==200)	{
			$('#divModuloMenuOperacion').html(xmlhttp.responseText);
		}
	}
	
	/*SCRIPT QUE CONTENTRA LA TABLA*/
	xmlhttp.open('POST','../Modelos/Scripts/ModuloMenuOperacion.ajax.php',true);
	xmlhttp.setRequestHeader('Content-type','application/x-www-form-urlencoded');
	xmlhttp.send('Operacion='+Operacion+'&IdRol='+IdRol);
}

function fSelecOperacion(IdMenu,ArrayOper,TotalOper)
{
	Valid = 1;
	var Cont = -1;
	for(var i = 0; i <= TotalOper; i ++)
	{
		if(document.getElementById('chxOperacion_' + IdMenu + ArrayOper[i]).checked == false)
		{
			Cont ++;
		}
	}
	
	if(Cont == TotalOper)
	{
		document.getElementById('chxMenu_'+IdMenu).checked = false;
		$('#labelMenu_' + IdMenu).removeClass('active');
	}
	else
	{
		document.getElementById('chxMenu_'+IdMenu).checked = true;
		$('#labelMenu_' + IdMenu).addClass('active');
	}
}

//setTimeout(function(){ fTablaAjax(); }, 2000);