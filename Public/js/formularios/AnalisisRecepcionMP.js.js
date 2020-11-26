var Datos='';
var ValidMod = 0;

$(document).ready(function(){
	$('#cmbIdProveedorBusq').select2();
	$('#cmbIdVehiculoBusq').select2();
	$('#cmbIdConductorBusq').select2();
});

$('#ModalBusq').on('hidden.bs.modal', function () {
    $('#cmbIdProveedorBusq').select2("close");
    $('#cmbIdVehiculoBusq').select2("close");
    $('#cmbIdConductorBusq').select2("close");
});

/*ARREGLO CON LOS ANÁLISIS DISPONIBLES*/

function fLlenarCampos(Datos)
{
	$('#txtIdAnalisisRecepcionMP').val(Datos.idanalisisrecepcionmp);
	$('#txtCodAnalisisRecepcionMP').val(Datos.idanalisisrecepcionmp);
	var Fecha = Datos.fecha.split("-");
	$('#txtFecha').val( Fecha[2] + '-' + Fecha[1] + '-' + Fecha[0] );
	$('#txtHora').val(Datos.hora.replace(/\+/g," "));
	$('#txtIdBoleto').val(Datos.idboleto);
	$('#txtCodBoleto').val(Datos.idboleto);
	$('#txtRazonSocialProv').val(Datos.razonsocialprov.replace(/\+/g," "));
	$('#txtMateriaPrima').val(Datos.materiaprima.replace(/\+/g," "));
	$('#txtIdMateriaPrima').val(Datos.idmateriaprima);
	$('#txtIdProveedor').val(Datos.idproveedor);
	$('#txtCedulaCond').val(Datos.nacionalidadcond + '-' +Datos.cedulacond);
	$('#txtNombresCond').val(Datos.nombrecond.replace(/\+/g," ") + ' ' + Datos.apellidocond.replace(/\+/g," "));
	$('#txtPlacaVeh').val(Datos.placaveh);
	$('#txtTipoVehiculo').val(Datos.tipovehiculo.replace(/\+/g," "));
	if ( Datos.remolque == '1' )
	{
		document.getElementById('chxRemolque').checked = true;
		$('#labelRemolque').addClass('active');
	}

	$('#txtPesoEspecifico').val(Datos.pesoespecifico);
	$('#txtObservacion').val(Datos.observacion.replace(/\+/g," "));
	$('#txtEstatus').val(Datos.estatus);

	$('#txtClase2').val(Datos.clase);
	$('#divAnalisis').css('display','');
	fDetalleAnalisis( $('#txtOperacion').val() );
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
	  cache: false, type: 'POST', dataType: 'json', url:'../Controladores/AnalisisRecepcionMP.con.php',
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
		      	fResetBusq();
		      	$('#txtBusqueda').val( response.IdAnalisisRecepcionMP );
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
	if( $('#txtOperacion').val() == 'modificar' && ( fValidModificacion() == 0 && ValidMod == 0 ) )
	{
		swal('Info','No ha realizado ningún cambio','info');
	}
	/*CONFIRMO LA OPERACION A EJECUTAR*/
	else if ( fValidaciones() == 1 )
	{
		swal({ title: '¡Confirmar!', text: '¿Confirma ejecutar la operación?', type: 'info', showCancelButton: true, closeOnConfirm: false, showLoaderOnConfirm: true, confirmButtonText: 'SI', cancelButtonText: 'NO' },function()
		{
			/*HABILITO LOS CAMPOS (LOS CAMPOS BLOQUEADOS NO SERAN ENVIADOS)*/
			$('.EFBloq').removeAttr('disabled');
			/*EJECUTO LA FUNCION AJAX*/
	  	fAjax($('#txtOperacion').val());
		});
	}
});

function fValidaciones()
{
	var Cont = -1;

	for ( var i = 0; i <= PosAnalisis; i ++ )
	{
		var ID = Analisis[i]['ID'];
		Cont += fValidInput(ID);
	}

	if ( Cont < ( PosAnalisis ) )
	{
		$('#btnEnviar').attr('disabled','disabled');
		return 0;
	}
	return 1;
}

