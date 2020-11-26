<?php
	//PARA IDENTIFICAR LA TABLA PRINCIPAL
	$aliasT  = 'pro';
	$aliasID = 'idProfile';
	$table   = 'profiles';

	//AQUÍ INCLUYO LOS ARCHIVOS DE CONFIGURACIÓN, OBTENGO LOS VALORES POST, ETC.
	require('../../Settings/php/TableSearch-1.php');
	
	//AQUÍ ARMO LOS PARÁMETROS PARA INCLUIRLOS EN LA CONSULTA.
	$paramSearch = ($searchS != '') ? "$aliasT.$paramS LIKE '$searchS%' AND " : "";
	$Busqueda = "$aliasT.$paramS";

	$sql = "SELECT $aliasT.*
		    FROM $table AS $aliasT
		    WHERE $paramSearch $aliasT.status LIKE '$statusS%'";

	//AQUÍ EJECUTO LAS CONSULTAS PARA LA PAGINACIÓN Y LA BÚSQUEDA.
	require('../../Settings/php/TableSearch-2.php');
	
	/*CAMPOS QUE NECESITO PARA EL FORMULARIO (INCLUYO EL ID Y ESTATUS QUE ESTARÁN OCULTOS)*/
    $inputs = [$aliasID, 'nombre', 'descripcion', 'estatus'];
    foreach ($data as $array) {
        $dataRow[$cont] = $array;
		$dataTable .= $TableS->tbody($cont, $configS['NumRegistro']++, $rowTD, $array, $aliasID);
		$cont++;
    }
	//$dataRow = $TableS->setData($cont, $inputs, $dataRow);
    $footerTable = $TableS->footerTable($cont, $configS['TotalPaginas'], $configF);
    echo json_encode(compact('dataTable', 'dataRow', 'footerTable'));
?>