<?php
    require_once(RUTA_ADMIN.'/Connection.php');
	class Profiles extends Connection
	{	
		public function __set($a,$b) {
            if (is_array($b)) $this->$a = $b;
            else $this->$a = mb_strtoupper(filter_var(trim($b), FILTER_SANITIZE_STRING), 'UTF-8');
        }

		public function create($values) {
            try {
                $this->beginTransaction();
                $sql = "INSERT INTO profiles (name, description) VALUES ('$this->name', '$this->description')";
                $this->exec($sql);
                $id = $this->lastId($sql);
                $this->idProfile = $this->lastId();
                $this->insertAccess($values);
                $this->commit();
                return $id;
            }
            catch (Exception $e) {
                $this->rollBack();
                return 0;
            }
        }

        public function insertAccess($values) {
            $val = '';
            foreach ($values as $key => $value) {
                $val .= $value[0].$this->idProfile.$value[2];
            }
            $sql = "INSERT INTO profilesMenus (idProfile, idMenu, access) VALUES $val;";
            $this->exec($sql);
        }

        public function update($values) {
            try {
                $this->beginTransaction();
                $sql = "UPDATE profiles SET name = '$this->name', description = '$this->description' WHERE idProfile = $this->idProfile";
                $this->exec($sql);
                $sql = "DELETE FROM profilesMenus WHERE idProfile = $this->idProfile";
                $this->exec($sql);
                $this->insertAccess($values);
                $this->commit();
                return true;
            }
            catch (Exception $e) {
                $this->rollBack();
                return false;
            }
        }
        
        public function changeStatus($value)
        {
            $status = ($value == 'activate') ? '1' : '0';
            $sql = "UPDATE profiles SET status='$status' WHERE idProfile=$this->idProfile";
            return $this->exec($sql);
        }

		public function getStatus() {
            $sql = "SELECT status FROM profiles WHERE idProfile = $this->idProfile";
            return ($data = $this->getArray($sql)) ? $data['status'] : '';
        }
        
        public function unique($input) {
            $sql = "SELECT idProfile FROM profiles WHERE $input = '".$this->{$input}."' AND idProfile <> $this->idProfile";
            return (!empty($this->getArray($sql))) ? true : false;
        }

        public function verifyActions($actions) {//Verifico que las acciones existan en la báse de datos
            foreach ($actions as $idAction) {
                $sql = "SELECT idAction FROM actions WHERE idAction = $idAction";
                if (empty($this->getArray($sql))) return false;
            }
            return true;
        }

        public function createAccess2($idProfile, $idMenu, $access) {
            /*$values = '';
            $idAccess = explode(',', $access);
            foreach ($idAccess as $key => $access) {
                $c = ($key > 0) ? ',' : '';
                $values .= "$c($idProfile, $idMenu, $access)";
            }*/
			$sql = "INSERT INTO profilesMenus (idProfile, idMenu, access) VALUES ($idProfile, $idMenu, '$access')";
            $this->exec($sql);
        }
        
        public function createAccess($values) {
            $sql = "INSERT INTO profilesMenus (idProfile, idMenu, access) VALUES $values;";
            $this->exec($sql);
        }

        public function getAccess() {
            $sql = "SELECT pro.name AS profile, men.idMenu, men.name AS menu, promen.access 
                FROM profilesMenus AS promen 
                INNER JOIN profiles AS pro ON pro.idProfile = promen.idProfile 
                INNER JOIN menus AS men ON men.idMenu = promen.idMenu 
                WHERE promen.idProfile = $this->idProfile";
            $access = $this->getArrayAll($sql);
            $array = [];
            foreach ($access as $key) {
                $array[$key['idMenu']]['idMenu'] = $key['idMenu'];
                $array[$key['idMenu']]['access'] = $key['access'];
            }
            return $array;
        }
		
		public function validate($action, $values, $Validate) {
            //Array con los campos y sus validaciones (required primero siempre).
            //El id de la tabla siempre de primero, no necesita el atributo "required".
            //El campo status lo obviamos, se valida internamente.
            $rules = ([
                'idProfile'     =>'n:1,3',
                'name'          =>'required|lae:1,50',
                'description'   =>'laenc:1,200'
            ]);

            if ($action == 'verify_if_exist') {
                //Valido dato en específico
                return $Validate->validateIt($rules['name'], $values['name'], $action);
            }
            else {
                if ($action == 'create' || $action == 'update') {
                    $this->idMenu = explode(',', $this->idMenu);
                    foreach ($this->idMenu as $idMenu) {
                        if (!$Validate->n($idMenu, 1, 3)) return false;
                    }
                }
                return $Validate->validateAll($rules, $values, $action);
            }
		}
	}
?>