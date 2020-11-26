<?php

	class FormTemplate
	{
		/*function __construct($f) {
			$this->form = 
		}*/

		function finalFormDiv($classLab, $sizeDiv) {
            $imprimir = '';
			$imprimir .= $this->statusDiv($classLab, $sizeDiv);
			$imprimir .= $this->formBtn();
			return $imprimir;
		}

		function statusDiv($classLab, $sizeDiv) {
			return '
				<div id="status-div" class="form-group row" style="display:none;">
					<label class="'.$classLab.' col-form-label" >Estatus</label>
					<div class="'.$sizeDiv.'">
						<span id="status-span" style="padding-left:0px;cursor:default;" class="form-control-lg"></span>
					</div>
				</div>
			';
		}

		function searchModal($type) {
            global $Form, $paramSelect;
			if( $type == "start" )
			{
				$imprimir = '
					<!--VENTANA MODAL PARA REALIZAR LA BUSQUEDA-->
					<input type="hidden" name="pageS" id="pageS" class="input-search">
					<input type="hidden" name="pageSizeS" id="pageSizeS" value="10" class="input-search">
					<input type="hidden" name="ventPadreS" id="ventPadreS" class="input-search">
					<form id="form-search">
						<div class="modal fade" id="modalSearch" role="dialog" aria-labelledby="myModallabel">
							<div class="modal-dialog modal-lg">
								<div class="modal-content">
									<div class="modal-header">
										<h5 class="modal-title"> Búsqueda </h5>
										<button type="button" class="close" data-dismiss="modal" aria-label="Close">
											<span aria-hidden="true">&times;</span>
										</button>
									</div>
									<div class="modal-body">
                                        <div id="alertSearch-div" class="alert alert-danger alert-dismissible fade show" role="alert" style="display:none">
                                            Debe seleccionar algún dato para filtrar
                                            <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                                                <span aria-hidden="true">&times;</span>
                                            </button>
                                        </div>
										<div class="form-row">
											<div class="form-group col">' . 
												$Form->label("statusS", "Estatus") . 
												$Form->select( ["name-id"=>"statusS", "popover-msj"=>"Seleccione un estatus para filtrar registros"], ["1"=>"ACTIVADO", "0"=>"DESACTIVADO"], "search" ) . '
											</div>
											<div class="form-group col">
												' . $Form->label("paramS", "Parámetros") . '
												<select name="paramS" id="paramS" class="form-control form-control-sm input-search" onchange="Form.paramSearch()" data-toggle="popover" data-placement="top" data-content="Seleccione un parámetro de búsqueda" data-trigger="hover">
													';
														$tags = array_keys($paramSelect);
														$valores = array_values($paramSelect);
														for( $i = 0; $i < count($tags); $i ++ )
														{
															$selected =( $i == 0 ) ? "selected" : "";
															$imprimir .= '<option value="' . $tags[$i] . '" ' . $selected . '> ' . $valores[$i] . '</option>';
														}
													$imprimir .= '
												</select>
											</div>
											<div class="form-group col"> ' . 
												$Form->label("searchS", "Búsqueda") . 
												$Form->input( ["name-id"=>"searchS", "type"=>"text", "popover-msj"=>"Ingrese el nombre del departamento que desea buscar"], "search" ) . '
											</div>
										</div>
				';
			}
			else if( $type == "end" )
			{
				$imprimir = '
									</div>
										<div class="modal-footer">
										<!-- BOTONES DE LA VENTANA-->
										<div class="form-group btn-center">
                                            <button type="button" id="closeModalSearch-btn" class="btn btn-secondary">
                                                <span class="fa fa-close"></span> Cerrar
                                            </button>
                                            <button type="button" id="resetSearch-btn" class="btn btn-secondary">
                                                <span class="fa fa-undo"></span> Resetear
                                            </button>
                                            <button type="button" id="search-btn" class="btn btn-info">
                                                <span class="fa fa-search"></span> Buscar
                                            </button>
                                        </div>
									</div>
								</div>
							</div>
						</div>
					</form>
				';
			}
			return $imprimir;
		}

		public function sectionTop($menu) {
            global $Access;
            $actions = $Access->getActions($_SESSION['idProfile'], $menu['link']);
			return '
                <div class="card border-secondary mb-3">
                    <div class="card-header"> <i class="fa '.$menu['icon'].'"></i> <span id="formTitle-span"></span> '.$menu['name'].' </div>
                    <div class="card-body">
                        <div id="search-div">
                            <div id="buttonsGroup-div" class="pull-right btn-group" style="padding-bottom:15px">
                                <button type="button" id="openModalSearch-btn" class="btn btn-secondary" data-toggle="tooltip" data-placement="top" data-trigger="hover" title="FILTRAR">
                                    <span class="fa fa-search bigger-130"></span>
                                </button>
                                ' . $actions['normal'] . '
                            </div>
			';
		}

		public function sectionSearch($tipo) {
			if( $tipo == "start" )
			{
				return '
						<!--ACÁ SE MUESTRAN LOS RESULTADOS DE LA BÚSQUEDA(TABLA)-->
						<div id="table-search-div" class="table-responsive">
							<table class="table table-striped table-bordered table-hover table-condensed table-sm">
								<thead id="thead-table" class="thead-light" style="cursor:default"></thead>
								<tbody id="tbody-table" style="font-size:13px; cursor:pointer">
									<tr>
										<td colspan="100" style="text-align: center">
											Pulse el botón Filtrar( <span class="fa fa-search"></span> ) para realizar una búsqueda
										</td>
									</tr>
                                </tbody>
                                <tfoot>
                                    <tr>
                                        <td colspan="100" style="vertical-align: middle">
                                            <div class="pull-left">
                                                <span id="totalRecords-table"></span>
                                            </div>
                                            <div class="pull-right" style="height:31px">
                                                <div class="input-group mb-3">
                                                    <div class="input-group-prepend" id="back-table"></div>
                                                    <div id="pages-table"></div>
                                                    <div class="input-group-append" id="next-table"></div>

                                                    <select id="pageSize-sel" class="form-control form-control-sm" data-toggle="tooltip" data-placement="bottom" title="Tamaño de la página" style="border-color:gray">
                                                        <option value="10" selected> 10 </option>
                                                        <option value="15"> 15 </option>
                                                        <option value="20"> 20 </option>
                                                        <option value="25"> 25 </option>
                                                    </select>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                </tfoot>
							</table>
						</div>
				';
			}
			else if( $tipo == "end" ) {
				return '</div>';
			}
        }
        
        public function sectionForm($tipo, $link = '') {
			if ($tipo == 'start') {
				return '
					<div class="form" style="display:none;" id="form-div">
						<div id="alertForm-div" class="alert alert-danger alert-dismissible fade show" role="alert" style="display:none">
							<span id="alertForm-span"></span>
							<button type="button" class="close" data-dismiss="alert" aria-label="Close">
								<span aria-hidden="true">&times;</span>
							</button>
						</div>
						
                            
                            <div id="formInput-div">
                            <!--FORMULARIO-->
				';
			}
			else if($tipo == 'end') {
				return '
                            </div>
                        </div>
                    </div>
				';
			}
        }
        
        public function formBtn() {
            return '
                <div class="modal-footer">
                    <div class="form-group">
                        <button type="button" id="hideForm-btn" class="btn btn-primary">
                            <a><span class="fa fa-arrow-left"></span> Volver</a>
                        </button>
                        <button type="button" id="send-btn" class="btn btn-success" style="display:none;"></button>
                    </div>
                </div>
            ';
        }

        public function formButtonsModal($link) {
            return '
                <br>
                <div class="modal-footer">
                    <div class="form-group">
                        <button type="button" id="hideForm-btn" class="btn btn-primary hide-modal-form-btn" form-modal="'.$link.'">
                            <a><span class="fa fa-arrow-left"></span> Cerrar</a>
                        </button>
                        <button type="button" class="btn btn-success sendModal-btn">
                            <i class="fa fa-save"></i> Registrar </i>
                        </button>
                    </div>
                </div>
            ';
        }

        public function formStart($link, $hiddenID) {
            global $formParent;
            return '
                <script> var formID = "'.$link.'"; </script>
                <form name="'.$link.'" id="'.$link.'" class="form-horizontal" role="form" method="post" autocomplete="off">
                    <input type="hidden" name="'.$hiddenID.'" id="'.$hiddenID.'" class="input-form fieldID">
                    <input type="hidden" name="linkFolder" id="linkFolder" value="'.$link.'">
                    <input type="hidden" id="action">
                    <input type="hidden" name="status" id="status" class="input-form">
                    <input type="hidden" id="formParent" value="'.$formParent.'">
            ';
        }

        public function formEnd($modal = false) {
            global $classLab, $sizeDiv, $menu;
            $return = '';
            if (!$modal) {
                $return .= $this->statusDiv($classLab, $sizeDiv) . $this->formBtn();
            }
            else if ($modal) {
                $return .= $this->formButtonsModal($menu['link']);
            }
            $return .= '</form>';
            return $return;
        }
	}
?>