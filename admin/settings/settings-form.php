<?php    
	/*CLASES DE LOS LABEL Y CAMPOS DEL FORMULARIO*/
	$classLab = "col-md-2 offset-md-1 mb-3";
	$sizeDiv = "col-md-5 col-sm-8"; 
	$classLabel = "col-md-2 offset-md-1 col-sm-3 offset-sm-1 col-form-label";
?>

<?= $Temp->formStart($menu['link'], 'idDepartamento') ?>
    <div class="form-group row">
        <?= $Form->label('name', 'Nombre', $classLabel) ?>
        <div class="<?= $sizeDiv ?>">
            <?= $Form->text(['name-id'=>'name', 'attr'=>'tabindex="1" checkIfExist validate="required|lae:1,50"', 'popover-msj'=>'Ingrese el nombre, sin caracteres especiales']); ?>
        </div>
    </div>
    <div class="form-group row">
        <?= $Form->label('description', 'Descripción', $classLabel) ?>
        <div class="<?= $sizeDiv ?>">
            <?= $Form->textarea(['name-id'=>'description', 'attr'=>"maxlength='200' tabindex='2'", 'popover-msj'=>'Ingrese el nombre, sin caracteres especiales']); ?>
        </div>
    </div>
<?= $Temp->formEnd($modal) ?>

<!--ARCHIVO QUE CONTIENE LAS FUNCIONES BASE DEL FORMULARIO, INCLUYENDO LA DE LOS BOTONES-->
<?php require(RUTA_SETTINGS.'/php/footFile.php'); ?>