<?php
	//PARA IDENTIFICAR LA TABLA PRINCIPAL
	$aliasT  = 'lisV';
	$aliasID = 'idListValue';
	$table   = 'listsValues';

	//AQUÍ INCLUYO LOS ARCHIVOS DE CONFIGURACIÓN, OBTENGO LOS VALORES POST, ETC.
	require('../../Settings/php/TableSearch-1.php');
	
	//AQUÍ ARMO LOS PARÁMETROS PARA INCLUIRLOS EN LA CONSULTA.
    $paramSearch = ($searchS != '') ? "$aliasT.$paramS LIKE '$searchS%' AND " : "";
    $listW = ($idListS != '') ? " AND $aliasT.idList = $idListS" : "";
    $parentW = '';
    if ($idParentS != '') {
        $parentW = " AND $aliasT.idParent = $idParentS";
        $listW = '';
    }
	$Busqueda = "$aliasT.$paramS";

	$sql = "SELECT lisV.*, par.name AS parent, lis.name AS list 
            FROM listsValues AS lisV 
            LEFT JOIN listsValues AS par ON par.idListValue = lisV.idParent 
            INNER JOIN lists AS lis ON lis.idList = lisV.idList 
            WHERE $paramSearch lisV.status LIKE '$statusS%' $parentW $listW";

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