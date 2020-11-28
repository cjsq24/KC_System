<?php
    require('../config-ini.php');
    $message = '';
    $data = [];
    $field      = (isset($_POST['field'])) ? $_POST['field'] : '';
    $linkFolder = $_POST['linkFolder'];
    $action     = $_POST['action'];

	/*$tags = array_keys($_POST);
    $values = array_values($_POST);
    $contTags = count($tags);
    for ($i = 0; $i < $contTags; $i ++) {
        ${$tags[$i]} = $values[$i];
    }*/

	session_start();

    //Aquí verifico si el usuario tiene acceso a la operación actual.
    require('../Settings/php/Access-class.php');
    $Access = new Access();
    if ($Access->accessAction($linkFolder, $action) == 0) {
        $result = 'access_denied';
        goto fin;
    }

    /*ARCHIVOS CON LAS VALIDACIONES*/
    require("../Settings/php/Validate-class.php");
    $Validate = new Validate();

    $tags = array_keys($_POST);
    $values = array_values($_POST);
    $contTags = count($tags);

	//LLAMO A MI CLASE Y CONTROLADOR
	require($linkFolder.'/'.$linkFolder.'-class.php');
	require($linkFolder.'/'.$linkFolder.'-cont.php');

    fin:
    echo json_encode(compact('result', 'message', 'data'));
	//echo ($json);
?>