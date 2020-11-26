<?php
    require_once(RUTA_ADMIN.'/Connection.php');
	class Modules extends Connection
	{	
		public function __set($a,$b) { $this->$a = mb_strtoupper(filter_var(trim($b),FILTER_SANITIZE_STRING),"UTF-8"); }

		public function create() {
			$sql = "INSERT INTO modules 
                    (idIcon, 
                    name, 
                    description, 
                    idParent) 
				VALUES 
                    ($this->idIcon, 
                    '$this->name', 
                    '$this->description', 
                    $this->idParent)";
            $this->exec($sql);
            return $this->lastId();
		}

		public function update() {
            $sql = "UPDATE modules 
                SET idIcon = $this->idIcon, 
                    name = '$this->name', 
                    description = '$this->description', 
                    idParent = $this->idParent
                WHERE idModule = $this->idModule";
            return $this->exec($sql);
        }

        public function changeStatus($value) {
            $status = ($value == 'activate') ? '1' : '0';
            $sql = "UPDATE modules SET status='$status' WHERE idModule=$this->idModule";
            return $this->exec($sql);
        }

		public function getStatus() {
            $sql = "SELECT status FROM modules WHERE idModule = $this->idModule";
            return ($data = $this->getArray($sql)) ? $data['status'] : '';
        }
        
        public function unique($input) {
            $param = ($this->idModule > 0) ? "AND idModule <> $this->idModule" : "";
            $sql = "SELECT idModule FROM modules WHERE $input = '".$this->{$input}."' $param";
            return (!empty($this->getArray($sql))) ? true : false;
        }
		
		public function validate($action, $values, $Validate, $field = '') {
            //Array con los campos y sus validaciones (required primero siempre).
            //El id de la tabla siempre de primero, no necesita el atributo "required".
            //El campo estatus lo obviamos, se valida internamente.
            $rules = ([
                'idModule'      =>'n:1,3',
                'idParent'      =>'n:1,3',
                'idIcon'        =>'required|n:1,3',
                'name'          =>'required|lae:1,50',
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