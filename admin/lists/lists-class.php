<?php
	require_once(RUTA_ADMIN.'/Connection.php');
	class Lists extends Connection
	{	
		public function __set($a,$b) { $this->$a = filter_var(trim($b),FILTER_SANITIZE_STRING); }

		public function create() {
			$sql = "INSERT INTO lists (idParent, name, keyName, description) 
                    VALUES ($this->idParent, '$this->name', '$this->keyName', '$this->description')";
            $this->exec($sql);
            return $this->lastId();
		}

		public function update() {
            $sql = "UPDATE lists 
                    SET idParent = $this->idParent,
                        name = '$this->name', 
                        keyName = '$this->keyName', 
                        description = '$this->description' 
                    WHERE idList = $this->idList";
            return $this->exec($sql);
        }
        
        public function changeStatus($value) {
            $status = ($value == 'activate') ? '1' : '0';
            $sql = "UPDATE lists SET status = '$status' WHERE idList = $this->idList";
            return $this->exec($sql);
        }

		public function getStatus() {
            $sql = "SELECT status FROM lists WHERE idList = $this->idList";
            return ($data = $this->getArray($sql)) ? $data['status'] : '';
        }
        
        public function unique($input) {
            $sql = "SELECT idList FROM lists WHERE $input = '".$this->{$input}."' AND idList <> $this->idList";
            return (!empty($this->getArray($sql))) ? true : false;
        }
		
		public function validate($action, $values, $Validate, $field = '') {
            //Array con los campos y sus validaciones (required primero siempre).
            //El id de la tabla siempre de primero, no necesita el atributo "required".
            //El campo status lo obviamos, se valida internamente.
            $rules = ([
                'idList'      => 'n:1,3',
                'name'        => 'required|lae:1,50',
                'keyName'     => 'required|l_:1,20',
                'description' => 'laenc:1,200'
            ]);

            if ($action == 'verify_if_exist') {
                //Valido dato en específico
                return $Validate->validateIt($rules[$field], $values[$field], $action);
            }
            else return $Validate->validateAll($rules, $values, $action);
		}
	}
?>