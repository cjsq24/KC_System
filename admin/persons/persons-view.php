<?php
	/*OPCIONES QUE CONTENDRÁ EL SELECT CON LOS PARÁMETROS DE BÚSQUEDA DE LA MODAL*/
	$paramSelect = ['idDocument'=>'# Documento', 'name'=>'Nombres', 'surname'=>'Apellidos', 'email'=>'Email', 'cellPhoneNumber'=>'Celular'];
?>
<div class='col-md-12'>
    <?= $Temp->sectionTop($menu) ?>
	<?= $Temp->sectionSearch('start') ?>
		<?= $Temp->searchModal('start', $paramSelect) ?>
            <div class="form-row">
                <div class="form-group col-4">
					<?= $Form->label('idCountryS', 'País') ?>
					<?= $Form->select(['name-id'=>'idCountryS', 'class'=>'select2 idCountry'], [], 'search'); ?>
				</div>
                <div class="form-group col-4">
					<?= $Form->label('idStateS', 'Estado') ?>
					<?= $Form->select(['name-id'=>'idStateS', 'class'=>'select2 idState'], [], 'search'); ?>
				</div>
                <div class="form-group col-4">
					<?= $Form->label('idCityS', 'Ciudad') ?>
					<?= $Form->select(['name-id'=>'idCityS', 'class'=>'select2 idCity'], [], 'search'); ?>
				</div>
			</div>
		<?= $Temp->searchModal('end') ?>
	<?= $Temp->sectionSearch('end') ?>

    <?= $Temp->sectionForm('start') ?>
        <?php require($menu['link'].'/'.$menu['link'].'-form.php') ?>
	<?= $Temp->sectionForm('end') ?>
</div>