var Datos = '';
var FechaInicio = '';
var FechaFinal = '';

function fLlenarCampos(Datos)
{
	$('#txtIdTransitoRecepcionMP').val(Datos.idtransitorecepcionmp);
	$('#txtCodigo').val(Datos.idtransitorecepcionmp);
	var Fecha = Datos.fecha.split("-");
	$('#txtFecha').val( Fecha[2] + '-' + Fecha[1] + '-' + Fecha[0] );
	FechaInicio = Datos.fechainicio.split("-");
	FechaInicio = FechaInicio[2] + '-' + FechaInicio[1] + '-' + FechaInicio[0]
	$('#txtFechaInicio').val( FechaInicio );
	FechaFinal = Datos.fechafinal.split("-");
	FechaFinal = FechaFinal[2] + '-' + FechaFinal[1] + '-' + FechaFinal[0]
	$('#txtFechaFinal').val( FechaFinal );
	$('#txtHora').val(Datos.hora.replace(/\+/g," "));
	$('#txtIdProveedor').val(Datos.idproveedor);
	$('#txtRifProv').val(Datos.identificadorprov + '-' + Datos.cedulaprov + '-' + Datos.digitorifprov);
	$('#txtRazonSocialProv').val(Datos.razonsocialprov.replace(/\+/g," "));
	$('#cmbIdMateriaPrima').val(Datos.idmateriaprima);
	$('#txtCantidadProg').val(Datos.cantidadprog);
	$('#txtCantidadRecib').val(Datos.cantidadrecib);
	$('#txtVehiculosProg').val(Datos.vehiculosprog);
	$('#txtVehiculosRecib').val(Datos.vehiculosrecib);
	$('#txtObservacion').val(Datos.observacion.replace(/\+/g," "));
	$('#txtEstatus').val(Datos.estatus);
}

function fVerificarProvMP()
{
	if ( $('#txtOperacion').val() == 'registrar' && $('#txtIdProveedor').val() != '' && $('#cmbIdMateriaPrima').val() != '' )	{
		fAjax('verificar_prov_mp');
	}
	else if ( $('#txtOperacion').val() == 'modificar' && ( $('#txtIdProveedor').val() != Datos.idproveedor || $('#cmbIdMateriaPrima').val() != Datos.idmateriaprima ) )	{
		fAjax('verificar_prov_mp');
	}
}

