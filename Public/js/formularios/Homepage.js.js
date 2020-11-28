var Datos='';
var i=0;

$("#reloader").click(function(){
		i++;
		l="captcha.php?u=";
		url=l+i;
    $("#imgcaptcha").removeAttr('src');
    $("#imgcaptcha").attr('src', url);

});



function fAjax(action)
{
	/*SERIALIZO EL FORMULARIO (CAMPOS) PARA ENVIARLO AL CONTROLADOR*/
	var str = $('#Form').serialize();
	$.ajax(
	{
        cache: false, type: 'POST', dataType: 'json', url: 'Admin/login/login-cont.php',
        data: str + '&action=' + action,
        success: function(r)
        {
            if (action == 'login' && r.result == 'success') {
                if (r.result == 'success') {
                    swal({
                        title: 'ex',
                        text: "Cargando Sesión...",
                        timer: 3000,
                        showConfirmButton: false
                    },
                    function() {
                        $(location).attr('href',r.src);
                    });
                }
                else if (r.result == 'failed') {
                    swal('!ERROR!', 'Usuario o contraseña incorrecta', 'error');
                }
            }
            /*
            if(r.Resultado == 'datos_invalidos' || r.Resultado == 'fallido') {
                swal('!ERROR!', r.Mensaje, 'error');
            }
            else if(action == 'captcha' && r.Resultado == 'exitoso') {
                $('#txtaction').val('buscar');
                fAjax($('#txtaction').val());
            }
            else if(action == 'olvido' && r.Resultado == 'exitoso') {
	  		    swal({
                    title: r.Mensaje,
                    text: "Cargando Métodos de Recuperación.",
                    timer: 3000,
                    showConfirmButton: false
                },
                function() {
                    $(location).attr('href',r.Dir);
                });
			}*/	
		},
        error:function() {
            /*ERROR DEL SERVIDOR*/
            swal('!ERROR!', 'HA OCURRIDO UN ERROR CON EL SERVIDOR, VUELVA A INTENTAR' , 'error');
        }
	});
}

$('#login-btn').click(function() {
	fAjax('login');
});

$('#Olvido').click(function(e) {
  /*EVITO EL ENVIO DEL FORMULARIO*/
	e.preventDefault();
	/*SI Mado a vista recuperacion*/
	$('#txtaction').val('olvido');
		fAjax($('#txtaction').val());
});

//setTimeout(function(){ fTablaAjax(); }, 2000);