function fParametrosBusq(Busq)
{
	var Content = 'Buscar por ' + Busq;
	$('#txtBusqueda').attr('data-content',Content);
	$('#txtBusqueda').popover('show');
	$('#txtBusqueda').focus();
	$('#txtBusqueda').val('');
}

function fResetBusq()
{
	fCmbMotivoCEAjax('busqueda','');
	$('#cmbEstatus').val('');
	$('#cmbParamBusq').val('cód. análisis');
	$('#cmbEvaluacionBusq').val( '' );
	$('#cmbClaseBusq').val( '' );
	$('#txtFechaDesdeBusq').val('');
	$('#txtFechaHastaBusq').val('');
	$('#txtBusqueda').focus();
	$('#txtBusqueda').val('');
	$('#txtBusqueda').attr('data-content','Buscar por código');
	$('#txtBusqueda').popover('show');

	$('#cmbIdProveedorBusq').val('').trigger('change');
	$('#cmbIdVehiculoBusq').val('').trigger('change');
	$('#cmbIdConductorBusq').val('').trigger('change');
}

/*FUNCIONES EXTRAS*/
function fRegistroExtra()
{
	$('#divCabeceraForm').css('display','none');
	fInfestacion('registrar');
	$('#divInfestacion').css('display','none');
	$('.EFBloq').attr('disabled','disabled');
	$('#txtAprobacion').val('0');
}

function fConsultaExtra()
{
	$('.EFBloq').attr('disabled','disabled');
}
function fModificacionExtra()
{
	$('#btnPopUpBoleto').attr('disabled','disabled');
	ValidMod = 0;
	if ( $('#txtRemolqueVeh').val() == '1' )
	{
		$('#labelRemolque').removeAttr('disabled');
	}
}
function fActivacionExtra()
{
	fDetalleAnalisis( 'consultar' );
	$('#divInfestacion').css('display','none');
	$('.EFBloq').attr('disabled','disabled');
}
function fDesactivacionExtra()
{
	fDetalleAnalisis( 'consultar' );
	$('#divInfestacion').css('display','none');
	$('.EFBloq').attr('disabled','disabled');
}
function fResetFormExtra()
{
	$('#divCabeceraForm').css('display','');
	//$('.EF2').removeAttr('disabled');
	$('#labelRemolque').attr('disabled','disabled');
	$('#labelRemolque').removeClass('active');
	$('#chxRemolque').removeAttr('checked');
	$('#txtRemolqueVeh').val('');
	$('#divInfestacion').css('display','none');
	//$('.EF3').val('');
	$('#txtClase').removeClass('CampoInvalido');
	$('#txtClase').removeClass('CampoValido');
	
	$('#spanAprobado').css('display','none');
	$('#spanRechazado').css('display','none');
	$('#spanEnEspera').css('display','');
	$('#divDetalleAnalisis').css('display','none');

	$('#divClase').css('display','none');
	$('#divAnalisis').css('display','none');

	$('.EFBloq').removeAttr('disabled');
}

