<?php    
	/*CLASES DE LOS LABEL Y CAMPOS DEL FORMULARIO*/
	$classLab = "col-md-2 offset-md-1 mb-3";
	$sizeDiv = "col-md-5 col-sm-8"; 
    $classLabel = "col-md-2 offset-md-1 col-sm-3 offset-sm-1 col-form-label";
    $actions = $General->getArrAll("SELECT * FROM actions ORDER BY position"); //Operaciones
?>
<?= $Temp->formStart($menu['link'], 'idMenu') ?>
    <div class="form-group row">
        <?= $Form->label("name", "Nombre", $classLabel) ?>
        <div class="<?= $sizeDiv ?>">
            <?= $Form->text(['name-id'=>'name', 'attr'=>'tabindex="1" checkIfExist validate="required|lae:1,50"', 'popover-msj'=>'Ingrese el nombre del menú, sin números ni caracteres especiales']); ?>
        </div>
    </div>
    <div class="form-group row">
        <?= $Form->label("idModule", "Módulo", $classLabel) ?>
        <div class="<?= $sizeDiv ?>">
            <div class="input-group mb-3">
                <?= $Form->select(['name-id'=>'idModule', 'class'=>'select2 idModule', 'popover-msj'=>'Módulo al que pertenece'], []); ?>
                <?= $Form->addBtnSelect('modules', 'idModule', 'modal-xl') ?>
            </div>
        </div>
    </div>
    <div class="form-group row">
        <?= $Form->label("link", "Enlace", $classLabel) ?>
        <div class="<?= $sizeDiv ?>">
            <?= $Form->text(['name-id'=>'link', 'attr'=>'tabindex="2" checkIfExist validate="required|lae:1,50"', 'popover-msj'=>'Ingrese el nombre de la carpeta que contiene el maestro correspondiente. No se permiten: números, caracteres especiales ni espacios']); ?>
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
    <div class="form-group row col-5 offset-3">
        <table class="table table-bordered table-condensed table-sm">
            <thead class="thead-light" style="cursor:default">
                <tr> <th>Operaciones:</th> </tr>
            </thead>
            <tbody style="font-size:13px; text-align:center">
                <?php foreach ($actions as $key => $action) { ?>
                    <tr>
                        <td class="actions-td" id="action-<?= $action['idAction'] ?>-td" style="padding:1px">
                            <button type="button" class="btn btn-sm btn-outline-dark-check" onclick="selectAction(<?= $action['idAction'] ?>)" style="width:100%">
                                <i class="<?= $action['icon'] ?>"></i>
                                <?= $action['name'] ?>
                            </button>
                            <input type="checkbox" name="actions[]" value="<?= $action['idAction'] ?>" class="input-form d-none">
                        </td>
                    </tr>
                <?php } ?>
            </tbody>
        </table>
    </div>
    <div class="form-group row">
        <?= $Form->label("description", "Descripción", $classLabel) ?>
        <div class="<?= $sizeDiv ?>">
            <?= $Form->textarea(["name-id"=>"description", "attr"=>"maxlength='200' tabindex='2'", "popover-msj"=>"Ingrese el nombre, sin caracteres especiales"]); ?>
        </div>
    </div>
    <span class="error-msj d-none" id="error-span">Seleccione alguna operación</span>
<?= $Temp->formEnd() ?>
<!--ARCHIVO QUE CONTIENE LAS FUNCIONES BASE DEL FORMULARIO, INCLUYENDO LA DE LOS BOTONES-->
<?php require(RUTA_SETTINGS.'/php/footFile.php'); ?>
<?php //require($menu['link'].'/'.$menu['link'].'-js.php'); ?>
<?php //require(RUTA_SETTINGS.'/php/FormConfig-js.php'); ?>
<?php //require(RUTA_SETTINGS.'/php/accessModal.php'); ?>