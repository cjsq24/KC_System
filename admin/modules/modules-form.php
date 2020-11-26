<?php    
	/*CLASES DE LOS LABEL Y CAMPOS DEL FORMULARIO*/
	$classLab = "col-md-2 offset-md-1 mb-3";
	$sizeDiv = "col-md-5 col-sm-8"; 
    $classLabel = "col-md-2 offset-md-1 col-sm-3 offset-sm-1 col-form-label";
?>
<?= $Temp->formStart($menu['link'], 'idModule') ?>
    <div class="form-group row">
        <?= $Form->label("name", "Nombre", $classLabel) ?>
        <div class="<?= $sizeDiv ?>">
            <?= $Form->text(['name-id'=>'name', 'attr'=>'tabindex="1" checkIfExist validate="required|lae:1,50"', 'popover-msj'=>'Ingrese el nombre del menú, sin números ni caracteres especiales']); ?>
        </div>
    </div>
    <div class="form-group row">
        <?= $Form->label("idParent", "Módulo Padre", $classLabel) ?>
        <div class="<?= $sizeDiv ?>">
            <?= $Form->select(['name-id'=>'idParent', 'class'=>'select2 idParent', 'popover-msj'=>'Módulo al que pertenece'], ''); ?>
        </div>
    </div>
    <div class="form-group row">
        <?= $Form->label("icon", "Icono", $classLabel) ?>
        <div class="<?= $sizeDiv ?>">
            <div class="input-group mb-3">
                <span class="form-control form-control-sm" id="icon-span"><i id="icon-i"></i></span>
                <?= $Form->addBtnSearch() ?>
            </div>
            <input type="hidden" class="input-form" name="idIcon" id="idIcon">
        </div>
        <!-- Modal Iconos -->
        <?= $General->iconsModal($menu) ?>
    </div>
    <div class="form-group row">
        <?= $Form->label("description", "Descripción", $classLabel) ?>
        <div class="<?= $sizeDiv ?>">
            <?= $Form->textarea(["name-id"=>"description", "attr"=>"maxlength='200' tabindex='2'", "popover-msj"=>"Ingrese el nombre, sin caracteres especiales"]); ?>
        </div>
    </div>
<?= $Temp->formEnd($modal) ?>
<?php require(RUTA_SETTINGS.'/php/footFile.php'); ?>