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

var Datos='';

if ( $('#txtVentPadre').val() == 'analisisrecepciomp' )
{
	document.getElementById('radAnalisisE').checked = true;
}
else if ( $('#txtVentPadre').val() == 'boletosalidarmp' )
{
	document.getElementById('radBoletoS').checked = true;
}
else if ( $('#txtVentPadre').val() == 'recepcionmp' )
{
	document.getElementById('radRecepcion').checked = true;
}

function fRadioProceso()
{
	if ( document.getElementById('radAnalisisR').checked == true )
	{
		Proceso = 'AnalisisRecepcionMP';
		$('#divAnalisisBusq').css('display','none');
		$('#spanTituloModalBusq').html('Boleto de Entrada');
		$('#cmbParamBusq').html('<option value="cód. de boleto">CÓD. DE BOLETO</option><option value="cód. de tránsito">CÓD. DEL TRÁNSITO</option><option value="cód. de análisis externos">CÓD. DE ANÁLISIS EXTERNOS</option>');
	}
	else if ( document.getElementById('radBoletoS').checked == true )
	{
		Proceso = 'BoletoSalida';
		$('#divAnalisisBusq').css('display','');
		$('#spanTituloModalBusq').html('Análisis de Recepción de M.P.');
		$('#cmbParamBusq').html('<option value="cód. análisis" selected>CÓDIGO DE ANÁLISIS</option><option value="cód. tránsito">CÓDIGO DE TRÁNSITO</option>');
	}
	else if ( document.getElementById('radRecepcion').checked == true )
	{
		Proceso = 'RecepcionMP';
		$('#divAnalisisBusq').css('display','none');
		$('#spanTituloModalBusq').html('Recepción de Materia Prima');
		$('#cmbParamBusq').html('<option value="cód. de boleto" selected>CÓD. DE BOLETO</option><option value="cód. de tránsito">CÓD. DEL TRÁNSITO</option><option value="cód. de análisis externos">CÓD. DE ANÁLISIS EXTERNOS</option><option value="cód. de análisis de recepción">CÓD. DE ANÁLISIS DE RECEPCIÓN</option>');
	}
}

fRadioProceso();

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
	$('#cmbParamBusq').val('codigo');
	$('#cmbEvaluacionBusq').val( '' );
	$('#cmbClaseBusq').val( '' );
	$('#txtFechaDesdeBusq').val('');
	$('#txtFechaHastaBusq').val('');
	$('#txtBusqueda').focus();
	$('#txtBusqueda').val('');
	$('#txtBusqueda').attr('data-content','Buscar por código');
	$('#txtBusqueda').popover('show');
}

/*ENVIA DATOS AL SCRIPT CON LA TABLA*/
function fTablaAjax()
{
	if ( document.getElementById('radAnalisisR').checked == true )
	{
		fBuscarBoletoE();
	}
	else if ( document.getElementById('radBoletoS').checked == true )
	{
		fBuscarAnalisisR();
	}
	else if ( document.getElementById('radRecepcion').checked == true )
	{
		fBuscarBoletoS();
	}
}

function fBuscarBoletoE()
{
	var xmlhttp;
	var ParamBusq = $('#cmbParamBusq').val();
	var Campo = $('#txtBusqueda').val();
	var VentPadre = $('#txtVentPadre').val();
	var Pagina = $('#txtPagina').val();
	var TamanoPagina = $('#txtTamanoPagina').val();
	var Estatus = '1';
	var IdMotivoCambioE = '';
	var IdMateriaPrima = $('#cmbIdMateriaPrimaBusq').val();
	var FechaDesde = $('#txtFechaDesdeBusq').val();
	var FechaHasta = $('#txtFechaHastaBusq').val();
	var FlujoProceso = '2';
	var IdProveedor = $('#cmbIdProveedorBusq').val();
	var IdTipoVehiculo = $('#cmbIdTipoVehiculoBusq').val();
	var TipoPesada = '';
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
	xmlhttp.open('POST','../Modelos/Scripts/MonitorRMP.ajax.php',true);
	xmlhttp.setRequestHeader('Content-type','application/x-www-form-urlencoded');
	/*DATOS A ENVIAR AL SCRIPT DE LA TABLA*/
	xmlhttp.send('Proceso=' + Proceso + '&ParamBusq=' + ParamBusq + '&Campo=' + Campo + '&Pagina=' + Pagina + '&TamanoPagina=' + TamanoPagina + '&VentPadre=' + VentPadre + '&Estatus=' + Estatus + '&IdMotivoCambioE=' + IdMotivoCambioE + '&IdMateriaPrima=' + IdMateriaPrima + '&FechaDesde=' + FechaDesde + '&FechaHasta=' + FechaHasta + '&FlujoProceso=' + FlujoProceso + '&IdProveedor=' + IdProveedor + '&IdTipoVehiculo=' + IdTipoVehiculo + '&TipoPesada=' + TipoPesada + '&IdVehiculo=' + IdVehiculo + '&IdConductor=' + IdConductor);
}