function fDetalleAnalisis(Operacion)
{
	$('#divDetalleAnalisis').html('<div class="col-lg-offset-4 col-md-offset-4 col-sm-offset-3 col-xs-offset-0"> <img src="../Public/img/ajax-loaders/ajax-loader-1.gif"> Cargando Datos </div>');
	$('#divDetalleAnalisis').css('display','');
	var xmlhttp;
	var IdMateriaPrima=$('#txtIdMateriaPrima').val();
	var IdAnalisisRecepcionMP=$('#txtIdAnalisisRecepcionMP').val();
	if (window.XMLHttpRequest)	{// code for IE7+, Firefox, Chrome, Opera, Safari
		xmlhttp=new XMLHttpRequest();
	}
	else	{// code for IE6, IE5
		xmlhttp=new ActiveXObject('Microsoft.XMLHTTP');
	}
	
	xmlhttp.onreadystatechange=function()
	{
		if (xmlhttp.readyState==4 && xmlhttp.status==200)	{
			$('#divDetalleAnalisis').html(xmlhttp.responseText);
			if ( $('#txtOperacion').val() == 'consultar' || $('#txtOperacion').val() == 'modificar' || $('#txtOperacion').val() == 'activar' || $('#txtOperacion').val() == 'desactivar' )
			{
				for ( var i = 0; i <= PosAnalisis; i ++ )
				{
					fValidAnalisis( Analisis[i]['ID'] );
					if ( Analisis[i]['Analisis'] == 'GRANO DAÑADO' )
					{
						fcalcularclase( 'txtValor_'+Analisis[i]['ID'] );
					}
					if ( Analisis[i]['Analisis'] == 'INFESTACIÓN' )
					{
						if ( document.getElementById('radSelec_'+Analisis[i]['ID']+'_Si').checked == true )
						{
							$('#divInfestacion').css('display','');
						}
						else
						{
							$('#divInfestacion').css('display','none');
						}
						fInfestacion( $('#txtOperacion').val() );
					}
				}
				ValidMod = 0;
			}
		}
	}
	
	/*SCRIPT QUE CONTENTRA LA TABLA*/
	xmlhttp.open('POST','../Modelos/Scripts/AnalisisRecepcionMPDet.ajax.php',true);
	xmlhttp.setRequestHeader('Content-type','application/x-www-form-urlencoded');
	xmlhttp.send('Operacion='+Operacion+'&IdMateriaPrima='+IdMateriaPrima+'&IdAnalisisRecepcionMP='+IdAnalisisRecepcionMP);
}

function fEnviarDatosExtra()
{
	$("#txtIdProveedor").trigger("change");
	$('#Form').data('formValidation').updateStatus($('#txtRifProv'), 'NOT_VALIDATED').validateField($('#txtRifProv'));
	$('#Form').data('formValidation').updateStatus($('#txtRazonSocialProv'), 'NOT_VALIDATED').validateField($('#txtRazonSocialProv'));
}

function fEnviarDatosBoletoExtra()
{
	$('#Form').data('formValidation').updateStatus($('#txtCodBoleto'), 'NOT_VALIDATED').validateField($('#txtCodBoleto'));
	$('#Form').data('formValidation').updateStatus($('#txtMateriaPrima'), 'NOT_VALIDATED').validateField($('#txtMateriaPrima'));
	$('#Form').data('formValidation').updateStatus($('#txtRazonSocialProv'), 'NOT_VALIDATED').validateField($('#txtRazonSocialProv'));
	$('#Form').data('formValidation').updateStatus($('#txtCedulaCond'), 'NOT_VALIDATED').validateField($('#txtCedulaCond'));
	$('#Form').data('formValidation').updateStatus($('#txtNombresCond'), 'NOT_VALIDATED').validateField($('#txtNombresCond'));
	$('#Form').data('formValidation').updateStatus($('#txtPlacaVeh'), 'NOT_VALIDATED').validateField($('#txtPlacaVeh'));
	$('#Form').data('formValidation').updateStatus($('#txtTipoVehiculo'), 'NOT_VALIDATED').validateField($('#txtTipoVehiculo'));

	$('#txtClase2').val('0');
	$('#divClase').css('display','none');
	$('#divAnalisis').css('display','');
	fDetalleAnalisis( $('#txtOperacion').val() );
	$('.EFBloq').removeAttr('disabled');
}

function fEnviarDatosConductorExtra()
{
	$('#Form').data('formValidation').updateStatus($('#txtCedulaCond'), 'NOT_VALIDATED').validateField($('#txtCedulaCond'));
	$('#Form').data('formValidation').updateStatus($('#txtNombresCond'), 'NOT_VALIDATED').validateField($('#txtNombresCond'));
}

