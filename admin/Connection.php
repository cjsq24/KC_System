<?php
	//Clase para conectarse a la base de datos y ejecutar consultas PDO	 
	class Connection
	{
        /*private $host = DB_HOST;
        private $usuario = DB_USUARIO;
        private $password = DB_PASSWORD;
        private $nombre_bd = DB_NOMBRE;*/
            
        private $dbh; // Database Handler
        private $stmt;  //Statement
        private $error;

        function __construct()
        {
            // Primero configuramos la conexion
            //$dsn = 'mysql:host='.$this->host.';dbname='.$this->nombre_bd;

            $opciones = array(
                PDO::ATTR_PERSISTENT => true,
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
            );

            try {
                $this->dbh = new PDO('mysql:host=localhost;dbname=personalSystem','root','',$opciones);
                //$this->dbh = new PDO ($dsn, $this->usuario, $this->password, $opciones);
                $this->dbh->exec('set names utf8');
            }
            catch (PDOException $e) {
                $this->error = $e->getMessage();
                echo $this->error;
            }
        }

        public function exec($sql) {
            return $this->dbh->exec($sql);
        }

        // Preparamos la consulta
        public function prepare($sql) {
            $this->stmt = $this->dbh->prepare($sql);
        }

        public function query($sql) {
            $this->stmt = $this->dbh->query($sql);
        }

        public function getArrayAll($sql) {
            return $this->dbh->query($sql)->fetchAll(PDO::FETCH_ASSOC);
        }

        public function getArray($sql) {
            return $this->dbh->query($sql)->fetch(PDO::FETCH_ASSOC);
        }

        public function getConfigValue($field) {

            $data = $this->dbh->query("SELECT $field FROM settings")->fetch(PDO::FETCH_ASSOC);
            if (strpos($field, ',') === false) {
                return $data[$field];
            }
            else return $data;
        }

        // Vinculamos la consulta con bind
        public function bind($parametro, $valor, $tipo=null) {
            if (is_null($tipo)) {
                switch (true) {
                    case is_int($valor):
                        $tipo = PDO::PARAM_INT;
                    break;

                    case is_bool($valor):
                        $tipo = PDO::PARAM_BOOL;
                    break;

                    case is_null($valor):
                        $tipo = PDO::PARAM_NULL;
                    break;
                    
                    default:
                            $tipo = PDO::PARAM_STR;
                    break;
                }
            }
            $this->stmt->bindValue($parametro, $valor , $tipo);
        }

        // Ejecutamos la consulta
        public function execute() {
            return $this->stmt->execute();
        }

        // Ultimo_ID_insertado
        public function lastId() {
            return $this->dbh->lastInsertId();
        }


 

			// Devuelve varios registros
			public function registros(){
				$this->execute();
				return $this->stmt->fetchAll(PDO::FETCH_OBJ);
			}	




			// Devuelve un solo Registro
			public function registro(){
				$this->execute();
				return $this->stmt->fetch(PDO::FETCH_OBJ);
			}

        // Devuelve total de registros 
        public function rowCount($sql) {
            return $this->dbh->query($sql)->rowCount();
        }

        public function beginTransaction() {
            $this->dbh->beginTransaction();
        }

        public function commit() {
            $this->dbh->commit();
        }

        public function rollBack() {
            $this->dbh->rollBack();
        }
 
	}
