<?php
    require_once(RUTA_ADMIN.'/Connection.php');
	class Menus extends Connection
	{	
		public function __set($a, $b) {$this->$a = $b; }

		public function create() {
			$sql = "INSERT INTO menus 
                    (idIcon, 
                    name, 
                    link, 
                    actions, 
                    description, 
                    idModule) 
				VALUES 
                    ($this->idIcon, 
                    '$this->name', 
                    '$this->link', 
                    '$this->actions', 
                    '$this->description', 
                    $this->idModule)";
            $this->exec($sql);
            return $this->lastId();
        }
        
        public function update() {
            try {
                $this->beginTransaction();
                $sql = "SELECT actions FROM menus WHERE idMenu = $this->idMenu";
                $data = $this->getArray($sql);
                $sql = "UPDATE menus 
                        SET idIcon = $this->idIcon, 
                            name = '$this->name', 
                            link = '$this->link', 
                            description = '$this->description', 
                            actions = '$this->actions', 
                            idModule = $this->idModule 
                        WHERE idMenu = $this->idMenu";
                $this->exec($sql);

                if ($data['actions'] != $this->actions) {
                    $sql = "SELECT idProfileMenu, access FROM profilesMenus WHERE idMenu = $this->idMenu";
                    $profilesMenus = $this->getArrayAll($sql);
                    if (!empty($profilesMenus)) {
                        $sqlProMen = '';
                        $actions = explode(',', $data['actions']);
                        foreach ($profilesMenus as $key => $proMen) {
                            $access = explode(',', $proMen['access']);
                            $newAccess = [];
                            foreach ($access as $acc) {
                                if (in_array($acc, $actions)) {
                                    $newAccess[] = $acc;
                                }
                            }
                            $newAccess = implode(',', $newAccess);
                            $sqlProMen .= "UPDATE profilesMenus SET access = '$newAccess' WHERE idProfileMenu = ".$proMen['idProfileMenu']."; ";
                        }
                        $this->exec($sqlProMen);
                    }
                }
                $this->commit();
                return true;
            }
            catch (Exception $e) {
                echo $e->getMessage();
                $this->rollBack();
                return false;
            }
        }

        public function changeStatus($value) {
            $status = ($value == 'activate') ? '1' : '0';
            $sql = "UPDATE menus SET status='$status' WHERE idMenu=$this->idMenu";
            return $this->exec($sql);
        }

		public function getStatus() {
            $sql = "SELECT status FROM menus WHERE idMenu = $this->idMenu";
            return ($data = $this->getArray($sql)) ? $data['status'] : '';
        }
        
        public function unique($input) {
            $sql = "SELECT idMenu FROM menus WHERE $input = '".$this->{$input}."' AND idMenu <> $this->idMenu";
            return (!empty($this->getArray($sql))) ? true : false;
        }

        public function verifyActions()//Verifico que las acciones existan en la báse de datos
		{
            $actions = explode(',', $this->actions);
            foreach ($actions as $idAction) {
                $sql = "SELECT idAction FROM actions WHERE idAction = $idAction";
                if (empty($this->getArray($sql))) return false;
            }
            return true;
        }
		
		public function validate($action, $values, $Validate, $field = '') {
            //Array con los campos y sus validaciones (required primero siempre).
            //El id de la tabla siempre de primero, no necesita el atributo "required".
            //El campo estatus lo obviamos, se valida internamente.
            $rules = ([
                'idMenu'        =>'n:1,3',
                'idIcon'        =>'required|n:1,3',
                'name'          =>'required|lae:1,50',
                'link'          =>'l:1,50',
                'description'   =>'laenc:1,200'
            ]);

            if ($action == 'verify_if_exist') {
                //Valido dato en específico
                return $Validate->validateIt($rules[$field], $values[$field], $action);
            }
            else {
                return $Validate->validateAll($rules, $values, $action);
            }
		}
	}
?>