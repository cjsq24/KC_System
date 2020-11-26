<?php
	//PARA IDENTIFICAR LA TABLA PRINCIPAL
	$aliasT  = 'dep';
	$aliasID = 'iddepartamento';
	$table   = 'tdepartamento';

	//AQUÍ INCLUYO LOS ARCHIVOS DE CONFIGURACIÓN, OBTENGO LOS VALORES POST, ETC.
	include('../../configuracion/include-search-config-1.php');
	
	//AQUÍ ARMO LOS PARÁMETROS PARA INCLUIRLOS EN LA CONSULTA.
	$paramSearch = ($searchS != '') ? "$aliasT.$paramS LIKE '$searchS%' AND " : "";
	$Busqueda = "$aliasT.$paramS";

	$Sql = "SELECT 
			$aliasT.*,
			$paramRegisterBy[select]
		FROM 
			$table AS $aliasT,
			$paramRegisterBy[from]
			$consultRecord[from] 
		WHERE 
			$paramSearch 
			$aliasT.estatus LIKE '$estatusS%' 
			$paramRegisterBy[where] 
			$consultRecord[where]";

	//AQUÍ EJECUTO LAS CONSULTAS PARA LA PAGINACIÓN Y LA BÚSQUEDA.
	include('../../configuracion/include-search-config-2.php');
	
	/*CAMPOS QUE NECESITO PARA EL FORMULARIO (INCLUYO EL ID Y ESTATUS QUE ESTARÁN OCULTOS)*/
	$inputs = [$aliasID, 'nombre', 'descripcion', 'estatus'];
	while ($Arreglo=$BD->fArreglo($Tb)) {
		$dataRow[$cont] = $Arreglo;
		$dataTable .= $tableConf->tbody($cont, $configS['NumRegistro']++, $rowTD, $Arreglo );
		$cont++;
	}
	$dataRow = $tableConf->setData($cont, $inputs, $dataRow);
	$footerTable = $tableConf->footerTable($cont, $configS['TotalPaginas'], $configF);
	echo json_encode(['dataTable'=>$dataTable, 'dataRow'=>$dataRow, 'footerTable'=>$footerTable]);
?>