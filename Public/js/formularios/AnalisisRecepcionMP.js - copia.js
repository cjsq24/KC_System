var Datos='';
/*PARÁMETROS DE ANÁLISIS DE MATERIA PRIMA*/
var PAMP = '';

/*ARREGLO CON LOS ANÁLISIS DISPONIBLES*/
var PosAn = 6;/*POSICION MAX DEL ARREGLO*/
var Analisis = ['Humedad','Impureza','GranoDanado','GranoPartido','GranoQuemado','GranoCristalizado','MezclaColor'];

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
		$('#chxRemolque').attr('checked','checked');
		$('#labelRemolque').addClass('active');
	}
	$('#txtHumedadRes').val(Datos.humedad);
	$('#txtImpurezaRes').val(Datos.impureza);
	$('#txtGranoDanadoRes').val(Datos.granodanado);
	$('#txtGranoPartidoRes').val(Datos.granopartido);
	$('#txtGranoQuemadoRes').val(Datos.granoquemado);
	$('#txtGranoCristalizadoRes').val(Datos.granocristalizado);
	$('#txtMezclaColorRes').val(Datos.mezclacolor);
	$('#txtAflatoxinaRes').val(Datos.aflatoxina);
	$('#txtPesoEspecifico').val(Datos.pesoespecifico);

	if ( Datos.infestacion == '1' )
	{
		document.getElementById('radInfestacionSi').checked = true;
	}
	else if ( Datos.infestacion == '0' )
	{
		document.getElementById('radInfestacionNo').checked = true;
	}
	$('#txtObservacion').val(Datos.observacion.replace(/\+/g," "));
	$('#txtEstatus').val(Datos.estatus);
	fBuscarParametros();
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
			$('.EF').removeAttr('disabled');
			/*EJECUTO LA FUNCION AJAX*/
	  	fAjax($('#txtOperacion').val());
		});
	}
});

function fValidaciones()
{
	var Cont = 0;

	for ( var i = 0; i <= PosAn; i++)
	{
		Cont += fResultMuestra(Analisis[i]);
	}

	if ( Cont < ( PosAn + 1 ) )
	{
		$('#btnEnviar').attr('disabled','disabled');
		return 0;
	}
	return 1;
}

function fParametrosBusq(Busq)
{
	if(Busq == 'rif') {
		$('#divBusqCed').css('display','none');
		$('#divBusqNormal').css('display','none');
		$('#divBusqRif').css('display','');
		$('#cmbIdIdentificadorProvBusq').focus();
	}
	else if(Busq == 'cedulacond') {
		$('#divBusqRif').css('display','none');
		$('#divBusqNormal').css('display','none');
		$('#divBusqCed').css('display','');
		$('#cmbIdNacionalidadCondBusq').focus();
	}
	else {
		var Content = 'Buscar por ' + Busq;
		$('#divBusqCed').css('display','none');
		$('#divBusqRif').css('display','none');
		$('#divBusqNormal').css('display','');
		$('#txtBusqueda').attr('data-content',Content);
		$('#txtBusqueda').popover('show');
		$('#txtBusqueda').focus();
	}
	$('#cmbIdIdentificadorProvBusq').val('');
	$('#txtCedulaProvBusq').val('');
	$('#txtDigitoRifProvBusq').val('');
	$('#cmbIdNacionalidadCondBusq').val('');
	$('#txtCedulaCondBusq').val('');
	$('#txtBusqueda').val('');
}

function fResetBusq()
{
	fCmbMotivoCEAjax('busqueda','');
	$('#cmbEstatus').val('');
	$('#cmbParamBusq').val('código');
	$('#cmbEvaluacionBusq').val( '' );
	$('#cmbClaseBusq').val( '' );
	$('#txtFechaDesdeBusq').val('');
	$('#txtFechaHastaBusq').val('');
	$('#txtBusqueda').focus();
	$('#txtBusqueda').val('');
	$('#txtBusqueda').attr('data-content','Buscar por código');
	$('#txtBusqueda').popover('show');
}

/*FUNCIONES EXTRAS*/
function fRegistroExtra()
{
	$('#divCabeceraForm').css('display','none');
	fInfestacion('registrar');
	$('#divInfestacion').css('display','none');
	$('.EF2').attr('disabled','disabled');
}

