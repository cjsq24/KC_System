<?php
    $obj = new ListsValues();
    require('../Settings/php/GetValuesFormInController.php');
    $obj->idParent = ($_POST['idParent'] > 0) ? $_POST['idParent'] : 'NULL';

    $result = 'invalid_data';
    if (!$obj->validate($action, $_POST, $Validate, $field)) goto fin;

	switch ($action)
	{
		case 'create':
            $data['id'] = $obj->create();
            $result = ($data['id'] > 0) ? 'success' : 'failure';
		break;
        case 'update':
			if ($obj->getStatus() == '1') {
                $result = ($obj->update()) ? 'success' : 'failure';
			}
		break;
        case 'activate':
            if ($obj->getStatus() == '0') {
                $result = $obj->changeStatus('activate') ? 'success' : 'failure';
            }
		break;
        case 'inactivate':
            if ($obj->getStatus() == '1') {
                $result = $obj->changeStatus('inactivate') ? 'success' : 'failure';
            }
		break;
	}
	fin:
?>