<?php
    $obj = new Menus();

    for ($i = 0; $i < $contTags; $i ++) { $obj->{$tags[$i]} = $values[$i]; }
    $obj->name 		  = mb_strtoupper($_POST['name'], 'UTF-8');
    $obj->description = mb_strtoupper($_POST['description'], 'UTF-8');
    if ($action != 'verify_if_exist') {
        $obj->actions = implode(',', $_POST['actions']);
    }

    /*$obj->idMenu 		= $idMenu;
    $obj->idIcon 		= $idIcon;
    $obj->idModule 		= $idModule;
    $obj->name 			= mb_strtoupper($name, 'UTF-8');
    $obj->link 			= $link;
    $obj->description   = mb_strtoupper($description, 'UTF-8');
    $obj->status 		= $status;
    if ($action != 'verify_if_exist') {
        $obj->actions = implode(',', $actions);
    }*/

    $result = 'invalid_data';
    if (!$obj->validate($action, $_POST, $Validate, $field)) goto fin;

	switch ($action)
	{
		//VERIFICO SI EL NOMBRE EXISTE
		case 'verify_if_exist':
            $result = ($obj->unique($field)) ? 'existe' : 'no_existe';
            if      ($field == 'name') $message = 'Este nombre ya existe';
            else if ($field == 'link') $message = 'Este enlace ya existe';
		break;
		case 'create':
            //VERIFICO que el nombre y el link no esten registrados, y verifico que las operaciones sean válidas.
            if ($obj->unique('name') || $obj->unique('link') || !$obj->verifyActions()) goto fin;
            $data['id'] = $obj->create();
            $result = ($data['id'] > 0) ? 'success' : 'failure';
		break;
        case 'update':
            //Verifico que el registro esté activo, los campos unique y valido las operaciones.
            if ($obj->getStatus() != '1' || $obj->unique('name') || $obj->unique('link') || !$obj->verifyActions()) goto fin;
            $result = ($obj->update()) ? 'success' : 'failure';
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