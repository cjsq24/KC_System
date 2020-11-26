var Form = document.Form;
var Datos="";

$('#chxCont1').click(function(){if(document.getElementById('chxCont1').checked === true)	{$('#txtContrasena').get(0).type = 'text';} else	{	$('#txtContrasena').get(0).type = 'password';	} });

$('#chxCont2').click(function(){	if(document.getElementById('chxCont2').checked == true)	{$('#txtContrasena1').get(0).type = 'text';	}	else	{$('#txtContrasena1').get(0).type = 'password';	}});

$('#btnCancelar').click(function(){	if($('#txtAct').val()=='1')	{$(location).attr('href',"../index.php");	} else { $(location).attr('href',"?Url=perfil&Modulo=PERFIL&Menu=PERFIL&VentPadre=&Tema=flat-white-green");	} });

/*ENVIO DE RECEPCION DE DATOS VIA AJAX*/
function fEnviarAjax(Operacion,Url)
{

	/*SERIALIZO EL FORMULARIO (CAMPOS) PARA ENVIARLO AL CONTROLADOR*/
	var str = $('#Form').serialize();
	$.ajax(
	{
	  cache: false, type: 'POST', dataType: 'json', url:Url,
	  data: str + '&Operacion='+Operacion,
	  success: function(response)
	  {	 
	  	if(response.Resultado == 'datos_invalidos')
		  	{ swal({ title: '¡DATOS INVÁLIDOS!', text: response.Mensaje , type: 'error', showCancelButton: false, confirmButtonColor: '#DD6B55', confirmButtonText: 'OK', closeOnConfirm: true, allowEscapeKey: false });	}
				else if(response.Resultado == 'fallido')
			  	{swal('¡ERROR!' , response.Mensaje , 'info');}
					else if(Operacion =='cambio' && response.Resultado == 'exitoso')
			  		{ if($('#txtAct').val()=='1' || $('#txtAct').val()=='2')
			  				{ swal({ title: '¡OPERACIÓN EXITOSA!', text: response.Mensaje , type: 'success', showCancelButton: false,confirmButtonColor: '#DD6B55', confirmButtonText: 'ACEPTAR', closeOnConfirm: true, allowEscapeKey: false },function(){ self.location="../index.php";});
			  				}else 
										{ swal({   title: '¡OPERACIÓN EXITOSA!',   text: "Cargando Perfil...",   timer: 3000,   showConfirmButton: false }, function(){  $(location).attr('href',"?Url=perfil&Modulo=PERFIL&Menu=PERFIL&VentPadre=&Tema=flat-white-green");  }); 
										}
						}
							else if(Operacion =='datos' && response.Resultado == 'exitoso')
							{

									Datos=response.Datos;

							}
	  },
	  error:function()
	  {
	  	/*ERROR DEL SERVIDOR*/
	    swal('!ERROR!', 'HA OCURRIDO UN ERROR CON EL SERVIDOR, VUELVA A INTENTAR' , 'error');
	  }
	});
}


function TieneValores(texto,expresion){
   for(i=0; i<texto.length; i++){
      if (expresion.indexOf(texto.charAt(i),0)!=-1){
         return 1;
      }
   }
   return 0;
}


/*EVENTO QUE SE ACTIVA CUANDO PULSO EL BOTON SUBMIT*/
$('#btnGuardar').on('click', function(e)
{	/*EVITO EL ENVIO DEL FORMULARIO*/

	var numeros="0123456789";
	var espe=Datos.especiales;
	var lminus="abcdefghijklmnñopqrstuvwxyz";
	var lmayus="ABCDEFGHIJKLMNÑOPQRSTUVWXYZ";
	var tespe="!¡\\\"#$%&'()*+,-./:;=¿?@[\]^_`{|}~"

	e.preventDefault();
	if(Form.Contrasena.value.length < Datos.minlpwd)
	{	
		alert("La Contraseña debe contener mas de "+Datos.minlpwd+" caracteres");	Form.Contrasena.focus();}
	else 
		if (Form.Contrasena.value.length > Datos.maxlpwd)
		{	alert("La Contraseña debe contener menos de  "+Datos.maxlpwd+" caracteres");	Form.Contrasena.focus();}
		else
			if (Datos.mayusclave == '1' && !TieneValores(Form.Contrasena.value,lmayus))
		{	alert("La Contraseña debe contener almenos un  Carater en Mayuscula");	Form.Contrasena.focus();}
		else
			if (Datos.mayusclave == '0' && TieneValores(Form.Contrasena.value,lmayus))
		{	alert("La Contraseña no debe contener ningun caracter en Mayuscula");	Form.Contrasena.focus();} 
		else
			if (Datos.minusclave == '1' && !TieneValores(Form.Contrasena.value,lminus))
		{	alert("La Contraseña debe contener almenos un caracter en Minuscula");	Form.Contrasena.focus();}
		else
			if (Datos.minusclave == '0' && TieneValores(Form.Contrasena.value,lminus))
		{	alert("La Contraseña no debe contener ningun caracter  en Minuscula");	Form.Contrasena.focus();}
		else
			if (Datos.numclave == '1' && !TieneValores(Form.Contrasena.value,numeros))
		{	alert("La Contraseña debe contener almenos un  Carater numerico");	Form.Contrasena.focus();}
		else
			if (Datos.numclave == '0' && TieneValores(Form.Contrasena.value,numeros))
		{	alert("La Contraseña no debe contener ningun caracter numerico");	Form.Contrasena.focus();}
		else
			if (Datos.especlave == '1' && !TieneValores(Form.Contrasena.value,espe))
		{	alert("La Contraseña debe contener almenos un Carater especial de los aceptados");	Form.Contrasena.focus();}
		else
			if (Datos.especlave == '0' && TieneValores(Form.Contrasena.value,tespe))
		{	alert("La Contraseña no debe contener ningun caracter especial");	Form.Contrasena.focus();}
		else
		if (Form.Contrasena.value!=Form.Contrasena1.value) {
			alert("La Contraseña ");	Form.Contrasena.focus();
		}
	else
		{	swal({ title: '¡Confirmar!', text: '¿Confirma ejecutar la operación?', type: 'info', showCancelButton: true, closeOnConfirm: false, showLoaderOnConfirm: true, confirmButtonText: 'SI', cancelButtonText: 'NO' },function()
			{	fEnviarAjax('cambio','../Controladores/Usuario.con.php');});
		}
});

	// fEnviarAjax('datos','../Controladores/Pwd.con.php');