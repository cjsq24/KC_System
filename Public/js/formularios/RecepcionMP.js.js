var Datos='';
/*ARREGLO CON LOS ANÁLISIS DISPONIBLES*/
var PosAn = 4;/*POSICION MAX DEL ARREGLO*/
var Analisis = ['Humedad','Impureza','GranoDanado','GranoPartido','GranoQuemado'];

function fLlenarCampos(Datos)
{
	$('#txtIdRecepcionMP').val(Datos.idrecepcionmp);
	$('#txtCodRecepcionMP').val(Datos.idrecepcionmp);
	var Fecha = Datos.fecha.split("-");
	$('#txtFecha').val( Fecha[2] + '-' + Fecha[1] + '-' + Fecha[0] );
	$('#txtHora').val(Datos.hora.replace(/\+/g," "));
	$('#txtIdBoleto').val(Datos.idboleto);
	$('#txtCodBoleto').val(Datos.idboleto);
	$('#txtGuiaSADA').val(Datos.guiasada);
	$('#txtGuiaProv').val(Datos.guiaprov);
	$('#txtIdMateriaPrima').val(Datos.idmateriaprima);
	$('#txtMateriaPrima').val(Datos.materiaprima.replace(/\+/g," "));
	$('#txtRazonSocialProv').val(Datos.razonsocialprov.replace(/\+/g," "));
	$('#txtCedulaCond').val(Datos.nacionalidadcond + '-' +Datos.cedulacond);
	$('#txtNombresCond').val(Datos.nombrecond.replace(/\+/g," ") + ' ' + Datos.apellidocond.replace(/\+/g," "));
	$('#txtPlacaVeh').val(Datos.placaveh);
	$('#txtTipoVehiculo').val(Datos.tipovehiculo.replace(/\+/g," "));
	if ( Datos.remolque == '1' )
	{
		document.getElementById('chxRemolque').checked = true;
		$('#labelRemolque').addClass('active');
	}
	else if ( Datos.remolque == '0' )
	{
		$('#chxRemolque').removeAttr('checked');
		$('#labelRemolque').removeClass('active');
	}
	//$('#txtPesoTotalEnt').val( (parseFloat(Datos.pesovehent) + parseFloat(Datos.pesorement)).toFixed(2) );

	/*ANÁLISIS DE RECEPCIÓN*/
	$('#txtIdAR').val(Datos.idanalisisrecepcionmp);
	var Fecha = Datos.fechaanalisis.split("-");
	$('#txtFechaAR').val( Fecha[2] + '-' + Fecha[1] + '-' + Fecha[0] );
	$('#txtHoraAR').val(Datos.horaanalisis.replace(/\+/g," "));
	$('#txtHumedadResAR').val(Datos.humedad);
	$('#txtImpurezaResAR').val(Datos.impureza);
	$('#txtGranoDanadoResAR').val(Datos.granodanado);
	$('#txtGranoPartidoResAR').val(Datos.granopartido);
	$('#txtGranoQuemadoResAR').val(Datos.granoquemado);
	$('#txtAflatoxinaAR').val(Datos.aflatoxina);
	if ( Datos.infestacion == '1' )	{
		$('#txtInfestacionAR').val('SI');
		$('#txtInfestacionAR').removeClass('CampoValido');
		$('#txtInfestacionAR').addClass('CampoInvalido');
	}
	else if ( Datos.infestacion == '0' )	{
		$('#txtInfestacionAR').val('NO');
		$('#txtInfestacionAR').removeClass('CampoInvalido');
		$('#txtInfestacionAR').addClass('CampoValido');
	}

	var PesoNetoAR = ( ( ( parseFloat(Datos.pesovehent) + parseFloat(Datos.pesorement) ) - ( parseFloat(Datos.pesovehsal) + parseFloat(Datos.pesoremsal) ) ) ).toFixed(2);
	$('#txtPesoNetoAR').val( PesoNetoAR );
	$('#txtPesoNetoRest').val( PesoNetoAR );

	if ( Datos.analisisext == '1' )	{
		$('#divDatosExt').css('display','');
		$('#txtPesoNetoExt').val(Datos.pesonetoext);
		/*ANÁLISIS EXTERNOS*/
		$('#txtIdAE').val(Datos.idanalisisexternomp);
		Fecha = Datos.fechaext.split("-");
		$('#txtFechaAE').val( Fecha[2] + '-' + Fecha[1] + '-' + Fecha[0] );
		$('#txtHoraAE').val(Datos.horaext.replace(/\+/g," "));
		$('#txtHumedadResAE').val(Datos.humedadext);
		$('#txtImpurezaResAE').val(Datos.impurezaext);
		$('#txtGranoDanadoResAE').val(Datos.granodanadoext);
		$('#txtGranoPartidoResAE').val(Datos.granopartidoext);
		$('#txtGranoQuemadoResAE').val(Datos.granoquemadoext);
		$('#txtAflatoxinaAE').val(Datos.aflatoxinaext);
		if ( Datos.infestacionext == '1' )	{
			$('#txtInfestacionAE').val('SI');
			$('#txtInfestacionAE').removeClass('CampoValido');
			$('#txtInfestacionAE').addClass('CampoInvalido');
		}
		else if ( Datos.infestacionext == '0' )	{
			$('#txtInfestacionAE').val('NO');
			$('#txtInfestacionAE').removeClass('CampoInvalido');
			$('#txtInfestacionAE').addClass('CampoValido');
		}
		$('#txtPesoNetoAE').val(Datos.pesonetoext);
	}
	else if ( Datos.analisisext == '0' )	{
		$('#divPesoExt').css('display','none');
		$('#txtPesoNetoExt').val('0.00');
	}

	$('.EF2').removeAttr('disabled');
	$('#spanPesoNetoRest').html( PesoNetoAR );
	$('#tbDetalle').html( '' );
	fBuscarParametros(Datos.analisisext);
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
	  cache: false, type: 'POST', dataType: 'json', url:'../Controladores/RecepcionMP.con.php',
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
		      	fParametrosBusq('cód. del boleto');
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
	  	fAjax($('#txtOperacion').val());
		});
	}
});

