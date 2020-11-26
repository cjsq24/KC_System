<?php
	/*OPCIONES QUE CONTENDRÁ EL SELECT CON LOS PARÁMETROS DE BÚSQUEDA DE LA MODAL*/
    $paramSelect = ['name'=>'NOMBRE', 'link'=>'ENLACE'];
?>
<div class="col-md-12">
    <?= $Temp->sectionTop($menu) ?>
	<?= $Temp->sectionSearch("start") ?>
		<?= $Temp->searchModal("start", $paramSelect) ?>
            <!--CAMPOS EXTRAS PARA LA MODAL-->
			<div class="form-row">
                <div class="form-group col-4 offset-8">
					<?= $Form->label('idModuleS', 'Módulo') ?>
					<?= $Form->select(['name-id'=>'idModuleS', 'class'=>'select2 idModule', 'popover-msj'=>'Módulo'], [], 'search'); ?>
				</div>
			</div>
		<?= $Temp->searchModal("end") ?>
    <?= $Temp->sectionSearch("end") ?>

    <?= $Temp->sectionForm('start') ?>
        <?php require($menu['link'].'/'.$menu['link'].'-form.php') ?>
	<?= $Temp->sectionForm('end') ?>
</div>