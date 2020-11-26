var Datos='';

if ( $('#txtVentPadre').val() == 'recepcionmp' )
{
	$('#cmbIdMateriaPrimaBusq').val( $('#txtIdMateriaPrima').val() );
}

function fLlenarCampos(Datos)
{
	$('#txtIdInventarioMP').val(Datos.idinventariomp);
	$('#txtExistencia').val(Datos.existencia);
	$('#cmbIdSiloMP').val('');
	$('#txtEstatus').val(Datos.estatus);
	$('#spanSiloMP').html(Datos.silomp.replace(/\+/g," "));
	$('#spanCapacidadMax').html(Datos.capacidadmax + ' KG');
}

/*ENVIO DE RECEPCION DE DATOS VIA AJAX*/
function fAjax(Operacion)
{
	/*SERIALIZO EL FORMULARIO (CAMPOS) PARA ENVIARLO AL CONTROLADOR*/
	var str = $('#Form').serialize();
	$.ajax(
	{
	  cache: false, type: 'POST', dataType: 'json', url:'../Controladores/InventarioMP.con.php',
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
		      	$('#txtBusqueda').val( $('#txtExistencia').val() );
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
	if ( $('#txtVentPadre').val() == 'recepcionmp' )
	{
		if ( fValidarCantMP() == '1' )
		{
			window.opener.fAgregarFila(opener.$('#txtCantCampos').val(),Datos.idsilomp,Datos.silomp.replace(/\+/g," "),CapMax,CapDispAntes,CapDispDespues,$('#txtCantMP').val());
			window.close();
		}
	}
	else if( $('#txtOperacion').val() == 'modificar' && fValidModificacion() == 0 )
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
	fCmbSiloMP();
	$('#divFormMov').css('display','none');
	$('#divForm').css('display','');
}
function fConsultaExtra()
{
	$('#divForm').css('display','none');
	$('#divFormMov').css('display','');
	$('#cmbIdMovimiento').val('');
	fMovimientoAjax();
	$('#btnAbrirBusquedaMov').css('display','');
}
function fModificacionExtra()
{
	$('#cmbIdSiloMP').attr('disabled','disabled');
	fCmbSiloMP();
	$('#divFormMov').css('display','none');
	$('#divForm').css('display','');
}
function fActivacionExtra(){}
function fDesactivacionExtra(){}
function fResetFormExtra()
{
	$('#btnAbrirBusquedaMov').css('display','none');
}

/**/

/*VALIDAR SI SE HIZO ALGUN CAMBIO EN EL FORMULARIO PARA MODIFICAR*/
function fValidModificacion()
{
	if($('#txtExistencia').val() == Datos.existencia)	{
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
	var IdMateriaPrima = $('#cmbIdMateriaPrimaBusq').val();
	
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
	xmlhttp.open('POST','../Modelos/Scripts/InventarioMP.ajax.php',true);
	xmlhttp.setRequestHeader('Content-type','application/x-www-form-urlencoded');
	/*DATOS A ENVIAR AL SCRIPT DE LA TABLA*/
	xmlhttp.send('Campo=' + Campo + '&Pagina=' + Pagina + '&TamanoPagina=' + TamanoPagina + '&VentPadre=' + VentPadre + '&Estatus=' + Estatus + '&IdMotivoCambioE=' + IdMotivoCambioE + '&IdMateriaPrima=' + IdMateriaPrima);
}

function fMovimientoAjax()
{
	$('#divMovimiento').html('<tr><td> <img src="../Public/img/ajax-loaders/ajax-loader-1.gif"> Cargando </td></tr>');
	var xmlhttp;
	var IdInventarioMP = $('#txtIdInventarioMP').val();
	var IdMovimiento = $('#cmbIdMovimientoBusq').val();
	var FechaDesde = $('#txtFechaDesdeBusq').val();
	var FechaHasta = $('#txtFechaHastaBusq').val();
	var Pagina = $('#txtPaginaMov').val();
	var TamanoPagina = $('#txtTamanoPaginaMov').val();
	var Estatus = $('#cmbEstatus').val();
	
	if (window.XMLHttpRequest)	{// code for IE7+, Firefox, Chrome, Opera, Safari
		xmlhttp = new XMLHttpRequest();
	}
	else	{// code for IE6, IE5
		xmlhttp = new ActiveXObject('Microsoft.XMLHTTP');
	}
	
	xmlhttp.onreadystatechange=function()
	{
		if (xmlhttp.readyState == 4 && xmlhttp.status == 200)	{
			$('#divMovimiento').html(xmlhttp.responseText);
		}
	}
	
	/*SCRIPT QUE CONTENTRA LA TABLA*/
	xmlhttp.open('POST','../Modelos/Scripts/InventarioMPMov.ajax.php',true);
	xmlhttp.setRequestHeader('Content-type','application/x-www-form-urlencoded');
	/*DATOS A ENVIAR AL SCRIPT DE LA TABLA*/
	xmlhttp.send('IdInventarioMP=' + IdInventarioMP + '&Pagina=' + Pagina + '&TamanoPagina=' + TamanoPagina + '&IdMovimiento=' + IdMovimiento + '&Estatus=' + Estatus + '&FechaDesde=' + FechaDesde + '&FechaHasta=' + FechaHasta);
}

function fPaginacionMov(Pagina)
{
	$('[data-toggle=tmovtooltip]').tooltip('destroy');
	$('#txtPaginaMov').val(Pagina);
	$('[name=tbodymov]').html('<tr><td colspan="50"> <img src="../Public/img/ajax-loaders/ajax-loader-1.gif"></td></tr>Cargando...');
	setTimeout(function(){ fMovimientoAjax(); }, 0);
}

function fTamanoPaginaMov(TamanoPagina)
{
	$('[data-toggle=tmovtooltip]').tooltip('destroy');
	$('[name=tbodymov]').html('<tr><td colspan="50"> <img src="../Public/img/ajax-loaders/ajax-loader-1.gif"></td></tr>Cargando...');
	$('#txtPaginaMov').val(1);
	$('#txtTamanoPaginaMov').val(TamanoPagina);
	setTimeout(function(){ fMovimientoAjax(); }, 0);
}

function fCmbSiloMP()
{
	$('#cmbIdSiloMP').html('<option>CARGANDO</option>');
	var Operacion = $('#txtOperacion').val();
	var xmlhttp;
	
	if (window.XMLHttpRequest)	{// code for IE7+, Firefox, Chrome, Opera, Safari
		xmlhttp = new XMLHttpRequest();
	}
	else	{// code for IE6, IE5
		xmlhttp = new ActiveXObject('Microsoft.XMLHTTP');
	}
	
	xmlhttp.onreadystatechange=function()
	{
		if (xmlhttp.readyState == 4 && xmlhttp.status == 200)	{
			$('#cmbIdSiloMP').html(xmlhttp.responseText);
			if ( $('#txtOperacion').val() == 'modificar' )
			{
				$('#cmbIdSiloMP').val(Datos.idsilomp);
			}
		}
	}
	
	/*SCRIPT QUE CONTENTRA LA TABLA*/
	xmlhttp.open('POST','../Modelos/Combos/SiloMPInv.cmb.php',true);
	xmlhttp.setRequestHeader('Content-type','application/x-www-form-urlencoded');
	/*DATOS A ENVIAR AL SCRIPT DE LA TABLA*/
	xmlhttp.send('Operacion=' + Operacion);
}

function fEnviarDatos()
{
	if ( $('#txtVentPadre').val() == 'recepcionmp' )
	{
		/*alert(opener.$('[name="txtDetRecepcionMP[' + Datos.idsilomp + '][IdSiloMP]"').val());*/
		if ( opener.$('[name="txtDetRecepcionMP[' + Datos.idsilomp + '][IdSiloMP]"').val() == Datos.idsilomp )
		{
			swal('¡ERROR!' , 'Ese silo ya ha sido seleccionado' , 'error');
		}
		else
		{
			CapMax = parseFloat(Datos.capacidadmax);
			Existencia = parseFloat(Datos.existencia);
			$('#txtCantMP').val( opener.$('#txtPesoNetoRest').val() );
			$('#tdSilo').html(Datos.silomp.replace(/\+/g," "));
			$('#tdCapMax').html(CapMax + ' kg');
			CapDispAntes = (CapMax - Existencia).toFixed(2);
			$('#tdCapDispAntes').html( CapDispAntes + ' kg');
			$('#tdPesoNetoTotal').html( opener.$('#txtPesoNetoAR').val() + ' kg');
			$('#tdPesoNetoRest').html( opener.$('#txtPesoNetoRest').val() + ' kg');
			CapDispDespues = ( ( CapMax - Existencia ) - parseFloat($('#txtCantMP').val()) ).toFixed(2);
			$('#tdCapDispDespues').html( CapDispDespues + ' kg');

			$('#ModalRecepSilo').modal('show');
		}
	}
}

function fValidarCantMP()
{
	CantMP = parseFloat( $('#txtCantMP').val() );
	var PesoNetoRest = parseFloat( opener.$('#txtPesoNetoRest').val() );
	fActCapDispDespues()
	//alert(CantMP + ' - ' + PesoNetoRest);
	if ( CantMP > PesoNetoRest )
	{
		$('#spanMsjCantMP').css('display','block');
		$('#btnRecepSilo').attr('disabled','disabled');
		return 0;
	}
	else
	{
		$('#spanMsjCantMP').css('display','none');
		$('#btnRecepSilo').removeAttr('disabled');
		return 1;
	}
}

function fActCapDispDespues()
{
	CapDispDespues = ( ( CapMax - Existencia ) - CantMP ).toFixed(2);
	$('#tdCapDispDespues').html( CapDispDespues + ' kg' );
}

$('#txtCantMP').keyup(function()
{
	fValidarCantMP();
});

function fAbrirBusquedaMov()
{
	$('#ModalBusqMov').modal('show');
}

function fCerrarModalBusqMov()
{
	$('#ModalBusqMov').modal('hide');
}

function fBuscarMov()
{
	/*Para que cuando se haga una busqueda, comience desde la primera pagina*/
	$('[data-toggle=tmovtooltip]').tooltip('destroy');
	$('#txtPaginaMov').val(1);
	$('[name=tbodymov]').html('<tr><td colspan="50"> <img src="../Public/img/ajax-loaders/ajax-loader-1.gif"></td></tr>Buscando...');
	setTimeout(function(){ fMovimientoAjax(); }, 0);
	$('#ModalBusqMov').modal('hide');
}

function fImprimir()
{
	var Imprimir;
  Imprimir = window.open('../Reportes PDF/InventarioMP.Imp.pdf.php?Url=inventariomp&IdInventarioMP=' + Datos.idinventariomp + '&IdMovimiento=' + $('#cmbIdMovimientoBusq').val() + '&FechaDesde=' + $('#txtFechaDesdeBusq').val() + '&FechaHasta=' + $('#txtFechaHastaBusq').val() ,'Tarjeta de Movimientos de Inventario','width=5000, height=2000, top=0, left=0, toolbar=no, location=no, status=no, menubar=no, scrollbar=yes');
  Imprimir.focus();
}

$('#btnAbrirBusquedaMov').click(function()
{
	fAbrirBusquedaMov();
});

$('#btnCerrarModalBusqMov').click(function()
{
	fCerrarModalBusqMov();
});

$('#btnBuscarMov').click(function()
{
	fBuscarMov();
});

$('#RangoFechaBusq').datepicker({
  inputs: $('.RangoFechaBusq'),
  autoclose: true,
	todayHighlight: true,
	format: 'dd-mm-yyyy',
	todayBtn: true
});