function fEnviarDatosVehiculoExtra()
{
	$('#Form').data('formValidation').updateStatus($('#txtPlacaVeh'), 'NOT_VALIDATED').validateField($('#txtPlacaVeh'));
	$('#Form').data('formValidation').updateStatus($('#txtTipoVehiculo'), 'NOT_VALIDATED').validateField($('#txtTipoVehiculo'));

	if ( $('#txtRemolqueVeh').val() == '1' )
	{
		$('#labelRemolque').removeAttr('disabled');
	}
	else if ( $('#txtRemolqueVeh').val() == '0' )
	{
		$('#labelRemolque').attr('disabled','disabled');
		$('#labelRemolque').removeClass('active');
		$('#chxRemolque').removeAttr('checked');
	}
}

/*VALIDAR SI SE HIZO ALGUN CAMBIO EN EL FORMULARIO PARA MODIFICAR*/
function fValidModificacion()
{
	if($('#txtIdBoleto').val() == Datos.idboleto && $('#txtObservacion').val() == Datos.observacion.replace(/\+/g," ") )	{
		return 0;
	}
	else {
		return 1;
	}
}

function fValidAnalisis(ID)
{
	var Valor = fValidInput(ID);
	if ( Valor == '1' )
	{
		fEvaluacion(ID);
	}
	else
	{
		$('#icon_' + ID).removeClass('glyphicon-ok');
    $('#icon_' + ID).removeClass('glyphicon-remove');
    $('#trAnalisis_' + ID).css('background','');
    $('#spanAprobado').css('display','none');
		$('#spanRechazado').css('display','none');
		$('#spanEnEspera').css('display','');
	}
}

function fValidInput(ID)
{
	ValidMod = 1;
	var Expresion = /[0-9]{1,3}[.]{1,1}[0-9]{1,1}/;
	if ( Expresion.test( $('#txtValor_'+ID).val() ) == true || ( $('#txtTipoInput_'+ID).val() != 'TEXT' && ( document.getElementById('radSelec_'+ID+'_Si').checked == true || document.getElementById('radSelec_'+ID+'_No').checked == true ) ) )
	{
		$('#smallValidDec'+ID).css('display','none');
		$('#txtValor_'+ID).removeClass('CampoInvalido');
		$('#btnEnviar').removeAttr('disabled');
		return 1;
	}
	else
	{
		$('#smallValidDec'+ID).css('display','block');
		$('#txtValor_'+ID).addClass('CampoInvalido');
		$('#btnEnviar').attr('disabled','disabled');
		return 0;
	}
}

