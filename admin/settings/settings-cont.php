<?php
	$obj = new Settings();
    $obj->idSetting = 1;
    require('../Settings/php/GetValuesFormInController.php');
    //Security
    /*$obj->minLongPass   	 = $minLongPass;
    $obj->maxLongPass 		 = $maxLongPass;
    $obj->minNumPass 		 = $minNumPass;
    $obj->minUpperPass 		 = $minUpperPass;
    $obj->minLowerPass 		 = $minLowerPass;
    $obj->charsAllowedPass 	 = $charsAllowedPass;
    $obj->keyExpirDatePass 	 = $keyExpirDatePass;
    $obj->daysWarningExpPass = $daysWarningExpPass;
    $obj->userFailedAttempts = $userFailedAttempts;*/

    $_POST['status'] = '1';
    $obj->status = 1;

    $result = 'invalid_data';
    if (!$obj->validate($action, $_POST, $Validate)) goto fin;

	switch ($action)
	{
		case 'create':
            //VERIFICO que el name no este registrado.
            if (!$obj->unique('name')) {
                $data['id'] = $obj->create();
                $result = ($data['id'] > 0) ? 'success' : 'failure';
            }
		break;
        case 'update':
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