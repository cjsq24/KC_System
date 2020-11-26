<?php
    //USO EL SQL PARA OBTENER EL NÚMERO TOTAL DE REGISTROS QUE COINCIDEN
    $configF['totalSearch'] = $BD->rowCount($sql);
    //$configF['totalSearch'] = $tableConf->totalCol($sql);

	/*Busco el numero total de registros que tiene la tabla*/
    //$configF['totalRegist'] = $tableConf->totalCol("SELECT $aliasID FROM $table");
    $configF['totalRegist'] = $BD->rowCount("SELECT $aliasID FROM $table");
	$configF['page'] = $pageS;

	$configS = $TableS->fConfigPaginacionTabla($configF['page'], $pageSizeS, $configF['totalSearch']);
    
    //$Tb = $BD->fFiltro($sql. "ORDER BY $Busqueda ASC LIMIT $pageSizeS OFFSET $configS[Inicio]");
    $data = $BD->getArrayAll($sql. " ORDER BY $Busqueda ASC LIMIT $pageSizeS OFFSET $configS[Inicio]");
?>