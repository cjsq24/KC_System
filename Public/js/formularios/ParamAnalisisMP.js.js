var Datos='';

function fLlenarCampos(Datos)
{
	$('#txtIdParamAnalisisMP').val(Datos.idparamanalisismp);
	$('#cmbIdMateriaPrima').val(Datos.idmateriaprima);
	fLlenarInputs();
	$('#txtEstatus').val(Datos.estatus);
}

function fLlenarInputs()
{
	$('.EFParam').attr('disabled','disabled');
	for ( var i = 1; i <= PosParam; i ++ )
	{
		if ( Datos['IdAnalisis' + i] != undefined )
		{
			$('#labelSelec_'+i).addClass('active');
			/*$('#chxSelec_'+i).attr('checked','checked');*/
			document.getElementById('chxSelec_'+i).checked = true;
			$('#txtMin_'+i).val( Datos['Minimo' +i] );
			$('#txtMax_'+i).val( Datos['Maximo' +i] );
			if ( Datos['Oblig'+i] == '1' )
			{
				$('#labelOblig_'+i).addClass('active');
				$('#chxOblig_'+i).attr('checked','checked');
			}

			if ( $('#txtOperacion').val() == 'modificar' )
			{
				$('#txtMin_'+i).removeAttr('disabled');
				$('#txtMax_'+i).removeAttr('disabled');
				$('#labelOblig_'+i).removeAttr('disabled');
				$('.labelSelec').removeAttr('disabled');
			}
		}
	}

	if ( $('#txtOperacion').val() == 'consultar' )
	{
		$('.labelSelec').attr('disabled','disabled');
	}
}

function fVerificarMP()
{
	if ( $('#txtOperacion').val() == 'registrar' && $('#cmbIdMateriaPrima').val() != '' )	{
		fAjax('verificar_mp');
	}
	else if ( $('#txtOperacion').val() == 'modificar' && $('#cmbIdMateriaPrima').val() != Datos.idmateriaprima.replace(/\+/g," ") && $('#cmbIdMateriaPrima').val() != '' )	{
		fAjax('verificar_mp');
	}
}

