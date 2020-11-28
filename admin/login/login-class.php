<?php
	require_once(RUTA_ADMIN.'/Connection.php');
	class Login extends Connection
	{
        public function __set($a,$b) { $this->$a = filter_var(trim($b),FILTER_SANITIZE_STRING); }

        public function verifyUser()
        {
            $sql = "SELECT a.idUser 
                    FROM users AS a 
                    INNER JOIN usersPasswords AS b ON a.idUser = b.idUser 
                    WHERE a.email = '$this->email' AND b.password = '$this->password' AND b.status = '1'";
            return ($data = $this->getArray($sql)) ? $data['idUser'] : 0;
        }

        public function log($idUser)
        {
            $sql = "SELECT idProfile FROM users WHERE idUser = $idUser";
            return $this->getArray($sql);
        }
        
        public function validUser()///Empieso A validar Usuario ******
		{
			$data['result'] = "not_exists";
            $currentDate = date("Y-m-d");
            
            $sql = "SELECT usr.*, pass.*, pro.name AS nameProfile 
                FROM users AS usr 
                INNER JOIN usersPasswords AS pass ON pass.idUser = usr.idUser 
                INNER JOIN profiles AS pro ON pro.idProfile = usr.idProfile 
                WHERE usr.email = '$this->email' AND usr.status = '1' AND pass.status = '1'
            ";
            
            if ($dataUser = $this->getArray($sql)) {
                $this->idUser = $dataUser['idUser'];
                $data['idUser'] = $dataUser['idUser'];
                $userFailedAttemptsC = $this->getConfigValue('userFailedAttempts');

                if ($dataUser['conditions'] == '0') {
                    $data['result'] = "changePassword";
                }
                else if ($dataUser['conditions'] == '2') {
                    $data['result'] = "locked";
                }
                else if($dataUser['attempts'] >= $userFailedAttemptsC) {//BLOQUEO DE USUARIO POR INTENTO FALLIDO
                    $sql = "UPDATE users SET conditions = 2 WHERE idUser = ".$dataUser['idUser'];
                    $this->exec($sql);
                    $data['result'] = "lockedByAttempts";
                }	
				else if ($dataUser['password'] == $this->password) {
					$data['idUser']      = $dataUser['idUser'];
					$data['email']       = $dataUser['email'];
					$data['idProfile']   = $dataUser['idProfile'];
					$data['nameProfile'] = $dataUser['nameProfile'];

					$daysWarningExpPassC = $this->getConfigValue('daysWarningExpPass');
					
					// VOY A CALCULAR DIFERENCIA ENTRE FECHAS PARA MENSAJE DE CADUCIDAD DE PWD
					$seconds = strtotime($dataUser['endDate']) - strtotime($currentDate);
                    $daysWarningExpPass = intval($seconds / 60 / 60 / 24) + 0;
                    
					/**************************************************************/
					if (strtotime($currentDate) >= strtotime($dataUser['endDate'])) {//La contraseña caducó
					    $data['result'] = "passwordExpired";
					}
					else if ($daysWarningExpPass <= $daysWarningExpPassC) {//INFORMANDO PRONTA CADUCIDAD DE CONTRASEÑA
                        $data['message'] = "Su clave caducará en $daysWarningExpPass días, recuerde cambiarla antes";
                        $data['result'] = "existsWarning";
					}
					else {
                        $data['result'] = "exists";
                    }
				}
            }
			return $data;
        }

        public function loginUser() {
            $this->exec("UPDATE users SET attempts = 0, lastEntry = current_date() WHERE idUser = $this->idUser");
        }
        
        public function failedAttempt() {
            $sql = "UPDATE users SET attempts = attempts + 1 WHERE idUser = $this->idUser";
            $this->exec($sql);
        }

        public function checkNewPassword($newPassword) {
            $config = $this->getConfigValue('minLongPass, maxLongPass, minUpperPass, minLowerPass, minSpecialCharsPass, charsAllowedPass, minNumPass');

            $contValid = 1;
            if ($config['minLowerPass'] > 0)        $contValid ++;
            if ($config['minUpperPass'] > 0)        $contValid ++;
            if ($config['minSpecialCharsPass'] > 0) $contValid ++;
            if ($config['minNumPass'] > 0)          $contValid ++;

            return ($this->checkPasswordRules($newPassword, $config) == $contValid) ? true : false;
        }

        function checkPasswordRules($value, $config) {
            $cont = 0;

            $nums           = '/^[0-9]+$/';
            $stringLower    = '/^[a-z]+$/';
            $stringUpper    = '/^[A-Z]+$/';
            $charsAllowed   = '/^['.$config['charsAllowedPass'].']+$/';

            if (strlen($value) >= $config['minLongPass'] && strlen($value) <= $config['maxLongPass']) {
                $cont ++;
            }

            if ($config['minLowerPass'] > 0) {
                if ($this->checkExpression($value, $stringLower) >= $config['minLowerPass']) {
                    $cont ++;
                }
            }

            if ($config['minUpperPass'] > 0) {
                if ($this->checkExpression($value, $stringUpper) >= $config['minUpperPass']) {
                    $cont ++;
                }
            }

            if ($config['minSpecialCharsPass'] > 0) {
                if ($this->checkExpression($value, $charsAllowed) >= $config['minSpecialCharsPass']) {
                    $cont ++;
                }
            }

            if ($config['minNumPass'] > 0) {
                if ($this->checkExpression($value, $nums) >= $config['minNumPass']) {
                    $cont ++;
                }
            }
            return $cont;
        }

        public function checkExpression($value, $expression) {
            $cont = 0;
            $posMax = strlen($value);
            for ($i = 0; $i < $posMax; $i ++) {
                if (preg_match($expression, $value[$i])) {
                    $cont ++;
                }
            }
            return $cont;
        }

        public function checkOldPassword($oldPassword) {
            $sql = "SELECT password FROM usersPasswords WHERE idUser = $this->idUser AND password = '$oldPassword' AND status = '1'";
            return (!empty($this->getArray($sql))) ? true : false;
        }

        public function setNewPassword($newPassword) {
            if (!$this->exec("UPDATE usersPasswords SET status = '0' WHERE idUser = $this->idUser AND status = '1'")) return false;

            $keyExpirDatePass = $this->getConfigValue('keyExpirDatePass');
			$date = date_create(date('Y-m-d'));
			date_add($date, date_interval_create_from_date_string($keyExpirDatePass.'days'));
            $endDate = date_format($date, 'Y-m-d');
            
            $sql = "INSERT INTO usersPasswords (idUser, password, startDate, endDate) VALUES ($this->idUser, '$newPassword', CURDATE(), '$endDate'); 
            UPDATE users SET conditions = '1' WHERE idUser = $this->idUser";
            return ($this->exec($sql)) ? true : false;
        }

		public function create()
		{
			$sql = "INSERT INTO tdepartamento (nombre, descripcion) 
				    VALUES ('$this->nombre', '$this->descripcion')";
			return $this->exec($sql);
		}

		public function update()
		{
            $sql = "UPDATE tdepartamento 
                SET nombre = '$this->nombre', descripcion = '$this->descripcion' 
                WHERE iddepartamento = $this->iddepartamento";
            return $this->exec($sql);
        }
        
        public function changeStatus($value)
        {
            $status = ($value == 'activate') ? '1' : '0';
            $sql = "UPDATE tdepartamento SET estatus='$status' WHERE iddepartamento=$this->iddepartamento";
            return $this->exec($sql);
        }

		public function getStatus()/*VERIFICO EL ESTATUS DEL REGISTRO*/
		{
            $sql = "SELECT estatus FROM tdepartamento WHERE iddepartamento = $this->iddepartamento";
            return ($data = $this->getArray($sql)) ? $data['estatus'] : '';
        }
        
        public function unique($input)
		{
            $sql = "SELECT iddepartamento FROM tdepartamento WHERE $input = '".$this->{$input}."' AND iddepartamento <> $this->iddepartamento";
            return (!empty($this->getArray($sql))) ? true : false;
        }
		
		public function validate($action, $values, $objValidate)
		{
            //Array con los campos y sus validaciones (required primero siempre).
            //El id de la tabla siempre de primero, no necesita el atributo "required".
            //El campo estatus lo obviamos, se valida internamente.
            $rules = ([
                'iddepartamento'=>'int:1,3',
                'nombre'        =>'required|lae:1,50',
                'descripcion'   =>'laenc:1,200'
            ]);

            if ($action == 'verificar_nombre') {
                //Valido dato en específico
                return $objValidate->validateIt($rules['nombre'], $values['nombre'], $action);
            }
            else return $objValidate->validateAll($rules, $values, $action);
		}
	}
?>