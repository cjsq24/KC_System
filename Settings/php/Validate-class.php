<?php

	/*
	* Validaciones
	*/

	class Validate
	{
		function validateAll($rules, $values, $action)
		{
			//Verifico el estatus
			if ($action == 'activate' || $action == 'inactivate' || $action == 'update') {
				if ($action == 'activate') {
					if ($values['status'] == '1') return false;
				}
				else if ($action == 'inactivate' || $action == 'update') {
					if ($values['status'] == '0') return false;
				}
			}

			$input = array_keys($rules);
			$functions = array_values($rules);
			$cont = count($rules);
			$j = ($action != 'create') ? 0 : 1;
			$cont = ($action == 'activate' || $action == 'inactivate') ? 0 : $cont;
			for ($i = 0; $i < $cont; $i ++) {
				$function = explode('|', $functions[$i]);
				if ($function[0] == 'required') {
					if ($values[$input[$i]] == '') {
						echo $values[$input[$i]] . ' requerido y vacío<br>';
						return false;
					}
					
					if (!empty($function[1])) {
						$f = explode(':', $function[1]);
						if (!empty($f[1])) {
							$param = explode(',', $f[1]);
							if (!$this->{$f[0]}($values[$input[$i]], $param[0], $param[1])) { echo $input[$i].'='.$values[$input[$i]]; return false; }
							}
							else {
								if (!$this->{$f[0]}($values[$input[$i]])) { 
									echo 'salgo2'; 
									return false;
								}
							}
						}
				}
				else {
					if ($values[$input[$i]] != '') {
						$f = explode(':', $function[0]);
						if (!empty($f[1])) {
							$param = explode(',', $f[1]);
							if (!$this->{$f[0]}($values[$input[$i]], $param[0], $param[1])) {
								return false;
							}
						}
						else {
							if (!$this->{$f[0]}($values[$input[$i]])) {
								return false;
							}
						}
					}
				}
			}
				return true;
		}

		function validateIt($rule, $value, $action)
		{
			$function = explode('|', $rule);
			if ($function[0] == 'required') {
				if ($value == '') return false;

				if (!empty($function[1])) {
					$f = explode(':', $function[1]);
						//$param = explode(',', $f[1]);
						//if (!$this->{$f[0]}($value, $param[0], $param[1])) return false;
					if (!empty($f[1])) {
						$param = explode(',', $f[1]);
						if (!$this->{$f[0]}($value, $param[0], $param[1])) return false;
					}
					else {
						if (!$this->{$f[0]}($value)) return false;
					}
				}
			}
			else {
				if ($value != '') {
					$f = explode(':', $function[0]);
					//$param = explode(',', $f[1]);
					//if (!$this->{$f[0]}($value, $param[0], $param[1])) return false;
					if (!empty($f[1])) {
						$param = explode(',', $f[1]);
						if (!$this->{$f[0]}($value, $param[0], $param[1])) return false;
					}
					else {
						if (!$this->{$f[0]}($value)) return false;
					}
				}
			}
			return true;
		}

		  //ENTEROS
		function int($val, $min, $max)
		{
			if (filter_var($val, FILTER_VALIDATE_INT) && (strlen($val) >= $min && strlen($val) <= $max)) {
				return true;
			}
				else return false;
		}
		
		/*VALIDAR LETRAS ACENTOS Y ESPACIO*/
		function lae($val, $min, $max)
		{
			$pattern = '/^[A-Za-zÑÁÉÍÓÚñáéíóú ]+$/';
			if(preg_match($pattern, $val) && (strlen($val) >= $min && strlen($val) <= $max)) {
				return true;
			}
			else return false;
		}
		
		/*Validar letras, acentos, espacios, números y caracteres especiales*/
		function laenc($val, $min, $max)
		{
			$pattern = '/^[A-Za-z0-9-ZÑÁÉÍÓÚñáéíóú ,.;:¡!¿?#$%&()"]+$/';
			if(preg_match($pattern, $val) && (strlen($val) >= $min && strlen($val) <= $max)) {
				return true;
			}
			else return false;
		}
		
		//Sólo letras
		function l($val, $min, $max)
		{
			$pattern = '/^[A-Za-z]+$/';
			if(preg_match($pattern, $val) && (strlen($val) >= $min && strlen($val) <= $max))
				return true;
			else return false;
		}

		//Sólo letras y underscore
		function l_($val, $min, $max)
		{
			$pattern = '/^[A-Za-z_]+$/';
			if(preg_match($pattern, $val) && (strlen($val) >= $min && strlen($val) <= $max)) {
				return true;
			} else {
				return false;
			}
		}
		
		function bool($val)
		{
			if ($val == '0' || $val == '1') {
				return true;
			}
			else return false;
		}

		//Validar letras, números y guiones
		function lng($val, $min, $max)
		{
			$pattern = '/^[A-Za-z0-9-]+$/';
			if(preg_match($pattern, $val) && (strlen($val) >= $min && strlen($val) <= $max)) {
				return true;
			}
			else return false;
		}

		function n($val, $min, $max)
		{
			$pattern = '/^[0-9]+$/';
			if(preg_match($pattern, $val) && (strlen($val) >= $min && strlen($val) <= $max))
				return true;
			else return false;
		}

		function dateSpa($date) {
			$valueOne = explode('/', $date);
			$valueTwo = explode('-', $date);
			$value = (is_array($valueOne) && count($valueOne) == 3) ? $valueOne : ((is_array($valueTwo) && count($valueTwo) == 3) ? $valueTwo : null);
			
			if(count($value) == 3 && checkdate($value[1], $value[0], $value[2])){
				return true;
			}
			return false;
		}

		function email($val) {
			if (filter_var($val, FILTER_VALIDATE_EMAIL)) {
				return true;
			}
			return false;
		}

		function fValidarCedula($Valor)
		{
			$Patron='/^[VE]{1}[-]{1}[0-9]{7,10}$/';
			if(preg_match($Patron,$Valor))
				return '1';
			else 
				return '0';
		}
		
		/*VALIDAR LETRAS*/
		function fValidarL($Valor,$Min,$Max)
		{
			$Patron='/^[A-Za-z]+$/';
			if(preg_match($Patron,$Valor) && (strlen($Valor)>=$Min && strlen($Valor)<=$Max))
				return '1';
			else 
				return '0';
		}

		/*VALIDAR LETRAS Y ACENTOS*/
		function fValidarLA($Valor,$Min,$Max)
		{
			$Patron='/^[A-Za-zÑÁÉÍÓÚñáéíóú]+$/';
			if(preg_match($Patron,$Valor) && (strlen($Valor)>=$Min && strlen($Valor)<=$Max))
				return '1';
			else 
				return '0';
		}

		/*VALIDAR LETRAS ACENTOS Y ESPACIO*/
		function fValidarLAE($Valor,$Min,$Max)
		{
			$Patron='/^[A-Za-zÑÁÉÍÓÚñáéíóú ]+$/';
			if(preg_match($Patron,$Valor) && (strlen($Valor)>=$Min && strlen($Valor)<=$Max))
				return '1';
			else 
				return '0';
		}

		/*Valida solo numeros y letras*/
		function fValidarLN($Valor,$Min,$Max)
		{
			$Patron='/^[A-Za-z0-9]+$/';
			if(preg_match($Patron,$Valor) && (strlen($Valor)>=$Min && strlen($Valor)<=$Max))
				return '1';
			else 
				return '0';
		}

		/*VALIDAR LETRA NUMERO Y ESPACIO*/
		function fValidarLNE($Valor,$Min,$Max)
		{
			$Patron='/^[A-Za-z0-9| |]+$/';
			if(preg_match($Patron,$Valor) && (strlen($Valor)>=$Min && strlen($Valor)<=$Max))
				return '1';
			else 
				return '0';
		}

		function fValidarN($Valor,$Min,$Max)/*Valida solo numeros (sin guiones ni puntos) [0-9]*/
		{
			$Patron='/^[0-9]+$/';
			if(preg_match($Patron,$Valor) && (strlen($Valor)>=$Min && strlen($Valor)<=$Max))
				return '1';
			else 
				return '0';
		}

		/*Valida Usuario (letras numeros y underscore '_')*/
		function fValidarUsuario($Valor,$Min,$Max)
		{
			$Patron='/^[A-Za-z0-9|_|]+$/';
			if(preg_match($Patron,$Valor) && (strlen($Valor)>=$Min && strlen($Valor)<=$Max))
				return '1';
			else 
				return '0';
		}

		/*Validar letras, numeros, espacios Y CARACTERES ESPECIALES*/
		function fValidarLANEC($Valor,$Min,$Max)
		{
			$Patron='/^[A-Za-z0-9-ZÑÁÉÍÓÚñáéíóú ,.;:¡!¿?#$%&()"]+$/';
			if(preg_match($Patron,$Valor) && (strlen($Valor)>=$Min && strlen($Valor)<=$Max))
				return '1';
			else 
				return '0';
		}

		function fValidarEmail($Valor,$Min,$Max)
		{
			if(filter_var($Valor, FILTER_VALIDATE_EMAIL) && (strlen($Valor)>=$Min && strlen($Valor)<=$Max))
				return '1';
			else 
				return '0';
		}

		function fValidarTelefono($Valor,$Min,$Max)
		{
			$Patron='/^[0-9]{4}[-]{1}[0-9]{7}$/';
			if(preg_match($Patron,$Valor) && (strlen($Valor)>=$Min && strlen($Valor)<=$Max))
				return '1';
			else 
				return '0';
		}

		function fValidarFecha($Valor)
		{
			$Valor=explode('-',$Valor);
			if(checkdate($Valor[1], $Valor[2], $Valor[0])){
				return '1';
			}
			else {
				return '0';
			}
		}

		function fValidarPlaca($Valor)
		{
			$Patron='/^[0-9A-Za-z]{3,3}[-]{0,1}[0-9A-Za-z]{3,4}$/';
			if(preg_match($Patron,$Valor)){
				return '1';
			}
			else {
				return '0';
			}
		}

		/*VALIDAR DECIMALES (DE 1 A 20 NUMEROS ANTES DEL PUNTO DECIMAL Y DE 1 A 2 NUMEROS DESPUES DEL PUNTO DECIMAL)*/
		function fValidarD($Valor,$Min,$Max)
		{
			/*LE SUMO EL PUNTO DECIMAL*/
			$Max = $Max + 1;
			$Patron='/^[0-9]{1,20}[.]{1,1}[0-9]{1,2}$/';
			if(preg_match($Patron,$Valor) && (strlen($Valor)>=$Min && strlen($Valor)<=$Max))
				return '1';
			else 
				return '0';
		}

		/*VALIDAR BOOL (VERDADERO = 1 Y FALSO = 0*/
		function fValidarBooleano($Valor)
		{
			$Patron='/^[0-1]{1,1}$/';
			if( preg_match( $Patron , $Valor ) )	{
				return '1';
			}
			else {
				return '0';
			}
		}
	}
?>