<?php
	require_once(RUTA_ADMIN.'/Connection.php');
	class Persons extends Connection
	{	
		public function __set($a,$b) { $this->$a = mb_strtoupper(filter_var(trim($b),FILTER_SANITIZE_STRING),"UTF-8"); }

		public function create() {
			$sql = "INSERT INTO persons 
					(idCity, 
					idDocumentType, 
					idDocument, 
					name, 
					secondName, 
					surname, 
					secondSurname, 
					email, 
					cellPhoneNumber, 
					postalCode, 
					dateBirth, 
					address) 
				VALUES 
					($this->idCity, 
					$this->idDocumentType, 
					'$this->idDocument', 
					'$this->name', 
					'$this->secondName', 
					'$this->surname', 
					'$this->secondSurname', 
					'$this->email', 
					'$this->cellPhoneNumber', 
					'$this->postalCode', 
					'$this->dateBirth', 
					'$this->address')";
			$this->exec($sql);
			return $this->lastId();
		}

		public function update() {
			$sql = "UPDATE persons 
					SET idCity = $this->idCity, 
						idDocumentType = $this->idDocumentType, 
						idDocument = '$this->idDocument', 
						name = '$this->name', 
						secondName = '$this->secondName', 
						surname = '$this->surname', 
						secondSurname = '$this->secondSurname', 
						email = '$this->email', 
						cellPhoneNumber = '$this->cellPhoneNumber', 
						postalCode = '$this->postalCode', 
						dateBirth = '$this->dateBirth', 
						address = '$this->address'
					WHERE idPerson = $this->idPerson";
			return $this->exec($sql);
		}
		
		public function changeStatus($value) {
			$status = ($value == 'activate') ? '1' : '0';
			if ($status == '0') {
				$sql = "SELECT idUser FROM users WHERE idPerson = $this->idPerson";
				if (!empty($this->getArray($sql))) {
					echo $sql = "UPDATE persons AS per, users AS us SET per.status = '0', us.conditions = '2' WHERE per.idPerson = $this->idPerson AND us.idPerson = $this->idPerson";
					return $this->exec($sql);
				}
			}
			else {
				$sql = "UPDATE persons SET status='$status' WHERE idPerson = $this->idPerson";
				return $this->exec($sql);
			}
		}

		public function getStatus() { //VERIFICO EL ESTATUS DEL REGISTRO
			$sql = "SELECT status FROM persons WHERE idPerson = $this->idPerson";
			return ($data = $this->getArray($sql)) ? $data['status'] : '';
		}
		
		public function unique($input) {
			$sql = "SELECT idPerson FROM persons WHERE $input = '".$this->{$input}."' AND idPerson <> $this->idPerson";
			return (!empty($this->getArray($sql))) ? true : false;
		}

		public function checkListValue($list, $value) {
			$sql = "SELECT lisV.idListValue FROM lists AS lis 
					INNER JOIN listsValues AS lisV ON lisV.idList = lis.idList 
					WHERE lis.keyName = '$list' AND lisV.idListValue = $value";
			return (!empty($this->getArray($sql))) ? true : false; 
		}
		
		public function validate($action, $values, $Validate, $field = '') {
			//Array con los campos y sus validaciones (required primero siempre).
			//El id de la tabla siempre de primero, no necesita el atributo "required".
			//El campo status lo obviamos, se valida internamente.
			$rules = ([
				'idPerson'          =>'n:1,3',
				'idCity'            =>'required|n:1,8',
				'idDocumentType'    =>'required|n:1,8',
				'idDocument'        =>'required|lng:1,15',
				'name'              =>'required|lae:1,50',
				'secondName'        =>'lae:1,50',
				'surname'           =>'required|lae:1,50',
				'secondSurname'     =>'lae:1,50',
				'email'             =>'email',
				'cellPhoneNumber'   =>'required|n:1,20',
				'postalCode'        =>'n:1,10',
				'dateBirth'         =>'dateSpa',
				'address'           =>'laenc:1,200'
			]);

			if ($action == 'verify_if_exist') {
				//Valido dato en específico
				if (!empty($rules[$field])) {
					return $Validate->validateIt($rules[$field], $values[$field], $action);
				}
				else {
					return true;
				}
			}
			else return $Validate->validateAll($rules, $values, $action);
		}
	}
?>