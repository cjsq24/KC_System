<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="description" content="">
        <meta name="author" content="">

        <title>SISTEMA PROAREPA</title>
        <link rel="shortcut icon" href="Public/img/logo/proarepalogo.png" type="image/png" />
        <!-- Bootstrap Core CSS -->
        <link rel="stylesheet" type="text/css" href="Public/lib/css/bootstrap.css">
        <link rel="stylesheet" type="text/css" href="Public/lib/css/font-awesome.min.css">
        <link rel="stylesheet" type="text/css" href="Public/lib/css/lightbox.css">
        <!-- Fonts -->
        <link href='Public/lib/css/font1.css' rel='stylesheet' type='text/css'>
        <link href='Public/lib/css/font2.css' rel='stylesheet' type='text/css'>
        <link href="Public/lib/css/fonts-social.css" rel="stylesheet" type='text/css'>
        <!-- Custom CSS -->
        <link rel="stylesheet" type="text/css" href="Public/css/stylehome.css">
        <link rel="stylesheet" href="Public/plugins/sweetalert/sweetalert.css">
    </head>
    <body>
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-body">
                    <span class="col-lg-12 col-md-12 col-sm-12 col-xs-12 title">
                        <h3><img src="Public/img/logo/proarepalogo.png" style="width:40px;"> Iniciar Sesión</h3>
                    </span>

                    <form name="Form" id="Form" class="form-horizontal" role="form" method="post" autocomplete="off">
                        <div class="input-group">
                            <label class="sr-only">Usuario</label>
                            <span class="input-group-addon" id="basic-addon1"><h6 class="glyphicon glyphicon-user"></h6></span>
                            <input type="text" name="email" id="email" class="form-control" maxlength="40" placeholder="Usuario" />
                        </div>

                        <div class="input-group">
                            <label class="sr-only">Usuario</label>
                            <span class="input-group-addon" id="basic-addon1"><h6 class="glyphicon glyphicon-lock"></h6></span>
                            <input type="password" name="password" id="password" class="form-control" maxlength="20" placeholder="Contraseña"/>
                        </div>

                        <div class="group-center">
                            <div class="form-group">
                                <button type="button" id="login-btn" class="btn boton-6">Acceder</button>
                            </div>
                            <a id="Olvido"><p><small>¿Olvido su contraseña?</small></p></a>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </body>
    <script type="text/javascript" src="Public/lib/js/jquery.min.js"></script>
    <script type="text/javascript" src="Public/lib/js/bootstrap.min.js"></script>
    <script type="text/javascript" src="Public/lib/js/lightbox-plus-jquery.js"></script>
    <script type="text/javascript" src="Public/plugins/sweetalert/sweetalert.js"></script>
    <script type="text/javascript" src="Public/js/formularios/Homepage.js.js"></script>
</html>
