<?php
	require_once(RUTA_ADMIN.'/Connection.php');
	class Settings extends Connection
	{	
		public function __set($a,$b) { $this->$a = mb_strtoupper(filter_var(trim($b),FILTER_SANITIZE_STRING),"UTF-8"); }

		public function create()
		{
			$sql = "INSERT INTO departamentos (name, description) VALUES ('$this->name', '$this->description')";
            $this->exec($sql);
            return $this->lastId();
		}

		public function update()
		{
            return $this->exec(
                "UPDATE settings 
                SET minLongPass = $this->minLongPass, 
                maxLongPass = $this->maxLongPass, 
                minNumPass = $this->minNumPass, 
                minUpperPass = $this->minUpperPass, 
                minLowerPass = $this->minLowerPass, 
                charsAllowedPass = '$this->charsAllowedPass', 
                keyExpirDatePass = $this->keyExpirDatePass, 
                daysWarningExpPass = $this->daysWarningExpPass, 
                userFailedAttempts = $this->userFailedAttempts
            ");
        }
        
        public function changeStatus($value)
        {
            $status = ($value == 'activate') ? '1' : '0';
            $sql = "UPDATE departamentos SET status='$status' WHERE idDepartamento=$this->idDepartamento";
            return $this->exec($sql);
        }

		public function getStatus()/*VERIFICO EL ESTATUS DEL REGISTRO*/
		{
            $sql = "SELECT status FROM departamentos WHERE idDepartamento = $this->idDepartamento";
            return ($data = $this->getArray($sql)) ? $data['status'] : '';
        }
        
        public function unique($input)
		{
            $param = ($this->idDepartamento > 0) ? "AND idDepartamento <> $this->idDepartamento" : "";
            $sql = "SELECT idDepartamento FROM departamentos WHERE $input = '".$this->{$input}."' $param";
            return (!empty($this->getArray($sql))) ? true : false;
        }
		
		public function validate($action, $values, $Validate)
		{
            //Array con los campos y sus validaciones (required primero siempre).
            //El id de la tabla siempre de primero, no necesita el atributo "required".
            //El campo status lo obviamos, se valida internamente.
            $rules = ([
                'minLongPass'       =>'required|n:1,2',
                'maxLongPass'       =>'required|n:1,2',
                'minNumPass'        =>'required|n:1,2',
                'minUpperPass'      =>'required|n:1,2',
                'minLowerPass'      =>'required|n:1,2',
                'keyExpirDatePass'  =>'required|n:1,3',
                'daysWarningExpPass'=>'required|n:1,3'
            ]);
            return $Validate->validateAll($rules, $values, $action);
		}
	}
?>