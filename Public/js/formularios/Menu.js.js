var Datos='';
var Valid = 0;

function fLlenarCampos(Datos)
{
	$('#txtIdMenu').val(Datos.idmenu);
	$('#txtNombre').val(Datos.nombre.replace(/\+/g," "));
	$('#txtEnlace').val(Datos.enlace);
	$('#cmbIdModulo').val(Datos.idmodulo);
	$('#txtIdGrupoMotivoCE').val(Datos.idgrupomotivoce);
	$('#txtGrupoMotivoCE').val(Datos.grupomotivoce.replace(/\+/g," "));
	$('#txtIdIcono').val(Datos.idicono);
	$('#spanIcono').addClass(Datos.icono.replace(/\+/g," "));
	$('#txtDescripcion').val(Datos.descripcion.replace(/\+/g," "));
	$('#txtEstatus').val(Datos.estatus);
}

function f(Operacion,IdMenu,Nacionalidad,Cedula,PrimerNombre,SegundoNombre,PrimerApellido,SegundoApellido,Estatus)
{
	Operacion=Operacion;
	if($('#VentPadre').val() == 'si')
	{
		opener.document.Form.txtIdMenu.value=IdMenu;
		opener.document.Form.txtCedulaMenu.value=Cedula;
		opener.document.Form.txtNombresMenu.value=PrimerNombre+' '+PrimerApellido;
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

function fVerificarEnlace()
{
	if ( $('#txtOperacion').val() == 'registrar' && $('#txtEnlace').val().length != '' )	{
		fAjax('verificar_enlace');
	}
	else if ( $('#txtOperacion').val() == 'modificar' && $('#txtNombre').val() != Datos.enlace.replace(/\+/g," ") )	{
		fAjax('verificar_enlace');
	}
}

/*ENVIO DE RECEPCION DE DATOS VIA AJAX*/
function fAjax(Operacion)
{
	/*SERIALIZO EL FORMULARIO (CAMPOS) PARA ENVIARLO AL CONTROLADOR*/
	var str = $('#Form').serialize();
	$.ajax(
	{
	  cache: false, type: 'POST', dataType: 'json', url:'../Controladores/Menu.con.php',
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
			else if( response.Resultado == 'existe' && ( Operacion == 'verificar_nombre' || Operacion == 'verificar_enlace' ) )
			{
	      swal({ title: '¡ALERTA!', text: response.Mensaje, type: 'info', showCancelButton: true, cancelButtonText: 'NO', confirmButtonColor: '#DD6B55', confirmButtonText: 'SI', closeOnConfirm: true },function()	
	      {
	      	if(Operacion == 'verificar_nombre')
	      	{
		      	$('#cmbParamBusq').val('nombre');
		      	fParametrosBusq('nombre');
		      	$('#txtBusqueda').val($('#txtNombre').val());
		      }
		      else
		      {
		      	$('#cmbParamBusq').val('enlace');
		      	fParametrosBusq('enlace');
		      	$('#txtBusqueda').val($('#txtEnlace').val());
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
	      	if (isConfirm) {
	      		$('#cmbParamBusq').val('nombre'); 
		      	fParametrosBusq('nombre'); 
		      	$('#txtBusqueda').val($('#txtNombre').val()); 
		      	$('#cmbEstatus').val(''); 
		      	fBuscar();
		      	fOcultarFormulario();
		      	$('#txtBusqueda').popover('hide'); 
	      	}
	      	else 
	      	{
	      		fBuscar();
	      		fOcultarFormulario();
	      	}
	      });
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
	else if( $('#txtIdIcono').val() == '' )
	{
		swal('Alerta','Debe seleccionar un icono para el menu','info');
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
	$('#txtBusqueda').focus();
	$('#txtBusqueda').val('');
	if(Busq == 'nombre') {
		var Content = 'Ingrese el nombre del módulo que desea buscar';
	}
	else {
		var Content = 'Ingrese el nombre del enlace que desea buscar';
	}
	$('#txtBusqueda').attr('data-content',Content);
	$('#txtBusqueda').popover('show');
}

function fResetBusq()
{
	fCmbMotivoCEAjax('busqueda','');
	$('#cmbEstatus').val('');
	$('#cmbParamBusq').val('nombre');
	$('#txtBusqueda').focus();
	$('#txtBusqueda').val('');
	$('#txtBusqueda').attr('data-content','Ingrese el nombre del módulo que desea buscar');
	$('#txtBusqueda').popover('show');
}

/*FUNCIONES EXTRAS*/
function fRegistroExtra()
{
	fListadoOperacion('registrar');
	$('#btnListIcono').removeAttr('disabled');
	$('#btnPopUpGrupoMotivoCE').removeAttr('disabled');
}
function fConsultaExtra()
{
	fListadoOperacion('consultar');
	$('#btnListIcono').attr('disabled','disabled');
	$('#btnPopUpGrupoMotivoCE').attr('disabled','disabled');
}
function fModificacionExtra()
{
	$('#btnListIcono').removeAttr('disabled');
	$('#btnPopUpGrupoMotivoCE').removeAttr('disabled');
	fListadoOperacion('modificar');
}
function fActivacionExtra()
{
	$('#divListadoOperacion').css('display','none');
	$('#btnListIcono').attr('disabled','disabled');
	$('#btnPopUpGrupoMotivoCE').attr('disabled','disabled');
}
function fDesactivacionExtra()
{
	$('#divListadoOperacion').css('display','none');
	$('#btnListIcono').attr('disabled','disabled');
	$('#btnPopUpGrupoMotivoCE').attr('disabled','disabled');
}

function fResetFormExtra()
{
	$('#divListadoOperacion').css('display','none');
	$('#spanIcono').removeClass();
	$('#spanIcono').addClass('form-control');
	$('#txtIdIcono').val('');
	Valid = 0;
}

/**/

/*VALIDAR SI SE HIZO ALGUN CAMBIO EN EL FORMULARIO PARA MODIFICAR*/
function fValidModificacion()
{
	if( $('#txtNombre').val() == Datos.nombre.replace(/\+/g," ") && $('#txtEnlace').val() == Datos.enlace && $('#cmbIdModulo').val() == Datos.idmodulo && $('#cmbIdGrupoMotivoCE').val() == Datos.idgrupomotivoce && $('#txtIdIcono').val() == Datos.idicono && $('#txtDescripcion').val() == Datos.descripcion.replace(/\+/g," ") && Valid == 0 )	{
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
	var IdModulo = $('#cmbIdModuloBusq').val();
	var IdGrupoMotivoCE = $('#cmbIdGrupoMotivoCEBusq').val();
	
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
	xmlhttp.open('POST','../Modelos/Scripts/Menu.ajax.php',true);
	xmlhttp.setRequestHeader('Content-type','application/x-www-form-urlencoded');
	/*DATOS A ENVIAR AL SCRIPT DE LA TABLA*/
	xmlhttp.send('ParamBusq=' + ParamBusq + '&Campo=' + Campo + '&Pagina=' + Pagina + '&TamanoPagina=' + TamanoPagina + '&VentPadre=' + VentPadre + '&Estatus=' + Estatus + '&IdMotivoCambioE=' + IdMotivoCambioE + '&IdModulo=' + IdModulo + '&IdGrupoMotivoCE=' + IdGrupoMotivoCE);
}

function fAgregarIcono(IdIcono,Icono)
{
	$('#txtIdIcono').val(IdIcono);
	$('#spanIcono').removeClass();
	$("#spanIcono").addClass('form-control input-sm ' + Icono.replace(/\+/g," "));
}

function fOperaciones(ID){
	if(document.getElementById(ID).checked==true)	{
	  $('#tableOperaciones').slideDown('fast');
	}
	else	{
	  $('#tableOperaciones').slideUp('fast');
	}
}

/**/
function fListadoOperacion(Operacion)
{
	$('#divListadoOperacion').html('<div class="col-lg-offset-4 col-md-offset-4 col-sm-offset-3 col-xs-offset-0"> <img src="../Public/img/ajax-loaders/ajax-loader-1.gif"> Cargando operaciones </div>');
	$('#divListadoOperacion').css('display','');
	var xmlhttp;
	var IdMenu=$('#txtIdMenu').val();
	if (window.XMLHttpRequest)	{// code for IE7+, Firefox, Chrome, Opera, Safari
		xmlhttp=new XMLHttpRequest();
	}
	else	{// code for IE6, IE5
		xmlhttp=new ActiveXObject('Microsoft.XMLHTTP');
	}
	
	xmlhttp.onreadystatechange=function()
	{
		if (xmlhttp.readyState==4 && xmlhttp.status==200)	{
			$('#divListadoOperacion').html(xmlhttp.responseText);
		}
	}
	
	/*SCRIPT QUE CONTENTRA LA TABLA*/
	xmlhttp.open('POST','../Modelos/Scripts/ListadoOperacion.ajax.php',true);
	xmlhttp.setRequestHeader('Content-type','application/x-www-form-urlencoded');
	xmlhttp.send('Operacion='+Operacion+'&IdMenu='+IdMenu);
}

function fChequear(IdOperacion)
{
	Valid = 1;
	if(document.getElementById('chxOper_' + IdOperacion).checked == true)
	{
		document.getElementById('chxOper_' + IdOperacion).checked = false;
		$('#labelOper_' + IdOperacion).removeClass('active');
	}
	else if(document.getElementById('chxOper_' + IdOperacion).checked == false)
	{
		document.getElementById('chxOper_' + IdOperacion).checked = true;
		$('#labelOper_' + IdOperacion).addClass('active');
	}
	else{ alert('ERROR'); }
}

function fPopUpGrupoMotivoCE()
{
	$('#Form').data('formValidation').resetField($('#txtGrupoMotivoCE'));
  var PopUpGrupoMotivoCE;
  PopUpGrupoMotivoCE=window.open('grupomotivoce.vis.php?Url=' + $('#txtUrl').val() + '&VentPadre=' + $('#txtUrl').val() ,'Grupo de Motivos','width=3000, height=2000, top=0, left=0, toolbar=no, location=no, status=no, menubar=no, scrollbar=yes');
  PopUpGrupoMotivoCE.focus();
}

//setTimeout(function(){ fTablaAjax(); }, 2000);