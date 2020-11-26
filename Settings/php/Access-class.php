<?php
    /*
    *   Archivo Access.
    *   Aquí incluyo las funciones referentes a los permisos de archivos y operaciones a través de los perfiles.
    */
	require_once("Connection.php");
	class Access extends Connection
	{
        //Chequear acceso al menú actual.
        public function accessMenu($link, $modal = false)
        {
            $link = strtoupper($link);
            $idUser = $_SESSION['idUser'];
            $sql = "SELECT men.name, men.link, ico.name AS icon 
                    FROM users AS us 
                    INNER JOIN profiles AS pro ON pro.idProfile = us.idProfile 
                    INNER JOIN profilesMenus AS pm ON pm.idProfile = pro.idProfile 
                    INNER JOIN menus AS men ON men.idMenu = pm.idMenu 
                    LEFT JOIN icons AS ico ON ico.idIcon = men.idIcon 
                    WHERE men.link = '$link' AND us.idUser = $idUser
            ";
            $menu = $this->getArray($sql);
            if (empty($menu)) {
                if (!$modal) {
                    echo '<script> alert("ACCESO DENEGADO"); //self.location = ("../index.php"); </script>';
                }
                else {
                    return false;
                }
            }
            else {
                return $menu;
            }
        }

        public function accessAction($link, $action)
        {
            //Return:
            //0 = no tiene acceso a la operación.
            //1 = sí tiene acceso a la operación.
            //2 = es una operación distinta a la del arreglo, como "verify_name", etc. Éstas son operaciones libres.
            $link = strtoupper($link);
            $actions = ['create', 'update', 'read', 'activate', 'inactivate', 'report_pdf', 'report_excel'];
            $cont = 0;
            foreach ($actions as $act) {
                if ($act == $action) {
                    $cont = 1;
                    break;
                }
            }

            if ($cont == 0) {
                return 2;
            }
            else
            {
                $idUser = $_SESSION['idUser'];
                $sql = "SELECT pm.access 
                        FROM profilesMenus AS pm 
                        INNER JOIN profiles AS pro ON pro.idProfile = pm.idProfile 
                        INNER JOIN users AS us ON us.idProfile = pro.idProfile 
                        INNER JOIN menus AS men ON men.idMenu = pm.idMenu 
                        WHERE us.idUser = $idUser AND men.link = '$link'
                ";
                if ($data = $this->getArray($sql)) {
                    $access = $data['access'];
                }
                else return 0;

                $sql = "SELECT idAction, action FROM actions WHERE action = '$action'";
                if ($data = $this->getArray($sql)) {
                    $idAction = $data['idAction'];
                }
                else return 0;

                $access = explode(',', $access);
                foreach ($access as $acc) {
                    if ($acc == $idAction) {
                        return 1;
                    }
                }
                //Si no se encuentra la operación, retornamos 0.
                return 0;
            }
        }

        public function getActions($idProfile, $link)
        {
            $link = strtoupper($link);
            $actions['normal']      = '';
            $actions['responsive']  = '';

            $sql = "SELECT idAction, name, action, class, icon FROM actions ORDER BY position";
            $acts = $this->getArrayAll($sql);

            $sql = "SELECT pm.access 
                    FROM profilesMenus AS pm 
                    INNER JOIN menus AS men ON men.idMenu = pm.idMenu
                    WHERE men.link = '$link' AND pm.idProfile = $idProfile
            ";
            $access = $this->getArray($sql);
            $access = explode(',', $access['access']);

            foreach ($acts as $act) {
                foreach ($access as $acc) {
                    if ($act['idAction'] == $acc) {
                        $actions['normal'] .= '
                            <button type="button" class="btn '.$act['class'].' '.$act['action'].'-btn" data-toggle="tooltip" data-placement="top" data-trigger="hover" title="'.$act['name'].'">
                                <span class="'.$act['icon'].' bigger-130"></span>
                            </button>
                        ';
                    }
                }
            }
            return $actions;
        }

        public function showMenu($idProfile) {
            //Buscamos los módulos principales
            $modules = $this->getArrayAll(
                "SELECT mo.idModule, mo.name, ico.name AS icon 
                FROM modules AS mo 
                LEFT JOIN icons AS ico ON ico.idIcon = mo.idIcon 
                WHERE mo.idParent IS null AND mo.status='1'
            ");

            $return = '';
            foreach ($modules as $key => $module) {
                //Busco los menus asignados al perfil, pertenecientes al módulo principal.
                $menus = $this->getArrayAll(
                    "SELECT men.idMenu, men.name, men.link, ico.name AS icon 
                    FROM profilesMenus AS pro 
                    INNER JOIN menus AS men ON men.idMenu = pro.idMenu 
                    LEFT JOIN icons AS ico ON ico.idIcon = men.idIcon 
                    INNER JOIN modules AS mo ON mo.idModule = men.idModule 
                    WHERE pro.idProfile = $idProfile AND men.idModule = ".$module['idModule']
                );
                
                $listMenus1 = '';
                if (!empty($menus)) {
                    foreach ($menus as $key => $menu) {
                        $listMenus1 .= '
                            <li class="nav-item">
                                <a href="?link='.strtolower($menu['link']).'" class="nav-link" id="menu-'.$menu['idMenu'].'-a">
                                    <i class="fa '.$menu['icon'].' nav-icon"></i>
                                    <p>'.$menu['name'].'</p>
                                </a>
                            </li>
                        ';
                    }
                }

                $menus = $this->getArrayAll(
                    "SELECT mo.idModule, mo.name AS subModule, men.idMenu, men.name, men.link, ico.name AS icon, ico2.name AS iconMod 
                    FROM modules AS mo 
                    INNER JOIN modules AS par ON par.idModule = mo.idParent 
                    INNER JOIN menus AS men ON men.idModule = mo.idModule 
                    LEFT JOIN icons AS ico ON ico.idIcon = men.idIcon 
                    LEFT JOIN icons AS ico2 ON ico2.idIcon = mo.idIcon 
                    INNER JOIN profilesMenus AS pro ON pro.idMenu = men.idMenu 
                    WHERE men.status = '1' AND pro.idProfile = $idProfile AND mo.idParent = ".$module['idModule']
                );

                $a = '';
                $listMenus2 = '';
                if (!empty($menus)) {
                    foreach ($menus as $key => $menu) {
                        $listMenus2 .= ($key == 0 || $a != $menu['idModule'])
                        ? ' <li class="nav-item has-treeview" id="subModule-'.$menu['idModule'].'-li">
                                <a href="#" class="nav-link" id="subModule-'.$menu['idModule'].'-a">
                                    <i class="fa '.$menu['iconMod'].' nav-icon"></i>
                                    <p>
                                        '.$menu['subModule'].'
                                        <i class="right fa fa-angle-left"></i>
                                    </p>
                                </a>
                                <ul class="nav nav-treeview">'  
                        : '';

                        $listMenus2 .= '
                                    <li class="nav-item">
                                        <a href="?link='.strtolower($menu['link']).'" class="nav-link" id="menu-'.$menu['idMenu'].'-a">
                                            <i class="fa '.$menu['icon'].' nav-icon"></i>
                                            <p>'.$menu['name'].'</p>
                                        </a>
                                    </li>
                        ';
                        $a = $menu['idModule'];

                        $listMenus2 .= (empty($menus[$key+1]['idModule']) || $menus[$key+1]['idModule'] != $a) 
                        ? '
                                </ul>
                            </li>'
                        : '';
                    }
                }

                if ($listMenus1 != '') {
                    $return .= '
                        <li class="nav-item has-treeview" id="module-'.$module['idModule'].'-li">
                            <a href="#" class="nav-link" id="module-'.$module['idModule'].'-a">
                                <i class="nav-icon fa '.$module['icon'].'"></i>
                                <p>
                                    '.$module['name'].'
                                    <i class="right fa fa-angle-left"></i>
                                </p>
                            </a>';
                    if ($listMenus1 != '' || $listMenu2 != '') {
                        $return .= '
                            <ul class="nav nav-treeview">
                                '.$listMenus1.'
                        ';
                    }
                    if ($listMenus2 != '') {
                        $return .= $listMenus2;
                    }
                    if ($listMenus1 != '') {
                        $return .= '
                            </ul>
                        ';
                    }
                    $return .= '
                        </li>
                    ';
                }
            }
            return $return;
        }

        public function accessCreate($link)
        {
            $link = strtoupper($link);
            $idUser = $_SESSION['idUser'];
            $sql = "SELECT men.name, men.link, pm.access 
                    FROM users AS us 
                    INNER JOIN profiles AS pro ON pro.idProfile = us.idProfile 
                    INNER JOIN profilesMenus AS pm ON pm.idProfile = pro.idProfile 
                    INNER JOIN menus AS men ON men.idMenu = pm.idMenu 
                    WHERE men.link = '$link' AND us.idUser = $idUser
            ";
            $menu = $this->getArray($sql);

            $sql = "SELECT idAction FROM actions WHERE action = 'create'";
            $action = $this->getArray($sql);

            if (strpos($menu['access'], $action['idAction']) === false) {
                return false;
            }
            else return $menu;
        }
	}
?>