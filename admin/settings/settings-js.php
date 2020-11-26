<script>
    function updateSettings() {
        let data = new FormData(document.getElementById('settings-form'));
        data.append('action', 'update');
        data.append('linkFolder', 'settings');
        $.ajax({
            cache: false, type: 'POST', dataType: 'json', url: 'controller.php', processData: false, contentType: false,
            data: data,
            success: function(r) {
                if (r.result == 'success') {
                    swal('OPERACIÓN EXITOSA', 'Se ha modificado la configuración exitosamente', 'success');
                }
                else {
                    swal('ERROR', 'No se han modificado los datos', 'error');
                }
            },
            error: function(e) { /*ERROR DEL SERVIDOR*/
                swal('ERROR', 'Error en el servidor', 'error');
                console.log(e);
            }
        });
    }

    $('#send-btn').click( function() {
        swal({
            title: '¡Confirmar!',
            text: '¿Confirma modificar las configuraciones?',
            type: 'info', 
            showCancelButton: true,
            closeOnConfirm: false,
            showLoaderOnConfirm: true,
            confirmButtonText: 'SI',
            cancelButtonText: 'NO' 
        }, 
        function() {
            updateSettings();
        });
    })
</script>