/*ENVIO DE RECEPCION DE DATOS VIA AJAX*/
function fAjax(Operacion)
{
	/*SERIALIZO EL FORMULARIO (CAMPOS) PARA ENVIARLO AL CONTROLADOR*/
	var str = $('#Form').serialize();
	$.ajax(
	{
	  cache: false, type: 'POST', dataType: 'json', url:'../Controladores/ParamAnalisisMP.con.php',
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
			else if(response.Resultado == 'existe' && Operacion == 'verificar_mp')
			{
	      swal({ title: '¡ALERTA!', text: response.Mensaje, type: 'info', showCancelButton: true, cancelButtonText: 'NO', confirmButtonColor: '#DD6B55', confirmButtonText: 'SI', closeOnConfirm: true },function()	
	      {
	      	$('#cmbIdMateriaPrimaBusq').val($('#cmbIdMateriaPrima').val());
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
		      	$('#cmbIdMateriaPrimaBusq').val($('#cmbIdMateriaPrima').val());
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
	$('.EFParam').attr('disabled','disabled');
}
function fConsultaExtra()
{
	
}
function fModificacionExtra()
{
	
}
function fActivacionExtra(){}
function fDesactivacionExtra(){}
function fResetFormExtra()
{
	$('.chxSelec').removeAttr('checked');
	$('.labelSelec').removeAttr('checked');
	$('.labelSelec').removeClass('active');
	$('.labelSelec').removeAttr('disabled');
	$('.labelOblig').removeAttr('checked');
	$('.labelOblig').removeClass('active');
	$('.EFParam').removeClass('CampoValido');
	$('.EFParam').removeClass('CampoInvalido');
	$('.Msj-Error').css('display','none');
	$('#txtIdParamAnalisisMP').val('');
}

/**/

/*VALIDAR SI SE HIZO ALGUN CAMBIO EN EL FORMULARIO PARA MODIFICAR*/
function fValidModificacion()
{
	if($('#cmbIdMateriaPrima').val() == Datos.idmateriaprima )	{
		return 1;
	}
	else {
		return 1;
	}
}

/*ENVIA DATOS AL SCRIPT CON LA TABLA*/
function fTablaAjax()
{
	var xmlhttp;
	var Formulario = $('#txtFormulario').val();
	var VentPadre = $('#txtVentPadre').val();
	var Pagina = $('#txtPagina').val();
	var TamanoPagina = $('#txtTamanoPagina').val();
	var Estatus = $('#cmbEstatus').val();
	var IdMotivoCambioE = $('#cmbIdMotivoCambioEBusq').val();
	
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
	xmlhttp.open('POST','../Modelos/Scripts/ParamAnalisisMP.ajax.php',true);
	xmlhttp.setRequestHeader('Content-type','application/x-www-form-urlencoded');
	/*DATOS A ENVIAR AL SCRIPT DE LA TABLA*/
	xmlhttp.send('Pagina=' + Pagina + '&TamanoPagina=' + TamanoPagina + '&VentPadre=' + VentPadre + '&Estatus=' + Estatus + '&IdMotivoCambioE=' + IdMotivoCambioE + '&IdMateriaPrima=' + $('#cmbIdMateriaPrimaBusq').val());
}

function fSelec(ID)
{
	
	if( document.getElementById( 'chxSelec_' + ID ).checked == true )
	{
		$('#txtMin_' + ID).attr('disabled','disabled');
		$('#txtMin_' + ID).val('');
		$('#txtMin_' + ID).removeClass('CampoValido');
		$('#txtMin_' + ID).removeClass('CampoInvalido');
		$('#txtMax_' + ID).attr('disabled','disabled');
		$('#txtMax_' + ID).val('');
		$('#txtMax_' + ID).removeClass('CampoValido');
		$('#txtMax_' + ID).removeClass('CampoInvalido');
		$('#labelOblig_' + ID).attr('disabled','disabled');
		$('#labelOblig_' + ID).removeClass('active');
		$('#chxOblig_' + ID).removeAttr('checked');
		$('#smallValidDec1' + ID).css('display','none');
		$('#smallValidDec2' + ID).css('display','none');
		$('#smallValidMinMax1' + ID).css('display','none');
		$('#smallValidMinMax2' + ID).css('display','none');
	}
	else
	{
		$('#txtMin_' + ID).removeAttr('disabled');
		$('#txtMax_' + ID).removeAttr('disabled');
		$('#labelOblig_' + ID).removeAttr('disabled');
	}
}

function fValidInputMin(ID)
{
	var Expresion = /[0-9]{1,3}[.]{1,1}[0-9]{1,1}/;
	var Min = parseFloat($('#txtMin_'+ID).val());
	var Max = parseFloat($('#txtMax_'+ID).val());

	if ( Expresion.test( $('#txtMin_'+ID).val() ) == true )
	{
		$('#smallValidDec1'+ID).css('display','none');
		$('#txtMin_'+ID).removeClass('CampoInvalido');
		$('#txtMin_'+ID).addClass('CampoValido');
	}
	else
	{
		$('#smallValidDec1'+ID).css('display','block');
		$('#txtMin_'+ID).removeClass('CampoValido');
		$('#txtMin_'+ID).addClass('CampoInvalido');
	}
	
	if ( Min > Max )
	{
		$('#smallValidMinMax1'+ID).css('display','block');
	}
	else
	{
		$('#smallValidMinMax1'+ID).css('display','none');
		$('#smallValidMinMax2'+ID).css('display','none');
	}
}

function fValidInputMax(ID)
{
	var Expresion = /[0-9]{1,3}[.]{1,1}[0-9]{1,1}/;
	var Min = parseFloat($('#txtMin_'+ID).val());
	var Max = parseFloat($('#txtMax_'+ID).val());

	if ( Expresion.test( $('#txtMax_'+ID).val() ) == true )
	{
		$('#smallValidDec2'+ID).css('display','none');
		$('#txtMax_'+ID).removeClass('CampoInvalido');
		$('#txtMax_'+ID).addClass('CampoValido');
	}
	else
	{
		$('#smallValidDec2'+ID).css('display','block');
		$('#txtMax_'+ID).removeClass('CampoValido');
		$('#txtMax_'+ID).addClass('CampoInvalido');
	}
	
	if ( Min > Max )
	{
		$('#smallValidMinMax2'+ID).css('display','block');
	}
	else
	{
		$('#smallValidMinMax2'+ID).css('display','none');
		$('#smallValidMinMax1'+ID).css('display','none');
	}
}

$('#cmbIdMateriaPrima').change(function()
{
	fVerificarMP();
});

/*VALIDACIONES DEL FORMULARIO*/
$(document).ready(function(){
	$('#Form').formValidation({
		message: 'Este valor no es valido',
		live: 'enabled',
		excluded: [':hidden', ':not(:visible)'],
		fields: {
			HumedadMin: {
				row: '.HumedadMin',
				validators: {
					regexp: {
						regexp: /^[0-9]{1,2}[.]{1,1}[0-9]{1,1}$/,
						message: 'Ingrese el valor en porcentaje, ejemplo: 15.2'
					},
					notEmpty: {
						message: ''
					}
				}
			},
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