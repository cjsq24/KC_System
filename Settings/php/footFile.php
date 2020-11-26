<?php
    require(RUTA_ADMIN.'/'.$menu['link'].'/'.$menu['link'].'-js.php');
    if (!$modal) {
        echo '<script src="../Settings/js/FormConfig-js.js"></script>';
    }
    require(RUTA_SETTINGS.'/php/accessModal.php');
?>