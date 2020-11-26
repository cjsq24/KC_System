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

    $linkFolder = (!empty($_GET['link'])) ? filter_var(trim($_GET['link']),FILTER_SANITIZE_STRING) : '';

    require(RUTA_SETTINGS.'/php/Access-class.php');
    $Access = new Access();

    require(RUTA_ADMIN.'/General-class.php');
    $General = new General();
    $nav = $General->getArrAll(
        "SELECT mo.idModule, mo.name AS module, mo.idParent, men.idMenu, men.name AS menu 
        FROM menus AS men 
        INNER JOIN modules AS mo ON mo.idModule = men.idModule 
        WHERE men.link = '$linkFolder'
    ");

    $modal = false;
    $listModal = [];
?>
<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <title>AdminLTE 3 | Dashboard</title>
        <!-- Tell the browser to be responsive to screen width -->
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <!-- Font Awesome -->
        <link href="../Public/lib/css/font1.css" rel="stylesheet" type="text/css">
        <link href="../Public/lib/css/font2.css" rel="stylesheet" type="text/css">
        <link rel="stylesheet" type="text/css" href="../Public/lib/css/font-awesome.min.css">
        <!--link rel="stylesheet" href="../Public/plugins/fontawesome-free/css/all.min.css"-->
        <!-- Ionicons -->
        <!--link rel="stylesheet" href="https://code.ionicframework.com/ionicons/2.0.1/css/ionicons.min.css"-->
        <!-- Tempusdominus Bbootstrap 4 -->
        <link rel="stylesheet" href="../Public/plugins/bootstrap-4.0.0/bootstrap-4.0.0.min.css">
        <!-- Theme style -->
        <link rel="stylesheet" href="../Public/css/adminlte.css">
        <!-- overlayScrollbars -->
        <link rel="stylesheet" href="../Public/plugins/overlayScrollbars/css/OverlayScrollbars.min.css">
        <!-- Google Font: Source Sans Pro -->
        <!--link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Source+Sans+Pro:300,400,400i,700"-->
        <link rel="stylesheet" href="../Public/plugins/sweetalert/sweetalert.css">

        <link rel="stylesheet" href="../Public/plugins/select2/select2.min.css">
        <link rel="stylesheet" href="../Public/css/style.css">

        

        <script src="../Public/lib/js/jquery.min.js"></script>
        <!--script src="https://code.jquery.com/jquery-3.3.1.min.js"></script-->
        <!-- jQuery UI 1.11.4 -->
        <script src="../Public/plugins/jquery-ui/jquery-ui.min.js"></script>
        <!-- Resolve conflict in jQuery UI tooltip with Bootstrap tooltip -->
        <script src="../Public/lib/js/popper.js"></script>
        <script src="../Public/plugins/bootstrap-4.0.0/bootstrap-4.0.0.min.js"></script>
        <!--link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-datepicker/1.9.0/css/bootstrap-datepicker3.min.css"-->
    </head>

    <body class="hold-transition sidebar-mini layout-fixed">
        <div class="wrapper">

            <!-- Navbar -->
            <nav class="main-header navbar navbar-expand navbar-white navbar-light">
                <!-- Left navbar links -->
                <ul class="navbar-nav">
                    <li class="nav-item">
                        <a class="nav-link" data-widget="pushmenu" href="#"><i class="fa fa-bars"></i></a>
                    </li>
                    <li class="nav-item d-none d-sm-inline-block">
                        <a href="?link=startPage" class="nav-link">INICIO</a>
                    </li>
                    <li class="nav-item d-none d-sm-inline-block">
                        <a href="#" class="nav-link">Contact</a>
                    </li>
                </ul>

                <!-- SEARCH FORM -->
                <form class="form-inline ml-3">
                    <div class="input-group input-group-sm">
                        <input class="form-control form-control-navbar" type="search" placeholder="Search"
                            aria-label="Search">
                        <div class="input-group-append">
                            <button class="btn btn-navbar" type="submit">
                                <i class="fa fa-search"></i>
                            </button>
                        </div>
                    </div>
                </form>

                <!-- Right navbar links -->
                <ul class="navbar-nav ml-auto">
                    <!-- Messages Dropdown Menu -->
                    <li class="nav-item dropdown">
                        <a class="nav-link" data-toggle="dropdown" href="#">
                            <i class="fa fa-comments"></i>
                            <span class="badge badge-danger navbar-badge">3</span>
                        </a>
                        <div class="dropdown-menu dropdown-menu-lg dropdown-menu-right">
                            <a href="#" class="dropdown-item">
                                <!-- Message Start -->
                                <div class="media">
                                    <!--img src="dist/img/user1-128x128.jpg" alt="User Avatar" class="img-size-50 mr-3 img-circle"-->
                                    <div class="media-body">
                                        <h3 class="dropdown-item-title">
                                            Brad Diesel
                                            <span class="float-right text-sm text-danger"><i class="fa fa-star"></i></span>
                                        </h3>
                                        <p class="text-sm">Call me whenever you can...</p>
                                        <p class="text-sm text-muted"><i class="fa fa-clock mr-1"></i> 4 Hours Ago</p>
                                    </div>
                                </div>
                                <!-- Message End -->
                            </a>
                            <div class="dropdown-divider"></div>
                            <a href="#" class="dropdown-item">
                                <!-- Message Start -->
                                <div class="media">
                                    <!--img src="dist/img/user8-128x128.jpg" alt="User Avatar" class="img-size-50 img-circle mr-3"-->
                                    <div class="media-body">
                                        <h3 class="dropdown-item-title">
                                            John Pierce
                                            <span class="float-right text-sm text-muted"><i class="fa fa-star"></i></span>
                                        </h3>
                                        <p class="text-sm">I got your message bro</p>
                                        <p class="text-sm text-muted"><i class="fa fa-clock mr-1"></i> 4 Hours Ago</p>
                                    </div>
                                </div>
                                <!-- Message End -->
                            </a>
                            <div class="dropdown-divider"></div>
                            <a href="#" class="dropdown-item">
                                <!-- Message Start -->
                                <div class="media">
                                    <!--img src="dist/img/user3-128x128.jpg" alt="User Avatar" class="img-size-50 img-circle mr-3"-->
                                    <div class="media-body">
                                        <h3 class="dropdown-item-title">
                                            Nora Silvester
                                            <span class="float-right text-sm text-warning"><i
                                                    class="fa fa-star"></i></span>
                                        </h3>
                                        <p class="text-sm">The subject goes here</p>
                                        <p class="text-sm text-muted"><i class="fa fa-clock mr-1"></i> 4 Hours Ago</p>
                                    </div>
                                </div>
                                <!-- Message End -->
                            </a>
                            <div class="dropdown-divider"></div>
                            <a href="#" class="dropdown-item dropdown-footer">See All Messages</a>
                        </div>
                    </li>
                    <!-- Notifications Dropdown Menu -->
                    <li class="nav-item dropdown">
                        <a class="nav-link" data-toggle="dropdown" href="#">
                            <i class="fa fa-bell"></i>
                            <span class="badge badge-warning navbar-badge">15</span>
                        </a>
                        <div class="dropdown-menu dropdown-menu-lg dropdown-menu-right">
                            <span class="dropdown-item dropdown-header">15 Notifications</span>
                            <div class="dropdown-divider"></div>
                            <a href="#" class="dropdown-item">
                                <i class="fa fa-envelope mr-2"></i> 4 new messages
                                <span class="float-right text-muted text-sm">3 mins</span>
                            </a>
                            <div class="dropdown-divider"></div>
                            <a href="#" class="dropdown-item">
                                <i class="fa fa-users mr-2"></i> 8 friend requests
                                <span class="float-right text-muted text-sm">12 hours</span>
                            </a>
                            <div class="dropdown-divider"></div>
                            <a href="#" class="dropdown-item">
                                <i class="fa fa-file mr-2"></i> 3 new reports
                                <span class="float-right text-muted text-sm">2 days</span>
                            </a>
                            <div class="dropdown-divider"></div>
                            <a href="#" class="dropdown-item dropdown-footer">See All Notifications</a>
                        </div>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" data-widget="control-sidebar" data-slide="true" href="#">
                            <i class="fa fa-th-large"></i>
                        </a>
                    </li>
                </ul>
            </nav>
            <!-- /.navbar -->

            <!-- Main Sidebar Container -->
            <aside class="main-sidebar sidebar-dark-primary elevation-4">
                <!-- Brand Logo -->
                <a href="#" class="brand-link">
                    <!--img src="dist/img/AdminLTELogo.png" alt="AdminLTE Logo" class="brand-image img-circle elevation-3" style="opacity: .8"-->
                    <span class="brand-text font-weight-light">AdminLTE 3</span>
                </a>

                <!-- Sidebar -->
                <div class="sidebar">
                    <!-- Sidebar user panel (optional) -->
                    <div class="user-panel mt-3 pb-3 mb-3 d-flex">
                        <div class="image">
                            <!--img src="dist/img/user2-160x160.jpg" class="img-circle elevation-2" alt="User Image"-->
                        </div>
                        <div class="info">
                            <a href="#" class="d-block">Alexander Pierce</a>
                        </div>
                    </div>

                    <!-- Sidebar Menu -->
                    <nav class="mt-2">
                        <ul class="nav nav-pills nav-sidebar nav-child-indent nav-compact nav-flat flex-column" data-widget="treeview" role="menu"
                            data-accordion="false" style="font-size:15px">
                            <li class="nav-item">
                                <a href="?link=startPage" class="nav-link <?= ($linkFolder == 'startPage') ? 'active' : ''?>">
                                    <i class="fa fa-home nav-icon"></i>
                                    <p>INICIO</p>
                                </a>
                            </li>
                            <?= $Access->showMenu($_SESSION['idProfile']) ?>
                            <li class="nav-item" id="logout-li">
                                <a href="#" class="nav-link">
                                    <i class="fa fa-home nav-icon"></i>
                                    <p>CERRAR SESIÖN</p>
                                </a>
                            </li>
                        </ul>
                    </nav>
                    <!-- /.sidebar-menu -->
                </div>
                <!-- /.sidebar -->
            </aside>

            <!-- Content Wrapper. Contains page content -->
            <div class="content-wrapper">
                <!-- Content Header (Page header) -->
                <div class="content-header">
                    <div class="container-fluid">
                        <div class="row mb-2">
                            <div class="col-sm-12">
                                <nav aria-label="breadcrumb">
                                    <ol class="breadcrumb" style="background:white">
                                        <?php
                                            if ($linkFolder == 'startPage') {
                                                echo '<li class="breadcrumb-item active">INICIO</li>';
                                            }
                                            else if (!empty($nav)) {
                                            
                                                if ($nav[0]['idParent'] > 0) {
                                                    $module = $General->getArrAll("SELECT idModule, name FROM modules WHERE idModule = ".$nav[0]['idParent']);

                                                    echo '
                                                        <script>
                                                            $("#subModule-'.$nav[0]['idModule'].'-li").addClass("menu-open");
                                                            $("#subModule-'.$nav[0]['idModule'].'-a").addClass("active-subModule");
                                                            $("#module-'.$module[0]['idModule'].'-li").addClass("menu-open");
                                                            $("#module-'.$module[0]['idModule'].'-a").addClass("active");
                                                            $("#menu-'.$nav[0]['idMenu'].'-a").addClass("active");
                                                        </script>
                                                    ';

                                                    echo '<li class="breadcrumb-item"><a href="#">'.$module[0]['name'].'</a></li>';
                                                }
                                                else {
                                                    echo '
                                                        <script>
                                                            $("#module-'.$nav[0]['idModule'].'-li").addClass("menu-open");
                                                            $("#module-'.$nav[0]['idModule'].'-a").addClass("active");
                                                            $("#menu-'.$nav[0]['idMenu'].'-a").addClass("active");
                                                        </script>';
                                                }
                                            ?>
                                            <li class="breadcrumb-item"><a href="#"><?= $nav[0]['module'] ?></a></li>
                                            <li class="breadcrumb-item active"><?= $nav[0]['menu'] ?></li>
                                        <?php } ?>
                                    </ol>
                                </nav>
                            </div><!-- /.col -->
                        </div><!-- /.row -->
                    </div><!-- /.container-fluid -->
                </div>
                <!-- /.content-header -->

                <!-- Main content -->
                <section class="content">
                    <div class="container-fluid">
                        <!-- Main row -->
                        <div class="row">
                            <?php
                                    if(!empty($linkFolder)) {
                                        if ($linkFolder == 'startPage') {
                                            require($linkFolder . "/$linkFolder-view.php");
                                        }
                                        else if (file_exists($linkFolder.'/'.$linkFolder.'-view.php')) {
                                            require('../Settings/php/AccessMenu.php');
                                            require($linkFolder . "/$linkFolder-view.php");
                                        }
                                        else {
                                            echo 'Error, el fichero no existe';
                                        }
                                    }
                                    else {
                                        echo 'Personal System';
                                    }
                                //include($Url.".vis.php");
                                /*else
                                include("Busqueda.html");*/
                            ?>
                        </div>
                        <!-- /.row (main row) -->
                    </div><!-- /.container-fluid -->
                </section>
                <!-- /.content -->
            </div>
            <!-- /.content-wrapper -->
            <footer class="main-footer">
                <strong>Copyright &copy; 2014-2019 <a href="http://adminlte.io">AdminLTE.io</a>.</strong>
                All rights reserved.
                <div class="float-right d-none d-sm-inline-block">
                    <b>Version</b> 3.0.3-pre
                </div>
            </footer>

            <!-- Control Sidebar -->
            <aside class="control-sidebar control-sidebar-dark">
                <!-- Control sidebar content goes here -->
            </aside>
            <!-- /.control-sidebar -->
        </div>
        <!-- ./wrapper -->

        <script type="text/javascript" src="../Settings/js/validations-js.js"></script>
        <!--script type="text/javascript" src="../Settings/js/FormConfig-js.js"></script-->
        <script>
            $.widget.bridge('uibutton', $.ui.button);
            $(document).ready(function(){
                $('[data-toggle="popover"]').popover();
                $('.select2').select2();
                //$('.select2-container').css("width","100%");
            });

            function logout() {
                swal({ title: '¡Confirmar!', text: '¿Desea cerrar sesión?', type: 'info', showCancelButton: true, closeOnConfirm: false, showLoaderOnConfirm: true, confirmButtonText: 'SI', cancelButtonText: 'NO' },function() {
                    self.location="logout.php";
                });            
            }

            $('#logout-li').click(function() {
                logout();
            });
        </script>
        
        <!-- overlayScrollbars -->
        <script src="../Public/plugins/overlayScrollbars/js/jquery.overlayScrollbars.min.js"></script>
        <script src="../Public/plugins/sweetalert/sweetalert.js"></script>
        <!-- AdminLTE App -->
        <script src="../Public/js/adminlte.js"></script>
        <!-- AdminLTE for demo purposes -->
        <script src="../Public/js/demo.js"></script>
        
        <script src="../Public/plugins/select2/select2.min.js"></script>
        <link rel="stylesheet" href="../Public/plugins/gijgo/gijgo.min.css">
        <script src="../Public/plugins/gijgo/gijgo.min.js"></script>
        <!--script src="https://unpkg.com/gijgo@1.9.13/js/gijgo.min.js" type="text/javascript"></script>
        <link href="https://unpkg.com/gijgo@1.9.13/css/gijgo.min.css" rel="stylesheet" type="text/css" /-->
    </body>

</html>