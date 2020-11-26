<?php
	//PARA IDENTIFICAR LA TABLA PRINCIPAL
	$aliasT  = 'users';
	$aliasID = 'idUser';
	$table   = 'users';

	//AQUÍ INCLUYO LOS ARCHIVOS DE CONFIGURACIÓN, OBTENGO LOS VALORES POST, ETC.
	require('../../Settings/php/TableSearch-1.php');
	
	//AQUÍ ARMO LOS PARÁMETROS PARA INCLUIRLOS EN LA CONSULTA.
	$paramSearch = ($searchS != '') ? "$aliasT.$paramS LIKE '$searchS%' AND " : "";
	$Busqueda = "$aliasT.$paramS";

	$sql = "SELECT users.*, concat(per.name, ' ', per.surname, ' | <b>(', per.idDocument, ')</b>') AS person 
		    FROM users 
            INNER JOIN persons AS per ON per.idPerson = users.idPerson 
		    WHERE $paramSearch users.status LIKE '$statusS%'";

	//AQUÍ EJECUTO LAS CONSULTAS PARA LA PAGINACIÓN Y LA BÚSQUEDA.
	require('../../Settings/php/TableSearch-2.php');
	
	/*CAMPOS QUE NECESITO PARA EL FORMULARIO (INCLUYO EL ID Y ESTATUS QUE ESTARÁN OCULTOS)*/
    foreach ($data as $array) {
        $dataRow[$cont] = $array;
        if ($array['conditions'] == '0') {
            $array['conditions'] = '<span id="cond'.$array['idUser'].'-span" class="badge badge-primary" style="border-radius:0px;font-size:12px;">EN PROCESO</span>';
        }
        else if ($array['conditions'] == '1') {
            $array['conditions'] = '<span id="cond'.$array['idUser'].'-span" class="badge badge-success" style="border-radius:0px;font-size:12px;">ACTIVO</span>';
        }
        else if ($array['conditions'] == '2') {
            $array['conditions'] = '<span id="cond'.$array['idUser'].'-span" class="badge badge-secondary" style="border-radius:0px;font-size:12px;">BLOQUEADO</span>';
        }
		$dataTable .= $TableS->tbody($cont, $configS['NumRegistro']++, $rowTD, $array, $aliasID);
		$cont++;
    }
    $footerTable = $TableS->footerTable($cont, $configS['TotalPaginas'], $configF);
    echo json_encode(compact('dataTable', 'dataRow', 'footerTable'));
?>