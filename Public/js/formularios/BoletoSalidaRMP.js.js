var Datos='';

$(document).ready(function()
{
	$('#cmbIdProveedorBusq').select2();
	$('#cmbIdVehiculoBusq').select2();
	$('#cmbIdConductorBusq').select2();
});

$('#ModalBusq').on('hidden.bs.modal',function()
{
	$('#cmbIdProveedorBusq').select2("close");
	$('#cmbIdVehiculoBusq').select2("close");
	$('#cmbIdConductorBusq').select2("close");
});

var Fecha = new Date();
if ( (Fecha.getMonth() +1) < 10 )	{
	var Mes = '0' + (Fecha.getMonth() +1);
}
else 	{
	var Mes = Fecha.getMonth() + 1;
}
var FechaSal = (Fecha.getDate() + '-' + Mes + '-' + Fecha.getFullYear());

function HoraSal()
{
	if ( $('#txtOperacion').val() == 'registrar' )
	{
		var Time = new Date();
		var Hora=Time.getHours();
		var Minutos=Time.getMinutes();
		var dn="AM";
		if (Hora>12){
			dn="PM";
			Hora=Hora-12;
		}
		if (Hora==0)
			Hora=12;
		if (Minutos<=9)
			Minutos="0"+Minutos;

		$('#txtHoraSal').val( Hora + ":" + Minutos + " " + dn );
		setTimeout("HoraSal()",1000);
	}
}

function fLlenarCampos(Datos)
{
	$('#txtIdBoleto').val(Datos.idboleto);
	$('#txtCodBoleto').val(Datos.idboleto);
	$('#txtCodBoletoEntrada').val(Datos.idboleto);
	var Fecha = Datos.fechasal.split("-");
	$('#txtFecha').val( Fecha[2] + '-' + Fecha[1] + '-' + Fecha[0] );
	$('#txtHora').val(Datos.horasal.replace(/\+/g," "));
	$('#txtTipoPesada').val(Datos.tipopesada);
	$('#txtGuiaSADA').val(Datos.guiasada);
	$('#txtGuiaProv').val(Datos.guiaprov);
	$('#txtRazonSocialProv').val(Datos.razonsocialprov.replace(/\+/g," "));
	$('#txtIdMateriaPrima').val(Datos.idmateriaprima);
	$('#txtMateriaPrima').val(Datos.materiaprima.replace(/\+/g," "));
	$('#txtIdConductor').val(Datos.idconductor);
	$('#txtCedulaCond').val(Datos.nacionalidadcond + '-' +Datos.cedulacond);
	$('#txtNombresCond').val(Datos.nombrecond.replace(/\+/g," ") + ' ' + Datos.apellidocond.replace(/\+/g," "));
	$('#txtIdVehiculo').val(Datos.idvehiculo);
	$('#txtPlacaVeh').val(Datos.placaveh);
	$('#txtTipoVehiculo').val(Datos.tipovehiculo.replace(/\+/g," "));
	if ( Datos.remolque == '1' )
	{
		$('#chxRemolque').attr('checked','checked');
		$('#labelRemolque').addClass('active');
	}
	Fecha = Datos.fechaent.split("-");
	$('#txtFechaEnt').val( Fecha[2] + '-' + Fecha[1] + '-' + Fecha[0] );
	$('#txtHoraEnt').val(Datos.horaent.replace(/\+/g," "));
	$('#txtPesoVehEnt').val(Datos.pesovehent);
	$('#txtPesoRemEnt').val(Datos.pesorement);

	Fecha = Datos.fechasal.split("-");
	$('#txtFechaSal').val( Fecha[2] + '-' + Fecha[1] + '-' + Fecha[0] );
	$('#txtHoraSal').val(Datos.horasal.replace(/\+/g," "));
	$('#txtPesoVehSal').val(Datos.pesovehsal);
	$('#txtPesoRemSal').val(Datos.pesoremsal);

	if ( Datos.idanalisisexternomp != '0' )
	{
		$('#divPesajeExt').css('display','');
		$('#labelEnt').css('display','');
		$('#txtPesoTotalExt').val( ( parseFloat(Datos.pesovehext) + parseFloat(Datos.pesoremext) + parseFloat(Datos.pesonetoext) ).toFixed(2) );
	}
	else
	{
		$('#divPesoExt').css('display','none');
		$('#labelEnt').css('display','none');
	}
	$('#txtObservacion').val(Datos.observacionsal.replace(/\+/g," "));
	$('#txtEstatus').val(Datos.estatus);

	if( Datos.tipopesadasal == '1' )
	{
		$('#txtTipoPesada2').val('MANUAL');
	}
	else if( Datos.tipopesadasal == '0' )
	{
		$('#txtTipoPesada2').val('AUTOMÁTICA');
	}

	if ( Datos.analisisext == '1' )	{
		$('#divPesoExt').css('display','');
		$('#txtPesoVehExt').val(Datos.pesovehext);
		$('#txtPesoRemExt').val(Datos.pesoremext);
		$('#txtPesoNetoExt').val(Datos.pesonetoext);
	}
	else if ( Datos.analisisext == '0' )	{
		$('#divPesoExt').css('display','none');
		$('#txtPesoVehExt').val('0.00');
		$('#txtPesoRemExt').val('0.00');
		$('#txtPesoNetoExt').val('0.00');
	}

	if ( Datos.aprobacion == '1' )	{
		$('#spanRechazado').css('display','none');
		$('#spanAprobado').css('display','');
		$('#txtAprobacion').val('1');
		$('#divPesoNeto').css('display','');
	}
	else if ( Datos.aprobacion == '0' )	{
		$('#spanAprobado').css('display','none');
		$('#spanRechazado').css('display','');
		$('#txtAprobacion').val('0');
		$('#divPesoExt').css('display','none');
		$('#divPesoNeto').css('display','none');
	}
	fPesoTotal();
}