function fBuscarAnalisisR()
{
	var xmlhttp;
	var ParamBusq = $('#cmbParamBusq').val();
	var Campo = $('#txtBusqueda').val();
	var Formulario = $('#txtFormulario').val();
	var VentPadre = $('#txtVentPadre').val();
	var Pagina = $('#txtPagina').val();
	var TamanoPagina = $('#txtTamanoPagina').val();
	var Estatus = '1';
	var IdMotivoCambioE = '';
	var IdMateriaPrima = $('#cmbIdMateriaPrimaBusq').val();
	var FechaDesde = $('#txtFechaDesdeBusq').val();
	var FechaHasta = $('#txtFechaHastaBusq').val();
	var Clase = $('#cmbClaseBusq').val();
	var Evaluacion = $('#cmbEvaluacionBusq').val();
	var FlujoProceso = '3';
	var IdProveedor = $('#cmbIdProveedorBusq').val();
	var IdConductor = $('#cmbIdConductorBusq').val();
	var IdVehiculo = $('#cmbIdVehiculoBusq').val();

	var Campo = $('#txtBusqueda').val();

	/*SI ES VENTANA EMERGENTE, ABIERTA POR EL FORMULARIO DE BOLETO DE ENTRADA (RMP),
	ENTONCES MUESTRO LOS ANALISIS RELACIONADOS CON EL TRÁNSITO SELECCIONADO*/
	if ( VentPadre == 'boleto' )
	{
		Campo = $('#txtIdBoleto').val();
		ParamBusq = 'boleto';
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
	xmlhttp.send('ParamBusq=' + ParamBusq + '&Campo=' + Campo + '&Pagina=' + Pagina + '&TamanoPagina=' + TamanoPagina + '&VentPadre=' + VentPadre + '&Estatus=' + Estatus + '&IdMotivoCambioE=' + IdMotivoCambioE + '&IdMateriaPrima=' + IdMateriaPrima + '&FechaDesde=' + FechaDesde + '&FechaHasta=' + FechaHasta + '&Clase=' + Clase + '&Evaluacion=' + Evaluacion + '&FlujoProceso=' + FlujoProceso + '&IdProveedor=' + IdProveedor + '&IdConductor=' + IdConductor + '&IdVehiculo=' + IdVehiculo);
}

function fBuscarBoletoS()
{
	var xmlhttp;
	var ParamBusq = $('#cmbParamBusq').val();
	var Campo = $('#txtBusqueda').val();
	var Formulario = $('#txtFormulario').val();
	var VentPadre = $('#txtVentPadre').val();
	var Pagina = $('#txtPagina').val();
	var TamanoPagina = $('#txtTamanoPagina').val();
	var Estatus = '1';
	var IdMotivoCambioE = '';
	var IdMateriaPrima = $('#cmbIdMateriaPrimaBusq').val();
	var FechaDesde = $('#txtFechaDesdeBusq').val();
	var FechaHasta = $('#txtFechaHastaBusq').val();
	var FlujoProceso = '4';
	var IdProveedor = $('#cmbIdProveedorBusq').val();
	var IdConductor = $('#cmbIdConductorBusq').val();
	var IdVehiculo = $('#cmbIdVehiculoBusq').val();
	var IdTipoVehiculo = $('#cmbIdTipoVehiculoBusq').val();
	var TipoPesada = '';
	var Campo = $('#txtBusqueda').val();
	
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

/****************************************************************************************************/
/****************************************************************************************************/
/****************************************************************************************************/
/*ENVIAR DATOS*/
/****************************************************************************************************/
/****************************************************************************************************/
/****************************************************************************************************/

function fEnviarDatos()
{
	if ( document.getElementById('radAnalisisR').checked == true )
	{
		fEnviarDatosBoleto();
	}
	else if ( document.getElementById('radBoletoS').checked == true )
	{
		fEnviarDatosAnalisis();
	}
	else if ( document.getElementById('radRecepcion').checked == true )
	{
		fEnviarDatosRecepcionMP();
	}
}

function fEnviarDatosBoleto()
{
	opener.$('#txtIdBoleto').val(Datos.idboleto);
	opener.$('#txtCodBoleto').val(Datos.idboleto);
	opener.$('#txtMateriaPrima').val(Datos.materiaprima.replace(/\+/g," "));
	opener.$('#txtRazonSocialProv').val(Datos.razonsocialprov.replace(/\+/g," "));
	opener.$('#txtIdMateriaPrima').val(Datos.idmateriaprima);
	opener.$('#txtIdConductor').val(Datos.idconductor);
	opener.$('#txtCedulaCond').val(Datos.nacionalidadcond + '-' +Datos.cedulacond);
	opener.$('#txtNombresCond').val(Datos.nombrecond.replace(/\+/g," ") + ' ' + Datos.apellidocond.replace(/\+/g," "));
	opener.$('#txtIdVehiculo').val(Datos.idvehiculo);
	opener.$('#txtPlacaVeh').val(Datos.placaveh);
	opener.$('#txtTipoVehiculo').val(Datos.tipovehiculo.replace(/\+/g," "));
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
	opener.$('.EF2').removeAttr('disabled');
	window.opener.fEnviarDatosBoletoExtra();
	window.close();
}

function fEnviarDatosAnalisis()
{
	opener.$('#txtIdBoleto').val(Datos.idboleto);
	opener.$('#txtCodBoletoEntrada').val(Datos.idboleto);
	opener.$('#txtGuiaSADA').val(Datos.guiasada);
	opener.$('#txtGuiaProv').val(Datos.guiaprov);
	opener.$('#txtIdMateriaPrima').val(Datos.idmateriaprima);
	opener.$('#txtMateriaPrima').val(Datos.materiaprima.replace(/\+/g," "));
	opener.$('#txtRazonSocialProv').val(Datos.razonsocialprov.replace(/\+/g," "));
	opener.$('#txtIdMateriaPrima').val(Datos.idmateriaprima);
	opener.$('#txtIdConductor').val(Datos.idconductor);
	opener.$('#txtCedulaCond').val(Datos.nacionalidadcond + '-' +Datos.cedulacond);
	opener.$('#txtNombresCond').val(Datos.nombrecond.replace(/\+/g," ") + ' ' + Datos.apellidocond.replace(/\+/g," "));
	opener.$('#txtIdVehiculo').val(Datos.idvehiculo);
	opener.$('#txtPlacaVeh').val(Datos.placaveh);
	opener.$('#txtTipoVehiculo').val(Datos.tipovehiculo.replace(/\+/g," "));
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
	var Fecha = Datos.fechaent.split("-");
	opener.$('#txtFechaEnt').val( Fecha[2] + '-' + Fecha[1] + '-' + Fecha[0] );
	opener.$('#txtHoraEnt').val(Datos.horaent.replace(/\+/g," "));
	opener.$('#txtPesoVehEnt').val(Datos.pesovehent);
	opener.$('#txtPesoRemEnt').val(Datos.pesorement);
	//opener.$('#txtPesoTotalEnt').val( (parseFloat(Datos.pesovehent) + parseFloat(Datos.pesorement)).toFixed(2) );

	if ( Datos.analisisext == '1' )	{
		opener.$('#divPesoExt').css('display','');
		opener.$('#txtPesoVehExt').val(Datos.pesovehext);
		opener.$('#txtPesoRemExt').val(Datos.pesoremext);
		opener.$('#txtPesoNetoExt').val(Datos.pesonetoext);
	}
	else if ( Datos.analisisext == '0' )	{
		opener.$('#divPesoExt').css('display','none');
		opener.$('#txtPesoVehExt').val('0.00');
		opener.$('#txtPesoRemExt').val('0.00');
		opener.$('#txtPesoNetoExt').val('0.00');
	}

	opener.$('#divAprobacion').css('display','');
	if ( Datos.aprobacion == '1' )	{
		opener.$('#spanRechazado').css('display','none');
		opener.$('#spanAprobado').css('display','');
		opener.$('#txtAprobacion').val('1');
		opener.$('#divPesoNeto').css('display','');
	}
	else if ( Datos.aprobacion == '0' )	{
		opener.$('#spanAprobado').css('display','none');
		opener.$('#spanRechazado').css('display','');
		opener.$('#txtAprobacion').val('0');
		opener.$('#divPesoExt').css('display','none');
		opener.$('#divPesoNeto').css('display','none');
	}
	opener.$('.EF2').removeAttr('disabled');
	window.opener.fPesoTotal();
	window.opener.fEnviarDatosBoletoExtra();
	window.close();
}

function fEnviarDatosRecepcionMP()
{
	opener.$('#txtIdBoleto').val(Datos.idboleto);
	opener.$('#txtCodBoleto').val(Datos.idboleto);
	opener.$('#txtGuiaSADA').val(Datos.guiasada);
	opener.$('#txtGuiaProv').val(Datos.guiaprov);
	opener.$('#txtIdMateriaPrima').val(Datos.idmateriaprima);
	opener.$('#txtMateriaPrima').val(Datos.materiaprima.replace(/\+/g," "));
	opener.$('#txtRazonSocialProv').val(Datos.razonsocialprov.replace(/\+/g," "));
	opener.$('#txtCedulaCond').val(Datos.nacionalidadcond + '-' +Datos.cedulacond);
	opener.$('#txtNombresCond').val(Datos.nombrecond.replace(/\+/g," ") + ' ' + Datos.apellidocond.replace(/\+/g," "));
	opener.$('#txtPlacaVeh').val(Datos.placaveh);
	opener.$('#txtTipoVehiculo').val(Datos.tipovehiculo.replace(/\+/g," "));
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
	//opener.$('#txtPesoTotalEnt').val( (parseFloat(Datos.pesovehent) + parseFloat(Datos.pesorement)).toFixed(2) );

	/*ANÁLISIS DE RECEPCIÓN*/
	opener.$('#txtIdAR').val(Datos.idanalisisrecepcionmp);
	var Fecha = Datos.fechaanalisis.split("-");
	opener.$('#txtFechaAR').val( Fecha[2] + '-' + Fecha[1] + '-' + Fecha[0] );
	opener.$('#txtHoraAR').val(Datos.horaanalisis.replace(/\+/g," "));
	opener.$('#txtHumedadResAR').val(Datos.humedad);
	opener.$('#txtImpurezaResAR').val(Datos.impureza);
	opener.$('#txtGranoDanadoResAR').val(Datos.granodanado);
	opener.$('#txtGranoPartidoResAR').val(Datos.granopartido);
	opener.$('#txtGranoQuemadoResAR').val(Datos.granoquemado);
	opener.$('#txtAflatoxinaAR').val(Datos.aflatoxina);
	if ( Datos.infestacion == '1' )	{
		opener.$('#txtInfestacionAR').val('SI');
		opener.$('#txtInfestacionAR').removeClass('CampoValido');
		opener.$('#txtInfestacionAR').addClass('CampoInvalido');
	}
	else if ( Datos.infestacion == '0' )	{
		opener.$('#txtInfestacionAR').val('NO');
		opener.$('#txtInfestacionAR').removeClass('CampoInvalido');
		opener.$('#txtInfestacionAR').addClass('CampoValido');
	}

	var PesoNetoAR = ( ( ( parseFloat(Datos.pesovehent) + parseFloat(Datos.pesorement) ) - ( parseFloat(Datos.pesovehsal) + parseFloat(Datos.pesoremsal) ) ) ).toFixed(2);
	opener.$('#txtPesoNetoAR').val( PesoNetoAR );
	opener.$('#txtPesoNetoRest').val( PesoNetoAR );

	if ( Datos.analisisext == '1' )	{
		opener.$('#divDatosExt').css('display','');
		opener.$('#txtPesoNetoExt').val(Datos.pesonetoext);
		/*ANÁLISIS EXTERNOS*/
		opener.$('#txtIdAE').val(Datos.idanalisisexternomp);
		Fecha = Datos.fechaext.split("-");
		opener.$('#txtFechaAE').val( Fecha[2] + '-' + Fecha[1] + '-' + Fecha[0] );
		opener.$('#txtHoraAE').val(Datos.horaext.replace(/\+/g," "));
		opener.$('#txtHumedadResAE').val(Datos.humedadext);
		opener.$('#txtImpurezaResAE').val(Datos.impurezaext);
		opener.$('#txtGranoDanadoResAE').val(Datos.granodanadoext);
		opener.$('#txtGranoPartidoResAE').val(Datos.granopartidoext);
		opener.$('#txtGranoQuemadoResAE').val(Datos.granoquemadoext);
		opener.$('#txtAflatoxinaAE').val(Datos.aflatoxinaext);
		if ( Datos.infestacionext == '1' )	{
			opener.$('#txtInfestacionAE').val('SI');
			opener.$('#txtInfestacionAE').removeClass('CampoValido');
			opener.$('#txtInfestacionAE').addClass('CampoInvalido');
		}
		else if ( Datos.infestacionext == '0' )	{
			opener.$('#txtInfestacionAE').val('NO');
			opener.$('#txtInfestacionAE').removeClass('CampoInvalido');
			opener.$('#txtInfestacionAE').addClass('CampoValido');
		}
		opener.$('#txtPesoNetoAE').val(Datos.pesonetoext);
	}
	else if ( Datos.analisisext == '0' )	{
		opener.$('#divPesoExt').css('display','none');
		opener.$('#txtPesoNetoExt').val('0.00');
	}

	opener.$('.EF2').removeAttr('disabled');
	opener.$('#spanPesoNetoRest').html( PesoNetoAR );
	opener.$('#tbDetalle').html( '' );
	window.opener.fBuscarParametros(Datos.analisisext);
	window.opener.fEnviarDatosBoletoExtra();
	window.close();
}

/****************************************************************************************************/
/****************************************************************************************************/
/****************************************************************************************************/
/*EVENTOS*/
/****************************************************************************************************/
/****************************************************************************************************/
/****************************************************************************************************/


$('[name=radFlujoProceso]').change(function(){
	fRadioProceso();
	fTablaAjax();
});

$('#RangoFechaBusq').datepicker({
    inputs: $('.RangoFechaBusq'),
    autoclose: true,
		todayHighlight: true,
		format: 'dd-mm-yyyy',
		todayBtn: true
});

$('#btnPopUpTransitoRecepcionMP').click(function()
{
	var PopUpTransitoRecepcionMP;
  PopUpTransitoRecepcionMP=window.open('transitorecepcionmp.vis.php?Url=transitorecepcionmp' + '&VentPadre=' + $('#txtUrl').val() ,'Tránsito para la Recepción de Materia Prima','width=5000, height=2000, top=0, left=0, toolbar=no, location=no, status=no, menubar=no, scrollbar=yes');
  PopUpTransitoRecepcionMP.focus();
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

$('[name=Infestacion]').change(function()
{
	if ( document.getElementById('radInfestacionSi').checked == true )
	{
		$('#divInfestacion').slideDown('fast');
	}
	else
	{
		$('#divInfestacion').slideUp('fast');
	}
	fEvaluacion();
});

$('#chxRemolque').change(function()
{
	if ( document.getElementById('chxRemolque').checked == true )
	{
		$('#txtPesoRem').removeAttr('disabled');
		$('#txtPesoRem').val('');
	}
	else if ( document.getElementById('chxRemolque').checked == false )
	{
		$('#txtPesoRem').attr('disabled','disabled');
		$('#txtPesoRem').val('0.00');
		fPesoTotal();
	}
});

$('#txtPesoVeh').keyup(function()
{
	fPesoTotal();
	fValidarPeso('PesoVeh','PesoVehVac');
});

$('#txtPesoRem').keyup(function()
{
	fPesoTotal();
	fValidarPeso('PesoRem','PesoRemVac');
});

$('#txtPesoNeto').keyup(function()
{
	fCalcularPesoAcondicionado();
	fValidarPeso('PesoNeto','PesoNeto');
});

/*EVENTOS DE LOS ANALISIS*/
$('#txtHumedadRes').keyup(function()
{
	fCalcularPorc( $(this).val() , 'Humedad' );
	fCalcularPesoAcondicionado();
});

$('#txtImpurezaRes').keyup(function()
{
	fCalcularPorc( $(this).val() , 'Impureza' );
	fCalcularPesoAcondicionado();
});

$('#txtGranoDanadoRes').keyup(function()
{
	fCalcularPorc( $(this).val() , 'GranoDanado' );
	fCalcularClase();
});

$('#txtGranoPartidoRes').keyup(function()
{
	fCalcularPorc( $(this).val() , 'GranoPartido' );
});

$('#txtGranoQuemadoRes').keyup(function()
{
	fCalcularPorc( $(this).val() , 'GranoQuemado' );
});

$('#txtGranoCristalizadoRes').keyup(function()
{
	fCalcularPorc( $(this).val() , 'GranoCristalizado' );
});

$('#txtMezclaColorRes').keyup(function()
{
	fCalcularPorc( $(this).val() , 'MezclaColor' );
});

$('#txtAflatoxinaRes').keyup(function()
{
	fCalcularAflatoxina( $(this).val() );
});

$('#btnVolverTrans').click(function()
{
	window.opener.fPopUpTransitoRecepcionMP();
	window.close();
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
			},
			PesoRem: {
				row: '.PesoRem',
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
			PesoNeto: {
				row: '.PesoNeto',
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
			Humedad: {
				row: '.HumedadRes',
				validators: {
					regexp: {
						regexp: /^[0-9]{1,4}$/,
						message: 'Sólo números'
					},
					notEmpty: {
						message: ''
					}
				}
			},
			Impureza: {
				row: '.ImpurezaRes',
				validators: {
					regexp: {
						regexp: /^[0-9]{1,4}$/,
						message: 'Sólo números'
					},
					notEmpty: {
						message: ''
					}
				}
			},
			GranoDanado: {
				row: '.GranoDanadoRes',
				validators: {
					regexp: {
						regexp: /^[0-9]{1,4}$/,
						message: 'Sólo números'
					},
					notEmpty: {
						message: ''
					}
				}
			},
			GranoPartido: {
				row: '.GranoPartidoRes',
				validators: {
					regexp: {
						regexp: /^[0-9]{1,4}$/,
						message: 'Sólo números'
					},
					notEmpty: {
						message: ''
					}
				}
			},
			GranoQuemado: {
				row: '.GranoQuemadoRes',
				validators: {
					regexp: {
						regexp: /^[0-9]{1,4}$/,
						message: 'Sólo números'
					},
					notEmpty: {
						message: ''
					}
				}
			},
			GranoCristalizado: {
				row: '.GranoCristalizadoRes',
				validators: {
					regexp: {
						regexp: /^[0-9]{1,4}$/,
						message: 'Sólo números'
					},
					notEmpty: {
						message: ''
					}
				}
			},
			MezclaColor: {
				row: '.MezclaColorRes',
				validators: {
					regexp: {
						regexp: /^[0-9]{1,4}$/,
						message: 'Sólo números'
					},
					notEmpty: {
						message: ''
					}
				}
			},
			Aflatoxina: {
				row: '.Aflatoxina',
				validators: {
					regexp: {
						regexp: /^[0-9]{1,2}[.]{1,1}[0-9]{1,1}$/,
						message: 'Formato: 10.0 (.)'
					},
					notEmpty: {
						message: ''
					}
				}
			},
			PesoEspecifico: {
				row: '.PesoEspecifico',
				validators: {
					regexp: {
						regexp: /^[0-9]{1,4}$/,
						message: 'Ingrese el peso en gramos'
					},
					notEmpty: {
						message: ''
					}
				}
			},
			Infestacion: {
				row: '.Infestacion',
				validators: {
					notEmpty: {
						message: 'Seleccione una opción'
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