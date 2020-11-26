<?php
    //if (!class_exists('Connection')) require("Connection.php");
    require_once("Connection.php");
	class General extends Connection
	{
        public function getArr($sql) {
            return $this->getArray($sql);
        }
        
        public function getArrAll($sql) {
            return $this->getArrayAll($sql);
        }

        public function getOptions($sql, $option = 'SELECCIONE')
        {
            $array[''] = $option;
            $data = $this->getArrayAll($sql);
            foreach ($data as $key) {
                $array[$key['a']] = $key['b'];
            }
            return $array;
        }

        public function getSetOptions($sql, $option = 'SELECCIONE')
        {
            $return = '<option value="" selected>'.$option.'</option>';
            $data = $this->getArrayAll($sql);
            foreach ($data as $key) {
                $return .= '<option value="'.$key['a'].'">'.$key['b'].'</option>';
            }
            return $return;
        }
        
        public function getIcons()
        {
            $sql = "SELECT * FROM icons";
            return $this->getArrayAll($sql);
        }

        public function getActions()
        {
            $sql = "SELECT * FROM actions ORDER BY position";
            return $this->getArrayAll($sql);
        }

        public function getActionsMenu()
        {
            $sql = "SELECT * FROM actions ORDER BY position";
            $actions = $this->getArrayAll($sql);
            foreach ($actions as $action) {
                $array[$action['idAction']] = $action;
            }
            return $array;
        }

        public function getParentMenu()
        {
            $sql = "SELECT idMenu, name FROM menus WHERE type='0' ORDER BY name";
            return $this->getArrayAll($sql);
        }

        public function iconsModal($menu) {
            $icons = $this->getArrayAll("SELECT * FROM icons"); //Iconos
            $return = '
                <style>
                    .icons-td:hover {
                        background:#EFEFEF;
                        cursor:pointer
                    }
                </style>
                <!-- Modal Iconos -->
                <div class="modal fade" id="icons-modal">
                    <div class="modal-dialog modal-dialog-scrollable modal-lg">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h4 class="modal-title">Listado de Iconos</h4>
                                <button type="button" class="close hide-icons-btn">&times;</button>
                            </div>
                            <div class="modal-body">
                                <table class="table" style="text-align:center">';
                                    $cont = 0;
                                    foreach ($icons as $icon)
                                    {
                                        if ($cont == 0) $return .= '<tr>';
                                        $return .= '
                                            <td class="icons-td" onclick="selectIcon(\''.$menu['link'].'\','.$icon['idIcon'].', \''.$icon['name'].'\',\'icons-modal\')">
                                                <span class="fa '.$icon['name'].' fa-2x"></span>
                                            </td>
                                        ';
                                        $cont ++;
                                        if ($cont == 10) $return .= '<tr>';
                                        $cont = ($cont == 10) ? 0 : $cont;
                                    }
                                    if ($cont > 0) $return .= '<tr>';
                                    $return .= '
                                </table>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-danger hide-icons-btn">Cerrar</button>
                            </div>
                        </div>
                    </div>
                </div>
            ';
            return $return;
        }
	}
?>