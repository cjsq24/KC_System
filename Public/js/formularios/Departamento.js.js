var data = '';
var rowTable = {nombre:"Nombre", descripcion:"Descripción"};
var rowTooltip = {nombre:"Nombre Tooltip"};

$('#nombre').focusout(function() {
	verifyIfExist('verificar_nombre', 'nombre');
});

/*EVENTO QUE SE ACTIVA CUANDO PULSO EL BOTON SUBMIT*/
$('#send-btn').click( function()
{
	/*SI LA OPERACION ES MODIFICAR, VERIFICO QUE HAYA REALIZADO ALGUN CAMBIO AL MENOS*/
	if ($('#operacion').val() == 'modificar' && validateModify(data) == 0)
	{
		$("#alertForm-div").show();
		$("#alertForm-span").html("No ha realizado ningún cambio")
		/*swal('Info','No ha realizado ningún cambio','info');*/
	}
	/*CONFIRMO LA OPERACION A EJECUTAR*/
	else	
	{
		swal (
		{
			title: '¡Confirmar!',
			text: '¿Confirma ejecutar la operación?',
			type: 'info', 
			showCancelButton: true,
			closeOnConfirm: false,
			showLoaderOnConfirm: true,
			confirmButtonText: 'SI',
			cancelButtonText: 'NO' 
		},
		function()
		{
			/*HABILITO LOS CAMPOS (LOS CAMPOS BLOQUEADOS NO SERAN ENVIADOS)*/
			$('.input-form').removeAttr('disabled');
			/*EJECUTO LA FUNCION AJAX*/
			sendData ($('#operacion').val());
		});
	}
});

/*FUNCIONES EXTRAS*/
//function showRegistryExtra(){}
//function showConsultExtra(){}
//function showUpdateExtra(){}
//function showActivationExtra(){}
//function showDesactivationExtra(){}
//function resetFormExtra(){}
//function resetSearchExtra(){}
function existsExtra( operacion, mensaje )
{
	if ( operacion == "verificar_nombre" )
	{
		$( "#nombre" ).addClass( "is-invalid" );
		$( "#nombre-valid" ).html( "Este nombre ya existe" );
	}
}

/**/

/*VALIDAR SI SE HIZO ALGUN CAMBIO EN EL FORMULARIO PARA MODIFICAR*/
/*function validateModify()
{
	if($('#nombre').val() == data.nombre && $('#txtDescripcion').val() == data.descripcion )	{
		return 0;
	}
	else {
		return 1;
	}
}*/

/*ENVIA DATOS AL SCRIPT CON LA TABLA*/
function tableAjax()
{
	var inputs = $('.input-search').serialize();
	$.ajax (
	{
		cache: false, type: "POST", dataType: "json", url:"../Modelos/Scripts/Departamento.ajax.php",
		data: inputs + '&rowTD=' + convertArray2Php(rowTD),
		success: function (response)
		{
			dataRow = response.dataRow;
			$('#tbody-table').html(response.dataTable);
			$('#anterior-table').html(response.footerTable['anterior']);
			$('#paginas-table').html(response.footerTable['paginas']);
			$('#siguiente-table').html(response.footerTable['siguiente']);
			$('#totalPaginas-table').html(response.footerTable['totalPaginas']);
			$('#totalRegistros-table').html('Total de Registros:' + response.footerTable['totalRegistros']);
			$('#paginas2-table').css('display','');
		},
		error:function () { alert( "error" ); }
	});
}