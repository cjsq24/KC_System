<?php
    $obj = new Modules();
    require('../Settings/php/GetValuesFormInController.php');
    $obj->idParent = ($_POST['idParent'] > 0) ? $_POST['idParent'] : 'NULL';

    $result = 'invalid_data';
    if (!$obj->validate($action, $_POST, $Validate, $field)) goto fin;
    
	switch ($action)
	{
		//VERIFICO SI EL NOMBRE EXISTE
		case 'verify_if_exist':
            $result = ($obj->unique($field)) ? 'existe' : 'no_existe';
            $message = 'Este nombre ya existe';
		break;
		case 'create':
            //VERIFICO que el nombre no esté registrado. Envío el id registrado para incluirlo al select idParent de la vista
            if (!$obj->unique('name')) {
                $data['id'] = $obj->create();
                $result = ($data['id'] > 0) ? 'success' : 'failure';
            }
		break;
        case 'update':
            //Verifico que el registro esté activo (no se permite modificar registros inactivos) y la unicidad del campo.
            if ($obj->getStatus() == '1' && !$obj->unique('name')) {
                $result = ($obj->update()) ? 'success' : 'failure';
            }
		break;
        case 'activate':
            //Verifico si el registro está inactivo
            if ($obj->getStatus() == '0') {
                $result = $obj->changeStatus('activate') ? 'success' : 'failure';
            }
		break;
        case 'inactivate':
            //Verifico si el registro está activo
            if ($obj->getStatus() == '1') {
                $result = $obj->changeStatus('inactivate') ? 'success' : 'failure';
            }
		break;
	}
	fin:
?>