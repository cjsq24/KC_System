<?php
	/*OPCIONES QUE CONTENDRÁ EL SELECT CON LOS PARÁMETROS DE BÚSQUEDA DE LA MODAL*/
    $paramSelect = ['name'=>'NOMBRE'];
    //$parentMod = $General->getOptions("SELECT idModule AS a, name AS b FROM modules WHERE idParent IS NULL ORDER BY name", 'NINGUNO'); //Módulos que no tengan padres.
?>
<div class="col-md-12">
    <?= $Temp->sectionTop($menu) ?>
	<?= $Temp->sectionSearch("start") ?>
		<?= $Temp->searchModal("start", $paramSelect) ?>
            <!--CAMPOS EXTRAS PARA LA MODAL-->
			<div class="form-row">
                <div class="form-group col-4 offset-8">
					<?= $Form->label('idParentS', 'Módulo Padre') ?>
					<?= $Form->select(['name-id'=>'idParentS', 'class'=>'select2 idParent', 'popover-msj'=>'Módulo Padre'], [], 'search'); ?>
				</div>
			</div>
		<?= $Temp->searchModal("end") ?>
	<?= $Temp->sectionSearch("end") ?>

	<?= $Temp->sectionForm('start') ?>
        <?php require($menu['link'].'/'.$menu['link'].'-form.php') ?>
	<?= $Temp->sectionForm('end') ?>
</div>