var Datos='';
var i=0;

$("#reloader").click(function(){
		i++;
		l="captcha.php?u=";
		url=l+i;
    $("#imgcaptcha").removeAttr('src');
    $("#imgcaptcha").attr('src', url);

});

$('#idInicio').click(function()
{
	$('#divInicio').css('display','none');
	$('#divMision').css('display','none');
	$('#divVision').css('display','none');
	$('#divHistoria').css('display','none');
	$('#divGaleria').css('display','none');
	$('#divContactenos').css('display','none');
	$('#divProductos').css('display','none');
	
	$('#idInicio').addClass('active');
	$('#dropdown').removeClass('active');
	$('#idMision').removeClass('active');
	$('#idVision').removeClass('active');
	$('#idHistoria').removeClass('active');
	$('#idGaleria').removeClass('active');
	$('#idContactenos').removeClass('active');

	$('#bs-example-navbar-collapse-1').removeClass(' collapsed in');

	$('#navbarToggle').addClass(' collapsed');
	$('#bs-example-navbar-collapse-1').addClass(' collapsed');

	$("#navbarToggle").attr("aria-expanded","false");
	$("#bs-example-navbar-collapse-1").attr("aria-expanded","false");

	$('#divInicio').fadeIn('slow');
	$('body, html').animate({
		scrollTop: '0px'
		}, 300);
});

$('#idMision').click(function()
{
	$('#divInicio').css('display','none');
	$('#divMision').css('display','none');
	$('#divVision').css('display','none');
	$('#divHistoria').css('display','none');
	$('#divGaleria').css('display','none');
	$('#divContactenos').css('display','none');
	$('#divProductos').css('display','none');
	
	$('#idInicio').removeClass('active');
	$('#dropdown').addClass('active');
	$('#idMision').addClass('active');
	$('#idVision').removeClass('active');
	$('#idHistoria').removeClass('active');
	$('#idGaleria').removeClass('active');
	$('#idContactenos').removeClass('active');
	
	$('#bs-example-navbar-collapse-1').removeClass(' collapsed in');

	$('#navbarToggle').addClass(' collapsed');
	$('#bs-example-navbar-collapse-1').addClass(' collapsed');

	$("#navbarToggle").attr("aria-expanded","false");
	$("#bs-example-navbar-collapse-1").attr("aria-expanded","false");

	$('#divMision').fadeIn('slow');
	$('body, html').animate({
		scrollTop: '0px'
		}, 300);
});

$('#idVision').click(function()
{
	$('#divInicio').css('display','none');
	$('#divMision').css('display','none');
	$('#divVision').css('display','none');
	$('#divHistoria').css('display','none');
	$('#divGaleria').css('display','none');
	$('#divContactenos').css('display','none');
	$('#divProductos').css('display','none');
	
	$('#idInicio').removeClass('active');
	$('#dropdown').addClass('active');
	$('#idMision').removeClass('active');
	$('#idVision').addClass('active');
	$('#idHistoria').removeClass('active');
	$('#idGaleria').removeClass('active');
	$('#idContactenos').removeClass('active');
	
	$('#bs-example-navbar-collapse-1').removeClass(' collapsed in');

	$('#navbarToggle').addClass(' collapsed');
	$('#bs-example-navbar-collapse-1').addClass(' collapsed');

	$("#navbarToggle").attr("aria-expanded","false");
	$("#bs-example-navbar-collapse-1").attr("aria-expanded","false");

	$('#divVision').fadeIn('slow');
	$('body, html').animate({
		scrollTop: '0px'
		}, 300);
});

$('#idHistoria').click(function()
{
	$('#divInicio').css('display','none');
	$('#divMision').css('display','none');
	$('#divVision').css('display','none');
	$('#divHistoria').css('display','none');
	$('#divGaleria').css('display','none');
	$('#divContactenos').css('display','none');
	$('#divProductos').css('display','none');
	
	$('#idInicio').removeClass('active');
	$('#dropdown').addClass('active');
	$('#idMision').removeClass('active');
	$('#idVision').removeClass('active');
	$('#idHistoria').addClass('active');
	$('#idGaleria').removeClass('active');
	$('#idContactenos').removeClass('active');
	
	$('#bs-example-navbar-collapse-1').removeClass(' collapsed in');

	$('#navbarToggle').addClass(' collapsed');
	$('#bs-example-navbar-collapse-1').addClass(' collapsed');

	$("#navbarToggle").attr("aria-expanded","false");
	$("#bs-example-navbar-collapse-1").attr("aria-expanded","false");

	$('#divHistoria').fadeIn('slow');
	$('body, html').animate({
		scrollTop: '0px'
		}, 300);
});

$('#idGaleria').click(function()
{
	$('#divInicio').css('display','none');
	$('#divMision').css('display','none');
	$('#divVision').css('display','none');
	$('#divHistoria').css('display','none');
	$('#divGaleria').css('display','none');
	$('#divContactenos').css('display','none');
	$('#divProductos').css('display','none');
	
	$('#idInicio').removeClass('active');
	$('#dropdown').removeClass('active');
	$('#idMision').removeClass('active');
	$('#idVision').removeClass('active');
	$('#idHistoria').removeClass('active');
	$('#idGaleria').addClass('active');
	$('#idContactenos').removeClass('active');
	
	$('#bs-example-navbar-collapse-1').removeClass(' collapsed in');

	$('#navbarToggle').addClass(' collapsed');
	$('#bs-example-navbar-collapse-1').addClass(' collapsed');

	$("#navbarToggle").attr("aria-expanded","false");
	$("#bs-example-navbar-collapse-1").attr("aria-expanded","false");

	$('#divGaleria').fadeIn('slow');
	$('body, html').animate({
		scrollTop: '0px'
		}, 300);
	
	for(var i=0; i< imgGaleria.length; i++) {
		var $myNewElement = $('<div  class="col-lg-4 col-md-4 col-sm-6 col-xs-12 img-gallery"><a href="'+imgGaleria[i]+'" data-lightbox="galeria" data-title="Login"><img src="'+imgGaleria[i]+'" class="img-thumbnail"></a><div class="title">Login</div></div>');
	$myNewElement.appendTo('#divConGaleria');

        }
	

});

