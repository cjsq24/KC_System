<?php
	/*ARCHIVO PARA VERIFICAR EL ACCESO DE USUARIOS A MENÚS Y OPERACIONES*/
	require('../Modelos/Acceso.cls.php');
	$objAcceso = new Acceso();
	$objAcceso->fAccesoMenu( $_GET['Url'] , $_GET['VentPadre'] );

	/*CLASES DE LOS LABEL Y CAMPOS DEL FORMULARIO*/
	$classLab = "col-md-2 offset-md-1";
	$sizeDiv = "col-md-5"; 
	$classLabel = "col-md-2 offset-md-1 col-form-label";
	/*OPCIONES QUE CONTENDRÁ EL SELECT CON LOS PARÁMETROS DE BÚSQUEDA DE LA MODAL*/
	$paramSelect = ["nombre"=>"Nombre"];
?>
<div class="col-md-8 offset-md-2 table-body">
	<?= $formConfig->sectionSearch("start") ?>
		<?= $formConfig->searchModal("start", $paramSelect) ?>
			<!--CAMPOS EXTRAS PARA LA MODAL-->
			<div class="form-row">
				<div class="form-group col">
					<?= $form->label("nombree", "Nombree") ?>
					<?= $form->text(["name-id"=>"Nombree", "attr"=>"maxlength='50'", "popover-msj"=>"Ingrese el nombre, sin caracteres especiales"], "search"); ?>
				</div>
				<div class="form-group col">
					<?= $form->label("nombree", "Nombree") ?>
					<?= $form->text(["name-id"=>"Nombree", "attr"=>"maxlength='50'", "popover-msj"=>"Ingrese el nombre, sin caracteres especiales"], "search"); ?>
				</div>
				<div class="form-group col">
					<?= $form->label("nombree", "Nombree") ?>
					<?= $form->text(["name-id"=>"Nombree", "attr"=>"maxlength='50'", "popover-msj"=>"Ingrese el nombre, sin caracteres especiales"], "search"); ?>
				</div>
			</div>
		<?= $formConfig->searchModal("end") ?>
	<?= $formConfig->sectionSearch("end") ?>

	<?= $formConfig->sectionForm("start") ?>
		<div class="form-group row">
			<?= $form->label("nombre", "Nombre", $classLabel, "required") ?>
			<div class="<?= $sizeDiv ?>">
				<?= $form->text(["name-id"=>"nombre", "required"=>"true", "attr"=>"maxlength='50' tabindex='1'", "popover-msj"=>"Ingrese el nombre, sin caracteres especiales"]); ?>
			</div>
		</div>
		<div class="form-group row">
			<?= $form->label("descripcion", "Descripción", $classLabel) ?>
			<div class="<?= $sizeDiv ?>">
				<?= $form->textarea(["name-id"=>"descripcion", "required"=>"true", "attr"=>"maxlength='200' tabindex='2'", "popover-msj"=>"Ingrese el nombre, sin caracteres especiales"]); ?>
			</div>
		</div>
		<?= $formConfig->finalFormDiv($classLab, $sizeDiv) ?>
	<?= $formConfig->sectionForm("end") ?>
</div>

<!--ARCHIVO QUE CONTIENE LAS FUNCIONES BASE DEL FORMULARIO, INCLUYENDO LA DE LOS BOTONES-->
<script type="text/javascript" src="javascript.js"></script>
<script type="text/javascript" src="../Public/js/Configuraciones js/form-config-js.js"></script>
<!--ARCHIVO JS CON LAS FUNCIONES PROPIAS DEL FORMULARIO-->
<!--script type="text/javascript" src="../Public/js/formValidation.js"></script>
<script type="text/javascript" src="../Public/js/formValidationFramework.js"></script>
<script type="text/javascript" src="../Public/js/Validaciones.js"></script-->
