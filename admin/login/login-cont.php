<?php
    require('../../config-ini.php');
    session_start();

    $message = '';
    $src = '';
    
    $numero2  = count($_POST);
	$tags2    = array_keys($_POST);
	$valores2 = array_values($_POST);
	for ($i = 0; $i < $numero2; $i++) { 
		${$tags2[$i]} = $valores2[$i];
    }

    require("login-class.php");
    $Login = new Login();

    switch($action)
	{
        case 'login':
            $Login->email    = mb_strtoupper($email, 'UTF-8');
            $Login->password = $password;
            $data = $Login->validUser();
            if($data['result'] === 'exists' || $data['result'] === 'existsWarning') {
                $Login->loginUser();
				$_SESSION['idUser']      = $data['idUser'];
				$_SESSION['email']       = $email;
				$_SESSION['idProfile']   = $data['idProfile'];
                $_SESSION['nameProfile'] = $data['nameProfile'];
                
                if ($data['result'] === 'exists') {
                    $message = 'Iniciando sesión...';
                } else {
                    $message = $data['message'];
                }
				$src = '../index.php?link=startPage';
			}
			else if ($data['result'] == 'locked') {
				$message = 'Este usuario esta bloqueado, póngase en contacto con el administrador';
			}
			else if ($data['result'] == 'lockedByAttempts') {
				$message = 'Este usuario ha sido bloqueado por intentos fallidos';
			}
			else if ($data['result'] == 'changePassword') {
				$_SESSION['idUser'] = $data['idUser'];
				$message = 'Redireccionando al cambio de clave';
				$src = 'changePassword-view.php';
			}
			else if ($data['result'] == 'passwordExpired') {
				$_SESSION["idUser"]=$data['idUser'];
				$message = 'Su clave ha caducado, debe cambiarla';
				$src = 'changePassword-view.php';
			}
			else if ($data['result'] == 'not_exists') {
				$Login->failedAttempt();
				$message = 'Su usuario y/o su contraseña son incorrectos';
            }
            $result = $data['result'];
        break;
        case 'changePassword':
            $Login->idUser = $_SESSION['idUser'];
            $result = 'incorrect_password';
            if (!$Login->checkOldPassword($oldPassword)) goto fin;
            $result = 'invalid_data';
            if (!$Login->checkNewPassword($newPassword)) goto fin;
            if ($Login->setNewPassword($newPassword)) {
                $result = 'success';
                $src = 'login-view.php';
            }
        break;
    }
    fin:
    echo json_encode(compact('result', 'message', 'src'));
?>