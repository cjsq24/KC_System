<?php
    require('../../config-ini.php');

    $action = $_POST['action'];
    $idProfile = $_POST['idProfile'];
    echo json_encode(profilesMenusActions($idProfile));

    function profilesMenusActions($idProfile) {
        require('../General-class.php');
        $General = new General();
        $modules = $General->getArrAll(
            "SELECT mo.idModule, mo.name AS module, ico.name AS icon 
            FROM modules AS mo 
            LEFT JOIN icons AS ico ON ico.idIcon = mo.idIcon 
            WHERE mo.idParent IS null AND mo.status='1'");
        $actions = $General->getActionsMenu("SELECT * FROM actions WHERE status='1'");

        $access = [];
        if ($_POST['action'] == 'update' || $_POST['action'] == 'read') {
            require('profiles-class.php');
            $Profiles = new Profiles();
            $Profiles->idProfile = $idProfile;
            $access = $Profiles->getAccess();
        }

        $return = '
        <div class="card-body access" style="padding:0px">
            <div class="row">
                <div class="col-lg-3 col-md-4 col-sm-12" style="padding-right:0px;">
                    <div class="nav flex-column nav-pills" id="v-pills-tab" role="tablist" aria-orientation="vertical" style=" background:#FBFBFB; height:100%">';
                        foreach ($modules as $key => $module) {
                            $active = ($key == 0) ? 'active' : '';
                            $return .= '
                                <a class="nav-link '.$active.'" id="v-pills-'.$module['idModule'].'-tab" data-toggle="pill" href="#v-pills-'.$module['idModule'].'" role="tab" aria-controls="v-pills-'.$module['idModule'].'" aria-selected="true">
                                    <i class="fa '.$module['icon'].'"></i> '.$module['module'].' 
                                </a>
                            ';
                        }
                        $return .= '
                    </div>
                </div>
                <div class="col-lg-9 col-md-8 col-sm-12" style="padding-left:0px;padding-top:0px">
                    <div class="tab-content" id="v-pills-tabContent" style="padding-top:0px">';
                        foreach ($modules as $key => $module) {
                            $active = ($key == 0) ? 'show active' : '';
                            $return .= '
                            <div class="tab-pane fade '.$active.'" id="v-pills-'.$module['idModule'].'" role="tabpanel" aria-labelledby="v-pills-'.$module['idModule'].'-tab">
                                <table class="table table-hover table-bordered table-sm" style="font-size:14px">
                                    <tr class="table-secondary">
                                        <th colspan="2"> <i class="fa '.$module['icon'].'"></i> '.$module['module'].'</th>
                                    </tr>';
                                    $menus = $General->getArrAll(
                                        "SELECT men.*, mo.name AS modulo, ico.name AS icon 
                                        FROM menus AS men 
                                        LEFT JOIN modules AS mo ON mo.idModule = men.idModule 
                                        LEFT JOIN icons AS ico ON ico.idIcon = men.idIcon 
                                        WHERE men.status = '1' AND men.idModule = ".$module['idModule']);
                                    if (!empty($menus)) {
                                        foreach ($menus as $key2 => $menu) {
                                            $return .= '
                                                <tr>
                                                    <td style="padding-left:15px; vertical-align:middle;">
                                                        <i class="fa '.$menu['icon'].'"></i> '.$menu['name'].'
                                                        <input type="checkbox" name="idMenu[]" id="idMenu-'.$menu['idMenu'].'" value="'.$menu['idMenu'].'" class="d-none">
                                                    </td>
                                                    <td>';
                                            $actionsMenu = explode(',', $menu['actions']);
                                            foreach ($actionsMenu as $actionMenu) {
                                                $act = $actions[$actionMenu];
                                                $return .= getButtons($menu['idMenu'], $act, $access);
                                            }
                                            $return .= '</td></tr>';
                                        }
                                    }

                                    $menus = $General->getArrAll(
                                        "SELECT mo.idModule, mo.name AS subModule, men.idMenu, men.name AS menu, men.actions, ico.name AS icon, ico2.name AS iconMod 
                                        FROM modules AS mo 
                                        INNER JOIN modules AS par ON par.idModule = mo.idParent 
                                        INNER JOIN menus AS men ON men.idModule = mo.idModule 
                                        LEFT JOIN icons AS ico ON ico.idIcon = men.idIcon 
                                        LEFT JOIN icons AS ico2 ON ico2.idIcon = mo.idIcon 
                                        WHERE men.status = '1' AND mo.idParent = ".$module['idModule']);
                                    if (!empty($menus)) {
                                        $a = 0;
                                        foreach ($menus as $key2 => $menu) {
                                            $return .= ($key2 == 0 || $a != $menu['idModule']) 
                                            ? '<tr class="table-primary">
                                                    <th colspan="2"> <i class="fa '.$menu['iconMod'].'"></i> '.$menu['subModule'].' </th>
                                                </tr>'  
                                            : '';
                                            $return .= '<tr>
                                                    <td style="padding-left:15px; vertical-align:middle;">
                                                        <i class="fa '.$menu['icon'].'"></i> '.$menu['menu'].'
                                                        <input type="checkbox" name="idMenu[]" id="idMenu-'.$menu['idMenu'].'" value="'.$menu['idMenu'].'" class="d-none">
                                                    </td>
                                                    <td>';
                                            $a = $menu['idModule'];

                                            $actionsMenu = explode(',', $menu['actions']);
                                            foreach ($actionsMenu as $actionMenu) {
                                                $act = $actions[$actionMenu];
                                                $return .= getButtons($menu['idMenu'], $act, $access);
                                            }
                                            $return .= '</td></tr>';
                                        }
                                    }
                                $return .= '
                                </table>
                            </div>';
                        }
                        $return .= '
                    </div>
                </div>
            </div>
        </div>
        ';
        return $return;
    }

    function getButtons($idMenu, $action, $access = []) {
        $retorno = '';
        $clsChecked = 'btn-outline-dark-check';
        $chxChecked = '';
        if ($_POST['action'] == 'update' || $_POST['action'] == 'read') {
            if (!empty($access[$idMenu])) {
                $access = explode(',', $access[$idMenu]['access']);
                foreach ($access as $key) {
                    //echo $access . ' - ' . $action['idAction'] . '<br>';
                    if ($key == $action['idAction']) {
                        $clsChecked = 'btn-primary';
                        $chxChecked = 'checked';
                        $retorno .= '<script>$("#idMenu-'.$idMenu.'").prop("checked", "checked")</script>';
                    }
                }
            }
        }
        $retorno .= '
            <i id="'.$idMenu.'-'.$action['idAction'].'-i">
                <button type="button" style="width:32px" class="btn btn-sm '.$clsChecked.' access-btn" onclick="selectAction('.$idMenu.', '.$action['idAction'].')" title="'.$action['name'].'">
                    <i class="'.$action['icon'].'"></i>
                </button>
                <input type="checkbox" name="access'.$idMenu.'[]" value="'.$action['idAction'].'" class="input-form d-none action-'.$idMenu.' access-chx" '.$chxChecked.'>
            </i>
        ';
        return $retorno;
    }
?>