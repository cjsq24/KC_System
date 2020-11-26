<?php
    $obj = new Profiles();
    for ($i = 0; $i < $contTags; $i ++) { $obj->{$tags[$i]} = $values[$i]; }
    $obj->idMenu = (isset($_POST['idMenu'])) ? implode(',', $_POST['idMenu']) : '';

    $result = 'invalid_data';
    if (!$obj->validate($action, $_POST, $Validate)) goto fin;
    
	switch ($action)
	{
		//VERIFICO SI EL NOMBRE EXISTE
		case 'verify_if_exist':
            $result = ($obj->unique($field)) ? 'existe' : 'no_existe';
            $message = 'Este nombre ya existe';
		break;
		case 'create':
            if ($obj->unique('name')) goto fin;
            $values = [];
            foreach ($_POST['idMenu'] as $key => $menu) {
                $c = ($key > 0) ? ',' : '';
                $values[$key][0] = "$c(";
                if (!isset($_POST['access'.$menu])) goto fin;
                if (!$obj->verifyActions($_POST['access'.$menu])) goto fin;
                $access = implode(',', $_POST['access'.$menu]);
                $values[$key][2] = ", $menu, '$access')";
            }
            $data['id'] = $obj->create($values);
            $result = ($data['id'] > 0) ? 'success' : 'failure';
		break;
        case 'update':
            //Verifico que el registro esté activo (no se permite modificar registros inactivos) y la unicidad del campo.
            if ($obj->getStatus() != '1' || $obj->unique('name')) goto fin;
            $values = [];
            foreach ($_POST['idMenu'] as $key => $menu) {
                $c = ($key > 0) ? ',' : '';
                $values[$key][0] = "$c(";
                if (!isset($_POST['access'.$menu])) goto fin;
                if (!$obj->verifyActions($_POST['access'.$menu])) goto fin;
                $access = implode(',', $_POST['access'.$menu]);
                $values[$key][2] = ", $menu, '$access')";
            }
            $result = ($obj->update($values)) ? 'success' : 'failure';
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