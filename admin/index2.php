<?php
    require('../config-ini.php');

    $_GET['VentPadre'] = '';
    session_start();
    if (!isset($_SESSION['idUser'])) {
        echo '<script> alert("DEBE INICIAR SESIÓN"); self.location = ("../index.php"); </script>';
    }

    /*CAMPOS Y DEMÁS*/
    require("../Settings/php/FormInput-class.php");
    $Form = new FormInput();

    /*CLASE QUE CONTIENE FUNCIONES DE CONFIGURACION*/
    require('../Settings/php/FormTemplate-class.php');
    $Temp = new FormTemplate();

    if(!empty($_GET['Url'])){
        $Url=$_GET['Url'];
        $Modulo=$_GET['Modulo'];
        $Menu=$_GET['Menu'];
    }
    if(!empty($_GET['Modulo']))     {
        $Modulo = $_GET['Modulo'];
    }
    else    {
        $Modulo = '';
    }
    if(!empty($_GET['Menu']))     {
        $Menu = $_GET['Menu'];
    }
    else    {
        $Menu = '';
    }

    include("../Settings/php/configuracion_php.php");

?>
<!DOCTYPE html>
<html>

<head>
    <title>SISTEMA BASE</title>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">

    <?php llamadas_css_js() ?>
</head>

<body>
    <div class="row" style="margin-top:30px; width:100%">
        <?php
            if(!empty($Url))
                include($Url . "/$Url-view.php");
            //include($Url.".vis.php");
            /*else
            include("Busqueda.html");*/
        ?>
    </div>      
    <!--script type="text/javascript" src="../Public/js/index.js"></script-->
    <script type="text/javascript" src="../Settings/js/validations-js.js"></script>
    <script type="text/javascript" src="../Settings/js/FormConfig-js.js"></script>
    <script>
        $(document).ready(function(){
            $('[data-toggle="popover"]').popover();   
        });

        function fCerrarSesion()
        {
            swal({ title: '¡Confirmar!', text: '¿Desea cerrar sesión?', type: 'info', showCancelButton: true, closeOnConfirm: false, showLoaderOnConfirm: true, confirmButtonText: 'SI', cancelButtonText: 'NO' },function()
            {
                self.location="../Controladores/logout.php";
            });            
        }
    </script>
</body>

</html>
