var Datos='';
var Valid = 0;

function fLlenarCampos(Datos)
{
	$('#txtIdGrupoMotivoCE').val(Datos.idgrupomotivoce);
	$('#txtNombre').val(Datos.nombre.replace(/\+/g," "));
	$('#txtDescripcion').val(Datos.descripcion.replace(/\+/g," "));
	$('#txtEstatus').val(Datos.estatus);
}

function fEnviarDatos()
{
	if(Datos == '') {
		swal('', 'Seleccione un registro' , 'info');
	}
	else if( Datos.estatus == '0' )	{
		swal('ERROR!' , 'No puede seleccionar un registro desactivado' , 'error');
	}
	else
	{
		opener.$('#txtIdGrupoMotivoCE').val(Datos.idgrupomotivoce);
		opener.$('#txtGrupoMotivoCE').val(Datos.nombre.replace(/\+/g," "));
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
	var ValidacionOnblur='1';
	
	/*VERIFICO QUE LA CEDULA ESTE VALIDA PARA HACER LA VERIFICACION (EXISTE O NO EN LA BD)*/
	if(Operacion=='verificar_nombre'){
		if ($('#txtNombre').val().length == '' || $('#txtNombre').val() == Datos['nombre'] ){
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
		  cache: false, type: 'POST', dataType: 'json', url:'../Controladores/GrupoMotivoCE.con.php',
		  data: str+'&Operacion='+Operacion,
		  success: function(response){
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
		      swal({ title: '¡ALERTA!', text: response.Mensaje, type: 'info', showCancelButton: true, cancelButtonText: 'NO', confirmButtonColor: '#DD6B55', confirmButtonText: 'SI', closeOnConfirm: true },
		      function()	{
		      	$('#txtBusqueda').val( $('#txtNombre').val() );
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
					/*IMPRIMO HISTORIAL DE MODIFICACIONES EN EL DIV CORRESPONDIENTE*/
					fHistorialM(response.HistorialM,response.DetalleHistorialM);
				}
				/*SI LA OPERACION FUE EXITOSA, MUESTRO MENSAJE Y MUESTRO EL REGISTRO*/
				else if((Operacion=='registrar' || Operacion=='modificar' || Operacion == 'activar' || Operacion == 'desactivar') && response.Resultado == 'exitoso')
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
  if( $('#txtOperacion').val() == 'modificar' && fValidModificacion() == 0)	{
  	swal('Info','No ha realizado ningún cambio','info');
  }
  /*CONFIRMO LA OPERACION A EJECUTAR*/
  else	{
	  swal({ title: '¡Confirmar!', text: '¿Confirma ejecutar la operación?', type: 'info', showCancelButton: true, closeOnConfirm: false, showLoaderOnConfirm: true, confirmButtonText: 'SI', cancelButtonText: 'NO' },
		function()
		{
			$('.EF').removeAttr('disabled');
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
	fDetalle('registrar');
}

function fConsultaExtra()
{
	fDetalle('consultar');
}
function fModificacionExtra()
{
	fDetalle('modificar');
}
function fActivacionExtra()
{
	$('#divDetalle').css('display','none');
}
function fDesactivacionExtra()
{
	$('#divDetalle').css('display','none');
}
function fResetFormExtra()
{
	$('#divDetalle').css('display','none');
}
/**/

/*VALIDAR SI SE HIZO ALGUN CAMBIO EN EL FORMULARIO PARA MODIFICAR*/
function fValidModificacion()
{
	if( $('#txtNombre').val() == Datos.nombre.replace(/\+/g," ") && $('#txtDescripcion').val() == Datos.descripcion.replace(/\+/g," ") && Valid == 0 )	{
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
	var VentPadre = $('#txtVentPadre').val();
	var Pagina = $('#txtPagina').val();
	var TamanoPagina = $('#txtTamanoPagina').val();
	var Estatus = $('#cmbEstatus').val();
	var IdMotivoCambioE = $('#cmbIdMotivoCambioEBusq').val();
	
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
	xmlhttp.open('POST','../Modelos/Scripts/GrupoMotivoCE.ajax.php',true);
	xmlhttp.setRequestHeader('Content-type','application/x-www-form-urlencoded');
	/*DATOS A ENVIAR AL SCRIPT DE LA TABLA*/
	xmlhttp.send('Campo='+Campo+'&Pagina='+Pagina+'&TamanoPagina='+TamanoPagina+'&VentPadre='+VentPadre+'&Estatus='+Estatus + '&IdMotivoCambioE=' + IdMotivoCambioE);
}

/*ENVIA DATOS AL SCRIPT CON LA TABLA*/
function fDetalle(Operacion)
{
	$('#divDetalle').css('display','');
	$('#divDetalle').html('<div class="col-lg-offset-4 col-md-offset-4 col-sm-offset-3 col-xs-offset-0"> <img src="../Public/img/ajax-loaders/ajax-loader-1.gif"> Cargando motivos </div>');
	var xmlhttp;
	var IdGrupoMotivoCE=$('#txtIdGrupoMotivoCE').val();
	if (window.XMLHttpRequest)	{// code for IE7+, Firefox, Chrome, Opera, Safari
		xmlhttp=new XMLHttpRequest();
	}
	else	{// code for IE6, IE5
		xmlhttp=new ActiveXObject('Microsoft.XMLHTTP');
	}
	
	xmlhttp.onreadystatechange=function()
	{
		if (xmlhttp.readyState==4 && xmlhttp.status==200)	{
			$('#divDetalle').html(xmlhttp.responseText);
		}
	}
	
	/*SCRIPT QUE CONTENTRA LA TABLA*/
	xmlhttp.open('POST','../Modelos/Scripts/DetalleGrupoMotivoCE.ajax.php',true);
	xmlhttp.setRequestHeader('Content-type','application/x-www-form-urlencoded');
	/*DATOS A ENVIAR AL SCRIPT DE LA TABLA*/
	xmlhttp.send('Operacion='+Operacion+'&IdGrupoMotivoCE='+IdGrupoMotivoCE);
}

function fChequear(IdMotivoCE)
{
	Valid = 1;
	if(document.getElementById('chxMot_' + IdMotivoCE).checked == true)
	{
		document.getElementById('chxMot_' + IdMotivoCE).checked = false;
		$('#labelMot_' + IdMotivoCE).removeClass('active');
	}
	else if(document.getElementById('chxMot_' + IdMotivoCE).checked == false)
	{
		document.getElementById('chxMot_' + IdMotivoCE).checked = true;
		$('#labelMot_' + IdMotivoCE).addClass('active');
	}
	else{ alert('ERROR'); }
}

//setTimeout(function(){ fTablaAjax(); }, 2000);