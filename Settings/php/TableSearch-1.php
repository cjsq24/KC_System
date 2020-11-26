<?php
    require("../Connection.php");
	$BD = new Connection;
	
	require('../../Settings/php/TableSearch-class.php');
	$TableS = new TableSearch();

	//ARCHIVO QUE RECIBE LOS VALORES POST
    $tags = array_keys($_POST);
    $valores = array_values($_POST);
    $contTags = count($tags);
    for($i = 0; $i < $contTags; $i ++) {
        ${$tags[$i]} = $valores[$i];
    }

    $searchS = mb_strtoupper($_POST['searchS'], 'UTF-8');

	/*DATOS QUE VAN A APARECER EN LA TABLA DE BÚSQUEDA*/
    eval('$rowTD = ' . $_POST['rowTD'] . ';');

    $dataRow = null;
    $dataTable = null;
    $cont = 0;
?>