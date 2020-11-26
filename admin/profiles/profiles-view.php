<?php
    $paramSelect = ['name'=>'Nombre'];
?>
<div class='col-md-12'>
    <?= $Temp->sectionTop($menu) ?>
	<?= $Temp->sectionSearch('start') ?>
		<?= $Temp->searchModal('start', $paramSelect) ?>
			<!--CAMPOS EXTRAS PARA LA MODAL-->
		<?= $Temp->searchModal('end') ?>
    <?= $Temp->sectionSearch('end') ?>
    
    <?= $Temp->sectionForm('start') ?>
        <?php require($menu['link'].'/'.$menu['link'].'-form.php') ?>
	<?= $Temp->sectionForm('end') ?>
</div>