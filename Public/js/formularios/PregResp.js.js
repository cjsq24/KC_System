var Form=document.Form;



$('#btnCancelar').click(function(){
	if($('#txtAct').val()=='1')	{
     $(location).attr('href',"../index.php");  

	} else { 
     $(location).attr('href',"?Url=perfil&Modulo=PERFIL&Menu=PERFIL&VentPadre=&Tema=flat-white-green");  
	}
	
});

/*ENVIO DE RECEPCION DE DATOS VIA AJAX*/
function fEnviarAjax(Operacion)
{
	/*SERIALIZO EL FORMULARIO (CAMPOS) PARA ENVIARLO AL CONTROLADOR*/
	var str = $('#Form').serialize();
	$.ajax(
	{
	  cache: false, type: 'POST', dataType: 'json', url:'../Controladores/Usuario.con.php',
	  data: str + '&Operacion='+Operacion,
	  success: function(response)
	  {
	  	/*MENSAJES*/
	  	/*SI LOS DATOS SON INVALIDOS, LO SACO DE LA PAGINA*/
	  	if(response.Resultado == 'datos_invalidos')
	  	{
	      swal({ title: '¡DATOS INVÁLIDOS!', text: response.Mensaje , type: 'error', showCancelButton: false, confirmButtonColor: '#DD6B55', confirmButtonText: 'OK', closeOnConfirm: true, allowEscapeKey: false },
	      function()
	      {
	      	//self.location="../index.php";
	      });
			}
			else if(response.Resultado == 'fallido')
	  	{
	      swal('¡ERROR!' , response.Mensaje , 'info');
			}else if(Operacion == 'olvido' &&response.Resultado == 'exitoso')
	  	{
	  	
						  	
	      swal({ title: '¡OPERACIÓN EXITOSA!', text: response.Mensaje , type: 'success', showCancelButton: false, confirmButtonColor: '#DD6B55', confirmButtonText: 'ACEPTAR', closeOnConfirm: true, allowEscapeKey: false },
	      function()
	      {
	      	self.location="cambioc.vis.php";
	      });
				
			}
			else if(Operacion == 'prcrear' || Operacion == 'prmodificar' &&response.Resultado == 'exitoso')
	  	{
	  	
				if($('#txtAct').val()=='1')	{
			  	
	      swal({ title: '¡OPERACIÓN EXITOSA!', text: response.Mensaje , type: 'success', showCancelButton: false, confirmButtonColor: '#DD6B55', confirmButtonText: 'ACEPTAR', closeOnConfirm: true, allowEscapeKey: false },
	      function()
	      {
	      	self.location="../index.php";
	      });
				}else {swal('¡success!' , '¡OPERACIÓN EXITOSA!' , 'info'); $(location).attr('href',"?Url=perfil&Modulo=PERFIL&Menu=PERFIL&VentPadre=&Tema=flat-white-green");  
			}

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
$('#btnGuardar').on('click', function(e)
{
	/*EVITO EL ENVIO DEL FORMULARIO*/
	e.preventDefault();

		swal({ title: '¡Confirmar!', text: '¿Confirma ejecutar la operación?', type: 'info', showCancelButton: true, closeOnConfirm: false, showLoaderOnConfirm: true, confirmButtonText: 'SI', cancelButtonText: 'NO' },function()
		{

	  	fEnviarAjax($('#txtOperacion').val());
		});
	
});