/*ENVIA DATOS AL SCRIPT CON LA TABLA*/
function fTablaAjax()
{
	var xmlhttp;
	var ParamBusq = $('#cmbParamBusq').val();
	var Campo = $('#txtBusqueda').val();
	var VentPadre = $('#txtVentPadre').val();
	var Pagina = $('#txtPagina').val();
	var TamanoPagina = $('#txtTamanoPagina').val();
	var Estatus = $('#cmbEstatus').val();
	var IdMotivoCambioE = $('#cmbIdMotivoCambioEBusq').val();
	var IdMateriaPrima = $('#cmbIdMateriaPrimaBusq').val();
	var IdProveedor = $('#cmbIdProveedorBusq').val();
	var IdVehiculo = $('#cmbIdVehiculoBusq').val();
	var IdConductor = $('#cmbIdConductorBusq').val();
	var FechaDesde = $('#txtFechaDesdeBusq').val();
	var FechaHasta = $('#txtFechaHastaBusq').val();
	var Clase = $('#cmbClaseBusq').val();
	var Evaluacion = $('#cmbEvaluacionBusq').val();
	var FlujoProceso = '';

	/*SI ES VENTANA EMERGENTE, ABIERTA POR EL FORMULARIO DE BOLETO DE ENTRADA (RMP),
	ENTONCES MUESTRO LOS ANALISIS RELACIONADOS CON EL TRÁNSITO SELECCIONADO*/
	if ( VentPadre == 'boletoentradarmp' )
	{
		Campo = $('#txtIdBoleto').val();
		ParamBusq = 'boletoentradarmp';
		Estatus = '1';
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
	xmlhttp.open('POST','../Modelos/Scripts/AnalisisRecepcionMP.ajax.php',true);
	xmlhttp.setRequestHeader('Content-type','application/x-www-form-urlencoded');
	/*DATOS A ENVIAR AL SCRIPT DE LA TABLA*/
	xmlhttp.send('ParamBusq=' + ParamBusq + '&Campo=' + Campo + '&Pagina=' + Pagina + '&TamanoPagina=' + TamanoPagina + '&VentPadre=' + VentPadre + '&Estatus=' + Estatus + '&IdMotivoCambioE=' + IdMotivoCambioE + '&IdMateriaPrima=' + IdMateriaPrima + '&FechaDesde=' + FechaDesde + '&FechaHasta=' + FechaHasta + '&Clase=' + Clase + '&Evaluacion=' + Evaluacion + '&IdProveedor=' + IdProveedor + '&IdVehiculo=' + IdVehiculo + '&IdConductor=' + IdConductor + '&FlujoProceso=' + FlujoProceso );
}

function fReportePDF()
{
	var ParamBusq = $('#cmbParamBusq').val();
	var Campo = $('#txtBusqueda').val();
	var VentPadre = $('#txtVentPadre').val();
	var Estatus = $('#cmbEstatus').val();
	var IdMotivoCambioE = $('#cmbIdMotivoCambioEBusq').val();
	var IdMateriaPrima = $('#cmbIdMateriaPrimaBusq').val();
	var IdProveedor = $('#cmbIdProveedorBusq').val();
	var IdConductor = $('#cmbIdConductorBusq').val();
	var IdVehiculo = $('#cmbIdVehiculoBusq').val();
	var FechaDesde = $('#txtFechaDesdeBusq').val();
	var FechaHasta = $('#txtFechaHastaBusq').val();
	var Clase = $('#cmbClaseBusq').val();
	var Evaluacion = $('#cmbEvaluacionBusq').val();
	var ReportePDF;
  ReportePDF=window.open('../Reportes PDF/AnalisisRecepcionMP.Rep.pdf.php?Url=analisisrecepcionmp&ParamBusq=' + ParamBusq + '&Campo=' + Campo + '&VentPadre=' + VentPadre + '&Estatus=' + Estatus + '&IdMotivoCambioE=' + IdMotivoCambioE + '&IdMateriaPrima=' + IdMateriaPrima + '&FechaDesde=' + FechaDesde + '&FechaHasta=' + FechaHasta + '&Clase=' + Clase + '&Evaluacion=' + Evaluacion + '&IdProveedor=' + IdProveedor + '&IdVehiculo=' + IdVehiculo + '&IdConductor=' + IdConductor ,'Reporte de los Análisis Recepcions de Materia Prima','width=5000, height=2000, top=0, left=0, toolbar=no, location=no, status=no, menubar=no, scrollbar=yes');
  ReportePDF.focus();
}

function fImprimir()
{
	var Imprimir;
  Imprimir=window.open('../Reportes PDF/AnalisisRecepcionMP.Imp.pdf.php?Url=analisisrecepcionmp&IdAnalisisRecepcionMP=' + Datos.idanalisisrecepcionmp ,'Reporte de los Análisis de Recepción de Materia Prima','width=5000, height=2000, top=0, left=0, toolbar=no, location=no, status=no, menubar=no, scrollbar=yes');
  Imprimir.focus();
}

function fEvaluacion(ID)
{
  var Valor = parseFloat( $('#txtValor_'+ID).val() );
  if( ( Valor >= parseFloat( $('#txtMin_'+ID).val() ) && Valor <= parseFloat( $('#txtMax_'+ID).val() ) ) || ( $('#txtTipoInput_'+ID).val() != 'TEXT' && document.getElementById('radSelec_'+ID+'_Si').checked == false ) )
  {
  	$('#icon_' + ID).removeClass('glyphicon-remove');
		$('#icon_' + ID).addClass('glyphicon-ok');
		$('#trAnalisis_' + ID).css('background','#D7FFDF');
  }
  else
  {
  	$('#icon_' + ID).removeClass('glyphicon-ok');
  	$('#icon_' + ID).addClass('glyphicon-remove');
  	$('#trAnalisis_' + ID).css('background','#FFD7DC');
  }
  fResultado();
}

function fResultado()
{
	var Cont = -1;
	var ContResult = 0;
	var Aprob = 0;

	for ( var i = 0; i <= PosAnalisis; i ++ )
	{
		var ID = Analisis[i]['ID'];
		if ( ( $('#txtValor_' + ID).val() != '' && isNaN( $('#txtValor_' + ID).val() ) != true ) || ( $('#txtTipoInput_'+ID).val() != 'TEXT' && ( document.getElementById('radSelec_'+ID+'_Si').checked == true || document.getElementById('radSelec_'+ID+'_No').checked == true ) ) )
		{
			Cont ++;
		}
	}
	
	if ( Cont == PosAnalisis )
	{
		for ( var i = 0; i <= PosAnalisis; i ++ ) 
		{
			if ( Analisis[i]['Oblig'] == '1' )
			{
				Aprob ++;
				if ( ( parseFloat($('#txtValor_'+Analisis[i]['ID']).val()) >= parseFloat(Analisis[i]['Minimo']) && parseFloat($('#txtValor_'+Analisis[i]['ID']).val()) <= parseFloat(Analisis[i]['Maximo']) ) || ( $('#txtTipoInput_'+Analisis[i]['ID']).val() != 'TEXT' && document.getElementById('radSelec_'+Analisis[i]['ID']+'_Si').checked == false ) )
				{
					ContResult ++;
				}
				else
				{
					ContResult = 0;
				}
			}
		}

		if ( ContResult == Aprob )
		{
			$('#spanRechazado').css('display','none');
			$('#spanEnEspera').css('display','none');
			$('#spanAprobado').css('display','');
			$('#txtAprobacion').val('1');
		}
		else if ( ContResult < Aprob )
		{
			$('#spanAprobado').css('display','none');
			$('#spanEnEspera').css('display','none');
			$('#spanRechazado').css('display','');
			$('#txtAprobacion').val('0');
		}
		else
		{
			$('#spanAprobado').css('display','none');
			$('#spanRechazado').css('display','none');
			$('#spanEnEspera').css('display','');
			$('#txtAprobacion').val('0');
		}
	}
}

function fcalcularclase(id)
{
	id = id.split('_');
	ID = id[1];
	if ( fValidInput(ID) == '1' )
	{
		var GranoDanado = parseFloat( $('#txtValor_'+ID).val() );
	  if( isNaN( GranoDanado ) == false && ( GranoDanado != '' || GranoDanado == '0.0' ) )
	  {
	    if( GranoDanado >= parseFloat(Clase['C1Min']) && GranoDanado <= parseFloat(Clase['C1Max']) )
	    {
	    	$('#txtClase').val( 'I' );
	    	$('#txtClase').removeClass('CampoInvalido');
				$('#txtClase').addClass('CampoValido');
				$('#txtClase2').val( '1' );
	    }
	    else if( GranoDanado >= parseFloat(Clase['C2Min']) && GranoDanado <= parseFloat(Clase['C2Max']) )
	    {
	    	$('#txtClase').val( 'II' );
	    	$('#txtClase').removeClass('CampoInvalido');
				$('#txtClase').addClass('CampoValido');
				$('#txtClase2').val( '2' );
	    }
	    else if( GranoDanado >= parseFloat(Clase['C3Min']) && GranoDanado <= parseFloat(Clase['C3Max']) )
	    {
	    	$('#txtClase').val( 'III' );
	    	$('#txtClase').removeClass('CampoInvalido');
				$('#txtClase').addClass('CampoValido');
				$('#txtClase2').val( '3' );
	    }
	    else
	    {
	    	$('#txtClase').val( 'G.P.M' );
	    	$('#txtClase').removeClass('CampoValido');
				$('#txtClase').addClass('CampoInvalido');
				$('#txtClase2').val( '4' );
	    }
	  }
	  else
	  {
	  	$('#txtClase').val('');
	    $('#txtClase').removeClass('CampoValido');
			$('#txtClase').removeClass('CampoInvalido');
	  }
	}
	else
	  {
	  	$('#txtClase').val('');
	    $('#txtClase').removeClass('CampoValido');
			$('#txtClase').removeClass('CampoInvalido');
	  }
}

function fmostrardivinfestacion(id)
{
	id = id.split('_');
	ID = id[1];
	if ( document.getElementById('radSelec_'+ID+'_Si').checked == true )
	{
		$('#divInfestacion').slideDown('fast');
	}
	else
	{
		$('#divInfestacion').slideUp('fast');
	}
}

/****************************************************************************************/
/*BUSCAR INFESTACIONES*/
function fInfestacion(Operacion)
{
	$('#divInfestacion').html('<div class="col-lg-offset-4 col-md-offset-4 col-sm-offset-3 col-xs-offset-0"> <img src="../Public/img/ajax-loaders/ajax-loader-1.gif"> Cargando listado de infestaciones </div>');
	var xmlhttp;
	var IdAnalisisRecepcionMP=$('#txtIdAnalisisRecepcionMP').val();
	if (window.XMLHttpRequest)	{// code for IE7+, Firefox, Chrome, Opera, Safari
		xmlhttp=new XMLHttpRequest();
	}
	else	{// code for IE6, IE5
		xmlhttp=new ActiveXObject('Microsoft.XMLHTTP');
	}
	
	xmlhttp.onreadystatechange=function()
	{
		if (xmlhttp.readyState==4 && xmlhttp.status==200)
		{
			$('#divInfestacion').html(xmlhttp.responseText);
		}
	}
	
	/*SCRIPT QUE CONTENTRA LA TABLA*/
	xmlhttp.open('POST','../Modelos/Scripts/ListaInfestacionRecep.ajax.php',true);
	xmlhttp.setRequestHeader('Content-type','application/x-www-form-urlencoded');
	/*DATOS A ENVIAR AL SCRIPT DE LA TABLA*/
	xmlhttp.send('Operacion='+Operacion+'&IdAnalisisRecepcionMP='+IdAnalisisRecepcionMP);
}

function fChequear(IdInfestacion)
{
	ValidMod = 1;
	if(document.getElementById('chxInf_' + IdInfestacion).checked == true)
	{
		document.getElementById('chxInf_' + IdInfestacion).checked = false;
		$('#labelInf_' + IdInfestacion).removeClass('active');
	}
	else if(document.getElementById('chxInf_' + IdInfestacion).checked == false)
	{
		document.getElementById('chxInf_' + IdInfestacion).checked = true;
		$('#labelInf_' + IdInfestacion).addClass('active');
	}
	else{ alert('ERROR'); }
}

/****************************************************************************************************/
/****************************************************************************************************/
/****************************************************************************************************/
/*ENVIAR DATOS*/
/****************************************************************************************************/
/****************************************************************************************************/
/****************************************************************************************************/

function fEnviarDatos()
{
	if(Datos.aprobacion == '0'){
		swal('ACCIÓN INVÁLIDA!' , 'Los análisis rechazados no pueden ser seleccionados' , 'info');
	}
	else
	{
		opener.$('#txtIdBoleto').val(Datos.idtransitorecepcionmp);
		opener.$('#txtCodBoleto').val(Datos.idtransitorecepcionmp);
		opener.$('#txtMateriaPrima').val(Datos.materiaprima.replace(/\+/g," "));
		opener.$('#txtRazonSocialProv').val(Datos.razonsocialprov.replace(/\+/g," "));
		opener.$('#txtIdMateriaPrima').val(Datos.idmateriaprima);
		opener.$('#txtIdAnalisisRecepcionMP').val(Datos.idanalisisrecepcionmp);
		opener.$('.EF2').removeAttr('disabled');
		opener.$('#txtIdConductor').val(Datos.idconductor);
		opener.$('#txtCedulaCond').val(Datos.nacionalidadcond + '-' +Datos.cedulacond);
		opener.$('#txtNombresCond').val(Datos.nombrecond.replace(/\+/g," ") + ' ' + Datos.apellidocond.replace(/\+/g," "));
		opener.$('#txtIdVehiculo').val(Datos.idvehiculo);
		opener.$('#txtPlacaVeh').val(Datos.placaveh);
		opener.$('#txtTipoVehiculo').val(Datos.tipovehiculo.replace(/\+/g," "));
		opener.$('#txtRemolqueVeh').val(Datos.remolque);
		if ( Datos.remolque == '1' )
		{
			opener.document.getElementById('chxRemolque').checked = true;
			opener.$('#labelRemolque').addClass('active');
		}
		else if ( Datos.remolque == '0' )
		{
			opener.$('#chxRemolque').removeAttr('checked');
			opener.$('#labelRemolque').removeClass('active');
		}
		opener.$('#btnPopUpConductor').attr('disabled','disabled');
		opener.$('#btnPopUpVehiculo').attr('disabled','disabled');
		opener.$('#divPesajeExt').css('display','');
		opener.$('#labelEnt').css('display','');
		window.opener.fEnviarDatosTransitoAnalisisExtra();
		window.close();
	}
}

function fBloqueo(Valor1,Valor2)
{
	if ( Valor1 != '0' || Valor2 != '1' )
	{
		$('#btnModificar1').attr('disabled','disabled');
		$('#btnModificar2').attr('disabled','disabled');
	}
}

/****************************************************************************************************/
/****************************************************************************************************/
/****************************************************************************************************/
/*EVENTOS*/
/****************************************************************************************************/
/****************************************************************************************************/
/****************************************************************************************************/

$('#RangoFechaBusq').datepicker({
    inputs: $('.RangoFechaBusq'),
    autoclose: true,
		todayHighlight: true,
		format: 'dd-mm-yyyy',
		todayBtn: true
});

$('#btnPopUpBoleto').click(function()
{
	var PopUpBoleto;
  PopUpBoleto=window.open('monitorrmp.vis.php?Url=monitorrmp' + '&VentPadre=' + $('#txtUrl').val() ,'Monitor de Recepción de Materia Prima','width=5000, height=2000, top=0, left=0, toolbar=no, location=no, status=no, menubar=no, scrollbar=yes');
  PopUpBoleto.focus();
});

/****************************************************************************************************/
/****************************************************************************************************/
/****************************************************************************************************/
/*VALIDACIONES DEL FORMULARIO*/
/****************************************************************************************************/
/****************************************************************************************************/
/****************************************************************************************************/

$(document).ready(function(){
	$('#Form').formValidation({
		message: 'Este valor no es valido',
		live: 'enabled',
		excluded: [':hidden', ':not(:visible)'],
		fields: {
			PesoVeh: {
				row: '.PesoVeh',
				validators: {
					regexp: {
						regexp: /^[0-9]{1,6}[.]{1,1}[0-9]{1,2}$/,
						message: 'Ingrese el peso con decimales (.)'
					},
					notEmpty: {
						message: ''
					}
				}
			}
		}
	})
	.on('success.field.fv', function(e, data) {
		e.preventDefault();
    if (data.fv.getSubmitButton()) {
        data.fv.disableSubmitButtons(false);
    }
	});
});

//setTimeout(function(){ fTablaAjax(); }, 2000);
//$( '.Analisis' ).prop( 'required' )