<?php
	//PARA IDENTIFICAR LA TABLA PRINCIPAL
	$aliasT  = 'lis';
	$aliasID = 'idList';
	$table   = 'lists';

	//AQUÍ INCLUYO LOS ARCHIVOS DE CONFIGURACIÓN, OBTENGO LOS VALORES POST, ETC.
	require('../../Settings/php/TableSearch-1.php');
	
	//AQUÍ ARMO LOS PARÁMETROS PARA INCLUIRLOS EN LA CONSULTA.
	$paramSearch = ($searchS != '') ? "$aliasT.$paramS LIKE '$searchS%' AND " : "";
	$parentW = ($idParentS != '') ? " AND $aliasT.idParent = '$idParentS'" : "";
	$Busqueda = "$aliasT.$paramS";

	$sql = "SELECT lis.*, par.name AS parent 
				FROM lists AS lis 
				LEFT JOIN lists AS par ON par.idList = lis.idParent 
				WHERE $paramSearch lis.status LIKE '$statusS%' $parentW";

	//AQUÍ EJECUTO LAS CONSULTAS PARA LA PAGINACIÓN Y LA BÚSQUEDA.
	require('../../Settings/php/TableSearch-2.php');
	
	foreach ($data as $array) {
		$dataRow[$cont] = $array;
		$dataTable .= $TableS->tbody($cont, $configS['NumRegistro']++, $rowTD, $array, $aliasID);
		$cont++;
	}
	$footerTable = $TableS->footerTable($cont, $configS['TotalPaginas'], $configF);
	echo json_encode(compact('dataTable', 'dataRow', 'footerTable'));
?>