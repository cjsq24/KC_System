<?php
	/*OPCIONES QUE CONTENDRÁ EL SELECT CON LOS PARÁMETROS DE BÚSQUEDA DE LA MODAL*/
	$paramSelect = ['name'=>'Nombre', 'email'=>'Email'];
?>
<div class='col-md-12'>
    <?= $Temp->sectionTop($menu) ?>
	<?= $Temp->sectionSearch('start') ?>
		<?= $Temp->searchModal('start', $paramSelect) ?>
		<?= $Temp->searchModal('end') ?>
	<?= $Temp->sectionSearch('end') ?>

    <?= $Temp->sectionForm('start') ?>
        <?php require($menu['link'].'/'.$menu['link'].'-form.php') ?>
	<?= $Temp->sectionForm('end') ?>
</div>