function fVerificarUnicidad(Campo1,Campo2)
{
	if ( $('#txtOperacion').val() == 'registrar' && $('#txt' + Campo1 ).val() != '' )	{
		fAjax('verificar_' + Campo2);
	}
	else if ( $('#txtOperacion').val() == 'modificar' && $('#txt' + Campo1).val() != Datos[Campo2].replace(/\+/g," ") )	{
		fAjax('verificar_' + Campo2);
	}
}

/*ENVIO DE RECEPCION DE DATOS VIA AJAX*/
function fAjax(Operacion)
{
	/*SERIALIZO EL FORMULARIO (CAMPOS) PARA ENVIARLO AL CONTROLADOR*/
	var str = $('#Form').serialize();
	$.ajax(
	{
	  cache: false, type: 'POST', dataType: 'json', url:'../Controladores/BoletoSalidaRMP.con.php',
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
		      	$('#txtBusqueda').val( $('#txtIdBoleto').val() );
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
	else if ( fValidaciones() == 1 )
	{
		swal({ title: '¡Confirmar!', text: '¿Confirma ejecutar la operación?', type: 'info', showCancelButton: true, closeOnConfirm: false, showLoaderOnConfirm: true, confirmButtonText: 'SI', cancelButtonText: 'NO' },function()
		{
			/*HABILITO LOS CAMPOS (LOS CAMPOS BLOQUEADOS NO SERAN ENVIADOS)*/
			$('.EF').removeAttr('disabled')
			/*EJECUTO LA FUNCION AJAX*/
			$('#txtPesoVehSal').removeAttr('disabled');
			$('#txtPesoRemSal').removeAttr('disabled');
	  	fAjax($('#txtOperacion').val());
		});
	}
});

function fValidaciones()
{
	var Cont = 0;
	Cont += fValidarPeso('PesoVeh');
	Cont += fValidarPeso('PesoRem');

	if ( Cont < 2 )
	{
		return 0;
	}
	return 1;
}

function fParametrosBusq(Busq)
{
	var Content = 'Buscar por ' + Busq;
	$('#divBusqNormal').css('display','');
	$('#txtBusqueda').attr('data-content',Content);
	$('#txtBusqueda').popover('show');
	$('#txtBusqueda').focus();
	$('#txtBusqueda').val('');
}

function fResetBusq()
{
	fCmbMotivoCEAjax('busqueda','');
	$('#cmbEstatus').val('');
	$('#cmbParamBusq').val('cód. de boleto');
	$('#cmbEvaluacionBusq').val( '' );
	$('#cmbClaseBusq').val( '' );
	$('#txtFechaDesdeBusq').val('');
	$('#txtFechaHastaBusq').val('');
	$('#txtBusqueda').focus();
	$('#txtBusqueda').val('');
	$('#txtBusqueda').attr('data-content','Buscar por cód. de boleto');
	$('#txtBusqueda').popover('show');

	$('#divAprobacion').css('display','none');
	$('#cmbIdProveedorBusq').val('').trigger('change');
	$('#cmbIdVehiculoBusq').val('').trigger('change');
	$('#cmbIdConductorBusq').val('').trigger('change');
}

/*FUNCIONES EXTRAS*/
function fRegistroExtra()
{
	$('#divCabeceraForm').css('display','none');
	$('.EF2').attr('disabled','disabled');
	$('#btnPopUpVehiculo').attr('disabled','disabled');
	$('#btnPopUpConductor').attr('disabled','disabled');
	$('#btnPesoVeh').attr('disabled','disabled');
	$('#btnPesoRem').attr('disabled','disabled');
	$('#divPesoNeto').css('display','none');
	$('#divPesoExt').css('display','none');
	$('#labelEnt').css('display','none');
	fPesadaAutomatica();
	$('.EFPeso').val('0.00');
	$('#txtPesoVehEnt').attr('disabled','disabled');
	$('#txtPesoRemEnt').attr('disabled','disabled');
	$('#txtPesoVehSal').attr('disabled','disabled');
	$('#txtPesoRemSal').attr('disabled','disabled');
	$('#btnPopUpTransitoRecepcionMP').removeAttr('disabled');
	$('#txtFechaSal').val(FechaSal);
	HoraSal();
}

function fConsultaExtra()
{
	$('.EF2').attr('disabled','disabled');
	$('#txtPesoVehSal').attr('disabled','disabled');
	$('#txtPesoRemSal').attr('disabled','disabled');
	$('#btnPopUpBoleto').attr('disabled','disabled');
}
function fModificacionExtra(){}
function fActivacionExtra(){}
function fDesactivacionExtra(){}
function fResetFormExtra()
{
	$('#divCabeceraForm').css('display','');
	$('.EF2').removeAttr('disabled');
	$('#txtPesoVehSal').removeAttr('disabled');
	$('#txtPesoRemSal').removeAttr('disabled');
	$('#labelRemolque').attr('disabled','disabled');
	$('#labelRemolque').removeClass('active');
	$('#chxRemolque').removeAttr('checked');
	$('#txtRemolqueVeh').val('');
	$('.EF3').val('');
	$('#divAprobacion').css('display','none');
}

function fReportePDF()
{
	var ParamBusq = $('#cmbParamBusq').val();
	var Campo = $('#txtBusqueda').val();
	var Formulario = $('#txtFormulario').val();
	var VentPadre = $('#txtVentPadre').val();
	var Estatus = $('#cmbEstatus').val();
	var IdMotivoCambioE = $('#cmbIdMotivoCambioEBusq').val();
	var FechaDesde = $('#txtFechaDesdeBusq').val();
	var FechaHasta = $('#txtFechaHastaBusq').val();
	var TipoVehiculo = $('#cmbIdTipoVehiculoBusq').val();
	var FlujoProceso = $('#cmbFlujoProcesoBusq').val();
	var IdProveedor = $('#cmbIdProveedorBusq').val();
	var IdMateriaPrima = $('#cmbIdMateriaPrimaBusq').val();
	var ReportePDF;
  ReportePDF=window.open('../Reportes PDF/BoletoSalidaRMP.Rep.pdf.php?Url=boletosalidarmp&ParamBusq=' + ParamBusq + '&Campo=' + Campo + '&VentPadre=' + VentPadre + '&Estatus=' + Estatus + '&IdMotivoCambioE=' + IdMotivoCambioE + '&IdMateriaPrima=' + IdMateriaPrima + '&FechaDesde=' + FechaDesde + '&FechaHasta=' + FechaHasta + '&FlujoProceso=' + FlujoProceso + '&TipoVehiculo=' + TipoVehiculo + '&IdProveedor=' + IdProveedor ,'Reporte de los Boletos de Entrada de la Recepción de Materia Prima','width=5000, height=2000, top=0, left=0, toolbar=no, location=no, status=no, menubar=no, scrollbar=yes');
  ReportePDF.focus();
}

function fImprimir()
{
	var Imprimir;
  Imprimir=window.open('../Reportes PDF/BoletoSalidaRMP.Imp.pdf.php?Url=boletosalidarmp&IdBoleto=' + Datos.idboleto ,'Boleto de Entrada de Recepción de Materia Prima','width=5000, height=2000, top=0, left=0, toolbar=no, location=no, status=no, menubar=no, scrollbar=yes');
  Imprimir.focus();
}

function fEnviarDatosBoletoExtra()
{
	$('#Form').data('formValidation').updateStatus($('#txtCodBoleto'), 'NOT_VALIDATED').validateField($('#txtCodBoleto'));
	$('#Form').data('formValidation').updateStatus($('#txtGuiaSADA'), 'NOT_VALIDATED').validateField($('#txtGuiaSADA'));
	$('#Form').data('formValidation').updateStatus($('#txtGuiaProv'), 'NOT_VALIDATED').validateField($('#txtGuiaProv'));
	$('#Form').data('formValidation').updateStatus($('#txtMateriaPrima'), 'NOT_VALIDATED').validateField($('#txtMateriaPrima'));
	$('#Form').data('formValidation').updateStatus($('#txtRazonSocialProv'), 'NOT_VALIDATED').validateField($('#txtRazonSocialProv'));
	$('#Form').data('formValidation').updateStatus($('#txtCedulaCond'), 'NOT_VALIDATED').validateField($('#txtCedulaCond'));
	$('#Form').data('formValidation').updateStatus($('#txtNombresCond'), 'NOT_VALIDATED').validateField($('#txtNombresCond'));
	$('#Form').data('formValidation').updateStatus($('#txtPlacaVeh'), 'NOT_VALIDATED').validateField($('#txtPlacaVeh'));
	$('#Form').data('formValidation').updateStatus($('#txtTipoVehiculo'), 'NOT_VALIDATED').validateField($('#txtTipoVehiculo'));
	$('#Form').data('formValidation').updateStatus($('#txtFechaEnt'), 'NOT_VALIDATED').validateField($('#txtFechaEnt'));
	$('#Form').data('formValidation').updateStatus($('#txtHoraEnt'), 'NOT_VALIDATED').validateField($('#txtHoraEnt'));
	$('#Form').data('formValidation').updateStatus($('#txtPesoVehEnt'), 'NOT_VALIDATED').validateField($('#txtPesoVehEnt'));
	$('#Form').data('formValidation').updateStatus($('#txtPesoRemEnt'), 'NOT_VALIDATED').validateField($('#txtPesoRemEnt'));
	$('#Form').data('formValidation').updateStatus($('#txtPesoTotalEnt'), 'NOT_VALIDATED').validateField($('#txtPesoTotalEnt'));
}

/**/

/*VALIDAR SI SE HIZO ALGUN CAMBIO EN EL FORMULARIO PARA MODIFICAR*/
function fValidModificacion()
{
	if($('#txtNombre').val() == Datos.nombre && $('#txtDescripcion').val() == Datos.descripcion )	{
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
	var IdMateriaPrima = $('#cmbIdMateriaPrimaBusq').val();
	var FechaDesde = $('#txtFechaDesdeBusq').val();
	var FechaHasta = $('#txtFechaHastaBusq').val();
	var FlujoProceso = $('#cmbFlujoProcesoBusq').val();
	var IdProveedor = $('#cmbIdProveedorBusq').val();
	var IdConductor = $('#cmbIdConductorBusq').val();
	var IdVehiculo = $('#cmbIdVehiculoBusq').val();
	var IdTipoVehiculo = $('#cmbIdTipoVehiculoBusq').val();
	var TipoPesada = $('#cmbTipoPesadaBusq').val();
	
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
	xmlhttp.open('POST','../Modelos/Scripts/BoletoSalidaRMP.ajax.php',true);
	xmlhttp.setRequestHeader('Content-type','application/x-www-form-urlencoded');
	/*DATOS A ENVIAR AL SCRIPT DE LA TABLA*/
	xmlhttp.send('ParamBusq=' + ParamBusq + '&Campo=' + Campo + '&Pagina=' + Pagina + '&TamanoPagina=' + TamanoPagina + '&VentPadre=' + VentPadre + '&Estatus=' + Estatus + '&IdMotivoCambioE=' + IdMotivoCambioE + '&IdMateriaPrima=' + IdMateriaPrima + '&FechaDesde=' + FechaDesde + '&FechaHasta=' + FechaHasta + '&FlujoProceso=' + FlujoProceso + '&IdProveedor=' + IdProveedor + '&IdConductor=' + IdConductor + '&IdVehiculo=' + IdVehiculo + '&IdTipoVehiculo=' + IdTipoVehiculo + '&TipoPesada=' + TipoPesada);
}

function fEnviarDatosTransitoAnalisisExtra()
{
	$('#Form').data('formValidation').updateStatus($('#txtCodTransitoRecepcionMP'), 'NOT_VALIDATED').validateField($('#txtCodTransitoRecepcionMP'));
	$('#Form').data('formValidation').updateStatus($('#txtMateriaPrima'), 'NOT_VALIDATED').validateField($('#txtMateriaPrima'));
	$('#Form').data('formValidation').updateStatus($('#txtRazonSocialProv'), 'NOT_VALIDATED').validateField($('#txtRazonSocialProv'));
	$('#labelRemolque').attr('disabled','disabled');
}

/****************************************************************************************/

function fPesoTotal()
{

	var PesoVehEnt = ( $('#txtPesoVehEnt').val() == '' ) ? 0 : parseFloat( $('#txtPesoVehEnt').val() );
	var PesoRemEnt = ( $('#txtPesoRemEnt').val() == '' ) ? 0 : parseFloat( $('#txtPesoRemEnt').val() );
	var PesoVehSal = ( $('#txtPesoVehSal').val() == '' ) ? 0 : parseFloat( $('#txtPesoVehSal').val() );
	var PesoRemSal = ( $('#txtPesoRemSal').val() == '' ) ? 0 : parseFloat( $('#txtPesoRemSal').val() );

	$('#txtPesoTotalEnt').val( ( PesoVehEnt + PesoRemEnt ).toFixed(2) );
	$('#txtPesoTotalSal').val( ( PesoVehSal + PesoRemSal ).toFixed(2) );
	$('#txtPesoVehTotal').val( ( PesoVehEnt - PesoVehSal ).toFixed(2) );
	$('#txtPesoRemTotal').val( ( PesoRemEnt - PesoRemSal ).toFixed(2) );
	$('#txtPesoNeto').val( ( ( PesoVehEnt + PesoRemEnt ) - ( PesoVehSal + PesoRemSal ) ).toFixed(2) );
	fCalcularKgHumedad();
	fCalcularKgImpureza();
	fCalcularPesoAcondicionado();
	if ( $('#txtPesoNetoExt').val() != '0.00' )
	{
		fDiferenciaPeso( $('#txtPesoNeto').val() , $('#txtPesoNetoExt').val() );
	}
}

function fCalcularKgHumedad()
{
	var PesoNeto = parseFloat( $('#txtPesoNeto').val() );
	var Humedad = parseFloat( $('#txtHumedadPor').val() );
	$('#txtKgHumedad').val( ( ( PesoNeto * (Humedad - 12) ) / 88 ).toFixed(2) );
}

function fCalcularKgImpureza()
{
	var PesoNeto = parseFloat( $('#txtPesoNeto').val() );
	var Impureza = parseFloat( $('#txtImpurezaPor').val() );
	var KGHumedad = parseFloat( $('#txtKgHumedad').val() );
	$('#txtKgImpureza').val( ( ( ( PesoNeto - KGHumedad ) * Impureza ) / 100 ).toFixed(2) );
}

function fCalcularPesoAcondicionado()
{
	var PesoNeto = parseFloat( $('#txtPesoNeto').val() );
	var KGHumedad = parseFloat( $('#txtKgHumedad').val() );
	var KGImpureza = parseFloat( $('#txtKgImpureza').val() );
	$('#txtPesoAcondicionado').val( ( PesoNeto - ( KGHumedad + KGImpureza ) ).toFixed(2) );
}

function fDiferenciaPeso(PesoNetoInt,PesoNetoExt)
{
	if ( isNaN(PesoNetoInt) == false && isNaN(PesoNetoExt) == false ) 
	{
		PesoNetoInt = parseFloat(PesoNetoInt);
		PesoNetoExt = parseFloat(PesoNetoExt);

		var PesoDif = ( PesoNetoExt - PesoNetoInt ).toFixed(2);
		$('#txtPesoDif').val( PesoDif );

		var PesoDifMax = parseFloat($('#txtPesoDifMax').val());

		if ( ( PesoDif > PesoDifMax ) || ( PesoDif < (-PesoDifMax) ) )
		{
			$('#txtPesoDif').removeClass('CampoValido');
			$('#txtPesoDif').addClass('CampoInvalido');
			$('#spanMsjPesoDifRango').css('display','block');
		}
		else
		{
			$('#txtPesoDif').removeClass('CampoInvalido');
			$('#txtPesoDif').addClass('CampoValido');
			$('#spanMsjPesoDifRango').css('display','none');
		}
	}
}

function fValidarPeso(Campo)
{
	if ( document.getElementById('txt' + Campo + 'Sal').disabled == false )
	{
		if ( isNaN( parseFloat( $('#txt' + Campo + 'Sal').val() ) ) == false )
		{
			var Valor = parseFloat( $('#txt' + Campo + 'Sal').val() );
			if ( $('#txtPesoNetoExt').val() != '0.00' && $('#txtAprobacion').val() == '1' )
			{
				CampoRangoMin = ( parseFloat( $('#txt' + Campo + 'Ext').val() ) - parseFloat( $('#txt' + Campo + 'VacDifMax').val() ) ).toFixed(2);
				CampoRangoMax = ( parseFloat( $('#txt' + Campo + 'Ext').val() ) + parseFloat( $('#txt' + Campo + 'VacDifMax').val() ) ).toFixed(2);
			}
			else if ( $('#txtAprobacion').val() == '0' )
			{
				CampoRangoMin = ( parseFloat( $('#txt' + Campo + 'Ent').val() ) - parseFloat( $('#txt' + Campo + 'VacDifMax').val() ) ).toFixed(2);
				CampoRangoMax = ( parseFloat( $('#txt' + Campo + 'Ent').val() ) + parseFloat( $('#txt' + Campo + 'VacDifMax').val() ) ).toFixed(2);
			}
			else
			{
				CampoRangoMin = ( parseFloat( $('#txt' + Campo + 'VacMin').val() ) ).toFixed(2);
				CampoRangoMax = ( parseFloat( $('#txt' + Campo + 'VacMax').val() ) ).toFixed(2);
			}

			/*VALIDO EL RANGO DEL VEHICULO Y EL REMOLQUE*/
			if ( Valor < CampoRangoMin || Valor > CampoRangoMax )
			{
				$('#span' + Campo + 'SalRango').html(CampoRangoMin + ' - ' + CampoRangoMax + ' kg');
				$('#spanMsj' + Campo + 'SalRango').css('display','block');
				return 0;
			}
			else	{
				$('#spanMsj' + Campo + 'SalRango').css('display','none');
				return 1;
			}
		}
		return 0;
	}
	return 1;
}

$('#btnPopUpBoleto').click(function()
{
	var PopUpBoleto;
  PopUpBoleto=window.open('monitorrmp.vis.php?Url=monitorrmp' + '&VentPadre=' + $('#txtUrl').val() ,'Monitor de Recepción de Materia Prima','width=5000, height=2000, top=0, left=0, toolbar=no, location=no, status=no, menubar=no, scrollbar=yes');
  PopUpBoleto.focus();
});

function fPesadaManual()
{
	$('#txtTipoPesada').val('1');
	$('#btnPesadaManual').css('display','none');
	$('#btnPesadaAutomatica').css('display','');
	$('#btnPesoVeh').attr('disabled','disabled');
	$('#btnPesoRem').attr('disabled','disabled');
	$('#txtPesoVehSal').val('');
	$('#txtPesoRemSal').val('0.00');
	if ( $('#txtCodTransitoRecepcionMP').val() != '' )
	{
		$('#txtPesoVehSal').removeAttr('disabled','disabled');
	}
	if ( document.getElementById('chxRemolque').checked == true )
	{
		$('#txtPesoRemSal').val('');
		$('#txtPesoRemSal').removeAttr('disabled','disabled');
	}
	$('#txtPesoTotalSal').val('0.00');
	$('#txtPesoDif').val('0.00');
	$('#txtPesoDif').removeClass('CampoInvalido');
	$('#txtPesoDif').removeClass('CampoValido');
	$('#spanMsjPesoDifRango').css('display','none');
}

function fPesadaAutomatica()
{
	$('#txtTipoPesada').val('0');
	$('#btnPesadaAutomatica').css('display','none');
	$('#btnPesadaManual').css('display','');
	$('#btnPesoVeh').removeAttr('disabled','disabled');
	$('#btnPesoRem').removeAttr('disabled','disabled');
	$('#txtPesoVehSal').val('0.00');
	$('#txtPesoVehSal').attr('disabled','disabled');
	$('#txtPesoRemSal').val('0.00');
	$('#txtPesoRemSal').attr('disabled','disabled');
	$('#txtPesoTotalSal').val('0.00')
	$('#Form').data('formValidation').resetField($('#txtPesoVehEnt'));
	$('#Form').data('formValidation').resetField($('#txtPesoRemEnt'));
	$('#spanMsjPesoVehEntRango').css('display','none');
	$('#spanMsjPesoRemEntRango').css('display','none');
	$('#spanMsjPesoDifRango').css('display','none');
	$('#txtPesoDif').val('0.00')
	$('#txtPesoDif').removeClass('CampoInvalido');
	$('#txtPesoDif').removeClass('CampoValido');
	$('#spanMsjPesoDifRango').css('display','none');
}

$('#btnPesoVeh').click(function()
{
	$.ajax
	({
	    url: '../Modelos/Scripts/PesadaAutomatica.ajax.php',
	    type: 'GET',
	    dataType: 'jsonp',/*para peticiones entre servidores*/
	    jsonp: 'callback',/*nombre de la variable get para reconocer la petición*/
	    error: function(xhr, status, error) {
	        alert("error");
	    },
	    success: function(jsonp) { 
	        $('#txtPesoVehSal').val(jsonp.peso);
	        fPesoTotal();
	        fValidarPeso('PesoVeh');
	    }
  });
});

$('#btnPesoRem').click(function()
{
$.ajax
	({
      url: '../Modelos/Scripts/PesadaAutomatica.ajax.php',
      type: 'GET',
      dataType: 'jsonp',/*para peticiones entre servidores*/
      jsonp: 'callback',/*nombre de la variable get para reconocer la petición*/
      error: function(xhr, status, error) {
          alert("error");
      },
      success: function(jsonp) { 
          $('#txtPesoRemSal').val(jsonp.peso);
          fPesoTotal();
	        fValidarPeso('PesoRem');
      }
  });
});

function fPopUpBoleto()
{
	var PopUpBoleto;
  PopUpBoleto=window.open('monitorrmp.vis.php?Url=monitorrmp' + '&VentPadre=' + $('#txtUrl').val() ,'Monitor de Recepción de Materia Prima','width=5000, height=2000, top=0, left=0, toolbar=no, location=no, status=no, menubar=no, scrollbar=yes');
  PopUpBoleto.focus();
}

/****************************************************************************************************/
/****************************************************************************************************/
/****************************************************************************************************/
/****************************************************************************************************/
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

$('#btnPopUpTransitoRecepcionMP').click(function()
{
	fPopUpTransitoRecepcionMP();
});

$('#btnPopUpConductor').click(function()
{
	var PopUpConductor;
  PopUpConductor=window.open('conductor.vis.php?Url=conductor' + '&VentPadre=' + $('#txtUrl').val() ,'Conductor','width=5000, height=2000, top=0, left=0, toolbar=no, location=no, status=no, menubar=no, scrollbar=yes');
  PopUpConductor.focus();
});

$('#btnPopUpVehiculo').click(function()
{
	var PopUpVehiculo;
  PopUpVehiculo=window.open('vehiculo.vis.php?Url=vehiculo' + '&VentPadre=' + $('#txtUrl').val() ,'Vehículo','width=5000, height=2000, top=0, left=0, toolbar=no, location=no, status=no, menubar=no, scrollbar=yes');
  PopUpVehiculo.focus();
});

$('#chxRemolque').change(function()
{
	if ( document.getElementById('chxRemolque').checked == true && $('#txtTipoPesada').val() == '1' )
	{
		$('#txtPesoRemEnt').removeAttr('disabled');
		$('#txtPesoRemEnt').val('');
	}
	else if ( document.getElementById('chxRemolque').checked == false )
	{
		$('#txtPesoRemEnt').attr('disabled','disabled');
		$('#txtPesoRemEnt').val('0.00');
		fPesoTotal();
		$('#Form').data('formValidation').resetField($('#txtPesoRemEnt'));
	}
});

$('#txtPesoVehSal').keyup(function()
{
	fPesoTotal();
	fValidarPeso('PesoVeh');
});

$('#txtPesoRemSal').keyup(function()
{
	fPesoTotal();
	fValidarPeso('PesoRem');
});

$('#txtGuiaSada').focusout(function()
{
	fVerificarUnicidad('GuiaSada','guiasada');
});

$('#txtGuiaProv').focusout(function()
{
	fVerificarUnicidad('GuiaProv','guiaprov');
});

$('#btnPopUpConductor').click(function()
{
	fPopUpBoleto();
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
			PesoVehEnt: {
				row: '.PesoVehEnt',
				validators: {
					regexp: {
						regexp: /^[0-9]{1,6}[.]{1,1}[0-9]{1,2}$/,
						message: 'Ingrese el peso con decimales (.)'
					},
					notEmpty: {
						message: ''
					}
				}
			},
			PesoRemEnt: {
				row: '.PesoRemEnt',
				validators: {
					regexp: {
						regexp: /^[0-9]{1,6}[.]{1,1}[0-9]{1,2}$/,
						message: 'Ingrese el peso con decimales (.)'
					},
					notEmpty: {
						message: ''
					}
				}
			},
			PesoTotalEnt: {
				row: '.PesoTotalEnt',
				validators: {
					notEmpty: {
						message: ''
					}
				}
			}
		}
	})
});

//setTimeout(function(){ fTablaAjax(); }, 2000);