/*ENVIO DE RECEPCION DE DATOS VIA AJAX*/
function fAjax(Operacion)
{
	/*SERIALIZO EL FORMULARIO (CAMPOS) PARA ENVIARLO AL CONTROLADOR*/
	var str = $('#Form').serialize();
	$.ajax(
	{
	  cache: false, type: 'POST', dataType: 'json', url:'../Controladores/TransitoRecepcionMP.con.php',
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
			else if(response.Resultado == 'existe' && Operacion == 'verificar_prov_mp')
			{
	      swal({ title: '¡ALERTA!', text: response.Mensaje, type: 'info', showCancelButton: true, cancelButtonText: 'NO', confirmButtonColor: '#DD6B55', confirmButtonText: 'SI', closeOnConfirm: true },function()	
	      {
	      	fResetBusq();
      		$('#cmbParamBusq').val('razon social');
	      	fParametrosBusq('razon social');
	      	$('#txtBusqueda').val( $('#txtRazonSocialProv').val() );
	      	$('#cmbIdMateriaPrimaBusq').val( $('#cmbIdMateriaPrima').val() );
	      	$('#cmbFlujoProcesoBusq').val( '0' );
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
	      		$('#cmbParamBusq').val('razon social');
		      	fParametrosBusq('razon social');
		      	$('#txtBusqueda').val( $('#txtRazonSocialProv').val() );
		      	$('#cmbIdMateriaPrimaBusq').val( $('#cmbIdMateriaPrima').val() );
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
	else if ( fValidarFechaI() == '1' && fValidarFechaF() == '1' && fValidarVehProg() == '1' )
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

function fParametrosBusq(Busq)
{
	if(Busq == 'rif') {
		$('#divBusqRif').css('display','');
		$('#divBusqNormal').css('display','none');
		$('#cmbIdIdentificadorBusq').focus();
	}
	else {
		var Content = 'Buscar por ' + Busq;
		$('#divBusqRif').css('display','none');
		$('#divBusqNormal').css('display','');
		$('#txtBusqueda').attr('data-content',Content);
		$('#txtBusqueda').popover('show');
		$('#txtBusqueda').focus();
	}
	$('#cmbIdIdentificadorBusq').val('');
	$('#txtCedulaBusq').val('');
	$('#txtDigitoBusq').val('');
	$('#txtBusqueda').val('');
}

function fResetBusq()
{
	fCmbMotivoCEAjax('busqueda','');
	$('#cmbEstatus').val('');
	$('#cmbParamBusq').val('codigo');
	$('#cmbFlujoProcesoBusq').val( '0' );
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
	$('#divCabReg').css('display','none');
	$('#divVehRecib').css('display','none');
	$('#divCantRecib').css('display','none');
}
function fConsultaExtra()
{
	$('#divCabReg').css('display','');
	$('#divVehRecib').css('display','');
	$('#divCantRecib').css('display','');
}
function fModificacionExtra()
{
	$('#divCabReg').css('display','');
	$('#divVehRecib').css('display','');
	$('#divCantRecib').css('display','');
}
function fActivacionExtra()
{
	$('#divCabReg').css('display','');
	$('#divVehRecib').css('display','none');
	$('#divCantRecib').css('display','none');
}
function fDesactivacionExtra()
{
	$('#divCabReg').css('display','');
	$('#divVehRecib').css('display','none');
	$('#divCantRecib').css('display','none');
}
function fResetFormExtra()
{
	$('#divCabReg').css('display','none');
	$('#divVehRecib').css('display','none');
	$('#divCantRecib').css('display','none');
	$('#spanMsjFechaI').css('display','none');
	$('#spanMsjFechaF').css('display','none');
	$('#spanMsjVeh').css('display','none');
}
function fEnviarDatosExtra()
{
	$("#txtIdProveedor").trigger("change");
	$('#Form').data('formValidation').updateStatus($('#txtRifProv'), 'NOT_VALIDATED').validateField($('#txtRifProv'));
	$('#Form').data('formValidation').updateStatus($('#txtRazonSocialProv'), 'NOT_VALIDATED').validateField($('#txtRazonSocialProv'));
}
function fSeleccionarFilaExtra()
{
	if ( Datos.flujoproceso == '1' || Datos.flujoproceso == '2' )
	{
		$('#btnModificar1').attr('disabled','disabled');
		$('#btnModificar2').attr('disabled','disabled');
		$('#btnActivar1').attr('disabled','disabled');
		$('#btnActivar2').attr('disabled','disabled');
		$('#btnDesactivar1').attr('disabled','disabled');
		$('#btnDesactivar2').attr('disabled','disabled');
	}
}

function fReportePDF()
{
	var ParamBusq = $('#cmbParamBusq').val();
	var Campo = $('#txtBusqueda').val();
	var Estatus = $('#cmbEstatus').val();
	var IdMotivoCambioE = $('#cmbIdMotivoCambioEBusq').val();
	var IdMateriaPrima = $('#cmbIdMateriaPrimaBusq').val();
	var IdProveedor = $('#cmbIdProveedorBusq').val();
	var FechaDesde = $('#txtFechaDesdeBusq').val();
	var FechaHasta = $('#txtFechaHastaBusq').val();
	var FlujoProceso = $('#cmbFlujoProcesoBusq').val();
	var ReportePDF;

	if( $('#cmbIdIdentificadorBusq').val() != '' || $('#txtCedulaBusq').val() != '' || $('#txtDigitoRifBusq').val() != '' )	{
		var Campo = $('#cmbIdIdentificadorBusq').val() + '-' + $('#txtCedulaBusq').val() + '-' + $('#txtDigitoRifBusq').val();
	}
	else	{
		var Campo = $('#txtBusqueda').val();
	}

  ReportePDF=window.open('../Reportes PDF/TransitoRecepcionMP.Rep.pdf.php?Url=transitorecepcionmp&ParamBusq=' + ParamBusq + '&Campo=' + Campo + '&Estatus=' + Estatus + '&IdMotivoCambioE=' + IdMotivoCambioE + '&IdMateriaPrima=' + IdMateriaPrima + '&FechaDesde=' + FechaDesde + '&FechaHasta=' + FechaHasta + '&FlujoProceso=' + FlujoProceso + '&IdProveedor=' + IdProveedor ,'Reporte de Tránsito de Recepción de Materia Prima','width=5000, height=2000, top=0, left=0, toolbar=no, location=no, status=no, menubar=no, scrollbar=yes');
  ReportePDF.focus();
}

/**/

/*VALIDAR SI SE HIZO ALGUN CAMBIO EN EL FORMULARIO PARA MODIFICAR*/
function fValidModificacion()
{
	if( $('#txtFechaInicio').val() == FechaInicio && $('#txtFechaFinal').val() == FechaFinal && $('#txtIdProveedor').val() == Datos.idproveedor && $('#cmbIdMateriaPrima').val() == Datos.idmateriaprima && $('#txtCantidadProg').val() == Datos.cantidadprog && $('#txtVehiculosProg').val() == Datos.vehiculosprog && $('#txtObservacion').val() == Datos.observacion.replace(/\+/g," ") )	{
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

	if( $('#cmbIdIdentificadorBusq').val() != '' || $('#txtCedulaBusq').val() != '' || $('#txtDigitoRifBusq').val() != '' )	{
		var Campo = $('#cmbIdIdentificadorBusq').val() + '-' + $('#txtCedulaBusq').val() + '-' + $('#txtDigitoRifBusq').val();
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
	xmlhttp.open('POST','../Modelos/Scripts/TransitoRecepcionMP.ajax.php',true);
	xmlhttp.setRequestHeader('Content-type','application/x-www-form-urlencoded');
	/*DATOS A ENVIAR AL SCRIPT DE LA TABLA*/
	xmlhttp.send('ParamBusq=' + ParamBusq + '&Campo=' + Campo + '&Pagina=' + Pagina + '&TamanoPagina=' + TamanoPagina + '&VentPadre=' + VentPadre + '&Estatus=' + Estatus + '&IdMotivoCambioE=' + IdMotivoCambioE + '&IdMateriaPrima=' + IdMateriaPrima + '&FechaDesde=' + FechaDesde + '&FechaHasta=' + FechaHasta + '&FlujoProceso=' + FlujoProceso + '&VentPadre=' + VentPadre + '&IdProveedor=' + IdProveedor);
}

var date = new Date();
var Dia = ("0" + date.getDate()).slice(-2);
var Mes = ("0" + (date.getMonth() + 1)).slice(-2);
var FechaActual = (Dia) + "-" + (Mes) + '-' + date.getFullYear();

/*var FechaActual = new Date();
FechaActual = ( ('0' + FechaActual.getDate()).slice(-2) + "-" + (('0' + FechaActual.getMonth() +1)).slice(-2) + "-" + FechaActual.getFullYear());*/

function fValidarFechaF()
{
	var FechaI = $('#txtFechaInicio').val().split("-");
	FechaI = FechaI[2] + FechaI[1] + FechaI[0];
	var FechaF = $('#txtFechaFinal').val().split("-");
	FechaF = FechaF[2] + FechaF[1] + FechaF[0];
	if ( ( FechaF >= FechaI ) && ( !isNaN( FechaI ) && !isNaN( FechaF ) ) && ( FechaI != '' && FechaF != '' ) )
	{
		$('#spanMsjFechaF').css('display','none');
		return 1;
	}
	else
	{
		$('#spanMsjFechaF').css('display','block');
		$('#btnEnviar').attr('disabled','disabled');
		return 0;
	}
}

function fValidarFechaI()
{
	if ( $('#txtOperacion').val() == 'registrar' )
	{
		var FechaI = $('#txtFechaInicio').val().split("-");
		FechaI = parseInt( FechaI[2] + FechaI[1] + FechaI[0] );
		var FechaA = FechaActual.split("-");
		FechaA = parseInt( FechaA[2] + FechaA[1] + FechaA[0] );
		if ( FechaI >= FechaA && !isNaN( FechaI ) )
		{
			$('#spanMsjFechaI').css('display','none');
			return 1;
		}
		else
		{
			$('#spanMsjFechaI').css('display','block');
			$('#btnEnviar').attr('disabled','disabled');
			return 0;
		}
	}
	else 	{
		return 1;
	}
}

function fValidarVehProg()
{
	if ( $('#txtOperacion').val() == 'modificar' )
	{
		var VehProg = parseInt( $('#txtVehiculosProg').val() );
		var VehRecib = parseInt( $('#txtVehiculosRecib').val() );
		if ( ( VehProg >= VehRecib ) && ( !isNaN(VehProg) && !isNaN(VehRecib) ) )
		{
			$('#spanMsjVeh').css('display','none');
			return 1;
		}
		else 	{
			$('#btnEnviar').attr('disabled','disabled');
			$('#spanMsjVeh').css('display','block');
			return 0;
		}
	}
	else 	{
		return 1;
	}
}

/*EVENTOS DEL FORMULARIO*/
$('#txtFechaInicio').datepicker({
	autoclose: true,
	todayHighlight: true,
	format: 'dd-mm-yyyy',
	todayBtn: true
});

$('#txtFechaFinal').datepicker({
	autoclose: true,
	todayHighlight: true,
	format: 'dd-mm-yyyy',
	todayBtn: true
});

$('#RangoFechaBusq').datepicker({
    inputs: $('.RangoFechaBusq'),
    autoclose: true,
		todayHighlight: true,
		format: 'dd-mm-yyyy',
		todayBtn: true
});

$('#txtFechaInicio').change(function()
{
	$('#Form').data('formValidation').updateStatus($('#txtFechaInicio'), 'NOT_VALIDATED').validateField($('#txtFechaInicio'));
	fValidarFechaI();
	fValidarFechaF();
});

$('#txtFechaFinal').change(function()
{
	$('#Form').data('formValidation').updateStatus($('#txtFechaFinal'), 'NOT_VALIDATED').validateField($('#txtFechaFinal'));
	fValidarFechaF();
});

$('#btnPopUpProveedor').click(function()
{
	var PopUpProveedor;
  PopUpProveedor=window.open('proveedor.vis.php?Url=proveedor' + '&VentPadre=' + $('#txtUrl').val() ,'Proveedor','width=5000, height=2000, top=0, left=0, toolbar=no, location=no, status=no, menubar=no, scrollbar=yes');
  PopUpProveedor.focus();
});

$('#txtIdProveedor').change(function()	{
	fVerificarProvMP();
});

$('#cmbIdMateriaPrima').change(function()	{
	fVerificarProvMP();
});

$('#txtVehiculosProg').keyup(function()
{
	fValidarVehProg();
});
/************************/

function fEnviarDatos()
{
	if(Datos.estatus == '0'){
		swal('¡ERROR!' , 'No puede seleccionar un registro desactivado' , 'error');
	}
	else if(Datos.flujoproceso != '0'){
		swal('¡ERROR!' , 'Debe seleccionar un tránsito en curso' , 'error');
	}
	else if ( Datos.vehiculosrecib == Datos.vehiculosprog )	{
		swal('¡ERROR!' , 'Ya se han recibido todos los vehículos de este tránsito' , 'info');
	}
	else if(Datos.analisisext != '1' && $('#txtVentPadre').val() == 'analisisexternomp'){
		swal('¡ERROR!' , 'La materia prima seleccionada no requiere análisis externos' , 'error');
	}
	else if(Datos.totalvehanalizados == Datos.vehiculosprog && $('#txtVentPadre').val() == 'analisisexternomp'){
		swal('¡ERROR!' , 'Ya se han analizado todos los vehículos de este tránsito' , 'error');
	}
	else
	{
		if ( $('#txtVentPadre').val() == 'boletoentradarmp' )
		{
			if ( Datos.analisisext == '1' )
			{
				swal({   title: "¡Confirmar!",   text: "Seleccione un análisis externo",   type: "info",   showCancelButton: true,   confirmButtonText: "Aceptar",   cancelButtonText: "Cancelar",   closeOnConfirm: false }, 
        function()
        { 
        	opener.$('#txtIdTransitoRecepcionMP').val(Datos.idtransitorecepcionmp);
        	window.close();
					window.opener.fPopUpAnalisisExternoMP();
       	});
			}
			else
			{
				opener.$('#txtIdTransitoRecepcionMP').val(Datos.idtransitorecepcionmp);
				opener.$('#txtCodTransitoRecepcionMP').val(Datos.idtransitorecepcionmp);
				opener.$('#txtMateriaPrima').val(Datos.materiaprima.replace(/\+/g," "));
				opener.$('#txtRazonSocialProv').val(Datos.razonsocialprov.replace(/\+/g," "));
				opener.$('#txtIdMateriaPrima').val(Datos.idmateriaprima);
				opener.$('#txtIdAnalisisExternoMP').val('0');
				opener.$('.EF2').removeAttr('disabled');
				opener.$('#txtPesoRemEnt').attr('disabled','disabled');
				opener.$('#btnPopUpConductor').removeAttr('disabled');
				opener.$('#btnPopUpVehiculo').removeAttr('disabled');
				opener.$('#divPesajeExt').css('display','none');
				opener.$('#labelEnt').css('display','none');
				if ( opener.$('#txtTipoPesada').val() == '1' )
				{
					opener.$('#txtPesoVehEnt').removeAttr('disabled');
				}
				else if ( opener.$('#txtTipoPesada').val() == '0' )
				{
					opener.$('#txtPesoVehEnt').attr('disabled','disabled');
				}
				opener.$('.EFVaciable').val('');
				opener.document.getElementById('chxRemolque').checked = false;
				opener.$('#labelRemolque').removeClass('active');
				window.opener.fEnviarDatosTransitoAnalisisExtra();
				window.close();
			}
		}
		else
		{
			opener.$('#txtIdTransitoRecepcionMP').val(Datos.idtransitorecepcionmp);
			opener.$('#txtCodTransitoRecepcionMP').val(Datos.idtransitorecepcionmp);
			opener.$('#txtMateriaPrima').val(Datos.materiaprima.replace(/\+/g," "));
			opener.$('#txtRazonSocialProv').val(Datos.razonsocialprov.replace(/\+/g," "));
			opener.$('#txtIdMateriaPrima').val(Datos.idmateriaprima);
			opener.$('.EF2').removeAttr('disabled');
			window.opener.fEnviarDatosTransitoExtra();
			window.close();
		}
	}
}

$(document).ready(function(){
	if ( $('#txtVentPadre').val() != '' )
	{
		$('#spanAyudaBusq').html('LEYENDA: <br> - Seleccione un tránsito y pulse el boton enviar');
	}
});
	

/*VALIDACIONES DEL FORMULARIO*/
$(document).ready(function(){
	$('#Form').formValidation({
		message: 'Este valor no es valido',
		live: 'enabled',
		excluded: [':hidden', ':not(:visible)'],
		fields: {
			Observacion: {
				validators: {
					regexp: {
						regexp: /^[a-z-A-Z0-9-ZñÑáÁéÉíÍóÓúÚ ,.;:¡!¿?#$%&()"']+$/,
						message: 'Caracteres especiales permitidos: , . ; : ¡ ! ¿ ? # $ % & ()'
					}
				}
			},
			FechaInicio: {
				validators: {
					date: {
						format: 'DD-MM-YYYY',
						message: 'Formato: DD-MM-AAAA'
					}
				}
			},
			FechaFinal: {
				validators: {
					date: {
						format: 'DD-MM-YYYY',
						message: 'Formato: DD-MM-AAAA'
					}
				}
			},
			CantidadProg: {
				validators: {
					regexp: {
						regexp: /^[0-9]{1,20}[.]{1,1}[0-9]{1,2}$/,
						message: 'Ingrese un valor decimal (Use el punto (.) para separar decimales)'
					}
				}
			},
			VehiculosProg: {
				validators: {
					regexp: {
						regexp: /^[0-9]{1,2}$/,
						message: 'Solo números (2 dígitos máximo)'
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