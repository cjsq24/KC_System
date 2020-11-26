<?php    
	/*CLASES DE LOS LABEL Y CAMPOS DEL FORMULARIO*/
	$classLab = "col-md-2 offset-md-1 mb-3";
	$sizeDiv = "col-md-5 col-sm-8"; 
	$classLabel = "col-md-2 offset-md-1 col-sm-3 offset-sm-1 col-form-label";
?>

<?= $Temp->formStart($menu['link'], 'idUser') ?>
    <div class="form-group row">
        <?= $Form->label('idPerson', 'Persona', $classLabel) ?>
        <div class="<?= $sizeDiv ?>">
            <div class="input-group mb-3">
                <?= $Form->select(['name-id'=>'idPerson', 'attr'=>'validate="required"', 'class'=>'select2', 'popover-msj'=>'Seleccione la persona que registrará como usuario']); ?>
                <?= $Form->addBtnSelect('persons', 'idPerson', 'modal-xl') ?>
            </div>
        </div>
    </div>
    <div class="form-group row">
        <?= $Form->label('name', 'Usuario', $classLabel) ?>
        <div class="<?= $sizeDiv ?>">
            <?= $Form->text(['name-id'=>'name', 'attr'=>'tabindex="2" checkIfExist validate="required|lae:1,50"', 'popover-msj'=>'Ingrese el nombre, sin caracteres especiales']); ?>
        </div>
    </div>
    <div class="form-group row">
        <?= $Form->label('email', 'Email', $classLabel) ?>
        <div class="<?= $sizeDiv ?>">
            <?= $Form->text(['name-id'=>'email', 'attr'=>'tabindex="3" checkIfExist validate="required"', 'popover-msj'=>'Ingrese el nombre, sin caracteres especiales']); ?>
        </div>
    </div>
    <div class="form-group row">
        <?= $Form->label('idProfile', 'Perfil', $classLabel) ?>
        <div class="<?= $sizeDiv ?>">
            <div class="input-group mb-3">
                <?= $Form->select(['name-id'=>'idProfile', 'attr'=>'validate="required"', 'class'=>'select2', 'popover-msj'=>'Seleccione el perfil que tendrá el usuario en el sistema']); ?>
                <?= $Form->addBtnSelect('profiles', 'idProfile', 'modal-xl') ?>
            </div>
        </div>
    </div>
<?= $Temp->formEnd($modal) ?>

<!--ARCHIVO QUE CONTIENE LAS FUNCIONES BASE DEL FORMULARIO, INCLUYENDO LA DE LOS BOTONES-->
<?php require(RUTA_SETTINGS.'/php/footFile.php'); ?>