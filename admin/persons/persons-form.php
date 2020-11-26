<?php    
	/*CLASES DE LOS LABEL Y CAMPOS DEL FORMULARIO*/
	$classLab = "col-md-2 offset-md-1 mb-3";
	$sizeDiv = "col-md-5 col-sm-8"; 
	$classLabel = "col-md-2 offset-md-1 col-sm-3 offset-sm-1 col-form-label";
?>

<?= $Temp->formStart($menu['link'], 'idPerson') ?>
    <div class="form-row">
        <div class="form-group col-lg-3 col-md-4 col-sm-6 col-xs-6">
            <?= $Form->label('idTypeDocument', 'Tipo de Documento') ?>
            <?= $Form->select(['name-id'=>'idTypeDocument', 'attr'=>'tabindex="1" validate="required"'], []); ?>
        </div>
        <div class="form-group col-lg-3 col-md-4 col-sm-6 col-xs-6">
            <?= $Form->label('idDocument', 'N° Documento') ?>
            <?= $Form->text(['name-id'=>'idDocument', 'attr'=>'tabindex="2" checkIfExist validate="required"', 'popover-msj'=>'Ingrese el código del documento']); ?>
        </div>
    </div>
    <div class="form-row">
        <div class="form-group col-lg-3 col-md-6 col-sm-6">
            <?= $Form->label('name', 'Primer Nombre') ?>
            <?= $Form->text(['name-id'=>'name', 'attr'=>'tabindex="3" validate="required|lae:1,40"'], []); ?>
        </div>
        <div class="form-group col-lg-3 col-md-6 col-sm-6">
            <?= $Form->label('secondName', 'Segundo Nombre') ?>
            <?= $Form->text(['name-id'=>'secondName', 'attr'=>'tabindex="4" validate="lae:1,40"'], []); ?>
        </div>
        <div class="form-group col-lg-3 col-md-6 col-sm-6">
            <?= $Form->label('surname', 'Primer Apellido') ?>
            <?= $Form->text(['name-id'=>'surname', 'attr'=>'tabindex="5" validate="required|lae:1,40"'], []); ?>
        </div>
        <div class="form-group col-lg-3 col-md-6 col-sm-6">
            <?= $Form->label('secondSurname', 'Segundo Apellido') ?>
            <?= $Form->text(['name-id'=>'secondSurname', 'attr'=>'tabindex="6" validate="lae:1,40"'], []); ?>
        </div>
    </div>
    <div class="form-row">
        <div class="form-group col-lg-3 col-md-6 col-sm-6">
            <?= $Form->label('email', 'Email') ?>
            <?= $Form->text(['name-id'=>'email', 'attr'=>'tabindex="11" checkIfExist validate="required"'], []); ?>
        </div>
        <div class="form-group col-lg-3 col-md-6 col-sm-6">
            <?= $Form->label('cellPhoneNumber', 'Número de Celular') ?>
            <?= $Form->text(['name-id'=>'cellPhoneNumber', 'attr'=>'tabindex="12" validate="required"'], []); ?>
        </div>
        <div class="form-group col-lg-3 col-md-6 col-sm-6">
            <?= $Form->label('postalCode', 'Código Postal') ?>
            <?= $Form->text(['name-id'=>'postalCode', 'attr'=>'tabindex="13"'], []); ?>
        </div>
        <div class="form-group col-lg-3 col-md-6 col-sm-6">
            <?= $Form->label('dateBirth', 'Fecha de Nacimiento') ?>
            <?= $Form->text(['name-id'=>'dateBirth', 'class'=>'datepicker', 'attr'=>'tabindex="14"'], []); ?>
        </div>
    </div>
    <div class="form-row">
        <div class="form-group col-lg-4 col-md-4 col-sm-4">
            <?= $Form->label('idCountry', 'País') ?>
            <?= $Form->select(['name-id'=>'idCountry', 'class'=>'select2 idCountry', 'attr'=>'tabindex="7" validate="required"'], []); ?>
        </div>
        <div class="form-group col-lg-4 col-md-4 col-sm-4">
            <?= $Form->label('idState', 'Estado') ?>
            <?= $Form->select(['name-id'=>'idState', 'class'=>'select2 idState', 'attr'=>'tabindex="8" validate="required"'], []); ?>
        </div>
        <div class="form-group col-lg-4 col-md-4 col-sm-4">
            <?= $Form->label('idCity', 'Ciudad') ?>
            <?= $Form->select(['name-id'=>'idCity', 'class'=>'select2', 'attr'=>'tabindex="9" validate="required"'], []); ?>
        </div>
    </div>
    <div class="form-row">
        <div class="form-group col-md-12">
            <?= $Form->label('address', 'Dirección') ?>
            <?= $Form->textarea(['name-id'=>'address', 'attr'=>'tabindex="10" validate="required|lae:1,200"'], []); ?>
        </div>
    </div>
<?= $Temp->formEnd($modal) ?>

<!--ARCHIVO QUE CONTIENE LAS FUNCIONES BASE DEL FORMULARIO, INCLUYENDO LA DE LOS BOTONES-->
<?php require(RUTA_SETTINGS.'/php/footFile.php'); ?>