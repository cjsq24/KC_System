<?php
	//PARA IDENTIFICAR LA TABLA PRINCIPAL
	$aliasT  = 'per';
	$aliasID = 'idPerson';
	$table   = 'persons';

	//AQUÍ INCLUYO LOS ARCHIVOS DE CONFIGURACIÓN, OBTENGO LOS VALORES POST, ETC.
	require('../../Settings/php/TableSearch-1.php');
	
	//AQUÍ ARMO LOS PARÁMETROS PARA INCLUIRLOS EN LA CONSULTA.
    $paramSearch = ($searchS != '') ? "$aliasT.$paramS LIKE '$searchS%' AND " : "";
    $countryW = ($idCountryS != '') ? " AND cou.idListValue = $idCountryS" : "";
    $stateW = ($idStateS != '') ? " AND sta.idListValue = $idStateS" : "";
    $cityW = ($idCityS != '') ? " AND per.idCity = $idCityS" : "";
	$Busqueda = "$aliasT.$paramS";

	$sql = "SELECT per.*,
                CASE 
                    WHEN per.dateBirth = '0000-00-00' then ''
                    WHEN per.dateBirth = NULL then ''
                    WHEN per.dateBirth <> '0000-00-00' then DATE_FORMAT(per.dateBirth, '%d/%m/%Y')
                END
                AS dateBirth,
                concat(per.name, ' ', per.surname) AS names, 
                cit.name AS city, 
                sta.idListValue AS idState, 
                sta.name AS state, 
                cou.idListValue AS idCountry, 
                cou.name AS country,
                doc.name AS documentType 
		    FROM persons AS per 
            LEFT JOIN listsValues AS cit ON cit.idListValue = per.idCity 
            LEFT JOIN listsValues AS sta ON sta.idListValue = cit.idParent 
            LEFT JOIN listsValues AS cou ON cou.idListValue = sta.idParent 
            LEFT JOIN listsValues AS doc ON doc.idListValue = per.idDocumentType 
		    WHERE $paramSearch per.status LIKE '$statusS%' $countryW $stateW $cityW";

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