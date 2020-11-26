<?php
	//PARA IDENTIFICAR LA TABLA PRINCIPAL
	$aliasT  = 'mo';
	$aliasID = 'idModule';
	$table   = 'modules';

	//AQUÍ INCLUYO LOS ARCHIVOS DE CONFIGURACIÓN, OBTENGO LOS VALORES POST, ETC.
	require('../../Settings/php/TableSearch-1.php');
	
	//AQUÍ ARMO LOS PARÁMETROS PARA INCLUIRLOS EN LA CONSULTA.
    $paramSearch = ($searchS != '') ? "$aliasT.$paramS LIKE '$searchS%' AND " : "";
    $parentW = ($idParentS != '') ? " AND $aliasT.idParent = '$idParentS'" : "";
    $Busqueda = "$aliasT.$paramS";
    
    $sql = "SELECT mo.*, ico.name AS icon, par.name AS parent 
            FROM modules AS mo 
            LEFT JOIN icons AS ico ON ico.idIcon = mo.idIcon 
            LEFT JOIN modules AS par ON par.idModule = mo.idParent 
            WHERE $paramSearch mo.status LIKE '$statusS%' $parentW
    ";

	//AQUÍ EJECUTO LAS CONSULTAS PARA LA PAGINACIÓN Y LA BÚSQUEDA.
	require('../../Settings/php/TableSearch-2.php');
	
	/*CAMPOS QUE NECESITO PARA EL FORMULARIO (INCLUYO EL ID Y ESTATUS QUE ESTARÁN OCULTOS)*/
    $inputs = [$aliasID, 'idIcon', 'idParent', 'name', 'type', 'link', 'description', 'icon', 'status'];
    foreach ($data as $array) {
        $dataRow[$cont] = $array;
        $array['icon'] = '<i class="fa '.$array['icon'].'"></i>';
		$dataTable .= $TableS->tbody($cont, $configS['NumRegistro']++, $rowTD, $array, $aliasID);
		$cont++;
    }
	//$dataRow = $TableS->setData($cont, $inputs, $dataRow);
    $footerTable = $TableS->footerTable($cont, $configS['TotalPaginas'], $configF);
    echo json_encode(compact('dataTable', 'dataRow', 'footerTable'));
?>