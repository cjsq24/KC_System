<?php 
    require('../config-ini.php');
    require(RUTA_ADMIN.'/General-class.php');
    $General = new General;

    if (isset($_POST['action'])) {
        $obj = $_POST;
    } else { // dejo preparado para usar en peticiones de app movil
        $json = file_get_contents('php://input');
        $obj = json_decode($json,true);
    }
    //$json = json_encode($obj);
    extract($obj);

    switch ($action) {
        case 'modules': //Módulos
            $options = $General->getSetOptions("SELECT idModule AS a, name AS b FROM modules ORDER BY name", $defaultVal);
        break;
        case 'modulesParentNull': //Módulos con parent = null
            $options = $General->getSetOptions("SELECT idModule AS a, name AS b FROM modules WHERE idParent IS NULL ORDER BY name", $defaultVal);
        break;
        case 'lists':
            $options = $General->getSetOptions("SELECT idList AS a, name AS b FROM lists ORDER BY name", $defaultVal);
        break;
        case 'listsValues':
            $options = $General->getSetOptions("SELECT idListValue AS a, name AS b FROM listsValues WHERE idList = $val ORDER BY name", $defaultVal);
        break;
        case 'listsValuesParent':
            $list = $General->getArray("SELECT * FROM lists WHERE idList = $val");
            if (!empty($list['idParent'])) {
                $options = $General->getSetOptions("SELECT idListValue AS a, name AS b FROM listsValues WHERE idList = ".$list['idParent']." ORDER BY name", $defaultVal);
            }
            else {
                $options = '<option value="">'.$defaultVal.'</option>';
            }
        break;
        case 'listsValuesGeneral':
            $parentW = ($val > 0) ? " AND lisV.idParent = $val" : '';
            $field = ($field == 'name') ? "lisV.name AS b" 
                : (
                    ($field == 'abbreviation') ? "lisV.abbreviation AS b" 
                    : "concat(lisV.abbreviation, ' - ', lisV.name) AS b"
                );
            $options = $General->getSetOptions(
                "SELECT lisV.idListValue AS a, $field 
                FROM listsValues AS lisV 
                INNER JOIN lists AS lis ON lis.idList = lisV.idList 
                WHERE lis.keyName = '$keyName' $parentW 
                ORDER BY lisV.name", $defaultVal);
        break;
        case 'persons': //Personas
            $options = $General->getSetOptions("SELECT idPerson AS a, concat(name, ' ', surname, ' | (', idDocument, ')') AS b FROM persons ORDER BY name", $defaultVal);
        break;
        case 'personsNotInUsers': //Personas
            $options = $General->getSetOptions(
                "SELECT idPerson AS a, concat(name, ' ', surname, ' | (', idDocument, ')') AS b 
                FROM persons 
                WHERE idPerson NOT IN (SELECT idPerson FROM users)
                ORDER BY name", $defaultVal);
        break;
        case 'profiles':
            $options = $General->getSetOptions("SELECT idProfile AS a, name AS b FROM profiles WHERE status = '1' ORDER BY name", $defaultVal);
        break;
    }
    echo json_encode(compact('options'));