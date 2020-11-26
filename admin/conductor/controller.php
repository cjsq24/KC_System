<?php
	$HistorialM = '';
	$HistorialCE = '';
	$DetalleHistorialM = '';

	/*
	$tags = array_keys($_POST); // obtiene los nombres de las varibles
	$valores = array_values($_POST);// obtiene los valores de las varibles

	// crea las variables y les asigna el valor
	for($i=0;$i<count($tags);$i++){
		$$tags[$i]=$valores[$i]; 
	}
	*/

	

	$EnlaceMenu = 'DEPARTAMENTO';

	/*ARCHIVO PARA VERIFICAR EL ACCESO DE USUARIOS A MENÚS Y OPERACIONES*/
	//include('../configuracion/verify-access-controller.php');
	
	/*require('../Modelos/Acceso.cls.php');
	$objAcceso = new Acceso();
	session_start();
	if( isset( $_SESSION['idusuario'] ) )		{	
		if( $operacion != 'verificar_nombre' && $operacion != 'historialce' && $operacion != 'historialm' ) {
			if( $objAcceso -> fAccesoOperacion( $_SESSION['idusuario'] , $EnlaceMenu , $operacion ) != '1' )	{
				$operacion = 'acceso_denegado';
			}
		}
	}
	else 	{
		$operacion = 'acceso_denegado';
	}*/

	/*CLASE QUE HACE LA CONEXION CON LA BASE DE DATOS*/
	require('../Modelos/Departamento.cls.php');
	$objDepartamento = new Departamento();

	include('../configuracion/get-set-values.php');

	//$objDepartamento->nombre = $nombre;

	/*CLASE QUE TAMBIEN HACE LA CONEXION (REGISTRA Y CONSULTA LOS CAMBIOS DE ESTATUS*/
	/*require('../Modelos/Historial.cls.php');
	$objHistorial = new Historial();*/

	/*ENVIO LOS DATOS DEL CONDUCTOR A LA CLASE*/
	//$Validacion = $objDepartamento -> fSetValidar($operacion,$iddepartamento,$nombre,$descripcion,$estatus,$_SESSION['idusuario'],$IdMotivoCambioE,$DescripcionCambioE);

	$Validacion = '1';

	switch ($operacion)
	{
		/*VERIFICO SI EL NOMBRE EXISTE*/
		case 'verificar_nombre':
			$Resultado = 'datos_invalidos';
			$Mensaje = 'Ingrese un nombre válido';
			if($Validacion == '1')
			{
				if( $objDepartamento -> fVerificarNombre() == '0' ){
					$Resultado = 'no_existe';
				}
				else{
					$Resultado = 'existe';
					$Mensaje = 'El nombre que ha ingresado ya esta registrado, ¿Desea verificar el registro?';
				}
			}
		break;
		case 'registrar':
			$Resultado = 'datos_invalidos';
			$Mensaje = 'Datos Inválidos';

			/*Si los datos son validos*/
			if($Validacion == '1')
			{
				$Mensaje = 'El nombre que ha registrado ya existe';
				/*VERIFICO que el nombre no este registrada*/
				if( $objDepartamento -> fVerificarNombre() == '0' )
				{
					if( $objDepartamento -> fRegistrar() == '1' )
					{
						$Resultado = 'exitoso';
						$Mensaje = 'El departamento ha sido registrado exitosamente, ¿Desea verificar el registro?';
					}
					else 
					{
						$Resultado = 'fallido';
						$Mensaje = 'No se ha podido guardar el registro';
					}
				}
			}
		break;
		case 'modificar':
			$Resultado = 'datos_invalidos';
			$Mensaje = 'Datos Inválidos';

			/*Si los datos son validos*/
			if($Validacion == '1')
			{
				if( $objDepartamento -> fVerificarEstatus() == '1' )
				{
					$Mensaje = 'El nombre que ha ingresado ya esta registrado';
					/*Verifico que el nombre y el id CONCUERDEN, DE LO CONTRARIO, NO EFECTÚO LA MODIFICACIÓN PORQUE ESTAN ALTERANDO LOS DATOS*/
					if( $objDepartamento -> fVerificarNombre() == '0')
					{
						/*Ejecuto la Modificacion*/
						if( $objDepartamento -> fModificar() == '1' )
						{
							$Resultado = 'exitoso';
							$Mensaje = 'El registro del departamento ha sido modificado exitosamente, ¿Desea verificar el registro?';
						}
						else{
							$Resultado = 'fallido';
							$Mensaje = 'No se ha podido modificar el registro del departamento';
						}
					}
				}
			}
		break;
		case 'activar':
			$Resultado = 'datos_invalidos';
			$Mensaje = 'Datos Inválidos';

			if($Validacion == '1')
			{
				/*VERIFICO LA INTEGRIDAD ENTRE EL NOMBRE Y EL ID*/
				/*VERIFICO EL ESTATUS ACTUAL DEL REGISTRO, DEBE SER '1'*/
				/*VERIFICO LA INTEGRIDAD DEL MOTIVO DE ACTIVACIÓN*/
				if( $objDepartamento -> fVerificarIdNombre() == '1' && $objDepartamento -> fVerificarEstatus() == '0' && $objHistorial -> fVerificarIntegridadMotivo($IdMotivoCambioE,$EnlaceMenu,'1') == '1' )
				{
					$Resultado = 'fallido';
					$Mensaje = 'No se ha podido activar el registro del departamento';
					/*Si EL CAMBIO DE ESTATUS fue exitosa, REGISTRO EL CAMBIO EN EL HISTORIAL DE CAMBIOS DE ESTATUS (THISTORIALCE)*/
					if( $objDepartamento -> fActivar() == '1')
					{
						/*Inserto en la tabla THISTORIALCE, y le envio los parametros que necesita*/
						$Respuesta = $objHistorial -> fRegistrarCE($iddepartamento,$IdMotivoCambioE,$DescripcionCambioE,$_SESSION['idusuario'],'tdepartamento','1');

						/*Si el registro de la activación fue fallido, entonces le devuelvo el estatus anterior al registro, sino entonces la operacion fue exitosa*/
						if($Respuesta == '0')
						{
							$objDepartamento -> fDesactivar();
							$Resultado = 'fallido';
						}
						else
						{
							$Resultado = 'exitoso';
							$Mensaje = 'Se ha activado el registro del departamento exitosamente, ¿Desea verificar el registro?';
						}
					}
				}
			}
		break;
		case 'desactivar':
			$Resultado = 'datos_invalidos';
			$Mensaje = 'Datos Inválidos';

			if($Validacion == '1')
			{
				/*VERIFICO LA INTEGRIDAD ENTRE EL NOMBRE Y EL ID*/
				/*VERIFICO EL ESTATUS ACTUAL DEL REGISTRO, DEBE SER '0'*/
				/*VERIFICO LA INTEGRIDAD DEL MOTIVO DE DESACTIVACION*/
				if( $objDepartamento -> fVerificarIdNombre() == '1' && $objDepartamento -> fVerificarEstatus() == '1' && $objHistorial -> fVerificarIntegridadMotivo($IdMotivoCambioE,$EnlaceMenu,'0') == '1' )
				{
					$Resultado = 'fallido';
					$Mensaje = 'No se ha podido desactivar el registro del departamento';
					/*Ejecuto LA ACTIVACION*/
					if( $objDepartamento -> fDesactivar() == '1' )
					{
						/*Si EL CAMBIO DE ESTATUS fue exitosa, REGISTRO EL CAMBIO EN EL HISTORIAL DE CAMBIOS DE ESTATUS (THISTORIALCE)*/
						/*Inserto en la tabla THISTORIALCE, y le envio los parametros que necesita*/
						if( $objHistorial -> fRegistrarCE($iddepartamento,$IdMotivoCambioE,$DescripcionCambioE,$_SESSION['idusuario'],'tdepartamento','0') == '0' )
						{
							/*Si el registro de desactivacion fue fallido, entonces le devuelvo el estatus anterior al registro, sino entonces la operacion fue exitosa*/
							$objDepartamento -> fActivar();
							$Resultado = 'fallido';
						}
						else
						{
							$Resultado = 'exitoso';
							$Mensaje = 'Se ha desactivado el registro del departamento exitosamente, ¿Desea verificar el registro?';
						}
					}
				}
			}
		break;
		case 'historialce':
			$Resultado = 'datos_invalidos';
			$Mensaje = 'Datos inválidos, no se ha podido verificar el historial de cambios de estatus';
			
			if($Validacion == '1')
			{
				$Resultado = '';
				/*VERIFICO QUE EL USUARIO TENGA ACCESO AL HISTORIAL, SINO LO TIENE, SIMPLEMENTE NO SE MUESTRA (NO SE DA NINGUN MSJ DE ERROR)*/
				if( $objAcceso -> fAccesoOperacion( $_SESSION['idusuario'] , $EnlaceMenu , $operacion ) == '1' )
				{	
					/*VERIFICO SI EXISTE HISTORIAL DE CAMBIOS DE ESTATUS PARA ESTE REGISTRO*/
					$HistorialCE = $objHistorial -> fHistorialCE($iddepartamento,'tdepartamento');

					$Resultado = '';
					if( $HistorialCE[0]['Resultado'] == '1' ) {
						$Resultado = 'existe';
					}
				}
			}
		break;
		case 'historialm':
			$Resultado = 'datos_invalidos';
			$Mensaje = 'Datos inválidos, no se ha podido verificar el historial de modificación';

			if($Validacion == '1')
			{
				$Resultado = '';
				/*VERIFICO QUE EL USUARIO TENGA ACCESO AL HISTORIAL, SINO LO TIENE, SIMPLEMENTE NO SE MUESTRA (NO SE DA NINGUN MSJ DE ERROR)*/
				if( $objAcceso -> fAccesoOperacion( $_SESSION['idusuario'] , $EnlaceMenu , $operacion ) == '1' )
				{
					/*VERIFICO SI EXISTE HISTORIAL DE MODIFICACIONES PARA ESTE REGISTRO*/
					$HistorialM = $objHistorial -> fHistorialM($iddepartamento,'tdepartamento');

					$Resultado = '';
					if( $HistorialM[0]['Resultado'] == '1' )
					{
						$Resultado = 'existe';
						/*EXTRAIGO EL DETALLE DE LAS MODIFICACIONES DE ESTE REGISTRO*/
						$DetalleHistorialM = $objHistorial -> fDetalleHistorialM($HistorialM);
					}
				}
			}
		break;
		/*OBLIGATORIO*/
		case 'consultar':
			$Resultado = '';
			$Mensaje = '';
		break;
		case 'acceso_denegado':
			$Resultado = 'acceso_denegado';
			$Mensaje = 'ERROR, acceso denegado';
		break;
		default:
			$Resultado = 'datos_invalidos';
			$Mensaje = 'Datos inválidos, no se ha efectuado ninguna operación';
		break;
	}
	
	/*ARREGLO QUE ENVIARA LOS DATOS AL JS*/
	$salidaJson = array('Resultado' => $Resultado,'Mensaje' => $Mensaje,'HistorialCE' => $HistorialCE,'HistorialM' => $HistorialM,'DetalleHistorialM' => $DetalleHistorialM);
	echo json_encode($salidaJson);
?>