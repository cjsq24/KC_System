<?php
    $obj = new ListsValues();
    for ($i = 0; $i < $contTags; $i ++) { $obj->{$tags[$i]} = $values[$i]; }
    $obj->idParent = ($_POST['idParent'] > 0) ? $_POST['idParent'] : 'NULL';

    /*$obj->idListValue   = $idListValue;
    $obj->idList        = $idList;
    $obj->idParent      = ($idParent > 0) ? $idParent : 'NULL';
    $obj->name      	= $name;
    $obj->abbreviation  = $abbreviation;
    $obj->position  	= $position;
    $obj->description 	= $description;
    $obj->status 		= $status;*/

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