<?php

	class TableSearch
	{

		function fConfigPaginacionTabla($Pagina,$TamanoPagina,$NumRegistBusq)
		{
			$Arreglo = array();
			/*Examino la Pagina a mostrar y el inicio del registro a mostrar*/
			$NumRegistro = ( $Pagina * $TamanoPagina + 1 ) - $TamanoPagina;

			if (!$Pagina) {
				$Inicio = 0;
				$Pagina = 1;
				$NumRegistro=1;
			} else {
				$Inicio = ($Pagina - 1) * $TamanoPagina;
			}
			/*Calculo el total de Paginas*/
			$TotalPaginas = ceil($NumRegistBusq / $TamanoPagina);
			/*Calculo que el total de paginas no sea mayor a 10*/
			if ($TotalPaginas > 10) {
				$TotalPaginas = 10;
			}
			/*Veo que el total de paginas no sea mayor al numero de la pagina, sino no me mostrara ningun registro*/
			if ( $Pagina>$TotalPaginas) {
				$Inicio = 0;
				$Pagina = 1;
			}
			$Arreglo['Inicio'] = $Inicio;
			$Arreglo['NumRegistro'] = $NumRegistro;
			$Arreglo['TotalPaginas'] = $TotalPaginas;

			return $Arreglo;
		}

		function statusRow($Estatus)
		{
			if ($Estatus == '0') {
				return '<span class="badge badge-secondary" style="border-radius:0px;font-size:12px;">INACTIVO</span>';
			}
			else if ($Estatus == '1') {
				return '<span class="badge badge-success" style="border-radius:0px;font-size:12px;">ACTIVO</span>';
			}
			else {
				return 'ERROR';
			}
		}

		function fDesbloquearBtnRep()
		{
			echo '
				<script>
					$("#btnReportePDF1").removeAttr("disabled","disabled");
					$("#btnReportePDF2").removeAttr("disabled","disabled");
					$("#btnReporteEXCEL1").removeAttr("disabled","disabled");
					$("#btnReporteEXCEL2").removeAttr("disabled","disabled");
					$("#btnRE").removeAttr("disabled","disabled");
				</script>
			';
		}

		function tbody($cont, $numCol, $colTable, $dataRow, $aliasID)
		{
				
			$retorno  = '
				<!--tr id="tr' . $cont . '" onclick="this.selectRow('.$cont.')"-->
				<tr id="tr' . $cont . '" row="'.$cont.'" class="selectRow">
					<th scope="row">' . $numCol . '</th>
			';
			foreach ($colTable as $key => $col) {
				$retorno .= '<td>' . $dataRow[$col] . '</td>';
			}
			$retorno .= '
					<td id="status-'.$dataRow[$aliasID].'-td">' . $this->statusRow($dataRow["status"]) . '</td>
				</tr>
			';
			return $retorno;
		}
		
		function footerTable($Cont, $TotalPaginas, $configFooter)
		{
				$array['anterior'] = '';
				$array['siguiente'] = '';
				$array['paginas'] = '';
				$array['totalRegistros'] = '';
			if($Cont > 0) {
				if ($TotalPaginas > 1)
				{
					if ($configFooter['page'] != 1) {
								$array['anterior'] = '
									 <button type="button" id="backPage-btn" page="'.($configFooter['page'] - 1).'" class="btn btn-outline-secondary btn-sm" data-toggle="tooltip" data-placement="bottom" title="Anterior">
										  <span class="fa fa-arrow-left"></span>
									 </button>
						';
					}
				}

					 if ( $TotalPaginas > 1 ) {
						  $array['paginas'] = '<select id="selectPage-sel" class="form-control form-control-sm" data-toggle="tooltip" data-placement="bottom" title="N° de Página" style="border-color:gray">';

						  for ($i = 1; $i <= $TotalPaginas; $i ++) {
								if ($configFooter['page'] == $i) {
									 /*si muestro el �ndice de la pagina actual, no coloco enlace*/
									 $array['paginas'] .= '<option value='.$configFooter['page'].' selected>'.$configFooter['page'].'</option>';
								} else {
									 /*Si el indice no corresponde con la p�gina mostrada actualmente,
									 Coloco el enlace para ir a esa pagina*/
									 $array['paginas'] .= '<option value='.$i.'>'.$i.'</option>';
								}
						  }

						  $array['paginas'] .= '</select>';
						  //echo $configFooter['page'] . ' - ' . $TotalPaginas;
						  //$array['totalPaginas'] = 'de '.$TotalPaginas;
					 }

				if ($TotalPaginas > 1)
				{
					if ($configFooter['page'] < $TotalPaginas)
					{
								$array['siguiente'] = '
									 <button type="button" id="nextPage-btn" page="'.($configFooter['page']+1).'" class="btn btn-outline-secondary btn-sm" data-toggle="tooltip" data-placement="bottom" title="Siguiente">
										  <span class="fa fa-arrow-right"></span>
									 </button>
						';
					}
				}
				$array['totalRegistros'] = 'Total de Registros: <b>' . $configFooter['totalSearch'] . '/' . $configFooter['totalRegist'] . '</b>';
				return $array;
				}
				else {
					 return $array;
				}
		}

		function setData( $cont, $inputs, $arrayData )
		{
				if ($cont > 0) {
					 for ( $x = 0; $x < $cont ; $x ++ ) {
						  foreach ($inputs as $key => $inputs2) {
								$tags = array_keys ($arrayData[$x]);
								$valores = array_values ($arrayData[$x]);
								$numTags = count ($tags);
								for ( $i = 0; $i < $numTags; $i ++ ) {
									 if ( $inputs2 == $tags[$i] ) {
										  $dataRow[$x][$inputs2] = $valores[$i];
										  break;
									 }
								}
						  }
					 }
					 return $dataRow;
				}
				else {
					 return null;
				}
		}
	}
?>