<?php
    $obj = new Persons();
    require('../Settings/php/GetValuesFormInController.php');
    //if ($action == 'create' || $action == 'update') {
        require('General-class.php');
        $General = new General;
        $obj->dateBirth = $General->formatDateSpa2Eng($_POST['dateBirth']);
    //}
    
    $result = 'invalid_data';
    if (!$obj->validate($action, $_POST, $Validate, $field)) goto fin;
    
	switch ($action)
	{
		//VERIFICO SI EL NOMBRE EXISTE
		case 'verify_if_exist':
            $result = ($obj->unique($field)) ? 'existe' : 'no_existe';
            $message = 'Este campo ya está registrado';
		break;
        case 'create':
            if (!$obj->unique('idDocument') && !$obj->unique('email') 
                && $obj->checkListValue('citys', $_POST['idCity']) 
                && $obj->checkListValue('documentType', $_POST['idDocumentType'])
                )
            {
                $data['id'] = $obj->create();
                $result = ($data['id'] > 0) ? 'success' : 'failure';
            }
		break;
        case 'update':
            //Verifico que el registro esté activo (no se permite modificar registros inactivos) y la unicidad del campo.
            if ($obj->getStatus() == '1' && !$obj->unique('idDocument') && !$obj->unique('email') 
                && $obj->checkListValue('citys', $_POST['idCity']) 
                && $obj->checkListValue('documentType', $_POST['idDocumentType'])
                ) 
            {
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