function fConsultaExtra()
{
	if ( document.getElementById('radInfestacionSi').checked == true)
	{
		fInfestacion('consultar');
		$('#divInfestacion').css('display','');
	}
	$('.EF2').attr('disabled','disabled');
}
function fModificacionExtra()
{
	fInfestacion('modificar');
	$('#divInfestacion').css('display','none');
}
function fActivacionExtra()
{
	$('#divInfestacion').css('display','none');
}
function fDesactivacionExtra()
{
	$('#divInfestacion').css('display','none');
}
function fResetFormExtra()
{
	$('#divCabeceraForm').css('display','');
	$('.EF2').removeAttr('disabled');
	$('#labelRemolque').attr('disabled','disabled');
	$('#labelRemolque').removeClass('active');
	$('#chxRemolque').removeAttr('checked');
	$('#txtRemolqueVeh').val('');
	$('#divInfestacion').css('display','none');
	$('.EF3').val('');
	$('#txtClase').removeClass('CampoInvalido');
	$('#txtClase').removeClass('CampoValido');
	for ( i = 0; i <= PosAn; i ++ )
	{
		fResetTablaAnalisis(Analisis[i]);
	}
	fResetTablaAnalisis('Aflatoxina');
	$('#spanAprobado').css('display','none');
	$('#spanRechazado').css('display','none');
	$('#spanEnEspera').css('display','');
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

function fResetTablaAnalisis(Campo)
{
	$('#txt' + Campo + 'Por').val('');
  $('#icon' + Campo).removeClass('glyphicon-ok');
  $('#icon' + Campo).removeClass('glyphicon-remove');
  $('#tdParam' + Campo).html('');
  $('#tr' + Campo).css('background','');
  $('#spanMsj' + Campo).css('display','none');
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
	var IdProveedor = $('#cmbIdProveedorBusq').val();
	var FechaDesde = $('#txtFechaDesdeBusq').val();
	var FechaHasta = $('#txtFechaHastaBusq').val();
	var Clase = $('#cmbClaseBusq').val();
	var Evaluacion = $('#cmbEvaluacionBusq').val();
	var FlujoProceso = '';

	if( $('#cmbIdIdentificadorProvBusq').val() != '' || $('#txtCedulaProvBusq').val() != '' || $('#txtDigitoRifProvBusq').val() != '' )	{
		var Campo = $('#cmbIdIdentificadorProvBusq').val() + '-' + $('#txtCedulaProvBusq').val() + '-' + $('#txtDigitoRifProvBusq').val();
	}
	else	{
		var Campo = $('#txtBusqueda').val();
	}

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
	xmlhttp.send('ParamBusq=' + ParamBusq + '&Campo=' + Campo + '&Pagina=' + Pagina + '&TamanoPagina=' + TamanoPagina + '&VentPadre=' + VentPadre + '&Estatus=' + Estatus + '&IdMotivoCambioE=' + IdMotivoCambioE + '&IdMateriaPrima=' + IdMateriaPrima + '&FechaDesde=' + FechaDesde + '&FechaHasta=' + FechaHasta + '&Clase=' + Clase + '&Evaluacion=' + Evaluacion + '&IdProveedor=' + IdProveedor + '&FlujoProceso=' + FlujoProceso);
}

function fReportePDF()
{
	var ParamBusq = $('#cmbParamBusq').val();
	var Campo = $('#txtBusqueda').val();
	var Formulario = $('#txtFormulario').val();
	var VentPadre = $('#txtVentPadre').val();
	var Estatus = $('#cmbEstatus').val();
	var IdMotivoCambioE = $('#cmbIdMotivoCambioEBusq').val();
	var IdMateriaPrima = $('#cmbIdMateriaPrimaBusq').val();
	var IdProveedor = $('#cmbIdProveedorBusq').val();
	var FechaDesde = $('#txtFechaDesdeBusq').val();
	var FechaHasta = $('#txtFechaHastaBusq').val();
	var Clase = $('#cmbClaseBusq').val();
	var Evaluacion = $('#cmbEvaluacionBusq').val();
	var ReportePDF;
  ReportePDF=window.open('../Reportes PDF/AnalisisRecepcionMP.Rep.pdf.php?Url=analisisrecepcionmp&ParamBusq=' + ParamBusq + '&Campo=' + Campo + '&VentPadre=' + VentPadre + '&Estatus=' + Estatus + '&IdMotivoCambioE=' + IdMotivoCambioE + '&IdMateriaPrima=' + IdMateriaPrima + '&FechaDesde=' + FechaDesde + '&FechaHasta=' + FechaHasta + '&Clase=' + Clase + '&Evaluacion=' + Evaluacion + '&IdProveedor=' + IdProveedor ,'Reporte de los Análisis de Recepcion de Materia Prima','width=5000, height=2000, top=0, left=0, toolbar=no, location=no, status=no, menubar=no, scrollbar=yes');
  ReportePDF.focus();
}

function fImprimir()
{
	var Imprimir;
  Imprimir=window.open('../Reportes PDF/AnalisisRecepcionMP.Imp.pdf.php?Url=analisisrecepcionmp&IdAnalisisRecepcionMP=' + Datos.idanalisisrecepcionmp ,'Reporte de los Análisis Externos de Materia Prima','width=5000, height=2000, top=0, left=0, toolbar=no, location=no, status=no, menubar=no, scrollbar=yes');
  Imprimir.focus();
}

function fParametrosAnalisisMP()
{
	$('#tdParamHumedad').html(PAMP['HumedadMin'] + ' - ' + PAMP['HumedadMax']);
	$('#tdParamImpureza').html(PAMP['ImpurezaMin'] + ' - ' + PAMP['ImpurezaMax']);
	$('#tdParamGranoDanado').html(PAMP['GranoDanadoMin'] + ' - ' + PAMP['GranoDanadoMax']);
	$('#tdParamGranoPartido').html(PAMP['GranoPartidoMin'] + ' - ' + PAMP['GranoPartidoMax']);
	$('#tdParamGranoQuemado').html(PAMP['GranoQuemadoMin'] + ' - ' + PAMP['GranoQuemadoMax']);
	$('#tdParamGranoCristalizado').html(PAMP['GranoCristalizadoMin'] + ' - ' + PAMP['GranoCristalizadoMax']);
	$('#tdParamMezclaColor').html(PAMP['MezclaColorMin'] + ' - ' + PAMP['MezclaColorMax']);
	$('#tdParamAflatoxina').html(PAMP['AflatoxinaMin'] + ' - ' + PAMP['AflatoxinaMax']);

	$('#txtHumedadMue').val(PAMP['HumedadMuestra'])
	$('#txtImpurezaMue').val(PAMP['ImpurezaMuestra'])
	$('#txtGranoDanadoMue').val(PAMP['GranoDanadoMuestra'])
	$('#txtGranoPartidoMue').val(PAMP['GranoPartidoMuestra'])
	$('#txtGranoQuemadoMue').val(PAMP['GranoQuemadoMuestra'])
	$('#txtGranoCristalizadoMue').val(PAMP['GranoCristalizadoMuestra'])
	$('#txtMezclaColorMue').val(PAMP['MezclaColorMuestra'])
}

/*BUSCAR LOS PARÁMETROS PARA LOS ANÁLISIS*/
function fBuscarParametros()
{
	var xmlhttp;
	//var IdMateriaPrima = $('#txtIdMateriaPrima').val();
	var IdMateriaPrima = $('#txtIdMateriaPrima').val();
	
	if (window.XMLHttpRequest)	{// code for IE7+, Firefox, Chrome, Opera, Safari
		xmlhttp = new XMLHttpRequest();
	}
	else	{// code for IE6, IE5
		xmlhttp = new ActiveXObject('Microsoft.XMLHTTP');
	}
	
	xmlhttp.onreadystatechange=function()
	{
		if (xmlhttp.readyState == 4 && xmlhttp.status == 200)	{
			PAMP = JSON.parse(xmlhttp.responseText);
			fParametrosAnalisisMP();
			if ( $('#txtOperacion').val() == 'consultar' )
			{
				for ( var i = 0; i <= PosAn; i++)
				{
					fCalcularPorc($('#txt'+Analisis[i]+'Res').val(),Analisis[i]);
				}
				fCalcularClase();
				fCalcularAflatoxina(Datos.aflatoxina);
			}
		}
	}
	
	/*SCRIPT QUE CONTENTRA LA TABLA*/
	xmlhttp.open('POST','../Modelos/Scripts/ParametrosAnalisisMP.ajax.php',true);
	xmlhttp.setRequestHeader('Content-type','application/x-www-form-urlencoded');
	/*DATOS A ENVIAR AL SCRIPT DE LA TABLA*/
	xmlhttp.send('IdMateriaPrima=' + IdMateriaPrima);
}

function fResultMuestra(Campo)
{
	if ( parseFloat($('#txt' + Campo + 'Res').val()) > parseFloat(PAMP[Campo + 'Muestra']) )
	{
		$('#spanMsj' + Campo).css('display','block');
		return 0;
	}
	else
	{
		$('#spanMsj' + Campo).css('display','none');
		return 1;
	}
}

function fCalcularPorc(Resultado,Campo)
{
	var Resultado = parseInt(Resultado);
  if( isNaN( Resultado ) == false && ( Resultado != '' || Resultado == '0' ) )
  {
    var Muestra = parseInt( $('#txt' + Campo + 'Mue').val() );
    /*Calculo el porcentaje*/
    var Porcentaje = ( ( Resultado / Muestra ) * 100).toFixed(1);
    $('#txt' + Campo + 'Por').val( Porcentaje );
    //alert( PAMP[Campo + 'Min'] +' - '+ PAMP[Campo + 'Max'] )
    if( Porcentaje >= parseFloat(PAMP[Campo + 'Min']) && Porcentaje <= parseFloat(PAMP[Campo + 'Max']) )
    {
    	$('#icon' + Campo).removeClass('glyphicon-remove');
			$('#icon' + Campo).addClass('glyphicon-ok');
			$('#tr' + Campo).css('background','#D7FFDF');
    }
    else
    {
    	$('#icon' + Campo).removeClass('glyphicon-ok');
    	$('#icon' + Campo).addClass('glyphicon-remove');
    	$('#tr' + Campo).css('background','#FFD7DC');
    }
    fResultMuestra(Campo);
  }
  else
  {
  	$('#txt' + Campo + 'Por').val('');
    $('#icon' + Campo).removeClass('glyphicon-ok');
    $('#icon' + Campo).removeClass('glyphicon-remove');
    $('#tr' + Campo).css('background','');
  }
  fEvaluacion();
}

function fCalcularAflatoxina(Aflatoxina)
{
	var Aflatoxina = parseFloat(Aflatoxina);
  if( isNaN( Aflatoxina ) == false && ( Aflatoxina != '' || Aflatoxina == '0' ) )
  {
    if( Aflatoxina >= parseFloat(PAMP['AflatoxinaMin']) && Aflatoxina <= parseFloat(PAMP['AflatoxinaMax']) )
    {
    	$('#iconAflatoxina').removeClass('glyphicon-remove');
			$('#iconAflatoxina').addClass('glyphicon-ok');
			$('#trAflatoxina').css('background','#D7FFDF');
    }
    else
    {
    	$('#iconAflatoxina').removeClass('glyphicon-ok');
    	$('#iconAflatoxina').addClass('glyphicon-remove');
    	$('#trAflatoxina').css('background','#FFD7DC');
    }
  }
  else
  {
  	$('#txtAflatoxina').val('');
    $('#iconAflatoxina').removeClass('glyphicon-ok');
    $('#iconAflatoxina').removeClass('glyphicon-remove');
    $('#trAflatoxina').css('background','');
  }
  fEvaluacion();
}

function fEvaluacion()
{
	var Cont = -1;
	var ContResult = 0;
	var Aprob = 0;

	for ( var i = 0; i <= PosAn; i++)
	{
		if ( $('#txt' + Analisis[i] + 'Res').val() != '' && isNaN( $('#txt' + Analisis[i] + 'Res').val() ) != true )
		{
			Cont ++;
		}
	}

	/*PARA LA AFLATOXINA*/
	if ( $('#txtAflatoxinaRes').val() != '' && isNaN( $('#txtAflatoxinaRes').val() ) != true )
	{
		Cont ++;
	}

	/*PARA LA INFESTACION*/
	if ( document.getElementById('radInfestacionSi').checked == true || document.getElementById('radInfestacionNo').checked == true )
	{
		Cont ++;
	}
	
	/*LE SUMO 2 A PosAn POR LA INFESTACION Y LA AFLATOXINA (SOLO PARA ADAPTAR LA FUNCION)*/
	if ( Cont == ( PosAn + 2 ) )
	{
		for ( var i = 0; i <= PosAn; i++) 
		{
			if ( PAMP[ Analisis[i] + 'Aprob' ] == '1' )
			{
				Aprob ++;
				if ( parseFloat($('#txt' + Analisis[i] + 'Por').val()) >= parseFloat(PAMP[Analisis[i] + 'Min']) && parseFloat($('#txt' + Analisis[i] + 'Por').val()) <= parseFloat(PAMP[Analisis[i] + 'Max']) )
				{
					ContResult ++;
				}
				else
				{
					ContResult = 0;
				}
			}
		}

		/*ANALISIS APARTE*/

		if ( PAMP['AflatoxinaAprob'] == '1' )
		{
			Aprob ++;
			if ( parseFloat($('#txtAflatoxinaRes').val()) >= parseFloat(PAMP['AflatoxinaMin']) && parseFloat($('#txtAflatoxinaRes').val()) <= parseFloat(PAMP['AflatoxinaMax']) )
			{
				ContResult ++;
			}
			else
			{
				ContResult = 0;
			}
		}

		if ( PAMP['InfestacionAprob'] == '1' )
		{
			Aprob ++;
			if ( document.getElementById('radInfestacionNo').checked == true )
			{
				ContResult ++;
			}
			else
			{
				ContResult = 0;
			}
		}

		if ( ContResult == Aprob )
		{
			$('#spanRechazado').css('display','none');
			$('#spanEnEspera').css('display','none');
			$('#spanAprobado').css('display','');
		}
		else if ( ContResult < Aprob )
		{
			$('#spanAprobado').css('display','none');
			$('#spanEnEspera').css('display','none');
			$('#spanRechazado').css('display','');
		}
		else
		{
			$('#spanAprobado').css('display','none');
			$('#spanRechazado').css('display','none');
			$('#spanEnEspera').css('display','');
		}
	}
	else
	{
		$('#spanAprobado').css('display','none');
		$('#spanRechazado').css('display','none');
		$('#spanEnEspera').css('display','');
	}
}

function fCalcularClase()
{
	var GranoDanado = parseFloat( $('#txtGranoDanadoPor').val() );
  if( isNaN( GranoDanado ) == false && ( GranoDanado != '' || GranoDanado == '0' ) )
  {
    if( GranoDanado >= parseFloat(PAMP['Clase1Min']) && GranoDanado <= parseFloat(PAMP['Clase1Max']) )
    {
    	$('#txtClase').val( 'I' );
    	$('#txtClase').removeClass('CampoInvalido');
			$('#txtClase').addClass('CampoValido');
    }
    else if( GranoDanado >= parseFloat(PAMP['Clase2Min']) && GranoDanado <= parseFloat(PAMP['Clase2Max']) )
    {
    	$('#txtClase').val( 'II' );
    	$('#txtClase').removeClass('CampoInvalido');
			$('#txtClase').addClass('CampoValido');
    }
    else if( GranoDanado >= parseFloat(PAMP['Clase3Min']) && GranoDanado <= parseFloat(PAMP['Clase3Max']) )
    {
    	$('#txtClase').val( 'III' );
    	$('#txtClase').removeClass('CampoInvalido');
			$('#txtClase').addClass('CampoValido');
    }
    else
    {
    	$('#txtClase').val( 'G.P.M' );
    	$('#txtClase').removeClass('CampoValido');
			$('#txtClase').addClass('CampoInvalido');
    }
  }
  else
  {
  	$('#txtClase').val('');
    $('#txtClase').removeClass('CampoValido');
		$('#txtClase').removeClass('CampoInvalido');
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
		if (xmlhttp.readyState==4 && xmlhttp.status==200)	{
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
	Valid = 1;
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

/*EVENTOS DE LOS ANALISIS*/
$('#txtHumedadRes').keyup(function()
{
	fCalcularPorc( $(this).val() , 'Humedad' );
});

$('#txtImpurezaRes').keyup(function()
{
	fCalcularPorc( $(this).val() , 'Impureza' );
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
	window.opener.fPopUpBoleto();
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