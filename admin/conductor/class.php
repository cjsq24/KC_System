<?php
	require_once("Datos.cls.php");
	class Departamento extends Datos_cls
	{
		/*DECLARO LAS VARIABLES*/
		/*private $iddepartamento;
		private $nombre;
		private $descripcion;
		private $idusuario;
		private $estatus;*/
		
		public function __set($a,$b) { $this->$a = mb_strtoupper(filter_var(trim($b),FILTER_SANITIZE_STRING),"UTF-8"); }
		
		public function fSetValidar($Operacion,$iddepartamento,$nombre,$descripcion,$estatus,$idusuario,$IdMotivoCambioE,$descripcionCambioE)
		{
			/*PONGO EN MAYUSCULA LAS VARIABLES QUE CONTENGAN LETRAS*/
			$nombre = mb_strtoupper($nombre,'UTF-8');
			$descripcion = mb_strtoupper($descripcion,'UTF-8');
			$descripcionCambioE = mb_strtoupper($descripcionCambioE,'UTF-8');

			/*ARCHIVOS CON LAS VALIDACIONES*/
			require("Validaciones.cls.php");
			$objValidaciones = new Validaciones();

			if ( $objValidaciones -> fValidarN($iddepartamento,1,3) == '0' )	{
				$iddepartamento = '0';
			}

			$Validaciones = array();/*Arreglo para guardar los resultados de la validaciones*/
			if($Operacion == 'verificar_nombre') 
			{
				$Validaciones[0] = $objValidaciones -> fValidarLAE($nombre,1,50);/*Valido nombre*/
			}
			else if($Operacion == 'registrar' || $Operacion == 'modificar')
			{
				if($Operacion == 'modificar') {
					$Validaciones[0] = $objValidaciones -> fValidarN($iddepartamento,1,3);/*Valido nombre*/
				}
				$Validaciones[1] = $objValidaciones -> fValidarLAE($nombre,1,50);/*Valido nombre*/
				if($descripcion != "") {/*Si $descripcion no esta vacio, lo valido*/
					$Validaciones[2] = $objValidaciones -> fValidarLANEC($descripcion,1,200);/*Valido*/
				}
			}
			else if($Operacion == 'activar' || $Operacion == 'desactivar')
			{
				$Validaciones[0] = $objValidaciones -> fValidarN($iddepartamento,1,3);/*Valido nombre*/
				$Validaciones[1] = $objValidaciones -> fValidarLAE($nombre,1,50);/*Valido nombre*/
				$Validaciones[2] = $objValidaciones -> fValidarN($estatus,1,1);/*Valido estatus*/
				$Validaciones[3] = $objValidaciones -> fValidarN($IdMotivoCambioE,1,3);/*Valido Motivo*/
				$Validaciones[4] = $objValidaciones -> fValidarLANEC($descripcionCambioE,1,200);/*Valido descripcion Motivo*/
				$Validaciones[5] = $objValidaciones -> fValidarN($idusuario,1,3);/*Valido nombre*/
			}
			else if( $Operacion == 'historialce' || $Operacion == 'historialm' )
			{
				$Validaciones[0] = $objValidaciones -> fValidarN($iddepartamento,1,3);/*Valido nombre*/
				$Validaciones[1] = $objValidaciones -> fValidarLAE($nombre,1,50);/*Valido nombre*/
			}

			/*Recorro el arreglo para saber si algun dato es invalido*/
			$Resultado = '1';
			foreach ($Validaciones as $Validaciones) { if($Validaciones == '0') { $Resultado = '0'; break; } }

			if($Resultado == '1')
			{
				$this->iddepartamento = $iddepartamento;
				$this->nombre = $nombre;
				$this->descripcion = $descripcion;
				$this->idusuario = $idusuario;
				$this->estatus = $estatus;
			}
			return $Resultado;
		}

		public function fVerificarestatus()/*VERIFICO EL ESTATUS DEL REGISTRO*/
		{
			$Sql="SELECT estatus FROM tdepartamento WHERE iddepartamento='$this->iddepartamento'";
			$this -> fConectar();
			$Tb=$this -> fFiltro($Sql);
			if($Arreglo = $this -> fArreglo($Tb))
			{
				if($Arreglo["estatus"] == '1'){
					$Resultado = '1';
				}
				else if($Arreglo["estatus"] == '0'){
					$Resultado = '0';
				}
			}
			$this -> fCierraFiltro($Tb);
			$this -> fDesconectar();
			return $Resultado;
		}

		public function fVerificarnombre()/*Verificar si el nombre esta registrado*/
		{
			$Resultado = '0';
			$Sql="SELECT iddepartamento FROM tdepartamento WHERE nombre='$this->nombre' AND iddepartamento<>'$this->iddepartamento'";
			$this -> fConectar();
			$Tb = $this -> fFiltro($Sql);
			if($Arreglo = $this -> fArreglo($Tb))
			{
				$Resultado = '1';
			}
			$this -> fCierraFiltro($Tb);
			$this -> fDesconectar();
			return $Resultado;
		}

		public function fVerificarIdnombre()/*Verificar el id y la nombre coinciden*/
		{
			$Resultado = '0';
			$Sql="SELECT nombre FROM tdepartamento WHERE (iddepartamento='$this->iddepartamento' AND nombre='$this->nombre')";
			$this -> fConectar();
			$Tb = $this -> fFiltro($Sql);
			if($Arreglo = $this -> fArreglo($Tb)){
				$Resultado = '1';
			}
			$this -> fCierraFiltro($Tb);
			$this -> fDesconectar();
			return $Resultado;
		}
		
		public function fRegistrar()
		{
			$Sql="INSERT INTO tdepartamento 
					(nombre,
					descripcion,
					idusuario) 
				VALUES 
					('$this->nombre',
					'$this->descripcion',
					'$this->idusuario')";
			$this -> fConectar();
			$Resultado = $this -> fEjecutar($Sql);
			if($Resultado)	{
				$Resultado = '1';
			}
			$this -> fDesconectar();
			return $Resultado;
		}
		
		public function fModificar()
		{
			$Resultado = '1';
			$this -> fConectar();
			$Datos = array();

			/*VERIFICO QUE SE HAYA REALIZADO ALGUNA MODIFICACIÓN*/
			$Sql = "SELECT iddepartamento FROM tdepartamento WHERE iddepartamento='$this->iddepartamento' AND nombre='$this->nombre' AND descripcion='$this->descripcion'";
			$Tb = $this -> fFiltro($Sql);
			if($Arreglo = $this -> fArreglo($Tb)){
				$Resultado = '0';
			}

			if ( $Resultado == '1' )
			{
				$Resultado = '0';
				/*DECLARO LOS NOMBRES DE LOS CAMPOS MODIFICABLES, COMO LOS VE EL USUARIO (CAMPOMOD SIGNIFICA: CAMPO A MODIFICAR)*/
				$Datos[0]['CampoMod'] = 'NOMBRE';
				$Datos[1]['CampoMod'] = 'DESCRIPCIÓN';
				/*SENTENCIA PARA EXTRAER LOS DATOS DEL MODULO*/
				$Sql="SELECT 
						nombre,
						descripcion 
					FROM 
						tdepartamento 
					WHERE 
						iddepartamento='$this->iddepartamento'";
				$Tb = $this -> fFiltro($Sql);
				if($Arreglo = $this -> fArreglo($Tb)){
					/*GUARDO LOS DATOS DEL MODULO ANTES DE LA MODIFICACION (CAMPOANTES = CAMPO ANTES DE LA MODIFICACIÓN)*/
					$Datos[0]['CampoAntes'] = $Arreglo['nombre'];
					$Datos[1]['CampoAntes'] = $Arreglo['descripcion'];
					$Resultado = '1';
				}

				/*SI LOS DATOS SE EXTRAYERON CORRECTAMENTE, ENTONCES EFECTUO LA MODIFICACIÓN*/
				if($Resultado == '1')
				{
					$Sql="UPDATE tdepartamento 
						SET 
							nombre='$this->nombre',
							descripcion='$this->descripcion'
						WHERE 
							iddepartamento='$this->iddepartamento'";
					
					$Resultado = $this -> fEjecutar($Sql);
					if($Resultado == false) { $Resultado = '0'; }
					
					/*SI LA MODIFICACIÓN FUE EXITOSA, LA REGISTRO EN EL HISTORIAL DE MODIFICACIONES*/
					if($Resultado)
					{
						$Sql="INSERT INTO thistorialm 
							(idregistro,
							tabla,
							fecha,
							hora,
							idusuario) 
						VALUES 
							('$this->iddepartamento',
							'tdepartamento',
							'".date('Y-m-d')."',
							'".date('h:i a')."',
							'$this->idusuario')";
						$Resultado = $this -> fEjecutar($Sql);
						if($Resultado) /*SI EL REGISTRO EN EL HISTORIAL FUE EXITOSO, EXTRAIGO EL MAXIMO ID DE LA TABLA THISTORIALM*/
						{
							$Sql="SELECT MAX(idhistorialm) AS idhistorialm FROM thistorialm";
							$Tb = $this -> fFiltro($Sql);
							if($Arreglo = $this -> fArreglo($Tb)){
								$IdHistorialM = $Arreglo['idhistorialm'];
							}
						} 
						else /*SI NO, DESHAGO LA MODIFICACION DEL REGISTRO DEL MODULO*/
						{ 
							$Resultado = '0';
							$Sql="UPDATE tdepartamento 
								SET 
									nombre='".$Datos[0]['CampoAntes']."',
									descripcion='".$Datos[1]['CampoAntes']."'
								WHERE 
									iddepartamento='$this->iddepartamento'";
							$this -> fEjecutar($Sql);
						}

						if($Resultado)/*SI SE HA REGISTRADO LA MODIFICACION EN EL HISTORIAL, REGISTRO EL DETALLE*/
						{
							/*GUARDO LOS DATOS DEL MODULO DESPUES DE LA MODIFICACIÓN*/
							$Datos[0]['CampoDespues'] = $this->nombre;
							$Datos[1]['CampoDespues'] = $this->descripcion;

							/*REGISTRO EL DETALLE DE LA MODIFICACIÓN*/
							for($i = 0;$i <= 1;$i++)
							{
								/*SI HAY UNA DIFERENCIA ENTRE EL DATO (ANTES Y DESPUES DE LA MODIFICACIÓN), LO REGISTRO EN EL DETALLE (SE COMPARA DATO POR DATO)*/
								if($Datos[$i]['CampoAntes']!=$Datos[$i]['CampoDespues'])
								{
									$Sql="INSERT INTO tdetallehistorialm 
										(idhistorialm,
										campomod,
										campoantes,
										campodespues) 
									VALUES 
										('$IdHistorialM',
										'".$Datos[$i]['CampoMod']."',
										'".$Datos[$i]['CampoAntes']."',
										'".$Datos[$i]['CampoDespues']."')
									";
									$this -> fEjecutar($Sql);
								}
							}
							$Resultado = '1';
						}
					}
				}
			}

			$this -> fDesconectar();
			return $Resultado;
		}

		public function fActivar()
		{
			$Sql="UPDATE tdepartamento SET estatus='1' WHERE iddepartamento='$this->iddepartamento'";
			$this -> fConectar();
			$Resultado = $this -> fEjecutar($Sql);
			if($Resultado){
				$Resultado = '1';
			}
			$this -> fDesconectar();
			return $Resultado;
		}

		public function fDesactivar()
		{
			$Sql="UPDATE tdepartamento SET estatus='0' WHERE iddepartamento='$this->iddepartamento'";
			$this -> fConectar();
			$Resultado = $this -> fEjecutar($Sql);
			if($Resultado){
				$Resultado = '1';
			}
			$this -> fDesconectar();
			return $Resultado;
		}
	}
?>