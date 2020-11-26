var Datos='';


function fLlenarCampos(Datos)
{
	$('#txtIdDepartamento').val(Datos.iddepartamento);
	$('#txtNombre').val(Datos.nombre.replace(/\+/g," "));
	$('#txtDescripcion').val(Datos.descripcion.replace(/\+/g," "));
	$('#txtEstatus').val(Datos.estatus);
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
	alert(Operacion);
	/*SERIALIZO EL FORMULARIO (CAMPOS) PARA ENVIARLO AL CONTROLADOR*/
	var str = $('#Form').serialize();
	$.ajax(
	{
	  cache: false, type: 'POST', dataType: 'json', url:'Controladores/Validar.con.php',
	  data: str + '&Operacion=' + Operacion,
	  success: function(response)
	  {
	  	/*MENSAJES*/
	  	/*SI LOS DATOS SON INVALIDOS O HUBO UN ERROR EN LA OPERACION, ENVIO MENSAJE DE ERROR*/
	  	if(response.Resultado == 'datos_invalidos' || response.Resultado == 'fallido')
	  	{
	  		  		/*MUESTRO EL MENSAJE DE ERROR*/
	  		swal('!ERROR!', response.Mensaje, 'error');
	  	}
	  		else if (Operacion == 'buscar' && response.Resultado == 'exitoso') 
	  	{
	  		//swal('!ERROR!', response.Mensaje , 'success');
	  		swal({   title: response.Mensaje,   text: "Su session iniciara en 3 segundos.",   timer: 3000,   showConfirmButton: false }, function(){  $(location).attr('href',response.Dir);  });
	  		
	  		/*/$(location).attr('href',response.Dir);
	  		//window.location.replace(response.Dir);
	  		//self.location=response.Dir;*/

	  	} 
	  		else if(response.Resultado == 'datos_invalidos' || response.Resultado == 'fallido')
	  	{
	  		
	  		/*MUESTRO EL MENSAJE DE ERROR*/
	      swal('!ERROR!', response.Mensaje, 'error');
				}
			/*SI LA OPERACION FUE EXITOSA, MUESTRO MENSAJE Y MUESTRO EL REGISTRO*/
			
			  },
	  error:function()
	  {
	  	/*ERROR DEL SERVIDOR*/
	    swal('!ERROR!', 'HA OCURRIDO UN ERROR CON EL SERVIDOR, VUELVA A INTENTAR' , 'error');
	  }
	});
}

$('#bntAccess').click(function(e) {
  /*EVITO EL ENVIO DEL FORMULARIO*/
	e.preventDefault();
	/*SI LA OPERACION ES MODIFICAR, VERIFICO QUE HAYA REALIZADO ALGUN CAMBIO AL MENOS*/
	$('#txtOperacion').val('buscar');

		/*swal({ title: '¡Confirmar!', text: '¿Confirma ejecutar la operación?', type: 'info', showCancelButton: true, closeOnConfirm: false, showLoaderOnConfirm: true, confirmButtonText: 'SI', cancelButtonText: 'NO' },function()
		{
		 	
		});*/fAjax($('#txtOperacion').val());
});
/*EVENTO QUE SE ACTIVA CUANDO PULSO EL BOTON SUBMIT*/
$('#Form').on('success.form.fv', function(e)
{	
	//}
});





//setTimeout(function(){ fTablaAjax(); }, 2000);