function fValidaciones()
{
	var PesoNetoRest = parseFloat( $('#txtPesoNetoRest').val() );

	if ( PesoNetoRest > 0 )
	{
		swal('¡ERROR!','No se ha recepcionado toda la materia prima','error');
		return 0;
	}
	return 1;
}

function fParametrosBusq(Busq)
{
	if(Busq == 'rif del proveedor') {
		$('#divBusqCed').css('display','none');
		$('#divBusqNormal').css('display','none');
		$('#divBusqRif').css('display','');
		$('#cmbIdIdentificadorProvBusq').focus();
	}
	else if(Busq == 'céd. del conductor') {
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
	$('.EF2').attr('disabled','disabled');
	$('#divDatosExt').css('display','none');
	$('.EFPeso').val('0.00');
	$('#btnPopUpBoleto').removeAttr('disabled');
	$('#spanPesoNetoRest').html('0.00');
	$('#divRecepSiloAjax').css('display','none');
	$('#divRecepSiloReg').css('display','');
}

function fConsultaExtra()
{
	$('.EF2').attr('disabled','disabled');
	$('#txtPesoVehSal').attr('disabled','disabled');
	$('#txtPesoRemSal').attr('disabled','disabled');
	$('#btnPopUpBoleto').attr('disabled','disabled');
	$('#divRecepSiloReg').css('display','none');
	$('#divRecepSiloAjax').css('display','');
	fRecepSiloAjax('consultar');
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
	$('.EFAnalisis').removeClass('CampoValido');
	$('.EFAnalisis').removeClass('CampoInvalido');
	$('#tbDetalle').html('');
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
	var IdTipoVehiculo = $('#cmbIdTipoVehiculoBusq').val();
	var TipoPesada = $('#cmbTipoPesadaBusq').val();

	if( $('#cmbIdIdentificadorProvBusq').val() != '' || $('#txtCedulaProvBusq').val() != '' || $('#txtDigitoRifProvBusq').val() != '' )	{
		var Campo = $('#cmbIdIdentificadorProvBusq').val() + '-' + $('#txtCedulaProvBusq').val() + '-' + $('#txtDigitoRifProvBusq').val();
	}
	else	{
		var Campo = $('#txtBusqueda').val();
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
	xmlhttp.open('POST','../Modelos/Scripts/RecepcionMP.ajax.php',true);
	xmlhttp.setRequestHeader('Content-type','application/x-www-form-urlencoded');
	/*DATOS A ENVIAR AL SCRIPT DE LA TABLA*/
	xmlhttp.send('ParamBusq=' + ParamBusq + '&Campo=' + Campo + '&Pagina=' + Pagina + '&TamanoPagina=' + TamanoPagina + '&VentPadre=' + VentPadre + '&Estatus=' + Estatus + '&IdMotivoCambioE=' + IdMotivoCambioE + '&IdMateriaPrima=' + IdMateriaPrima + '&FechaDesde=' + FechaDesde + '&FechaHasta=' + FechaHasta + '&FlujoProceso=' + FlujoProceso + '&IdProveedor=' + IdProveedor + '&IdTipoVehiculo=' + IdTipoVehiculo + '&TipoPesada=' + TipoPesada);
}

function fEnviarDatosTransitoAnalisisExtra()
{
	$('#Form').data('formValidation').updateStatus($('#txtCodTransitoRecepcionMP'), 'NOT_VALIDATED').validateField($('#txtCodTransitoRecepcionMP'));
	$('#Form').data('formValidation').updateStatus($('#txtMateriaPrima'), 'NOT_VALIDATED').validateField($('#txtMateriaPrima'));
	$('#Form').data('formValidation').updateStatus($('#txtRazonSocialProv'), 'NOT_VALIDATED').validateField($('#txtRazonSocialProv'));
	$('#labelRemolque').attr('disabled','disabled');
}

/****************************************************************************************/

function fPesoTotal(Tipo)
{
	fCalcularKgHumedad(Tipo);
	fCalcularKgImpureza(Tipo);
	fCalcularPesoAcondicionado(Tipo);
}

function fCalcularKgHumedad(Tipo)
{
	var PesoNeto = parseFloat( $('#txtPesoNeto' + Tipo).val() );
	var Humedad = parseFloat( $('#txtHumedadPor' + Tipo).val() );
	$('#txtKgHumedad' + Tipo).val( ( ( PesoNeto * (Humedad - 12) ) / 88 ).toFixed(2) );
}

function fCalcularKgImpureza(Tipo)
{
	var PesoNeto = parseFloat( $('#txtPesoNeto' + Tipo).val() );
	var Impureza = parseFloat( $('#txtImpurezaPor' + Tipo).val() );
	var KGHumedad = parseFloat( $('#txtKgHumedad' + Tipo).val() );
	$('#txtKgImpureza' + Tipo).val( ( ( ( PesoNeto - KGHumedad ) * Impureza ) / 100 ).toFixed(2) );
}

function fCalcularPesoAcondicionado(Tipo)
{
	var PesoNeto = parseFloat( $('#txtPesoNeto' + Tipo).val() );
	var KGHumedad = parseFloat( $('#txtKgHumedad' + Tipo).val() );
	var KGImpureza = parseFloat( $('#txtKgImpureza' + Tipo).val() );
	$('#txtPesoAcondicionado' + Tipo).val( ( PesoNeto - ( KGHumedad + KGImpureza ) ).toFixed(2) );
}

function fDiferenciaPeso(PesoNetoInt,PesoNetoExt)
{
	if ( isNaN(PesoNetoInt) == false && isNaN(PesoNetoExt) == false ) 
	{
		PesoNetoInt = parseFloat(PesoNetoInt).toFixed(2);
		PesoNetoExt = parseFloat(PesoNetoExt).toFixed(2);

		var PesoDif = ( PesoNetoExt - PesoNetoInt ).toFixed(2);
		$('#txtPesoDif').val( PesoDif );

		var PesoDifMax = parseFloat($('#txtPesoDifMax').val()).toFixed(2);

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

function fPesadaManual()
{
	$('#txtTipoPesada').val('1');
	$('#btnPesadaManual').css('display','none');
	$('#btnPesadaAutomatica').css('display','');
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

function fPopUpBoleto()
{
	var PopUpBoleto;
  PopUpBoleto=window.open('monitorrmp.vis.php?Url=monitorrmp' + '&VentPadre=' + $('#txtUrl').val() ,'Monitor de Recepción de Materia Prima','width=5000, height=2000, top=0, left=0, toolbar=no, location=no, status=no, menubar=no, scrollbar=yes');
  PopUpBoleto.focus();
}

/****************************************************************************************************/
/****************************************************************************************************/
/*PARA LOS ANÁLISIS*/

function fParametrosAnalisisMP()
{
	$('#txtHumedadMue').val(PAMP['HumedadMuestra']);
	$('#txtImpurezaMue').val(PAMP['ImpurezaMuestra']);
	$('#txtGranoDanadoMue').val(PAMP['GranoDanadoMuestra']);
	$('#txtGranoPartidoMue').val(PAMP['GranoPartidoMuestra']);
	$('#txtGranoQuemadoMue').val(PAMP['GranoQuemadoMuestra']);
}

/*BUSCAR LOS PARÁMETROS PARA LOS ANÁLISIS*/
function fBuscarParametros(AnalisisExt)
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
			for ( var i = 0; i <= PosAn; i++)
			{
				fCalcularPorc($('#txt'+Analisis[i]+'ResAR').val(),Analisis[i],'AR');
			}
			fCalcularClase('AR');
			fCalcularAflatoxina($('#txtAflatoxinaAR').val(),'AR');

			if ( AnalisisExt == '1' )
			{
				for ( var i = 0; i <= PosAn; i++)
				{
					fCalcularPorc($('#txt'+Analisis[i]+'ResAE').val(),Analisis[i],'AE');
				}
				fCalcularClase('AE');
				fCalcularAflatoxina($('#txtAflatoxinaAE').val(),'AE');
			}
			fPesoTotal('AR');
			fPesoTotal('AE');
		}
	}
	
	/*SCRIPT QUE CONTENTRA LA TABLA*/
	xmlhttp.open('POST','../Modelos/Scripts/ParametrosAnalisisMP.ajax.php',true);
	xmlhttp.setRequestHeader('Content-type','application/x-www-form-urlencoded');
	/*DATOS A ENVIAR AL SCRIPT DE LA TABLA*/
	xmlhttp.send('IdMateriaPrima=' + IdMateriaPrima);
}

function fCalcularPorc(Resultado,Campo,Tipo)
{
	var Resultado = parseInt(Resultado);
  if( isNaN( Resultado ) == false && ( Resultado != '' || Resultado == '0' ) )
  {
    var Muestra = parseInt( $('#txt' + Campo + 'Mue').val() );
    /*Calculo el porcentaje*/
    var Porcentaje = ( ( Resultado / Muestra ) * 100).toFixed(1);
    $('#txt' + Campo + 'Por' + Tipo).val( Porcentaje );
    //alert( PAMP[Campo + 'Min'] +' - '+ PAMP[Campo + 'Max'] )
    if( Porcentaje >= parseFloat(PAMP[Campo + 'Min']) && Porcentaje <= parseFloat(PAMP[Campo + 'Max']) )
    {
			$('#txt' + Campo + 'Por' + Tipo).removeClass('CampoInvalido');
			$('#txt' + Campo + 'Por' + Tipo).addClass('CampoValido');
    }
    else
    {
    	$('#txt' + Campo + 'Por' + Tipo).removeClass('CampoValido');
			$('#txt' + Campo + 'Por' + Tipo).addClass('CampoInvalido');
    }
  }
  else
  {
  	$('#txt' + Campo + 'Por' + Tipo).val('');
    $('#txt' + Campo + 'Por' + Tipo).removeClass('CampoValido');
		$('#txt' + Campo + 'Por' + Tipo).removeClass('CampoInvalido');
  }
}

function fCalcularClase(Tipo)
{
	var GranoDanado = parseFloat( $('#txtGranoDanadoPor' + Tipo).val() );
  if( isNaN( GranoDanado ) == false && ( GranoDanado != '' || GranoDanado == '0' ) )
  {
    if( GranoDanado >= parseFloat(PAMP['Clase1Min']) && GranoDanado <= parseFloat(PAMP['Clase1Max']) )
    {
    	$('#txtClase' + Tipo).val( 'I' );
    	$('#txtClase' + Tipo).removeClass('CampoInvalido');
			$('#txtClase' + Tipo).addClass('CampoValido');
    }
    else if( GranoDanado >= parseFloat(PAMP['Clase2Min']) && GranoDanado <= parseFloat(PAMP['Clase2Max']) )
    {
    	$('#txtClase' + Tipo).val( 'II' );
    	$('#txtClase' + Tipo).removeClass('CampoInvalido');
			$('#txtClase' + Tipo).addClass('CampoValido');
    }
    else if( GranoDanado >= parseFloat(PAMP['Clase3Min']) && GranoDanado <= parseFloat(PAMP['Clase3Max']) )
    {
    	$('#txtClase' + Tipo).val( 'III' );
    	$('#txtClase' + Tipo).removeClass('CampoInvalido');
			$('#txtClase' + Tipo).addClass('CampoValido');
    }
    else
    {
    	$('#txtClase' + Tipo).val( 'G.P.M' );
    	$('#txtClase' + Tipo).removeClass('CampoValido');
			$('#txtClase' + Tipo).addClass('CampoInvalido');
    }
  }
  else
  {
  	$('#txtClase' + Tipo).val('');
    $('#txtClase' + Tipo).removeClass('CampoValido');
		$('#txtClase' + Tipo).removeClass('CampoInvalido');
  }
}

function fCalcularAflatoxina(Aflatoxina,Tipo)
{
	var Aflatoxina = parseFloat(Aflatoxina);
  if( isNaN( Aflatoxina ) == false && ( Aflatoxina != '' || Aflatoxina == '0' ) )
  {
    if( Aflatoxina >= parseFloat(PAMP['AflatoxinaMin']) && Aflatoxina <= parseFloat(PAMP['AflatoxinaMax']) )
    {
			$('#txtAflatoxina' + Tipo).removeClass('CampoInvalido');
			$('#txtAflatoxina' + Tipo).addClass('CampoValido');
    }
    else
    {
    	$('#txtAflatoxina' + Tipo).removeClass('CampoValido');
			$('#txtAflatoxina' + Tipo).addClass('CampoInvalido');
    }
  }
  else
  {
  	$('#txtAflatoxina' + Tipo).val('');
    $('#txtAflatoxina' + Tipo).removeClass('CampoValido');
		$('#txtAflatoxina' + Tipo).removeClass('CampoInvalido');
  }
}

/*function fCalcularClase()
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
}*/

function fAgregarFila(obj,IdSiloMP,SiloMP,CapacidadMax,CapDispAntes,CapDispDespues,CantidadMP)
{   

    obj = parseInt(obj) + 1;
    var oId = obj;
    $('#txtCantCampos').val( oId );
    /*ArrIdSiloMP[oId]=IdSiloMP;
    alert(ArrIdSiloMP[oId] + ' POS ->>> ' + oId);*/
        
        // ASIGANDO HTML A LA VARIABLE DE JAVASCRIPT
    var strHtml1 =SiloMP+'<input type="hidden" name="DetRecepcionMP['+IdSiloMP+'][IdSiloMP]" value="'+IdSiloMP+'"/>' ;
    var strHtml2 =CapacidadMax+'<input type="hidden" name="DetRecepcionMP['+IdSiloMP+'][CapacidadMax]" value="'  + CapacidadMax + '"/>' ;
    var strHtml3 =CapDispAntes+'<input type="hidden" name="DetRecepcionMP['+IdSiloMP+'][CapDispAntes]" value="' +CapDispAntes+ '"/>' ;
    var strHtml4 =CapDispDespues+'<input type="hidden" name="DetRecepcionMP['+IdSiloMP+'][CapDispDespues]" value="' +CapDispDespues+ '"/>' ;
    var strHtml5 =CantidadMP+'<input type="hidden" name="DetRecepcionMP['+IdSiloMP+'][CantidadMP]" value="' +CantidadMP+ '"/>' ;
    var strHtml6 = '<span width="16" height="16" class="glyphicon glyphicon-remove-sign" style="color:red;font:14px;" onclick="fEliminarFila('+IdSiloMP+');"></span>';
    strHtml6 += '<input type="hidden" id="hdnIdCampos_'+IdSiloMP+'" name="hdnIdCampos[]" value="'+IdSiloMP+'" />';

    var objTr = document.createElement("tr");
    objTr.id = "rowDetalle_"+IdSiloMP;

    var objTd1 = document.createElement("td");
    objTd1.id = "tdDetalle_1_"+IdSiloMP;
    objTd1.innerHTML = strHtml1; // IMPRIMO EL HTML 

    var objTd2 = document.createElement("td");
    objTd2.id = "tdDetall_2_"+IdSiloMP;  
    objTd2.innerHTML = strHtml2;

    var objTd3 = document.createElement("td");
    objTd3.id = "tdDetall_3_"+IdSiloMP;  
    objTd3.innerHTML = strHtml3;

    var objTd4 = document.createElement("td");
    objTd4.id = "tdDetall_4_"+IdSiloMP;  
    objTd4.innerHTML = strHtml4;

    var objTd5 = document.createElement("td");
    objTd5.id = "tdDetalle_5_" + IdSiloMP;   
    objTd5.innerHTML = strHtml5;

    var objTd6 = document.createElement("td");
    objTd6.id = "tdDetalle_6_" + IdSiloMP;   
    objTd6.innerHTML = strHtml6;
    
    objTr.appendChild(objTd1);
    objTr.appendChild(objTd2);
    objTr.appendChild(objTd3);
    objTr.appendChild(objTd4);
    objTr.appendChild(objTd5); // Eliminar
    objTr.appendChild(objTd6); // Eliminar
    
    var objTbody = document.getElementById("tbDetalle");
    objTbody.appendChild(objTr); // Impreme Finalmente

    document.getElementById("lista").value=(document.getElementById("tblDetalle").rows.length);

    var PesoNetoRest = parseFloat($('#txtPesoNetoRest').val());
    $('#txtPesoNetoRest').val( parseFloat(PesoNetoRest - CantidadMP ).toFixed(2) );
    $('#spanPesoNetoRest').html( $('#txtPesoNetoRest').val() );
    //alert($('[name="txtIdSiloMP['+IdSiloMP+']"]').val());
    /*alert(.$('[name="DetRecepcionMP[' + IdSiloMP + '][IdSiloMP]"').val());
    alert(.$('[name="DetRecepcionMP[' + IdSiloMP + '][CantidadMP]"').val());*/

    return false;   //evita que haya un submit por equivocacion.

}

function fEliminarFila(oId)
{
	swal({ title: '¡Confirmar!', text: '¿Desea eliminar esa fila?', type: 'info', showCancelButton: true, confirmButtonText: 'SI', cancelButtonText: 'NO' },function()
	{
		var Cantidad = parseFloat($('[name="DetRecepcionMP['+oId+'][CantidadMP]"]').val());
		$('#txtPesoNetoRest').val( ((parseFloat($('#txtPesoNetoRest').val())) + Cantidad).toFixed(2));
		$('#spanPesoNetoRest').html( $('#txtPesoNetoRest').val() );
		var objHijo = document.getElementById('rowDetalle_'+oId);
		var nfilas=(document.getElementById("tblDetalle").rows.length);
		if(nfilas=='1')
		{
		    document.getElementById('valoringreso').value="";   
		}
		var objPadre = objHijo.parentNode;
		objPadre.removeChild(objHijo);
	});
	return false;
}

function fRecepSiloAjax(Operacion)
{
	$('#tbDetalleAjax').html('<tr><td> <img src="../Public/img/ajax-loaders/ajax-loader-1.gif"> Cargando </td></tr>');
	var xmlhttp;
	var IdRecepcionMP=$('#txtIdRecepcionMP').val();
	if (window.XMLHttpRequest)	{// code for IE7+, Firefox, Chrome, Opera, Safari
		xmlhttp=new XMLHttpRequest();
	}
	else	{// code for IE6, IE5
		xmlhttp=new ActiveXObject('Microsoft.XMLHTTP');
	}
	
	xmlhttp.onreadystatechange=function()
	{
		if (xmlhttp.readyState==4 && xmlhttp.status==200)	{
			$('#tbDetalleAjax').html(xmlhttp.responseText);
		}
	}
	
	/*SCRIPT QUE CONTENTRA LA TABLA*/
	xmlhttp.open('POST','../Modelos/Scripts/RecepSiloMP.ajax.php',true);
	xmlhttp.setRequestHeader('Content-type','application/x-www-form-urlencoded');
	/*DATOS A ENVIAR AL SCRIPT DE LA TABLA*/
	xmlhttp.send('Operacion='+Operacion+'&IdRecepcionMP='+IdRecepcionMP);
}

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

$('#btnPopUpBoleto').click(function()
{
	var PopUpBoleto;
  PopUpBoleto = window.open('monitorrmp.vis.php?Url=monitorrmp' + '&VentPadre=' + $('#txtUrl').val() ,'Monitor de Recepción de Materia Prima','width=5000, height=2000, top=0, left=0, toolbar=no, location=no, status=no, menubar=no, scrollbar=yes');
  PopUpBoleto.focus();
});

$('#btnPopUpInventarioMP').click(function()
{
	if ( $('#txtPesoNetoRest').val() != '0.00' )
	{
		var PopUpInventarioMP;
	  PopUpInventarioMP = window.open('inventariomp.vis.php?Url=inventariomp' + '&VentPadre=' + $('#txtUrl').val() + '&IdMateriaPrima=' + $('#txtIdMateriaPrima').val() ,'Inventario de Materia Prima','width=5000, height=2000, top=0, left=0, toolbar=no, location=no, status=no, menubar=no, scrollbar=yes');
	  PopUpInventarioMP.focus();
	 }
	 else
	 {
	 	swal('¡ERROR!','Ya no hay materia prima disponible para almacenar','error');
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
	.on('success.field.fv', function(e, data) {
			e.preventDefault();
	    if (data.fv.getSubmitButton()) {
	        data.fv.disableSubmitButtons(false);
	    }
	})
});

//setTimeout(function(){ fTablaAjax(); }, 2000);