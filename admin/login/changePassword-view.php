<?php
	session_start();
	require('../Connection.php');
	$Connection = new Connection();
	$config = $Connection->getConfigValue('minLongPass, maxLongPass, minUpperPass, minLowerPass, minSpecialCharsPass, charsAllowedPass, minNumPass');

?>
<html>
	<head>
		<link href="../../Public/plugins/bootstrap-4.0.0/bootstrap-4.0.0.min.css" rel="stylesheet" id="bootstrap-css">
		<link href="../../Public/css/style.css" rel="stylesheet">
		<link rel="stylesheet" type="text/css" href="../../Public/lib/css/font-awesome.min.css">
		<!------ Include the above in your HEAD tag ---------->
		<style>
			.error-i {
				color:red;
			}
			.success-i {
				color:green;
			}
			.error-msj {
				color: red; 
				font-weight: bold; 
			}
		</style>
	</head>
	<body style="background:#FAFAFA">
		<div class="col-md-6 offset-md-3">
			<br>
			<div class="card border-secondary">
				<div class="card-header">
					<h3 class="mb-0">Cambio de Contraseña</h3>
				</div>
				<div class="card-body">
					<form id="form" class="form" role="form" autocomplete="off">
						<div class="form-group">
							<label for="oldPassword">Actual Contraseña</label>
							<div class="input-group mb-3">
								<input type="password" class="form-control form-control-sm" name="oldPassword" id="oldPassword" value="" tabindex="1">
								<div class="input-group-append">
									<button type="button" class="btn btn-outline-dark-check watchPass-btn" id="oldPass-btn"><i class="fa fa-eye"></i></button>
								</div>
							</div>
						</div>
						<div class="form-group">
							<label for="newPassword">Nueva Contraseña</label>
							<div class="input-group mb-3">
								<input type="password" class="form-control form-control-sm" name="newPassword" id="newPassword" tabindex="2">
								<div class="input-group-append">
									<button type="button" class="btn btn-outline-dark-check watchPass-btn" id="newPass-btn"><i class="fa fa-eye"></i></button>
								</div>
							</div>
							<span class="form-text small text-muted">
								La contraseña debe tener <b style="font-size:14px"><?= $config['minLongPass'] .'-'.$config['maxLongPass'] ?></b> caracteres 
								<i id="minMaxLong-i" class="fa fa-remove error-i"></i>
							</span>
							<?php if ($config['minNumPass'] > 0): ?>
								<span class="form-text small text-muted">
									Debe contener mínimo <b style="font-size:14px"><?= $config['minNumPass'] ?></b> caracteres numéricos 
									<i id="minNum-i" class="fa fa-remove error-i"></i>
								</span>
							<?php endif ?>
							<?php if ($config['minLowerPass'] > 0): ?>
								<span class="form-text small text-muted">
									Debe contener mínimo <b style="font-size:14px"><?= $config['minLowerPass'] ?></b> minúsculas 
									<i id="minLower-i" class="fa fa-remove error-i"></i>
								</span>
							<?php endif ?>
							<?php if ($config['minUpperPass'] > 0): ?>
								<span class="form-text small text-muted">
									Debe contener mínimo <b style="font-size:14px"><?= $config['minUpperPass'] ?></b> mayúsculas 
									<i id="minUpper-i" class="fa fa-remove error-i"></i>
								</span>
							<?php endif ?>
							<?php if ($config['minSpecialCharsPass'] > 0): ?>
								<span class="form-text small text-muted">
									Debe contener mínimo <b style="font-size:14px"><?= $config['minSpecialCharsPass'] ?></b> caracteres especiales 
									(caracteres permitidos: <b style="font-size:16px"><?= $config['charsAllowedPass'] ?></b>)
									<i id="minSpecialChars-i" class="fa fa-remove error-i"></i>
								</span>
							<?php endif ?>
						</div>
						<div class="form-group">
							<label for="checkPassword">Verificar Contraseña</label>
							<div class="input-group mb-3">
								<input type="password" class="form-control form-control-sm" name="checkPassword" id="checkPassword" tabindex="3">
								<div class="input-group-append">
									<button type="button" class="btn btn-outline-dark-check watchPass-btn" id="checkPass-btn">
										<i class="fa fa-eye"></i>
									</button>
								</div>
							</div>
							<span id="errorMsj-span" class="error-msj d-none"> Las contraseñas no coinciden </span>
							<span class="form-text small text-muted"> Ingrese nuevamente la contraseña para confirmar </span>
						</div>
						<div class="form-group float-right">
							<button type="button" id="cancel-btn" class="btn btn-danger btn-md" tabindex="4">
								Cancelar
							</button>
							<button type="button" id="submit-btn" class="btn btn-success btn-md" tabindex="5">
								Guardar
							</button>
						</div>
					</form>
				</div>
			</div>
			<!-- /form card change password -->

		</div>
	</body>
	<script src="../../Public/lib/js/jquery.min.js"></script>
	<script src="../../Public/plugins/bootstrap-4.0.0/bootstrap-4.0.0.min.js"></script>
	<link href="../../Public/plugins/sweetalert/sweetalert.css" rel="stylesheet">
	<script src="../../Public/plugins/sweetalert/sweetalert.js"></script>
	<script>
		let minNum          = <?= $config['minNumPass'] ?>;
		let minLong         = <?= $config['minLongPass'] ?>;
		let maxLong         = <?= $config['maxLongPass'] ?>;
		let minLower        = <?= $config['minLowerPass'] ?>;
		let minUpper        = <?= $config['minUpperPass'] ?>;
		let minSpecialChars = <?= $config['minSpecialCharsPass'] ?>;
		let charsAllowed    = "<?= $config['charsAllowedPass'] ?>";

		let nums = '0123456789';
		let stringLower = 'abcdefghijklmnñopqrstuvwxyz';
		let stringUpper = 'ABCDEFGHIJKLMNÑOPQRSTUVWXYZ';

		$('#submit-btn').click(function() {
			if ($('#oldPassword').val() != '' && checkPasswordRules($('#newPassword').val()) == contValid && checkFieldPass() == 1) {
				request('changePassword');
			}
		});

		$('#cancel-btn').click(function() {
			window.history.back();
		});

		$('#newPassword').keyup(function() {
			checkPasswordRules(this.value);
		});

		function checkFieldPass() {
			if ($('#newPassword').val() != $('#checkPassword').val()) {
				$('#errorMsj-span').removeClass('d-none');
				return 0;
			}
			else {
				$('#errorMsj-span').addClass('d-none');
				return 1;
			}
		}

		$('.watchPass-btn').click(function() {
			if ($('#'+this.id+' i').hasClass('fa-eye')) {
				$('#'+this.id).removeClass('btn-outline-dark-check').addClass('btn-outline-secondary-check');
				$('#'+this.id+' i').removeClass('fa-eye').addClass('fa-eye-slash');
				$(this).closest('.form-group').find('.form-control').attr('type', 'text');
			}
			else {
				$('#'+this.id).removeClass('btn-outline-secondary-check').addClass('btn-outline-dark-check');
				$('#'+this.id+' i').removeClass('fa-eye-slash').addClass('fa-eye');
				$(this).closest('.form-group').find('.form-control').attr('type', 'password');
			}
		});

		function checkExpression(value, expression) {
			let cont = 0
			for (i = 0; i < value.length; i ++) {
				if (expression.indexOf(value.charAt(i), 0) != -1) {
					cont ++;
				}
			}
			return cont;
		}

		function checkPasswordRules(value) {
			let cont = 0;
			if (value.length >= minLong && value.length <= maxLong) {
				$('#minMaxLong-i').removeClass().addClass('fa fa-check success-i');
				cont ++;
			}
			else $('#minMaxLong-i').removeClass().addClass('fa fa-remove error-i');

			if (minLower > 0) {
				if (checkExpression(value, stringLower) >= minLower) {
					$('#minLower-i').removeClass().addClass('fa fa-check success-i');
					cont ++;
				}
				else $('#minLower-i').removeClass().addClass('fa fa-remove error-i');
			}

			if (minUpper > 0) {
				if (checkExpression(value, stringUpper) >= minUpper) {
					$('#minUpper-i').removeClass().addClass('fa fa-check success-i');
					cont ++;
				}
				else $('#minUpper-i').removeClass().addClass('fa fa-remove error-i');
			}

			if (minSpecialChars > 0) {
				if (checkExpression(value, charsAllowed) >= minSpecialChars) {
					$('#minSpecialChars-i').removeClass().addClass('fa fa-check success-i');
					cont ++;
				}
				else $('#minSpecialChars-i').removeClass().addClass('fa fa-remove error-i');
			}

			if (minNum > 0) {
				if (checkExpression(value, nums) >= minNum) {
					$('#minNum-i').removeClass().addClass('fa fa-check success-i');
					cont ++;
				}
				else $('#minNum-i').removeClass().addClass('fa fa-remove error-i');
			}
			return cont;
		}

		let contValid = 1;
		if (minLower > 0)           contValid ++;
		if (minUpper > 0)           contValid ++;
		if (minSpecialChars > 0)    contValid ++;
		if (minNum > 0)             contValid ++;

		function request(action) {
			var str = $('#form').serialize();
			$.ajax({
				cache: false, type: 'POST', dataType: 'json', url:'login-cont.php',
				data: str + '&action=' + action,
				success: function(r) {
					if (r.result == 'invalid_data') {
						swal('ERROR', 'Datos inválidos', 'error');
					}
					else if (r.result == 'repeated_password') {
						swal('ERROR', r.message, 'error');
					}
					else if (r.result == 'incorrect_password') {
						swal('ERROR', 'Su clave actual es incorrecta', 'error');
					}
					else if (r.result == 'success') {
						swal({ title: 'Cambio de Clave Exitoso', text: 'Ahora debe iniciar sesión con su nueva clave', timer: 5000, showConfirmButton: false },
						function() { $(location).attr('href',r.src); });
					}
					else if (r.result == 'failed') {
						swal('ERROR', 'No se ha podido cambiar la clave', 'error');
					}
				},
				error:function(e) {
					swal('!ERROR!', 'HA OCURRIDO UN ERROR CON EL SERVIDOR, VUELVA A INTENTAR' , 'error');
					console.log(e)
				}
			});
		}
	</script>
</html>