$('#idContactenos').click(function()
{
	$('#divInicio').css('display','none');
	$('#divMision').css('display','none');
	$('#divVision').css('display','none');
	$('#divHistoria').css('display','none');
	$('#divGaleria').css('display','none');
	$('#divContactenos').css('display','none');
	$('#divProductos').css('display','none');
	
	$('#idInicio').removeClass('active');
	$('#dropdown').removeClass('active');
	$('#idMision').removeClass('active');
	$('#idVision').removeClass('active');
	$('#idHistoria').removeClass('active');
	$('#idGaleria').removeClass('active');
	$('#idContactenos').addClass('active');
	
	$('#bs-example-navbar-collapse-1').removeClass(' collapsed in');

	$('#navbarToggle').addClass(' collapsed');
	$('#bs-example-navbar-collapse-1').addClass(' collapsed');

	$("#navbarToggle").attr("aria-expanded","false");
	$("#bs-example-navbar-collapse-1").attr("aria-expanded","false");

	$('#divContactenos').fadeIn('slow');
	$('body, html').animate({
		scrollTop: '0px'
		}, 300);
});

$('#idProductos').click(function()
{
	$('#divInicio').css('display','none');
	$('#divMision').css('display','none');
	$('#divVision').css('display','none');
	$('#divHistoria').css('display','none');
	$('#divGaleria').css('display','none');
	$('#divContactenos').css('display','none');
	$('#divProductos').css('display','none');
	
	$('#idInicio').removeClass('active');
	$('#dropdown').removeClass('active');
	$('#idMision').removeClass('active');
	$('#idVision').removeClass('active');
	$('#idHistoria').removeClass('active');
	$('#idGaleria').removeClass('active');
	$('#idContactenos').removeClass('active');
	
	$('#bs-example-navbar-collapse-1').removeClass(' collapsed in');

	$('#navbarToggle').addClass(' collapsed');
	$('#bs-example-navbar-collapse-1').addClass(' collapsed');

	$("#navbarToggle").attr("aria-expanded","false");
	$("#bs-example-navbar-collapse-1").attr("aria-expanded","false");

	$('#divProductos').fadeIn('slow');
	$('body, html').animate({
		scrollTop: '0px'
		}, 300);
});

$('#idIntranet').click(function()
{
	$('#bs-example-navbar-collapse-1').removeClass(' collapsed in');

	$('#navbarToggle').addClass(' collapsed');
	$('#bs-example-navbar-collapse-1').addClass(' collapsed');

	$("#navbarToggle").attr("aria-expanded","false");
	$("#bs-example-navbar-collapse-1").attr("aria-expanded","false");

	$('body, html').animate({
		scrollTop: '0px'
		}, 300);
});

function fAjax(Operacion)
{

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
	  	if (Operacion == 'datos' && response.Resultado == 'exitoso') {
	  			$('#divConMision').html("<P>"+response.Datos.mision);
	  			$('#divConVision').html("<P>"+response.Datos.vision);
	  			$('#divConHistoria').html("<P>"+response.Datos.rh);

	  	} 
	  		else if(response.Resultado == 'datos_invalidos' || response.Resultado == 'fallido')
	  	{
	  		  		/*MUESTRO EL MENSAJE DE ERROR*/
	  		swal('!ERROR!', response.Mensaje, 'error');
	  	}
	  	else if(Operacion == 'captcha' && response.Resultado == 'exitoso')
	  	{
	  			$('#txtOperacion').val('buscar');
				fAjax($('#txtOperacion').val());
	  	
				}else if(Operacion == 'olvido' && response.Resultado == 'exitoso')
	  	{
	  		
	  		swal({   title: response.Mensaje,   text: "Cargando Metodos de Recuperacion.",   timer: 3000,   showConfirmButton: false }, function(){  $(location).attr('href',response.Dir);  });
	  		
				}
	  		else if (Operacion == 'buscar' && response.Resultado == 'exitoso') 
	  	{
	  		//swal('!ERROR!', response.Mensaje , 'success');
	  		swal({   title: response.Mensaje,   text: "Su session iniciara en 3 segundos.",   timer: 3000,   showConfirmButton: false }, function(){  $(location).attr('href',response.Dir);  });
	  		
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
	$('#txtOperacion').val('captcha');
		fAjax($('#txtOperacion').val());
});
$('#Olvido').click(function(e) {
  /*EVITO EL ENVIO DEL FORMULARIO*/
	e.preventDefault();
	/*SI LA OPERACION ES MODIFICAR, VERIFICO QUE HAYA REALIZADO ALGUN CAMBIO AL MENOS*/
	$('#txtOperacion').val('olvido');
		fAjax($('#txtOperacion').val());
});

window.onload = function(){$('#txtOperacion').val('datos');fAjax($('#txtOperacion').val());}
//setTimeout(function(){ fTablaAjax(); }, 2000);