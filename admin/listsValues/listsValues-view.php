<?php
	/*OPCIONES QUE CONTENDRÁ EL SELECT CON LOS PARÁMETROS DE BÚSQUEDA DE LA MODAL*/
	$paramSelect = ['name'=>'Nombre', 'abbreviation'=>'Abreviación'];
?>
<div class='col-md-12'>
    <?= $Temp->sectionTop($menu) ?>
	<?= $Temp->sectionSearch('start') ?>
        <?= $Temp->searchModal('start', $paramSelect) ?>
            <div class="form-row">
                <div class="form-group col-4 offset-4">
					<?= $Form->label('idListS', 'Lista') ?>
					<?= $Form->select(['name-id'=>'idListS', 'class'=>'select2 idList', 'popover-msj'=>'Lista a la que pertenece'], [], 'search'); ?>
				</div>
                <div class="form-group col-4">
					<?= $Form->label('idParentS', 'Lista Valor Padre') ?>
					<?= $Form->select(['name-id'=>'idParentS', 'class'=>'select2 idParent', 'popover-msj'=>'Lista Valor Padre'], [], 'search'); ?>
				</div>
			</div>
		<?= $Temp->searchModal('end') ?>
	<?= $Temp->sectionSearch('end') ?>

    <?= $Temp->sectionForm('start') ?>
        <?php require($menu['link'].'/'.$menu['link'].'-form.php') ?>
	<?= $Temp->sectionForm('end') ?>
</div>