<?php
	require_once(RUTA_ADMIN.'/Connection.php');
	class Departamentos extends Connection
	{	
		public function __set($a,$b) { $this->$a = mb_strtoupper(filter_var(trim($b),FILTER_SANITIZE_STRING),"UTF-8"); }

		public function create() {
			$sql = "INSERT INTO departamentos (name, description) VALUES ('$this->name', '$this->description')";
            $this->exec($sql);
            return $this->lastId();
		}

		public function update() {
            $sql = "UPDATE departamentos 
                SET name = '$this->name', description = '$this->description' 
                WHERE idDepartamento = $this->idDepartamento";
            return $this->exec($sql);
        }
        
        public function changeStatus($value)
        {
            $status = ($value == 'activate') ? '1' : '0';
            $sql = "UPDATE departamentos SET status='$status' WHERE idDepartamento=$this->idDepartamento";
            return $this->exec($sql);
        }

		public function getStatus() {
            $sql = "SELECT status FROM departamentos WHERE idDepartamento = $this->idDepartamento";
            return ($data = $this->getArray($sql)) ? $data['status'] : '';
        }
        
        public function unique($input) {
            $sql = "SELECT idDepartamento FROM departamentos WHERE $input = '".$this->{$input}."' AND idDepartamento <> $this->idDepartamento";
            return (!empty($this->getArray($sql))) ? true : false;
        }
		
		public function validate($action, $values, $Validate, $field = '') {
            //Array con los campos y sus validaciones (required primero siempre).
            //El id de la tabla siempre de primero, no necesita el atributo "required".
            //El campo status lo obviamos, se valida internamente.
            $rules = ([
                'idDepartamento' =>'n:1,3',
                'name'           =>'required|lae:1,50',
                'description'    =>'laenc:1,200'
            ]);

            if ($action == 'verify_if_exist') {
                //Valido dato en específico
                return $Validate->validateIt($rules[$field], $values[$field], $action);
            }
            else return $Validate->validateAll($rules, $values, $action);
		}
	}
?>