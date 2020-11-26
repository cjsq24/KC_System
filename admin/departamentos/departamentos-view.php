<?php
	/*OPCIONES QUE CONTENDRÁ EL SELECT CON LOS PARÁMETROS DE BÚSQUEDA DE LA MODAL*/
	$paramSelect = ['name'=>'Nombre'];
?>
<div class='col-md-12'>
    <?= $Temp->sectionTop($menu) ?>
	<?= $Temp->sectionSearch('start') ?>
		<?= $Temp->searchModal('start', $paramSelect) ?>
			<!--CAMPOS EXTRAS PARA LA MODAL-->
			<div class="form-row">
				<div class="form-group col">
					<?= $Form->label('namee', "Nombre1") ?>
					<?= $Form->text(["name-id"=>"Nombre1", "attr"=>"maxlength='50'", "popover-msj"=>"Ingrese el name, sin caracteres especiales"], "search"); ?>
				</div>
				<div class="form-group col">
					<?= $Form->label("namee", "Nombre2") ?>
					<?= $Form->text(["name-id"=>"Nombre2", "attr"=>"maxlength='50'", "popover-msj"=>"Ingrese el name, sin caracteres especiales"], "search"); ?>
				</div>
				<div class="form-group col">
					<?= $Form->label("namee", "Nombre3") ?>
					<?= $Form->text(["name-id"=>"Nombre3", "attr"=>"maxlength='50'", "popover-msj"=>"Ingrese el name, sin caracteres especiales"], "search"); ?>
				</div>
			</div>
		<?= $Temp->searchModal('end') ?>
	<?= $Temp->sectionSearch('end') ?>

    <?= $Temp->sectionForm('start') ?>
        <?php require($menu['link'].'/'.$menu['link'].'-form.php') ?>
	<?= $Temp->sectionForm('end') ?>
</div>