

function request(action)
{
	/*SERIALIZO EL FORMULARIO (CAMPOS) PARA ENVIARLO AL CONTROLADOR*/
	var str = $('#login-form').serialize();
	$.ajax({
        cache: false, type: 'POST', dataType: 'json', url:'login-cont.php',
        data: str + '&action=' + action,
        success: function(r) {
            $('#password').val('');
            if (r.result == 'exists' || r.result == 'existsWarning') {
                swal({ title: 'BIENVENID@', text: r.message, timer: 3000, showConfirmButton: false },
                function() { $(location).attr('href',r.src); });
            }
            else if (r.result == 'changePassword') {
                swal({
                    title: "BIENVENID@",
                    text: r.message,
                    type: "info",
                    showCancelButton: false,
                    confirmButtonColor: "#DD6B55",
                    confirmButtonText: "De acuerdo",
                    closeOnConfirm: true,
                    allowEscapeKey: false 
                },
                function(isConfirm) {
                    if (isConfirm) {
                        $(location).attr('href',r.src);
                    }
                });
                //swal({ title: 'BIENVENID@', text: r.message, timer: 3000, showConfirmButton: false },
                //function() { $(location).attr('href',r.src); });
            }
            else if (r.result == 'locked' || r.result == 'lockedByAttempts') {
                swal('Ingreso Fallido', r.message, 'error');
            }
            else if (r.result == 'not_exists') {
                swal('!ERROR!', 'Usuario o contraseña incorrecta', 'error');
            }
            else {
                swal('!ERROR!', r.message, 'error');
            }
        },
        error:function(e) {
            swal('!ERROR!', 'HA OCURRIDO UN ERROR CON EL SERVIDOR, VUELVA A INTENTAR.' , 'error');
            console.log(e)
        }
	});
}

$('#login-btn').click(function(e) {
    e.preventDefault();
    if ($('#email').val() != '' && $('#password').val() != '') {
        $('#error-span').addClass('d-none');
        request('login');
    }
    else {
        $('#error-span').removeClass('d-none');
    }
});