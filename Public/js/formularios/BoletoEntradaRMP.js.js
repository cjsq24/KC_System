$(document).ready(function()
{
	$('#cmbIdProveedorBusq').select2();
	$('#cmbIdVehiculoBusq').select2();
	$('#cmbIdConductorBusq').select2();
});

$('#ModalBusq').on('hidden.bs.modal', function()
{
	$('#cmbIdProveedorBusq').select2("close");
	$('#cmbIdVehiculoBusq').select2("close");
	$('#cmbIdConductorBusq').select2("close");
});

var Datos='';

function fLlenarCampos(Datos)
{
	$('#txtIdBoleto').val(Datos.idboleto);
	$('#txtCodBoletoEntradaRMP').val(Datos.idboleto);
	var Fecha = Datos.fechaent.split("-");
	$('#txtFecha').val( Fecha[2] + '-' + Fecha[1] + '-' + Fecha[0] );
	$('#txtHora').val(Datos.horaent.replace(/\+/g," "));
	$('#txtTipoPesada').val(Datos.tipopesadaent);
	$('#txtCodTransitoRecepcionMP').val(Datos.idtransitorecepcionmp);
	$('#txtIdTransitoRecepcionMP').val(Datos.idtransitorecepcionmp);
	$('#txtIdAnalisisExternoMP').val(Datos.idanalisisexternomp);
	$('#txtGuiaSada').val(Datos.guiasada);
	$('#txtGuiaProv').val(Datos.guiaprov);
	$('#txtRazonSocialProv').val(Datos.razonsocialprov.replace(/\+/g," "));
	$('#txtMateriaPrima').val(Datos.materiaprima.replace(/\+/g," "));
	$('#txtIdConductor').val(Datos.idconductor);
	$('#txtCedulaCond').val(Datos.nacionalidadcond + '-' +Datos.cedulacond);
	$('#txtNombresCond').val(Datos.nombrecond.replace(/\+/g," ") + ' ' + Datos.apellidocond.replace(/\+/g," "));
	$('#txtIdVehiculo').val(Datos.idvehiculo);
	$('#txtPlacaVeh').val(Datos.placaveh);
	$('#txtTipoVehiculo').val(Datos.tipovehiculo.replace(/\+/g," "));
	$('#txtRemolqueVeh').val(Datos.remolqueveh);
	if ( Datos.remolque == '1' )
	{
		document.getElementById('chxRemolque').checked = true;
		$('#labelRemolque').addClass('active');
	}

	$('#txtPesoVehEnt').val(Datos.pesovehent);
	$('#txtPesoRemEnt').val(Datos.pesorement);
	if ( Datos.idanalisisexternomp != '0' )
	{
		$('#divPesajeExt').css('display','');
		$('#labelEnt').css('display','');
		$('#txtPesoTotalExt').val( ( parseFloat(Datos.pesovehext) + parseFloat(Datos.pesoremext) + parseFloat(Datos.pesonetoext) ).toFixed(2) );
	}
	else
	{
		$('#divPesajeExt').css('display','none');
		$('#labelEnt').css('display','none');
	}
	$('#txtObservacion').val(Datos.observacionent.replace(/\+/g," "));
	$('#txtEstatus').val(Datos.estatus);

	if( Datos.tipopesadaent == '1' )
	{
		$('#txtTipoPesada2').val('MANUAL');
	}
	else if( Datos.tipopesadaent == '0' )
	{
		$('#txtTipoPesada2').val('AUTOMÁTICA');
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
		cache: false, type: 'POST', dataType: 'json', url:'../Controladores/BoletoEntradaRMP.con.php',
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
			else if( ( response.Resultado == 'existe' ) && ( Operacion == 'verificar_guiasada' ||  Operacion == 'verificar_guiaprov' ) )
			{
				swal({ title: '¡ALERTA!', text: response.Mensaje, type: 'info', showCancelButton: true, cancelButtonText: 'NO', confirmButtonColor: '#DD6B55', confirmButtonText: 'SI', closeOnConfirm: true },function()	
				{
					fResetBusq();
					if ( Operacion == 'verificar_guiaprov' )
					{
						fParametrosBusq('guia de prov.');
						$('#cmbParamBusq').val('guía de prov.');
						$('#txtBusqueda').val($('#txtGuiaProv').val());
					}
					else if ( Operacion == 'verificar_guiasada' )
					{
						fParametrosBusq('guia sada');
						$('#cmbParamBusq').val('guía sada');
						$('#txtBusqueda').val($('#txtGuiaSada').val());
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
						if (isConfirm)
						{
							fResetBusq();
							$('#txtBusqueda').val( response.IdBoleto );
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
			$('.EF2').removeAttr('disabled');
			/*EJECUTO LA FUNCION AJAX*/
			$('#txtPesoVehEnt').removeAttr('disabled');
			$('#txtPesoRemEnt').removeAttr('disabled');
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
	$('.EFPeso').val('0.00');
	$('#divPesajeExt').css('display','none');
	$('#labelEnt').css('display','none');
	fPesadaAutomatica();
	$('#txtPesoVehEnt').attr('disabled','disabled');
	$('#txtPesoRemEnt').attr('disabled','disabled');
	$('#btnPopUpTransitoRecepcionMP').removeAttr('disabled');
	$('#fieldsetEstatus').css('display','none');
}

function fConsultaExtra()
{
	$('.EF2').attr('disabled','disabled');
	$('#txtPesoVehEnt').attr('disabled','disabled');
	$('#txtPesoRemEnt').attr('disabled','disabled');
	$('#btnPopUpTransitoRecepcionMP').attr('disabled','disabled');
	$('#btnPopUpConductor').attr('disabled','disabled');
	$('#btnPopUpVehiculo').attr('disabled','disabled');
}
function fModificacionExtra()
{
	$('#btnPopUpTransitoRecepcionMP').removeAttr('disabled');
	if ( Datos.idanalisisexternomp == 0 )
	{
		$('#btnPopUpConductor').removeAttr('disabled');
		$('#btnPopUpVehiculo').removeAttr('disabled');
	}
	else
	{
		$('#btnPopUpConductor').attr('disabled','disabled');
		$('#btnPopUpVehiculo').attr('disabled','disabled');
	}

	if ( Datos.remolque == 0 )
	{
		$('#txtPesoRemEnt').attr('disabled','disabled');
	}

	if ( $('#txtRemolqueVeh').val() == '1' )
	{
		$('#labelRemolque').removeAttr('disabled');
	}
}
function fActivacionExtra()
{
	$('.EF2').attr('disabled','disabled');
	$('#txtPesoVehEnt').attr('disabled','disabled');
	$('#txtPesoRemEnt').attr('disabled','disabled');
	$('#btnPopUpTransitoRecepcionMP').attr('disabled','disabled');
	$('#btnPopUpConductor').attr('disabled','disabled');
	$('#btnPopUpVehiculo').attr('disabled','disabled');
	$('#btnPesoVeh').attr('disabled','disabled');
	$('#btnPesoRem').attr('disabled','disabled');
}
function fDesactivacionExtra()
{
	$('.EF2').attr('disabled','disabled');
	$('#txtPesoVehEnt').attr('disabled','disabled');
	$('#txtPesoRemEnt').attr('disabled','disabled');
	$('#btnPopUpTransitoRecepcionMP').attr('disabled','disabled');
	$('#btnPopUpConductor').attr('disabled','disabled');
	$('#btnPopUpVehiculo').attr('disabled','disabled');
	$('#btnPesoVeh').attr('disabled','disabled');
	$('#btnPesoRem').attr('disabled','disabled');
}
function fResetFormExtra()
{
	$('#divCabeceraForm').css('display','');
	$('.EF2').removeAttr('disabled');
	$('#txtPesoVehEnt').removeAttr('disabled');
	$('#txtPesoRemEnt').removeAttr('disabled');
	$('#labelRemolque').attr('disabled','disabled');
	$('#labelRemolque').removeClass('active');
	$('#chxRemolque').removeAttr('checked');
	$('#txtRemolqueVeh').val('');
	$('.EF3').val('');
	$('#txtPesoTotalEnt').val('0.00');
	$('#txtPesoTotalSal').val('0.00');
	$('#fieldsetEstatus').css('display','');
	$('#spanMsjPesoDifRango').css('display','none');
	$('#spanMsjPesoVehEntRango').css('display','none');
	$('#spanMsjPesoRemEntRango').css('display','none');
}
function fEnviarDatosTransitoExtra()
{
	$('#Form').data('formValidation').updateStatus($('#txtCodigo'), 'NOT_VALIDATED').validateField($('#txtCodigo'));
	$('#Form').data('formValidation').updateStatus($('#txtMateriaPrima'), 'NOT_VALIDATED').validateField($('#txtMateriaPrima'));
	$('#Form').data('formValidation').updateStatus($('#txtRazonSocialProv'), 'NOT_VALIDATED').validateField($('#txtRazonSocialProv'));
	$('#txtPesoRemEnt').attr('disabled','disabled');
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
		$('#txtPesoRemEnt').val('0.00');
		$('#txtPesoRemEnt').attr('disabled','disabled');
	}
}

/**/

/*VALIDAR SI SE HIZO ALGUN CAMBIO EN EL FORMULARIO PARA MODIFICAR*/
function fValidModificacion()
{
	if($('#txtIdTransitoRecepcionMP').val() == Datos.idtransitorecepcionmp && $('#txtIdAnalisisExternoMP').val() == Datos.idanalisisexternomp && $('#txtGuiaProv').val() == Datos.guiaprov && $('#txtGuiaSada').val() == Datos.guiasada && $('#txtIdConductor').val() == Datos.idconductor && $('#txtIdVehiculo').val() == Datos.idvehiculo && $('#txtPesoVehEnt').val() == Datos.pesovehent && $('#txtPesoRemEnt').val() == Datos.pesorement && $('#txtObservacion').val() == Datos.observacionent.replace(/\+/g," ") )	{
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
	var IdTipoVehiculo = $('#cmbIdTipoVehiculoBusq').val();
	var TipoPesada = $('#cmbTipoPesadaBusq').val();
	var IdVehiculo = $('#cmbIdVehiculoBusq').val();
	var IdConductor = $('#cmbIdConductorBusq').val();
	
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
	xmlhttp.open('POST','../Modelos/Scripts/BoletoEntradaRMP.ajax.php',true);
	xmlhttp.setRequestHeader('Content-type','application/x-www-form-urlencoded');
	/*DATOS A ENVIAR AL SCRIPT DE LA TABLA*/
	xmlhttp.send('ParamBusq=' + ParamBusq + '&Campo=' + Campo + '&Pagina=' + Pagina + '&TamanoPagina=' + TamanoPagina + '&VentPadre=' + VentPadre + '&Estatus=' + Estatus + '&IdMotivoCambioE=' + IdMotivoCambioE + '&IdMateriaPrima=' + IdMateriaPrima + '&FechaDesde=' + FechaDesde + '&FechaHasta=' + FechaHasta + '&FlujoProceso=' + FlujoProceso + '&IdProveedor=' + IdProveedor + '&IdTipoVehiculo=' + IdTipoVehiculo + '&TipoPesada=' + TipoPesada + '&IdVehiculo=' + IdVehiculo + '&IdConductor=' + IdConductor);
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
	ReportePDF=window.open('../Reportes PDF/BoletoEntradaRMP.Rep.pdf.php?Url=boletoentradarmp&ParamBusq=' + ParamBusq + '&Campo=' + Campo + '&VentPadre=' + VentPadre + '&Estatus=' + Estatus + '&IdMotivoCambioE=' + IdMotivoCambioE + '&IdMateriaPrima=' + IdMateriaPrima + '&FechaDesde=' + FechaDesde + '&FechaHasta=' + FechaHasta + '&FlujoProceso=' + FlujoProceso + '&TipoVehiculo=' + TipoVehiculo + '&IdProveedor=' + IdProveedor ,'Reporte de los Boletos de Entrada de la Recepción de Materia Prima','width=5000, height=2000, top=0, left=0, toolbar=no, location=no, status=no, menubar=no, scrollbar=yes');
	ReportePDF.focus();
}

function fImprimir()
{
	var Imprimir;
	Imprimir=window.open('../Reportes PDF/BoletoEntradaRMP.Imp.pdf.php?Url=boletoentradarmp&IdBoleto=' + Datos.idboleto ,'Boleto de Entrada de Recepción de Materia Prima','width=5000, height=2000, top=0, left=0, toolbar=no, location=no, status=no, menubar=no, scrollbar=yes');
	Imprimir.focus();
}

function fEnviarDatosTransitoAnalisisExtra()
{
	$('#Form').data('formValidation').updateStatus($('#txtCodTransitoRecepcionMP'), 'NOT_VALIDATED').validateField($('#txtCodTransitoRecepcionMP'));
	$('#Form').data('formValidation').updateStatus($('#txtMateriaPrima'), 'NOT_VALIDATED').validateField($('#txtMateriaPrima'));
	$('#Form').data('formValidation').updateStatus($('#txtRazonSocialProv'), 'NOT_VALIDATED').validateField($('#txtRazonSocialProv'));
	$('#labelRemolque').attr('disabled','disabled');
	var PesoTotalEnt = (parseFloat($('#txtPesoVehEnt').val()) + parseFloat($('#txtPesoRemEnt').val())).toFixed(2);
	fDiferenciaPeso(PesoTotalEnt,$('#txtPesoTotalExt').val());
}

/****************************************************************************************/

function fPesoTotal()
{
	var PesoVehiculo;
	var PesoRemolque;
	var PesoNeto;

	if ( $('#txtPesoVehEnt').val() == "" ) {
		PesoVehiculo = 0;
	}
	else {
		PesoVehiculo = parseFloat( $('#txtPesoVehEnt').val() );
	}

	if ( $('#txtPesoRemEnt').val() == "" ) {
		PesoRemolque = 0;
	}
	else {
		PesoRemolque = parseFloat( $('#txtPesoRemEnt').val() );
	}

	if ( $('#txtPesoNeto').val() == "" ) {
		PesoNeto = 0;
	}
	else {
		PesoNeto = parseFloat( $('#txtPesoNeto').val() );
	}

	$('#txtPesoTotalEnt').val( ( PesoVehiculo + PesoRemolque ).toFixed(2) );
	$('#txtPesoTotalSal').val( ( PesoVehiculo + PesoRemolque + PesoNeto ).toFixed(2) );
	fDiferenciaPeso($('#txtPesoTotalEnt').val(),$('#txtPesoTotalExt').val());
}

function fDiferenciaPeso(PesoTotalEnt,PesoTotalExt)
{

	if ( isNaN(PesoTotalEnt) == false && isNaN(PesoTotalExt) == false ) {
		PesoTotalEnt = parseFloat(PesoTotalEnt);
		PesoTotalExt = parseFloat(PesoTotalExt);
	}

	var PesoDif = ( PesoTotalExt - PesoTotalEnt ).toFixed(2);
	$('#txtPesoDif').val( PesoDif );

	var PesoDifMax = parseFloat($('#txtPesoDifMax').val());

	if ( ( PesoDif > PesoDifMax ) || ( PesoDif < (-PesoDifMax) ) )
	{
		$('#txtPesoDif').removeClass('CampoValido');
		$('#txtPesoDif').addClass('CampoInvalido');
		$('#spanPesoDifRango').html( PesoDifMax + ' kg');
		$('#spanMsjPesoDifRango').css('display','block');
	}
	else
	{
		$('#txtPesoDif').removeClass('CampoInvalido');
		$('#txtPesoDif').addClass('CampoValido');
		$('#spanMsjPesoDifRango').css('display','none');
	}
}

function fValidarPeso(Campo)
{
	if ( document.getElementById('txt' + Campo + 'Ent').disabled == false )
	{
		if ( isNaN( parseFloat( $('#txt' + Campo + 'Ent').val() ) ) == false )
		{
			var Valor = parseFloat( $('#txt' + Campo + 'Ent').val() );
			if ( $('#txtIdAnalisisExternoMP').val() != '0' )
			{
				CampoRangoMin = ( parseFloat( $('#txt' + Campo + 'Ext').val() ) + parseFloat( $('#txt' + Campo + 'LleMin').val() ) ).toFixed(2);
				CampoRangoMax = ( parseFloat( $('#txt' + Campo + 'Ext').val() ) + parseFloat( $('#txt' + Campo + 'LleMax').val() ) ).toFixed(2);
			}
			else
			{
				CampoRangoMin = ( parseFloat( $('#txt' + Campo + 'VacMin').val() ) + parseFloat( $('#txt' + Campo + 'LleMin').val() ) ).toFixed(2);
				CampoRangoMax = ( parseFloat( $('#txt' + Campo + 'VacMax').val() ) + parseFloat( $('#txt' + Campo + 'LleMax').val() ) ).toFixed(2);
			}

			/*VALIDO EL RANGO DEL VEHICULO Y EL REMOLQUE*/
			if ( Valor < CampoRangoMin || Valor > CampoRangoMax )
			{
				$('#span' + Campo + 'EntRango').html(CampoRangoMin + ' - ' + CampoRangoMax + ' kg');
				$('#spanMsj' + Campo + 'EntRango').css('display','block');
				return 0;
			}
			else	{
				$('#spanMsj' + Campo + 'EntRango').css('display','none');
				return 1;
			}
		}
		return 0;
	}
	return 1;
}

function fPopUpAnalisisExternoMP()
{
	var fPopUpAnalisisExternoMP;
	fPopUpAnalisisExternoMP=window.open('analisisexternomp.vis.php?Url=analisisexternomp' + '&VentPadre=' + $('#txtUrl').val() + '&IdTransitoRecepcionMP=' + $('#txtIdTransitoRecepcionMP').val() ,'Análisis Externo de Materia Prima','width=5000, height=2000, top=0, left=0, toolbar=no, location=no, status=no, menubar=no, scrollbar=yes');
	fPopUpAnalisisExternoMP.focus();
}

function fPopUpTransitoRecepcionMP()
{
	var PopUpTransitoRecepcionMP;
	PopUpTransitoRecepcionMP=window.open('transitorecepcionmp.vis.php?Url=transitorecepcionmp' + '&VentPadre=' + $('#txtUrl').val() ,'Tránsito para la Recepción de Materia Prima','width=5000, height=2000, top=0, left=0, toolbar=no, location=no, status=no, menubar=no, scrollbar=yes');
	PopUpTransitoRecepcionMP.focus();
}

function fPesadaManual()
{
	$('#txtTipoPesada').val('1');
	$('#btnPesadaManual').css('display','none');
	$('#btnPesadaAutomatica').css('display','');
	$('#btnPesoVeh').attr('disabled','disabled');
	$('#btnPesoRem').attr('disabled','disabled');
	$('#txtPesoVehEnt').val('');
	$('#txtPesoRemEnt').val('0.00');
	if ( $('#txtCodTransitoRecepcionMP').val() != '' )
	{
		$('#txtPesoVehEnt').removeAttr('disabled','disabled');
	}
	if ( $('#txtRemolqueVeh').val() == '1' && document.getElementById('chxRemolque').checked == true )
	{
		$('#txtPesoRemEnt').val('');
		$('#txtPesoRemEnt').removeAttr('disabled','disabled');
	}
	$('#txtPesoTotalEnt').val('0.00')
	$('#txtPesoDif').val('0.00')
}

function fPesadaAutomatica()
{
	$('#txtTipoPesada').val('0');
	$('#btnPesadaAutomatica').css('display','none');
	$('#btnPesadaManual').css('display','');
	$('#btnPesoVeh').removeAttr('disabled','disabled');
	$('#btnPesoRem').removeAttr('disabled','disabled');
	$('#txtPesoVehEnt').val('');
	$('#txtPesoVehEnt').attr('disabled','disabled');
	$('#txtPesoRemEnt').val('0.00');
	$('#txtPesoRemEnt').attr('disabled','disabled');
	$('#txtPesoTotalEnt').val('0.00')
	$('#Form').data('formValidation').resetField($('#txtPesoVehEnt'));
	$('#Form').data('formValidation').resetField($('#txtPesoRemEnt'));
	$('#spanMsjPesoVehEntRango').css('display','none');
	$('#spanMsjPesoRemEntRango').css('display','none');
	$('#spanMsjPesoDifRango').css('display','none');
	$('#txtPesoDif').val('0.00');
	$('#txtPesoDif').removeClass('CampoInvalido');
	$('#txtPesoDif').removeClass('CampoValido');
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
			$('#txtPesoVehEnt').val(jsonp.peso);
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
			$('#txtPesoRemEnt').val(jsonp.peso);
			fPesoTotal();
			fValidarPeso('PesoRem');
		}
	});
});
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

$('#txtPesoVehEnt').keyup(function()
{
	fPesoTotal();
	fValidarPeso('PesoVeh');
});

$('#txtPesoRemEnt').keyup(function()
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
			GuiaSada: {
				row: '.GuiaSada',
				validators: {
					regexp: {
						regexp: /^[0-9]{1,10}$/,
						message: 'Solo dígitos'
					},
					notEmpty: {
						message: ''
					}
				}
			},
			GuiaProv: {
				row: '.GuiaProv',
				validators: {
					regexp: {
						regexp: /^[0-9]{1,10}$/,
						message: 'Solo dígitos'
					},
					notEmpty: {
						message: ''
					}
				}
			},
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