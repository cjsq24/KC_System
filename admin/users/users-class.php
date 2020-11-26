<?php
	require_once(RUTA_ADMIN.'/Connection.php');
	class Users extends Connection
	{	
		public function __set($a,$b) { $this->$a = mb_strtoupper(filter_var(trim($b),FILTER_SANITIZE_STRING),"UTF-8"); }

		public function create() {
			$sql = "INSERT INTO users (idPerson, idProfile, name, email) VALUES ($this->idPerson, $this->idProfile, '$this->name', '$this->email')";
            $this->exec($sql);
            $idUser = $this->lastId();
            if ($idUser > 0) {
                if ($this->exec("INSERT INTO usersPasswords (idUser, password) VALUES ($idUser, '12345')")) {
                    return $idUser;
                }
                else return 0;
            }
            else return 0;
		}

		public function update() {
            $sql = "UPDATE users SET name = '$this->name', email = '$this->email' WHERE idUser = $this->idUser";
            return $this->exec($sql);
        }
        
        public function changeStatus($value) {
            $status     = ($value == 'activate') ? '1' : '0';
            $conditions  = ($value == 'inactivate') ? ", conditions = '2'" : "";
            $sql = "UPDATE users SET status = '$status' $conditions WHERE idUser = $this->idUser";
            return $this->exec($sql);
        }

		public function getStatus() { //VERIFICO EL ESTATUS DEL REGISTRO
            $sql = "SELECT status FROM users WHERE idUser = $this->idUser";
            return ($data = $this->getArray($sql)) ? $data['status'] : '';
        }
        
        public function unique($input) {
            $sql = "SELECT idUser FROM users WHERE $input = '".$this->{$input}."' AND idUser <> $this->idUser";
            return (!empty($this->getArray($sql))) ? true : false;
        }

        public function checkPerson() { //Verifico que la persona no esté ya registrada y que esté activo
            $sql = "SELECT idPerson FROM persons 
                    WHERE idPerson = $this->idPerson AND status = '1' 
                    AND idPerson NOT IN (SELECT idPerson FROM users WHERE idUser <> $this->idUser)";
            return (!empty($this->getArray($sql))) ? true : false;
        }

        public function getCondition() {
            $sql = "SELECT conditions FROM users WHERE idUser = $this->idUser";
            return ($data = $this->getArray($sql)) ? $data['conditions'] : '';
        }

        public function changeCondition($value) {
            $conditions = ($value == 'locked') ? '2' : '1';
            $sql = "UPDATE users SET conditions = '$conditions' WHERE idUser = $this->idUser";
            return $this->exec($sql);
        }
		
		public function validate($action, $values, $Validate, $field = '') {
            //Array con los campos y sus validaciones (required primero siempre).
            //El id de la tabla siempre de primero, no necesita el atributo "required".
            //El campo status lo obviamos, se valida internamente.
            $rules = ([
                'idUser'    =>'n:1,3',
                'idPerson'  =>'required|n:1,8',
                'name'      =>'required|lae:1,50'
            ]);

            if ($action == 'verify_if_exist') {
                //Valido dato en específico
                if (empty($rules[$field])) return true;
                return $Validate->validateIt($rules[$field], $values[$field], $action);
            }
            else if ($action == 'changeCondition') {
                if ($this->conditions == '1' || $this->conditions == '2') return true;
                else return false;
            }
            else return $Validate->validateAll($rules, $values, $action);
		}
	}
?>