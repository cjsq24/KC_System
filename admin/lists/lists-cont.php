<?php
    $obj = new Lists();
    $obj->idList        = $_POST['idList'];
    $obj->idParent      = ($_POST['idParent'] > 0) ? $_POST['idParent'] : 'NULL';
    $obj->name      	= mb_strtoupper($_POST['name'], 'UTF-8');
    $obj->keyName		= $_POST['keyName'];
    $obj->description 	= mb_strtoupper($_POST['description'], 'UTF-8');
    $obj->status 		= $_POST['status'];

    $result = 'invalid_data';
    if (!$obj->validate($action, $_POST, $Validate, $field)) goto fin;

	switch ($action)
	{
		//VERIFICO SI EL NOMBRE EXISTE
		case 'verify_if_exist':
            $result = ($obj->unique($field)) ? 'existe' : 'no_existe';
            $message = 'Este campo ya existe';
		break;
		case 'create':
            //VERIFICO que el name no este registrado.
            if (!$obj->unique('name') && !$obj->unique('keyName')) {
                $data['id'] = $obj->create();
                $result = ($data['id'] > 0) ? 'success' : 'failure';
            }
		break;
        case 'update':
            //Verifico que el registro esté activo (no se permite modificar registros inactivos) y la unicidad del campo.
			if ($obj->getStatus() == '1' && !$obj->unique('name') && !$obj->unique('keyName')) {
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