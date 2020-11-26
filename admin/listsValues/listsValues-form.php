<?php    
	/*CLASES DE LOS LABEL Y CAMPOS DEL FORMULARIO*/
	$classLab = "col-md-2 offset-md-1 mb-3";
	$sizeDiv = "col-md-5 col-sm-8"; 
	$classLabel = "col-md-2 offset-md-1 col-sm-3 offset-sm-1 col-form-label";
?>

<?= $Temp->formStart($menu['link'], 'idListValue') ?>
    <div class="form-group row">
        <?= $Form->label("idList", "Lista", $classLabel) ?>
        <div class="<?= $sizeDiv ?>">
            <?= $Form->select(['name-id'=>'idList', 'attr'=>'tabindex="1" validate="required"', 'class'=>'select2 idList', 'popover-msj'=>'Lista a la que pertenece'], ''); ?>
        </div>
    </div>
    <div class="form-group row">
        <?= $Form->label("idParent", "Lista Valor Padre", $classLabel) ?>
        <div class="<?= $sizeDiv ?>">
            <?= $Form->select(['name-id'=>'idParent', 'attr'=>'tabindex="4"', 'class'=>'select2 idParent', 'popover-msj'=>'Lista valor al que pertenece'], ''); ?>
        </div>
    </div>
    <div class="form-group row">
        <?= $Form->label('name', 'Nombre', $classLabel) ?>
        <div class="<?= $sizeDiv ?>">
            <?= $Form->text(['name-id'=>'name', 'attr'=>'tabindex="2" validate="required|lae:1,50"', 'popover-msj'=>'Ingrese el nombre, sin caracteres especiales']); ?>
        </div>
    </div>
    <div class="form-group row">
        <?= $Form->label('abbreviation', 'Abreviación', $classLabel) ?>
        <div class="<?= $sizeDiv ?>">
            <?= $Form->text(['name-id'=>'abbreviation', 'attr'=>'tabindex="3" validate="lae:1,50"', 'popover-msj'=>'Ingrese el nombre, sin caracteres especiales']); ?>
        </div>
    </div>
    <div class="form-group row">
        <?= $Form->label('position', 'Posición', $classLabel) ?>
        <div class="<?= $sizeDiv ?>">
            <?= $Form->text(['name-id'=>'position', 'attr'=>'tabindex="5" validate="int:1,2"', 'popover-msj'=>'Posición (opcional)']); ?>
        </div>
    </div>
    <div class="form-group row">
        <?= $Form->label('description', 'Descripción', $classLabel) ?>
        <div class="<?= $sizeDiv ?>">
            <?= $Form->textarea(['name-id'=>'description', 'attr'=>"maxlength='200' tabindex='6'", 'popover-msj'=>'Ingrese el nombre, sin caracteres especiales']); ?>
        </div>
    </div>
<?= $Temp->formEnd($modal) ?>

<!--ARCHIVO QUE CONTIENE LAS FUNCIONES BASE DEL FORMULARIO, INCLUYENDO LA DE LOS BOTONES-->
<?php require(RUTA_SETTINGS.'/php/footFile.php'); ?>