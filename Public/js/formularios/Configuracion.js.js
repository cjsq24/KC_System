var Datos='';

function fLlenarCampos(Datos)
{
	$('#txtIdConfiguracion').val(Datos.idconfiguracion);
	$('#txtCpwd').val(Datos.cpwd.replace(/\+/g," "));
	$('#txtMinlpwd').val(Datos.minlpwd.replace(/\+/g," "));
	$('#txtMaxlpwd').val(Datos.maxlpwd.replace(/\+/g," "));	
	$('#txtMaxsu').val(Datos.maxsu.replace(/\+/g," "));
	$('#txtDibu').val(Datos.dibu.replace(/\+/g," "));
	$('#txtInsu').val(Datos.insu.replace(/\+/g," "));
	$('#txtMaxpregmos').val(Datos.maxpregmos.replace(/\+/g," "));
	if (Datos.minusclave == '1') {$('#Minusclave').attr('checked','checked');}else{$('#Minusclave1').attr('checked','checked');}
	if (Datos.mayusclave == '1') {$('#Mayusclave').attr('checked','checked');}else{$('#Mayusclave1').attr('checked','checked');}
	if (Datos.numclave == '1') {$('#Numclave').attr('checked','checked');}else{$('#Numclave1').attr('checked','checked');}
	if (Datos.especlave == '1') {$('#Especlave').attr('checked','checked');}else{$('#Especlave1').attr('checked','checked');$('#txtEspeciales').attr('readonly','readonly');}
	$('#txtEspeciales').val(Datos.especiales.replace(/\+/g," "));

	$('#txtNps').val(Datos.nps.replace(/\+/g," "));
	$('#txtIfi').val(Datos.ifi.replace(/\+/g," "));
	$('#txtDnc').val(Datos.dnc.replace(/\+/g," "));
	$('#txtHpwd').val(Datos.hpwd.replace(/\+/g," "));
	$('#txtRif').val(Datos.rif.replace(/\+/g," "));
	$('#txtRS').val(Datos.rs.replace(/\+/g," "));
	$('#txtMision').val(Datos.mision.replace(/\+/g," "));
	$('#txtVision').val(Datos.vision.replace(/\+/g," "));
	$('#txtRH').val(Datos.rh.replace(/\+/g," "));
	$('#txtEstatus').val(Datos.estatus);

	$('#txtrmpPesoNetoMin').val(Datos.rmppesonetomin.replace(/\+/g," "));
	$('#txtrmpPesoNetoMax').val(Datos.rmppesonetomax.replace(/\+/g," "));
	$('#txtrmpPesoVehVacMin').val(Datos.rmppesovehvacmin.replace(/\+/g," "));
	$('#txtrmpPesoVehVacMax').val(Datos.rmppesovehvacmax.replace(/\+/g," "));
	$('#txtrmpPesoRemVacMin').val(Datos.rmppesoremvacmin.replace(/\+/g," "));
	$('#txtrmpPesoRemVacMax').val(Datos.rmppesoremvacmax.replace(/\+/g," "));
	$('#txtrmpPesoVehLleMin').val(Datos.rmppesovehllemin.replace(/\+/g," "));
	$('#txtrmpPesoVehLleMax').val(Datos.rmppesovehllemax.replace(/\+/g," "));
	$('#txtrmpPesoRemLleMin').val(Datos.rmppesoremllemin.replace(/\+/g," "));
	$('#txtrmpPesoRemLleMax').val(Datos.rmppesoremllemax.replace(/\+/g," "));
	$('#txtrmpPesoDifMax').val(Datos.rmppesodifmax.replace(/\+/g," "));
	$('#txtrmpPesoVehVacDifMax').val(Datos.rmppesovehvacdifmax.replace(/\+/g," "));
	$('#txtrmpPesoRemVacDifMax').val(Datos.rmppesoremvacdifmax.replace(/\+/g," "));

	$('#cmbIdBalanzaSel').val(Datos.idbalanzasel);
	/*$('#txtBaudRate').val(Datos.baudrate);
	$('#txtDataBits').val(Datos.databits);
	$('#txtParity').val(Datos.parity);
	$('#txtStopBits').val(Datos.stopbits);
	$('#txtParametros').val(Datos.parametros);*/
}

$('#Especlave').click(function(){ $('#txtEspeciales').removeAttr('readonly');});
$('#Especlave1').click(function(){ $('#txtEspeciales').attr('readonly','readonly');});

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
	  cache: false, type: 'POST', dataType: 'json', url:'../Controladores/Configuracion.con.php',
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
			else if(response.Resultado == 'exitoso' && Operacion == 'buscar')
			{	           
	      	Datos=response.Datos;
	      	fAbrirModificacion();
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
				
				swal({ title: '¡OPERACION EXISTOSA!', text: response.Mensaje, type: 'success',  confirmButtonColor: '#DD6B55'});
	    
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
		{	swal('Info','No ha realizado ningún cambiot','info');}
	/*CONFIRMO LA OPERACION A EJECUTAR*/
	else	if (parseInt($('#txtMinlpwd').val())>parseInt($('#txtMaxlpwd').val()))
				{
					swal({   title: '¡Error!',   text: "Minima longitud no debe ser mayor a Maxima longitud de clave",type:'error',   showConfirmButton: true }, function(){  $('#txtMinlpwd').focus();  });
					}
	else	if (parseInt($('#txtDnc').val())>parseInt($('#txtCpwd').val()))
				{
					swal({ title: '¡Error!',   text: "Dias de notificar caducida clave no puede ser mayor a dias de caducida de clave",type:'error',   showConfirmButton: true }, function(){  $('#txtMinlpwd').focus();  });
					}
		else{
		swal({ title: '¡Confirmar!', text: '¿Confirma ejecutar la operación?', type: 'info', showCancelButton: true, closeOnConfirm: false, showLoaderOnConfirm: true, confirmButtonText: 'SI', cancelButtonText: 'NO' },function(){
			/*HABILITO LOS CAMPOS (LOS CAMPOS BLOQUEADOS NO SERAN ENVIADOS)*/
			$('.EF').removeAttr('disabled');	/*EJECUTO LA FUNCION AJAX*/fAjax($('#txtOperacion').val());
		});
	}
});

function fResetBusq()
{
	fCmbMotivoCEAjax('busqueda','');
	$('#txtBusqueda').focus();
}

/*FUNCIONES EXTRAS*/
function fRegistroExtra(){}
function fConsultaExtra(){}
function fModificacionExtra(){}
function fActivacionExtra(){}
function fDesactivacionExtra(){}
function fResetFormExtra(){}

/**/

/*VALIDAR SI SE HIZO ALGUN CAMBIO EN EL FORMULARIO PARA MODIFICAR*/
function fValidModificacion()
{
	if($('#txtRif').val() == Datos.rif && $('#txtRS').val() == Datos.RS )	{
		return 0;
	}
	else {
		return 1;
	}
}

/*ENVIA DATOS AL SCRIPT CON LA TABLA*/
function fTablaAjax()
{
	fAjax('buscar');
}

$('#cmbTipoConfig').change(function()
{

	$('#divConfigSeguridad').css('display','none');
	$('#divConfigEmpresa').css('display','none');
	$('#divConfigRMP').css('display','none');
	$('#divConfigBalanza').css('display','none');
	$('#'+$('#cmbTipoConfig').val()).fadeIn('slow');
});

//setTimeout(function(){ fTablaAjax(); }, 2000);