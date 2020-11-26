<?php
	require_once(RUTA_ADMIN.'/Connection.php');
	class ListsValues extends Connection
	{	
		public function __set($a,$b) { $this->$a = mb_strtoupper(filter_var(trim($b),FILTER_SANITIZE_STRING), 'UTF-8'); }

		public function create()
		{
			$sql = "INSERT INTO listsValues 
                    (idList, idParent, name, abbreviation, position, description) 
                    VALUES ($this->idList, $this->idParent, '$this->name', '$this->abbreviation', '$this->position', '$this->description')";
            $this->exec($sql);
            return $this->lastId();
		}

		public function update()
		{
            $sql = "UPDATE listsValues 
                    SET idList = $this->idList, 
                        idParent = $this->idParent, 
                        name = '$this->name', 
                        abbreviation = '$this->abbreviation', 
                        position = '$this->position', 
                        description = '$this->description' 
                    WHERE idListValue = $this->idListValue";
            return $this->exec($sql);
        }
        
        public function changeStatus($value)
        {
            $status = ($value == 'activate') ? '1' : '0';
            $sql = "UPDATE listsValues SET status='$status' WHERE idList=$this->idList";
            return $this->exec($sql);
        }

		public function getStatus()/*VERIFICO EL ESTATUS DEL REGISTRO*/
		{
            $sql = "SELECT status FROM listsValues WHERE idList = $this->idList";
            return ($data = $this->getArray($sql)) ? $data['status'] : '';
        }
        
        public function unique($input)
		{
            $param = ($this->idList > 0) ? "AND idList <> $this->idList" : "";
            $sql = "SELECT idList FROM listsValues WHERE $input = '".$this->{$input}."' $param";
            return (!empty($this->getArray($sql))) ? true : false;
        }
		
		public function validate($action, $values, $Validate, $field = '')
		{
            //Array con los campos y sus validaciones (required primero siempre).
            //El id de la tabla siempre de primero, no necesita el atributo "required".
            //El campo status lo obviamos, se valida internamente.
            $rules = ([
                'idListValue'   =>'n:1,8',
                'idList'        =>'required|n:1,8',
                'name'          =>'required|lae:1,50',
                'abbreviation'  =>'l:1,5',
                'position'      =>'n:1,2',
                'description'   =>'laenc:1,200'
            ]);

            if ($action == 'verify_if_exist') {
                //Valido dato en específico
                return $Validate->validateIt($rules[$field], $values[$field], $action);
            }
            else return $Validate->validateAll($rules, $values, $action);
		}
	}
?>